

# Plan — Messagerie : restrictions par rôle + messagerie groupée

## Résumé

1. Ajouter `destinataire_type` et `is_group_message` aux tables DB
2. Restreindre l'espace client à ne contacter que la Direction
3. Ajouter le module `messagerie-groupee` dans `ALL_MODULE_KEYS`
4. Construire l'interface employé de messagerie groupée
5. Afficher les messages groupés côté client avec indicateur visuel

## Modifications DB (1 migration)

```sql
-- Ajouter destinataire_type sur conversations
ALTER TABLE public.conversations 
  ADD COLUMN destinataire_type text NOT NULL DEFAULT 'admin';

-- Ajouter is_group_message sur messages
ALTER TABLE public.messages 
  ADD COLUMN is_group_message boolean NOT NULL DEFAULT false;
```

**RLS** : Ajouter une politique restrictive sur `conversations` pour les clients : ils ne peuvent INSERT que si `destinataire_type = 'admin'`.

```sql
CREATE POLICY "Clients can only create admin conversations"
ON public.conversations FOR INSERT TO authenticated
WITH CHECK (
  CASE WHEN has_role(auth.uid(), 'client') 
    THEN destinataire_type = 'admin' 
    ELSE true 
  END
);
```

## Modifications code

### 1. `src/contexts/DemoPlanContext.tsx`
- Ajouter `"messagerie-groupee"` dans `ALL_MODULE_KEYS`
- Ajouter dans `DEFAULT_PLAN_MODULES.business` et dans les `DEFAULT_SECTOR_RECOMMENDATIONS` pertinents

### 2. `src/pages/client/ClientMessaging.tsx`
- Header de conversation : afficher "Direction" au lieu de "Équipe Impartial"
- Messages groupés (`is_group_message === true`) : afficher un badge "📢 Message de groupe", masquer le champ de réponse pour ces messages
- Bouton "Nouvelle conversation" crée toujours avec `destinataire_type: 'admin'`

### 3. `src/pages/employee/EmployeeMessaging.tsx`
- Remplacer le placeholder vide par une vraie interface de messagerie
- Charger les conversations assignées à l'employé (via `dossier_employe` → `client_id` → `conversations`)
- Ajouter un bouton "Envoyer à mon groupe" qui :
  - Affiche un dialog de sélection : "Tous mes clients" / sélection manuelle
  - Envoie un message bulk (insert dans chaque conversation client avec `is_group_message: true`)
  - Le message apparaît dans le fil de chaque client

### 4. `src/hooks/use-conversations.ts`
- Mapper les nouveaux champs `destinataire_type` et `is_group_message` dans les types

### 5. `src/data/mockData.ts`
- Ajouter `destinataire_type` et `is_group_message` aux conversations/messages mock

### 6. `src/data/sectorModules.ts`
- Ajouter `GENERIC_MODULE_LABELS["messagerie-groupee"]` = "Messagerie groupée"

## Fichiers impactés

| Fichier | Action |
|---|---|
| Migration SQL | Ajouter 2 colonnes + 1 policy RLS |
| `src/contexts/DemoPlanContext.tsx` | Ajouter module key |
| `src/data/sectorModules.ts` | Label du module |
| `src/pages/client/ClientMessaging.tsx` | Restriction direction + badge groupe |
| `src/pages/employee/EmployeeMessaging.tsx` | Interface complète + envoi groupé |
| `src/hooks/use-conversations.ts` | Mapper nouveaux champs |
| `src/data/mockData.ts` | Champs mock |

