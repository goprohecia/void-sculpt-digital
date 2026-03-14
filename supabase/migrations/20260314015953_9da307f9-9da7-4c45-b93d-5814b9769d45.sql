
-- Table: emails_planifies (scheduled mass emails)
CREATE TABLE public.emails_planifies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compte_id UUID,
  objet TEXT NOT NULL,
  contenu TEXT NOT NULL DEFAULT '',
  destinataires_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  date_envoi_planifie TIMESTAMPTZ NOT NULL,
  statut TEXT NOT NULL DEFAULT 'planifie',
  brevo_campaign_id TEXT,
  nb_destinataires INTEGER NOT NULL DEFAULT 0,
  pieces_jointes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.emails_planifies ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER set_compte_id_emails_planifies
  BEFORE INSERT ON public.emails_planifies
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

CREATE POLICY "Admins full access emails_planifies" ON public.emails_planifies
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "tenant_isolation_emails_planifies" ON public.emails_planifies
  AS RESTRICTIVE FOR ALL TO public
  USING ((compte_id IS NULL) OR (compte_id = get_user_compte_id()))
  WITH CHECK ((compte_id IS NULL) OR (compte_id = get_user_compte_id()));

-- Table: campagnes_email (campaign history)
CREATE TABLE public.campagnes_email (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compte_id UUID,
  objet TEXT NOT NULL,
  date_envoi TIMESTAMPTZ NOT NULL DEFAULT now(),
  nb_destinataires INTEGER NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'envoye',
  brevo_campaign_id TEXT,
  source TEXT DEFAULT 'masse',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.campagnes_email ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER set_compte_id_campagnes_email
  BEFORE INSERT ON public.campagnes_email
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

CREATE POLICY "Admins full access campagnes_email" ON public.campagnes_email
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "tenant_isolation_campagnes_email" ON public.campagnes_email
  AS RESTRICTIVE FOR ALL TO public
  USING ((compte_id IS NULL) OR (compte_id = get_user_compte_id()))
  WITH CHECK ((compte_id IS NULL) OR (compte_id = get_user_compte_id()));
