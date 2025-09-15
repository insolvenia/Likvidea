/*
  # Convert Lead To Deal

  1. Function
    - `convertLeadToDeal(leadId: string, options: { requestId?, dealValue?, priority? })`
    - Creates/updates Deal via upsertDealFromLead
    - Sets Lead.status = "qualified"
    - Runs sendToAutomation("Deal", deal)
    - Returns { lead, deal }

  2. Usage
    - POST /functions/v1/convert-lead-to-deal
    - Body: { "leadId": "lead123", "options": { "requestId": "req123", "dealValue": 100000, "priority": "PRIO" } }
    - Returns: { "lead": Lead, "deal": Deal }
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function createHmacSignature(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sendToAutomation(entity: string, data: any): Promise<boolean> {
  const webhookUrl = Deno.env.get('AUTOMATION_WEBHOOK_URL');
  const webhookSecret = Deno.env.get('WEBHOOK_SECRET');

  if (!webhookUrl || !webhookSecret) {
    console.warn('Missing webhook configuration, skipping automation');
    return false;
  }

  const payload = {
    entity,
    data,
    site: 'likvidea',
    ts: new Date().toISOString()
  };

  const payloadString = JSON.stringify(payload);
  const signature = await createHmacSignature(payloadString, webhookSecret);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
        'User-Agent': 'Likvidea-Webhook/1.0'
      },
      body: payloadString,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log(`Successfully sent ${entity} to automation:`, response.status);
      return true;
    } else {
      console.error(`Failed to send ${entity} to automation:`, response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error(`Error sending ${entity} to automation:`, error.message);
    return false;
  }
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

    const { leadId, options = {} } = await req.json();

    // Validate required fields
    if (!leadId) {
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

    // Generate requestId if not provided
    const requestId = options.requestId || `deal_${leadId}_${Date.now()}`;

    // Create/update deal via upsertDealFromLead logic
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

    // Prepare deal data
    const dealData = {
      request_id: requestId,
      converted_at: new Date().toISOString(),
      lead_id: leadId,
      company_name: lead.company_name,
      email: lead.email,
      deal_value: options.dealValue || null,
      priority: options.priority || 'NORMAL',
      status: 'open',
      fee_type: 'none',
      fee_amount: 0,
      currency: 'SEK',
      payout_status: 'pending'
    };

    // Create deal
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

    // Update lead status to qualified
    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update({ status: 'qualified' })
      .eq('lead_id', leadId)
      .select()
      .single();

    if (updateError) {
      console.error('Failed to update lead status:', updateError);
      // Continue anyway, deal was created successfully
    }

    // Send to automation (don't fail if this fails)
    try {
      await sendToAutomation('Deal', deal);
    } catch (error) {
      console.error('Failed to send deal to automation:', error);
      // Continue anyway
    }

    return new Response(
      JSON.stringify({ 
        lead: updatedLead || lead, 
        deal 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Error converting lead to deal:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});