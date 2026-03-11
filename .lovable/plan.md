

## Plan : Adapter les pages secteurs au thème Chalk White

### Problème
Les pages secteurs utilisent `<Layout>` qui applique `bg-background` = vert sombre (`hsl(150, 60%, 10%)`). Le contenu des pages secteurs n'a pas de fond explicite, donc le vert sombre transparaît.

### Solution
Modifier `SectorPage.tsx` pour envelopper tout le contenu dans un `div` avec `bg-[#F6F5F2]` qui couvre le fond vert.

### Fichier à modifier
- **`src/pages/secteurs/SectorPage.tsx`** : Ajouter un wrapper `<div className="bg-[#F6F5F2]">` autour de tout le contenu à l'intérieur de `<Layout>`. Cela couvre les 4 sections (hero, cas d'usage, modules, CTA) et applique automatiquement le bon fond pour toutes les pages secteurs (Développeur, Boutique, DJ, Formateur, Coach sportif, etc.).

Un seul fichier à modifier, toutes les ~15 pages secteurs héritent automatiquement du changement.

