/*
  # Upsert Lead

  1. Function
    - `upsertLead(payload: json) -> Lead`
    - Maps fields from payload according to Lead model
    - leadId REQUIRED, createdAt REQUIRED (defaults to now())
    - Upsert key: (leadId, createdAt) if possible, otherwise leadId alone
    - Sets orgNumberNormalized = normalizeOrg(orgNumber)
    - services = normalizeServices(payload.services)
    - Saves raw payload in rawPayload
    - Returns Lead record

  2. Usage
    - POST /functions/v1/upsert-lead
    - Body: Lead payload with required fields
    - Returns: { "lead": Lead }
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function normalizeOrg(org: string): string {
  if (!org || typeof org !== 'string') {
    return '';
  }
  return org.replace(/\D/g, '');
}

function normalizeServices(input: any): string[] {
  if (!input) {
    return [];
  }

  if (Array.isArray(input)) {
    return input
      .map(item => typeof item === 'string' ? item.trim() : String(item).trim())
      .filter(item => item.length > 0);
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  return [];
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const payload = await req.json();

    // Validate required fields
    if (!payload.leadId) {
      return new Response(
        JSON.stringify({ error: "leadId is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Prepare lead data
    const leadData = {
      lead_id: payload.leadId,
      created_at: payload.createdAt || new Date().toISOString(),
      status: payload.status || 'received',
      company_name: payload.companyName || null,
      org_number: payload.orgNumber || null,
      org_number_normalized: payload.orgNumber ? normalizeOrg(payload.orgNumber) : null,
      company_type: payload.companyType || null,
      first_name: payload.firstName || null,
      last_name: payload.lastName || null,
      email: payload.email,
      phone: payload.phone || null,
      industry: payload.industry || null,
      revenue_range: payload.revenueRange || null,
      timeframe: payload.timeframe || null,
      services: normalizeServices(payload.services),
      intent_note: payload.intentNote || null,
      files_count: payload.filesCount || 0,
      consent_share_with_partners: payload.consentShareWithPartners || false,
      company_representation: payload.companyRepresentation || false,
      gdpr_consent: payload.gdprConsent || false,
      source_origin: payload.sourceOrigin || null,
      role: payload.role || null,
      prio: payload.prio || 'normal',
      raw_payload: payload
    };

    // Upsert lead
    const { data: lead, error } = await supabase
      .from('leads')
      .upsert(leadData, {
        onConflict: 'lead_id,created_at',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      // If unique constraint fails, try upsert by lead_id only
      if (error.code === '23505') {
        const { data: existingLead, error: selectError } = await supabase
          .from('leads')
          .select()
          .eq('lead_id', payload.leadId)
          .single();

        if (!selectError && existingLead) {
          const { data: updatedLead, error: updateError } = await supabase
            .from('leads')
            .update(leadData)
            .eq('lead_id', payload.leadId)
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }

          return new Response(
            JSON.stringify({ lead: updatedLead }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
      throw error;
    }

    return new Response(
      JSON.stringify({ lead }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Error upserting lead:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});