/*
  # Add Organization Number and Consent Fields

  1. New Columns
    - `org_number` (text) - Organization number as entered by user
    - `org_number_normalized` (text) - Normalized version (digits only)
    - `consent_share_with_partners` (boolean) - Consent to share with partners

  2. Indexes
    - Add index on org_number_normalized for fast lookups

  3. Backward Compatibility
    - Only adds columns if they don't exist
    - Preserves existing data and triggers
*/

-- Add org_number if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'org_number'
  ) THEN
    ALTER TABLE leads ADD COLUMN org_number text;
  END IF;
END $$;

-- Add org_number_normalized if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'org_number_normalized'
  ) THEN
    ALTER TABLE leads ADD COLUMN org_number_normalized text;
  END IF;
END $$;

-- Add consent_share_with_partners if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'consent_share_with_partners'
  ) THEN
    ALTER TABLE leads ADD COLUMN consent_share_with_partners boolean DEFAULT false;
  END IF;
END $$;

-- Add index on org_number_normalized if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'leads' AND indexname = 'idx_leads_org_number_normalized'
  ) THEN
    CREATE INDEX idx_leads_org_number_normalized ON leads(org_number_normalized);
  END IF;
END $$;