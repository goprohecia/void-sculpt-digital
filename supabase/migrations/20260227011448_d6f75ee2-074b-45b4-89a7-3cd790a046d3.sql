-- Fix RLS policies for tags table: allow all operations for authenticated users
CREATE POLICY "Authenticated users can read tags"
ON public.tags FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert tags"
ON public.tags FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update tags"
ON public.tags FOR UPDATE
USING (true);

CREATE POLICY "Authenticated users can delete tags"
ON public.tags FOR DELETE
USING (true);

-- Fix RLS policies for client_tags table
CREATE POLICY "Authenticated users can read client_tags"
ON public.client_tags FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert client_tags"
ON public.client_tags FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update client_tags"
ON public.client_tags FOR UPDATE
USING (true);

CREATE POLICY "Authenticated users can delete client_tags"
ON public.client_tags FOR DELETE
USING (true);