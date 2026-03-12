import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COLORS = {
  primary: [30, 30, 60] as [number, number, number],
  accent: [100, 60, 180] as [number, number, number],
  urgent: [220, 50, 50] as [number, number, number],
  haute: [230, 140, 30] as [number, number, number],
  moyenne: [200, 180, 40] as [number, number, number],
  basse: [60, 130, 200] as [number, number, number],
  muted: [100, 100, 120] as [number, number, number],
  absent: [220, 50, 50] as [number, number, number],
  partiel: [200, 170, 30] as [number, number, number],
  complet: [40, 160, 80] as [number, number, number],
  critique: [200, 50, 50] as [number, number, number],
};

export function generateAuditPdf() {
  const doc = new jsPDF();
  const now = new Date().toLocaleDateString("fr-FR");
  const pageW = doc.internal.pageSize.getWidth();

  // ─── COVER ───
  doc.setFillColor(20, 20, 50);
  doc.rect(0, 0, pageW, 297, "F");

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 180);
  doc.text("IMPARTIAL GAMES — Document interne", 20, 25);

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("MBA — Rapport d'Audit", 20, 60);

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 160, 255);
  doc.text("Roadmap V1 / V2 / V3", 20, 72);

  doc.setFontSize(11);
  doc.setTextColor(160, 160, 190);
  doc.text(`Généré le ${now}`, 20, 88);
  doc.text("Analyse complète de l'état d'implémentation", 20, 96);
  doc.text("de chaque module vs les spécifications de la roadmap.", 20, 103);

  // Legend block
  const ly = 130;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Légende des statuts", 20, ly);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const legends = [
    { icon: "✅", label: "Complet — toutes les fonctionnalités présentes", color: COLORS.complet },
    { icon: "🟡", label: "Partiel — module existant, fonctionnalités manquantes", color: COLORS.partiel },
    { icon: "❌", label: "Absent — module non implémenté", color: COLORS.absent },
    { icon: "⚠", label: "Critique — problème de sécurité ou d'architecture", color: COLORS.critique },
  ];
  legends.forEach((l, i) => {
    doc.setTextColor(...l.color);
    doc.text(`${l.icon}  ${l.label}`, 24, ly + 12 + i * 9);
  });

  const pl = ly + 60;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Légende des priorités", 20, pl);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const prios = [
    { icon: "🔴", label: "URGENT — bloquerait tout le reste si absent", color: COLORS.urgent },
    { icon: "🟠", label: "HAUTE — V1 core, à finir avant tout développement V2", color: COLORS.haute },
    { icon: "🟡", label: "MOYENNE — V2, dépend de la stabilité V1", color: COLORS.moyenne },
    { icon: "🔵", label: "BASSE — V3, pas avant prod V2", color: COLORS.basse },
  ];
  prios.forEach((p, i) => {
    doc.setTextColor(...p.color);
    doc.text(`${p.icon}  ${p.label}`, 24, pl + 12 + i * 9);
  });

  // ─── PAGE 2: FONDATIONS ARCHITECTURALES ───
  doc.addPage();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("1. Fondations Architecturales", 14, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text("Vérification des prérequis structurels avant tout développement.", 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [["#", "Fondation", "Statut", "Constat"]],
    body: [
      ["1", "Isolation multi-tenant (compte_id)", "❌ Absent", "Aucune table ne contient de compte_id. Toutes les données sont globales. Aucun filtrage par tenant."],
      ["2", "Many-to-many (client_projet, projet_employe)", "❌ Absent", "Les tables client_projet et projet_employe n'existent pas. Le lien dossier→employé est en one-to-one uniquement."],
      ["3", "Permissions granulaires (roles, permissions, role_permissions)", "⚠ Minimal", "Seule user_roles existe avec l'enum app_role (admin/employee/client). Pas de permissions booléennes par compte."],
      ["4", "Middleware permissions serveur", "⚠ Partiel", "Les Edge Functions vérifient le JWT. RLS utilise has_role() avec 3 rôles fixes. Pas de permissions granulaires."],
      ["5", "Intégration SendGrid/Brevo", "❌ Absent", "Emails via Resend. Pas de gestion RGPD/désinscription automatique, pas de tracking ouverture/clic."],
    ],
    theme: "grid",
    headStyles: { fillColor: COLORS.accent, fontSize: 8, font: "helvetica" },
    bodyStyles: { fontSize: 7.5, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 48 },
      2: { cellWidth: 22 },
      3: { cellWidth: "auto" },
    },
    styles: { overflow: "linebreak" },
  });

  // ─── PAGE 3: MODULES V1 ───
  doc.addPage();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("2. Modules V1 — Lancement", 14, 22);

  const v1Modules = [
    {
      id: "01", name: "Module Analytique", status: "🟡 Partiel", priority: "🟠 Haute",
      present: "Graphiques recharts, KPIs, export PDF/Excel, catégories de services",
      missing: "Sélecteur de période double (date début/fin). Métriques adaptées au métier. Recalcul serveur sur période.",
    },
    {
      id: "02", name: "Module Emails", status: "🟡 Partiel", priority: "🔴 Urgent",
      present: "Envoi classique, templates avec variables, AI suggest, journal, CSV export",
      missing: "Pas de SendGrid/Brevo. Pas de pièces jointes. Pas de filtres de masse. Pas de désinscription RGPD. Pas de tracking.",
    },
    {
      id: "03", name: "Module Messagerie", status: "🟡 Partiel", priority: "🟠 Haute",
      present: "Conversations texte, onglets clients/salariés, création conversation",
      missing: "Pas d'upload médias. Pas d'annonces générales admin (pop-up). Pas de table annonces/annonce_lecture. Pas de suivi lectures.",
    },
    {
      id: "04", name: "Clients & Dossiers", status: "🟡 Partiel", priority: "🔴 Urgent",
      present: "Tables clients/dossiers, liaison client_id, fiche client, assignation employé (1-to-1), timeline/stepper",
      missing: "Pas de many-to-many client↔projet. Pas de many-to-many projet↔employé. Pas de vocabulaire métier dynamique. Pas d'archivage. Pas de création par employé.",
    },
    {
      id: "05", name: "Paramètres & White Label", status: "🟡 Partiel", priority: "🟡 Moyenne",
      present: "CSS variables couleur principale, renommage espaces, badge offre, espaces personnalisés, upload logo",
      missing: "Pas de changement typographie (Google Fonts). Pas d'aperçu live complet. Offre non visible en permanence dans sidebar.",
    },
    {
      id: "06", name: "Onboarding", status: "🟡 Partiel", priority: "🟠 Haute",
      present: "23 profils métiers avec steppers/dashboards spécifiques, recommandations de plans",
      missing: "Pas de questionnaire 4 étapes. Pas de génération auto structure. Pas de table de mapping. Pas de re-lancement.",
    },
    {
      id: "07", name: "Salariés & Permissions", status: "🟡 Partiel", priority: "🔴 Urgent",
      present: "Fiche salarié (nom/email/poste/modules), invitation par email, gestion accès modules",
      missing: "Pas de rôles hiérarchiques. Pas de 11 permissions booléennes. Pas de middleware serveur. Pas d'audit log. Fiche non enrichie.",
    },
    {
      id: "08", name: "Calendrier", status: "🟡 Partiel", priority: "🟠 Haute",
      present: "Vue mois/semaine, événements admin (démo), disponibilités par pro",
      missing: "Pas de drag-and-drop. Pas de temps réel. Pas de signalement d'indisponibilité. Pas de filtre par employé/équipe. Données mockées.",
    },
  ];

  autoTable(doc, {
    startY: 30,
    head: [["#", "Module", "Statut", "Priorité", "Éléments présents", "Éléments manquants"]],
    body: v1Modules.map((m) => [m.id, m.name, m.status, m.priority, m.present, m.missing]),
    theme: "striped",
    headStyles: { fillColor: COLORS.accent, fontSize: 7, font: "helvetica" },
    bodyStyles: { fontSize: 6.5, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 28 },
      2: { cellWidth: 16 },
      3: { cellWidth: 16 },
      4: { cellWidth: 50 },
      5: { cellWidth: "auto" },
    },
    styles: { overflow: "linebreak" },
  });

  // ─── PAGE 4: MODULES V2 ───
  doc.addPage();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("3. Modules V2 — Scale", 14, 22);

  const v2Modules = [
    {
      id: "09", name: "Emails masse V2", status: "❌ Absent", priority: "🟡 Moyenne",
      missing: "Queue d'envoi (Redis/Bull). Programmation d'envoi. Filtres avancés combinables. Historique campagnes avec stats.",
    },
    {
      id: "10", name: "Module RH", status: "❌ Absent", priority: "🟡 Moyenne",
      missing: "Planning effectif. Gestion absences (workflow). Feuilles d'heures. Import/distribution fiches de paie PDF. Rôle RH.",
    },
    {
      id: "11", name: "Demande module custom", status: "❌ Absent", priority: "🟡 Moyenne",
      missing: "Formulaire demande Enterprise. Table demandes_modules. Onglet 'Mes demandes'. Interface super admin.",
    },
    {
      id: "12", name: "Espaces multiples", status: "🟡 Partiel", priority: "🟡 Moyenne",
      missing: "Limite configurable par super admin (max 10). Lien avec rôles/permissions granulaires. Facturation sur-mesure.",
    },
  ];

  autoTable(doc, {
    startY: 30,
    head: [["#", "Module", "Statut", "Priorité", "Éléments manquants"]],
    body: v2Modules.map((m) => [m.id, m.name, m.status, m.priority, m.missing]),
    theme: "striped",
    headStyles: { fillColor: [230, 140, 30], fontSize: 8, font: "helvetica" },
    bodyStyles: { fontSize: 7.5, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 35 },
      2: { cellWidth: 20 },
      3: { cellWidth: 22 },
      4: { cellWidth: "auto" },
    },
    styles: { overflow: "linebreak" },
  });

  // ─── V3 ───
  const afterV2 = (doc as any).lastAutoTable?.finalY || 100;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("4. Modules V3 — Enterprise", 14, afterV2 + 16);

  const v3Modules = [
    {
      id: "13", name: "Intégration paie API", status: "❌ Absent", priority: "🔵 Basse",
      missing: "Aucune intégration Payfit/Silae. OAuth. Sync auto fiches de paie. Fallback import manuel.",
    },
    {
      id: "14", name: "Module Réunions", status: "❌ Absent", priority: "🔵 Basse",
      missing: "Planification. Comptes-rendus. Suivi décisions avec rappels. Enterprise 500€+.",
    },
    {
      id: "15", name: "Multi-entités", status: "❌ Absent", priority: "🔵 Basse",
      missing: "Aucun compte_id. Architecture non préparée pour le multi-tenant. Dashboard global. Switch entités.",
    },
  ];

  autoTable(doc, {
    startY: afterV2 + 22,
    head: [["#", "Module", "Statut", "Priorité", "Éléments manquants"]],
    body: v3Modules.map((m) => [m.id, m.name, m.status, m.priority, m.missing]),
    theme: "striped",
    headStyles: { fillColor: [60, 130, 200], fontSize: 8, font: "helvetica" },
    bodyStyles: { fontSize: 7.5, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 35 },
      2: { cellWidth: 20 },
      3: { cellWidth: 22 },
      4: { cellWidth: "auto" },
    },
    styles: { overflow: "linebreak" },
  });

  // ─── PAGE 5: RÉSUMÉ + PLAN D'ACTION ───
  doc.addPage();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("5. Résumé des priorités", 14, 22);

  autoTable(doc, {
    startY: 30,
    head: [["Priorité", "Nombre", "Détail"]],
    body: [
      ["🔴 URGENT", "4", "compte_id · many-to-many BDD · permissions granulaires · emails SendGrid/Brevo"],
      ["🟠 HAUTE", "4", "analytique période · messagerie médias · onboarding 4 étapes · calendrier temps réel"],
      ["🟡 MOYENNE", "5", "white label typo · emails V2 queue · RH · modules custom · espaces limites"],
      ["🔵 BASSE", "3", "paie API · réunions · multi-entités"],
    ],
    theme: "grid",
    headStyles: { fillColor: COLORS.accent, fontSize: 9 },
    bodyStyles: { fontSize: 8.5, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 18 },
      2: { cellWidth: "auto" },
    },
  });

  const afterSummary = (doc as any).lastAutoTable?.finalY || 80;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("6. Plan d'action séquencé", 14, afterSummary + 14);

  autoTable(doc, {
    startY: afterSummary + 20,
    head: [["Phase", "Action", "Dépendances"]],
    body: [
      ["Phase 0", "Ajouter compte_id à toutes les tables + filtrer toutes les requêtes", "Aucune — fondation absolue"],
      ["Phase 1a", "Créer tables many-to-many (client_projet, projet_employe) + migrer liaisons", "Phase 0"],
      ["Phase 1b", "Créer roles, permissions, role_permissions par compte + permissions booléennes", "Phase 0"],
      ["Phase 1c", "Middleware serveur : vérifier permissions granulaires dans chaque Edge Function", "Phase 1b"],
      ["Phase 2", "Intégrer SendGrid ou Brevo (remplacer Resend pour masse) + RGPD + tracking", "Phase 0"],
      ["Phase 3", "Analytique : sélecteur de période + recalcul + métriques métier", "Phase 0"],
      ["Phase 4", "Onboarding : questionnaire 4 étapes + génération auto structure", "Phase 1b"],
      ["Phase 5", "Salariés : fiche enrichie + rôles hiérarchiques + audit log", "Phase 1b"],
      ["Phase 6", "Messagerie : upload médias (bucket S3) + annonces admin + pop-up", "Phase 0"],
      ["Phase 7", "Calendrier : temps réel (realtime) + drag-drop + indisponibilités", "Phase 1c"],
      ["Phase 8", "Vocabulaire métier dynamique (metier_vocabulaire)", "Phase 4"],
      ["Phase 9+", "V2 (emails planifiés, RH, modules custom, espaces avancés)", "V1 stable"],
    ],
    theme: "striped",
    headStyles: { fillColor: COLORS.accent, fontSize: 8 },
    bodyStyles: { fontSize: 7.5, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 90 },
      2: { cellWidth: "auto" },
    },
    styles: { overflow: "linebreak" },
  });

  // ─── Footer on every page ───
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 170);
    doc.text(`MBA Audit Report — ${now} — Page ${i}/${totalPages}`, pageW / 2, 290, { align: "center" });
    doc.text("IMPARTIAL GAMES — Confidentiel", pageW / 2, 294, { align: "center" });
  }

  doc.save(`MBA-Audit-Roadmap-${now.replace(/\//g, "-")}.pdf`);
}
