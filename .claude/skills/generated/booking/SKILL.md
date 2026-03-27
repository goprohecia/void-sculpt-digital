---
name: booking
description: "Skill for the Booking area of void-sculpt-digital. 5 symbols across 2 files."
---

# Booking

5 symbols | 2 files | Cohesion: 89%

## When to Use

- Working with code in `src/`
- Understanding how BookingPage, getContent, generateSlots work
- Modifying booking-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/booking/BookingStepSlot.tsx` | isHeureInPlages, isDateInRange, generateSlots |
| `src/pages/public/BookingPage.tsx` | BookingPage, getContent |

## Entry Points

Start here when exploring this area:

- **`BookingPage`** (Function) — `src/pages/public/BookingPage.tsx:33`
- **`getContent`** (Function) — `src/pages/public/BookingPage.tsx:91`
- **`generateSlots`** (Function) — `src/components/booking/BookingStepSlot.tsx:26`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `BookingPage` | Function | `src/pages/public/BookingPage.tsx` | 33 |
| `getContent` | Function | `src/pages/public/BookingPage.tsx` | 91 |
| `generateSlots` | Function | `src/components/booking/BookingStepSlot.tsx` | 26 |
| `isHeureInPlages` | Function | `src/components/booking/BookingStepSlot.tsx` | 18 |
| `isDateInRange` | Function | `src/components/booking/BookingStepSlot.tsx` | 22 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `BookingPage → IsDateInRange` | intra_community | 3 |
| `BookingPage → IsHeureInPlages` | intra_community | 3 |
| `BookingPage → GenId` | cross_community | 3 |
| `BookingPage → Dispatch` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Designer | 1 calls |

## How to Explore

1. `gitnexus_context({name: "BookingPage"})` — see callers and callees
2. `gitnexus_query({query: "booking"})` — find related execution flows
3. Read key files listed above for implementation details
