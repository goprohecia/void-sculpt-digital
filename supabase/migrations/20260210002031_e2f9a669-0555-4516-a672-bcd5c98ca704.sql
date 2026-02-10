
-- =============================================
-- DOSSIERS
-- =============================================
CREATE TABLE public.dossiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_nom TEXT NOT NULL,
  type_prestation TEXT NOT NULL,
  montant NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_cours', 'termine', 'en_attente', 'annule')),
  date_creation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_echeance TIMESTAMP WITH TIME ZONE,
  preview_url TEXT,
  demande_id UUID,
  rdv_effectue BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all dossiers" ON public.dossiers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert dossiers" ON public.dossiers FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update dossiers" ON public.dossiers FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete dossiers" ON public.dossiers FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own dossiers" ON public.dossiers FOR SELECT
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE TRIGGER update_dossiers_updated_at BEFORE UPDATE ON public.dossiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- FACTURES
-- =============================================
CREATE TABLE public.factures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_nom TEXT NOT NULL,
  dossier_id UUID REFERENCES public.dossiers(id) ON DELETE SET NULL,
  montant NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('payee', 'en_attente', 'en_retard')),
  date_emission TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_echeance TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.factures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all factures" ON public.factures FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert factures" ON public.factures FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update factures" ON public.factures FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete factures" ON public.factures FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own factures" ON public.factures FOR SELECT
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON public.factures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- DEVIS
-- =============================================
CREATE TABLE public.devis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_nom TEXT NOT NULL,
  dossier_id UUID REFERENCES public.dossiers(id) ON DELETE SET NULL,
  titre TEXT NOT NULL,
  montant NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('accepte', 'en_attente', 'refuse', 'expire')),
  date_emission TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_validite TIMESTAMP WITH TIME ZONE NOT NULL,
  signature_url TEXT,
  signataire_nom TEXT,
  date_signature TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all devis" ON public.devis FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert devis" ON public.devis FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update devis" ON public.devis FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete devis" ON public.devis FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own devis" ON public.devis FOR SELECT
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can update own devis" ON public.devis FOR UPDATE
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE TRIGGER update_devis_updated_at BEFORE UPDATE ON public.devis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- RELANCES
-- =============================================
CREATE TABLE public.relances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facture_id UUID NOT NULL REFERENCES public.factures(id) ON DELETE CASCADE,
  facture_ref TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_nom TEXT NOT NULL,
  montant NUMERIC NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'a_envoyer' CHECK (statut IN ('a_envoyer', 'envoyee', 'reponse_recue')),
  date_relance TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_prochaine TIMESTAMP WITH TIME ZONE,
  type TEXT NOT NULL DEFAULT 'Email',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.relances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all relances" ON public.relances FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert relances" ON public.relances FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update relances" ON public.relances FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete relances" ON public.relances FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_relances_updated_at BEFORE UPDATE ON public.relances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- CONVERSATIONS
-- =============================================
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_nom TEXT NOT NULL,
  sujet TEXT NOT NULL,
  non_lus INTEGER NOT NULL DEFAULT 0,
  dernier_message TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all conversations" ON public.conversations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert conversations" ON public.conversations FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update conversations" ON public.conversations FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete conversations" ON public.conversations FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own conversations" ON public.conversations FOR SELECT
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can update own conversations" ON public.conversations FOR UPDATE
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert messages" ON public.messages FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own messages" ON public.messages FOR SELECT
  USING (conversation_id IN (
    SELECT c.id FROM public.conversations c
    JOIN public.clients cl ON c.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));
