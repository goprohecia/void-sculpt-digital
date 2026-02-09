
-- Table to store custom monthly objectives
CREATE TABLE public.objectifs_mensuels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mois text NOT NULL UNIQUE,
  objectif numeric NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.objectifs_mensuels ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write
CREATE POLICY "Admins can view objectives"
ON public.objectifs_mensuels FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert objectives"
ON public.objectifs_mensuels FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update objectives"
ON public.objectifs_mensuels FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete objectives"
ON public.objectifs_mensuels FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
