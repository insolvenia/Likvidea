/*
  # Create complaints table

  1. New Tables
    - `complaints`
      - `complaint_id` (text, primary key)
      - `created_at` (timestamptz, default now)
      - `customer_name` (text, optional)
      - `customer_email` (text, required)
      - `phone` (text, optional)
      - `message` (text, required)
      - `status` (text, default 'new')
      - `meta` (jsonb, for additional data)

  2. Security
    - Enable RLS on `complaints` table
    - Add policy for authenticated users to read and insert complaints

  3. Indexes
    - Index on created_at for fast sorting
*/

CREATE TABLE IF NOT EXISTS public.complaints (
  complaint_id text PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  customer_name text,
  customer_email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new',
  meta jsonb
);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can insert complaints"
  ON public.complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read complaints"
  ON public.complaints
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update complaints"
  ON public.complaints
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create index for fast lookup by creation date
CREATE INDEX IF NOT EXISTS complaints_created_at_idx ON public.complaints(created_at DESC);

-- Email validation constraint
ALTER TABLE public.complaints 
ADD CONSTRAINT complaints_email_check 
CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');