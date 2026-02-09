
# Export PDF du cahier des charges + Commentaires admin

## 1. Export PDF du cahier des charges

Ajout d'un bouton "Exporter PDF" dans le dialog `CahierDesChargesView.tsx` qui genere un PDF structure avec jsPDF (deja installe et utilise dans le projet via `generatePdf.ts`).

Le PDF inclura :
- En-tete Impartial (meme style que factures/devis)
- Titre du projet et statut
- Toutes les sections du cahier des charges (contexte, public cible, fonctionnalites, design, contraintes, planning, budget, remarques)
- Les commentaires admin s'ils existent
- Pied de page avec coordonnees

### Fichier a creer
- **`src/lib/generateCdcPdf.ts`** : Fonction de generation PDF du cahier des charges, reutilisant les helpers `addHeader` et `addFooter` du style existant dans `generatePdf.ts`

### Fichier a modifier
- **`src/components/admin/CahierDesChargesView.tsx`** : Ajouter le bouton "Exporter PDF" dans le header du dialog

---

## 2. Commentaires admin sur le cahier des charges

L'admin pourra laisser des commentaires/remarques sur le CDC du client directement depuis le dialog de consultation.

### Modifications de donnees
- **`src/contexts/DemoDataContext.tsx`** :
  - Ajouter un champ `commentairesAdmin?: string` a l'interface `CahierDesCharges`
  - Ajouter une fonction `updateCahierComment(demandeId: string, comment: string)` au contexte
  - Pre-remplir un commentaire mock sur le CDC existant (dem1)

### Modifications UI
- **`src/components/admin/CahierDesChargesView.tsx`** :
  - Ajouter une section "Commentaires admin" en bas du dialog
  - Zone de texte (textarea) pour saisir/modifier le commentaire
  - Bouton "Enregistrer le commentaire" avec toast de confirmation
  - Le commentaire est persiste via le contexte

---

## Details techniques

### Structure du PDF
Le PDF sera genere avec le meme style visuel que les factures et devis existants :
- Memes fonctions `addHeader` / `addFooter` extraites ou dupliquees depuis `generatePdf.ts`
- Sections du CDC ajoutees sequentiellement avec gestion du saut de page automatique via `doc.text()` avec split lines
- Les fonctionnalites seront presentees en liste numerotee

### Flux utilisateur

```text
Admin : Onglet Demandes --> "Voir CDC"
  --> Dialog s'ouvre avec contenu + section commentaires
  --> Peut saisir un commentaire et enregistrer
  --> Peut cliquer "Exporter PDF" pour telecharger le CDC complet (avec commentaires)
```
