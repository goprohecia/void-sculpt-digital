
-- ============================================================
-- F-01 : ISOLATION MULTI-TENANT — compte_id
-- ============================================================

-- Step 1: Add compte_id to employees & clients first (function deps)
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS compte_id UUID;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS compte_id UUID;

-- Step 2: Indexes for function lookups
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- Step 3: Helper function — resolves current user's tenant ID
CREATE OR REPLACE FUNCTION public.get_user_compte_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result uuid;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  IF has_role(auth.uid(), 'admin') THEN RETURN auth.uid(); END IF;
  SELECT e.compte_id INTO result FROM employees e WHERE e.user_id = auth.uid() LIMIT 1;
  IF result IS NOT NULL THEN RETURN result; END IF;
  SELECT c.compte_id INTO result FROM clients c WHERE c.user_id = auth.uid() LIMIT 1;
  IF result IS NOT NULL THEN RETURN result; END IF;
  RETURN auth.uid();
END;
$$;

-- Step 4: Trigger function — auto-sets compte_id on INSERT
CREATE OR REPLACE FUNCTION public.set_compte_id_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.compte_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.compte_id := get_user_compte_id();
  END IF;
  RETURN NEW;
END;
$$;

-- Step 5: Add columns, indexes, triggers, and restrictive policies to ALL business tables
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'ai_conversations', 'ai_messages', 'app_settings',
    'bon_commande_lignes', 'bons_commande',
    'cahiers_des_charges', 'cdc_historique', 'client_tags',
    'clients', 'conversations', 'custom_spaces',
    'demandes', 'devis', 'donnees_mensuelles',
    'dossier_timeline', 'dossiers',
    'email_logs', 'email_templates', 'employees',
    'events_manuels', 'factures', 'fournisseurs',
    'messages', 'notifications', 'objectifs_mensuels',
    'preview_visits', 'produits', 'product_categories',
    'relances', 'send_logs', 'service_categories',
    'stock_mouvements', 'tags',
    'tickets', 'ticket_messages', 'timeline_templates'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    -- Add column (idempotent)
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS compte_id UUID', tbl);

    -- Index on compte_id
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_compte_id ON public.%I(compte_id)', replace(tbl, '-', '_'), tbl);

    -- Trigger for auto-setting compte_id
    EXECUTE format('DROP TRIGGER IF EXISTS trg_set_compte_id ON public.%I', tbl);
    EXECUTE format('CREATE TRIGGER trg_set_compte_id BEFORE INSERT ON public.%I FOR EACH ROW EXECUTE FUNCTION set_compte_id_on_insert()', tbl);

    -- Restrictive RLS policy for tenant isolation
    EXECUTE format('DROP POLICY IF EXISTS "tenant_isolation" ON public.%I', tbl);
    EXECUTE format(
      'CREATE POLICY "tenant_isolation" ON public.%I AS RESTRICTIVE FOR ALL TO public USING (compte_id IS NULL OR compte_id = get_user_compte_id()) WITH CHECK (compte_id IS NULL OR compte_id = get_user_compte_id())',
      tbl
    );
  END LOOP;
END;
$$;
