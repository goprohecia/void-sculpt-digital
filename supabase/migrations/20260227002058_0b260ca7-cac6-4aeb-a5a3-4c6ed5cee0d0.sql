
-- ===== 1. GESTION DE STOCK =====

-- Catégories de produits
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text DEFAULT '',
  couleur text DEFAULT '#6366f1',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access product_categories" ON public.product_categories FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees can view product_categories" ON public.product_categories FOR SELECT TO authenticated USING (has_role(auth.uid(), 'employee'));

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fournisseurs
CREATE TABLE public.fournisseurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  email text DEFAULT '',
  telephone text DEFAULT '',
  adresse text DEFAULT '',
  ville text DEFAULT '',
  pays text DEFAULT 'France',
  notes text DEFAULT '',
  statut text NOT NULL DEFAULT 'actif',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fournisseurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access fournisseurs" ON public.fournisseurs FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees can view fournisseurs" ON public.fournisseurs FOR SELECT TO authenticated USING (has_role(auth.uid(), 'employee'));

CREATE TRIGGER update_fournisseurs_updated_at BEFORE UPDATE ON public.fournisseurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Produits
CREATE TABLE public.produits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  nom text NOT NULL,
  description text DEFAULT '',
  categorie_id uuid REFERENCES public.product_categories(id) ON DELETE SET NULL,
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  prix_achat numeric NOT NULL DEFAULT 0,
  prix_vente numeric NOT NULL DEFAULT 0,
  quantite_stock integer NOT NULL DEFAULT 0,
  seuil_alerte integer NOT NULL DEFAULT 5,
  unite text DEFAULT 'unité',
  sku text DEFAULT '',
  statut text NOT NULL DEFAULT 'actif',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.produits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access produits" ON public.produits FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees can view produits" ON public.produits FOR SELECT TO authenticated USING (has_role(auth.uid(), 'employee'));
CREATE POLICY "Employees can update stock produits" ON public.produits FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'employee'));

CREATE TRIGGER update_produits_updated_at BEFORE UPDATE ON public.produits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Mouvements de stock (historique)
CREATE TABLE public.stock_mouvements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produit_id uuid NOT NULL REFERENCES public.produits(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'entree', 'sortie', 'ajustement'
  quantite integer NOT NULL,
  motif text DEFAULT '',
  reference_doc text DEFAULT '',
  effectue_par uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.stock_mouvements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access stock_mouvements" ON public.stock_mouvements FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees can view stock_mouvements" ON public.stock_mouvements FOR SELECT TO authenticated USING (has_role(auth.uid(), 'employee'));
CREATE POLICY "Employees can insert stock_mouvements" ON public.stock_mouvements FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'employee'));

-- Bons de commande fournisseur
CREATE TABLE public.bons_commande (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  fournisseur_id uuid NOT NULL REFERENCES public.fournisseurs(id) ON DELETE RESTRICT,
  statut text NOT NULL DEFAULT 'brouillon', -- brouillon, envoyee, livree, annulee
  montant_total numeric NOT NULL DEFAULT 0,
  date_commande timestamptz NOT NULL DEFAULT now(),
  date_livraison_prevue timestamptz,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bons_commande ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access bons_commande" ON public.bons_commande FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees can view bons_commande" ON public.bons_commande FOR SELECT TO authenticated USING (has_role(auth.uid(), 'employee'));

CREATE TRIGGER update_bons_commande_updated_at BEFORE UPDATE ON public.bons_commande FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Lignes de bon de commande
CREATE TABLE public.bon_commande_lignes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bon_commande_id uuid NOT NULL REFERENCES public.bons_commande(id) ON DELETE CASCADE,
  produit_id uuid NOT NULL REFERENCES public.produits(id) ON DELETE RESTRICT,
  quantite integer NOT NULL DEFAULT 1,
  prix_unitaire numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bon_commande_lignes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access bon_commande_lignes" ON public.bon_commande_lignes FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees can view bon_commande_lignes" ON public.bon_commande_lignes FOR SELECT TO authenticated USING (has_role(auth.uid(), 'employee'));

-- ===== 2. TAGS CLIENTS =====

CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  couleur text DEFAULT '#6366f1',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access tags" ON public.tags FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees can view tags" ON public.tags FOR SELECT TO authenticated USING (has_role(auth.uid(), 'employee'));

CREATE TABLE public.client_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, tag_id)
);
ALTER TABLE public.client_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access client_tags" ON public.client_tags FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees can view client_tags" ON public.client_tags FOR SELECT TO authenticated USING (has_role(auth.uid(), 'employee'));
