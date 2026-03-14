
-- Create metier_vocabulaire table
CREATE TABLE public.metier_vocabulaire (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compte_id uuid,
  metier_id text NOT NULL,
  champ text NOT NULL,
  label_custom text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(compte_id, metier_id, champ)
);

ALTER TABLE public.metier_vocabulaire ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access metier_vocabulaire" ON public.metier_vocabulaire FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can read metier_vocabulaire" ON public.metier_vocabulaire FOR SELECT TO authenticated
  USING (true);

-- Restrictive tenant isolation
CREATE POLICY "tenant_isolation_metier_vocabulaire" ON public.metier_vocabulaire FOR ALL TO public
  USING ((compte_id IS NULL) OR (compte_id = get_user_compte_id()))
  WITH CHECK ((compte_id IS NULL) OR (compte_id = get_user_compte_id()));

-- Trigger for compte_id
CREATE TRIGGER set_compte_id_metier_vocabulaire BEFORE INSERT ON public.metier_vocabulaire
  FOR EACH ROW EXECUTE FUNCTION set_compte_id_on_insert();

-- Add 'creer_clients' permission if not exists
INSERT INTO public.permissions (code, categorie, description_lisible)
VALUES ('creer_clients', 'clients', 'Créer des clients')
ON CONFLICT DO NOTHING;

-- Seed default vocabulary (global, compte_id = NULL)
INSERT INTO public.metier_vocabulaire (compte_id, metier_id, champ, label_custom) VALUES
(NULL, 'garages', 'dossier', 'Véhicule'),
(NULL, 'garages', 'dossiers', 'Véhicules'),
(NULL, 'immobilier', 'dossier', 'Mandat'),
(NULL, 'immobilier', 'dossiers', 'Mandats'),
(NULL, 'cabinets', 'dossier', 'Affaire'),
(NULL, 'cabinets', 'dossiers', 'Affaires'),
(NULL, 'cabinet-avocats', 'dossier', 'Affaire'),
(NULL, 'cabinet-avocats', 'dossiers', 'Affaires'),
(NULL, 'btp', 'dossier', 'Chantier'),
(NULL, 'btp', 'dossiers', 'Chantiers'),
(NULL, 'coiffure', 'dossier', 'Prestation'),
(NULL, 'coiffure', 'dossiers', 'Prestations'),
(NULL, 'coach-sportif', 'dossier', 'Séance'),
(NULL, 'coach-sportif', 'dossiers', 'Séances'),
(NULL, 'photographe', 'dossier', 'Shooting'),
(NULL, 'photographe', 'dossiers', 'Shootings'),
(NULL, 'mariage', 'dossier', 'Mariage'),
(NULL, 'mariage', 'dossiers', 'Mariages'),
(NULL, 'evenementiel', 'dossier', 'Événement'),
(NULL, 'evenementiel', 'dossiers', 'Événements'),
(NULL, 'nettoyage', 'dossier', 'Intervention'),
(NULL, 'nettoyage', 'dossiers', 'Interventions'),
(NULL, 'traiteur', 'dossier', 'Commande'),
(NULL, 'traiteur', 'dossiers', 'Commandes'),
(NULL, 'reparateur', 'dossier', 'Réparation'),
(NULL, 'reparateur', 'dossiers', 'Réparations'),
(NULL, 'auto-ecole', 'dossier', 'Élève'),
(NULL, 'auto-ecole', 'dossiers', 'Élèves'),
(NULL, 'formateur', 'dossier', 'Formation'),
(NULL, 'formateur', 'dossiers', 'Formations'),
(NULL, 'consultant', 'dossier', 'Mission'),
(NULL, 'consultant', 'dossiers', 'Missions'),
(NULL, 'developpeur', 'dossier', 'Projet'),
(NULL, 'developpeur', 'dossiers', 'Projets'),
(NULL, 'designer', 'dossier', 'Projet'),
(NULL, 'designer', 'dossiers', 'Projets'),
(NULL, 'community-manager', 'dossier', 'Mandat'),
(NULL, 'community-manager', 'dossiers', 'Mandats'),
(NULL, 'dj-animateur', 'dossier', 'Prestation'),
(NULL, 'dj-animateur', 'dossiers', 'Prestations'),
(NULL, 'boutique', 'dossier', 'Commande'),
(NULL, 'boutique', 'dossiers', 'Commandes'),
(NULL, 'conciergerie', 'dossier', 'Service'),
(NULL, 'conciergerie', 'dossiers', 'Services'),
(NULL, 'cabinet-recrutement', 'dossier', 'Recrutement'),
(NULL, 'cabinet-recrutement', 'dossiers', 'Recrutements'),
(NULL, 'expert-comptable', 'dossier', 'Dossier comptable'),
(NULL, 'expert-comptable', 'dossiers', 'Dossiers comptables')
ON CONFLICT DO NOTHING;
