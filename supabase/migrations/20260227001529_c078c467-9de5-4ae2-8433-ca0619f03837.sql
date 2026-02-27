
-- Add 'employee' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'employee';

-- Create employees table
CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nom text NOT NULL DEFAULT '',
  prenom text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  telephone text DEFAULT '',
  poste text DEFAULT '',
  date_embauche timestamptz DEFAULT now(),
  statut text NOT NULL DEFAULT 'actif',
  acces_modules jsonb NOT NULL DEFAULT '["overview","dossiers","calendrier","messagerie","profil"]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Admin full CRUD
CREATE POLICY "Admins can view all employees"
ON public.employees FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert employees"
ON public.employees FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update employees"
ON public.employees FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete employees"
ON public.employees FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Employee can view own record
CREATE POLICY "Employees can view own record"
ON public.employees FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Employee can update own record
CREATE POLICY "Employees can update own record"
ON public.employees FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
