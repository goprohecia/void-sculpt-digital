
# Notifications en temps reel et Support/Tickets

## 1. Systeme de notifications

### Donnees mock
Ajouter dans `mockData.ts` :
- Interface `Notification` avec : `id`, `type` (dossier | facture | message | devis | ticket), `titre`, `description`, `date`, `lu` (boolean), `lien` (URL interne), `destinataire` ("admin" | "client" | "all")
- 15 notifications fictives reparties entre admin et client (changements de statut de dossier, nouvelle facture, nouveau message, etc.)
- Helpers `getNotificationsAdmin()` et `getNotificationsByClient(clientId)`

### Composant NotificationPanel
Creer `src/components/admin/NotificationPanel.tsx` :
- Icone cloche dans le header avec badge compteur (pastille rouge avec nombre de non-lues)
- Au clic : popover/dropdown avec la liste des notifications recentes
- Chaque notification affiche une icone coloree selon le type, le titre, la description tronquee, et le temps relatif ("il y a 2h")
- Bouton "Marquer tout comme lu" en haut du panel
- Clic sur une notification : marque comme lue + navigation vers la page concernee (via `lien`)
- Animation framer-motion sur l'apparition du panel et sur les items

### Integration dans les layouts
- Modifier `AdminLayout.tsx` : ajouter la cloche dans le header (entre le spacer et le badge "Mode demo"), filtrer les notifications admin
- Modifier `ClientLayout.tsx` : idem, filtrer les notifications du client demo
- Utiliser un state local avec `useState` pour gerer le toggle lu/non-lu (pas de persistence en mode demo)

---

## 2. Rubrique Support/Tickets (espace client)

### Donnees mock
Ajouter dans `mockData.ts` :
- Types : `TicketPriority` = "basse" | "normale" | "haute" | "urgente" ; `TicketStatus` = "ouvert" | "en_cours" | "resolu" | "ferme"
- Interface `Ticket` : `id`, `reference`, `clientId`, `sujet`, `description`, `priorite`, `statut`, `dateCreation`, `dateMiseAJour`, `messages` (tableau de `TicketMessage` avec `id`, `contenu`, `role`, `date`)
- 5 tickets fictifs pour le client demo (c3 - Luxe & Mode) avec des sujets varies : bug, question technique, demande fonctionnelle, etc.
- Helper `getTicketsByClient(clientId)`

### Page ClientSupport (`/client/support`)
Creer `src/pages/client/ClientSupport.tsx` :
- En-tete avec titre "Support & Assistance" + bouton "Nouveau ticket"
- Liste des tickets sous forme de cards avec : reference, sujet, priorite (badge colore), statut (badge), date de creation
- Filtres par statut (tous, ouverts, en cours, resolus)
- Au clic sur un ticket : affichage du detail dans un panneau lateral (desktop) ou plein ecran (mobile) avec l'historique des messages et une zone de reponse
- Formulaire "Nouveau ticket" dans un Dialog/Drawer : champs sujet, description, priorite (select)
- Animations framer-motion coherentes avec le reste du back-office (AdminPageTransition, stagger)

### Integration dans StatusBadge
- Ajouter les statuts `TicketStatus` et `TicketPriority` dans le composant `StatusBadge.tsx` pour reutiliser les badges colores existants

### Cote admin : visibilite des tickets
- Ajouter un lien "Support" dans `AdminSidebar.tsx` (icone `LifeBuoy`)
- Creer `src/pages/admin/AdminSupport.tsx` : vue de tous les tickets de tous les clients avec filtres par client, statut et priorite, possibilite de repondre et changer le statut

### Routing
- Ajouter dans `AnimatedRoutes.tsx` :
  - `/client/support` vers `ClientSupport`
  - `/admin/support` vers `AdminSupport`

### Navigation
- Ajouter "Support" dans `ClientSidebar.tsx` (icone `LifeBuoy`, avec badge compteur tickets ouverts)
- Ajouter "Support" dans `AdminSidebar.tsx` (icone `LifeBuoy`, avec badge compteur tickets ouverts total)

---

## Details techniques

### Nouveaux fichiers
```text
src/components/admin/NotificationPanel.tsx    -- Dropdown notifications
src/pages/client/ClientSupport.tsx            -- Page support client
src/pages/admin/AdminSupport.tsx              -- Page support admin
```

### Fichiers modifies
```text
src/data/mockData.ts                          -- Ajout notifications + tickets
src/components/admin/AdminLayout.tsx          -- Cloche notifications dans header
src/components/admin/ClientLayout.tsx         -- Cloche notifications dans header
src/components/admin/AdminSidebar.tsx         -- Lien Support
src/components/admin/ClientSidebar.tsx        -- Lien Support
src/components/admin/StatusBadge.tsx          -- Statuts tickets + priorites
src/components/AnimatedRoutes.tsx             -- Routes /client/support et /admin/support
```

### Librairies utilisees (toutes deja installees)
- `framer-motion` pour les animations
- `lucide-react` pour les icones (Bell, LifeBuoy, AlertTriangle, etc.)
- Composants Shadcn : Popover, Dialog/Drawer, Badge, Tabs, Textarea, Select
- `date-fns` pour le formatage de dates relatives
