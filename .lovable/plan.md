

# Redesign du Dashboard Admin -- Style CRM Premium

Refonte visuelle du dashboard admin pour correspondre au design de reference (CRM Pro), en conservant toutes les fonctionnalites existantes. L'objectif est d'ameliorer la mise en page avec des sections bien definies, des bords arrondis, du glassmorphisme et des separations claires.

---

## Changements visuels principaux

### 1. Header du dashboard
- Titre "Dashboard" plus grand avec emoji et message de bienvenue
- Barre de recherche decorative + bouton d'action rapide en haut a droite (lien vers nouveau dossier)

### 2. KPI Cards (deja existants -- amelioration du style)
- Ajout d'icones colorees plus grandes (comme dans la reference : vert, bleu, violet, jaune)
- Chaque KPI avec une couleur d'accent distincte pour l'icone
- Le composant `DashboardKPI` recevra une prop `iconColor` pour varier les couleurs

### 3. Layout en grille 3 colonnes (desktop)
Reorganisation du contenu en layout type CRM :

**Colonne principale (2/3)** :
- Section "Dossiers recents" avec header (titre + icone + lien "Voir tous") et tableau existant
- Section "Calendrier des echeances" (existant, inchange)
- Section "Derniers emails" (existant, inchange)

**Colonne laterale droite (1/3)** :
- Bloc "Actions rapides" : liens vers Nouveau dossier, Envoyer email, Planifier RDV, Ajouter note
- Bloc "Repartition Clients" (le prospects vs clients existant, deplace ici)
- Bloc "Activite recente" : la liste d'activites existante, deplacee ici avec un style plus compact (points colores + timestamps)

### 4. Sections avec separations claires
- Chaque section encapsulee dans un `glass-card` avec padding genereux
- Titres de section avec icones et badges
- Separateur subtil entre les blocs (border-border/50)

### 5. Sparkline CA
- Deplacee dans la colonne laterale ou integree dans le KPI "Chiffre d'affaires" comme mini-graphique inline

---

## Fichiers modifies

| Fichier | Modification |
|---------|-------------|
| `src/pages/admin/AdminDashboard.tsx` | Refonte complete du layout (grille 2+1 colonnes, sections reorganisees, header enrichi) |
| `src/components/admin/DashboardKPI.tsx` | Ajout prop `iconColor` pour couleur d'icone personnalisee par KPI |

## Details techniques

### DashboardKPI -- Ajout couleur d'icone
```text
- Nouvelle prop optionnelle `iconColor?: string`
- Appliquee sur le conteneur d'icone (bg) et l'icone elle-meme
- Exemples : "emerald" pour CA, "blue" pour dossiers, "amber" pour factures
```

### AdminDashboard -- Nouveau layout
```text
Structure :
- Header (titre + sous-titre + bouton action)
- Grid KPIs (4 colonnes, inchange)
- Grid principale :
  - Col gauche (lg:col-span-2) :
    - Dossiers recents (tableau)
    - Sparkline + Calendrier (grid 2 cols)
    - Emails recents
  - Col droite (lg:col-span-1) :
    - Actions rapides (liens icones)
    - Repartition clients (prospects vs clients)
    - Activite recente (timeline)
    - Messages non lus (lien)
```

### Pas de nouvelles dependances, pas de migration DB
Uniquement du CSS et de la reorganisation JSX avec les classes `glass-card`, `glass-surface` et les utilitaires existants.

