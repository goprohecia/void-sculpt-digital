
# Dissocier les comptes clients reels du mode demo

## Probleme identifie

Le probleme fondamental est que **toutes les pages client utilisent `DEMO_CLIENT_ID` ("c3") en dur** pour filtrer les donnees, que l'utilisateur soit en mode demo ou connecte avec un vrai compte. Cela signifie que :

1. En mode reel, les hooks interrogent la base de donnees (pas de mock) mais filtrent par `clientId === "c3"` -- ce qui ne correspond a aucun vrai client
2. Le dashboard client affiche "Bienvenue, Sophie" et "Luxe & Mode" en dur
3. Certaines pages (`ClientDossierDetail`, `ClientPaiement`, `ClientSettings`) utilisent directement `useDemoData()` au lieu des hooks dynamiques, ce qui retourne toujours les donnees mock

## Pages concernees et problemes specifiques

| Page | Probleme |
|------|----------|
| `ClientDashboard` | `DEMO_CLIENT_ID` partout + import direct de `getConversationsByClient` et `getRendezVousByClient` depuis mockData + "Bienvenue, Sophie" en dur |
| `ClientDossiers` | `DEMO_CLIENT_ID` en dur |
| `ClientDemandes` | `DEMO_CLIENT_ID` en dur + `clientNom: "Luxe & Mode"` en dur dans la creation |
| `ClientDevis` | `DEMO_CLIENT_ID` en dur |
| `ClientFactures` | `DEMO_CLIENT_ID` en dur |
| `ClientMessaging` | `DEMO_CLIENT_ID` en dur |
| `ClientSupport` | `DEMO_CLIENT_ID` en dur + `clientNom: "Luxe & Mode"` en dur |
| `ClientProfile` | `DEMO_CLIENT_ID` en dur |
| `ClientSettings` | Utilise `useDemoData()` directement (pas de hook dynamique) + `DEMO_CLIENT_ID` |
| `ClientDossierDetail` | Utilise `useDemoData()` directement |
| `ClientPaiement` | Utilise `useDemoData()` directement |
| `ClientSidebar` | `DEMO_CLIENT_ID` en dur |
| `ClientLayout` | `DEMO_CLIENT_ID` pour les notifications |

## Solution

### 1. Creer un hook `useClientId`

Un nouveau hook centralise qui sera utilise partout. Il retourne :
- `DEMO_CLIENT_ID` si l'utilisateur est en mode demo
- L'ID du client reel (depuis la table `clients.user_id`) si l'utilisateur est connecte avec un vrai compte
- Les infos du client (nom, prenom, entreprise) pour personnaliser l'interface

### 2. Remplacer `DEMO_CLIENT_ID` par `useClientId()` dans toutes les pages

Chaque page client utilisera le hook au lieu de l'import statique.

### 3. Corriger les pages qui utilisent `useDemoData()` directement

- `ClientDossierDetail` : utiliser les hooks `useDossiers`, `useFactures`, `useDevis`, `useCahiers`
- `ClientPaiement` : utiliser les hooks `useFactures`, `useDossiers`
- `ClientSettings` : utiliser le hook `useClients` au lieu de `useDemoData()`

### 4. Dynamiser les textes en dur

- "Bienvenue, Sophie" --> "Bienvenue, {prenom}"
- "Luxe & Mode" --> "{entreprise}" ou nom du client reel
- Sidebar : afficher le nom reel du client connecte

## Details techniques

### Nouveau fichier : `src/hooks/use-client-id.ts`

```typescript
// Retourne le clientId courant (demo ou reel)
// En mode reel, interroge la table "clients" 
// avec WHERE user_id = supabaseUserId
// En mode demo, retourne DEMO_CLIENT_ID
```

Le hook effectuera une requete `clients` filtree par `user_id` pour trouver le record client associe au compte Supabase. Si aucun client n'existe en base, les pages afficheront les empty states.

### Fichiers modifies (13 fichiers)

1. **`src/hooks/use-client-id.ts`** (nouveau) -- hook centralise
2. **`src/pages/client/ClientDashboard.tsx`** -- remplacer `DEMO_CLIENT_ID`, dynamiser "Bienvenue, Sophie", utiliser `useConversations` au lieu de l'import mock
3. **`src/pages/client/ClientDossiers.tsx`** -- remplacer `DEMO_CLIENT_ID`
4. **`src/pages/client/ClientDemandes.tsx`** -- remplacer `DEMO_CLIENT_ID` + dynamiser `clientNom`
5. **`src/pages/client/ClientDevis.tsx`** -- remplacer `DEMO_CLIENT_ID`
6. **`src/pages/client/ClientFactures.tsx`** -- remplacer `DEMO_CLIENT_ID`
7. **`src/pages/client/ClientMessaging.tsx`** -- remplacer `DEMO_CLIENT_ID`
8. **`src/pages/client/ClientSupport.tsx`** -- remplacer `DEMO_CLIENT_ID` + dynamiser `clientNom`
9. **`src/pages/client/ClientProfile.tsx`** -- remplacer `DEMO_CLIENT_ID`
10. **`src/pages/client/ClientSettings.tsx`** -- migrer de `useDemoData` vers `useClients` + remplacer `DEMO_CLIENT_ID`
11. **`src/pages/client/ClientDossierDetail.tsx`** -- migrer de `useDemoData` vers les hooks dynamiques
12. **`src/pages/client/ClientPaiement.tsx`** -- migrer de `useDemoData` vers les hooks dynamiques
13. **`src/components/admin/ClientSidebar.tsx`** -- remplacer `DEMO_CLIENT_ID` + dynamiser le nom affiche
14. **`src/components/admin/ClientLayout.tsx`** -- remplacer `DEMO_CLIENT_ID` pour les notifications

### Logique du hook `useClientId`

```
Si isDemo --> retourne DEMO_CLIENT_ID
Si supabaseUserId existe --> requete SELECT id FROM clients WHERE user_id = supabaseUserId
  --> retourne l'id du client trouve (ou null si pas encore de fiche client)
```

Cela garantit que le client `dylan110598@icloud.com` ne verra que ses propres donnees (actuellement vides, avec des empty states) et jamais les donnees mock de Sophie/Luxe & Mode.
