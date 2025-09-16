// supabase/functions/lead-submit/index.ts
// Deno Edge Function – upsert + mail via Resend
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@3";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
};

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { 
    status: s, 
    headers: { "Content-Type": "application/json", ...CORS } 
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  try {
    // --- ENV & clients ---
    const SUPABASE_URL =
      Deno.env.get("SUPABASE_URL") || Deno.env.get("SUPABASE_PROJECT_URL");
    const SERVICE_ROLE =
      Deno.env.get("SUPABASE_SERVICE_ROLE") ||
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return json({ error: "Saknar SUPABASE_URL eller SERVICE_ROLE-nyckel i Secrets." }, 500);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM_EMAIL = Deno.env.get("MAIL_FROM") || "Likvidea <no-reply@likvidea.se>";
    const INFO_EMAIL = Deno.env.get("MAIL_TO_INFO") || "info@likvidea.se";
    const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

    // --- Request body ---
    let body: any = {};
    try { body = await req.json(); } catch {}

    // leadId
    let leadId: string = body.leadId;
    if (!leadId) {
      const rand = Math.random().toString(36).slice(2, 8);
      leadId = `lead_${Date.now()}_${rand}`;
    }

    // Finns lead?
    const { data: existing, error: selErr } = await supabase
      .from("leads")
      .select("lead_id, raw_payload, services, status, prio, email, first_name, company_name, meta, created_at")
      .eq("lead_id", leadId)
      .maybeSingle();
    if (selErr) return json({ error: `DB-fel (select): ${selErr.message}` }, 500);

    // Grundvalidering vid nya leads
    if (!existing) {
      if (!body?.email) return json({ error: "E-post krävs." }, 400);
      if (!body?.companyName) return json({ error: "Företagets namn krävs." }, 400);
      if (!body?.contactName) return json({ error: "Kontaktperson krävs." }, 400);
      if (!body?.message) return json({ error: "Meddelande krävs." }, 400);
      if (body?.gdprConsent !== true) return json({ error: "GDPR-samtycke krävs." }, 400);
      if (!body?.orgNumber) return json({ error: "Organisationsnummer krävs." }, 400);

      const orgNumberDigits = String(body.orgNumber).replace(/\D/g, "");
      if (orgNumberDigits.length < 10 || orgNumberDigits.length > 12) {
        return json({ error: "Organisationsnummer ska vara 10-12 siffror (ex. 559123-4567)." }, 400);
      }
    }

    // Merge payload
    const mergedPayload = { ...(existing?.raw_payload ?? {}), ...(body ?? {}) };
    const services = body?.caseType ? [body.caseType] : existing?.services ?? null;

    // Row
    const row = {
      lead_id: leadId,
      created_at: existing?.created_at || new Date().toISOString(),
      status: existing?.status ?? "received",
      prio: body?.prio ?? existing?.prio ?? "normal",
      company_name: body?.companyName ?? existing?.company_name ?? null,
      org_number: body?.orgNumber ?? null,
      org_number_normalized: body?.orgNumber ? String(body.orgNumber).replace(/\D/g, "") : null,
      consent_share_with_partners: body?.consentShareWithPartners ?? existing?.consent_share_with_partners ?? false,
      company_type: body?.companyType ?? null,
      first_name: body?.contactName ?? existing?.first_name ?? null,
      last_name: body?.lastName ?? null,
      email: body?.email ?? existing?.email ?? null,
      phone: body?.phone ?? null,
      industry: body?.industry ?? null,
      revenue_range: body?.revenueRange ?? null,
      timeframe: body?.timeframe ?? null,
      services,
      intent_note: body?.message ?? null,
      files_count: body?.filesCount ?? 0,
      company_representation: body?.companyRepresentation ?? false,
      gdpr_consent: body?.gdprConsent ?? false,
      source_origin: body?.sourceOrigin ?? null,
      role: body?.role ?? null,
      raw_payload: mergedPayload,
      payload: mergedPayload,
      meta: {
        ...(existing?.meta ?? {}),
        source_origin: body?.sourceOrigin ?? null,
        userAgent: req.headers.get("user-agent"),
        ip: req.headers.get("x-forwarded-for") ?? null,
        updated_at: new Date().toISOString(),
      },
    };

    // Upsert
    const { data: up, error: upErr } = await supabase
      .from("leads")
      .upsert(row, { onConflict: "lead_id" })
      .select("lead_id, email, first_name, company_name")
      .single();

    if (upErr) return json({ error: `DB-fel (upsert): ${upErr.message}` }, 500);

    // --- E-POST: intern notis + (valfritt) bekräftelse till avsändare ---
    let emailSent = false;
    let emailError: string | null = null;

    // Skapa mailinnehåll
    const subject = `Nytt lead (${up.lead_id}) – ${body?.companyName ?? "-"}`;
    const html = `
      <h2>Nytt lead via formulär</h2>
      <p><b>Lead-ID:</b> ${up.lead_id}</p>
      <p><b>Företag:</b> ${body?.companyName ?? "-"}</p>
      <p><b>Kontakt:</b> ${body?.contactName ?? "-"}</p>
      <p><b>E-post:</b> ${body?.email ?? "-"}</p>
      <p><b>Telefon:</b> ${body?.phone ?? "-"}</p>
      <p><b>Org.nr:</b> ${body?.orgNumber ?? "-"}</p>
      <p><b>Ärendetype:</b> ${body?.caseType ?? "-"}</p>
      <p><b>Meddelande:</b><br/>${String(body?.message ?? "-").replace(/\n/g, "<br/>")}</p>
      <hr/>
      <p style="font-size:12px;color:#667">
        Källa: ${body?.sourceOrigin ?? "form"} • Tid: ${new Date().toLocaleString("sv-SE")}
      </p>
    `;
    const text = [
      `Nytt lead via formulär`,
      `Lead-ID: ${up.lead_id}`,
      `Företag: ${body?.companyName ?? "-"}`,
      `Kontakt: ${body?.contactName ?? "-"}`,
      `E-post: ${body?.email ?? "-"}`,
      `Telefon: ${body?.phone ?? "-"}`,
      `Org.nr: ${body?.orgNumber ?? "-"}`,
      `Ärendetyp: ${body?.caseType ?? "-"}`,
      `Meddelande:\n${body?.message ?? "-"}`,
      `Källa: ${body?.sourceOrigin ?? "form"} • Tid: ${new Date().toLocaleString("sv-SE")}`,
    ].join("\n");

    try {
      if (!resend) throw new Error("RESEND_API_KEY saknas i Secrets.");

      // 1) Intern notis till info@likvidea.se
      await resend.emails.send({
        from: FROM_EMAIL,            // ex "Likvidea <no-reply@likvidea.se>"
        to: [INFO_EMAIL],            // "info@likvidea.se"
        subject,
        html,
        text,
        reply_to: body?.email || undefined, // så ni kan svara direkt
      });

      // 2) Bekräftelse till avsändaren (valfritt)
      if (body?.email) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [body.email],
          subject: `Tack för din förfrågan – ärende ${up.lead_id}`,
          html: `
            <p>Hej ${body?.contactName ?? ""},</p>
            <p>Tack för din förfrågan till Likvidea. Ditt ärende-ID är <b>${up.lead_id}</b>.</p>
            <p>Vi återkommer inom kort.</p>
            <hr/>
            <p><b>Sammanfattning:</b></p>
            ${html}
          `,
          text: `Tack för din förfrågan. Ärende-ID: ${up.lead_id}\n\n${text}`,
        });
      }

      emailSent = true;
    } catch (err) {
      console.error("Email error:", err);
      emailError = (err as Error)?.message ?? String(err);
    }

    return json({ leadId: up.lead_id, emailSent, emailError: emailError ?? undefined });
  } catch (e: any) {
    console.error("submit-lead error:", e);
    return json({ error: e?.message || String(e) }, 500);
  }
});
