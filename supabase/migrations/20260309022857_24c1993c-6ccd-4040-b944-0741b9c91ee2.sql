
-- Table for customizable service/product categories
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  couleur TEXT NOT NULL DEFAULT '#6366f1',
  mots_cles TEXT[] NOT NULL DEFAULT '{}',
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins full access service_categories"
  ON public.service_categories
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Employees can view
CREATE POLICY "Employees can view service_categories"
  ON public.service_categories
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'employee'));

-- Insert default categories
INSERT INTO public.service_categories (nom, couleur, mots_cles, ordre) VALUES
  ('Site web', 'hsl(265, 85%, 60%)', ARRAY['site web', 'vitrine', 'application web', 'landing'], 0),
  ('App mobile', 'hsl(200, 100%, 50%)', ARRAY['mobile'], 1),
  ('E-commerce', 'hsl(155, 100%, 45%)', ARRAY['commerce'], 2),
  ('Back-office', 'hsl(45, 93%, 55%)', ARRAY['back-office', 'backoffice'], 3),
  ('360', 'hsl(330, 80%, 55%)', ARRAY['360'], 4),
  ('Autres', 'hsl(250, 10%, 45%)', ARRAY[]::text[], 5);
