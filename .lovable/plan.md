

## Plan : Remplacer les icones par des photos dans ServicesSection

### Contexte
La `ServicesSection` (affichee sur la page d'accueil) utilise des icones Lucide pour illustrer chaque secteur. La `CiblesSection` (aussi sur la page d'accueil, plus bas) utilise deja des photos. L'utilisateur veut le meme traitement photo pour `ServicesSection`.

### Modifications - `src/components/sections/ServicesSection.tsx`

1. **Importer les 21 images** depuis `src/assets/sectors/` (meme imports que `CiblesSection`) et supprimer les imports Lucide.

2. **Restructurer les donnees** : remplacer `icon` par `image` dans chaque secteur, en mappant aux images correspondantes (devImg, designerImg, cabinetsImg, etc.).

3. **Refondre le design des cartes** :
   - Passer d'une carte compacte avec icone a une carte avec photo (style similaire a `CiblesSection` : image en haut ~h-40, texte en dessous).
   - Garder la grille `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` pour 5 cartes par ligne.
   - Hover : zoom image (`scale-1.08`), fleche qui apparait, bordure verte.

4. **Animations au scroll** :
   - Utiliser des `cardVariants` avec framer-motion pour un stagger d'entree (opacity + translateY + scale) au viewport.
   - Chaque categorie a son propre groupe d'animation avec delai progressif.

5. **Importer `ArrowRight`** de lucide-react pour l'indicateur hover sur les cartes.

### Resultat
Les cartes secteur auront le meme style visuel que celles de `CiblesSection` : photo + titre + description + animation d'entree au scroll + hover interactif. Un seul fichier modifie.

