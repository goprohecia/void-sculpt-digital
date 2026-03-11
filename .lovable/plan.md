

## Plan

### 1. Supprimer CiblesSection de la page d'accueil
- **`src/pages/Index.tsx`** : Retirer l'import et l'utilisation de `<CiblesSection />`.

### 2. Changer le titre de ServicesSection
- **`src/components/sections/ServicesSection.tsx`** : Remplacer le titre actuel par :
  - Sous-titre : "Nos secteurs"
  - Titre : "Conçu pour les **professionnels exigeants.**" (partie verte en gradient)
  - Garder le paragraphe descriptif

### 3. Corriger la ligne orpheline dans "Artisanat & Terrain" (6 items)
- Passer la grille de `lg:grid-cols-5` a `lg:grid-cols-6` uniquement pour les groupes ayant 6 secteurs, ou utiliser une grille flexible avec `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` pour cette categorie.
- Alternative plus elegante : rendre la grille adaptative selon le nombre d'items du groupe (`group.sectors.length > 5 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'`).

