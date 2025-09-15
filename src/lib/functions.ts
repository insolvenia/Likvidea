/**
 * Functions URL configuration with fallback logic
 */
function getFunctionsBaseUrl(): string {
  // Try environment variable first
  const envUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim();
  }

  // Fallback: derive from SUPABASE_URL by changing domain
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl);
      // Change supabase.co to functions.supabase.co
      if (url.hostname.endsWith('.supabase.co')) {
        const projectRef = url.hostname.split('.')[0];
        return `https://${projectRef}.functions.supabase.co`;
      }
    } catch (error) {
      console.warn('Failed to parse SUPABASE_URL for functions fallback:', error);
    }
  }

  // Final fallback for this specific project
  const defaultUrl = 'https://dlxufeavadqgndtgoouz.functions.supabase.co';
  console.warn(`Using default functions URL: ${defaultUrl}. Set VITE_SUPABASE_FUNCTIONS_URL for production.`);
  return defaultUrl;
}

export const FUNCTIONS_BASE_URL = getFunctionsBaseUrl();

/**
 * Submit lead data to Supabase Edge Function
 */
export async function submitLead(payload: any): Promise<{ leadId: string }> {
  if (!FUNCTIONS_BASE_URL) {
    throw new Error('Saknar funktions-URL. Sätt VITE_SUPABASE_FUNCTIONS_URL eller kontrollera projektref.');
  }

  const url = `${FUNCTIONS_BASE_URL}/submit-lead`;
  
  // Get anon key for JWT authentication
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error('Saknar VITE_SUPABASE_ANON_KEY för autentisering.');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // JWT authentication headers (required)
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey
      },
      body: JSON.stringify(payload)
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Server response error: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      // Show exact error from function, not generic message
      throw new Error(data?.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Re-throw with original message to preserve function errors
    throw error;
  }
}

/**
 * Submit complaint data to Supabase Edge Function
 */
export async function submitComplaint(payload: any): Promise<{ complaintId: string }> {
  if (!FUNCTIONS_BASE_URL) {
    throw new Error('Saknar funktions-URL. Sätt VITE_SUPABASE_FUNCTIONS_URL eller kontrollera projektref.');
  }

  const url = `${FUNCTIONS_BASE_URL}/submit-complaint`;
  
  // Get anon key for JWT authentication
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error('Saknar VITE_SUPABASE_ANON_KEY för autentisering.');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // JWT authentication headers (required)
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey
      },
      body: JSON.stringify(payload)
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Server response error: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      // Show exact error from function, not generic message
      throw new Error(data?.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Re-throw with original message to preserve function errors
    throw error;
  }
}

/**
 * Health check for Edge Functions
 */
export async function checkFunctionsHealth(): Promise<{ ok: boolean }> {
  if (!FUNCTIONS_BASE_URL) {
    throw new Error('Saknar funktions-URL. Sätt VITE_SUPABASE_FUNCTIONS_URL eller kontrollera projektref.');
  }

  const url = `${FUNCTIONS_BASE_URL}/health`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { ok: false };
  }
}