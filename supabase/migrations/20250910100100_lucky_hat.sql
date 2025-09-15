/*
  # Create Lead and Deal Models with Relations

  1. New Tables
    - `leads`
      - `lead_id` (text, primary key)
      - `created_at` (timestamptz, default now)
      - `status` (enum: received, qualified, won, lost, archived)
      - `company_name` (text)
      - `org_number` (text)
      - `org_number_normalized` (text, indexed)
      - `company_type` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, required, validated, indexed)
      - `phone` (text)
      - `industry` (text)
      - `revenue_range` (text)
      - `timeframe` (text)
      - `services` (text array)
      - `intent_note` (text)
      - `files_count` (integer, default 0)
      - `consent_share_with_partners` (boolean, default false)
      - `company_representation` (boolean, default false)
      - `gdpr_consent` (boolean, required)
      - `source_origin` (text)
      - `role` (text)
      - `prio` (text)
      - `raw_payload` (jsonb)

    - `deals`
      - `request_id` (text, primary key)
      - `converted_at` (timestamptz, default now)
      - `lead_id` (text, references leads.lead_id)
      - `company_name` (text)
      - `email` (text, validated)
      - `assigned_buyer` (text, indexed)
      - `deal_value` (numeric)
      - `fee_type` (enum: fixed, percent, none)
      - `fee_amount` (numeric, default 0)
      - `currency` (enum: SEK, EUR, USD)
      - `payout_status` (enum: pending, approved, paid, failed)
      - `notes` (text)
      - `description` (text)
      - `target_group` (text)
      - `monthly_volume` (text)
      - `priority` (enum: LOW, NORMAL, PRIO)
      - `uc_status` (text)
      - `status` (enum: open, won, lost, on_hold)
      - `meta` (jsonb)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users

  3. Indexes
    - Multiple indexes for performance optimization

  4. Constraints
    - Email validation
    - Fee amount validation
    - Unique constraints
*/

-- Create custom types
CREATE TYPE lead_status AS ENUM ('received', 'qualified', 'won', 'lost', 'archived');
CREATE TYPE deal_fee_type AS ENUM ('fixed', 'percent', 'none');
CREATE TYPE deal_currency AS ENUM ('SEK', 'EUR', 'USD');
CREATE TYPE deal_payout_status AS ENUM ('pending', 'approved', 'paid', 'failed');
CREATE TYPE deal_priority AS ENUM ('LOW', 'NORMAL', 'PRIO');
CREATE TYPE deal_status AS ENUM ('open', 'won', 'lost', 'on_hold');

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  lead_id text PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  status lead_status DEFAULT 'received' NOT NULL,
  company_name text,
  org_number text,
  org_number_normalized text,
  company_type text,
  first_name text,
  last_name text,
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone text,
  industry text,
  revenue_range text,
  timeframe text,
  services text[],
  intent_note text,
  files_count integer DEFAULT 0,
  consent_share_with_partners boolean DEFAULT false,
  company_representation boolean DEFAULT false,
  gdpr_consent boolean NOT NULL,
  source_origin text,
  role text,
  prio text,
  raw_payload jsonb
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  request_id text PRIMARY KEY,
  converted_at timestamptz DEFAULT now() NOT NULL,
  lead_id text NOT NULL,
  company_name text,
  email text CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  assigned_buyer text,
  deal_value numeric,
  fee_type deal_fee_type DEFAULT 'none' NOT NULL,
  fee_amount numeric DEFAULT 0 CHECK (fee_amount >= 0),
  currency deal_currency DEFAULT 'SEK' NOT NULL,
  payout_status deal_payout_status DEFAULT 'pending' NOT NULL,
  notes text,
  description text,
  target_group text,
  monthly_volume text,
  priority deal_priority DEFAULT 'NORMAL' NOT NULL,
  uc_status text,
  status deal_status DEFAULT 'open' NOT NULL,
  meta jsonb
);

-- Add constraint for fee_amount when fee_type is percent
ALTER TABLE deals ADD CONSTRAINT check_percent_fee 
  CHECK (fee_type != 'percent' OR (fee_amount >= 0 AND fee_amount <= 100));

