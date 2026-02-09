
# Signature electronique pour validation de devis

Quand un client accepte un devis, il devra dessiner sa signature manuscrite sur un pad interactif avant de confirmer. La signature et la mention "Bon pour accord" seront ensuite integrees dans le PDF du devis.

---

## Fonctionnement cote client

### Nouveau flux d'acceptation (page `/client/devis`)
1. Le client clique sur "Accepter"
2. Un Dialog s'ouvre avec :
   - Recapitulatif du devis (titre, montant)
   - Un **canvas de signature** (zone de dessin tactile/souris) avec fond blanc
   - Un bouton "Effacer" pour recommencer
   - Une checkbox "J'appose la mention Bon pour accord"
   - Le bouton "Confirmer" n'est actif que si la signature est dessinee ET la checkbox cochee
3. A la confirmation, la signature (image base64 PNG) est stockee dans l'objet `Devis` en memoire, avec la date de signature et le nom du signataire

### Composant `SignaturePad.tsx`
- Nouveau composant reutilisable utilisant l'API Canvas HTML5
- Supporte souris et tactile (touch events)
- Trait noir lisse de 2px sur fond blanc
- Methodes exposees : `clear()`, `isEmpty()`, `toDataURL()`
- Responsive : s'adapte a la largeur du Dialog

---

## Fonctionnement cote PDF

### Modification de `generateDevisPdf()`
- Si le devis a le statut "accepte" et contient une signature (`signatureDataUrl`), le PDF affiche :
  - Un bandeau vert "ACCEPTE" en haut a droite
  - La mention "Bon pour accord" en texte sous le tableau
  - L'image de la signature dans la zone prevue
  - Le nom du signataire et la date de signature
- Si le devis n'est pas signe, le PDF reste identique (zone vide)

---

## Details techniques

### Type `Devis` enrichi (dans `mockData.ts`)
Ajout de 3 champs optionnels :
- `signatureDataUrl?: string` -- image base64 de la signature
- `signataireNom?: string` -- nom du signataire
- `dateSignature?: string` -- date de signature

### Nouveau fichier
```
src/components/SignaturePad.tsx
```
Composant Canvas avec :
- `useRef` pour le canvas
- Gestion des events `mousedown/mousemove/mouseup` et `touchstart/touchmove/touchend`
- Props : `onSignatureChange(isEmpty: boolean)`, `ref` pour appeler `toDataURL()` et `clear()`

### Fichiers modifies
```
src/data/mockData.ts          -- Ajout champs signature au type Devis
src/contexts/DemoDataContext.tsx  -- Nouvelle fonction updateDevisSignature(id, signatureData, nom, date)
src/pages/client/ClientDevis.tsx  -- Dialog de signature avec SignaturePad + checkbox
src/lib/generatePdf.ts         -- Affichage signature + "Bon pour accord" dans le PDF
```

### Aucune nouvelle dependance
Le composant utilise uniquement l'API Canvas native du navigateur, pas de librairie externe.
