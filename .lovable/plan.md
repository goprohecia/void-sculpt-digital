

# Plan — Système d'abonnement + Espaces personnalisables + Site vitrine MBA

## État actuel

**Déjà fait :**
- DB : tables `subscriptions` et `custom_spaces` existent avec RLS
- Hook `use-subscription.ts` fonctionnel (Starter 3 / Business 6 / Enterprise illimité)
- `AdminSettings.tsx` : onglet Modules avec gating par plan, UpgradeBanner
- `OffresSection.tsx` : 3 offres MBA avec toggle mensuel/annuel

**À faire :**
- Espaces personnalisés : le CRUD UI est un placeholder "bientôt disponible"
- Site vitrine : le Hero dit "IMPARTIAL GAMES" et parle de "web agency". Tout le contenu (Hero, ProofStrip, Services, Méthode, Principes, Réalisations, CTA, Header, Footer) doit être rebrandé pour présenter MBA comme un **CRM SaaS modulaire multi-sectoriel**

---

## 1. Espaces personnalisables (Enterprise only)

### Dans `AdminSettings.tsx` — Remplacer le placeholder par un vrai CRUD

- Formulaire : nom de l'espace + base_role (salarié/client) + modules à activer
- Liste des espaces créés avec boutons renommer / supprimer
- Hook `use-custom-spaces.ts` : CRUD sur la table `custom_spaces` (query + mutations)
- Limité aux admins Enterprise (déjà gatté par `canCustomizeSpaces`)

### Dans `AdminSidebar.tsx`
- Pour Enterprise : afficher les custom spaces dans une section dédiée de la navigation

---

## 2. Refonte complète du site vitrine MBA

Transformer le site d'une agence web ("Impartial Games") en **site vitrine SaaS pour MBA**.

### A. `HeroPremium.tsx` — Nouveau Hero MBA
- Titre : "Votre CRM. Votre métier. **Votre assistant.**"
- Sous-titre : "La plateforme de gestion modulaire pour les entreprises de services."
- CTA principal : "Essayer gratuitement" → `/contact?subject=Demo%20MBA`
- CTA secondaire : "Découvrir les offres" → `#offres`
- Supprimer toute référence à "Impartial Games"

### B. `ProofStrip.tsx` — Proof points MBA
- Remplacer par : "Multi-sectoriel" / "Modulaire" / "White Label" / "Support réactif"

### C. `ServicesSection.tsx` → Rebaptiser en "Secteurs d'activité"
- Remplacer les 4 services web par les secteurs cibles :
  - Conciergerie & Gestion locative
  - Agences immobilières
  - Garages & Carrosseries
  - BTP & Artisans
- Chaque carte avec icône, titre, description courte

### D. `RealisationsSection.tsx` → "Fonctionnalités clés"
- Remplacer le portfolio par une vitrine des modules MBA :
  - Gestion clients, Dossiers, Facturation, Messagerie, Support, Stock, Analyse
- Avec des descriptions et icônes adaptées

### E. `MethodeSection.tsx` → "Comment ça marche"
- 4 étapes : Inscription → Configuration des modules → Invitation de l'équipe → C'est parti !

### F. `PrincipesSection.tsx` → "Pourquoi MBA"
- Valeurs : Modulaire / Multi-rôles / Sécurisé / Simple / Évolutif

### G. `CTAFinal.tsx` — CTA MBA
- "Prêt à simplifier votre gestion ?"
- Boutons : "Demander une démo" + "Voir les offres"
- Supprimer email impartialgames

### H. `Header.tsx` — Navigation MBA
- Remplacer les liens Services (web/mobile/backoffice/360) par : Fonctionnalités / Secteurs / Offres
- Garder le CTA "Essayer MBA"

### I. `Footer.tsx` — Footer MBA
- Déjà partiellement rebrandé "MY BUSINESS ASSISTANT"
- Mettre à jour les liens (Fonctionnalités, Secteurs, Offres au lieu de services web)

### J. `Index.tsx` — Réordonner les sections
- Hero → ProofStrip → Secteurs → Fonctionnalités → Offres → Comment ça marche → Pourquoi MBA → FAQ → CTA

---

## 3. Fichiers impactés

| Fichier | Action |
|---|---|
| `src/hooks/use-custom-spaces.ts` | **Créer** — CRUD hook |
| `src/pages/admin/AdminSettings.tsx` | **Modifier** — UI espaces personnalisés |
| `src/components/admin/AdminSidebar.tsx` | **Modifier** — Afficher custom spaces |
| `src/components/sections/HeroPremium.tsx` | **Modifier** — Rebrand MBA |
| `src/components/sections/ProofStrip.tsx` | **Modifier** — Rebrand MBA |
| `src/components/sections/ServicesSection.tsx` | **Modifier** — Secteurs d'activité |
| `src/components/sections/RealisationsSection.tsx` | **Modifier** — Fonctionnalités |
| `src/components/sections/MethodeSection.tsx` | **Modifier** — Comment ça marche |
| `src/components/sections/PrincipesSection.tsx` | **Modifier** — Pourquoi MBA |
| `src/components/sections/CTAFinal.tsx` | **Modifier** — CTA MBA |
| `src/components/Header.tsx` | **Modifier** — Nav MBA |
| `src/components/Footer.tsx` | **Modifier** — Footer MBA |
| `src/pages/Index.tsx` | **Modifier** — Réordonnancement sections |

Aucune migration DB nécessaire — les tables existent déjà.

