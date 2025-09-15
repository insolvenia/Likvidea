/*
  # Ensure leads table has required columns

  1. Schema Updates
    - Add missing columns if they don't exist
    - Ensure lead_id has unique constraint
    - Add indexes for performance

  2. No Data Loss
    - Only adds columns, never removes
    - Uses IF NOT EXISTS checks
*/

-- Ensure lead_id column exists and is unique
DO $$
BEGIN
  -- Add lead_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'lead_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN lead_id text;
  END IF;

  -- Add unique constraint on lead_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'leads' AND constraint_name = 'leads_lead_id_unique'
  ) THEN
    ALTER TABLE leads ADD CONSTRAINT leads_lead_id_unique UNIQUE (lead_id);
  END IF;
END $$;

-- Ensure other required columns exist
DO $$
BEGIN
  -- customer_email (mapped to email)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'customer_email'
  ) THEN
    ALTER TABLE leads ADD COLUMN customer_email text;
  END IF;

  -- customer_name (mapped to first_name)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'customer_name'
  ) THEN
    ALTER TABLE leads ADD COLUMN customer_name text;
  END IF;

  -- payload column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'payload'
  ) THEN
    ALTER TABLE leads ADD COLUMN payload jsonb;
  END IF;

  -- meta column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'meta'
  ) THEN
    ALTER TABLE leads ADD COLUMN meta jsonb;
  END IF;
END $$;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON leads (lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_customer_email ON leads (customer_email);
CREATE INDEX IF NOT EXISTS idx_leads_status_prio ON leads (status, prio);