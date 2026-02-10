
-- Permettre aux clients d'inserer des notifications (pour eux-memes ou vers admin)
CREATE POLICY "Clients can insert notifications"
ON notifications FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    destinataire = 'admin'
    OR (
      destinataire = 'client'
      AND client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    )
  )
);

-- Permettre aux clients d'inserer des email_logs lies a leur compte
CREATE POLICY "Clients can insert email_logs"
ON email_logs FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
);
