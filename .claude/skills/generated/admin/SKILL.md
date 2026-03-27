---
name: admin
description: "Skill for the Admin area of void-sculpt-digital. 245 symbols across 75 files."
---

# Admin

245 symbols | 75 files | Cohesion: 76%

## When to Use

- Working with code in `src/`
- Understanding how useSubscription, useOnboardingStatus, resetOnboarding work
- Modifying admin-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/admin/CahierDesChargesForm.tsx` | CahierDesChargesForm, removeAttachment, formatFileSize, removeFonctionnalite, updateFonctionnalite (+7) |
| `src/pages/admin/AdminSettings.tsx` | AdminSettings, handleSave, renderContent, ServiceCategoriesManager, startEdit (+5) |
| `src/pages/admin/AdminEmails.tsx` | handleExportCsv, AdminEmails, handleAddCustomType, renderTypeSelector, renderAttachments (+5) |
| `src/components/admin/TimelineTemplateEditor.tsx` | cancelEdit, saveTemplate, TimelineTemplateEditor, startEdit, startFromPreset (+5) |
| `src/pages/admin/AdminPipeline.tsx` | AdminPipeline, getDealHistory, handleDragStart, handleDragOver, openEditDeal (+5) |
| `src/components/admin/StockImportDialog.tsx` | handleClose, guessField, parseCSV, parseExcel, StockImportDialog (+3) |
| `src/pages/admin/AdminDocuments.tsx` | detectType, formatSize, handleImport, handleRename, AdminDocuments (+3) |
| `src/components/admin/StepNotificationSettings.tsx` | StepNotificationSettings, rerender, updateConfig, handleBlur, insertVariable (+2) |
| `src/pages/admin/AdminTemps.tsx` | AdminTemps, formatElapsed, formatDuree, handleSaveEntry, handleDiscard (+2) |
| `src/pages/admin/AdminTaches.tsx` | emptyForm, AdminTaches, getDossierLabel, openCreate, openEdit (+2) |

## Entry Points

Start here when exploring this area:

- **`useSubscription`** (Function) — `src/hooks/use-subscription.ts:21`
- **`useOnboardingStatus`** (Function) — `src/hooks/use-onboarding.ts:4`
- **`resetOnboarding`** (Function) — `src/hooks/use-onboarding.ts:27`
- **`getNotificationsAdmin`** (Function) — `src/hooks/use-notifications-data.ts:78`
- **`useMetierVocabulaire`** (Function) — `src/hooks/use-metier-vocabulaire.ts:10`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useSubscription` | Function | `src/hooks/use-subscription.ts` | 21 |
| `useOnboardingStatus` | Function | `src/hooks/use-onboarding.ts` | 4 |
| `resetOnboarding` | Function | `src/hooks/use-onboarding.ts` | 27 |
| `getNotificationsAdmin` | Function | `src/hooks/use-notifications-data.ts` | 78 |
| `useMetierVocabulaire` | Function | `src/hooks/use-metier-vocabulaire.ts` | 10 |
| `getLabel` | Function | `src/hooks/use-metier-vocabulaire.ts` | 59 |
| `useDemoPlan` | Function | `src/contexts/DemoPlanContext.tsx` | 174 |
| `AdminSettings` | Function | `src/pages/admin/AdminSettings.tsx` | 570 |
| `handleSave` | Function | `src/pages/admin/AdminSettings.tsx` | 659 |
| `renderContent` | Function | `src/pages/admin/AdminSettings.tsx` | 738 |
| `SwapUpgradeBanner` | Function | `src/components/client/SwapUpgradeBanner.tsx` | 11 |
| `BookingSettingsTab` | Function | `src/components/admin/BookingSettingsTab.tsx` | 24 |
| `removeField` | Function | `src/components/admin/BookingSettingsTab.tsx` | 129 |
| `toggleRequired` | Function | `src/components/admin/BookingSettingsTab.tsx` | 133 |
| `AdminModulesSection` | Function | `src/components/admin/AdminModulesSection.tsx` | 50 |
| `handleSwapComplete` | Function | `src/components/admin/AdminModulesSection.tsx` | 124 |
| `AdminLayout` | Function | `src/components/admin/AdminLayout.tsx` | 22 |
| `ModulesTab` | Function | `src/components/client/settings/ModulesTab.tsx` | 33 |
| `renderIcon` | Function | `src/components/client/settings/ModulesTab.tsx` | 68 |
| `useSectorRoleLabels` | Function | `src/hooks/use-sector-role-labels.ts` | 7 |

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
| Hooks | 51 calls |
| Ui | 4 calls |
| Client | 4 calls |
| Designer | 3 calls |

## How to Explore

1. `gitnexus_context({name: "useSubscription"})` — see callers and callees
2. `gitnexus_query({query: "admin"})` — find related execution flows
3. Read key files listed above for implementation details
