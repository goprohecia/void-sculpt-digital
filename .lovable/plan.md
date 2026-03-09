

## Plan: Timelines prédéfinies par secteur d'activité

### Objectif
Ajouter des timelines prédéfinies pour chaque secteur d'activité dans l'éditeur de templates. Quand l'utilisateur est sur un secteur donné, il voit des suggestions de timelines adaptées à son métier qu'il peut appliquer en un clic.

### Changements

#### 1. Nouveau fichier `src/data/sectorTimelines.ts`
Créer un dictionnaire `SECTOR_TIMELINE_PRESETS` qui mappe chaque clé de secteur à un tableau de timelines prédéfinies. Chaque preset contient un `name` et un tableau `steps`. Exemples :

- **Immobilier** : "Mandat de vente" (Demande reçue → Premier contact → Estimation du bien → Signature du mandat → Diffusion annonce → Visites → Offre d'achat → Signature du compromis → Délai de rétractation → Obtention du prêt → Signature chez le notaire → Remise des clés), "Location" (Demande reçue → Visite du bien → Constitution du dossier → Vérification du dossier → Signature du bail → État des lieux → Remise des clés)
- **BTP** : étapes chantier (Appel d'offres → Étude technique → Devis → Signature contrat → Permis de construire → Gros œuvre → Second œuvre → Finitions → Réception chantier → Levée de réserves → Clôture)
- **Coiffure** : parcours salon
- **Photographe** : workflow shooting
- **Consultant** : cycle mission
- Et tous les autres secteurs (~20 secteurs, 1-2 timelines chacun)

On ajoutera aussi un preset "Générique" pour le template par défaut actuel.

#### 2. Modifier `src/components/admin/TimelineTemplateEditor.tsx`
- Importer `SECTOR_TIMELINE_PRESETS` et `useDemoPlan` pour connaître le secteur actif
- Ajouter une section **"Timelines suggérées pour votre secteur"** affichée au-dessus des templates existants (ou en dessous du bouton "Nouveau template")
- Chaque suggestion est une Card compacte avec le nom, les étapes en badges, et un bouton **"Utiliser ce modèle"** qui appelle `createTemplate.mutate()` avec les steps préremplis
- Si le secteur est "Générique", afficher le preset générique par défaut uniquement

### Aucune modification de base de données requise
Les presets sont des données statiques côté client, utilisées uniquement pour pré-remplir la création de templates.

