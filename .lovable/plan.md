

## Plan : Import CSV/Excel pour pré-remplir le module Stock

### Objectif
Permettre aux entreprises d'importer un fichier externe (CSV ou Excel) pour pré-remplir automatiquement les produits, catégories et fournisseurs du module Stock, au lieu de tout saisir manuellement.

### Fonctionnement

1. **Bouton "Importer" dans `AdminStock.tsx`**
   - Ajouter un bouton "Importer" (icône Upload) dans la barre d'actions existante
   - Ouvre un dialog d'import avec une zone de glisser-déposer ou sélection de fichier (CSV, `.xlsx`)

2. **Parsing du fichier côté client**
   - CSV : parsing natif avec `FileReader` + split par `;` ou `,` (détection auto du séparateur)
   - Excel (`.xlsx`) : installer la lib `xlsx` (SheetJS) pour parser les fichiers Excel
   - Extraire les en-têtes du fichier et les afficher pour que l'utilisateur puisse mapper chaque colonne vers un champ du système (référence, nom, prix_achat, prix_vente, stock, catégorie, fournisseur, etc.)

3. **Étape de mapping des colonnes**
   - Interface en 2 colonnes : à gauche les en-têtes détectés du fichier, à droite un Select avec les champs disponibles (référence, nom, description, prix_achat, prix_vente, quantite_stock, seuil_alerte, catégorie, fournisseur, SKU, unité)
   - Pré-mapping intelligent : si un en-tête contient "ref" → mapper auto sur "référence", "prix" → "prix_vente", etc.
   - Aperçu des 5 premières lignes pour vérification

4. **Traitement et insertion**
   - Créer automatiquement les catégories et fournisseurs détectés qui n'existent pas encore
   - Insérer les produits en batch via les hooks existants (`addProduit`, `addCategory`, `addFournisseur`)
   - Afficher un récapitulatif : X produits importés, Y catégories créées, Z fournisseurs ajoutés
   - Gestion des doublons par référence (skip ou mise à jour)

5. **Composant `StockImportDialog.tsx`**
   - Dialog multi-étapes : Upload → Mapping colonnes → Aperçu → Import
   - Barre de progression pendant l'import
   - Résumé final avec succès/erreurs

### Détails techniques

- **Nouvelle dépendance** : `xlsx` (SheetJS) pour le support Excel
- **Fichiers créés** : `src/components/admin/StockImportDialog.tsx`
- **Fichier modifié** : `src/pages/admin/AdminStock.tsx` (ajout bouton + import du dialog)
- Aucune migration DB nécessaire — on utilise les tables et hooks existants
- Le mapping intelligent utilise des mots-clés français et anglais pour détecter les colonnes automatiquement

