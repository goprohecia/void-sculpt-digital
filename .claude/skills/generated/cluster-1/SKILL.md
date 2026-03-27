---
name: cluster-1
description: "Skill for the Cluster_1 area of void-sculpt-digital. 5 symbols across 1 files."
---

# Cluster_1

5 symbols | 1 files | Cohesion: 57%

## When to Use

- Working with code in `src/`
- Understanding how previewFacturePdf work
- Modifying cluster_1-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/generatePdf.ts` | fmt, addHeader, addFooter, buildFactureDoc, previewFacturePdf |

## Entry Points

Start here when exploring this area:

- **`previewFacturePdf`** (Function) — `src/lib/generatePdf.ts:157`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `previewFacturePdf` | Function | `src/lib/generatePdf.ts` | 157 |
| `fmt` | Function | `src/lib/generatePdf.ts` | 12 |
| `addHeader` | Function | `src/lib/generatePdf.ts` | 16 |
| `addFooter` | Function | `src/lib/generatePdf.ts` | 94 |
| `buildFactureDoc` | Function | `src/lib/generatePdf.ts` | 106 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Cluster_2 | 1 calls |

## How to Explore

1. `gitnexus_context({name: "previewFacturePdf"})` — see callers and callees
2. `gitnexus_query({query: "cluster_1"})` — find related execution flows
3. Read key files listed above for implementation details
