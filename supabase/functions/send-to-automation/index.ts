/*
  # Send To Automation

  1. Function
    - `sendToAutomation(entity: "Lead" | "Deal", data: json)`
    - Reads env: AUTOMATION_WEBHOOK_URL, WEBHOOK_SECRET
    - POST application/json with body: { entity, data, site: "likvidea", ts: nowISO }
    - Signs with HMAC-SHA256(body, WEBHOOK_SECRET) in header `X-Signature`
    - Timeout 10s, retry 2 times with exponential backoff
    - On error: log and mark data.meta.integrationError=true (if possible), but don't throw error to client

  2. Usage
    - POST /functions/v1/send-to-automation
    - Body: { "entity": "Lead", "data": {...} }
    - Returns: { "success": true, "sent": true/false }
*/

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

async function sendWithRetry(url: string, options: RequestInit, maxRetries: number = 2): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
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

    const { entity, data } = await req.json();

    // Validate input
    if (!entity || !['Lead', 'Deal'].includes(entity)) {
      return new Response(
        JSON.stringify({ error: "entity must be 'Lead' or 'Deal'" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: "data is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get environment variables
    const webhookUrl = Deno.env.get('AUTOMATION_WEBHOOK_URL');
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET');

    if (!webhookUrl || !webhookSecret) {
      console.warn('Missing webhook configuration, skipping automation');
      return new Response(
        JSON.stringify({ success: true, sent: false, reason: 'Missing webhook configuration' }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare payload
    let payload;
    
    if (entity === 'Lead') {
      payload = {
        entity,
        site: 'likvidea',
        ts: new Date().toISOString(),
        data,
        emailTemplates: {
          internal: {
            subject: `Ny lead – ${data.companyName || 'Okänt företag'} (${(data.services || []).join(', ')})`,
            text: `Lead ${data.leadId} från ${data.companyName || 'Okänt företag'} har kommit in.\n\nKontakt: ${data.firstName} ${data.lastName}\nE-post: ${data.email}\nTelefon: ${data.phone}\nBransch: ${data.industry}\nOmsättning: ${data.revenueRange}\nTjänster: ${(data.services || []).join(', ')}\nTidshorisont: ${data.timeframe}\n\nNotering: ${data.intentNote || 'Ingen notering'}\n\nOrganisationsnummer: ${data.orgNumber}\nKälla: ${data.sourceOrigin}`,
            html: `<h1>Ny lead</h1>
              <p><strong>Lead ID:</strong> ${data.leadId}</p>
              <p><strong>Företag:</strong> ${data.companyName || 'Okänt företag'}</p>
              <p><strong>Kontakt:</strong> ${data.firstName} ${data.lastName}</p>
              <p><strong>E-post:</strong> ${data.email}</p>
              <p><strong>Telefon:</strong> ${data.phone}</p>
              <p><strong>Bransch:</strong> ${data.industry}</p>
              <p><strong>Omsättning:</strong> ${data.revenueRange}</p>
              <p><strong>Tjänster:</strong> ${(data.services || []).join(', ')}</p>
              <p><strong>Tidshorisont:</strong> ${data.timeframe}</p>
              <p><strong>Notering:</strong> ${data.intentNote || 'Ingen notering'}</p>
              <p><strong>Organisationsnummer:</strong> ${data.orgNumber}</p>
              <p><strong>Källa:</strong> ${data.sourceOrigin}</p>`
          },
          lead: {
            subject: "Tack – vi har mottagit din förfrågan",
            text: `Hej ${data.firstName},\n\nTack för din förfrågan till Likvidea!\n\nVi har mottagit din förfrågan om ${(data.services || []).join(', ')} för ${data.companyName}.\n\nDitt referensnummer: ${data.leadId}\n\nVi kommer att granska din förfrågan och återkomma till dig inom kort med lämpliga finansieringsalternativ från våra partners.\n\nHar du frågor kan du kontakta oss på info@likvidea.se eller 076-0099044.\n\nMed vänliga hälsningar,\nLikvidea-teamet`,
            html: `<h1>Tack för din förfrågan!</h1>
              <p>Hej ${data.firstName},</p>
              <p>Tack för din förfrågan till Likvidea!</p>
              <p>Vi har mottagit din förfrågan om <strong>${(data.services || []).join(', ')}</strong> för <strong>${data.companyName}</strong>.</p>
              <p><strong>Ditt referensnummer:</strong> ${data.leadId}</p>
              <p>Vi kommer att granska din förfrågan och återkomma till dig inom kort med lämpliga finansieringsalternativ från våra partners.</p>
              <p>Har du frågor kan du kontakta oss på <a href="mailto:info@likvidea.se">info@likvidea.se</a> eller <a href="tel:076-0099044">076-0099044</a>.</p>
              <p>Med vänliga hälsningar,<br>Likvidea-teamet</p>`
          }
        }
      };
    } else if (entity === 'Deal') {
      payload = {
        entity,
        site: 'likvidea',
        ts: new Date().toISOString(),
        data
      };
    } else {
      payload = {
        entity,
        site: 'likvidea',
        ts: new Date().toISOString(),
        data
      };
    }

    const payloadString = JSON.stringify(payload);
    const signature = await createHmacSignature(payloadString, webhookSecret);

    try {
      // Send to automation webhook
      const response = await sendWithRetry(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': `sha256=${signature}`,
          'User-Agent': 'Likvidea-Webhook/1.0'
        },
        body: payloadString
      });

      console.log(`Successfully sent ${entity} to automation:`, response.status);
      
      return new Response(
        JSON.stringify({ success: true, sent: true, status: response.status }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error(`Failed to send ${entity} to automation:`, error.message);
      
      // Try to mark integration error in data if possible
      // This would require updating the database record, but we'll just log for now
      console.warn(`Integration error for ${entity}:`, data.id || data.leadId || data.requestId);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          sent: false, 
          error: error.message,
          reason: 'Webhook delivery failed'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error('Error in send-to-automation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});