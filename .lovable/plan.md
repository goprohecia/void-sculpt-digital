

## Plan : Ajouter un champ "Service" aux devis et factures

### Contexte
Les formulaires de création de devis et factures n'ont pas de champ pour indiquer quel service/produit est vendu. L'utilisateur veut pouvoir sélectionner parmi les catégories de services créées dans les paramètres, et ajouter une description détaillée de la prestation. Cela permettra ensuite de quantifier les ventes par service dans l'analyse.

### Modifications

**1. Migration DB : ajouter colonnes aux tables `devis` et `factures`**
- `service_category_id` (uuid, nullable, FK vers `service_categories`)
- `description` (text, nullable, défaut `''`)

**2. Interfaces TypeScript (`mockData.ts`)**
- Ajouter `serviceCategoryId?: string` et `description?: string` aux interfaces `Facture` et `Devis`

**3. Formulaires de création (`AdminBilling.tsx`)**
- Importer `useServiceCategories` pour récupérer les catégories dynamiques
- Ajouter un Select "Service / Type de prestation" dans les deux dialogs (facture + devis) avec les catégories définies par l'entreprise
- Ajouter un Textarea "Description / Détail de la prestation" dans les deux dialogs
- Transmettre ces champs lors de l'insertion

**4. Hooks `use-factures.ts` et `use-devis.ts`**
- Mapper les nouveaux champs `service_category_id` et `description` dans `mapRow()`
- Les inclure dans les insertions

**5. Affichage dans les tableaux**
- Afficher le nom du service et la description (tronquée) dans les listes de factures et devis pour faciliter l'identification

