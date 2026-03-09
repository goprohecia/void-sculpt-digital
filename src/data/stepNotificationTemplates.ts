export interface StepNotificationConfig {
  message: string;
  canal: "sms" | "email" | "both";
  enabled: boolean;
}

export const NOTIFICATION_VARIABLES = [
  { key: "{nom_client}", label: "Nom du client" },
  { key: "{date}", label: "Date" },
  { key: "{heure}", label: "Heure" },
  { key: "{nom_business}", label: "Nom de l'entreprise" },
];

/**
 * Default notification templates per sector.
 * Keys are sector keys from DemoPlanContext, values map step names to config.
 */
export const STEP_NOTIFICATION_DEFAULTS: Record<string, Record<string, StepNotificationConfig>> = {
  garages: {
    "Restitution véhicule": { message: "Bonjour {nom_client}, votre véhicule est prêt. Nous sommes ouverts jusqu'à 18h. — {nom_business}", canal: "sms", enabled: true },
    "Diagnostic": { message: "Bonjour {nom_client}, le diagnostic de votre véhicule est terminé. Nous vous contacterons pour le devis. — {nom_business}", canal: "email", enabled: true },
    "Accord client": { message: "Merci {nom_client}, votre accord a bien été enregistré. Les travaux vont débuter. — {nom_business}", canal: "email", enabled: false },
  },
  coiffure: {
    "Prise de rendez-vous": { message: "Bonjour {nom_client}, votre RDV du {date} à {heure} est confirmé. À bientôt ! — {nom_business}", canal: "sms", enabled: true },
    "Encaissement": { message: "Merci pour votre visite {nom_client} ! À bientôt chez {nom_business}.", canal: "email", enabled: false },
  },
  conciergerie: {
    "Ménage": { message: "Bonjour {nom_client}, votre logement a été nettoyé et est prêt. — {nom_business}", canal: "both", enabled: true },
    "Check-in voyageur": { message: "Bonjour {nom_client}, le check-in est prévu le {date} à {heure}. — {nom_business}", canal: "sms", enabled: true },
    "Check-out": { message: "Merci {nom_client}, le check-out a bien été effectué. — {nom_business}", canal: "email", enabled: true },
  },
  btp: {
    "Terrassement": { message: "Bonjour {nom_client}, votre chantier a démarré aujourd'hui. — {nom_business}", canal: "sms", enabled: true },
    "Réception travaux": { message: "Bonjour {nom_client}, les travaux sont terminés. La réception est prévue le {date}. — {nom_business}", canal: "both", enabled: true },
  },
  "auto-ecole": {
    "Confirmation": { message: "Bonjour {nom_client}, votre inscription est confirmée. Première leçon le {date} à {heure}. — {nom_business}", canal: "sms", enabled: true },
  },
  "coach-sportif": {
    "Séance découverte": { message: "Bonjour {nom_client}, votre séance découverte est prévue le {date} à {heure}. — {nom_business}", canal: "sms", enabled: true },
  },
  immobilier: {
    "Signature du compromis": { message: "Bonjour {nom_client}, la signature du compromis est prévue le {date}. — {nom_business}", canal: "email", enabled: true },
    "Remise des clés": { message: "Félicitations {nom_client} ! La remise des clés est prévue le {date}. — {nom_business}", canal: "both", enabled: true },
  },
  photographe: {
    "Livraison galerie": { message: "Bonjour {nom_client}, votre galerie photo est prête ! — {nom_business}", canal: "email", enabled: true },
  },
  evenementiel: {
    "Jour J – Installation": { message: "Bonjour {nom_client}, l'installation pour votre événement commence aujourd'hui. — {nom_business}", canal: "sms", enabled: true },
  },
  mariage: {
    "Jour J – Installation": { message: "Le grand jour est arrivé {nom_client} ! L'installation est en cours. — {nom_business}", canal: "sms", enabled: true },
  },
};

/** Get the default notification config for a step in a given sector */
export function getDefaultStepNotification(sectorKey: string | null, stepName: string): StepNotificationConfig {
  if (sectorKey && STEP_NOTIFICATION_DEFAULTS[sectorKey]?.[stepName]) {
    return { ...STEP_NOTIFICATION_DEFAULTS[sectorKey][stepName] };
  }
  return {
    message: `Bonjour {nom_client}, l'étape "${stepName}" de votre dossier a été mise à jour. — {nom_business}`,
    canal: "email",
    enabled: false,
  };
}
