/*
  # Upsert Deal From Lead

  1. Function
    - `upsertDealFromLead(input: { requestId, leadId, fields? }) -> Deal`
    - REQUIRED: requestId, leadId
    - Fetches Lead via leadId; if found, prefills: companyName, email
    - Upsert on requestId (unique)
    - Allows partial updates (fields), but respects validation (feeAmount, feeType)
    - Returns Deal

  2. Usage
    - POST /functions/v1/upsert-deal-from-lead
    - Body: { "requestId": "req123", "leadId": "lead123", "fields": {...} }
    - Returns: { "deal": Deal }
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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

    const { requestId, leadId, fields = {} } = await req.json();

    // Validate required fields
    if (!requestId || !leadId) {
      return new Response(
        JSON.stringify({ error: "requestId and leadId are required" }),
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

    // Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select()
      .eq('lead_id', leadId)
      .single();

    if (leadError) {
      return new Response(
        JSON.stringify({ error: `Lead not found: ${leadError.message}` }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare deal data with lead prefill
    const dealData = {
      request_id: requestId,
      converted_at: fields.convertedAt || new Date().toISOString(),
      lead_id: leadId,
      company_name: fields.companyName || lead.company_name,
      email: fields.email || lead.email,
      assigned_buyer: fields.assignedBuyer || null,
      deal_value: fields.dealValue || null,
      fee_type: fields.feeType || 'none',
      fee_amount: fields.feeAmount || 0,
      currency: fields.currency || 'SEK',
      payout_status: fields.payoutStatus || 'pending',
      notes: fields.notes || null,
      description: fields.description || null,
      target_group: fields.targetGroup || null,
      monthly_volume: fields.monthlyVolume || null,
      priority: fields.priority || 'NORMAL',
      uc_status: fields.ucStatus || null,
      status: fields.status || 'open',
      meta: fields.meta || null
    };

    // Validate fee constraints
    if (dealData.fee_amount < 0) {
      return new Response(
        JSON.stringify({ error: "feeAmount must be >= 0" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (dealData.fee_type === 'percent' && (dealData.fee_amount < 0 || dealData.fee_amount > 100)) {
      return new Response(
        JSON.stringify({ error: "feeAmount must be between 0-100 for percent fee type" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Upsert deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .upsert(dealData, {
        onConflict: 'request_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (dealError) {
      throw dealError;
    }

    return new Response(
      JSON.stringify({ deal }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Error upserting deal:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});