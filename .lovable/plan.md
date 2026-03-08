

## Plan : Recommandations de modules par secteur d'activité

### Concept

Ajouter une etape "Secteur d'activite" dans le flow d'inscription (`ClientSignup.tsx`) entre le choix du plan et la selection des modules. En fonction du secteur choisi, les modules sont pre-selectionnes avec les plus pertinents pour ce secteur. Le Super Admin peut aussi configurer ces recommandations.

### 1. Definir le mapping secteur → modules recommandes

**Fichier : `src/contexts/DemoPlanContext.tsx`** (extension)

Ajouter une constante `SECTOR_MODULE_RECOMMENDATIONS` qui mappe chaque secteur a une liste ordonnee de modules par priorite. Les 3 premiers = recommandation Starter, les 8 premiers = recommandation Business, tous = Enterprise.

Secteurs (20, alignes sur les pages existantes) :
- Conciergerie, BTP, Boutique, Cabinets, Coach sportif, Coiffure, Community Manager, Consultant, Designer, Developpeur, DJ/Animateur, Evenementiel, Formateur, Garages, Immobilier, Mariage, Nettoyage, Photographe, Reparateur, Traiteur

Chaque secteur a deja des `modules` recommandes dans ses pages secteur (ex: Conciergerie = Dossiers, Clients, Facturation, Messagerie, Support, Rendez-vous). On reutilise ces donnees pour construire la recommandation.

Stocker aussi dans le contexte un state `sectorRecommendations` editable par le Super Admin.

### 2. Modifier le flow d'inscription

**Fichier : `src/pages/admin/ClientSignup.tsx`**

- Ajouter une etape "sector" entre "plan" et "modules" : `"plan" | "sector" | "modules" | "form"`
- Step indicator passe a 4 etapes
- Apres choix du plan → afficher une grille de secteurs (icones + labels)
- Apres choix du secteur :
  - **Starter** : pre-selectionner les 3 modules les plus importants pour ce secteur (limite a la limite du plan)
  - **Business** : pre-selectionner les 6-8 modules les plus importants
  - **Enterprise** : tous les modules disponibles, aller directement au form ou permettre deselection
- L'utilisateur peut toujours modifier sa selection avant de continuer
- Le secteur est envoye avec le formulaire (`body: { ..., sector: selectedSector }`)

### 3. Super Admin : gestion des recommandations par secteur

**Fichier : `src/pages/superadmin/SuperAdminFormules.tsx`** (extension)

Ajouter une section sous les formules : "Recommandations par secteur"
- Liste des 20 secteurs
- Pour chaque secteur : liste ordonnee des modules recommandes (drag ou checkboxes avec ordre)
- Les N premiers modules = recommandation Starter (N = limite starter), les M premiers = Business
- Bouton sauvegarder qui met a jour le contexte

### 4. Stocker le secteur dans le profil/subscription

**Migration DB** : Ajouter une colonne `sector` (text, nullable) a la table `subscriptions` pour persister le secteur choisi par le client.

**Edge function `send-signup-confirmation`** : passer le secteur dans les metadata utilisateur.

---

### Fichiers impactes

| Action | Fichier |
|--------|---------|
| Modifier | `src/contexts/DemoPlanContext.tsx` — ajouter `SECTOR_MODULE_RECOMMENDATIONS` + state editable |
| Modifier | `src/pages/admin/ClientSignup.tsx` — ajouter etape secteur + pre-selection modules |
| Modifier | `src/pages/superadmin/SuperAdminFormules.tsx` — section gestion recommandations secteur |
| Migration | Ajouter colonne `sector` a `subscriptions` |
| Modifier | `src/pages/superadmin/SuperAdminEntreprises.tsx` — afficher colonne secteur |

