

## Plan: Rendre les catégories de ventes personnalisables par entreprise

### Probleme actuel
Les catégories de ventes dans le module Analyse sont hardcodées (ligne 147) :
```typescript
const CATS = ["Site web", "App mobile", "E-commerce", "Back-office", "360", "Autres"] as const;
```
Avec une fonction `categorize()` qui mappe les `type_prestation` des dossiers vers ces catégories fixes. Un photographe ou un traiteur ne se retrouve pas dans ces libellés.

### Solution

Créer une table `service_categories` en base de données pour que chaque entreprise puisse définir ses propres catégories de services/produits. Ces catégories remplaceront le tableau `CATS` hardcodé dans l'analyse.

### Etapes techniques

1. **Migration : créer la table `service_categories`**
   - Colonnes : `id`, `nom` (text), `couleur` (text, défaut hex), `mots_cles` (text[], pour matcher automatiquement les `type_prestation` des dossiers), `ordre` (integer), `created_at`
   - RLS : admin full access, employees SELECT
   - Insérer des catégories par défaut (les 6 actuelles) pour ne pas casser l'existant

2. **Hook `use-service-categories.ts`**
   - CRUD sur `service_categories` (query, add, update, delete)
   - Fallback sur les catégories hardcodées si la table est vide

3. **Interface de gestion dans Paramètres admin (`AdminSettings.tsx`)**
   - Section "Catégories de services" avec possibilité d'ajouter, renommer, supprimer, réordonner les catégories
   - Champ mots-clés pour le matching automatique avec les types de prestation des dossiers
   - Sélecteur de couleur pour les graphiques

4. **Adapter `AdminAnalytics.tsx`**
   - Remplacer le `const CATS` hardcodé par les données de `useServiceCategories()`
   - Adapter `categorize()` pour utiliser les `mots_cles` de chaque catégorie dynamique
   - Conserver "Autres" comme catégorie résiduelle automatique
   - Mettre à jour le graphique stacked bar et le tableau récapitulatif pour utiliser les couleurs et noms dynamiques
   - Adapter l'export PDF et CSV pour refléter les catégories personnalisées

5. **Adapter l'espace Employé (`EmployeeAnalyse.tsx`)**
   - Même logique si ce fichier utilise des catégories similaires

### Résultat
Un photographe pourra configurer : "Mariage", "Portrait", "Événementiel", "Produit", "Drone". Un consultant : "Audit", "Formation", "Conseil", "Accompagnement". Chaque entreprise personnalise ses catégories de vente selon son activité.

