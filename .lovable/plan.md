

## Module 11 — Swap de modules (Espace Client)

### Audit
Aucun composant ou écran de swap n'existe dans le projet. `ClientSettings.tsx` contient 3 onglets (Profil, Entreprise, Notifications) sans onglet "Mes modules".

### Plan d'implémentation

#### 1. Nouveau composant `src/components/client/ModuleSwapWizard.tsx`
Composant stepper 4 écrans dans un Dialog plein écran :

- **Écran 1 — Avertissement** : Titre "Attention", texte expliquant la perte de données, checkbox obligatoire "Je comprends que les données du module retiré seront perdues", bouton "Continuer" disabled tant que non coché, bouton "Retour" pour fermer
- **Écran 2 — Retrait** : Liste des modules actifs en cards cliquables (sélection unique), bouton "Confirmer le retrait" disabled tant qu'aucun module sélectionné, bouton "Retour"
- **Écran 3 — Activation** : Liste des modules disponibles non actifs en cards cliquables, bouton "Confirmer l'activation", bouton "Retour"
- **Écran 4 — Confirmation** : Récap "Module retiré → Module activé", pas de bouton retour, bouton "Terminer" qui décrément le compteur et met à jour les modules actifs dans le state local

Navigation : stepper linéaire strict, impossible de sauter une étape.

#### 2. Nouveau onglet dans `src/pages/client/ClientSettings.tsx`
Ajouter un 4e onglet "Mes modules" (icône `Layers`) dans le TabsList (passer de `grid-cols-3` à `grid-cols-4`) :

- **Section "Modules actifs"** : Cards avec icône + nom + badge "Actif" vert — données mockées (3 modules pour Starter, 8 pour Business, tous pour Enterprise) tirées de `DemoPlanContext.planModules[demoPlan]`
- **Section "Modules disponibles"** : Cards grisées des modules non actifs dans l'offre
- **Compteur swaps** : Barre de progression "X / 2 swaps restants ce mois" — state local `useState(2)`, décrémenté à chaque swap
- **Si compteur = 0** : Date de rechargement "Vos swaps se rechargent le 1er [mois prochain] à minuit" calculée via `date-fns`
- **Bouton "Swaper un module"** : Ouvre le wizard. Si compteur = 0 → bouton disabled + tooltip avec date + CTA "Passez à l'offre supérieure" via `UpgradeBanner`

#### 3. Données mock
- Modules actifs/disponibles : lus depuis `useDemoPlan()` — `planModules[demoPlan]` donne les clés actives, le reste de `ALL_MODULE_KEYS` = disponibles
- Icons mapping : dictionnaire local `moduleKey → LucideIcon` pour afficher les icônes sur les cards
- Compteur : `useState(2)` avec reset automatique si on détecte un changement de mois (comparaison `new Date().getMonth()`)

### Fichiers à créer / modifier

| Fichier | Action |
|---|---|
| `src/components/client/ModuleSwapWizard.tsx` | **Créer** — Stepper 4 écrans |
| `src/pages/client/ClientSettings.tsx` | **Modifier** — Ajouter onglet "Mes modules" |

