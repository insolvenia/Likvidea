/*
  # Add raw_payload column to leads table

  1. Changes
    - Add `raw_payload` column of type JSONB to the `leads` table
    - This column will store the original form submission data

  2. Notes
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - JSONB type allows efficient storage and querying of JSON data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'raw_payload'
  ) THEN
    ALTER TABLE leads ADD COLUMN raw_payload JSONB;
  END IF;
END $$;