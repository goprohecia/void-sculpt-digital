// [MBA] Droits par rôle et par offre — bible v3 sections 4.1, 4.2, 4.3
// Hook centralisé combinant le rôle (DemoAuthContext) et l'offre (useSubscription)
// pour exposer des flags booléens clairs utilisables dans tous les composants.

import { useDemoAuth, type DemoRole } from "@/contexts/DemoAuthContext";
import { useSubscription } from "@/hooks/use-subscription";
import type { SubscriptionPlan } from "@/contexts/DemoPlanContext";

export interface RoleRights {
  // ── Rôle courant ──
  role: DemoRole;
  plan: SubscriptionPlan;
  isAdmin: boolean;
  isEmployee: boolean;
  isClient: boolean;

  // ── Droits par rôle (bible v3 section 4) ──
  canViewAllDossiers: boolean;       // Admin: oui | Employé: non (ses dossiers) | Client: non (ses dossiers)
  canViewFinancials: boolean;        // Admin: oui | Employé: non | Client: non
  canAccessSettings: boolean;        // Admin: oui | Employé: non | Client: non
  canCreateDeleteClients: boolean;   // Admin: oui | Employé: non | Client: non
  canViewOtherEmployeeDossiers: boolean; // Admin: oui | Employé: non (sauf autorisation) | Client: non
  canAssignDossiers: boolean;        // Admin: oui | Employé: non | Client: non
  canCancelDossier: boolean;         // Admin: oui | Employé: non | Client: non
  canViewInternalNotes: boolean;     // Admin: oui | Employé: oui | Client: non
  canAddNotes: boolean;              // Admin: oui | Employé: oui | Client: non
  canAddPhotosDocuments: boolean;    // Admin: oui | Employé: oui | Client: non (télécharge seulement)
  canSendMessages: boolean;          // Admin: oui | Employé: oui (ses clients) | Client: oui (admin uniquement)
  canSendGroupMessages: boolean;     // Admin: oui | Employé: oui | Client: non
  canViewCalendar: boolean;          // Admin: oui (tous) | Employé: oui (personnel) | Client: oui (ses RDV)
  canNotifyClient: boolean;          // Admin: oui | Employé: oui | Client: non
  canEditContextInfo: boolean;       // Admin: oui | Employé: non | Client: non
  canValidateCDC: boolean;           // Admin: oui | Employé: non | Client: non
  canEditPreviewUrl: boolean;        // Admin: oui | Employé: non | Client: non
  canManageTeam: boolean;            // Admin: oui | Employé: non | Client: non

  // ── Droits par offre (bible v3 section 2 + 4) ──
  canAdvanceTimeline: boolean;       // Admin: toujours | Employé: Business+ | Client: non
  canRevertTimeline: boolean;        // Admin: toujours | Employé: non | Client: non
  canCustomizeSteps: boolean;        // Admin: Business+ | Employé: non | Client: non
  canCustomizeVocabulary: boolean;   // Enterprise uniquement
  isTimelineReadOnly: boolean;       // Client: toujours | Employé Starter: oui | sinon: non
  canMarkDossierComplete: boolean;   // Admin: oui | Employé Business+: oui | Client: non

  // ── Messagerie (bible v3 section 4.4) ──
  // Client peut écrire à admin/direction uniquement, PAS à l'employé
  // Employé peut envoyer groupé, client reçoit sans répondre
  canContactEmployee: boolean;       // Client: non | Admin: oui | Employé: n/a
  canReceiveGroupMessages: boolean;  // Client: oui (lecture seule) | Employé: n/a | Admin: n/a
  canReplyToGroupMessages: boolean;  // Client: non | Employé: n/a | Admin: n/a

  // ── Paiements ──
  canViewPaymentSchedule: boolean;   // Admin: oui | Client: oui (son échéancier) | Employé: non
  canMarkPaymentPaid: boolean;       // Admin: oui | Employé: non | Client: non
}

export function useRoleRights(): RoleRights {
  const { user } = useDemoAuth();
  const { plan, isStarter, isBusiness, isEnterprise } = useSubscription();

  const role: DemoRole = user?.role ?? "admin";
  const isAdmin = role === "admin" || role === "superadmin";
  const isEmployee = role === "employee";
  const isClient = role === "client";

  return {
    role,
    plan,
    isAdmin,
    isEmployee,
    isClient,

    // ── Droits par rôle ──
    canViewAllDossiers: isAdmin,
    canViewFinancials: isAdmin,
    canAccessSettings: isAdmin,
    canCreateDeleteClients: isAdmin,
    canViewOtherEmployeeDossiers: isAdmin,
    canAssignDossiers: isAdmin,
    canCancelDossier: isAdmin,
    canViewInternalNotes: isAdmin || isEmployee,
    canAddNotes: isAdmin || isEmployee,
    canAddPhotosDocuments: isAdmin || isEmployee,
    canSendMessages: true, // tous peuvent envoyer (le destinataire est restreint côté UI)
    canSendGroupMessages: isAdmin || isEmployee,
    canViewCalendar: true,
    canNotifyClient: isAdmin || isEmployee,
    canEditContextInfo: isAdmin,
    canValidateCDC: isAdmin,
    canEditPreviewUrl: isAdmin,
    canManageTeam: isAdmin,

    // ── Droits par offre ──
    canAdvanceTimeline: isAdmin || (isEmployee && !isStarter),
    canRevertTimeline: isAdmin,
    canCustomizeSteps: isAdmin && (isBusiness || isEnterprise),
    canCustomizeVocabulary: isEnterprise,
    isTimelineReadOnly: isClient || (isEmployee && isStarter),
    canMarkDossierComplete: isAdmin || (isEmployee && !isStarter),

    // ── Messagerie ──
    canContactEmployee: !isClient, // Client ne peut PAS contacter l'employé directement
    canReceiveGroupMessages: isClient,
    canReplyToGroupMessages: false, // Client ne peut jamais répondre individuellement aux messages groupés

    // ── Paiements ──
    canViewPaymentSchedule: isAdmin || isClient,
    canMarkPaymentPaid: isAdmin,
  };
}
