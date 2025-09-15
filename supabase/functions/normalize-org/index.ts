/*
  # Normalize Organization Number

  1. Function
    - `normalizeOrg(org: string) -> string`
    - Returns only digits from organization number
    - Example: "559090-1333" → "5590901333"

  2. Usage
    - POST /functions/v1/normalize-org
    - Body: { "org": "559090-1333" }
    - Returns: { "normalized": "5590901333" }
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function normalizeOrg(org: string): string {
  if (!org || typeof org !== 'string') {
    return '';
  }
  return org.replace(/\D/g, '');
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

    const { org } = await req.json();
    const normalized = normalizeOrg(org);

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