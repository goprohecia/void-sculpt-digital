ALTER TABLE public.devis ADD COLUMN service_category_id uuid REFERENCES public.service_categories(id) ON DELETE SET NULL DEFAULT NULL;
ALTER TABLE public.devis ADD COLUMN description text DEFAULT '';

ALTER TABLE public.factures ADD COLUMN service_category_id uuid REFERENCES public.service_categories(id) ON DELETE SET NULL DEFAULT NULL;
ALTER TABLE public.factures ADD COLUMN description text DEFAULT '';