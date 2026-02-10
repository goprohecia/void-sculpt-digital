
-- Fix 1: Make cdc-attachments bucket private
UPDATE storage.buckets SET public = false WHERE id = 'cdc-attachments';

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "CDC attachments are publicly readable" ON storage.objects;

-- Create proper RLS policies for cdc-attachments
-- Admins can read all attachments
CREATE POLICY "Admins can view cdc attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'cdc-attachments' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Clients can view attachments for their own demandes
CREATE POLICY "Clients can view own cdc attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cdc-attachments' AND
  (storage.foldername(name))[1] IN (
    SELECT d.id::text FROM public.demandes d
    JOIN public.clients cl ON d.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);