-- Create indexes for leads table
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_org_number_normalized ON leads(org_number_normalized);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Create indexes for deals table
CREATE INDEX IF NOT EXISTS idx_deals_converted_at ON deals(converted_at);
CREATE INDEX IF NOT EXISTS idx_deals_lead_id ON deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_assigned_buyer ON deals(assigned_buyer);
CREATE INDEX IF NOT EXISTS idx_deals_payout_status ON deals(payout_status);
CREATE INDEX IF NOT EXISTS idx_deals_priority ON deals(priority);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);

-- Create unique constraint for lead_id + created_at combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_unique_lead_created 
  ON leads(lead_id, created_at);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table
CREATE POLICY "Authenticated users can read leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for deals table
CREATE POLICY "Authenticated users can read deals"
  ON deals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert deals"
  ON deals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update deals"
  ON deals
  FOR UPDATE
  TO authenticated
  USING (true);

-- Function to normalize org_number (remove non-digits)
CREATE OR REPLACE FUNCTION normalize_org_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.org_number IS NOT NULL THEN
    NEW.org_number_normalized := regexp_replace(NEW.org_number, '[^0-9]', '', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically normalize org_number
CREATE TRIGGER trigger_normalize_org_number
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION normalize_org_number();

-- Function to normalize services array (convert comma-separated string to array)
CREATE OR REPLACE FUNCTION normalize_services()
RETURNS TRIGGER AS $$
BEGIN
  -- If services is a single string with commas, convert to array
  IF NEW.services IS NOT NULL AND array_length(NEW.services, 1) = 1 THEN
    IF NEW.services[1] LIKE '%,%' THEN
      NEW.services := string_to_array(trim(NEW.services[1]), ',');
      -- Trim whitespace from each element
      FOR i IN 1..array_length(NEW.services, 1) LOOP
        NEW.services[i] := trim(NEW.services[i]);
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically normalize services
CREATE TRIGGER trigger_normalize_services
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION normalize_services();

-- Function to handle upsert logic for leads (update if lead_id + created_at exists)
CREATE OR REPLACE FUNCTION upsert_lead(
  p_lead_id text,
  p_created_at timestamptz,
  p_status lead_status DEFAULT 'received',
  p_company_name text DEFAULT NULL,
  p_org_number text DEFAULT NULL,
  p_company_type text DEFAULT NULL,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_industry text DEFAULT NULL,
  p_revenue_range text DEFAULT NULL,
  p_timeframe text DEFAULT NULL,
  p_services text[] DEFAULT NULL,
  p_intent_note text DEFAULT NULL,
  p_files_count integer DEFAULT 0,
  p_consent_share_with_partners boolean DEFAULT false,
  p_company_representation boolean DEFAULT false,
  p_gdpr_consent boolean DEFAULT NULL,
  p_source_origin text DEFAULT NULL,
  p_role text DEFAULT NULL,
  p_prio text DEFAULT NULL,
  p_raw_payload jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO leads (
    lead_id, created_at, status, company_name, org_number, company_type,
    first_name, last_name, email, phone, industry, revenue_range,
    timeframe, services, intent_note, files_count, consent_share_with_partners,
    company_representation, gdpr_consent, source_origin, role, prio, raw_payload
  ) VALUES (
    p_lead_id, p_created_at, p_status, p_company_name, p_org_number, p_company_type,
    p_first_name, p_last_name, p_email, p_phone, p_industry, p_revenue_range,
    p_timeframe, p_services, p_intent_note, p_files_count, p_consent_share_with_partners,
    p_company_representation, p_gdpr_consent, p_source_origin, p_role, p_prio, p_raw_payload
  )
  ON CONFLICT (lead_id, created_at) 
  DO UPDATE SET
    status = EXCLUDED.status,
    company_name = EXCLUDED.company_name,
    org_number = EXCLUDED.org_number,
    company_type = EXCLUDED.company_type,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    industry = EXCLUDED.industry,
    revenue_range = EXCLUDED.revenue_range,
    timeframe = EXCLUDED.timeframe,
    services = EXCLUDED.services,
    intent_note = EXCLUDED.intent_note,
    files_count = EXCLUDED.files_count,
    consent_share_with_partners = EXCLUDED.consent_share_with_partners,
    company_representation = EXCLUDED.company_representation,
    gdpr_consent = EXCLUDED.gdpr_consent,
    source_origin = EXCLUDED.source_origin,
    role = EXCLUDED.role,
    prio = EXCLUDED.prio,
    raw_payload = EXCLUDED.raw_payload;
END;
$$ LANGUAGE plpgsql;