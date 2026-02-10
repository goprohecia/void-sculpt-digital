
# Remplacement de l'email contact@ par studio@impartialgames.com

## Contexte
L'adresse `contact@impartialgames.com` est utilisee a 12 endroits dans le projet. Elle doit etre remplacee par `studio@impartialgames.com` partout.

## Fichiers a modifier

### 1. Site public (affichage visiteurs)
- **src/components/Footer.tsx** — lien mailto et texte affiche
- **src/pages/Contact.tsx** — lien mailto et texte affiche
- **src/components/sections/CTAFinal.tsx** — lien mailto et texte affiche

### 2. Pages legales
- **src/pages/legal/PolitiqueConfidentialite.tsx** — 2 occurrences (coordonnees + contact RGPD)

### 3. Generation de PDF
- **src/lib/generatePdf.ts** — email dans les en-tetes de factures/devis
- **src/lib/generateCdcPdf.ts** — email dans les en-tetes du cahier des charges

### 4. Edge Functions (expediteur des emails Resend)
Les 6 fonctions utilisent `noreply@impartialgames.com` comme adresse d'expedition. Ce champ reste sur `noreply@` car c'est l'adresse d'envoi automatique (pas de reponse attendue). **Aucun changement necessaire** sur les edge functions, sauf si vous souhaitez aussi changer le `noreply@` en `studio@`.

## Resume des modifications
| Fichier | Changement |
|---|---|
| Footer.tsx | `contact@` → `studio@` (href + texte) |
| Contact.tsx | `contact@` → `studio@` (href + texte) |
| CTAFinal.tsx | `contact@` → `studio@` (href + texte) |
| PolitiqueConfidentialite.tsx | `contact@` → `studio@` (2 occurrences) |
| generatePdf.ts | `contact@` → `studio@` |
| generateCdcPdf.ts | `contact@` → `studio@` |

Total : 6 fichiers, ~10 remplacements simples de chaine de caracteres. Aucun changement de logique.
