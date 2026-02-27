-- Add segment column to clients table
ALTER TABLE public.clients ADD COLUMN segment text NOT NULL DEFAULT 'client';

-- Add an index for filtering
CREATE INDEX idx_clients_segment ON public.clients (segment);