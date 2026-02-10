-- Create storage bucket for CDC attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('cdc-attachments', 'cdc-attachments', true);

-- RLS: authenticated users can upload to their own folder
CREATE POLICY "Users can upload CDC attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cdc-attachments' AND auth.uid() IS NOT NULL);

-- RLS: anyone can view CDC attachments (needed for admin review)
CREATE POLICY "CDC attachments are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'cdc-attachments');

-- RLS: users can delete their own uploads
CREATE POLICY "Users can delete own CDC attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'cdc-attachments' AND auth.uid() IS NOT NULL);

-- Add pieces_jointes column to cahiers_des_charges
ALTER TABLE public.cahiers_des_charges
ADD COLUMN pieces_jointes jsonb DEFAULT '[]'::jsonb;
