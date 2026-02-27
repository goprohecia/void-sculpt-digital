
# Plan d'ajout des fonctionnalites manquantes

Ce plan couvre les fonctionnalites demandees dans votre cahier des charges qui ne sont pas encore presentes dans les espaces existants.

---

## 1. Produits / Services (AdminStock) -- Ajout de la marge

**Actuellement** : Le stock affiche deja prix achat, prix vente, categories, fournisseurs, mouvements, bons de commande.

**A ajouter** :
- Colonne **Marge** calculee automatiquement (prix_vente - prix_achat) dans le tableau produits
- Colonne **Marge %** pour la rentabilite

---

## 2. Dossiers (AdminDossiers) -- Filtres avances

**Actuellement** : Filtre par statut et recherche texte (reference, client, prestation).

**A ajouter** :
- Filtre par **tag client** (via la relation client_tags)
- Filtre par **montant** (au-dessus de / en dessous de X euros) avec deux champs min/max
- Filtre par **personne associee** (employee assigne) -- necessite d'ajouter un champ `employee_id` a la table `dossiers` via migration
- Affichage du nom de l'employe assigne dans le tableau

**Migration SQL** :
```text
ALTER TABLE public.dossiers ADD COLUMN employee_id uuid REFERENCES public.employees(id);
```

---

## 3. Salaries (AdminEmployees) -- Acces modules + donnees d'activite

**Actuellement** : Liste des salaries avec nom, email, poste, statut, date d'embauche.

**A ajouter** :
- Colonne **Modules** affichant les modules accessibles du salarie (depuis `acces_modules` en DB)
- Bouton pour **modifier les acces modules** de chaque salarie individuellement (dialog avec checkboxes)
- Section **Activite** : nombre de dossiers assignes, derniere connexion

---

## 4. Facturation (AdminBilling) -- Personnalisation facture

**Actuellement** : Creation/apercu/export PDF de factures et devis.

**A ajouter** :
- Champs de personnalisation dans les Parametres entreprise (logo URL, mentions legales, coordonnees bancaires) qui seront utilises dans le PDF genere
- Mise a jour de `generatePdf.ts` pour integrer ces informations dans le template PDF

---

## 5. Relances (AdminReminders) -- Template pre-enregistre + facture jointe

**Actuellement** : Bouton "Envoyer" qui envoie un email de relance avec un texte fixe.

**A ajouter** :
- **Templates de relance** : possibilite de sauvegarder des templates (table `email_templates` en DB)
- Selection du template avant envoi dans un dialog
- La facture est mentionnee automatiquement (deja fait via `factureRef`)

**Migration SQL** :
```text
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  sujet text NOT NULL DEFAULT '',
  contenu text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'relance',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access email_templates" ON public.email_templates
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
```

---

## 6. Calendrier / Rendez-vous (AdminRendezVous) -- Planning employes

**Actuellement** : Calendrier avec events Calendly uniquement.

**A ajouter** :
- Possibilite de **creer un evenement manuellement** (rdv, evenement interne) via un dialog
- Affichage des evenements manuels dans le calendrier a cote des events Calendly
- Champ "employe assigne" pour chaque evenement

Necessite une table `events_manuels` :
```text
CREATE TABLE public.events_manuels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text DEFAULT '',
  date timestamptz NOT NULL,
  heure text NOT NULL DEFAULT '09:00',
  duree integer NOT NULL DEFAULT 60,
  employee_id uuid REFERENCES public.employees(id),
  client_id uuid REFERENCES public.clients(id),
  type text NOT NULL DEFAULT 'rdv',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events_manuels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access events_manuels" ON public.events_manuels
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Employees view own events" ON public.events_manuels
  FOR SELECT USING (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));
```

---

## 7. Analyse (AdminAnalytics) -- Depenses + comparatif

**Actuellement** : CA, encaissements, dossiers, graphiques de tendances, repartition paiements, ventes par type, support.

**A ajouter** :
- Section **Depenses** : KPI depenses totales + graphique depenses vs recettes
- Necessite une table `depenses` ou utilisation des bons de commande existants comme source de depenses
- Graphique compare **recettes vs depenses** par mois

---

## 8. Emails (AdminEmails) -- Envoi classique + masse + templates + programmation

**Actuellement** : Journal des emails envoyes avec filtres.

**A ajouter** :
- Bouton **Composer un email** : dialog pour envoyer un email individuel ou groupé avec selection de destinataires (filtres par tag, segment, statut)
- Onglet **Templates** : CRUD de templates d'emails reutilisables (partage avec relances)
- Option **Programmer un envoi** : champ date/heure pour envoi differe (stocke en DB, traite par cron/edge function)
- Aide IA a la redaction (bouton "Suggerer" qui utilise Lovable AI)

---

## 9. Messagerie (AdminMessaging) -- Messagerie avec salaries

**Actuellement** : Messagerie avec les clients uniquement.

**A ajouter** :
- **Onglet Salaries** dans la messagerie pour permettre les echanges admin-salarie
- Reutilisation du meme composant de conversation avec un filtre "Clients / Salaries"

---

## 10. Support (AdminSupport) -- Reception emails

**Actuellement** : Systeme de tickets avec messages internes.

**Deja fonctionnel** : Les tickets peuvent etre crees depuis l'espace client et depuis le site. Aucun ajout majeur requis.

---

## 11. Parametres (AdminSettings) -- Controle de visibilite

**Actuellement** : Modules admin/client/salarie avec toggles, profil, entreprise, notifications.

**Deja fonctionnel** : Le controle de visibilite des modules cote client et salarie est deja en place dans l'onglet Modules.

---

## Resumee des modifications par fichier

| Fichier | Modifications |
|---------|--------------|
| `AdminStock.tsx` | Ajout colonne marge |
| `AdminDossiers.tsx` | Filtres tag, montant, employe assigne |
| `AdminEmployees.tsx` | Acces modules, activite |
| `AdminBilling.tsx` | Personnalisation facture (logo, mentions) |
| `AdminReminders.tsx` | Templates de relance |
| `AdminRendezVous.tsx` | Creation evenements manuels |
| `AdminAnalytics.tsx` | Section depenses vs recettes |
| `AdminEmails.tsx` | Composer email, templates, programmation, aide IA |
| `AdminMessaging.tsx` | Onglet salaries |
| Migration DB | `employee_id` sur dossiers, `email_templates`, `events_manuels` |

## Ordre d'implementation

1. Migrations DB (3 tables/colonnes)
2. Modifications simples (marge stock, filtres dossiers)
3. Features moyennes (acces employes, templates, events manuels)
4. Features complexes (composer email, depenses, messagerie salaries)

> Ce plan est consequent. Je recommande de l'approuver pour que je l'implemente etape par etape, en commencant par les migrations puis les modifications de chaque page.
