
# Cahier des charges pour chaque demande de projet

## Objectif
Permettre au client de remplir un cahier des charges structure pour chaque demande de projet. Ce cahier des charges sera visible et consultable par l'administrateur pour le transmettre a l'equipe de developpement.

## Fonctionnalites

### Cote client
- Sur chaque carte de demande dans `/client/demandes`, un bouton "Cahier des charges" apparait
- Au clic, un dialog/page s'ouvre avec un formulaire structure en sections :
  - **Contexte du projet** : presentation de l'entreprise, objectifs du projet
  - **Public cible** : utilisateurs vises, personas
  - **Fonctionnalites attendues** : liste des features souhaitees (ajout dynamique de lignes)
  - **Design et charte graphique** : preferences visuelles, couleurs, inspirations (URLs)
  - **Contraintes techniques** : technologies imposees, hebergement, integrations tierces
  - **Planning souhaite** : date de livraison souhaitee, jalons
  - **Budget complementaire** : informations budgetaires additionnelles
  - **Documents / Remarques** : champ libre pour notes supplementaires
- Le client peut sauvegarder un brouillon et finaliser plus tard
- Un badge "Cahier des charges" (complet / brouillon / vide) s'affiche sur chaque demande

### Cote admin
- Dans l'onglet "Demandes" de `/admin/dossiers`, chaque demande affiche un bouton "Voir cahier des charges"
- Au clic, un dialog en lecture seule affiche le cahier des charges du client, bien structure et lisible
- Possibilite de copier le contenu ou de le consulter facilement pour transmission a l'equipe

---

## Details techniques

### Nouveau type de donnees

Ajout dans `DemoDataContext.tsx` :

```text
Interface CahierDesCharges {
  id: string
  demandeId: string
  contexte: string
  publicCible: string
  fonctionnalites: string[]
  designNotes: string
  contraintesTechniques: string
  planningSouhaite: string
  budgetComplementaire: string
  remarques: string
  statut: "brouillon" | "complet"
  dateMiseAJour: string
}
```

### Fichiers a creer

1. **`src/components/admin/CahierDesChargesForm.tsx`**
   - Formulaire multi-sections dans un Dialog
   - Utilise par le client pour remplir/modifier le cahier des charges
   - Gestion de l'ajout dynamique de fonctionnalites (liste)
   - Bouton "Enregistrer brouillon" et "Finaliser"

2. **`src/components/admin/CahierDesChargesView.tsx`**
   - Composant en lecture seule pour l'admin
   - Affiche le cahier des charges de maniere structuree dans un Dialog
   - Badge de statut (brouillon/complet/vide)

### Fichiers a modifier

1. **`src/contexts/DemoDataContext.tsx`**
   - Ajouter l'interface `CahierDesCharges` et l'etat `cahiersDesCharges`
   - Ajouter les fonctions `getCahierByDemande`, `saveCahierDesCharges`
   - Donnees mock initiales pour la demande "dem1" (pre-remplie comme exemple)

2. **`src/pages/client/ClientDemandes.tsx`**
   - Ajouter un bouton "Cahier des charges" sur chaque carte de demande
   - Ouvrir le `CahierDesChargesForm` au clic
   - Afficher un badge de statut (brouillon/complet/vide) sur chaque demande

3. **`src/pages/admin/AdminDossiers.tsx`**
   - Dans l'onglet "Demandes", ajouter un bouton "Voir CDC" sur chaque demande
   - Ouvrir le `CahierDesChargesView` en lecture seule au clic
   - Badge indiquant si le CDC est rempli ou non

### Donnees mock

Un cahier des charges pre-rempli pour la demande `dem1` (Refonte e-commerce Luxe et Mode) avec des donnees realistes pour servir d'exemple dans la demo.

### Flux utilisateur

```text
Client : Demande existante --> Clic "Cahier des charges"
  --> Formulaire s'ouvre (vide ou pre-rempli si brouillon)
  --> Remplit les sections
  --> "Enregistrer brouillon" ou "Finaliser"
  --> Badge mis a jour sur la carte

Admin : Onglet Demandes --> Clic "Voir CDC"
  --> Dialog lecture seule avec toutes les sections
  --> Peut consulter et transmettre a l'equipe
```
