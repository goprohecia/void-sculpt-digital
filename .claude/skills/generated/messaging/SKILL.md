---
name: messaging
description: "Skill for the Messaging area of void-sculpt-digital. 5 symbols across 1 files."
---

# Messaging

5 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how MessageMediaUpload, MessageMediaInline work
- Modifying messaging-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/messaging/MessageMediaUpload.tsx` | getMediaCategory, compressImage, formatSize, MessageMediaUpload, MessageMediaInline |

## Entry Points

Start here when exploring this area:

- **`MessageMediaUpload`** (Function) — `src/components/messaging/MessageMediaUpload.tsx:81`
- **`MessageMediaInline`** (Function) — `src/components/messaging/MessageMediaUpload.tsx:212`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `MessageMediaUpload` | Function | `src/components/messaging/MessageMediaUpload.tsx` | 81 |
| `MessageMediaInline` | Function | `src/components/messaging/MessageMediaUpload.tsx` | 212 |
| `getMediaCategory` | Function | `src/components/messaging/MessageMediaUpload.tsx` | 34 |
| `compressImage` | Function | `src/components/messaging/MessageMediaUpload.tsx` | 40 |
| `formatSize` | Function | `src/components/messaging/MessageMediaUpload.tsx` | 75 |

## How to Explore

1. `gitnexus_context({name: "MessageMediaUpload"})` — see callers and callees
2. `gitnexus_query({query: "messaging"})` — find related execution flows
3. Read key files listed above for implementation details
