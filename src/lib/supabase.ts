import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const leadService = {
  // Create or update a lead using the upsert function
  async upsertLead(leadData: Database['public']['Tables']['leads']['Insert']) {
    const { data, error } = await supabase.rpc('upsert_lead', {
      p_lead_id: leadData.lead_id,
      p_created_at: leadData.created_at || new Date().toISOString(),
      p_status: leadData.status || 'received',
      p_company_name: leadData.company_name,
      p_org_number: leadData.org_number,
      p_company_type: leadData.company_type,
      p_first_name: leadData.first_name,
      p_last_name: leadData.last_name,
      p_email: leadData.email,
      p_phone: leadData.phone,
      p_industry: leadData.industry,
      p_revenue_range: leadData.revenue_range,
      p_timeframe: leadData.timeframe,
      p_services: leadData.services,
      p_intent_note: leadData.intent_note,
      p_files_count: leadData.files_count || 0,
      p_consent_share_with_partners: leadData.consent_share_with_partners || false,
      p_company_representation: leadData.company_representation || false,
      p_gdpr_consent: leadData.gdpr_consent,
      p_source_origin: leadData.source_origin,
      p_role: leadData.role,
      p_prio: leadData.prio,
      p_raw_payload: leadData.raw_payload
    });

    if (error) throw error;
    return data;
  },

  // Get leads with filtering and pagination
  async getLeads(filters?: {
    status?: string;
    email?: string;
    orgNumber?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.email) {
      query = query.ilike('email', `%${filters.email}%`);
    }
    if (filters?.orgNumber) {
      query = query.eq('org_number_normalized', filters.orgNumber.replace(/\D/g, ''));
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get a single lead by ID
  async getLeadById(leadId: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('lead_id', leadId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update lead status
  async updateLeadStatus(leadId: string, status: Database['public']['Tables']['leads']['Row']['status']) {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('lead_id', leadId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const dealService = {
  // Create a new deal
  async createDeal(dealData: Database['public']['Tables']['deals']['Insert']) {
    // If company_name or email are missing, try to get them from the lead
    if ((!dealData.company_name || !dealData.email) && dealData.lead_id) {
      const lead = await leadService.getLeadById(dealData.lead_id);
      if (lead) {
        dealData.company_name = dealData.company_name || lead.company_name;
        dealData.email = dealData.email || lead.email;
      }
    }

    const { data, error } = await supabase
      .from('deals')
      .insert(dealData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get deals with filtering and pagination
  async getDeals(filters?: {
    status?: string;
    payoutStatus?: string;
    priority?: string;
    assignedBuyer?: string;
    leadId?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('deals')
      .select(`
        *,
        lead:leads!deals_lead_id_fkey(*)
      `)
      .order('converted_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.payoutStatus) {
      query = query.eq('payout_status', filters.payoutStatus);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.assignedBuyer) {
      query = query.eq('assigned_buyer', filters.assignedBuyer);
    }
    if (filters?.leadId) {
      query = query.eq('lead_id', filters.leadId);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get a single deal by request ID
  async getDealById(requestId: string) {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        lead:leads!deals_lead_id_fkey(*)
      `)
      .eq('request_id', requestId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update deal status
  async updateDealStatus(requestId: string, status: Database['public']['Tables']['deals']['Row']['status']) {
    const { data, error } = await supabase
      .from('deals')
      .update({ status })
      .eq('request_id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update payout status
  async updatePayoutStatus(requestId: string, payoutStatus: Database['public']['Tables']['deals']['Row']['payout_status']) {
    const { data, error } = await supabase
      .from('deals')
      .update({ payout_status: payoutStatus })
      .eq('request_id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};