

## Analyse de la situation actuelle

Actuellement, les deux systèmes sont **complètement indépendants** :

- **Rôles & Permissions** (`roles` + `permissions` + `role_permissions`) : gère des permissions granulaires (voir dossiers, modifier planning, etc.) pour des rôles génériques (Employé, Manager, Directeur).
- **Espaces personnalisés** (`custom_spaces`) : gère des profils métier (Conseillère, Comptabilité) avec une liste de modules activés, mais sans aucun lien avec le système de permissions.

Il n'y a **aucun pont** entre les deux. Un espace personnalisé ne crée pas de rôle, et un rôle ne filtre pas les modules.

---

## Plan d'implémentation : Relier Espaces personnalisés et Rôles & Permissions

### 1. Lier un espace personnalisé à un rôle

- Ajouter une colonne `role_id` (nullable, FK vers `roles`) dans la table `custom_spaces` via migration.
- Quand un espace personnalisé est créé, **créer automatiquement un rôle** du même nom dans la table `roles` et stocker le `role_id` résultant dans l'espace.
- Si l'espace est supprimé, supprimer le rôle associé (ou le dissocier).

### 2. Afficher les espaces personnalisés dans Rôles & Permissions

- Dans `RolesPermissionsSettings.tsx`, importer `useCustomSpaces` et afficher à côté de chaque rôle un badge indiquant s'il est lié à un espace personnalisé.
- Permettre de configurer les permissions granulaires pour ces rôles comme pour les autres.

### 3. Assigner un rôle/espace à un salarié depuis Rôles & Permissions

- Dans la vue d'un rôle sélectionné, ajouter une section "Salariés assignés" qui liste les employés ayant ce rôle (via `employe_role`).
- Ajouter un bouton pour assigner/retirer des salariés directement depuis cette page (utilisant `assignRoleToEmployee` / `removeRoleFromEmployee` déjà présents dans `usePermissions`).

### 4. Synchroniser les modules

- Quand les permissions d'un rôle lié à un espace sont modifiées, les modules activés de l'espace restent la source pour la visibilité des menus, tandis que les permissions contrôlent les actions autorisées au sein de ces modules.

### Fichiers impactés

| Fichier | Modification |
|---|---|
| Migration SQL | Ajout `role_id` sur `custom_spaces` |
| `src/hooks/use-custom-spaces.ts` | Créer un rôle automatiquement à la création d'espace, stocker `role_id` |
| `src/hooks/use-permissions.ts` | Exposer la liste des employés par rôle pour affichage |
| `src/components/admin/RolesPermissionsSettings.tsx` | Afficher badge espace, section "Salariés assignés" avec assignation |
| `src/components/admin/CustomSpacesSettings.tsx` | Passer le `role_id` lors de la création, afficher le lien vers le rôle |

