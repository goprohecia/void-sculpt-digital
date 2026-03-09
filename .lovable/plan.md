

## Plan: Module 01 — Système d'assignation global

### Contexte actuel
- Le type `Dossier` n'a **aucun champ d'assignation** (pas d'`employee_id`, pas de liste d'assignés)
- La page `EmployeeDossiers` est un placeholder vide ("Aucun dossier assigné")
- `AdminDossierDetail` n'a aucun bouton d'assignation
- Les employés existent en mock (`DEMO_EMPLOYEES` dans `AdminEmployees.tsx`) avec id, nom, prénom, poste, statut
- Le secteur actif est accessible via `useDemoPlan()` → `sector`
- La config secteur est dans `sectorModules.ts` (on peut y ajouter `assignation_enabled`)

### Changements prévus

#### 1. Types & données mock (`src/data/mockData.ts`)
- Ajouter un type `DossierAssignment` : `{ employeeId, role: "responsable" | "renfort", dateAssignation }`
- Étendre `Dossier` avec un champ optionnel `assignments?: DossierAssignment[]`
- Pré-remplir 3-4 dossiers avec des assignations mock pointant vers les IDs demo-emp-1 / demo-emp-2

#### 2. Nouveau type `TeamMember` partagé (`src/data/mockData.ts`)
- Exporter un tableau `MOCK_TEAM_MEMBERS` avec ~4 membres (reprend les 2 existants + 2 nouveaux) incluant : id, nom, prenom, poste, statut ("disponible" | "indisponible"), avatar (initiales)

#### 3. Config secteur — booléen `assignation_enabled` (`src/data/sectorModules.ts`)
- Ajouter un champ `assignation_enabled: boolean` dans la config par secteur
- Activer par défaut pour tous les secteurs sauf ceux qui n'ont pas d'équipe (ex: photographe solo → `false`)
- Exporter une fonction `isAssignationEnabled(sector)` 

#### 4. Nouveau composant `AssignModal` (`src/components/admin/AssignModal.tsx`)
- Dialog avec liste de `MOCK_TEAM_MEMBERS` en cards : Avatar (initiales), nom, poste, badge statut
- Checkbox multiple sur chaque card
- Premier coché = badge "Responsable" automatique, suivants = "Renfort"
- Bouton "Confirmer l'assignation" → appelle un callback `onAssign(assignments[])`
- Pré-coche les membres déjà assignés si on rouvre la modale

#### 5. Modifier `DemoDataContext` (`src/contexts/DemoDataContext.tsx`)
- Ajouter état `assignments: Record<dossierId, DossierAssignment[]>`
- Ajouter fonctions `assignDossier(dossierId, assignments[])` et `getAssignmentsByDossier(dossierId)`
- Ajouter `getDossiersByEmployee(employeeId)` pour l'espace pro
- Exposer dans le contexte

#### 6. Modifier `AdminDossierDetail` (`src/pages/admin/AdminDossierDetail.tsx`)
- Après la section info, ajouter une section "Équipe assignée" :
  - Avatars empilés des pros assignés + badges RESPONSABLE / RENFORT
  - Bouton "Assigner" (si aucun assigné) ou "Modifier l'assignation" → ouvre `AssignModal`
- Conditionner l'affichage au booléen `isAssignationEnabled(sector)`

#### 7. Modifier `EmployeeDossiers` (`src/pages/employee/EmployeeDossiers.tsx`)
- Remplacer le placeholder par la vraie liste filtrée via `getDossiersByEmployee`
- Chaque carte dossier affiche : référence, client, type prestation, statut, badge RESPONSABLE ou RENFORT
- Conditionner au booléen `assignation_enabled`

#### 8. Modifier la liste admin des dossiers (`AdminDossiers.tsx`)
- Ajouter une colonne "Assigné à" dans le tableau, affichant les avatars empilés (max 3 + "+N")

### Fichiers impactés
| Fichier | Action |
|---|---|
| `src/data/mockData.ts` | Ajouter types + mock team members + assignments |
| `src/data/sectorModules.ts` | Ajouter `assignation_enabled` |
| `src/contexts/DemoDataContext.tsx` | Ajouter état + fonctions assignation |
| `src/components/admin/AssignModal.tsx` | **Créer** |
| `src/pages/admin/AdminDossierDetail.tsx` | Ajouter section équipe + bouton |
| `src/pages/admin/AdminDossiers.tsx` | Ajouter colonne assignés |
| `src/pages/employee/EmployeeDossiers.tsx` | Implémenter la vraie liste filtrée |

### Aucune modification base de données
Tout est en mock/état local pour cette itération.

