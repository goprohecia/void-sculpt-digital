---
name: client
description: "Skill for the Client area of void-sculpt-digital. 13 symbols across 5 files."
---

# Client

13 symbols | 5 files | Cohesion: 69%

## When to Use

- Working with code in `src/`
- Understanding how useTickets, ClientSupport, handleSendMessage work
- Modifying client-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/pages/client/ClientDevis.tsx` | ClientDevis, handleAccept, handleRefuse, resetSignatureState |
| `src/pages/client/ClientSupport.tsx` | ClientSupport, handleSendMessage, formatDate |
| `src/components/client/ModuleSwapWizard.tsx` | capitalize, ModuleSwapWizard, renderIcon |
| `src/hooks/use-tickets.ts` | mapRow, useTickets |
| `src/hooks/use-devis.ts` | getDevisByClient |

## Entry Points

Start here when exploring this area:

- **`useTickets`** (Function) — `src/hooks/use-tickets.ts:31`
- **`ClientSupport`** (Function) — `src/pages/client/ClientSupport.tsx:20`
- **`handleSendMessage`** (Function) — `src/pages/client/ClientSupport.tsx:46`
- **`formatDate`** (Function) — `src/pages/client/ClientSupport.tsx:83`
- **`getDevisByClient`** (Function) — `src/hooks/use-devis.ts:136`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useTickets` | Function | `src/hooks/use-tickets.ts` | 31 |
| `ClientSupport` | Function | `src/pages/client/ClientSupport.tsx` | 20 |
| `handleSendMessage` | Function | `src/pages/client/ClientSupport.tsx` | 46 |
| `formatDate` | Function | `src/pages/client/ClientSupport.tsx` | 83 |
| `getDevisByClient` | Function | `src/hooks/use-devis.ts` | 136 |
| `ClientDevis` | Function | `src/pages/client/ClientDevis.tsx` | 17 |
| `handleAccept` | Function | `src/pages/client/ClientDevis.tsx` | 29 |
| `handleRefuse` | Function | `src/pages/client/ClientDevis.tsx` | 41 |
| `resetSignatureState` | Function | `src/pages/client/ClientDevis.tsx` | 46 |
| `ModuleSwapWizard` | Function | `src/components/client/ModuleSwapWizard.tsx` | 54 |
| `renderIcon` | Function | `src/components/client/ModuleSwapWizard.tsx` | 90 |
| `mapRow` | Function | `src/hooks/use-tickets.ts` | 15 |
| `capitalize` | Function | `src/components/client/ModuleSwapWizard.tsx` | 41 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ClientDevis → UseDemoAuth` | cross_community | 4 |
| `AdminSupport → UseDemoAuth` | cross_community | 4 |
| `ClientSupport → UseDemoAuth` | cross_community | 4 |
| `ClientDevis → UseDemoData` | cross_community | 3 |
| `AdminSupport → MapRow` | cross_community | 3 |
| `AdminSidebar → MapRow` | cross_community | 3 |
| `ClientSupport → UseDemoData` | cross_community | 3 |
| `ClientSupport → MapRow` | intra_community | 3 |
| `ClientSidebar → MapRow` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Hooks | 6 calls |
| Cluster_2 | 1 calls |

## How to Explore

1. `gitnexus_context({name: "useTickets"})` — see callers and callees
2. `gitnexus_query({query: "client"})` — find related execution flows
3. Read key files listed above for implementation details
