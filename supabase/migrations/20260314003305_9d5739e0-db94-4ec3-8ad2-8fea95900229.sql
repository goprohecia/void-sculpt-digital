
-- F-03: Permissions granulaires

-- 1. Table roles (par compte)
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT DEFAULT '',
  compte_id UUID,
  date_creation TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nom, compte_id)
);

-- 2. Table permissions (globale)
CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  description_lisible TEXT NOT NULL DEFAULT '',
  categorie VARCHAR(50) NOT NULL DEFAULT 'general'
);

-- 3. Table role_permissions
CREATE TABLE public.role_permissions (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  valeur BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (role_id, permission_id)
);

-- 4. Table employe_role
CREATE TABLE public.employe_role (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employe_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  compte_id UUID,
  date_assignation TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employe_id, role_id)
);

-- 5. Table audit_permissions
CREATE TABLE public.audit_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  compte_id UUID,
  user_id UUID,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  permission_code VARCHAR(100) NOT NULL,
  ancienne_valeur BOOLEAN,
  nouvelle_valeur BOOLEAN NOT NULL,
  date_modification TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_roles_compte ON public.roles(compte_id);
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX idx_employe_role_employe ON public.employe_role(employe_id);
CREATE INDEX idx_employe_role_role ON public.employe_role(role_id);
CREATE INDEX idx_employe_role_compte ON public.employe_role(compte_id);
CREATE INDEX idx_audit_permissions_compte ON public.audit_permissions(compte_id);
CREATE INDEX idx_audit_permissions_role ON public.audit_permissions(role_id);

-- Triggers for compte_id
CREATE TRIGGER set_compte_id_roles
  BEFORE INSERT ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

CREATE TRIGGER set_compte_id_employe_role
  BEFORE INSERT ON public.employe_role
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

CREATE TRIGGER set_compte_id_audit_permissions
  BEFORE INSERT ON public.audit_permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employe_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_permissions ENABLE ROW LEVEL SECURITY;

-- RLS: roles
CREATE POLICY "Admins full access roles"
  ON public.roles FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees view own compte roles"
  ON public.roles FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'employee'));

CREATE POLICY "tenant_isolation_roles"
  ON public.roles AS RESTRICTIVE FOR ALL TO public
  USING (compte_id IS NULL OR compte_id = get_user_compte_id())
  WITH CHECK (compte_id IS NULL OR compte_id = get_user_compte_id());

-- RLS: permissions (global read)
CREATE POLICY "Anyone can read permissions"
  ON public.permissions FOR SELECT TO authenticated
  USING (true);

-- RLS: role_permissions
CREATE POLICY "Admins full access role_permissions"
  ON public.role_permissions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees view role_permissions"
  ON public.role_permissions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'employee'));

-- RLS: employe_role
CREATE POLICY "Admins full access employe_role"
  ON public.employe_role FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees view own employe_role"
  ON public.employe_role FOR SELECT TO authenticated
  USING (employe_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()));

CREATE POLICY "tenant_isolation_employe_role"
  ON public.employe_role AS RESTRICTIVE FOR ALL TO public
  USING (compte_id IS NULL OR compte_id = get_user_compte_id())
  WITH CHECK (compte_id IS NULL OR compte_id = get_user_compte_id());

-- RLS: audit_permissions
CREATE POLICY "Admins full access audit_permissions"
  ON public.audit_permissions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "tenant_isolation_audit_permissions"
  ON public.audit_permissions AS RESTRICTIVE FOR ALL TO public
  USING (compte_id IS NULL OR compte_id = get_user_compte_id())
  WITH CHECK (compte_id IS NULL OR compte_id = get_user_compte_id());

-- Seed permissions (11 V1)
INSERT INTO public.permissions (code, description_lisible, categorie) VALUES
  ('voir_dossiers_equipe', 'Voir les dossiers de l''équipe', 'dossiers'),
  ('modifier_dossiers_equipe', 'Modifier les dossiers de l''équipe', 'dossiers'),
  ('assigner_dossiers', 'Assigner des dossiers aux employés', 'dossiers'),
  ('voir_planning_equipe', 'Voir le planning de l''équipe', 'planning'),
  ('modifier_planning_equipe', 'Modifier le planning de l''équipe', 'planning'),
  ('voir_analytique_complete', 'Accéder aux analytics complètes', 'analytique'),
  ('modifier_roles', 'Modifier les rôles et permissions', 'administration'),
  ('creer_salaries', 'Créer de nouveaux employés', 'administration'),
  ('supprimer_salaries', 'Supprimer des employés', 'administration'),
  ('voir_tous_dossiers', 'Voir tous les dossiers du compte', 'dossiers'),
  ('acceder_parametres', 'Accéder aux paramètres du compte', 'administration');

-- DB function: check_permission
CREATE OR REPLACE FUNCTION public.check_permission(_user_id UUID, _permission_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM employe_role er
    JOIN role_permissions rp ON rp.role_id = er.role_id
    JOIN permissions p ON p.id = rp.permission_id
    JOIN employees e ON e.id = er.employe_id
    WHERE e.user_id = _user_id
      AND p.code = _permission_code
      AND rp.valeur = true
  )
$$;
