
-- Remove the overly permissive policy
DROP POLICY "Anyone can insert preview_visits" ON public.preview_visits;

-- Replace with authenticated-only insert
CREATE POLICY "Authenticated can insert preview_visits" ON public.preview_visits
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
