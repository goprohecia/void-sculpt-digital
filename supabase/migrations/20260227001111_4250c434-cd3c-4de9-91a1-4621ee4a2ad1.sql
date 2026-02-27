
-- Create app_settings table for module configuration
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can view app_settings"
ON public.app_settings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert app_settings"
ON public.app_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update app_settings"
ON public.app_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete app_settings"
ON public.app_settings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Authenticated users can read settings (needed for sidebar filtering)
CREATE POLICY "Authenticated can read app_settings"
ON public.app_settings FOR SELECT
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default enabled modules
INSERT INTO public.app_settings (key, value) VALUES
  ('enabled_modules', '["overview","clients","dossiers","messagerie","facturation","relances","emails","rendez-vous","support","analyse","parametres"]'::jsonb),
  ('client_visible_modules', '["overview","dossiers","demandes","devis","factures","messagerie","rendez-vous","support","profil","parametres"]'::jsonb),
  ('employee_visible_modules', '["overview","dossiers","calendrier","messagerie","profil"]'::jsonb);
