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

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // Green family — positive / active / in-progress
  en_cours:      { label: "En cours",      className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  termine:       { label: "Terminé",       className: "bg-green-100 text-green-800 border-green-200" },
  payee:         { label: "Payée",         className: "bg-green-100 text-green-800 border-green-200" },
  accepte:       { label: "Accepté",       className: "bg-green-100 text-green-800 border-green-200" },
  actif:         { label: "Actif",         className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  resolu:        { label: "Résolu",        className: "bg-green-100 text-green-800 border-green-200" },
  validee:       { label: "Validée",       className: "bg-green-100 text-green-800 border-green-200" },
  envoyee:       { label: "Envoyée",       className: "bg-teal-100 text-teal-800 border-teal-200" },
  reponse_recue: { label: "Réponse reçue", className: "bg-teal-100 text-teal-800 border-teal-200" },
  normale:       { label: "Normale",       className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  en_revue:      { label: "En revue",      className: "bg-teal-50 text-teal-700 border-teal-200" },
  a_venir:       { label: "À venir",       className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  nouvelle:      { label: "Nouvelle",      className: "bg-teal-100 text-teal-800 border-teal-200" },

  // Amber — warning / pending
  en_attente:    { label: "En attente",    className: "bg-amber-100 text-amber-800 border-amber-200" },
  a_envoyer:     { label: "À envoyer",     className: "bg-amber-100 text-amber-800 border-amber-200" },
  ouvert:        { label: "Ouvert",        className: "bg-amber-100 text-amber-800 border-amber-200" },
  haute:         { label: "Haute",         className: "bg-amber-100 text-amber-800 border-amber-200" },

  // Red — negative / critical
  annule:        { label: "Annulé",        className: "bg-red-100 text-red-800 border-red-200" },
  en_retard:     { label: "En retard",     className: "bg-red-100 text-red-800 border-red-200" },
  refuse:        { label: "Refusé",        className: "bg-red-100 text-red-800 border-red-200" },
  refusee:       { label: "Refusée",       className: "bg-red-100 text-red-800 border-red-200" },
  urgente:       { label: "Urgente",       className: "bg-red-100 text-red-800 border-red-200" },

  // Neutral / muted
  inactif:       { label: "Inactif",       className: "bg-gray-100 text-gray-600 border-gray-200" },
  expire:        { label: "Expiré",        className: "bg-gray-100 text-gray-600 border-gray-200" },
  ferme:         { label: "Fermé",         className: "bg-gray-100 text-gray-600 border-gray-200" },
  basse:         { label: "Basse",         className: "bg-gray-100 text-gray-600 border-gray-200" },
  passe:         { label: "Passé",         className: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-600" };

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
