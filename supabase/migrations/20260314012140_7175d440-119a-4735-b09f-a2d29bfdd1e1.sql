
-- Add media_url column to messages table
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS media_url text DEFAULT NULL;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS media_type text DEFAULT NULL;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS media_name text DEFAULT NULL;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS media_size bigint DEFAULT NULL;

-- Create annonces table
CREATE TABLE public.annonces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  contenu text NOT NULL DEFAULT '',
  compte_id uuid,
  cible_type text NOT NULL DEFAULT 'tous_clients',
  cible_filtre_json jsonb DEFAULT '{}'::jsonb,
  statut text NOT NULL DEFAULT 'active',
  date_creation timestamp with time zone NOT NULL DEFAULT now(),
  date_expiration timestamp with time zone DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.annonces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access annonces" ON public.annonces FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view active annonces" ON public.annonces FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'client'::app_role) AND statut = 'active' AND (cible_type = 'tous_clients' OR cible_type = 'tous'));

CREATE POLICY "Employees can view active annonces" ON public.annonces FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'employee'::app_role) AND statut = 'active' AND (cible_type = 'tous_employes' OR cible_type = 'tous'));

CREATE POLICY "tenant_isolation_annonces" ON public.annonces FOR ALL TO public
  USING ((compte_id IS NULL) OR (compte_id = get_user_compte_id()))
  WITH CHECK ((compte_id IS NULL) OR (compte_id = get_user_compte_id()));

-- Make tenant_isolation restrictive
ALTER POLICY "tenant_isolation_annonces" ON public.annonces USING ((compte_id IS NULL) OR (compte_id = get_user_compte_id()));

-- Create annonce_lecture table
CREATE TABLE public.annonce_lecture (
  annonce_id uuid NOT NULL REFERENCES public.annonces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  date_lecture timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (annonce_id, user_id)
);

ALTER TABLE public.annonce_lecture ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own lecture" ON public.annonce_lecture FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own lecture" ON public.annonce_lecture FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins full access annonce_lecture" ON public.annonce_lecture FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for compte_id on annonces
CREATE TRIGGER set_compte_id_annonces BEFORE INSERT ON public.annonces
  FOR EACH ROW EXECUTE FUNCTION set_compte_id_on_insert();

-- Updated_at trigger for annonces
CREATE TRIGGER update_annonces_updated_at BEFORE UPDATE ON public.annonces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create messagerie-medias storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('messagerie-medias', 'messagerie-medias', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for messagerie-medias
CREATE POLICY "Authenticated can upload messagerie medias"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'messagerie-medias');

CREATE POLICY "Anyone can read messagerie medias"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'messagerie-medias');

CREATE POLICY "Admins can delete messagerie medias"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'messagerie-medias' AND public.has_role(auth.uid(), 'admin'));
