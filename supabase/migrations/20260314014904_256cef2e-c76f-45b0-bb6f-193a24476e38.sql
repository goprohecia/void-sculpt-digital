
-- Create evenements_calendrier table
CREATE TABLE public.evenements_calendrier (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'travail',
  titre TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  date_debut TIMESTAMP WITH TIME ZONE NOT NULL,
  date_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  employe_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  statut TEXT NOT NULL DEFAULT 'confirme',
  compte_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demandes_indisponibilite table
CREATE TABLE public.demandes_indisponibilite (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employe_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  date_debut TIMESTAMP WITH TIME ZONE NOT NULL,
  date_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  motif TEXT NOT NULL DEFAULT '',
  statut TEXT NOT NULL DEFAULT 'en_attente',
  commentaire_admin TEXT,
  date_traitement TIMESTAMP WITH TIME ZONE,
  compte_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evenements_calendrier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demandes_indisponibilite ENABLE ROW LEVEL SECURITY;

-- Triggers for compte_id auto-set
CREATE TRIGGER set_compte_id_evenements_calendrier
  BEFORE INSERT ON public.evenements_calendrier
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

CREATE TRIGGER set_compte_id_demandes_indisponibilite
  BEFORE INSERT ON public.demandes_indisponibilite
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

-- Updated_at trigger
CREATE TRIGGER update_evenements_calendrier_updated_at
  BEFORE UPDATE ON public.evenements_calendrier
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies for evenements_calendrier
CREATE POLICY "Admins full access evenements_calendrier"
  ON public.evenements_calendrier FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees view own events"
  ON public.evenements_calendrier FOR SELECT
  TO authenticated
  USING (employe_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "tenant_isolation_evenements_calendrier"
  ON public.evenements_calendrier FOR ALL
  TO public
  USING ((compte_id IS NULL) OR (compte_id = get_user_compte_id()))
  WITH CHECK ((compte_id IS NULL) OR (compte_id = get_user_compte_id()));

-- RLS policies for demandes_indisponibilite
CREATE POLICY "Admins full access demandes_indisponibilite"
  ON public.demandes_indisponibilite FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees manage own demandes"
  ON public.demandes_indisponibilite FOR ALL
  TO authenticated
  USING (employe_id IN (SELECT id FROM employees WHERE user_id = auth.uid()))
  WITH CHECK (employe_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "tenant_isolation_demandes_indisponibilite"
  ON public.demandes_indisponibilite FOR ALL
  TO public
  USING ((compte_id IS NULL) OR (compte_id = get_user_compte_id()))
  WITH CHECK ((compte_id IS NULL) OR (compte_id = get_user_compte_id()));

-- Enable realtime on evenements_calendrier
ALTER PUBLICATION supabase_realtime ADD TABLE public.evenements_calendrier;
