

## Module 13 — Upgrade plutôt que swap

### Audit actuel

1. **UpgradeBanner** existe (`src/components/admin/UpgradeBanner.tsx`) mais est générique (feature + requiredPlan). Il ne correspond pas au spec Module 13 : pas de texte contextuel par plan, pas de lien "En savoir plus sur le swap", pas de lien vers page comparatif.
2. **ModulesTab** n'utilise pas ce banner. Le seul CTA upgrade est un petit lien dans la zone de blocage (swaps = 0).
3. **Aucune page comparatif/upgrade** n'existe côté client. `ClientPaiement` gère le paiement de factures, pas les abonnements.
4. **Aucune route** `/client/upgrade` dans `AnimatedRoutes.tsx`.

### Plan d'implémentation

#### 1. Refonte du composant `UpgradeBanner` → nouveau composant dédié swap

Créer `src/components/client/SwapUpgradeBanner.tsx` (ne pas toucher au banner admin existant) :

- Style informatif neutre : `bg-primary/5 border border-primary/20`, icône `Sparkles`
- Titre : "Vous souhaitez ajouter un module sans en perdre un ? Passez à l'offre supérieure."
- Contenu dynamique selon `demoPlan` :
  - **Starter** → "Passez à Business : 3 modules actifs → 6 modules, aucune perte de contenu."
  - **Business** → "Passez à Enterprise : accédez à tous les modules sans restriction."
  - **Enterprise** → composant retourne `null` (masqué)
- Bouton "Voir les offres" → `Link to="/client/upgrade"`
- Lien secondaire "En savoir plus sur le swap" → Popover/tooltip expliquant le mécanisme
- **Ne bloque jamais** le bouton swap

#### 2. Intégrer dans `ModulesTab.tsx`

- Insérer `<SwapUpgradeBanner />` en tout premier élément (avant le swap counter card)
- Masqué automatiquement si plan = Enterprise

#### 3. Créer la page `src/pages/client/ClientUpgrade.tsx`

- Comparatif 3 colonnes : Starter / Business / Enterprise
- Chaque colonne : prix, liste des modules inclus (tirés de `DEFAULT_PLAN_MODULES`), nombre de swaps/mois
- Colonne du plan actuel mise en surbrillance (bordure primary + badge "Votre offre actuelle")
- Bouton "Choisir cette offre" sur les plans supérieurs → `toast.info("Contactez le support pour changer d'offre")`
- Plans inférieurs : bouton grisé ou absent

#### 4. Ajouter la route dans `AnimatedRoutes.tsx`

- Import lazy de `ClientUpgrade`
- Route `/client/upgrade` après les routes client existantes

### Fichiers

| Fichier | Action |
|---|---|
| `src/components/client/SwapUpgradeBanner.tsx` | Créer |
| `src/components/client/settings/ModulesTab.tsx` | Modifier — ajouter le banner en haut |
| `src/pages/client/ClientUpgrade.tsx` | Créer — page comparatif 3 offres |
| `src/components/AnimatedRoutes.tsx` | Modifier — ajouter route `/client/upgrade` |

