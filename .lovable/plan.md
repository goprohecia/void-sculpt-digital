

## Plan: Module 02 — Lien de réservation + Stripe (UI mockée)

### Métiers concernés

Ce module cible **tous les corps de métier avec prise de RDV** :

- Garage & Carrosserie
- Salon de coiffure / Institut de beauté
- Auto-école
- Boutique de robes de mariée
- Salle de sport / Coach sportif
- Cabinet d'avocats / Cabinet comptable
- Agent immobilier
- Conciergerie Airbnb
- Wedding planner
- Photographe / Vidéaste
- Formateur indépendant

On ajoutera une fonction `isBookingEnabled(sector)` similaire à `isAssignationEnabled`, avec une liste blanche des secteurs concernés. Les secteurs purement "projet" (développeur, designer, community manager, consultant) auront le booking désactivé.

---

### Constat actuel

- Aucune route publique `/rdv/:slug`
- Aucun onglet "Réservation" dans AdminSettings
- Pas de données mock pour créneaux ou config booking

---

### Fichiers à créer

| Fichier | Description |
|---|---|
| `src/pages/public/BookingPage.tsx` | Page publique `/rdv/:slug`, stepper 4 étapes |
| `src/components/booking/BookingStepper.tsx` | Barre de progression visuelle |
| `src/components/booking/BookingStepSlot.tsx` | Étape 1 — Grille hebdomadaire de créneaux |
| `src/components/booking/BookingStepForm.tsx` | Étape 2 — Formulaire pré-RDV conditionnel |
| `src/components/booking/BookingStepRecap.tsx` | Étape 3 — Récap + acompte + conditions |
| `src/components/booking/BookingStepConfirmation.tsx` | Étape 4 — Confirmation simulée |

### Fichiers à modifier

| Fichier | Modification |
|---|---|
| `src/data/mockData.ts` | Ajouter `BookingConfig`, `TimeSlot`, `MOCK_BOOKING_CONFIG`, `MOCK_SLOTS` |
| `src/data/sectorModules.ts` | Ajouter `isBookingEnabled(sector)` — désactivé pour dev/designer/CM/consultant |
| `src/contexts/DemoDataContext.tsx` | Ajouter état `bookingConfig` + getters/setters |
| `src/pages/admin/AdminSettings.tsx` | Ajouter 10e onglet "Réservation" (slug + copier, acompte fixe/%, toggle formulaire, champs custom) |
| `src/components/AnimatedRoutes.tsx` | Ajouter route `/rdv/:slug` → `BookingPage` |

---

### Détail technique

**1. Données mock** — `BookingConfig` (slug, acompteType fixe/%, montant, formulaireEnabled, champsFormulaire[]) + ~40 `TimeSlot` sur la semaine avec 3 statuts : disponible, indisponible, verrouillé.

**2. Page publique** — Layout standalone (pas d'AdminLayout), stepper horizontal. L'étape 2 (formulaire) est skippée si `formulaireEnabled === false`. Le bouton "Payer l'acompte" à l'étape 3 affiche simplement l'écran de confirmation (pas de vrai Stripe).

**3. Grille créneaux** — Navigation ← semaine → , 7 colonnes Lun-Dim, créneaux 9h-18h. Disponible = vert cliquable, Indisponible = grisé, Verrouillé = orange + cadenas.

**4. Admin Settings > Réservation** — Slug + preview URL + copier, select fixe/pourcentage + input montant, switch formulaire + CRUD champs dynamiques.

**5. Secteur config** — `isBookingEnabled()` retourne `true` pour garage, coiffure, mariage, coach-sportif, immobilier, conciergerie, photographe, formateur, cabinets, evenementiel, boutique, btp, nettoyage, traiteur, dj-animateur. Retourne `false` pour developpeur, designer, community-manager, consultant.

