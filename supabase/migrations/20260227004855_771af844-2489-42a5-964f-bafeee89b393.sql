
-- 1. Add employee_id to dossiers
ALTER TABLE public.dossiers ADD COLUMN employee_id uuid REFERENCES public.employees(id);

-- 2. Create email_templates table
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  sujet text NOT NULL DEFAULT '',
  contenu text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'relance',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access email_templates" ON public.email_templates
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- 3. Create events_manuels table
CREATE TABLE public.events_manuels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text DEFAULT '',
  date timestamptz NOT NULL,
  heure text NOT NULL DEFAULT '09:00',
  duree integer NOT NULL DEFAULT 60,
  employee_id uuid REFERENCES public.employees(id),
  client_id uuid REFERENCES public.clients(id),
  type text NOT NULL DEFAULT 'rdv',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events_manuels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access events_manuels" ON public.events_manuels
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees view own events" ON public.events_manuels
  FOR SELECT USING (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

-- Trigger for updated_at on email_templates
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
