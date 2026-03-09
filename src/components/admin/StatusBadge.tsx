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
  en_cours: { label: "En cours", className: "bg-blue-50 text-blue-700 border-blue-200" },
  termine: { label: "Terminé", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  en_attente: { label: "En attente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  annule: { label: "Annulé", className: "bg-red-50 text-red-700 border-red-200" },
  payee: { label: "Payée", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  en_retard: { label: "En retard", className: "bg-red-50 text-red-700 border-red-200" },
  a_envoyer: { label: "À envoyer", className: "bg-amber-50 text-amber-700 border-amber-200" },
  envoyee: { label: "Envoyée", className: "bg-blue-50 text-blue-700 border-blue-200" },
  reponse_recue: { label: "Réponse reçue", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  actif: { label: "Actif", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactif: { label: "Inactif", className: "bg-gray-100 text-gray-500 border-gray-200" },
  accepte: { label: "Accepté", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  refuse: { label: "Refusé", className: "bg-red-50 text-red-700 border-red-200" },
  expire: { label: "Expiré", className: "bg-gray-100 text-gray-500 border-gray-200" },
  ouvert: { label: "Ouvert", className: "bg-amber-50 text-amber-700 border-amber-200" },
  resolu: { label: "Résolu", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ferme: { label: "Fermé", className: "bg-gray-100 text-gray-500 border-gray-200" },
  basse: { label: "Basse", className: "bg-gray-100 text-gray-500 border-gray-200" },
  normale: { label: "Normale", className: "bg-blue-50 text-blue-700 border-blue-200" },
  haute: { label: "Haute", className: "bg-amber-50 text-amber-700 border-amber-200" },
  urgente: { label: "Urgente", className: "bg-red-50 text-red-700 border-red-200" },
  nouvelle: { label: "Nouvelle", className: "bg-violet-50 text-violet-700 border-violet-200" },
  en_revue: { label: "En revue", className: "bg-blue-50 text-blue-700 border-blue-200" },
  validee: { label: "Validée", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  refusee: { label: "Refusée", className: "bg-red-50 text-red-700 border-red-200" },
  a_venir: { label: "À venir", className: "bg-blue-50 text-blue-700 border-blue-200" },
  passe: { label: "Passé", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-500" };

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
