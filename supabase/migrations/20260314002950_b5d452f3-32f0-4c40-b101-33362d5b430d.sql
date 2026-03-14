
-- F-02: Tables many-to-many dossier_employe & client_dossier

CREATE TABLE public.dossier_employe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dossier_id UUID NOT NULL REFERENCES public.dossiers(id) ON DELETE CASCADE,
  employe_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  role_sur_dossier TEXT NOT NULL DEFAULT 'intervenant',
  date_assignation TIMESTAMPTZ NOT NULL DEFAULT now(),
  compte_id UUID,
  UNIQUE (dossier_id, employe_id)
);

CREATE TABLE public.client_dossier (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  dossier_id UUID NOT NULL REFERENCES public.dossiers(id) ON DELETE CASCADE,
  date_liaison TIMESTAMPTZ NOT NULL DEFAULT now(),
  compte_id UUID,
  UNIQUE (client_id, dossier_id)
);

CREATE INDEX idx_dossier_employe_dossier ON public.dossier_employe(dossier_id);
CREATE INDEX idx_dossier_employe_employe ON public.dossier_employe(employe_id);
CREATE INDEX idx_dossier_employe_compte ON public.dossier_employe(compte_id);
CREATE INDEX idx_client_dossier_client ON public.client_dossier(client_id);
CREATE INDEX idx_client_dossier_dossier ON public.client_dossier(dossier_id);
CREATE INDEX idx_client_dossier_compte ON public.client_dossier(compte_id);

CREATE TRIGGER set_compte_id_dossier_employe
  BEFORE INSERT ON public.dossier_employe
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

CREATE TRIGGER set_compte_id_client_dossier
  BEFORE INSERT ON public.client_dossier
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

ALTER TABLE public.dossier_employe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_dossier ENABLE ROW LEVEL SECURITY;

-- dossier_employe policies
CREATE POLICY "Admins full access dossier_employe"
  ON public.dossier_employe FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees view own assignments"
  ON public.dossier_employe FOR SELECT
  TO authenticated
  USING (employe_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  ));

CREATE POLICY "tenant_isolation_dossier_employe"
  ON public.dossier_employe
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (compte_id IS NULL OR compte_id = get_user_compte_id())
  WITH CHECK (compte_id IS NULL OR compte_id = get_user_compte_id());

-- client_dossier policies
CREATE POLICY "Admins full access client_dossier"
  ON public.client_dossier FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view own links"
  ON public.client_dossier FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  ));

CREATE POLICY "tenant_isolation_client_dossier"
  ON public.client_dossier
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (compte_id IS NULL OR compte_id = get_user_compte_id())
  WITH CHECK (compte_id IS NULL OR compte_id = get_user_compte_id());

-- Migrate existing one-to-one data
INSERT INTO public.dossier_employe (dossier_id, employe_id, role_sur_dossier, compte_id)
SELECT id, employee_id, 'responsable', compte_id
FROM public.dossiers
WHERE employee_id IS NOT NULL
ON CONFLICT (dossier_id, employe_id) DO NOTHING;

INSERT INTO public.client_dossier (client_id, dossier_id, compte_id)
SELECT client_id, id, compte_id
FROM public.dossiers
WHERE client_id IS NOT NULL
ON CONFLICT (client_id, dossier_id) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.dossier_employe;
