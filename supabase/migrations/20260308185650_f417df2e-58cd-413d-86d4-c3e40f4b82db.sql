
-- Timeline templates: customizable steps per enterprise user
CREATE TABLE public.timeline_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Par défaut',
  steps jsonb NOT NULL DEFAULT '["Demande reçue","Rendez-vous","Cahier des charges","Devis envoyé","Devis accepté","En cours","Livraison","Terminé"]'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access timeline_templates" ON public.timeline_templates
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view timeline_templates" ON public.timeline_templates
  FOR SELECT TO authenticated
  USING (true);

-- Per-dossier timeline tracking
CREATE TABLE public.dossier_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES public.dossiers(id) ON DELETE CASCADE,
  template_id uuid REFERENCES public.timeline_templates(id) ON DELETE SET NULL,
  current_step integer NOT NULL DEFAULT 0,
  step_dates jsonb NOT NULL DEFAULT '{}'::jsonb,
  step_notes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dossier_id)
);

ALTER TABLE public.dossier_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access dossier_timeline" ON public.dossier_timeline
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees view dossier_timeline" ON public.dossier_timeline
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'employee'));

CREATE POLICY "Clients view own dossier_timeline" ON public.dossier_timeline
  FOR SELECT TO authenticated
  USING (dossier_id IN (
    SELECT d.id FROM dossiers d
    JOIN clients cl ON d.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));
