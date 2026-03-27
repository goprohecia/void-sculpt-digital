---
name: cluster-2
description: "Skill for the Cluster_2 area of void-sculpt-digital. 4 symbols across 1 files."
---

# Cluster_2

4 symbols | 1 files | Cohesion: 46%

## When to Use

- Working with code in `src/`
- Understanding how generateDevisPdf, previewDevisPdf work
- Modifying cluster_2-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/generatePdf.ts` | addClientInfo, buildDevisDoc, generateDevisPdf, previewDevisPdf |

## Entry Points

Start here when exploring this area:

- **`generateDevisPdf`** (Function) — `src/lib/generatePdf.ts:225`
- **`previewDevisPdf`** (Function) — `src/lib/generatePdf.ts:230`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `generateDevisPdf` | Function | `src/lib/generatePdf.ts` | 225 |
| `previewDevisPdf` | Function | `src/lib/generatePdf.ts` | 230 |
| `addClientInfo` | Function | `src/lib/generatePdf.ts` | 47 |
| `buildDevisDoc` | Function | `src/lib/generatePdf.ts` | 162 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Cluster_1 | 3 calls |

## How to Explore

1. `gitnexus_context({name: "generateDevisPdf"})` — see callers and callees
2. `gitnexus_query({query: "cluster_2"})` — find related execution flows
3. Read key files listed above for implementation details
