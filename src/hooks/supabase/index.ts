// [MBA] Hooks Supabase MVP — point d'entrée unique
// Usage: import { useMbaClients, useMbaDossiers } from "@/hooks/supabase";

// ── Core (tables existantes, prêtes) ──
export { useMbaClients } from "./use-mba-clients";
export { useMbaDossiers } from "./use-mba-dossiers";
export { useMbaFactures } from "./use-mba-factures";
export { useMbaMessages } from "./use-mba-messages";

// ── Conciergerie (en attente confirmation Hamza) ──
export { useMbaLogements } from "./use-mba-logements";
export { useMbaMissions } from "./use-mba-missions";
