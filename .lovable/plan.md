

## Plan: Ajouter les overrides sectoriels pour les 15 secteurs restants

### Fichier modifié
`src/data/sectorModules.ts` — Ajout de 15 constantes d'overrides + enregistrement dans `SECTOR_MODULE_OVERRIDES`.

### Secteurs et vocabulaire métier

| Secteur | Dossiers | Tâches | Stock | Documents | RDV | Notes | Pipeline | Support |
|---------|----------|--------|-------|-----------|-----|-------|----------|---------|
| **Boutique** | Commandes | Tâches boutique | Inventaire | Bons & Factures | RDV fournisseurs | Notes produits | Pipeline ventes | SAV |
| **Cabinets** | Affaires | Échéances | *hidden* | Pièces juridiques | Consultations | Notes juridiques | Pipeline affaires | Litiges |
| **Community Manager** | Campagnes | Planning éditorial | *hidden* | Contenus & Visuels | Appels clients | Notes créatives | Pipeline prospects | Support client |
| **Consultant** | Missions | Livrables & Tâches | *hidden* | Rapports & Études | Réunions | Notes de mission | Pipeline missions | Support client |
| **Designer** | Projets créatifs | Sprints créatifs | *hidden* | Maquettes & Assets | Présentations | Inspirations | Pipeline créatif | Retours clients |
| **DJ/Animateur** | Événements | Préparation technique | Matériel sono | Playlists & Riders | Réservations | Notes événement | Pipeline bookings | Réclamations |
| **Événementiel** | Événements | Planning événement | Matériel & Déco | Documents événement | RDV prestataires | Notes organisation | Pipeline événements | Réclamations |
| **Formateur** | Formations | Modules & Cours | Supports pédagogiques | Ressources pédagogiques | Sessions | Notes formateur | Pipeline inscriptions | Support apprenant |
| **Garages** | Réparations | Ordres de réparation | Pièces détachées | Fiches techniques | RDV atelier | Notes mécanicien | Pipeline devis | Garanties |
| **Immobilier** | Biens | Visites & Tâches | *hidden* | Mandats & Actes | Visites | Notes terrain | Pipeline mandats | Litiges |
| **Mariage** | Mariages | Planning mariage | Fournitures & Déco | Contrats & Documents | RDV couple | Notes organisation | Pipeline couples | Réclamations |
| **Nettoyage** | Chantiers nettoyage | Planning interventions | Produits | Fiches intervention | Interventions | Notes terrain | Pipeline contrats | Réclamations |
| **Réparateur** | Réparations | Ordres de réparation | Pièces & Composants | Fiches techniques | RDV atelier | Notes techniques | Pipeline demandes | Garanties |
| **Traiteur** | Prestations | Préparation & Menus | Ingrédients & Stock | Menus & Contrats | RDV dégustation | Notes cuisine | Pipeline événements | Réclamations |
| **Conciergerie** | Prestations | Tâches conciergerie | Fournitures | Documents propriétaires | RDV propriétaires | Notes logements | Pipeline prospects | Réclamations |

### Implémentation

1. Ajouter 15 constantes (`BOUTIQUE_OVERRIDES`, `CABINETS_OVERRIDES`, etc.) après les overrides existants (ligne 115), chacune avec ~10-12 modules overridés, incluant labels et descriptions métier.

2. Enregistrer les 15 secteurs dans `SECTOR_MODULE_OVERRIDES` (lignes 118-124).

Aucun autre fichier ne nécessite de modification — le contexte `DemoPlanContext` et le sidebar consomment déjà dynamiquement la map.

