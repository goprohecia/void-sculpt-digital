INSERT INTO public.app_settings (key, value)
VALUES ('business_name', '"Impartial"'::jsonb)
ON CONFLICT (key) DO NOTHING;