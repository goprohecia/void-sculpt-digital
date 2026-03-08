

# Plan — Corrections vitrine MBA : routing, FAQ, nettoyage legacy, secteurs

## 1. Fix route `/` → Site vitrine

**`AnimatedRoutes.tsx`** : Remplacer `<Navigate to="/client/login" />` par `<Index />` (import de `src/pages/Index.tsx`). Ajouter route `/contact` vers `Contact.tsx`. Supprimer les routes legacy (`/services/*`, `/portfolio/*`, `/studio`).

## 2. FAQ MBA

**`FAQ.tsx`** : Remplacer les 6 questions Impartial par des questions CRM SaaS :
- "Qu'est-ce que MBA ?" — Plateforme CRM modulaire multi-sectorielle
- "Combien de modules puis-je activer ?" — Starter 3, Business 6, Enterprise illimité
- "Puis-je changer d'offre ?" — Upgrade/downgrade à tout moment
- "Comment se passe l'onboarding ?" — Inscription, choix des modules, invitation équipe
- "Mes données sont-elles sécurisées ?" — Hébergement cloud, chiffrement, RLS
- "Puis-je personnaliser les espaces ?" — Enterprise only, espaces et modules sur mesure
- Mettre à jour le CTA vers `/contact?subject=Question%20MBA`

## 3. Page Contact → Demande de démo MBA

**`Contact.tsx`** :
- Remplacer "Parlons de votre projet" par "Demandez votre démo MBA"
- Remplacer le champ "Sujet" par un select : Demande de démo / Question sur les offres / Support / Autre
- Remplacer l'email `studio@impartialgames.com` par `contact@mybusinessassistant.com`
- Supprimer la section Newsletter (pas pertinente pour un SaaS)
- Garder le Calendly

## 4. Nettoyage routes legacy

**`AnimatedRoutes.tsx`** : Supprimer les imports et routes pour les pages obsolètes. Ajouter des redirections `<Navigate>` pour `/services/*` et `/portfolio/*` vers `/` pour éviter les 404.

## 5. Pages secteurs dédiées (4 nouvelles pages)

Créer 4 pages dans `src/pages/secteurs/` :

### A. `Conciergerie.tsx`
- Hero : "MBA pour la Conciergerie & Gestion locative"
- Cas d'usage : Gestion des biens, suivi locataires, interventions, facturation propriétaires
- Modules recommandés : Dossiers, Clients, Facturation, Messagerie, Support
- CTA : Demander une démo

### B. `Immobilier.tsx`
- Hero : "MBA pour les Agences immobilières"
- Cas d'usage : Suivi mandats, dossiers acquéreurs/vendeurs, signature électronique, relances
- Modules recommandés : Clients, Dossiers, Devis, Facturation, Analyse

### C. `Garages.tsx`
- Hero : "MBA pour les Garages & Carrosseries"
- Cas d'usage : Gestion véhicules, devis réparations, stock pièces, suivi atelier
- Modules recommandés : Stock, Dossiers, Devis, Facturation, Clients

### D. `BTP.tsx`
- Hero : "MBA pour le BTP & Artisans"
- Cas d'usage : Gestion chantiers, devis/factures, équipes terrain, stock matériaux
- Modules recommandés : Dossiers, Stock, Facturation, Calendrier, Messagerie

**Structure commune** : Layout + Hero + 3-4 blocs cas d'usage avec icônes + section modules recommandés + CTA démo. Composant réutilisable `SectorPage` pour éviter la duplication.

### Routes
Ajouter dans `AnimatedRoutes.tsx` :
- `/secteurs/conciergerie`
- `/secteurs/immobilier`
- `/secteurs/garages`
- `/secteurs/btp`

### Navigation
**`ServicesSection.tsx`** : Transformer les cartes secteurs en liens cliquables vers les pages dédiées.
**`Header.tsx`** : Le lien "Secteurs" pointe déjà vers `/#secteurs`, OK.

## 6. Fichiers impactés

| Fichier | Action |
|---|---|
| `AnimatedRoutes.tsx` | Fix route `/`, ajouter `/contact`, `/secteurs/*`, redirections legacy |
| `FAQ.tsx` | Réécrire contenu MBA |
| `Contact.tsx` | Rebrand démo MBA |
| `src/pages/secteurs/SectorPage.tsx` | **Créer** — Composant réutilisable |
| `src/pages/secteurs/Conciergerie.tsx` | **Créer** |
| `src/pages/secteurs/Immobilier.tsx` | **Créer** |
| `src/pages/secteurs/Garages.tsx` | **Créer** |
| `src/pages/secteurs/BTP.tsx` | **Créer** |
| `ServicesSection.tsx` | Ajouter liens vers pages secteurs |

