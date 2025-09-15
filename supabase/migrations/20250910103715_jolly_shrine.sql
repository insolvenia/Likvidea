/*
  # Add services column to leads table

  1. New Columns
    - `services` (text[], array of strings)
      - Stores the array of services the lead is interested in
      - Allows null values for backwards compatibility

  2. Changes
    - Add services column to existing leads table
    - Use conditional check to prevent errors if column already exists
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'services'
  ) THEN
    ALTER TABLE leads ADD COLUMN services text[];
  END IF;
END $$;