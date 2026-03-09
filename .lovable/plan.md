
# Sidebar flottant avec glassmorphisme

## Objectif
Transformer la sidebar admin (et les sidebars client/employe) en un element flottant avec l'effet de glassmorphisme identique aux cartes du dashboard, comme sur la reference partagee.

## Modifications

### 1. AdminSidebar - Activer le mode flottant
- Passer `variant="floating"` et `collapsible="icon"` au composant `<Sidebar>` 
- Retirer la classe `border-r border-border/50` (le mode floating gere ses propres bordures)

### 2. Sidebar UI component - Appliquer le glassmorphisme
- Dans `src/components/ui/sidebar.tsx`, remplacer le style du conteneur interne en mode `floating` :
  - Remplacer `bg-sidebar` + `border-sidebar-border` par les classes `glass-card glass-noise`
  - Ajouter un `border-radius` plus genereux (`rounded-2xl` au lieu de `rounded-lg`)
  - Supprimer le `bg-sidebar` par defaut pour laisser le glass transparaitre

### 3. AdminLayout - Ajuster le layout
- Ajouter un padding a gauche sur le conteneur principal pour que la sidebar flottante ait de l'espace
- Appliquer aussi le glass-nav sur le header de maniere coherente
- Ajuster le gap/padding pour que tout soit visuellement aligne

### 4. Variables CSS sidebar
- Modifier `--sidebar-background` dans `index.css` pour qu'il soit transparent (le glassmorphisme prend le relai)

### 5. ClientSidebar et EmployeeSidebar
- Appliquer les memes changements (`variant="floating"`) pour la coherence entre les 3 espaces

## Details techniques

Fichiers modifies :
- `src/components/ui/sidebar.tsx` : style du conteneur floating avec classes glass
- `src/components/admin/AdminSidebar.tsx` : `variant="floating"` + `collapsible="icon"`
- `src/components/admin/ClientSidebar.tsx` : idem
- `src/components/admin/EmployeeSidebar.tsx` : idem
- `src/components/admin/AdminLayout.tsx` : ajustement padding/layout
- `src/components/admin/ClientLayout.tsx` : idem si necessaire
- `src/components/admin/EmployeeLayout.tsx` : idem si necessaire
- `src/index.css` : eventuel ajustement des variables sidebar

Le resultat sera une sidebar detachee du bord gauche, avec coins arrondis, fond semi-transparent avec blur, et effet de glassmorphisme identique aux cards du dashboard.
