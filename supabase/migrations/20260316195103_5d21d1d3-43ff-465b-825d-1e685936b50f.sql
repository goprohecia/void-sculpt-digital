
-- Add destinataire_type to conversations
ALTER TABLE public.conversations 
  ADD COLUMN IF NOT EXISTS destinataire_type text NOT NULL DEFAULT 'admin';

-- Add is_group_message to messages
ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS is_group_message boolean NOT NULL DEFAULT false;

-- RLS: Clients can only create conversations with destinataire_type = 'admin'
CREATE POLICY "Clients can only create admin conversations"
ON public.conversations FOR INSERT TO authenticated
WITH CHECK (
  CASE WHEN has_role(auth.uid(), 'client'::app_role) 
    THEN destinataire_type = 'admin' 
    ELSE true 
  END
);

-- Employees can view conversations of their assigned clients
CREATE POLICY "Employees view assigned client conversations"
ON public.conversations FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'employee'::app_role)
  AND client_id IN (
    SELECT cd.client_id FROM client_dossier cd
    JOIN dossier_employe de ON de.dossier_id = cd.dossier_id
    JOIN employees e ON e.id = de.employe_id
    WHERE e.user_id = auth.uid()
  )
);

-- Employees can insert messages in conversations of their assigned clients
CREATE POLICY "Employees can insert messages for assigned clients"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'employee'::app_role)
  AND conversation_id IN (
    SELECT c.id FROM conversations c
    WHERE c.client_id IN (
      SELECT cd.client_id FROM client_dossier cd
      JOIN dossier_employe de ON de.dossier_id = cd.dossier_id
      JOIN employees e ON e.id = de.employe_id
      WHERE e.user_id = auth.uid()
    )
  )
);

-- Employees can view messages of assigned client conversations
CREATE POLICY "Employees can view messages for assigned clients"
ON public.messages FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'employee'::app_role)
  AND conversation_id IN (
    SELECT c.id FROM conversations c
    WHERE c.client_id IN (
      SELECT cd.client_id FROM client_dossier cd
      JOIN dossier_employe de ON de.dossier_id = cd.dossier_id
      JOIN employees e ON e.id = de.employe_id
      WHERE e.user_id = auth.uid()
    )
  )
);

-- Clients can insert messages in their own conversations
CREATE POLICY "Clients can insert messages in own conversations"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'client'::app_role)
  AND conversation_id IN (
    SELECT c.id FROM conversations c
    WHERE c.client_id IN (
      SELECT cl.id FROM clients cl WHERE cl.user_id = auth.uid()
    )
  )
);

-- Clients can view messages in their own conversations
CREATE POLICY "Clients can view messages in own conversations"
ON public.messages FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'client'::app_role)
  AND conversation_id IN (
    SELECT c.id FROM conversations c
    WHERE c.client_id IN (
      SELECT cl.id FROM clients cl WHERE cl.user_id = auth.uid()
    )
  )
);

-- Clients can create conversations (only admin type, enforced by existing policy above)
CREATE POLICY "Clients can insert own conversations"
ON public.conversations FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'client'::app_role)
  AND client_id IN (
    SELECT cl.id FROM clients cl WHERE cl.user_id = auth.uid()
  )
);
