
-- Allow clients to update their own client record
CREATE POLICY "Clients can update own record"
ON public.clients
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