CREATE POLICY "Clients can insert own messages" ON public.messages FOR INSERT
  WITH CHECK (conversation_id IN (
    SELECT c.id FROM public.conversations c
    JOIN public.clients cl ON c.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- =============================================
-- DEMANDES
-- =============================================
CREATE TABLE public.demandes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_nom TEXT NOT NULL,
  titre TEXT NOT NULL,
  type_prestation TEXT NOT NULL DEFAULT 'Autre',
  description TEXT NOT NULL DEFAULT '',
  budget TEXT,
  statut TEXT NOT NULL DEFAULT 'nouvelle' CHECK (statut IN ('nouvelle', 'en_revue', 'validee', 'refusee')),
  date_creation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_mise_a_jour TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.demandes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all demandes" ON public.demandes FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert demandes" ON public.demandes FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update demandes" ON public.demandes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete demandes" ON public.demandes FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own demandes" ON public.demandes FOR SELECT
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can insert own demandes" ON public.demandes FOR INSERT
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE TRIGGER update_demandes_updated_at BEFORE UPDATE ON public.demandes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- CAHIERS DES CHARGES
-- =============================================
CREATE TABLE public.cahiers_des_charges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  demande_id UUID NOT NULL REFERENCES public.demandes(id) ON DELETE CASCADE,
  contexte TEXT NOT NULL DEFAULT '',
  public_cible TEXT NOT NULL DEFAULT '',
  fonctionnalites TEXT[] NOT NULL DEFAULT '{}',
  design_notes TEXT NOT NULL DEFAULT '',
  contraintes_techniques TEXT NOT NULL DEFAULT '',
  planning_souhaite TEXT NOT NULL DEFAULT '',
  budget_complementaire TEXT NOT NULL DEFAULT '',
  remarques TEXT NOT NULL DEFAULT '',
  commentaires_admin TEXT,
  motif_rejet TEXT,
  nb_rejets INTEGER NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'complet', 'validé', 'rejeté')),
  date_mise_a_jour TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cahiers_des_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all cdc" ON public.cahiers_des_charges FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert cdc" ON public.cahiers_des_charges FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update cdc" ON public.cahiers_des_charges FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete cdc" ON public.cahiers_des_charges FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own cdc" ON public.cahiers_des_charges FOR SELECT
  USING (demande_id IN (
    SELECT d.id FROM public.demandes d
    JOIN public.clients cl ON d.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));
CREATE POLICY "Clients can update own cdc" ON public.cahiers_des_charges FOR UPDATE
  USING (demande_id IN (
    SELECT d.id FROM public.demandes d
    JOIN public.clients cl ON d.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));
CREATE POLICY "Clients can insert own cdc" ON public.cahiers_des_charges FOR INSERT
  WITH CHECK (demande_id IN (
    SELECT d.id FROM public.demandes d
    JOIN public.clients cl ON d.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));

