
const COLORS = {
  primary: "#1e1e3c",
  accent: "#643cb4",
  urgent: "#dc3232",
  haute: "#e68c1e",
  moyenne: "#c8b428",
  basse: "#3c82c8",
  muted: "#64647a",
  absent: "#dc3232",
  partiel: "#c8aa1e",
  complet: "#28a050",
  critique: "#c83232",
  bg: "#0f0f1e",
  cardBg: "#1a1a30",
  text: "#e0e0f0",
  textMuted: "#a0a0b4",
};

export function generateAuditHtml() {
  const now = new Date().toLocaleDateString("fr-FR");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MBA — Rapport d'Audit Roadmap — ${now}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: ${COLORS.bg}; color: ${COLORS.text}; line-height: 1.6; }
  .container { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }

  /* Cover */
  .cover { padding: 80px 48px; background: linear-gradient(135deg, ${COLORS.bg}, ${COLORS.primary}); border-radius: 16px; margin-bottom: 48px; border: 1px solid #2a2a50; }
  .cover .tag { font-size: 12px; color: ${COLORS.textMuted}; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
  .cover h1 { font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .cover .sub { font-size: 20px; color: #b4a0ff; margin-bottom: 32px; }
  .cover .meta { font-size: 14px; color: ${COLORS.textMuted}; }

  /* Sections */
  .section { margin-bottom: 48px; }
  .section h2 { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 2px solid ${COLORS.accent}; }
  .section .desc { font-size: 14px; color: ${COLORS.textMuted}; margin-bottom: 20px; }

  /* Legend */
  .legend-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
  .legend-box { background: ${COLORS.cardBg}; border-radius: 12px; padding: 20px; border: 1px solid #2a2a50; }
  .legend-box h3 { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .legend-item { display: flex; align-items: center; gap: 10px; padding: 4px 0; font-size: 14px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 14px; }
  thead th { background: ${COLORS.accent}; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; font-size: 13px; }
  thead th:first-child { border-radius: 8px 0 0 0; }
  thead th:last-child { border-radius: 0 8px 0 0; }
  tbody tr { border-bottom: 1px solid #2a2a50; }
  tbody tr:nth-child(even) { background: rgba(100,60,180,0.05); }
  tbody tr:hover { background: rgba(100,60,180,0.1); }
  tbody td { padding: 10px 12px; vertical-align: top; }

  .status-badge { display: inline-block; padding: 2px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
  .status-absent { background: rgba(220,50,50,0.15); color: ${COLORS.absent}; }
  .status-partiel { background: rgba(200,170,30,0.15); color: ${COLORS.partiel}; }
  .status-complet { background: rgba(40,160,80,0.15); color: ${COLORS.complet}; }
  .status-critique { background: rgba(200,50,50,0.15); color: ${COLORS.critique}; }

  .prio-badge { display: inline-block; padding: 2px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
  .prio-urgent { background: rgba(220,50,50,0.15); color: ${COLORS.urgent}; }
  .prio-haute { background: rgba(230,140,30,0.15); color: ${COLORS.haute}; }
  .prio-moyenne { background: rgba(200,180,40,0.15); color: ${COLORS.moyenne}; }
  .prio-basse { background: rgba(60,130,200,0.15); color: ${COLORS.basse}; }

  /* Summary cards */
  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .summary-card { background: ${COLORS.cardBg}; border-radius: 12px; padding: 20px; border: 1px solid #2a2a50; text-align: center; }
  .summary-card .num { font-size: 32px; font-weight: 800; }
  .summary-card .label { font-size: 13px; color: ${COLORS.textMuted}; margin-top: 4px; }

  /* Action plan */
  .phase-row td:first-child { font-weight: 700; white-space: nowrap; }

  /* Footer */
  .footer { text-align: center; padding: 32px 0; font-size: 12px; color: ${COLORS.textMuted}; border-top: 1px solid #2a2a50; margin-top: 48px; }

  @media print {
    body { background: #fff; color: #1a1a1a; }
    .cover { background: #f5f5ff; border-color: #ddd; }
    .cover h1 { color: ${COLORS.primary}; }
    thead th { background: ${COLORS.primary}; }
    tbody tr:hover { background: transparent; }
    .legend-box, .summary-card { border-color: #ddd; background: #f9f9fc; }
  }
</style>
</head>
<body>
<div class="container">

  <!-- COVER -->
  <div class="cover">
    <div class="tag">Impartial Games — Document interne</div>
    <h1>MBA — Rapport d'Audit</h1>
    <div class="sub">Roadmap V1 / V2 / V3</div>
    <div class="meta">
      Généré le ${now}<br>
      Analyse complète de l'état d'implémentation de chaque module vs les spécifications de la roadmap.
    </div>
  </div>

  <!-- LÉGENDES -->
  <div class="legend-grid">
    <div class="legend-box">
      <h3>Légende des statuts</h3>
      <div class="legend-item"><div class="dot" style="background:${COLORS.complet}"></div> <strong>Complet</strong> — toutes les fonctionnalités présentes</div>
      <div class="legend-item"><div class="dot" style="background:${COLORS.partiel}"></div> <strong>Partiel</strong> — module existant, fonctionnalités manquantes</div>
      <div class="legend-item"><div class="dot" style="background:${COLORS.absent}"></div> <strong>Absent</strong> — module non implémenté</div>
      <div class="legend-item"><div class="dot" style="background:${COLORS.critique}"></div> <strong>Critique</strong> — problème de sécurité ou d'architecture</div>
    </div>
    <div class="legend-box">
      <h3>Légende des priorités</h3>
      <div class="legend-item"><div class="dot" style="background:${COLORS.urgent}"></div> <strong>URGENT</strong> — bloquerait tout le reste</div>
      <div class="legend-item"><div class="dot" style="background:${COLORS.haute}"></div> <strong>HAUTE</strong> — V1 core, avant V2</div>
      <div class="legend-item"><div class="dot" style="background:${COLORS.moyenne}"></div> <strong>MOYENNE</strong> — V2, dépend de V1</div>
      <div class="legend-item"><div class="dot" style="background:${COLORS.basse}"></div> <strong>BASSE</strong> — V3, pas avant prod V2</div>
    </div>
  </div>

  <!-- 1. FONDATIONS -->
  <div class="section">
    <h2>1. Fondations Architecturales</h2>
    <p class="desc">Vérification des prérequis structurels avant tout développement.</p>
    <table>
      <thead><tr><th>#</th><th>Fondation</th><th>Statut</th><th>Constat</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>Isolation multi-tenant (compte_id)</td><td><span class="status-badge status-absent">❌ Absent</span></td><td>Aucune table ne contient de compte_id. Toutes les données sont globales. Aucun filtrage par tenant.</td></tr>
        <tr><td>2</td><td>Many-to-many (client_projet, projet_employe)</td><td><span class="status-badge status-absent">❌ Absent</span></td><td>Les tables client_projet et projet_employe n'existent pas. Le lien dossier→employé est en one-to-one uniquement.</td></tr>
        <tr><td>3</td><td>Permissions granulaires (roles, permissions, role_permissions)</td><td><span class="status-badge status-critique">⚠ Minimal</span></td><td>Seule user_roles existe avec l'enum app_role (admin/employee/client). Pas de permissions booléennes par compte.</td></tr>
        <tr><td>4</td><td>Middleware permissions serveur</td><td><span class="status-badge status-critique">⚠ Partiel</span></td><td>Les Edge Functions vérifient le JWT. RLS utilise has_role() avec 3 rôles fixes. Pas de permissions granulaires.</td></tr>
        <tr><td>5</td><td>Intégration SendGrid/Brevo</td><td><span class="status-badge status-absent">❌ Absent</span></td><td>Emails via Resend. Pas de gestion RGPD/désinscription automatique, pas de tracking ouverture/clic.</td></tr>
      </tbody>
    </table>
  </div>

  <!-- 2. MODULES V1 -->
  <div class="section">
    <h2>2. Modules V1 — Lancement</h2>
    <table>
      <thead><tr><th>#</th><th>Module</th><th>Statut</th><th>Priorité</th><th>Éléments présents</th><th>Éléments manquants</th></tr></thead>
      <tbody>
        <tr><td>01</td><td>Module Analytique</td><td><span class="status-badge status-partiel">🟡 Partiel</span></td><td><span class="prio-badge prio-haute">🟠 Haute</span></td><td>Graphiques recharts, KPIs, export PDF/Excel, catégories de services</td><td>Sélecteur de période double (date début/fin). Métriques adaptées au métier. Recalcul serveur sur période.</td></tr>
        <tr><td>02</td><td>Module Emails</td><td><span class="status-badge status-partiel">🟡 Partiel</span></td><td><span class="prio-badge prio-urgent">🔴 Urgent</span></td><td>Envoi classique, templates avec variables, AI suggest, journal, CSV export</td><td>Pas de SendGrid/Brevo. Pas de pièces jointes. Pas de filtres de masse. Pas de désinscription RGPD. Pas de tracking.</td></tr>
        <tr><td>03</td><td>Module Messagerie</td><td><span class="status-badge status-partiel">🟡 Partiel</span></td><td><span class="prio-badge prio-haute">🟠 Haute</span></td><td>Conversations texte, onglets clients/salariés, création conversation</td><td>Pas d'upload médias. Pas d'annonces générales admin (pop-up). Pas de table annonces/annonce_lecture. Pas de suivi lectures.</td></tr>
        <tr><td>04</td><td>Clients &amp; Dossiers</td><td><span class="status-badge status-partiel">🟡 Partiel</span></td><td><span class="prio-badge prio-urgent">🔴 Urgent</span></td><td>Tables clients/dossiers, liaison client_id, fiche client, assignation employé (1-to-1), timeline/stepper</td><td>Pas de many-to-many client↔projet. Pas de many-to-many projet↔employé. Pas de vocabulaire métier dynamique. Pas d'archivage. Pas de création par employé.</td></tr>
        <tr><td>05</td><td>Paramètres &amp; White Label</td><td><span class="status-badge status-partiel">🟡 Partiel</span></td><td><span class="prio-badge prio-moyenne">🟡 Moyenne</span></td><td>CSS variables couleur principale, renommage espaces, badge offre, espaces personnalisés, upload logo</td><td>Pas de changement typographie (Google Fonts). Pas d'aperçu live complet. Offre non visible en permanence dans sidebar.</td></tr>
        <tr><td>06</td><td>Onboarding</td><td><span class="status-badge status-partiel">🟡 Partiel</span></td><td><span class="prio-badge prio-haute">🟠 Haute</span></td><td>23 profils métiers avec steppers/dashboards spécifiques, recommandations de plans</td><td>Pas de questionnaire 4 étapes. Pas de génération auto structure. Pas de table de mapping. Pas de re-lancement.</td></tr>
        <tr><td>07</td><td>Salariés &amp; Permissions</td><td><span class="status-badge status-partiel">🟡 Partiel</span></td><td><span class="prio-badge prio-urgent">🔴 Urgent</span></td><td>Fiche salarié (nom/email/poste/modules), invitation par email, gestion accès modules</td><td>Pas de rôles hiérarchiques. Pas de 11 permissions booléennes. Pas de middleware serveur. Pas d'audit log. Fiche non enrichie.</td></tr>
        <tr><td>08</td><td>Calendrier</td><td><span class="status-badge status-partiel">🟡 Partiel</span></td><td><span class="prio-badge prio-haute">🟠 Haute</span></td><td>Vue mois/semaine, événements admin (démo), disponibilités par pro</td><td>Pas de drag-and-drop. Pas de temps réel. Pas de signalement d'indisponibilité. Pas de filtre par employé/équipe. Données mockées.</td></tr>
      </tbody>
    </table>
  </div>

  <!-- 3. MODULES V2 -->
  <div class="section">
    <h2>3. Modules V2 — Scale</h2>
    <table>
      <thead><tr><th>#</th><th>Module</th><th>Statut</th><th>Priorité</th><th>Éléments manquants</th></tr></thead>
      <tbody>
        <tr><td>09</td><td>Emails masse V2</td><td><span class="status-badge status-absent">❌ Absent</span></td><td><span class="prio-badge prio-moyenne">🟡 Moyenne</span></td><td>Queue d'envoi (Redis/Bull). Programmation d'envoi. Filtres avancés combinables. Historique campagnes avec stats.</td></tr>
        <tr><td>10</td><td>Module RH</td><td><span class="status-badge status-absent">❌ Absent</span></td><td><span class="prio-badge prio-moyenne">🟡 Moyenne</span></td><td>Planning effectif. Gestion absences (workflow). Feuilles d'heures. Import/distribution fiches de paie PDF. Rôle RH.</td></tr>
        <tr><td>11</td><td>Demande module custom</td><td><span class="status-badge status-absent">❌ Absent</span></td><td><span class="prio-badge prio-moyenne">🟡 Moyenne</span></td><td>Formulaire demande Enterprise. Table demandes_modules. Onglet 'Mes demandes'. Interface super admin.</td></tr>
        <tr><td>12</td><td>Espaces multiples</td><td><span class="status-badge status-partiel">🟡 Partiel</span></td><td><span class="prio-badge prio-moyenne">🟡 Moyenne</span></td><td>Limite configurable par super admin (max 10). Lien avec rôles/permissions granulaires. Facturation sur-mesure.</td></tr>
      </tbody>
    </table>
  </div>

  <!-- 4. MODULES V3 -->
  <div class="section">
    <h2>4. Modules V3 — Enterprise</h2>
    <table>
      <thead><tr><th>#</th><th>Module</th><th>Statut</th><th>Priorité</th><th>Éléments manquants</th></tr></thead>
      <tbody>
        <tr><td>13</td><td>Intégration paie API</td><td><span class="status-badge status-absent">❌ Absent</span></td><td><span class="prio-badge prio-basse">🔵 Basse</span></td><td>Aucune intégration Payfit/Silae. OAuth. Sync auto fiches de paie. Fallback import manuel.</td></tr>
        <tr><td>14</td><td>Module Réunions</td><td><span class="status-badge status-absent">❌ Absent</span></td><td><span class="prio-badge prio-basse">🔵 Basse</span></td><td>Planification. Comptes-rendus. Suivi décisions avec rappels. Enterprise 500€+.</td></tr>
        <tr><td>15</td><td>Multi-entités</td><td><span class="status-badge status-absent">❌ Absent</span></td><td><span class="prio-badge prio-basse">🔵 Basse</span></td><td>Aucun compte_id. Architecture non préparée pour le multi-tenant. Dashboard global. Switch entités.</td></tr>
      </tbody>
    </table>
  </div>

  <!-- 5. RÉSUMÉ -->
  <div class="section">
    <h2>5. Résumé des priorités</h2>
    <div class="summary-grid">
      <div class="summary-card"><div class="num" style="color:${COLORS.urgent}">4</div><div class="label">🔴 URGENT</div></div>
      <div class="summary-card"><div class="num" style="color:${COLORS.haute}">4</div><div class="label">🟠 HAUTE</div></div>
      <div class="summary-card"><div class="num" style="color:${COLORS.moyenne}">5</div><div class="label">🟡 MOYENNE</div></div>
      <div class="summary-card"><div class="num" style="color:${COLORS.basse}">3</div><div class="label">🔵 BASSE</div></div>
    </div>
    <table>
      <thead><tr><th>Priorité</th><th>Nb</th><th>Détail</th></tr></thead>
      <tbody>
        <tr><td><span class="prio-badge prio-urgent">🔴 URGENT</span></td><td>4</td><td>compte_id · many-to-many BDD · permissions granulaires · emails SendGrid/Brevo</td></tr>
        <tr><td><span class="prio-badge prio-haute">🟠 HAUTE</span></td><td>4</td><td>analytique période · messagerie médias · onboarding 4 étapes · calendrier temps réel</td></tr>
        <tr><td><span class="prio-badge prio-moyenne">🟡 MOYENNE</span></td><td>5</td><td>white label typo · emails V2 queue · RH · modules custom · espaces limites</td></tr>
        <tr><td><span class="prio-badge prio-basse">🔵 BASSE</span></td><td>3</td><td>paie API · réunions · multi-entités</td></tr>
      </tbody>
    </table>
  </div>

  <!-- 6. PLAN D'ACTION -->
  <div class="section">
    <h2>6. Plan d'action séquencé</h2>
    <table>
      <thead><tr><th>Phase</th><th>Action</th><th>Dépendances</th></tr></thead>
      <tbody>
        <tr class="phase-row"><td>Phase 0</td><td>Ajouter compte_id à toutes les tables + filtrer toutes les requêtes</td><td>Aucune — fondation absolue</td></tr>
        <tr class="phase-row"><td>Phase 1a</td><td>Créer tables many-to-many (client_projet, projet_employe) + migrer liaisons</td><td>Phase 0</td></tr>
        <tr class="phase-row"><td>Phase 1b</td><td>Créer roles, permissions, role_permissions par compte + permissions booléennes</td><td>Phase 0</td></tr>
        <tr class="phase-row"><td>Phase 1c</td><td>Middleware serveur : vérifier permissions granulaires dans chaque Edge Function</td><td>Phase 1b</td></tr>
        <tr class="phase-row"><td>Phase 2</td><td>Intégrer SendGrid ou Brevo (remplacer Resend pour masse) + RGPD + tracking</td><td>Phase 0</td></tr>
        <tr class="phase-row"><td>Phase 3</td><td>Analytique : sélecteur de période + recalcul + métriques métier</td><td>Phase 0</td></tr>
        <tr class="phase-row"><td>Phase 4</td><td>Onboarding : questionnaire 4 étapes + génération auto structure</td><td>Phase 1b</td></tr>
        <tr class="phase-row"><td>Phase 5</td><td>Salariés : fiche enrichie + rôles hiérarchiques + audit log</td><td>Phase 1b</td></tr>
        <tr class="phase-row"><td>Phase 6</td><td>Messagerie : upload médias (bucket S3) + annonces admin + pop-up</td><td>Phase 0</td></tr>
        <tr class="phase-row"><td>Phase 7</td><td>Calendrier : temps réel (realtime) + drag-drop + indisponibilités</td><td>Phase 1c</td></tr>
        <tr class="phase-row"><td>Phase 8</td><td>Vocabulaire métier dynamique (metier_vocabulaire)</td><td>Phase 4</td></tr>
        <tr class="phase-row"><td>Phase 9+</td><td>V2 (emails planifiés, RH, modules custom, espaces avancés)</td><td>V1 stable</td></tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    MBA Audit Report — ${now} — IMPARTIAL GAMES — Confidentiel
  </div>

</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `MBA-Audit-Roadmap-${now.replace(/\//g, "-")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
