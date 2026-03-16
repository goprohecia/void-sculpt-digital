import { getDefaultStepsForSector } from "./sectorTimelines";

export const REPARATEUR_STEPS = getDefaultStepsForSector("reparateur");

export interface ReparateurFiche {
  id: string;
  client: string;
  technicien: string;
  marque: string;
  modele: string;
  panneDeclaree: string;
  panneConstatee: string;
  step: number;
  delaiEstime: string;
  montantDevis: number;
  devisAccepte: boolean | null;
  codeRetrait: string;
  piecesNecessaires: string[];
}

export const MOCK_FICHES: ReparateurFiche[] = [
  {
    id: "rep-1", client: "Lucas Moreau", technicien: "Karim B.", marque: "Apple", modele: "iPhone 14 Pro",
    panneDeclaree: "Écran cassé", panneConstatee: "Écran + connecteur tactile endommagé",
    step: 4, delaiEstime: "2j", montantDevis: 189, devisAccepte: true, codeRetrait: "RET-4829",
    piecesNecessaires: ["Écran OLED iPhone 14 Pro", "Connecteur tactile"],
  },
  {
    id: "rep-2", client: "Marie Dupont", technicien: "Karim B.", marque: "Samsung", modele: "Galaxy S23",
    panneDeclaree: "Ne charge plus", panneConstatee: "Port USB-C oxydé",
    step: 2, delaiEstime: "1j", montantDevis: 65, devisAccepte: null, codeRetrait: "RET-5031",
    piecesNecessaires: ["Port USB-C Galaxy S23"],
  },
  {
    id: "rep-3", client: "Hugo Martin", technicien: "Amina R.", marque: "Apple", modele: "iPad Air 5",
    panneDeclaree: "Batterie gonfle", panneConstatee: "Batterie gonflée, risque de déformation châssis",
    step: 6, delaiEstime: "3j", montantDevis: 120, devisAccepte: true, codeRetrait: "RET-4712",
    piecesNecessaires: ["Batterie iPad Air 5", "Adhésif châssis"],
  },
  {
    id: "rep-4", client: "Léa Petit", technicien: "Amina R.", marque: "Xiaomi", modele: "Redmi Note 12",
    panneDeclaree: "Caméra floue", panneConstatee: "Module caméra arrière défectueux",
    step: 7, delaiEstime: "1j", montantDevis: 55, devisAccepte: true, codeRetrait: "RET-4698",
    piecesNecessaires: ["Module caméra Redmi Note 12"],
  },
];

export interface ReparateurPiece {
  id: string;
  reference: string;
  nom: string;
  quantite: number;
  seuilAlerte: number;
  fournisseur: string;
  prixAchat: number;
}

export const MOCK_STOCK_PIECES: ReparateurPiece[] = [
  { id: "p-1", reference: "ECR-IP14P", nom: "Écran OLED iPhone 14 Pro", quantite: 3, seuilAlerte: 2, fournisseur: "MobileParts EU", prixAchat: 85 },
  { id: "p-2", reference: "BAT-IPA5", nom: "Batterie iPad Air 5", quantite: 5, seuilAlerte: 2, fournisseur: "MobileParts EU", prixAchat: 32 },
  { id: "p-3", reference: "USB-GS23", nom: "Port USB-C Galaxy S23", quantite: 8, seuilAlerte: 3, fournisseur: "PhoneStock", prixAchat: 12 },
  { id: "p-4", reference: "CAM-RN12", nom: "Module caméra Redmi Note 12", quantite: 1, seuilAlerte: 2, fournisseur: "PhoneStock", prixAchat: 18 },
  { id: "p-5", reference: "CON-TACT", nom: "Connecteur tactile universel", quantite: 12, seuilAlerte: 5, fournisseur: "MobileParts EU", prixAchat: 8 },
  { id: "p-6", reference: "ADH-CHAS", nom: "Adhésif châssis (lot 10)", quantite: 4, seuilAlerte: 2, fournisseur: "PhoneStock", prixAchat: 5 },
];

export const REPARATEUR_KPI = {
  appareilsEnCours: 3,
  repTerminesSemaine: 7,
  delaiMoyen: "1.8j",
  caEnCours: 429,
};

export const CHECKLIST_TESTS = [
  "Écran tactile fonctionnel",
  "Capteurs proximité / luminosité OK",
  "Caméra avant / arrière OK",
  "Haut-parleur / Micro OK",
  "Charge filaire / sans fil OK",
  "Wi-Fi / Bluetooth OK",
  "Boutons physiques fonctionnels",
  "Étanchéité vérifiée",
];
