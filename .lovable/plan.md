

## Fusionner le module Demandes dans le module Dossiers + ajouter un onglet Clients

### Objectif
Supprimer le module "Demandes" autonome de la sidebar et fusionner son contenu dans le module "Dossiers" existant (qui a deja des sous-onglets Dossiers et Demandes). Ajouter un 3eme sous-onglet "Clients" avec classification par tags.

### Changements

#### 1. Sidebar - Supprimer l'entree "Demandes"
**Fichier** : `src/components/admin/AdminSidebar.tsx`
- Retirer la ligne `{ title: "Demandes", url: "/admin/demandes", ... }` du tableau `allNavItems`
- Renommer "Dossiers" en "Dossiers & Demandes" (ou garder "Dossiers" selon preference)

#### 2. Routes - Rediriger /admin/demandes vers /admin/dossiers
**Fichier** : `src/components/AnimatedRoutes.tsx`
- Supprimer ou rediriger la route `/admin/demandes` vers `/admin/dossiers`
- Supprimer l'import `AdminDemandes`

#### 3. Ajouter l'onglet "Clients" dans AdminDossiers
**Fichier** : `src/pages/admin/AdminDossiers.tsx`
- Ajouter un 3eme `TabsTrigger` "Clients" a cote de "Dossiers" et "Demandes"
- Le contenu affiche la liste des clients avec :
  - Nom, email, entreprise, segment
  - Tags associes (depuis `client_tags` + `tags`)
  - Possibilite d'attribuer/retirer des tags via un select multi
  - Filtrage par tag pour distinguer et classifier les clients
- Reutiliser les hooks `useClients` et les queries `tags`/`client_tags` deja presentes dans le fichier

#### 4. Fichiers impactes

| Fichier | Action |
|---|---|
| `src/components/admin/AdminSidebar.tsx` | Retirer entree "Demandes" |
| `src/components/AnimatedRoutes.tsx` | Rediriger/supprimer route `/admin/demandes` |
| `src/pages/admin/AdminDossiers.tsx` | Ajouter onglet "Clients" avec gestion tags |
| `src/pages/admin/AdminDemandes.tsx` | Peut etre supprime (code deja duplique dans AdminDossiers) |

Aucune migration DB necessaire - les tables `tags`, `client_tags` et `clients` existent deja.

