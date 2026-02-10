import jsPDF from "jspdf";
import type { CahierDesCharges } from "@/contexts/DemoDataContext";

const COMPANY = {
  name: "Impartial",
  address: "Delaware, États-Unis",
  email: "contact@impartialgames.com",
  website: "impartialgames.com",
};

function addHeader(doc: jsPDF, title: string) {
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 60);
  doc.text(COMPANY.name, 20, 25);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 120);
  doc.text(COMPANY.address, 20, 32);
  doc.text(COMPANY.email, 20, 37);
  doc.text(COMPANY.website, 20, 42);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 60);
  doc.text("CAHIER DES CHARGES", 140, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 100);
  const lines = doc.splitTextToSize(title, 55);
  doc.text(lines, 140, 32);

  doc.setDrawColor(200, 200, 220);
  doc.setLineWidth(0.5);
  doc.line(20, 48, 190, 48);
}

function addFooter(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 160);
  doc.text(
    `${COMPANY.name} — ${COMPANY.address} — ${COMPANY.email}`,
    105,
    pageHeight - 10,
    { align: "center" }
  );
}

function addSection(doc: jsPDF, title: string, content: string | string[] | undefined, y: number): number {
  if (!content || (Array.isArray(content) && content.length === 0)) return y;

  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = 170;

  // Check page break
  if (y > pageHeight - 40) {
    addFooter(doc);
    doc.addPage();
    y = 20;
  }

  // Section title
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 60);
  doc.text(title, margin, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 80);

  if (Array.isArray(content)) {
    content.forEach((item, i) => {
      if (y > pageHeight - 30) {
        addFooter(doc);
        doc.addPage();
        y = 20;
      }
      const lines = doc.splitTextToSize(`${i + 1}. ${item}`, maxWidth);
      doc.text(lines, margin, y);
      y += lines.length * 4.5;
    });
  } else {
    const lines = doc.splitTextToSize(content, maxWidth);
    for (const line of lines) {
      if (y > pageHeight - 30) {
        addFooter(doc);
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 4.5;
    }
  }

  return y + 4;
}

function parseCdcRemarques(raw: string) {
  const result = { remarques: "", securite: "", seo: "", maintenance: "", objectifsKpi: "", inspirations: "" };
  if (!raw) return result;
  const sectionMap: Record<string, keyof typeof result> = {
    "[SÉCURITÉ]": "securite", "[SEO / RÉFÉRENCEMENT]": "seo",
    "[MAINTENANCE / SUPPORT]": "maintenance", "[OBJECTIFS / KPI]": "objectifsKpi",
    "[INSPIRATIONS / RÉFÉRENCES]": "inspirations", "[REMARQUES GÉNÉRALES]": "remarques",
  };
  let hasStructured = false;
  for (const key of Object.keys(sectionMap)) { if (raw.includes(key)) { hasStructured = true; break; } }
  if (!hasStructured) { result.remarques = raw; return result; }
  const lines = raw.split("\n");
  let currentKey: keyof typeof result = "remarques";
  for (const line of lines) {
    const trimmed = line.trim();
    let matched = false;
    for (const [tag, key] of Object.entries(sectionMap)) { if (trimmed === tag) { currentKey = key; matched = true; break; } }
    if (!matched) result[currentKey] = result[currentKey] ? result[currentKey] + "\n" + line : line;
  }
  for (const key of Object.keys(result) as (keyof typeof result)[]) result[key] = result[key].trim();
  return result;
}

export function generateCdcPdf(cahier: CahierDesCharges, demandeTitre?: string) {
  const doc = new jsPDF();

  addHeader(doc, demandeTitre || "Sans titre");

  // Status + date
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 100);
  doc.text(`Statut : ${cahier.statut === "complet" ? "Complet" : "Brouillon"}`, 20, 55);
  doc.text(`Dernière MAJ : ${new Date(cahier.dateMiseAJour).toLocaleDateString("fr-FR")}`, 20, 60);

  let y = 70;
  y = addSection(doc, "Contexte du projet", cahier.contexte, y);
  y = addSection(doc, "Public cible", cahier.publicCible, y);
  y = addSection(doc, "Fonctionnalités attendues", cahier.fonctionnalites, y);
  y = addSection(doc, "Design et charte graphique", cahier.designNotes, y);
  y = addSection(doc, "Contraintes techniques", cahier.contraintesTechniques, y);
  y = addSection(doc, "Planning souhaité", cahier.planningSouhaite, y);
  y = addSection(doc, "Budget complémentaire", cahier.budgetComplementaire, y);
  // Parse extended sections from remarques
  const parsed = parseCdcRemarques(cahier.remarques);
  y = addSection(doc, "Sécurité et conformité", parsed.securite, y);
  y = addSection(doc, "SEO et référencement", parsed.seo, y);
  y = addSection(doc, "Maintenance et support", parsed.maintenance, y);
  y = addSection(doc, "Objectifs et KPI", parsed.objectifsKpi, y);
  y = addSection(doc, "Sites d'inspiration / Références", parsed.inspirations, y);
  y = addSection(doc, "Remarques générales", parsed.remarques, y);

  if (cahier.commentairesAdmin) {
    y = addSection(doc, "Commentaires de l'équipe", cahier.commentairesAdmin, y);
  }

  addFooter(doc);
  doc.save(`CDC-${(demandeTitre || "cahier").replace(/\s+/g, "-").substring(0, 40)}.pdf`);
}
