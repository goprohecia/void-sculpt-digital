

# Supprimer les donnees mock du dashboard admin en mode reel

## Probleme

Quand vous etes connecte avec votre vrai compte (`contact@impartialgames.com`), le dashboard et la sidebar affichent encore des donnees fictives (chiffre d'affaires 35.2k, activites recentes, badges "5" messagerie, "3" support). Ces donnees proviennent d'imports directs du fichier `mockData.ts` qui ne tiennent pas compte du mode demo/reel.

## Ce qui fonctionne deja

Les hooks `useDossiers`, `useClients`, `useFactures` detectent correctement le mode reel et interrogent la base de donnees (qui est vide, d'ou les "0" pour dossiers actifs, nouveaux clients, factures en attente).

## Ce qui ne fonctionne pas

Plusieurs donnees sont importees directement depuis `mockData.ts` sans passer par la logique demo/reel :

### 1. Dashboard (`AdminDashboard.tsx`)
- **`donneesMensuelles`** : utilise pour le CA (35.2k) et le graphique Tendance CA
- **`activites`** : affiche 8 activites fictives
- **`relances`** : utilise dans le calendrier des echeances
- **`totalNonLus`** : affiche le lien "X messages non lus"

### 2. Sidebar (`AdminSidebar.tsx`)
- **`totalNonLus`** : badge "5" sur Messagerie
- **`getOpenTicketsCount()`** : badge "3" sur Support

## Solution

### Fichier `AdminDashboard.tsx`
- Remplacer les imports directs par les hooks existants (`useRelances`, `useConversations`)
- Pour le CA (`donneesMensuelles`) : utiliser le hook existant ou les donnees de la base `donnees_mensuelles`
- Pour les activites : ne rien afficher en mode reel (pas de table activites en base), ou masquer la section
- Calculer `totalNonLus` a partir du hook `useConversations` au lieu de l'import mock
- Conditionner l'affichage des tendances ("+23.5% vs jan.") : ne pas les afficher quand il n'y a pas de donnees historiques

### Fichier `AdminSidebar.tsx`
- Remplacer l'import statique `totalNonLus` par un hook `useConversations` pour calculer dynamiquement le nombre de messages non lus
- Remplacer `getOpenTicketsCount()` par un hook `useTickets` pour calculer dynamiquement les tickets ouverts
- En mode reel sans donnees, ces badges afficheront 0 (et ne seront pas visibles)

## Details techniques

### Modifications dans `AdminDashboard.tsx`
- Ajouter les imports : `useConversations`, `useRelances`, `useIsDemo`
- Utiliser `useRelances()` au lieu de l'import direct `relances`
- Calculer `totalNonLus` depuis `useConversations().conversations`
- Pour `donneesMensuelles` : creer un hook ou requeter directement `donnees_mensuelles` ; en attendant, afficher `0k` quand pas de donnees
- Conditionner l'affichage du graphique Tendance CA et des activites recentes : masquer ou afficher "Aucune donnee" si les tableaux sont vides
- Retirer les `trend` des KPIs quand il n'y a pas d'historique

### Modifications dans `AdminSidebar.tsx`
- Remplacer `totalNonLus` (import statique) par un calcul dynamique via `useConversations`
- Remplacer `getOpenTicketsCount()` par un calcul dynamique via `useTickets`
- Les badges ne s'afficheront que si la valeur est > 0

### Fichiers concernes
- `src/pages/admin/AdminDashboard.tsx`
- `src/components/admin/AdminSidebar.tsx`

