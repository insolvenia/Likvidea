export interface Lead {
  lead_id: string;
  created_at: string;
  status: 'received' | 'qualified' | 'won' | 'lost' | 'archived';
  company_name?: string;
  org_number?: string;
  org_number_normalized?: string;
  company_type?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  industry?: string;
  revenue_range?: string;
  timeframe?: string;
  services?: string[];
  intent_note?: string;
  files_count: number;
  consent_share_with_partners: boolean;
  company_representation: boolean;
  gdpr_consent: boolean;
  source_origin?: string;
  role?: string;
  prio?: string;
  raw_payload?: any;
}

export interface Deal {
  request_id: string;
  converted_at: string;
  lead_id: string;
  company_name?: string;
  email?: string;
  assigned_buyer?: string;
  deal_value?: number;
  fee_type: 'fixed' | 'percent' | 'none';
  fee_amount: number;
  currency: 'SEK' | 'EUR' | 'USD';
  payout_status: 'pending' | 'approved' | 'paid' | 'failed';
  notes?: string;
  description?: string;
  target_group?: string;
  monthly_volume?: string;
  priority: 'LOW' | 'NORMAL' | 'PRIO';
  uc_status?: string;
  status: 'open' | 'won' | 'lost' | 'on_hold';
  meta?: any;
}

export interface Complaint {
  complaint_id: string;
  created_at: string;
  customer_name?: string;
  customer_email: string;
  phone?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  meta?: any;
}

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'created_at' | 'org_number_normalized'> & {
          created_at?: string;
          org_number_normalized?: string;
        };
        Update: Partial<Omit<Lead, 'lead_id' | 'created_at'>>;
      };
      deals: {
        Row: Deal;
        Insert: Omit<Deal, 'converted_at'> & {
          converted_at?: string;
        };
        Update: Partial<Omit<Deal, 'request_id'>>;
      };
      complaints: {
        Row: Complaint;
        Insert: Omit<Complaint, 'created_at'> & {
          created_at?: string;
        };
        Update: Partial<Omit<Complaint, 'complaint_id'>>;
      };
    };
  };
}