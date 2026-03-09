

## Audit — Module 03 (Notifications Push/SMS à l'assignation)

### Ce qui existe déjà

| Élément | Statut |
|---|---|
| `AssignModal` — modale avec cards, checkbox, badge Responsable/Renfort | Complet |
| `AdminDossierDetail` — bouton Assigner/Modifier, avatars + badges après assignation | Complet |
| `EmployeeDossiers` — "Mes dossiers" filtré par employé + badges rôle | Complet |
| Condition `isAssignationEnabled(sector)` — masque si `false` | Complet |
| Notification in-app à l'assignation | **Manquant** |
| Indicateur SMS simulé | **Manquant** |

### Ce qui manque

1. **Notification in-app** — Quand l'admin confirme une assignation, aucune notification n'est créée. Il faut générer automatiquement une notification de type `"assignation"` pour chaque membre assigné.

2. **Canal SMS simulé** — Un indicateur visuel "SMS envoyé" doit apparaître après confirmation dans la modale + les notifications doivent afficher le canal (in-app / SMS).

### Plan d'implémentation

#### 1. Étendre le type Notification (`mockData.ts`)
- Ajouter `"assignation"` au type `NotificationType`
- Ajouter `"employee"` au type `NotificationDestinataire`
- Ajouter champ optionnel `employeeId?: string` à l'interface `Notification`
- Ajouter champ optionnel `canal?: "in-app" | "sms" | "both"` pour tracer le canal de notification

#### 2. Mettre à jour le `NotificationPanel` (`NotificationPanel.tsx`)
- Ajouter icône pour le type `assignation` (ex: `UserPlus`)
- Afficher un petit badge canal (📱 SMS / 🔔 In-app) à côté de chaque notification d'assignation

#### 3. Déclencher les notifications à l'assignation (`AdminDossierDetail.tsx`)
- Après `assignDossier()`, pour chaque membre nouvellement assigné, appeler `addNotification()` avec :
  - type: `"assignation"`
  - titre: `"Nouveau dossier assigné"`
  - description: `"{Reference} — Vous êtes {Responsable|Renfort}"`
  - destinataire: `"employee"`
  - employeeId: l'id du membre
  - canal: `"both"` (in-app + SMS simulé)
- Afficher un toast de confirmation incluant "Notifications envoyées (push + SMS)"

#### 4. Mettre à jour `DemoDataContext.tsx`
- Ajouter `getNotificationsByEmployee(employeeId)` pour filtrer les notifications destinées à un employé
- Exposer cette fonction dans le contexte

#### 5. Panneau notifications côté Employé
- Dans `EmployeeLayout` / sidebar, vérifier que le `NotificationPanel` est présent et branché sur les notifications filtrées par employeeId
- Si absent, l'ajouter avec les notifications filtrées via `getNotificationsByEmployee`

#### 6. Toast SMS simulé dans `AssignModal`
- Après confirmation, afficher un toast secondaire : "📱 SMS de notification envoyé à {N} membre(s)"

### Fichiers à modifier

| Fichier | Modification |
|---|---|
| `src/data/mockData.ts` | Ajouter `"assignation"` au type, `employeeId`, `canal` à l'interface |
| `src/components/admin/NotificationPanel.tsx` | Ajouter icône assignation + badge canal SMS/In-app |
| `src/pages/admin/AdminDossierDetail.tsx` | Générer notifications + toast SMS après assignation |
| `src/contexts/DemoDataContext.tsx` | Ajouter `getNotificationsByEmployee()` |
| `src/hooks/use-notifications-data.ts` | Adapter le mapping pour les nouveaux champs |
| `src/components/admin/EmployeeSidebar.tsx` ou `EmployeeLayout.tsx` | Brancher NotificationPanel côté employé si absent |

### Points critiques respectés
- Notifications conditionnées à `isAssignationEnabled`
- Deux canaux : in-app (push) + SMS (simulé UI uniquement)
- Pas d'envoi réel de SMS — indication visuelle seulement

