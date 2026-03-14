
-- F-04: Brevo integration tables

-- 1. Table email_events (webhook tracking)
CREATE TABLE public.email_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_destinataire TEXT NOT NULL,
  type_event TEXT NOT NULL,
  campagne_id TEXT,
  metadata JSONB DEFAULT '{}',
  date_event TIMESTAMPTZ NOT NULL DEFAULT now(),
  compte_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_events_email ON public.email_events(email_destinataire);
CREATE INDEX idx_email_events_type ON public.email_events(type_event);
CREATE INDEX idx_email_events_campagne ON public.email_events(campagne_id);
CREATE INDEX idx_email_events_compte ON public.email_events(compte_id);
CREATE INDEX idx_email_events_date ON public.email_events(date_event);

-- Trigger for compte_id
CREATE TRIGGER set_compte_id_email_events
  BEFORE INSERT ON public.email_events
  FOR EACH ROW EXECUTE FUNCTION public.set_compte_id_on_insert();

-- RLS
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access email_events"
  ON public.email_events FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "tenant_isolation_email_events"
  ON public.email_events AS RESTRICTIVE FOR ALL TO public
  USING (compte_id IS NULL OR compte_id = get_user_compte_id())
  WITH CHECK (compte_id IS NULL OR compte_id = get_user_compte_id());

-- 2. Add email_opt_out to clients
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS email_opt_out BOOLEAN NOT NULL DEFAULT false;

-- 3. Allow webhook endpoint to insert without auth (public insert for brevo-webhook)
CREATE POLICY "Public insert email_events for webhooks"
  ON public.email_events FOR INSERT TO anon
  WITH CHECK (true);
