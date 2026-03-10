

## Module 14 — Swap supplémentaire via Super Admin

### Audit

- **Super Admin area exists** at `/superadmin/*` with distinct amber-themed sidebar (`SuperAdminSidebar.tsx`) and layout (`SuperAdminLayout.tsx`).
- **Entreprises page exists** (`SuperAdminEntreprises.tsx`) with mock client list but **no swap management columns** (no swaps restants, no déblocages).
- **No client detail page** exists under super admin — clicking a client does nothing meaningful.
- **No swap unlock/log system** exists anywhere.

### Plan

#### 1. Extend `MOCK_ENTERPRISES` data in `SuperAdminEntreprises.tsx`

Add `swapsRemaining: number`, `deblocages: number` fields to each mock enterprise. Add columns "Swaps restants" and "Déblocages" to the card display. Make each card a `Link` to `/superadmin/entreprises/:id`.

#### 2. Create `src/pages/superadmin/SuperAdminEntrepriseDetail.tsx`

New page wrapped in `SuperAdminLayout`, receives enterprise ID from URL params, finds it in shared mock data.

**Sections:**
- **Info header**: Nom, plan, statut, email, sector
- **Gestion des swaps card**:
  - Counter display: "X / 2 swaps restants — remise à zéro le [1er du mois prochain]" (date-fns)
  - Button "Débloquer 1 swap supplémentaire" → opens confirmation Dialog
- **Historique des déblocages table**:
  - Columns: Date | Identifiant support | Raison | Swaps octroyés
  - Mock initial entries + real-time local state additions
  - Badge alert "Déblocages fréquents — upgrade recommandé" if ≥3 déblocages this month

**Confirmation Dialog:**
- Textarea "Raison du déblocage" — required, `Confirmer` button disabled while empty
- Visible reminder text about logging
- On confirm: increment swap counter (+1), add log entry with current date/admin name/reason

#### 3. Add route in `AnimatedRoutes.tsx`

- Import `SuperAdminEntrepriseDetail`
- Route: `/superadmin/entreprises/:id`

#### 4. Shared mock data

Extract `MOCK_ENTERPRISES` to a shared constant or keep inline but augmented with swap fields. The detail page will use same data source via ID lookup.

### Files

| File | Action |
|---|---|
| `src/pages/superadmin/SuperAdminEntreprises.tsx` | Modify — add swap columns, link to detail |
| `src/pages/superadmin/SuperAdminEntrepriseDetail.tsx` | Create — detail page with swap management |
| `src/components/AnimatedRoutes.tsx` | Modify — add route |

