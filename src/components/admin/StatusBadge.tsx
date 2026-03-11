import { cn } from "@/lib/utils";

type StatusType =
  | "en_cours" | "termine" | "en_attente" | "annule"
  | "payee" | "en_retard"
  | "accepte" | "refuse" | "expire"
  | "a_envoyer" | "envoyee" | "reponse_recue"
  | "actif" | "inactif"
  | "ouvert" | "resolu" | "ferme"
  | "basse" | "normale" | "haute" | "urgente"
  | "nouvelle" | "en_revue" | "validee" | "refusee"
  | "a_venir" | "passe";

const statusConfig: Record<StatusType, { label: string; dotColor: string; className: string }> = {
  // Green — Actif / Terminé / Payée / Accepté / Résolu / Validée
  actif:         { label: "Actif",          dotColor: "bg-[#15803d]", className: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]" },
  termine:       { label: "Terminé",        dotColor: "bg-[#15803d]", className: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]" },
  payee:         { label: "Payée",          dotColor: "bg-[#15803d]", className: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]" },
  accepte:       { label: "Accepté",        dotColor: "bg-[#15803d]", className: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]" },
  resolu:        { label: "Résolu",         dotColor: "bg-[#15803d]", className: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]" },
  validee:       { label: "Validée",        dotColor: "bg-[#15803d]", className: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]" },
  reponse_recue: { label: "Réponse reçue", dotColor: "bg-[#15803d]", className: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]" },

  // Blue — En cours / Envoyée / Normale / En revue / À venir
  en_cours:      { label: "En cours",       dotColor: "bg-[#1d4ed8]", className: "bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]" },
  envoyee:       { label: "Envoyée",        dotColor: "bg-[#1d4ed8]", className: "bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]" },
  normale:       { label: "Normale",        dotColor: "bg-[#1d4ed8]", className: "bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]" },
  en_revue:      { label: "En revue",       dotColor: "bg-[#1d4ed8]", className: "bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]" },
  a_venir:       { label: "À venir",        dotColor: "bg-[#1d4ed8]", className: "bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]" },
  nouvelle:      { label: "Nouvelle",       dotColor: "bg-[#1d4ed8]", className: "bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]" },

  // Yellow — En attente / À envoyer / Ouvert / Haute
  en_attente:    { label: "En attente",     dotColor: "bg-[#854d0e]", className: "bg-[#fef9c3] text-[#854d0e] border-[#fef08a]" },
  a_envoyer:     { label: "À envoyer",      dotColor: "bg-[#854d0e]", className: "bg-[#fef9c3] text-[#854d0e] border-[#fef08a]" },
  ouvert:        { label: "Ouvert",         dotColor: "bg-[#854d0e]", className: "bg-[#fef9c3] text-[#854d0e] border-[#fef08a]" },
  haute:         { label: "Haute",          dotColor: "bg-[#854d0e]", className: "bg-[#fef9c3] text-[#854d0e] border-[#fef08a]" },

  // Grey — Inactif / Expiré / Fermé / Basse / Passé
  inactif:       { label: "Inactif",        dotColor: "bg-[#6b7280]", className: "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]" },
  expire:        { label: "Expiré",         dotColor: "bg-[#6b7280]", className: "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]" },
  ferme:         { label: "Fermé",          dotColor: "bg-[#6b7280]", className: "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]" },
  basse:         { label: "Basse",          dotColor: "bg-[#6b7280]", className: "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]" },
  passe:         { label: "Passé",          dotColor: "bg-[#6b7280]", className: "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]" },

  // Red — Annulé / En retard / Refusé / Urgente / Refusée
  annule:        { label: "Annulé",         dotColor: "bg-[#b91c1c]", className: "bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]" },
  en_retard:     { label: "En retard",      dotColor: "bg-[#b91c1c]", className: "bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]" },
  refuse:        { label: "Refusé",         dotColor: "bg-[#b91c1c]", className: "bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]" },
  urgente:       { label: "Urgente",        dotColor: "bg-[#b91c1c]", className: "bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]" },
  refusee:       { label: "Refusée",        dotColor: "bg-[#b91c1c]", className: "bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]" },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status] || { label: status, dotColor: "bg-[#6b7280]", className: "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]" };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      {config.label}
    </span>
  );
}
