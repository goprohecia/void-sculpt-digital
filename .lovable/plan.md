
# Cahier des charges dans chaque dossier admin + obligation pour le client

## Objectif

1. Afficher le cahier des charges (CDC) directement dans la page de detail de chaque dossier admin (`/admin/dossiers/:id`)
2. Cote client, bloquer la progression du dossier tant que le CDC n'est pas rempli (statut "complet") apres l'acceptation du devis

---

## Modifications prevues

### 1. Lier Dossier et Demande

Actuellement, `Dossier` et `Demande` ne sont pas lies. Il faut ajouter un champ optionnel `demandeId` a l'interface `Dossier` pour pouvoir retrouver le CDC associe.

**Fichier : `src/data/mockData.ts`**
- Ajouter `demandeId?: string` a l'interface `Dossier`
- Lier le dossier `d3` (E-commerce Luxe & Mode, client c3) a la demande `dem1` qui possede deja un CDC complet

### 2. Fonction utilitaire dans le contexte

**Fichier : `src/contexts/DemoDataContext.tsx`**
- Ajouter `getCahierByDossier(dossierId: string)` qui :
  1. Recupere le dossier par id
  2. Si le dossier a un `demandeId`, retourne le CDC de cette demande
  3. Sinon retourne `undefined`

### 3. Section CDC dans le detail dossier admin

**Fichier : `src/pages/admin/AdminDossierDetail.tsx`**
- Ajouter une section "Cahier des charges" entre la timeline et le preview link
- Si un CDC est lie au dossier :
  - Afficher un resume (contexte, fonctionnalites, contraintes) en lecture seule
  - Bouton "Voir le cahier des charges complet" qui ouvre le `CahierDesChargesView` existant
  - Badge de statut (complet / brouillon)
- Si aucun CDC n'est lie :
  - Message "Aucun cahier des charges associe a ce dossier"

### 4. Blocage cote client si CDC non rempli

**Fichier : `src/pages/client/ClientDossierDetail.tsx`**
- Apres l'etape "Devis accepte" (etape 3+), si le CDC n'est pas en statut "complet" :
  - Afficher une banniere d'alerte bien visible : "Vous devez completer le cahier des charges pour que le developpement puisse commencer"
  - Bouton "Remplir le cahier des charges" qui ouvre le formulaire `CahierDesChargesForm`
  - La timeline reste bloquee visuellement a l'etape "Devis accepte" tant que le CDC n'est pas complet
- Une fois le CDC complet, la progression reprend normalement

### 5. Blocage visuel dans la liste des dossiers client

**Fichier : `src/pages/client/ClientDossiers.tsx`** (si existant)
- Ajouter un badge "CDC requis" sur les dossiers en cours qui n'ont pas de CDC complet

---

## Flux utilisateur

```text
Devis accepte --> Dossier passe en "En cours"
  --> Client voit une banniere "CDC obligatoire"
  --> Client remplit le CDC via le formulaire
  --> CDC passe en "complet"
  --> La progression du dossier reprend normalement

Admin --> Ouvre un dossier
  --> Voit la section CDC avec le contenu ou "Aucun CDC"
  --> Peut ouvrir le detail complet du CDC
```

## Fichiers concernes

| Fichier | Action |
|---------|--------|
| `src/data/mockData.ts` | Ajouter `demandeId?` a `Dossier`, lier d3 a dem1 |
| `src/contexts/DemoDataContext.tsx` | Ajouter `getCahierByDossier` |
| `src/pages/admin/AdminDossierDetail.tsx` | Ajouter section CDC avec vue et badge |
| `src/pages/client/ClientDossierDetail.tsx` | Ajouter banniere obligatoire + bouton formulaire CDC |
