// Deno Edge Function – JWT-protected save-only upsert on lead_id
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Get environment variables with fallbacks
    const SUPABASE_URL =
      Deno.env.get("SUPABASE_URL") || Deno.env.get("SUPABASE_PROJECT_URL");
    const SERVICE_ROLE =
      Deno.env.get("SUPABASE_SERVICE_ROLE") ||
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return json({ error: "Saknar SUPABASE_URL eller SERVICE_ROLE-nyckel i Secrets." }, 500);
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { 
      auth: { persistSession: false } 
    });

    // Parse request body
    let body: any = {};
    try { 
      body = await req.json(); 
    } catch { 
      /* empty body is ok for updates with leadId */ 
    }

    // leadId: use provided or generate new one
    let leadId: string = body.leadId;
    if (!leadId) {
      const rand = Math.random().toString(36).slice(2, 8);
      leadId = `lead_${Date.now()}_${rand}`;
    }

    // Check if lead already exists
    const { data: existing, error: selErr } = await supabase
      .from("leads")
      .select("lead_id, raw_payload, services, status, prio, email, first_name, company_name")
      .eq("lead_id", leadId)
      .maybeSingle();
    
    if (selErr) return json({ error: `DB-fel (select): ${selErr.message}` }, 500);

    // Validation for new records
    if (!existing) {
      if (!body?.email) return json({ error: "E-post krävs." }, 400);
      if (!body?.companyName) return json({ error: "Företagets namn krävs." }, 400);
      if (!body?.contactName) return json({ error: "Kontaktperson krävs." }, 400);
      if (!body?.message) return json({ error: "Meddelande krävs." }, 400);
      if (body?.gdprConsent !== true) return json({ error: "GDPR-samtycke krävs." }, 400);
      if (!body?.orgNumber) return json({ error: "Organisationsnummer krävs." }, 400);
      
      // Validate org number format (10-12 digits)
      const orgNumberDigits = body.orgNumber.replace(/\D/g, '');
      if (orgNumberDigits.length < 10 || orgNumberDigits.length > 12) {
        return json({ error: "Organisationsnummer ska vara 10-12 siffror (ex. 559123-4567)." }, 400);
      }
    }

    // Merge payload (new data wins)
    const mergedPayload = { ...(existing?.raw_payload ?? {}), ...(body ?? {}) };
    const services = body?.caseType ? [body.caseType] : existing?.services ?? null;

    // Prepare row data
    const row = {
      lead_id: leadId,
      created_at: existing?.created_at || new Date().toISOString(),
      status: existing?.status ?? "received",
      prio: body?.prio ?? existing?.prio ?? "normal",
      company_name: body?.companyName ?? existing?.company_name ?? null,
      org_number: body?.orgNumber ?? null,
      org_number_normalized: body?.orgNumber ? body.orgNumber.replace(/\D/g, '') : null,
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
      consent_share_with_partners: body?.consentShareWithPartners ?? false,
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
        updated_at: new Date().toISOString()
      },
    };

    // Upsert the lead
    const { data: up, error: upErr } = await supabase
      .from("leads")
      .upsert(row, { onConflict: "lead_id" })
      .select("lead_id")
      .single();

    if (upErr) return json({ error: `DB-fel (upsert): ${upErr.message}` }, 500);
    
    return json({ leadId: up.lead_id });
  } catch (e: any) {
    console.error("submit-lead error:", e);
    return json({ error: e?.message || String(e) }, 500);
  }
});