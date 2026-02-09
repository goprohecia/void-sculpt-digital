import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Facture, Devis } from "@/data/mockData";

const COMPANY = {
  name: "Impartial",
  address: "12 Rue de la Tech, 75001 Paris",
  siret: "123 456 789 00012",
  email: "contact@impartial.fr",
  tel: "01 23 45 67 89",
};

function addHeader(doc: jsPDF, title: string, reference: string) {
  // Company info
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 60);
  doc.text(COMPANY.name, 20, 25);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 120);
  doc.text(COMPANY.address, 20, 32);
  doc.text(`SIRET : ${COMPANY.siret}`, 20, 37);
  doc.text(`${COMPANY.email} | ${COMPANY.tel}`, 20, 42);

  // Document title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 60);
  doc.text(title, 140, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 100);
  doc.text(reference, 140, 32);

  // Separator
  doc.setDrawColor(200, 200, 220);
  doc.setLineWidth(0.5);
  doc.line(20, 48, 190, 48);
}

function addClientInfo(doc: jsPDF, clientNom: string, y: number) {
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 60);
  doc.text("Client", 140, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 80);
  doc.text(clientNom, 140, y + 6);
}

function addFooter(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 160);
  doc.text(
    `${COMPANY.name} — ${COMPANY.address} — SIRET ${COMPANY.siret}`,
    105,
    pageHeight - 10,
    { align: "center" }
  );
}

export function generateFacturePdf(facture: Facture) {
  const doc = new jsPDF();

  addHeader(doc, "FACTURE", facture.reference);
  addClientInfo(doc, facture.clientNom, 55);

  // Dates
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 100);
  doc.text(`Date d'émission : ${new Date(facture.dateEmission).toLocaleDateString("fr-FR")}`, 20, 55);
  doc.text(`Date d'échéance : ${new Date(facture.dateEcheance).toLocaleDateString("fr-FR")}`, 20, 61);

  const statutLabel = facture.statut === "payee" ? "Payée" : facture.statut === "en_retard" ? "En retard" : "En attente";
  doc.text(`Statut : ${statutLabel}`, 20, 67);

  if (facture.dossierId) {
    doc.text(`Dossier associé : ${facture.dossierId}`, 20, 73);
  }

  // Table
  autoTable(doc, {
    startY: 82,
    head: [["Description", "Montant HT", "TVA (20%)", "Montant TTC"]],
    body: [
      [
        `Prestation — ${facture.reference}`,
        `${(facture.montant / 1.2).toFixed(2)} €`,
        `${(facture.montant - facture.montant / 1.2).toFixed(2)} €`,
        `${facture.montant.toLocaleString()} €`,
      ],
    ],
    foot: [["", "", "Total TTC", `${facture.montant.toLocaleString()} €`]],
    headStyles: {
      fillColor: [30, 30, 60],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: { fontSize: 9, textColor: [50, 50, 70] },
    footStyles: {
      fillColor: [240, 240, 250],
      textColor: [30, 30, 60],
      fontSize: 10,
      fontStyle: "bold",
    },
    theme: "grid",
    styles: { cellPadding: 6 },
  });

  // Payment terms
  const finalY = (doc as any).lastAutoTable?.finalY || 130;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 120);
  doc.text("Conditions de paiement : 30 jours net.", 20, finalY + 12);
  doc.text("En cas de retard, des pénalités de 3 fois le taux d'intérêt légal seront appliquées.", 20, finalY + 17);

  addFooter(doc);
  doc.save(`${facture.reference}.pdf`);
}

export function generateDevisPdf(devisItem: Devis) {
  const doc = new jsPDF();

  addHeader(doc, "DEVIS", devisItem.reference);
  addClientInfo(doc, devisItem.clientNom, 55);

  // Dates
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 100);
  doc.text(`Date d'émission : ${new Date(devisItem.dateEmission).toLocaleDateString("fr-FR")}`, 20, 55);
  doc.text(`Date de validité : ${new Date(devisItem.dateValidite).toLocaleDateString("fr-FR")}`, 20, 61);

  const statutLabel =
    devisItem.statut === "accepte" ? "Accepté" :
    devisItem.statut === "refuse" ? "Refusé" :
    devisItem.statut === "expire" ? "Expiré" : "En attente";
  doc.text(`Statut : ${statutLabel}`, 20, 67);

  // Table
  autoTable(doc, {
    startY: 78,
    head: [["Description", "Montant HT", "TVA (20%)", "Montant TTC"]],
    body: [
      [
        devisItem.titre,
        `${(devisItem.montant / 1.2).toFixed(2)} €`,
        `${(devisItem.montant - devisItem.montant / 1.2).toFixed(2)} €`,
        `${devisItem.montant.toLocaleString()} €`,
      ],
    ],
    foot: [["", "", "Total TTC", `${devisItem.montant.toLocaleString()} €`]],
    headStyles: {
      fillColor: [30, 30, 60],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: { fontSize: 9, textColor: [50, 50, 70] },
    footStyles: {
      fillColor: [240, 240, 250],
      textColor: [30, 30, 60],
      fontSize: 10,
      fontStyle: "bold",
    },
    theme: "grid",
    styles: { cellPadding: 6 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 130;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 120);
  doc.text(`Ce devis est valable jusqu'au ${new Date(devisItem.dateValidite).toLocaleDateString("fr-FR")}.`, 20, finalY + 12);
  doc.text("Signature et mention « Bon pour accord » :", 20, finalY + 22);

  // Signature box
  doc.setDrawColor(180, 180, 200);
  doc.setLineWidth(0.3);
  doc.rect(20, finalY + 26, 80, 30);

  addFooter(doc);
  doc.save(`${devisItem.reference}.pdf`);
}
