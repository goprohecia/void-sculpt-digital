

# Plan P3 — Fiche dossier 8 onglets obligatoires

## Résumé

Refondre `AdminDossierDetail.tsx` : conserver l'en-tête existant (référence, statut, équipe, stepper) et ajouter en dessous une barre de 8 onglets via le composant `Tabs` de Radix. Créer 6 nouveaux composants. Réorganiser le contenu existant dans les onglets appropriés.

## Structure

L'en-tête (lignes 183-458 actuelles : retour, titre, info grid, équipe, progression) reste inchangé au-dessus des onglets. Tout le contenu sous le stepper est remplacé par un `<Tabs>` avec 8 `<TabsContent>`.

## Fichiers à créer

| Composant | Fichier |
|---|---|
| DossierResume | `src/components/dossier/DossierResume.tsx` |
| DossierRDV | `src/components/dossier/DossierRDV.tsx` |
| DossierPaiements | `src/components/dossier/DossierPaiements.tsx` |
| DossierDocuments | `src/components/dossier/DossierDocuments.tsx` |
| DossierPhotos | `src/components/dossier/DossierPhotos.tsx` |
| DossierMesures | `src/components/dossier/DossierMesures.tsx` |
| DossierMessages | `src/components/dossier/DossierMessages.tsx` |
| DossierNotes | `src/components/dossier/DossierNotes.tsx` |

## Modifications sur `AdminDossierDetail.tsx`

- Importer `Tabs, TabsList, TabsTrigger, TabsContent` depuis `@/components/ui/tabs`
- Importer les 8 composants d'onglet
- Sous le stepper (après ligne ~458), remplacer tout le contenu restant (CDC, preview, visits, devis, factures) par un bloc `<Tabs defaultValue="resume">` avec 8 triggers et 8 contents
- Passer les props nécessaires à chaque composant (dossierId, dossier, facturesDossier, devisDossier, cahier, etc.)

## Détail de chaque onglet

### Onglet 1 — Résumé (`DossierResume.tsx`)
- Réorganise le contenu existant : bloc financier (montant total, encaissé en vert, restant dû en rouge), prochain RDV, prochain paiement, derniers messages, CDC résumé, preview link, raccourcis actions rapides
- Props : dossier, facturesDossier, devisDossier, cahier, previewVisits, + callbacks existants

### Onglet 2 — RDV (`DossierRDV.tsx`)
- État local pour liste de RDV (mock initial basé sur `rdvEffectue` du dossier)
- CRUD : ajouter (modal Dialog), modifier, supprimer (AlertDialog), envoyer rappel (toast)
- Empty state : "Aucun rendez-vous planifié — Programmer un RDV"

### Onglet 3 — Paiements (`DossierPaiements.tsx`)
- Échéancier basé sur `facturesDossier` : montant, date prévue, statut (payé/attente/retard)
- Actions admin : ajouter versement, marquer payé, envoyer relance
- Totaux : encaissé (vert), restant dû (rouge)

### Onglet 4 — Documents (`DossierDocuments.tsx`)
- Liste des documents liés (devis, factures, CDC, fichiers uploadés)
- Upload via bucket `cdc-attachments` existant
- Actions : uploader, télécharger, envoyer au client, supprimer
- Empty state avec bouton upload

### Onglet 5 — Photos (`DossierPhotos.tsx`)
- Galerie en grille depuis un sous-dossier du bucket `messagerie-medias` (ou nouveau bucket `dossier-photos`)
- Upload JPG/PNG/WebP, preview, suppression
- Empty state

### Onglet 6 — Mesures (`DossierMesures.tsx`)
- Tableau : libellé / valeur / unité / date
- Adapté au secteur via `demoSector` : couture (tour poitrine, taille, hanches…), sport (poids, IMC…), autres ("Non applicable")
- CRUD local avec état, historique des modifications

### Onglet 7 — Messages (`DossierMessages.tsx`)
- Fil de messages filtré par dossier (réutilise l'UI de la messagerie existante adaptée)
- Respect des règles Bible : client → admin uniquement
- Textarea + envoi

### Onglet 8 — Notes (`DossierNotes.tsx`)
- Notes internes invisibles du client
- Liste : auteur, date, contenu
- CRUD : ajouter (textarea), modifier, supprimer (auteur uniquement)
- Empty state

## Pas de migration DB dans ce prompt

Les 8 composants utilisent les données existantes (factures, devis, cahier, dossier) + état local pour les nouvelles fonctionnalités (RDV, mesures, notes, documents, photos). Les tables DB seront ajoutées si nécessaire dans des prompts ultérieurs.

## Fichiers impactés

| Fichier | Action |
|---|---|
| `src/pages/admin/AdminDossierDetail.tsx` | Refonte : garder header, ajouter Tabs avec 8 onglets |
| `src/components/dossier/DossierResume.tsx` | Nouveau |
| `src/components/dossier/DossierRDV.tsx` | Nouveau |
| `src/components/dossier/DossierPaiements.tsx` | Nouveau |
| `src/components/dossier/DossierDocuments.tsx` | Nouveau |
| `src/components/dossier/DossierPhotos.tsx` | Nouveau |
| `src/components/dossier/DossierMesures.tsx` | Nouveau |
| `src/components/dossier/DossierMessages.tsx` | Nouveau |
| `src/components/dossier/DossierNotes.tsx` | Nouveau |

