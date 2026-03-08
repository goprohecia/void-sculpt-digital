

# Plan d'implémentation — Système d'abonnement MBA + Espaces personnalisables + Pricing

Ce plan couvre les 3 demandes en une seule implémentation cohérente.

---

## 1. Base de données — Nouvelles tables

### Table `subscriptions`
Stocke l'abonnement de chaque organisation/admin :
- `id`, `user_id` (admin owner), `plan` (enum: starter/business/enterprise), `status` (active/cancelled/trial), `modules_limit` (3/6/null), `custom_modules` (jsonb — pour Enterprise : renommage des modules), `created_at`, `updated_at`, `expires_at`

### Table `custom_spaces`
Permet aux admins Enterprise de créer des espaces personnalisés au-delà d'Admin/Salarié/Client :
- `id`, `user_id` (admin owner), `name` (ex: "Conseillère"), `base_role` (employee/client — pour les permissions RLS), `enabled_modules` (jsonb — liste des module keys), `sort_order`, `created_at`

### Enum `subscription_plan`
`CREATE TYPE public.subscription_plan AS ENUM ('starter', 'business', 'enterprise');`

### RLS
- Admins full CRUD sur leurs propres subscriptions et custom_spaces (`user_id = auth.uid()`)
- Employees/Clients en lecture seule sur les custom_spaces de leur admin

---

## 2. Logique métier — Contraintes par plan

| | Starter (150€) | Business (250€) | Enterprise (400€) |
|---|---|---|---|
| Modules activables | 3 max | 6 max | Illimité |
| Espaces personnalisés | Non | Non | Oui |
| Renommage modules | Non | Non | Oui |
| Onboarding | — | Appel inclus | Appel dédié |
| White label | Non | Non | Oui |
| Module sur mesure | Non | Non | Sur devis |

---

## 3. Code Frontend — Modifications

### A. Hook `use-subscription.ts` (nouveau)
- Récupère le plan actif de l'admin connecté depuis la table `subscriptions`
- Expose : `plan`, `modulesLimit`, `canCustomizeSpaces`, `canRenameModules`, `isEnterprise`

### B. Modifier `use-app-settings.ts`
- Intégrer la limite de modules selon le plan : empêcher d'activer plus de modules que le plan le permet
- Afficher un message/upgrade prompt quand la limite est atteinte

### C. Modifier `AdminSettings.tsx` — Onglet Modules
- Ajouter un indicateur du plan actuel et du nombre de modules restants (ex: "3/6 modules activés")
- Griser les switches au-delà de la limite avec un badge "Upgrade"
- Section Espaces personnalisés (Enterprise only) : interface pour créer/renommer/supprimer des espaces avec drag-and-drop pour l'ordre

### D. Modifier `AdminSidebar.tsx`
- Respecter la limite de modules du plan
- Pour Enterprise : afficher les espaces personnalisés dans la navigation

### E. Nouveau composant `UpgradeBanner.tsx`
- Banner contextuel qui s'affiche quand l'admin tente une action réservée à un plan supérieur

### F. Mettre à jour `OffresSection.tsx` (page d'accueil)
- Remplacer les 3 packs actuels (Launch/Studio/Elite) par les 3 offres MBA :
  - **Starter** — 150€/mois — 3 modules au choix
  - **Business** — 250€/mois — 6 modules au choix + onboarding (recommandé)
  - **Enterprise** — 400€/mois — Tous les modules + White Label + espaces custom
- Ajouter la section "Inclus dans toutes les offres" (sous-domaine, multi-utilisateurs, signature électronique, Stripe Connect, etc.)
- Mettre à jour les prix annuels (2 mois offerts)

### G. Mettre à jour `PricingCard.tsx`
- Adapter les styles pour les 3 nouveaux tiers (starter/business/enterprise)
- Ajouter toggle mensuel/annuel

---

## 4. Ordre d'implémentation

1. Migration DB : enum `subscription_plan`, tables `subscriptions` et `custom_spaces` avec RLS
2. Hook `use-subscription.ts`
3. Modifier `use-app-settings.ts` pour intégrer les limites
4. Modifier `AdminSettings.tsx` (onglet modules avec limites + section espaces)
5. Modifier les sidebars pour respecter les contraintes
6. Refonte `OffresSection.tsx` et `PricingCard.tsx` avec les offres MBA
7. Composant `UpgradeBanner.tsx`

---

## 5. Ce qui n'est PAS inclus dans cette itération
- Paiement Stripe (sera une étape suivante)
- Système de sous-domaines personnalisés
- Fonctionnalité White Label complète (logo, couleurs custom)
- Gestion multi-tenant (isolation des données entre entreprises)

Ces éléments seront implémentés dans des itérations ultérieures.

