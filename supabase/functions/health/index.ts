// Deno Edge Function – JWT-protected health check
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
};

serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }
  
  // Check if required environment variables exist
  const ok =
    !!(Deno.env.get("SUPABASE_URL") || Deno.env.get("SUPABASE_PROJECT_URL")) &&
    !!(Deno.env.get("SUPABASE_SERVICE_ROLE") ||
       Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
       Deno.env.get("SERVICE_ROLE_KEY"));
  
  return new Response(JSON.stringify({ ok }), {
    headers: { "Content-Type": "application/json", ...CORS },
  });
});