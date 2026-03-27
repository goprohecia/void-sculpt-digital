---
name: hooks
description: "Skill for the Hooks area of void-sculpt-digital. 116 symbols across 66 files."
---

# Hooks

116 symbols | 66 files | Cohesion: 63%

## When to Use

- Working with code in `src/`
- Understanding how useIsDemo, usePermissions, usePermission work
- Modifying hooks-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/hooks/use-produits.ts` | useProduits, useCategories, useFournisseurs, useStockMouvements, useBonsCommande |
| `src/hooks/use-toast.ts` | addToRemoveQueue, reducer, dispatch, update, dismiss |
| `src/pages/admin/AdminEmployees.tsx` | AdminEmployees, openModulesDialog, toggleModule, getEmployeeRole |
| `src/hooks/use-factures.ts` | getFacturesByDossier, useFactures, getFacturesByClient, getFactureById |
| `src/pages/admin/AdminDossierDetail.tsx` | getEtapeIndex, AdminDossierDetail, handleAssign, handleStatutChange |
| `src/hooks/use-parallax.tsx` | prefersReducedMotion, isMobile, useParallax, useParallaxTransform |
| `src/hooks/use-conversations.ts` | mapRow, useConversations, getConversationsByClient |
| `src/hooks/use-dossiers.ts` | useDossiers, getDossiersByClient, getDossierById |
| `src/hooks/use-cahiers.ts` | mapRow, useCahiers, getCahierByDemande |
| `src/hooks/use-permission.ts` | usePermission, usePermissions |

## Entry Points

Start here when exploring this area:

- **`useIsDemo`** (Function) — `src/hooks/useIsDemo.ts:8`
- **`usePermissions`** (Function) — `src/hooks/use-permissions.ts:68`
- **`usePermission`** (Function) — `src/hooks/use-permission.ts:9`
- **`usePermissions`** (Function) — `src/hooks/use-permission.ts:42`
- **`useEventsManuels`** (Function) — `src/hooks/use-events-manuels.ts:21`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useIsDemo` | Function | `src/hooks/useIsDemo.ts` | 8 |
| `usePermissions` | Function | `src/hooks/use-permissions.ts` | 68 |
| `usePermission` | Function | `src/hooks/use-permission.ts` | 9 |
| `usePermissions` | Function | `src/hooks/use-permission.ts` | 42 |
| `useEventsManuels` | Function | `src/hooks/use-events-manuels.ts` | 21 |
| `useDossierEmploye` | Function | `src/hooks/use-dossier-employe.ts` | 13 |
| `useCustomSpaces` | Function | `src/hooks/use-custom-spaces.ts` | 44 |
| `useConversations` | Function | `src/hooks/use-conversations.ts` | 33 |
| `useCompteId` | Function | `src/hooks/use-compte-id.ts` | 13 |
| `useCalendlyEvents` | Function | `src/hooks/use-calendly-events.ts` | 41 |
| `useAnalyticsData` | Function | `src/hooks/use-analytics-data.ts` | 9 |
| `WhiteLabelProvider` | Function | `src/hooks/use-white-label.tsx` | 84 |
| `EmployeeMessaging` | Function | `src/pages/employee/EmployeeMessaging.tsx` | 21 |
| `handleSelectConv` | Function | `src/pages/employee/EmployeeMessaging.tsx` | 56 |
| `EmployeeClients` | Function | `src/pages/employee/EmployeeClients.tsx` | 15 |
| `ClientRendezVous` | Function | `src/pages/client/ClientRendezVous.tsx` | 13 |
| `AdminRendezVous` | Function | `src/pages/admin/AdminRendezVous.tsx` | 23 |
| `getRdvForDay` | Function | `src/pages/admin/AdminRendezVous.tsx` | 70 |
| `AdminMessaging` | Function | `src/pages/admin/AdminMessaging.tsx` | 23 |
| `handleSelectConv` | Function | `src/pages/admin/AdminMessaging.tsx` | 62 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `AdminDossierDetail → UseDemoAuth` | cross_community | 4 |
| `AdminAnalytics → UseDemoAuth` | cross_community | 4 |
| `AdminEmails → UseDemoAuth` | cross_community | 4 |
| `AdminDossiers → UseDemoAuth` | cross_community | 4 |
| `ClientDashboard → UseDemoAuth` | cross_community | 4 |
| `AdminBilling → UseDemoAuth` | cross_community | 4 |
| `AdminDashboard → UseDemoAuth` | cross_community | 4 |
| `ClientDossierDetail → UseDemoAuth` | cross_community | 4 |
| `ClientDevis → UseDemoAuth` | cross_community | 4 |
| `AdminClients → UseDemoAuth` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Admin | 15 calls |
| Ui | 4 calls |
| Cluster_1 | 2 calls |
| Cluster_2 | 2 calls |
| Client | 1 calls |

## How to Explore

1. `gitnexus_context({name: "useIsDemo"})` — see callers and callees
2. `gitnexus_query({query: "hooks"})` — find related execution flows
3. Read key files listed above for implementation details
