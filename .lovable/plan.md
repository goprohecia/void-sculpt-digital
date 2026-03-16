

# Plan — Timeline : restrictions par plan et par rôle

## Résumé

Modifier `DossierTimeline.tsx` pour ajouter des restrictions d'avancement et de configuration basées sur le plan (Starter/Business/Enterprise) et le rôle (Admin/Salarié/Client).

## État actuel

- `DossierTimeline` reçoit `isAdmin` et `isEnterprise` en props
- Admin : peut valider étapes + revenir en arrière + notes + changer template (Enterprise only)
- Client (`isAdmin=false`) : lecture seule
- Salarié : **non utilisé** (pas de `DossierTimeline` dans les pages employee)
- Aucune restriction par plan sur l'avancement

## Modifications

### 1. `DossierTimeline.tsx` — Nouvelles props et logique

Ajouter une prop `isEmployee?: boolean` au composant.

Importer `useSubscription` pour accéder au plan.

**Logique d'avancement (bouton "Valider")** :
- `isAdmin` → toujours actif (tout plan)
- `isEmployee` + plan Business/Enterprise → actif
- `isEmployee` + plan Starter → bouton grisé + tooltip "Disponible en offre Business"
- Client (ni admin ni employee) → bouton absent

**Logique "Revenir ici" (revert)** :
- `isAdmin` uniquement → visible
- Salarié/Client → masqué

**Config étapes (template selector)** :
- Actuellement : visible si `isAdmin && isEnterprise`
- Nouveau : visible si `isAdmin && (isBusiness || isEnterprise)` → actif
- Si `isAdmin && isStarter` → bouton grisé avec tooltip "Personnalisation disponible en Business"
- Salarié/Client → absent

**Notes** :
- Admin : peut ajouter des notes (inchangé)
- Employee : peut ajouter des notes (nouveau — même logique que admin)
- Client : lecture seule

### 2. Imports nécessaires

- `useSubscription` depuis `@/hooks/use-subscription`
- `Tooltip, TooltipTrigger, TooltipContent, TooltipProvider` depuis `@/components/ui/tooltip`

### 3. Callers à mettre à jour

| Fichier | Changement |
|---|---|
| `src/pages/admin/AdminDossierDetail.tsx` | Inchangé (`isAdmin={true}`) |
| `src/pages/client/ClientDossierDetail.tsx` | Inchangé (`isAdmin={false}`) |

Pas besoin de passer `isEmployee` depuis les pages employee car le composant n'y est pas utilisé actuellement. Quand il le sera, il suffira de passer `isEmployee={true}`.

## Fichiers impactés

| Fichier | Action |
|---|---|
| `src/components/admin/DossierTimeline.tsx` | Ajouter prop `isEmployee`, logique plan/rôle, tooltips |

Pas de migration DB.

