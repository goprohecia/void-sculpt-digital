

## Module 06 — Gestion des disponibilités par pro

### Audit

| Élément | Statut |
|---|---|
| Page "Mes disponibilités" espace Pro | **Manquant** — `EmployeeCalendrier` est vide (placeholder) |
| Onglets horaires / exceptions / congés | **Manquant** |
| Vue calendrier globale équipe (Admin) | **Manquant** — `AdminAgenda` existe mais sans vue équipe ni disponibilités |
| Filtrage créneaux booking par disponibilités | **Manquant** — `generateSlots()` est aléatoire |

### Plan d'implémentation

#### 1. Données mock (`mockData.ts`)

Ajouter les types et données :

```typescript
export interface PlageHoraire {
  debut: string; // "09:00"
  fin: string;   // "12:00"
}

export interface DisponibilitesHebdo {
  [jour: number]: PlageHoraire[]; // 0=Lun..6=Dim
}

export interface ExceptionDispo {
  id: string;
  date: string; // "2026-03-15"
  disponible: boolean;
  plages?: PlageHoraire[];
}

export interface Conge {
  id: string;
  debut: string; // "2026-04-01"
  fin: string;   // "2026-04-10"
}

export interface ProDisponibilites {
  employeeId: string;
  horaires: DisponibilitesHebdo;
  exceptions: ExceptionDispo[];
  conges: Conge[];
}
```

Ajouter `MOCK_DISPONIBILITES: ProDisponibilites[]` avec des données pour les 4 team members. Ajouter une couleur par membre (`couleur` dans `TeamMember`).

#### 2. Page "Mes disponibilités" — Refonte `EmployeeCalendrier.tsx`

Transformer la page vide en page complète avec `Tabs` (3 onglets) :

- **Onglet "Horaires habituels"** : Grille Lun–Dim, chaque jour affiche ses plages avec boutons Ajouter/Supprimer. Inputs time pour début/fin.
- **Onglet "Exceptions"** : DatePicker + plages horaires + toggle Disponible/Indisponible. Liste des exceptions sous forme de tags avec bouton supprimer.
- **Onglet "Congés"** : Deux DatePickers (début → fin) + bouton Ajouter. Liste des périodes avec bouton Supprimer.

État local via `useState`, initialisé depuis les données mock du pro connecté.

#### 3. Vue calendrier globale équipe — Modifier `AdminAgenda.tsx`

Ajouter une section "Disponibilités équipe" au-dessous ou via un toggle :
- Grille semaine avec une ligne par pro, couleur distincte par membre
- Plages disponibles affichées en barres colorées
- Congés affichés en bandes barrées
- Clic sur un pro → Sheet/Dialog avec ses disponibilités modifiables (réutilisation des composants de l'onglet pro)

#### 4. Filtrage des créneaux booking — Modifier `BookingStepSlot.tsx` / `BookingPage.tsx`

Modifier `generateSlots()` pour accepter un paramètre `disponibilites: ProDisponibilites[]` :
- Un créneau n'est `"disponible"` que si au moins un pro est disponible à cette heure (selon horaires hebdo)
- Si tous les pros sont en congé ce jour → `"indisponible"`
- Si une exception "indisponible" couvre ce créneau → `"indisponible"`
- Conserver la logique aléatoire pour `"verrouille"` / `"reserve"` en simulation

### Fichiers à créer

| Fichier | Description |
|---|---|
| *(aucun nouveau fichier)* | — |

### Fichiers à modifier

| Fichier | Modification |
|---|---|
| `src/data/mockData.ts` | Ajouter types disponibilités + `MOCK_DISPONIBILITES` + couleur sur `TeamMember` |
| `src/pages/employee/EmployeeCalendrier.tsx` | Refonte complète : 3 onglets horaires/exceptions/congés |
| `src/pages/admin/AdminAgenda.tsx` | Ajouter vue calendrier globale équipe avec couleurs et panneau détail |
| `src/components/booking/BookingStepSlot.tsx` | Modifier `generateSlots()` pour filtrer selon disponibilités |
| `src/pages/public/BookingPage.tsx` | Importer et passer les disponibilités mock à `generateSlots()` |

