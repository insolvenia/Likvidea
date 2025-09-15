/*
  # Normalize Services

  1. Function
    - `normalizeServices(input) -> string[]`
    - If input is array → trim all values
    - If input is string → split on comma, trim, filter empty

  2. Usage
    - POST /functions/v1/normalize-services
    - Body: { "services": "leasing, factoring, loan" }
    - Returns: { "normalized": ["leasing", "factoring", "loan"] }
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function normalizeServices(input: any): string[] {
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

    const { services } = await req.json();
    const normalized = normalizeServices(services);

    return new Response(
      JSON.stringify({ normalized }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});