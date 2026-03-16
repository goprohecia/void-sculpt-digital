

## Ajouter la creation manuelle de Dossiers et Demandes depuis l'admin

### Objectif
Permettre a l'admin de creer manuellement des dossiers et des demandes directement depuis la page "Dossiers & Demandes", en les associant a un client existant. Cela active la gestion bidirectionnelle : Client vers Entreprise (demande client) et Entreprise vers Client (dossier/demande cree par l'admin).

### Changements prevus

#### 1. Formulaire de creation de dossier (Dialog)
Nouveau composant `src/components/admin/CreateDossierDialog.tsx` :
- Champs : Client (select parmi les clients existants), Type de prestation (texte libre ou select depuis `service_categories`), Montant, Date d'echeance
- La reference est generee automatiquement (`DOS-2026-XXX`)
- Le statut initial est "en_attente"
- Utilise `addDossier` du hook `useDossiers` + cree le lien dans `client_dossier` via `useClientDossier`

#### 2. Formulaire de creation de demande (Dialog)
Nouveau composant `src/components/admin/CreateDemandeDialog.tsx` :
- Champs : Client (select), Titre, Type de prestation, Description, Budget (optionnel)
- La reference est generee automatiquement (`DEM-2026-XXX`)
- Le statut initial est "nouvelle"
- Utilise `addDemande` du hook `useDemandes`

#### 3. Boutons d'ajout dans AdminDossiers.tsx
- Bouton "+ Nouveau dossier" dans l'onglet Dossiers (a cote du titre ou des filtres)
- Bouton "+ Nouvelle demande" dans l'onglet Demandes
- Chaque bouton ouvre le dialog correspondant

#### 4. Fichiers impactes

| Fichier | Modification |
|---|---|
| `src/components/admin/CreateDossierDialog.tsx` | Nouveau - formulaire dossier |
| `src/components/admin/CreateDemandeDialog.tsx` | Nouveau - formulaire demande |
| `src/pages/admin/AdminDossiers.tsx` | Ajout des boutons + integration des dialogs |

Aucune migration DB necessaire - les tables `dossiers`, `demandes`, et `client_dossier` existent deja avec les bonnes colonnes.

