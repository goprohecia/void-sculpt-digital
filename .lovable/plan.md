

## Audit — Module 04 : Verrou de créneau anti double-réservation

### Constat actuel

Le `BookingStepSlot` définit 3 états statiques : `disponible`, `indisponible`, `verrouille`. Mais :
- **"verrouillé"** est purement décoratif (généré aléatoirement au mount), sans logique dynamique
- **Aucun countdown** n'existe
- **Pas d'état "réservé"** (confirmé avec ✓)
- L'état des slots est local à `BookingStepSlot` (constante `MOCK_SLOTS`), donc impossible de le modifier depuis `BookingPage` lors de la confirmation

### Plan d'implémentation

#### 1. Remonter l'état des slots dans `BookingPage.tsx`
- Déplacer `generateSlots()` et l'état `slots` dans `BookingPage` via `useState`
- Passer `slots` + `setSlots` en props à `BookingStepSlot`
- Permettre la mutation des slots (verrouillage, libération, confirmation)

#### 2. Ajouter l'état `"reserve"` au type `SlotStatus`
- `SlotStatus = "disponible" | "indisponible" | "verrouille" | "reserve"`
- Dans la grille : fond foncé (primary) + icône `Check`, non cliquable

#### 3. Logique de verrouillage au clic (`BookingPage.tsx`)
- Quand l'utilisateur sélectionne un créneau disponible :
  - Passer son status à `"verrouille"` dans le state
  - Enregistrer `lockExpiry = Date.now() + 10 * 60 * 1000`
  - Démarrer le countdown
- Si l'utilisateur change de créneau : libérer l'ancien (remettre `"disponible"`), verrouiller le nouveau

#### 4. Composant `BookingCountdown.tsx` — Timer persistant
- Affiché en sticky/fixed en haut de la zone de contenu, **visible sur toutes les étapes** (slot, form, recap)
- Affiche "Votre créneau est réservé pendant MM:SS" avec barre de progression
- Masqué sur l'étape confirmation
- Si timer = 0 :
  - Remettre le slot en `"disponible"`
  - Réinitialiser `selectedSlot` à `null`
  - Revenir à l'étape 1
  - Afficher toast "Votre créneau n'est plus réservé, veuillez en sélectionner un autre"

#### 5. Confirmation → état `"reserve"`
- Quand l'utilisateur confirme (étape recap → confirmation) :
  - Passer le slot à `"reserve"` dans le state
  - Annuler le timer
  - Masquer le countdown

#### 6. Mise à jour visuelle de la grille
- **Disponible** : fond emerald clair, cliquable (inchangé)
- **Verrouillé** : fond amber + texte "En cours..." + non cliquable (modifié — remplacer l'icône cadenas par le texte)
- **Réservé** : fond primary foncé + icône ✓ + non cliquable (nouveau)
- **Indisponible** : inchangé (grisé, barré)
- Mettre à jour la légende avec le 4e état

### Fichiers à créer

| Fichier | Description |
|---|---|
| `src/components/booking/BookingCountdown.tsx` | Barre countdown sticky avec timer MM:SS + barre de progression |

### Fichiers à modifier

| Fichier | Modification |
|---|---|
| `src/components/booking/BookingStepSlot.tsx` | Ajouter état `"reserve"` (visuel ✓), recevoir `slots` en props au lieu de constante locale, texte "En cours..." pour verrouillé |
| `src/pages/public/BookingPage.tsx` | Gérer état slots, logique verrouillage/libération, timer, passer countdown en render persistant |

