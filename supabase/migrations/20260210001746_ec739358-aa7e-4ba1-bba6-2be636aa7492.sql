
-- Table clients
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL DEFAULT '',
  entreprise TEXT NOT NULL DEFAULT '',
  siret TEXT,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  pays TEXT,
  statut TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  date_creation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  nombre_dossiers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can view all clients"
  ON public.clients FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert clients"
  ON public.clients FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clients"
  ON public.clients FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clients"
  ON public.clients FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Clients can view their own record
CREATE POLICY "Clients can view own record"
  ON public.clients FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
