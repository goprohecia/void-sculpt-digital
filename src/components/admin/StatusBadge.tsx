import { cn } from "@/lib/utils";

type StatusType =
  | "en_cours" | "termine" | "en_attente" | "annule"
  | "payee" | "en_retard"
  | "accepte" | "refuse" | "expire"
  | "a_envoyer" | "envoyee" | "reponse_recue"
  | "actif" | "inactif"
  | "ouvert" | "resolu" | "ferme"
  | "basse" | "normale" | "haute" | "urgente";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  en_cours: { label: "En cours", className: "bg-neon-blue/20 text-[hsl(200,100%,70%)] border-[hsl(200,100%,50%)]/30" },
  termine: { label: "Terminé", className: "bg-neon-green/20 text-[hsl(155,100%,65%)] border-[hsl(155,100%,45%)]/30" },
  en_attente: { label: "En attente", className: "bg-[hsl(45,93%,55%)]/20 text-[hsl(45,93%,65%)] border-[hsl(45,93%,55%)]/30" },
  annule: { label: "Annulé", className: "bg-destructive/20 text-[hsl(0,84%,70%)] border-destructive/30" },
  payee: { label: "Payée", className: "bg-neon-green/20 text-[hsl(155,100%,65%)] border-[hsl(155,100%,45%)]/30" },
  en_retard: { label: "En retard", className: "bg-destructive/20 text-[hsl(0,84%,70%)] border-destructive/30" },
  a_envoyer: { label: "À envoyer", className: "bg-[hsl(45,93%,55%)]/20 text-[hsl(45,93%,65%)] border-[hsl(45,93%,55%)]/30" },
  envoyee: { label: "Envoyée", className: "bg-neon-blue/20 text-[hsl(200,100%,70%)] border-[hsl(200,100%,50%)]/30" },
  reponse_recue: { label: "Réponse reçue", className: "bg-neon-green/20 text-[hsl(155,100%,65%)] border-[hsl(155,100%,45%)]/30" },
  actif: { label: "Actif", className: "bg-neon-green/20 text-[hsl(155,100%,65%)] border-[hsl(155,100%,45%)]/30" },
  inactif: { label: "Inactif", className: "bg-muted text-muted-foreground border-border" },
  accepte: { label: "Accepté", className: "bg-neon-green/20 text-[hsl(155,100%,65%)] border-[hsl(155,100%,45%)]/30" },
  refuse: { label: "Refusé", className: "bg-destructive/20 text-[hsl(0,84%,70%)] border-destructive/30" },
  expire: { label: "Expiré", className: "bg-muted text-muted-foreground border-border" },
  // Ticket statuses
  ouvert: { label: "Ouvert", className: "bg-[hsl(45,93%,55%)]/20 text-[hsl(45,93%,65%)] border-[hsl(45,93%,55%)]/30" },
  resolu: { label: "Résolu", className: "bg-neon-green/20 text-[hsl(155,100%,65%)] border-[hsl(155,100%,45%)]/30" },
  ferme: { label: "Fermé", className: "bg-muted text-muted-foreground border-border" },
  // Ticket priorities
  basse: { label: "Basse", className: "bg-muted text-muted-foreground border-border" },
  normale: { label: "Normale", className: "bg-neon-blue/20 text-[hsl(200,100%,70%)] border-[hsl(200,100%,50%)]/30" },
  haute: { label: "Haute", className: "bg-[hsl(45,93%,55%)]/20 text-[hsl(45,93%,65%)] border-[hsl(45,93%,55%)]/30" },
  urgente: { label: "Urgente", className: "bg-destructive/20 text-[hsl(0,84%,70%)] border-destructive/30" },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
