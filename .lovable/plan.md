

## Module 09 — Limite de charge par pro

### Audit

| Element | Status |
|---|---|
| Champ `capaciteMax` sur TeamMember | **Manquant** |
| Indicateur de charge dans AssignModal | **Manquant** |
| Confirmation forçage si pro à 100% | **Manquant** |
| Widget "Charge de l'équipe" dashboard Admin | **Manquant** |

### Plan d'implementation

#### 1. Donnees mock — `src/data/mockData.ts`

- Ajouter `capaciteMax?: number | null` sur l'interface `TeamMember` (null = pas de limite)
- Attribuer des valeurs aux 4 membres mock : Alexandre=8, Camille=6, Hugo=10, Sarah=5

#### 2. AssignModal — `src/components/admin/AssignModal.tsx`

Ajouter un indicateur de charge par membre :
- Importer `useDemoData` pour acceder aux dossiers et calculer le nombre de dossiers actifs par pro (via `dossierAssignments` dans le contexte)
- Sous le nom/poste de chaque membre, afficher :
  - Barre `Progress` coloree dynamiquement (vert <70%, orange 70-99%, rouge >=100%)
  - Texte "X / Y dossiers" (ou "X dossiers" si pas de limite)
- Si taux >= 100% : carte avec `opacity-60` + badge rouge "CHARGE MAX"
- Clic sur un pro a 100% : au lieu de toggle direct, ouvrir un `AlertDialog` "Ce pro est a capacite maximale. Forcer l'assignation ?" avec Annuler / Forcer — le Forcer fait le toggle normal

#### 3. Dashboard Admin — `src/pages/admin/AdminDashboard.tsx`

Ajouter un widget Card "Charge de l'equipe" dans la grille existante :
- Tableau simple : colonnes Pro | Dossiers actifs | Capacite | Barre
- Lignes en rouge/destructive si depassement
- Importer `MOCK_TEAM_MEMBERS` et calculer la charge depuis les dossiers du contexte demo

### Fichiers a modifier

| Fichier | Modification |
|---|---|
| `src/data/mockData.ts` | Ajouter `capaciteMax` a `TeamMember` + valeurs mock |
| `src/components/admin/AssignModal.tsx` | Barre de charge, badge CHARGE MAX, AlertDialog forçage |
| `src/pages/admin/AdminDashboard.tsx` | Widget "Charge de l'equipe" avec tableau |

