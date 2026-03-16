

# Plan — Vocabulaire systématique : noms employé/client dynamiques

## Résumé

Remplacer les labels hardcodés "Client", "Salarié", "Employé" par des labels dynamiques basés sur `getSectorRoleLabel()` dans les composants visibles. Le module "Clients & Dossiers" dans la sidebar utilise déjà `getModuleLabel("clients-dossiers")` qui retourne le bon label par secteur — ce point est déjà couvert.

## État actuel

**Déjà OK** :
- `AdminSidebar.tsx` → utilise `getModuleLabel("clients-dossiers")` → retourne "Mariées & Dossiers", "Élèves & Dossiers", etc. selon secteur
- `EmployeeSidebar.tsx` → idem
- `SECTOR_ROLE_LABELS` complet pour les 2 nouveaux secteurs
- `SECTOR_MODULE_OVERRIDES` complet pour tous les secteurs (label "clients-dossiers" adapté)

**Hardcodés à corriger** (7 fichiers) :

| Fichier | Texte hardcodé | Remplacement |
|---|---|---|
| `EmployeeDashboard.tsx` | `"Salarié"` fallback | `getSectorRoleLabel(demoSector, "employee") \|\| "Salarié"` |
| `EmployeeSidebar.tsx` | `user?.role \|\| "salarié"` dans footer | Role label dynamique |
| `EmployeeProfile.tsx` | `"Salarié"` x2 | Label dynamique |
| `AdminClients.tsx` | `"Client"` dans segment badge, toast, segments labels | `clientLabel` dynamique |
| `AdminSupport.tsx` | `"Tous les clients"` x2 | `"Tous les {clientLabel}s"` |
| `AdminAnnonces.tsx` | `"Tous les clients"`, `"Tous les employés"` | Labels dynamiques |
| `AdminSettings.tsx` | `"Salarié"` / `"Client"` dans rôle de base | Labels dynamiques |
| `AdminTemps.tsx` | `"Salarié"` / `"Tous les salariés"` | Labels dynamiques |
| `AdminLogin.tsx` | `"Salarié"` / `"Client"` dans boutons démo | Labels dynamiques |

## Approche

Créer un petit hook utilitaire `useSectorRoleLabels()` qui wraps `getSectorRoleLabel` + `useDemoPlan` pour simplifier l'usage dans les composants :

```ts
// src/hooks/use-sector-role-labels.ts
export function useSectorRoleLabels() {
  const { demoSector } = useDemoPlan();
  return {
    clientLabel: getSectorRoleLabel(demoSector, "client") || "Client",
    employeeLabel: getSectorRoleLabel(demoSector, "employee") || "Salarié",
    adminLabel: getSectorRoleLabel(demoSector, "admin") || "Admin",
    clientsLabel: pluralize(clientLabel),
    employeesLabel: pluralize(employeeLabel),
  };
}
```

Puis importer ce hook dans chaque composant affecté et remplacer les strings hardcodées.

## Fichiers impactés

| Fichier | Action |
|---|---|
| `src/hooks/use-sector-role-labels.ts` | **Nouveau** — hook wrapper |
| `src/pages/employee/EmployeeDashboard.tsx` | Remplacer "Salarié" par employeeLabel |
| `src/components/admin/EmployeeSidebar.tsx` | Remplacer rôle footer par employeeLabel |
| `src/pages/employee/EmployeeProfile.tsx` | Remplacer "Salarié" x2 |
| `src/pages/admin/AdminClients.tsx` | Remplacer "Client" dans badges/toasts par clientLabel |
| `src/pages/admin/AdminSupport.tsx` | Remplacer "Tous les clients" |
| `src/pages/admin/AdminAnnonces.tsx` | Remplacer "clients"/"employés" |
| `src/pages/admin/AdminSettings.tsx` | Remplacer "Salarié"/"Client" |
| `src/pages/admin/AdminTemps.tsx` | Remplacer "Salarié"/"salariés" |
| `src/pages/admin/AdminLogin.tsx` | Remplacer labels boutons démo |

Pas de migration DB. Uniquement des labels d'affichage.

