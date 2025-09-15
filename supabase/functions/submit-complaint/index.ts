/*
  # Submit Complaint

  1. Function
    - `submitComplaint(payload: json) -> Complaint`
    - Maps fields from payload according to Complaint model
    - complaintId auto-generated if not provided
    - Validates required fields: customer_email, message, gdprConsent
    - Saves to complaints table
    - Returns complaint record

  2. Usage
    - POST /functions/v1/submit-complaint
    - Body: Complaint payload with required fields
    - Returns: { "complaintId": string }
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

    const payload = await req.json();

    // Validate required fields
    if (!payload.email) {
      return new Response(
        JSON.stringify({ error: "E-post krävs" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!payload.message) {
      return new Response(
        JSON.stringify({ error: "Meddelande krävs" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (payload.gdprConsent !== true) {
      return new Response(
        JSON.stringify({ error: "GDPR-samtycke krävs" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return new Response(
        JSON.stringify({ error: "Ogiltig e-postadress" }),
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

    // Generate complaint ID if not provided
    let complaintId = payload.complaintId;
    if (!complaintId) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2, 8);
      complaintId = `complaint_${timestamp}_${random}`;
    }

    // Prepare complaint data
    const complaintData = {
      complaint_id: complaintId,
      created_at: new Date().toISOString(),
      customer_name: payload.name || null,
      customer_email: payload.email,
      phone: payload.phone || null,
      message: payload.message,
      status: 'new',
      meta: {
        gdpr_consent: payload.gdprConsent,
        source_origin: payload.sourceOrigin || 'klagomal-page',
        user_agent: req.headers.get("user-agent"),
        ip: req.headers.get("x-forwarded-for") || null,
        submitted_at: new Date().toISOString()
      }
    };

    // Insert complaint
    const { data: complaint, error } = await supabase
      .from('complaints')
      .upsert(complaintData, {
        onConflict: 'complaint_id',
        ignoreDuplicates: false
      })
      .select('complaint_id')
      .single();

    if (error) {
      console.error('Error inserting complaint:', error);
      return new Response(
        JSON.stringify({ error: `Databasfel: ${error.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ complaintId: complaint.complaint_id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Error in submit-complaint:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internt serverfel' }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});