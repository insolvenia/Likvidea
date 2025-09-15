/*
  # Remove pg_net trigger

  1. Changes
    - Drop trigger `trg_notify_new_lead` on leads table
    - Drop function `notify_new_lead()` that calls net.http_post
    - This prevents 500 errors when saving/updating leads

  2. Result
    - /submit-lead can save/update rows without network call failures
    - Pure save-only functionality without external dependencies
*/

-- Drop the trigger first
DROP TRIGGER IF EXISTS trg_notify_new_lead ON public.leads;

-- Drop the function that calls pg_net
DROP FUNCTION IF EXISTS public.notify_new_lead();