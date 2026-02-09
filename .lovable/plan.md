

# Refonte de la timeline : Rendez-vous obligatoire + reordonnancement CDC / Devis

## Objectif

Passer de la timeline actuelle a 7 etapes a une nouvelle timeline a 8 etapes avec un ordre different :

```text
Actuel :  1.Demande recue > 2.Devis envoye > 3.Devis accepte > 4.CDC > 5.En cours > 6.Livraison > 7.Termine
Nouveau : 1.Demande recue > 2.Rendez-vous > 3.CDC > 4.Devis envoye > 5.Devis accepte > 6.En cours > 7.Livraison > 8.Termine
```

Le rendez-vous devient obligatoire apres la demande recue, le CDC est rempli apres le rendez-vous, puis le devis est envoye sur la base du CDC valide.

---

## Modifications prevues

### 1. Modele de donnees - `src/data/mockData.ts`

- Ajouter un champ optionnel `rdvEffectue?: boolean` a l'interface `Dossier` pour indiquer si le rendez-vous initial a eu lieu
- Mettre a jour les dossiers mock existants avec ce champ

### 2. Contexte - `src/contexts/DemoDataContext.tsx`

- Ajouter une fonction `marquerRdvEffectue(dossierId: string)` pour que l'admin puisse marquer le RDV comme effectue
- Exposer cette fonction dans le contexte

### 3. Timeline admin - `src/pages/admin/AdminDossierDetail.tsx`

- Changer le tableau `etapes` vers les 8 nouvelles etapes
- Mettre a jour `getEtapeIndex` :
  - `en_attente` sans RDV effectue : index 0 (bloque a Demande recue)
  - `en_attente` avec RDV effectue, sans CDC valide : index 1 (Rendez-vous fait)
  - `en_attente` avec CDC valide : index 2 (CDC valide)
  - `en_cours` : index 5 (En cours)
  - `termine` : index 7
- Ajouter icone CalendarDays sur l'etape 2 (Rendez-vous) et FileText sur l'etape 3 (CDC)
- Sous-textes : "A planifier" / "Effectue" pour l'etape RDV, "A remplir" / "En validation" / "Valide" pour le CDC
- Ajouter un bouton "Marquer RDV effectue" quand le dossier n'a pas encore `rdvEffectue`

### 4. Timeline client - `src/pages/client/ClientDossierDetail.tsx`

- Meme tableau `etapes` a 8 etapes
- Meme logique `getEtapeIndex` adaptee
- Icone CalendarDays pour l'etape Rendez-vous, FileText pour le CDC
- Sous-texte "A planifier" / "Effectue" sur l'etape RDV
- Banniere d'action "Prendre rendez-vous" (ouvrant le CalendlyBookingDialog) si le RDV n'est pas encore effectue

### 5. Fichiers concernes

| Fichier | Modification |
|---------|-------------|
| `src/data/mockData.ts` | Ajout `rdvEffectue` a l'interface Dossier + mise a jour mock |
| `src/contexts/DemoDataContext.tsx` | Fonction `marquerRdvEffectue`, exposee dans le contexte |
| `src/pages/admin/AdminDossierDetail.tsx` | Timeline 8 etapes, bouton marquer RDV, nouvelle logique |
| `src/pages/client/ClientDossierDetail.tsx` | Timeline 8 etapes, banniere prise de RDV, CalendlyBookingDialog |