CREATE TRIGGER update_cdc_updated_at BEFORE UPDATE ON public.cahiers_des_charges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- HISTORIQUE CDC
-- =============================================
CREATE TABLE public.cdc_historique (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cahier_id UUID NOT NULL REFERENCES public.cahiers_des_charges(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('creation', 'mise_a_jour', 'soumission', 'commentaire_admin', 'validation', 'rejet')),
  auteur TEXT NOT NULL CHECK (auteur IN ('client', 'admin')),
  description TEXT NOT NULL DEFAULT '',
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cdc_historique ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all cdc_historique" ON public.cdc_historique FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert cdc_historique" ON public.cdc_historique FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own cdc_historique" ON public.cdc_historique FOR SELECT
  USING (cahier_id IN (
    SELECT cdc.id FROM public.cahiers_des_charges cdc
    JOIN public.demandes d ON cdc.demande_id = d.id
    JOIN public.clients cl ON d.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));
CREATE POLICY "Clients can insert own cdc_historique" ON public.cdc_historique FOR INSERT
  WITH CHECK (cahier_id IN (
    SELECT cdc.id FROM public.cahiers_des_charges cdc
    JOIN public.demandes d ON cdc.demande_id = d.id
    JOIN public.clients cl ON d.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('dossier', 'facture', 'message', 'devis', 'ticket')),
  titre TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  lu BOOLEAN NOT NULL DEFAULT false,
  lien TEXT NOT NULL DEFAULT '',
  destinataire TEXT NOT NULL CHECK (destinataire IN ('admin', 'client', 'all')),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin notifications" ON public.notifications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') AND (destinataire = 'admin' OR destinataire = 'all'));
CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update notifications" ON public.notifications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own notifications" ON public.notifications FOR SELECT
  USING (
    (destinataire = 'client' OR destinataire = 'all')
    AND client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );
CREATE POLICY "Clients can update own notifications" ON public.notifications FOR UPDATE
  USING (
    (destinataire = 'client' OR destinataire = 'all')
    AND client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =============================================
-- TICKETS SUPPORT
-- =============================================
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_nom TEXT NOT NULL,
  sujet TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  priorite TEXT NOT NULL DEFAULT 'normale' CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')),
  statut TEXT NOT NULL DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'en_cours', 'resolu', 'ferme')),
  date_creation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_mise_a_jour TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all tickets" ON public.tickets FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert tickets" ON public.tickets FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tickets" ON public.tickets FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tickets" ON public.tickets FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own tickets" ON public.tickets FOR SELECT
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can insert own tickets" ON public.tickets FOR INSERT
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can update own tickets" ON public.tickets FOR UPDATE
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TICKET MESSAGES
-- =============================================
CREATE TABLE public.ticket_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all ticket_messages" ON public.ticket_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert ticket_messages" ON public.ticket_messages FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own ticket_messages" ON public.ticket_messages FOR SELECT
  USING (ticket_id IN (
    SELECT t.id FROM public.tickets t
    JOIN public.clients cl ON t.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));
CREATE POLICY "Clients can insert own ticket_messages" ON public.ticket_messages FOR INSERT
  WITH CHECK (ticket_id IN (
    SELECT t.id FROM public.tickets t
    JOIN public.clients cl ON t.client_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));

-- =============================================
-- PREVIEW VISITS (tracking)
-- =============================================
CREATE TABLE public.preview_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dossier_id UUID NOT NULL REFERENCES public.dossiers(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device TEXT NOT NULL DEFAULT 'desktop' CHECK (device IN ('desktop', 'mobile', 'tablet'))
);

ALTER TABLE public.preview_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all preview_visits" ON public.preview_visits FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert preview_visits" ON public.preview_visits FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert preview_visits" ON public.preview_visits FOR INSERT WITH CHECK (true);

-- =============================================
-- EMAIL LOGS
-- =============================================
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('relance', 'devis', 'paiement', 'demande', 'validation')),
  destinataire TEXT NOT NULL,
  sujet TEXT NOT NULL,
  contenu TEXT NOT NULL DEFAULT '',
  date_envoi TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  reference TEXT
);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all email_logs" ON public.email_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert email_logs" ON public.email_logs FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- SEND LOGS (facture/devis transmission history)
-- =============================================
CREATE TABLE public.send_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('facture', 'devis')),
  doc_reference TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_nom TEXT NOT NULL,
  date_envoi TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.send_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all send_logs" ON public.send_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert send_logs" ON public.send_logs FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- DONNÉES ANALYTIQUES MENSUELLES
-- =============================================
CREATE TABLE public.donnees_mensuelles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mois TEXT NOT NULL,
  annee INTEGER NOT NULL DEFAULT 2026,
  objectif NUMERIC NOT NULL DEFAULT 0,
  ca_total NUMERIC NOT NULL DEFAULT 0,
  encaissements NUMERIC NOT NULL DEFAULT 0,
  dossiers INTEGER NOT NULL DEFAULT 0,
  panier_moyen NUMERIC NOT NULL DEFAULT 0,
  conversion NUMERIC NOT NULL DEFAULT 0,
  nouveaux_clients INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (mois, annee)
);

ALTER TABLE public.donnees_mensuelles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view donnees_mensuelles" ON public.donnees_mensuelles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert donnees_mensuelles" ON public.donnees_mensuelles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update donnees_mensuelles" ON public.donnees_mensuelles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_donnees_mensuelles_updated_at BEFORE UPDATE ON public.donnees_mensuelles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
