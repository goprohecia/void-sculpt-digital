
-- Create email-attachments storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('email-attachments', 'email-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: Admins can upload/read/delete
CREATE POLICY "Admins can upload email attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'email-attachments' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read email attachments"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'email-attachments' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete email attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'email-attachments' AND public.has_role(auth.uid(), 'admin'));
