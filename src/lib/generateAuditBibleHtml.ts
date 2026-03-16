
const C = {
  bg: "#0f0f1e",
  card: "#1a1a30",
  border: "#2a2a50",
  accent: "#643cb4",
  text: "#e0e0f0",
  muted: "#a0a0b4",
  ok: "#28a050",
  partiel: "#c8aa1e",
  absent: "#dc3232",
  critique: "#c83232",
  urgent: "#dc3232",
  haute: "#e68c1e",
  moyenne: "#c8b428",
  basse: "#3c82c8",
};

export function generateAuditBibleHtml() {
  const now = new Date().toLocaleDateString("fr-FR");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MBA — Audit Complet Bible Produit v3 — ${now}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:${C.bg};color:${C.text};line-height:1.6}
.c{max-width:1200px;margin:0 auto;padding:40px 24px}
.cover{padding:80px 48px;background:linear-gradient(135deg,${C.bg},${C.accent}22);border-radius:16px;margin-bottom:48px;border:1px solid ${C.border}}
.cover .tag{font-size:12px;color:${C.muted};letter-spacing:2px;text-transform:uppercase;margin-bottom:24px}
.cover h1{font-size:36px;font-weight:800;color:#fff;margin-bottom:8px}
.cover .sub{font-size:20px;color:#b4a0ff;margin-bottom:32px}
.cover .meta{font-size:14px;color:${C.muted}}
.toc{background:${C.card};border-radius:12px;padding:24px 32px;border:1px solid ${C.border};margin-bottom:48px}
.toc h2{font-size:18px;color:#fff;margin-bottom:16px;border:none}
.toc ol{padding-left:20px}
.toc li{padding:3px 0;font-size:14px}
.toc a{color:#b4a0ff;text-decoration:none}
.toc a:hover{text-decoration:underline}
.s{margin-bottom:48px}
.s h2{font-size:22px;font-weight:700;color:#fff;margin-bottom:8px;padding-bottom:8px;border-bottom:2px solid ${C.accent}}
.s h3{font-size:16px;font-weight:600;color:#ccc;margin:20px 0 10px}
.s .desc{font-size:14px;color:${C.muted};margin-bottom:20px}
table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px}
thead th{background:${C.accent};color:#fff;padding:8px 10px;text-align:left;font-weight:600;font-size:12px}
thead th:first-child{border-radius:8px 0 0 0}
thead th:last-child{border-radius:0 8px 0 0}
tbody tr{border-bottom:1px solid ${C.border}}
tbody tr:nth-child(even){background:rgba(100,60,180,0.04)}
tbody tr:hover{background:rgba(100,60,180,0.08)}
tbody td{padding:8px 10px;vertical-align:top}
.b{display:inline-block;padding:2px 8px;border-radius:5px;font-size:11px;font-weight:600;white-space:nowrap}
.b-ok{background:rgba(40,160,80,0.15);color:${C.ok}}
.b-p{background:rgba(200,170,30,0.15);color:${C.partiel}}
.b-a{background:rgba(220,50,50,0.15);color:${C.absent}}
.b-c{background:rgba(200,50,50,0.15);color:${C.critique}}
.b-u{background:rgba(220,50,50,0.15);color:${C.urgent}}
.b-h{background:rgba(230,140,30,0.15);color:${C.haute}}
.b-m{background:rgba(200,180,40,0.15);color:${C.moyenne}}
.b-b{background:rgba(60,130,200,0.15);color:${C.basse}}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.sc{background:${C.card};border-radius:12px;padding:20px;border:1px solid ${C.border};text-align:center}
.sc .n{font-size:32px;font-weight:800}
.sc .l{font-size:12px;color:${C.muted};margin-top:4px}
.code{background:${C.card};border:1px solid ${C.border};border-radius:8px;padding:16px;font-family:'Fira Code','Consolas',monospace;font-size:12px;overflow-x:auto;margin:8px 0 16px;color:${C.muted};white-space:pre-wrap}
.lg{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px}
.lb{background:${C.card};border-radius:12px;padding:20px;border:1px solid ${C.border}}
.lb h3{font-size:13px;font-weight:600;color:#fff;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px}
.li{display:flex;align-items:center;gap:10px;padding:4px 0;font-size:13px}
.dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.fix{background:rgba(220,50,50,0.08);border-left:3px solid ${C.urgent};padding:12px 16px;border-radius:0 8px 8px 0;margin:8px 0 16px;font-size:13px}
.fix strong{color:${C.urgent}}
.footer{text-align:center;padding:32px 0;font-size:12px;color:${C.muted};border-top:1px solid ${C.border};margin-top:48px}
@media print{
  body{background:#fff;color:#1a1a1a}
  .cover{background:#f5f5ff;border-color:#ddd}
  .cover h1{color:#1e1e3c}
  thead th{background:#1e1e3c}
  tbody tr:hover{background:transparent}
  .lb,.sc,.toc{border-color:#ddd;background:#f9f9fc}
}
</style>
</head>
<body>
<div class="c">

<!-- COVER -->
<div class="cover">
  <div class="tag">Impartial Games — Document interne</div>
  <h1>MBA — Audit Complet Bible v3</h1>
  <div class="sub">Comparaison exhaustive : Code existant vs Bible Produit v3</div>
  <div class="meta">
    Généré le ${now}<br>
    20 sections · 36+ tables · 16 Edge Functions · 22 modules · 24 secteurs · 3 espaces<br>
    Analyse systématique de chaque spécification de la Bible Produit v3 contre l'implémentation actuelle.
  </div>
</div>

<!-- LÉGENDES -->
<div class="lg">
  <div class="lb">
    <h3>Légende des statuts</h3>
    <div class="li"><div class="dot" style="background:${C.ok}"></div><strong>OK</strong> — conforme à la Bible</div>
    <div class="li"><div class="dot" style="background:${C.partiel}"></div><strong>Partiel</strong> — existe mais incomplet</div>
    <div class="li"><div class="dot" style="background:${C.absent}"></div><strong>Absent</strong> — à développer</div>
    <div class="li"><div class="dot" style="background:${C.critique}"></div><strong>Non conforme</strong> — nécessite refonte</div>
  </div>
  <div class="lb">
    <h3>Légende des priorités</h3>
    <div class="li"><div class="dot" style="background:${C.urgent}"></div><strong>CRITIQUE</strong> — bloquant pour la Bible</div>
    <div class="li"><div class="dot" style="background:${C.haute}"></div><strong>IMPORTANT</strong> — écart significatif</div>
    <div class="li"><div class="dot" style="background:${C.moyenne}"></div><strong>MOYEN</strong> — amélioration requise</div>
    <div class="li"><div class="dot" style="background:${C.basse}"></div><strong>MINEUR</strong> — ajustement fin</div>
  </div>
</div>

<!-- TABLE DES MATIÈRES -->
<div class="toc">
  <h2>📋 Table des matières</h2>
  <ol>
    <li><a href="#s1">Architecture globale</a></li>
    <li><a href="#s2">Les trois offres (Starter / Business / Enterprise)</a></li>
    <li><a href="#s3">Onboarding — Tunnel d'inscription</a></li>
    <li><a href="#s4">Secteurs &amp; Vocabulaire métier</a></li>
    <li><a href="#s5">Catalogue des modules (22 existants vs 28 Bible)</a></li>
    <li><a href="#s6">Fiche Dossier — 8 onglets obligatoires</a></li>
    <li><a href="#s7">Timeline par secteur</a></li>
    <li><a href="#s8">Modules pré-sélectionnés par secteur</a></li>
    <li><a href="#s9">Espaces Admin / Employé / Client</a></li>
    <li><a href="#s10">Authentification &amp; Rôles</a></li>
    <li><a href="#s11">Permissions granulaires (F-03)</a></li>
    <li><a href="#s12">Multi-tenant (compte_id)</a></li>
    <li><a href="#s13">Emails &amp; Campagnes</a></li>
    <li><a href="#s14">Données de démonstration</a></li>
    <li><a href="#s15">Comportements UI obligatoires</a></li>
    <li><a href="#s16">Espaces personnalisés</a></li>
    <li><a href="#s17">White Label</a></li>
    <li><a href="#s18">Edge Functions (16 déployées)</a></li>
    <li><a href="#s19">Tables Supabase (36+ tables)</a></li>
    <li><a href="#s20">Récapitulatif des priorités</a></li>
  </ol>
</div>

<!-- ====== 1. ARCHITECTURE ====== -->
<div class="s" id="s1">
  <h2>1. Architecture Globale</h2>
  <p class="desc">Structure du projet, providers, backend.</p>
  <div class="code">src/
├── App.tsx                          # QueryClient + 5 Providers
├── components/                      # 38 admin + 22 secteurs + ui
│   ├── admin/                       # AdminSidebar, AdminLayout, etc.
│   ├── onboarding/OnboardingWizard.tsx
│   ├── client/                      # SwapWarningScreen, ModuleSwapWizard
│   └── ui/                          # shadcn/ui
├── contexts/
│   ├── DemoAuthContext.tsx           # 4 comptes mock
│   ├── DemoDataContext.tsx           # CRUD en mémoire
│   └── DemoPlanContext.tsx           # Plans, secteurs, prix, overrides
├── data/
│   ├── sectorModules.ts             # 544 lignes — 24 secteurs
│   ├── sectorTimelines.ts           # 430 lignes — 25 secteurs
│   └── mock*.ts                     # 25 fichiers données démo
├── hooks/                           # 43 hooks
├── pages/
│   ├── admin/    (28 pages)
│   ├── client/   (13 pages)
│   ├── employee/ (13 pages)
│   └── superadmin/ (7 pages)
└── integrations/supabase/           # Client + types auto</div>
  <table>
    <thead><tr><th>Composant</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Tronc commun unique (pas de code par métier)</td><td><span class="b b-ok">✅ OK</span></td><td>Architecture commune, seuls les labels changent via sectorModules.ts</td></tr>
      <tr><td>Providers : DemoAuth → DemoData → DemoPlan → WhiteLabel</td><td><span class="b b-ok">✅ OK</span></td><td>Chaîne de providers conforme dans App.tsx</td></tr>
      <tr><td>Backend : 36+ tables, 16 Edge Functions, RLS</td><td><span class="b b-ok">✅ OK</span></td><td>Lovable Cloud avec isolation multi-tenant</td></tr>
      <tr><td>Storage : 4 buckets (email, cdc, attachments, messagerie)</td><td><span class="b b-ok">✅ OK</span></td><td>Buckets configurés et fonctionnels</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 2. OFFRES ====== -->
<div class="s" id="s2">
  <h2>2. Les Trois Offres</h2>
  <p class="desc">Starter 150€ / Business 250€ / Enterprise 500€ — Socle fixe hors quota.</p>

  <h3>Code existant</h3>
  <div class="code">// DemoPlanContext.tsx
DEFAULT_PLAN_PRICES = { starter: 150, business: 250, enterprise: 500 }
DEFAULT_PLAN_MODULES = {
  starter: ["clients", "dossiers", "facturation"],                              // 3
  business: ["clients", "dossiers", "facturation", "messagerie", "relances", "support"], // 6
  enterprise: "all"
}

// use-subscription.ts (DUPLICATION !)
PLAN_LIMITS = { starter: 3, business: 6, enterprise: null }

// AdminModulesSection.tsx
ALWAYS_INCLUDED = ["overview", "parametres", "analyse"]  // Hors quota</div>

  <table>
    <thead><tr><th>Point Bible</th><th>Statut</th><th>Fichier(s)</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Prix Starter/Business/Enterprise</td><td><span class="b b-ok">✅ OK</span></td><td>DemoPlanContext.tsx</td><td>150€ / 250€ / 500€ conformes</td></tr>
      <tr><td>Socle fixe = Clients &amp; Dossiers + Analyse (hors quota)</td><td><span class="b b-c">❌ Non conforme</span></td><td>DemoPlanContext.tsx, AdminModulesSection.tsx</td><td><code>analyse</code> est hors quota mais <code>clients</code> et <code>dossiers</code> sont comptés dans le quota Starter/Business</td></tr>
      <tr><td>Starter = socle + 3 modules au choix</td><td><span class="b b-c">❌ Non conforme</span></td><td>DemoPlanContext.tsx</td><td>Les 3 modules incluent clients/dossiers au lieu de 3 modules additionnels</td></tr>
      <tr><td>Business = socle + 6 modules au choix</td><td><span class="b b-c">❌ Non conforme</span></td><td>DemoPlanContext.tsx</td><td>Même problème — clients/dossiers comptés dans le quota</td></tr>
      <tr><td>Enterprise = tous les modules</td><td><span class="b b-ok">✅ OK</span></td><td>DemoPlanContext.tsx</td><td>Valeur <code>"all"</code></td></tr>
      <tr><td>Module fusionné « Clients &amp; Dossiers »</td><td><span class="b b-a">❌ Absent</span></td><td>ALL_MODULE_KEYS</td><td><code>clients</code> et <code>dossiers</code> sont 2 modules séparés partout</td></tr>
      <tr><td>Modules verrouillés grisés + badge + modal upsell</td><td><span class="b b-p">🟡 Partiel</span></td><td>AdminModulesSection.tsx, AdminSidebar.tsx</td><td>Upsell existe dans les modules, mais sidebar ne grise pas les verrouillés</td></tr>
      <tr><td>Duplication PLAN_MODULES</td><td><span class="b b-c">🐛 Bug</span></td><td>DemoPlanContext + use-subscription.ts</td><td>Source de vérité incohérente — PLAN_MODULES défini 2 fois</td></tr>
    </tbody>
  </table>
  <div class="fix"><strong>À corriger :</strong> (1) Mettre clients/dossiers dans ALWAYS_INCLUDED. (2) Starter = 3 modules additionnels. (3) Supprimer duplication use-subscription.ts. (4) Griser sidebar.</div>
</div>

<!-- ====== 3. ONBOARDING ====== -->
<div class="s" id="s3">
  <h2>3. Onboarding — Tunnel d'inscription</h2>
  <p class="desc">Bible : 4 étapes Formule → Secteur (catégories) → Modules → Compte.</p>

  <h3>Wizard actuel (OnboardingWizard.tsx — 330 lignes)</h3>
  <div class="code">Étape 0 : Choix du secteur (grille plate, 24 secteurs, sans catégories)
Étape 1 : Taille de l'équipe (Solo / Petite / Moyenne / Structure)
Étape 2 : Sélection des rôles employés (checkboxes)
Étape 3 : Récapitulatif → bouton « Valider et démarrer »

→ Appel Edge Function generate-account-structure</div>

  <table>
    <thead><tr><th>Point Bible</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Étape 1 = Choix formule (Starter/Business/Enterprise)</td><td><span class="b b-a">❌ Absent</span></td><td>Aucune sélection de plan dans l'onboarding</td></tr>
      <tr><td>Étape 2 = Secteur par catégorie (7 catégories avec headers)</td><td><span class="b b-c">❌ Non conforme</span></td><td>Grille plate sans catégories (Réparation, Accompagnement, Commerce, etc.)</td></tr>
      <tr><td>7 catégories : Réparation &amp; Technique, Accompagnement, Commerce, Création, Services, Éducation, Juridique</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de regroupement dans l'UI</td></tr>
      <tr><td>Étape 3 = Sélection modules (socle fixe + quota selon plan)</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de sélection de modules dans l'onboarding</td></tr>
      <tr><td>Modules pré-cochés par secteur (DEFAULT_SECTOR_RECOMMENDATIONS)</td><td><span class="b b-p">🟡 Partiel</span></td><td>Existe dans DemoPlanContext mais pas utilisé dans le wizard</td></tr>
      <tr><td>Étape 4 = Création compte (nom, prénom, email, mdp, entreprise)</td><td><span class="b b-a">❌ Absent</span></td><td>L'onboarding est post-connexion (page /signup séparée)</td></tr>
      <tr><td>Secteurs manquants : centre-islamique, association-sportive, salle-de-sport</td><td><span class="b b-a">❌ Absent</span></td><td>SECTORS a 24 entrées, il en manque 2-3</td></tr>
    </tbody>
  </table>
  <div class="fix"><strong>À refaire entièrement :</strong> Refondre OnboardingWizard.tsx en 4 étapes Bible. Ajouter les catégories. Intégrer sélection modules. Fusionner signup.</div>
</div>

<!-- ====== 4. SECTEURS & VOCABULAIRE ====== -->
<div class="s" id="s4">
  <h2>4. Secteurs &amp; Vocabulaire Métier</h2>
  <p class="desc">24 secteurs existants, 2-3 manquants. Labels employé/client par secteur.</p>

  <h3>Secteurs existants (24)</h3>
  <div class="code">auto-ecole, conciergerie, btp, boutique, cabinets, coach-sportif, coiffure,
community-manager, consultant, designer, developpeur, dj-animateur,
evenementiel, formateur, garages, immobilier, mariage, nettoyage,
photographe, reparateur, traiteur, cabinet-recrutement, cabinet-avocats,
expert-comptable</div>

  <h3>Secteurs manquants</h3>
  <table>
    <thead><tr><th>Secteur Bible</th><th>Clé suggérée</th><th>Catégorie</th><th>Statut</th></tr></thead>
    <tbody>
      <tr><td>Centre islamique</td><td>centre-islamique</td><td>Éducation &amp; Formation</td><td><span class="b b-a">❌ Absent</span></td></tr>
      <tr><td>Association sportive</td><td>association-sportive</td><td>Services à la personne</td><td><span class="b b-a">❌ Absent</span></td></tr>
      <tr><td>Salle de sport / Coach</td><td>salle-de-sport</td><td>Services à la personne</td><td><span class="b b-p">🟡 Partiel</span></td></tr>
    </tbody>
  </table>

  <h3>Labels Employé / Client par secteur (SECTOR_ROLE_LABELS)</h3>
  <p class="desc">Fichier : src/data/sectorModules.ts (lignes 519-544) — 20 secteurs mappés sur 24</p>
  <table>
    <thead><tr><th>Secteur</th><th>Admin</th><th>Employé</th><th>Client</th><th>Statut</th></tr></thead>
    <tbody>
      <tr><td>garages</td><td>Réceptionniste</td><td>Mécanicien</td><td>Client</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>btp</td><td>Dirigeant</td><td>Ouvrier / Technicien</td><td>Client</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>coiffure</td><td>Gérant</td><td>Coiffeur / Praticien</td><td>Client</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>auto-ecole</td><td>Directeur</td><td>Moniteur</td><td>Élève</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>conciergerie</td><td>Conciergerie</td><td>Agent d'entretien</td><td>Propriétaire</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>mariage</td><td>Admin Boutique</td><td>Conseillère / Retoucheuse</td><td>Mariée</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>coach-sportif</td><td>Gérant</td><td>Coach</td><td>Membre</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>centre-islamique</td><td>—</td><td>—</td><td>—</td><td><span class="b b-a">❌ Absent</span></td></tr>
      <tr><td>association-sportive</td><td>—</td><td>—</td><td>—</td><td><span class="b b-a">❌ Absent</span></td></tr>
    </tbody>
  </table>

  <h3>Vocabulaire dossier (use-metier-vocabulaire.ts)</h3>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Label « dossier » par secteur (Véhicule, Mandat, Chantier, etc.)</td><td><span class="b b-ok">✅ OK</span></td><td>STATIC_MAP avec 24 secteurs dans use-metier-vocabulaire.ts</td></tr>
      <tr><td>Labels modules par secteur (28 modules × 24 secteurs)</td><td><span class="b b-ok">✅ OK</span></td><td>sectorModules.ts — 544 lignes de configuration</td></tr>
      <tr><td>Table metier_vocabulaire en DB pour overrides custom</td><td><span class="b b-ok">✅ OK</span></td><td>Table existe + requête Supabase</td></tr>
      <tr><td>Utilisation systématique des labels dans l'UI</td><td><span class="b b-p">🟡 Partiel</span></td><td>Pas tous les composants utilisent les labels métier</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 5. MODULES ====== -->
<div class="s" id="s5">
  <h2>5. Catalogue des Modules</h2>
  <p class="desc">22 modules existants dans ALL_MODULE_KEYS vs 28 dans la Bible.</p>

  <h3>Modules existants (22)</h3>
  <div class="code">overview, clients, employees, dossiers, pipeline, facturation, relances,
stock, messagerie, emails, rendez-vous, agenda, taches, support, notes,
analyse, rapports, documents, temps, automatisations, ia, parametres</div>

  <h3>Comparaison Bible</h3>
  <table>
    <thead><tr><th>Module Bible</th><th>Statut code</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Overview / Dashboard</td><td><span class="b b-ok">✅ OK</span></td><td>AdminDashboard.tsx</td></tr>
      <tr><td>Clients</td><td><span class="b b-ok">✅ OK</span></td><td>AdminClients.tsx — CRUD complet</td></tr>
      <tr><td>Employés / Salariés</td><td><span class="b b-ok">✅ OK</span></td><td>AdminEmployees.tsx — invitation, accès modules</td></tr>
      <tr><td>Dossiers</td><td><span class="b b-ok">✅ OK</span></td><td>AdminDossiers + AdminDossierDetail</td></tr>
      <tr><td>Pipeline CRM</td><td><span class="b b-ok">✅ OK</span></td><td>AdminPipeline.tsx — Kanban</td></tr>
      <tr><td>Facturation</td><td><span class="b b-ok">✅ OK</span></td><td>AdminBilling.tsx — factures + devis</td></tr>
      <tr><td>Relances</td><td><span class="b b-ok">✅ OK</span></td><td>AdminReminders.tsx</td></tr>
      <tr><td>Stock / Produits</td><td><span class="b b-ok">✅ OK</span></td><td>AdminStock.tsx — CRUD + mouvements</td></tr>
      <tr><td>Messagerie</td><td><span class="b b-ok">✅ OK</span></td><td>AdminMessaging.tsx — conversations temps réel</td></tr>
      <tr><td>Emails (V1 + V2)</td><td><span class="b b-ok">✅ OK</span></td><td>AdminEmails.tsx — composer, planifier, historique, filtres V2</td></tr>
      <tr><td>Rendez-vous</td><td><span class="b b-ok">✅ OK</span></td><td>AdminRendezVous.tsx — Calendly intégré</td></tr>
      <tr><td>Agenda / Calendrier</td><td><span class="b b-ok">✅ OK</span></td><td>AdminAgenda.tsx — vue mois/semaine</td></tr>
      <tr><td>Tâches</td><td><span class="b b-ok">✅ OK</span></td><td>AdminTaches.tsx</td></tr>
      <tr><td>Support / Tickets</td><td><span class="b b-ok">✅ OK</span></td><td>AdminSupport.tsx</td></tr>
      <tr><td>Notes</td><td><span class="b b-ok">✅ OK</span></td><td>AdminNotes.tsx</td></tr>
      <tr><td>Analyse / Analytics</td><td><span class="b b-ok">✅ OK</span></td><td>AdminAnalytics.tsx — recharts, KPIs, export</td></tr>
      <tr><td>Rapports</td><td><span class="b b-ok">✅ OK</span></td><td>AdminRapports.tsx</td></tr>
      <tr><td>Documents</td><td><span class="b b-ok">✅ OK</span></td><td>AdminDocuments.tsx</td></tr>
      <tr><td>Temps / Time Tracking</td><td><span class="b b-ok">✅ OK</span></td><td>AdminTemps.tsx</td></tr>
      <tr><td>Automatisations</td><td><span class="b b-ok">✅ OK</span></td><td>AdminAutomatisations.tsx</td></tr>
      <tr><td>Intelligence IA</td><td><span class="b b-ok">✅ OK</span></td><td>AdminIA.tsx — multi-modèles</td></tr>
      <tr><td>Paramètres</td><td><span class="b b-ok">✅ OK</span></td><td>AdminSettings.tsx — 8 onglets</td></tr>
      <tr><td>Facturation jalons</td><td><span class="b b-p">🟡 Partiel</span></td><td>Label existe dans overrides dev mais pas de logique spécifique</td></tr>
      <tr><td>Messagerie groupée</td><td><span class="b b-a">❌ Absent</span></td><td>Messagerie existe mais pas le mode groupé (employé → multiples)</td></tr>
      <tr><td>Signature électronique</td><td><span class="b b-p">🟡 Partiel</span></td><td>SignaturePad.tsx existe mais pas un module complet</td></tr>
      <tr><td>Formulaires</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de module dédié</td></tr>
      <tr><td>Avis client auto</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de système d'avis automatiques</td></tr>
      <tr><td>Abonnement récurrent</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de gestion d'abonnements clients</td></tr>
      <tr><td>Livrables</td><td><span class="b b-p">🟡 Partiel</span></td><td>Label existe dans overrides, pas de page dédiée</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 6. FICHE DOSSIER ====== -->
<div class="s" id="s6">
  <h2>6. Fiche Dossier — 8 Onglets Obligatoires</h2>
  <p class="desc">AdminDossierDetail.tsx (607 lignes) — scroll vertical, pas d'onglets.</p>

  <h3>Sections actuellement présentes</h3>
  <div class="code">1. En-tête : Référence, type, client, statut (select), annulation, résumé IA
2. Info cards : Montant, date création, échéance, client (grille 4 col)
3. Équipe assignée : Avatar, rôle (Responsable/Renfort), étoile, retirer
4. DossierTeamPanel : N-to-N (table dossier_employe)
5. Progression : Stepper horizontal 8 étapes codées en dur
6. DossierTimeline : Timeline personnalisable avec templates
7. Cahier des charges : CahierDesChargesView (si demande liée)
8. Preview Link : URL + historique visites
9. Devis associés : Liste devis liés
10. Factures associées : Liste factures liées</div>

  <table>
    <thead><tr><th>Onglet Bible</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Résumé</td><td><span class="b b-p">🟡 Partiel</span></td><td>Infos et progression existent mais pas dans un onglet</td></tr>
      <tr><td>RDV</td><td><span class="b b-a">❌ Absent</span></td><td>Pas d'onglet RDV dans la fiche dossier</td></tr>
      <tr><td>Paiements</td><td><span class="b b-p">🟡 Partiel</span></td><td>Factures/devis listés mais pas dans un onglet dédié</td></tr>
      <tr><td>Documents</td><td><span class="b b-a">❌ Absent</span></td><td>Pas d'onglet documents</td></tr>
      <tr><td>Photos</td><td><span class="b b-a">❌ Absent</span></td><td>Pas d'onglet photos</td></tr>
      <tr><td>Mesures</td><td><span class="b b-a">❌ Absent</span></td><td>Pas d'onglet mesures (mensurations, dimensions)</td></tr>
      <tr><td>Messages</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de messagerie intégrée dans la fiche</td></tr>
      <tr><td>Notes</td><td><span class="b b-a">❌ Absent</span></td><td>Pas d'onglet notes</td></tr>
    </tbody>
  </table>
  <div class="fix"><strong>À créer :</strong> Refondre AdminDossierDetail.tsx avec un système de Tabs (8 onglets). Créer les composants : DossierRDV, DossierDocuments, DossierPhotos, DossierMesures, DossierMessages, DossierNotes.</div>
</div>

<!-- ====== 7. TIMELINE ====== -->
<div class="s" id="s7">
  <h2>7. Timeline par Secteur</h2>
  <p class="desc">sectorTimelines.ts — 430 lignes, 25 secteurs, 1-4 presets chacun.</p>
  <table>
    <thead><tr><th>Secteur</th><th>Nb presets</th><th>Premier preset (nb étapes)</th><th>Statut</th></tr></thead>
    <tbody>
      <tr><td>generic</td><td>1</td><td>8 (Demande reçue → Terminé)</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>garages</td><td>3</td><td>7 (Véhicule reçu → Terminé)</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>btp</td><td>4</td><td>7 (Devis envoyé → Solde réglé)</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>immobilier</td><td>4</td><td>6 étapes</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>coiffure</td><td>3</td><td>6 étapes</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>mariage</td><td>3</td><td>8 (RDV Pris → Terminée)</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>auto-ecole</td><td>2</td><td>8 (Inscription → Diplômé)</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>cabinet-avocats</td><td>2</td><td>8 (Consultation → Clôturé)</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>expert-comptable</td><td>2</td><td>8 étapes</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>centre-islamique</td><td>—</td><td>—</td><td><span class="b b-a">❌ Absent</span></td></tr>
      <tr><td>association-sportive</td><td>—</td><td>—</td><td><span class="b b-a">❌ Absent</span></td></tr>
    </tbody>
  </table>
  <div class="fix"><strong>⚠ À vérifier :</strong> Comparer étape par étape avec les timelines exactes de la Bible pour chaque secteur. Ajouter les presets manquants.</div>
</div>

<!-- ====== 8. MODULES PRÉ-SÉLECTIONNÉS ====== -->
<div class="s" id="s8">
  <h2>8. Modules Pré-sélectionnés par Secteur</h2>
  <p class="desc">DEFAULT_SECTOR_RECOMMENDATIONS — 24 secteurs × 8 modules recommandés (Bible demande 6).</p>
  <table>
    <thead><tr><th>Point</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Liste de recommandations par secteur</td><td><span class="b b-p">🟡 Partiel</span></td><td>24 secteurs avec 8 modules chacun. Bible demande 6 modules. Écart de quantité.</td></tr>
      <tr><td>Modules Bible absents dans les recommandations (ex: Signature électronique)</td><td><span class="b b-a">❌ Absent</span></td><td>Certains modules recommandés dans la Bible n'existent pas dans ALL_MODULE_KEYS</td></tr>
      <tr><td>Utilisation dans l'onboarding</td><td><span class="b b-a">❌ Absent</span></td><td>DEFAULT_SECTOR_RECOMMENDATIONS n'est pas utilisé dans le wizard</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 9. ESPACES ====== -->
<div class="s" id="s9">
  <h2>9. Espaces Admin / Employé / Client</h2>

  <h3>Espace Admin</h3>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Fichier</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Sidebar 4 groupes (Principal, Commercial, Outils, Gestion)</td><td><span class="b b-ok">✅ OK</span></td><td>AdminSidebar.tsx (279 lignes)</td><td>Groupes conformes</td></tr>
      <tr><td>CRUD complet (clients, dossiers, factures, devis, etc.)</td><td><span class="b b-ok">✅ OK</span></td><td>28 pages admin</td><td>Toutes les opérations CRUD fonctionnelles</td></tr>
      <tr><td>Espaces personnalisés dans sidebar</td><td><span class="b b-ok">✅ OK</span></td><td>AdminSidebar.tsx</td><td>Enterprise uniquement</td></tr>
      <tr><td>Plan badge en footer sidebar</td><td><span class="b b-ok">✅ OK</span></td><td>AdminSidebar.tsx</td><td>Badge offre visible</td></tr>
    </tbody>
  </table>

  <h3>Espace Employé</h3>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Navigation plate (13 modules)</td><td><span class="b b-ok">✅ OK</span></td><td>EmployeeSidebar.tsx (121 lignes)</td></tr>
      <tr><td>Filtrage par modules visibles (employeeVisibleModules)</td><td><span class="b b-ok">✅ OK</span></td><td>app_settings + isModuleHidden</td></tr>
      <tr><td>Permissions granulaires (check_permission)</td><td><span class="b b-ok">✅ OK</span></td><td>RPC Supabase</td></tr>
      <tr><td>Avancer timeline = Business/Enterprise seulement</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de restriction par plan pour les employés</td></tr>
      <tr><td>Voir uniquement ses propres dossiers</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de filtrage systématique par employee_id</td></tr>
    </tbody>
  </table>

  <h3>Espace Client</h3>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Sidebar 10 modules</td><td><span class="b b-ok">✅ OK</span></td><td>ClientSidebar.tsx (127 lignes)</td></tr>
      <tr><td>RLS : voit uniquement ses données</td><td><span class="b b-ok">✅ OK</span></td><td>client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())</td></tr>
      <tr><td>Messagerie : client → admin uniquement</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de restriction — peut écrire à tous</td></tr>
      <tr><td>Timeline : lecture seule</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de restriction d'avancement</td></tr>
    </tbody>
  </table>

  <h3>Espace SuperAdmin</h3>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Dashboard, Entreprises, Abonnements, Formules, Stats, Secteurs</td><td><span class="b b-ok">✅ OK</span></td><td>7 pages superadmin</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 10. AUTH ====== -->
<div class="s" id="s10">
  <h2>10. Authentification &amp; Rôles</h2>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Table user_roles (admin, employee, client)</td><td><span class="b b-ok">✅ OK</span></td><td>Enum app_role conforme</td></tr>
      <tr><td>Fonctions DB : has_role, check_permission, get_user_compte_id</td><td><span class="b b-ok">✅ OK</span></td><td>SECURITY DEFINER, search_path = public</td></tr>
      <tr><td>Trigger handle_new_user (profil + rôle client + fiche auto)</td><td><span class="b b-ok">✅ OK</span></td><td>Création automatique à l'inscription</td></tr>
      <tr><td>Mode démo (4 comptes mock, demo2026)</td><td><span class="b b-ok">✅ OK</span></td><td>DemoAuthContext.tsx + useIsDemo()</td></tr>
      <tr><td>5 Edge Functions auth (create-client, create-employee, reset, etc.)</td><td><span class="b b-ok">✅ OK</span></td><td>Toutes déployées</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 11. PERMISSIONS ====== -->
<div class="s" id="s11">
  <h2>11. Permissions Granulaires (F-03)</h2>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Tables : permissions (11), roles, role_permissions, employe_role, audit_permissions</td><td><span class="b b-ok">✅ OK</span></td><td>Architecture complète</td></tr>
      <tr><td>Hook usePermission / usePermissions</td><td><span class="b b-ok">✅ OK</span></td><td>use-permission.ts</td></tr>
      <tr><td>UI gestion rôles &amp; droits</td><td><span class="b b-ok">✅ OK</span></td><td>RolesPermissionsSettings.tsx</td></tr>
      <tr><td>Mapping module → droits par rôle (Admin/Salarié/Client)</td><td><span class="b b-a">❌ Absent</span></td><td>Bible demande des droits spécifiques par module et par rôle</td></tr>
      <tr><td>Restriction par plan (avancer timeline = Business+)</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de lien plan → permissions</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 12. MULTI-TENANT ====== -->
<div class="s" id="s12">
  <h2>12. Multi-tenant (compte_id)</h2>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Colonne compte_id sur 36+ tables</td><td><span class="b b-ok">✅ OK</span></td><td>Conforme</td></tr>
      <tr><td>Trigger set_compte_id_on_insert</td><td><span class="b b-ok">✅ OK</span></td><td>Automatique sur insert</td></tr>
      <tr><td>RLS restrictive (compte_id = get_user_compte_id())</td><td><span class="b b-ok">✅ OK</span></td><td>Toutes les tables protégées</td></tr>
      <tr><td>Hook useCompteId côté frontend</td><td><span class="b b-ok">✅ OK</span></td><td>Résolution automatique</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 13. EMAILS ====== -->
<div class="s" id="s13">
  <h2>13. Emails &amp; Campagnes</h2>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Tables : email_templates, email_logs, campagnes_email, emails_planifies, email_events</td><td><span class="b b-ok">✅ OK</span></td><td>5 tables complètes</td></tr>
      <tr><td>Edge Functions : send-bulk, send-campaign, process-scheduled, suggest, brevo-webhook</td><td><span class="b b-ok">✅ OK</span></td><td>5 fonctions déployées</td></tr>
      <tr><td>UI : Composer, Planifiés, Historique + filtres V2</td><td><span class="b b-ok">✅ OK</span></td><td>AdminEmails.tsx complet</td></tr>
      <tr><td>Filtres V2 : statut, inactivité, montant, tags</td><td><span class="b b-ok">✅ OK</span></td><td>Tous les filtres implémentés</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 14. DONNÉES DÉMO ====== -->
<div class="s" id="s14">
  <h2>14. Données de Démonstration</h2>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>25 fichiers mock (1 par secteur + générique)</td><td><span class="b b-ok">✅ OK</span></td><td>src/data/mock*.ts</td></tr>
      <tr><td>DemoDataContext (CRUD en mémoire)</td><td><span class="b b-ok">✅ OK</span></td><td>Gère les données mock avec mutations</td></tr>
      <tr><td>Données cohérentes avec les noms métier par secteur</td><td><span class="b b-p">🟡 Partiel</span></td><td>Noms génériques (Dupont) dans plusieurs secteurs</td></tr>
      <tr><td>Données pour secteurs manquants</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de mock pour centre-islamique, association-sportive</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 15. UI ====== -->
<div class="s" id="s15">
  <h2>15. Comportements UI Obligatoires</h2>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Toasts (confirmation, erreur, info)</td><td><span class="b b-ok">✅ OK</span></td><td>Sonner intégré</td></tr>
      <tr><td>Modals destructrices (AlertDialog)</td><td><span class="b b-ok">✅ OK</span></td><td>Confirmation avant suppression</td></tr>
      <tr><td>Loading states (LoadingScreen)</td><td><span class="b b-ok">✅ OK</span></td><td>Au démarrage + transitions</td></tr>
      <tr><td>Responsive (MobileBottomNav + sidebar collapsible)</td><td><span class="b b-ok">✅ OK</span></td><td>Mobile-first</td></tr>
      <tr><td>Animations (Framer Motion)</td><td><span class="b b-ok">✅ OK</span></td><td>Page transitions, stagger</td></tr>
      <tr><td>Design system (Glass cards, gradients, HSL tokens)</td><td><span class="b b-ok">✅ OK</span></td><td>index.css + tailwind.config.ts</td></tr>
      <tr><td>États vides avec message + bouton d'action</td><td><span class="b b-p">🟡 Partiel</span></td><td>AdminEmptyState.tsx existe mais pas utilisé partout</td></tr>
      <tr><td>Tout lien cliquable et fonctionnel</td><td><span class="b b-p">🟡 Partiel</span></td><td>Quelques liens mock sans navigation</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 16. ESPACES PERSO ====== -->
<div class="s" id="s16">
  <h2>16. Espaces Personnalisés</h2>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Table custom_spaces (id, name, enabled_modules, sort_order)</td><td><span class="b b-ok">✅ OK</span></td><td>Fonctionnelle en DB</td></tr>
      <tr><td>Hook use-custom-spaces.ts</td><td><span class="b b-ok">✅ OK</span></td><td>CRUD complet</td></tr>
      <tr><td>Section dans AdminSidebar (Enterprise)</td><td><span class="b b-ok">✅ OK</span></td><td>Affiché uniquement Enterprise</td></tr>
      <tr><td>Espaces recommandés par secteur (Conseillère, Retoucheuse, etc.)</td><td><span class="b b-a">❌ Absent</span></td><td>Pas de pré-configuration par secteur</td></tr>
      <tr><td>Espaces personnalisés pour plan Business</td><td><span class="b b-a">❌ Absent</span></td><td>Bible : Business ET Enterprise, code : Enterprise seulement</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 17. WHITE LABEL ====== -->
<div class="s" id="s17">
  <h2>17. White Label</h2>
  <table>
    <thead><tr><th>Élément</th><th>Statut</th><th>Détail</th></tr></thead>
    <tbody>
      <tr><td>Hook useWhiteLabel + WhiteLabelProvider</td><td><span class="b b-ok">✅ OK</span></td><td>use-white-label.tsx</td></tr>
      <tr><td>Settings : nom de marque, logo, couleurs</td><td><span class="b b-ok">✅ OK</span></td><td>Configurable</td></tr>
      <tr><td>Preview live</td><td><span class="b b-ok">✅ OK</span></td><td>WhiteLabelPreview.tsx</td></tr>
      <tr><td>Restriction Enterprise</td><td><span class="b b-ok">✅ OK</span></td><td>canWhiteLabel: plan === "enterprise"</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 18. EDGE FUNCTIONS ====== -->
<div class="s" id="s18">
  <h2>18. Edge Functions (16 déployées)</h2>
  <table>
    <thead><tr><th>Fonction</th><th>Description</th><th>Statut</th></tr></thead>
    <tbody>
      <tr><td>ai-chat</td><td>Conversations IA (multi-modèles)</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>brevo-webhook</td><td>Webhooks Brevo (email events)</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>calendly-events</td><td>Sync événements Calendly</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>create-client-account</td><td>Création compte client</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>create-employee-account</td><td>Création compte employé</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>generate-account-structure</td><td>Onboarding structure</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>process-scheduled-emails</td><td>CRON emails planifiés</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>send-bulk-email</td><td>Envoi email de masse</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>send-campaign-email</td><td>Envoi campagne</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>send-demande-reception</td><td>Email réception demande</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>send-demande-statut</td><td>Email changement statut</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>send-devis</td><td>Envoi devis par email</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>send-paiement</td><td>Email confirmation paiement</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>send-password-reset</td><td>Reset mot de passe</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>send-relance</td><td>Email de relance</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>send-signup-confirmation</td><td>Confirmation inscription</td><td><span class="b b-ok">✅</span></td></tr>
      <tr><td>suggest-email</td><td>Suggestion email IA</td><td><span class="b b-ok">✅</span></td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 19. TABLES ====== -->
<div class="s" id="s19">
  <h2>19. Tables Supabase (36+ tables)</h2>

  <h3>Tables métier (avec compte_id + RLS)</h3>
  <table>
    <thead><tr><th>Table</th><th>Description</th><th>Cols</th></tr></thead>
    <tbody>
      <tr><td>clients</td><td>Fiches clients</td><td>20</td></tr>
      <tr><td>dossiers</td><td>Dossiers/projets</td><td>16</td></tr>
      <tr><td>factures</td><td>Factures</td><td>15</td></tr>
      <tr><td>devis</td><td>Devis</td><td>17</td></tr>
      <tr><td>relances</td><td>Relances impayés</td><td>12</td></tr>
      <tr><td>employees</td><td>Fiches employés</td><td>14</td></tr>
      <tr><td>conversations</td><td>Conversations messagerie</td><td>9</td></tr>
      <tr><td>messages</td><td>Messages</td><td>11</td></tr>
      <tr><td>notifications</td><td>Notifications</td><td>12</td></tr>
      <tr><td>evenements_calendrier</td><td>Événements calendrier</td><td>11</td></tr>
      <tr><td>events_manuels</td><td>Événements manuels</td><td>11</td></tr>
      <tr><td>produits</td><td>Produits/stock</td><td>15</td></tr>
      <tr><td>product_categories</td><td>Catégories produits</td><td>7</td></tr>
      <tr><td>fournisseurs</td><td>Fournisseurs</td><td>12</td></tr>
      <tr><td>bons_commande</td><td>Bons de commande</td><td>11</td></tr>
      <tr><td>bon_commande_lignes</td><td>Lignes de BC</td><td>7</td></tr>
      <tr><td>stock_mouvements</td><td>Mouvements de stock</td><td>9</td></tr>
      <tr><td>demandes</td><td>Demandes clients</td><td>14</td></tr>
      <tr><td>cahiers_des_charges</td><td>CDC liés aux demandes</td><td>21</td></tr>
      <tr><td>cdc_historique</td><td>Historique CDC</td><td>7</td></tr>
      <tr><td>service_categories</td><td>Catégories de services</td><td>7</td></tr>
      <tr><td>email_templates</td><td>Templates email</td><td>8</td></tr>
      <tr><td>email_logs</td><td>Logs d'envoi email</td><td>9</td></tr>
      <tr><td>campagnes_email</td><td>Campagnes email</td><td>9</td></tr>
      <tr><td>emails_planifies</td><td>Emails programmés</td><td>12</td></tr>
      <tr><td>email_events</td><td>Events email (webhook)</td><td>8</td></tr>
      <tr><td>donnees_mensuelles</td><td>KPIs mensuels</td><td>13</td></tr>
      <tr><td>objectifs_mensuels</td><td>Objectifs CA</td><td>5</td></tr>
      <tr><td>tags</td><td>Tags pour clients</td><td>5</td></tr>
      <tr><td>client_tags</td><td>Association client-tag</td><td>5</td></tr>
      <tr><td>client_dossier</td><td>Association client-dossier (N-to-N)</td><td>5</td></tr>
      <tr><td>dossier_employe</td><td>Association dossier-employé (N-to-N)</td><td>6</td></tr>
      <tr><td>dossier_timeline</td><td>Timeline de suivi</td><td>9</td></tr>
      <tr><td>employe_role</td><td>Association employé-rôle</td><td>5</td></tr>
      <tr><td>annonces</td><td>Annonces internes</td><td>11</td></tr>
      <tr><td>annonce_lecture</td><td>Lectures d'annonces</td><td>3</td></tr>
      <tr><td>send_logs</td><td>Logs d'envoi docs</td><td>6</td></tr>
      <tr><td>preview_visits</td><td>Visites de preview</td><td>5</td></tr>
      <tr><td>demandes_indisponibilite</td><td>Congés employés</td><td>10</td></tr>
      <tr><td>ai_conversations</td><td>Conversations IA</td><td>7</td></tr>
      <tr><td>ai_messages</td><td>Messages IA</td><td>6</td></tr>
      <tr><td>metier_vocabulaire</td><td>Vocabulaire métier</td><td>6</td></tr>
      <tr><td>custom_spaces</td><td>Espaces personnalisés</td><td>8</td></tr>
    </tbody>
  </table>

  <h3>Tables système</h3>
  <table>
    <thead><tr><th>Table</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td>app_settings</td><td>Paramètres (modules activés, onboarding, etc.)</td></tr>
      <tr><td>profiles</td><td>Profils utilisateurs (nom, tel)</td></tr>
      <tr><td>subscriptions</td><td>Abonnements (plan, modules, secteur)</td></tr>
      <tr><td>roles</td><td>Rôles personnalisés</td></tr>
      <tr><td>permissions</td><td>11 permissions système</td></tr>
      <tr><td>role_permissions</td><td>Matrice rôle-permission</td></tr>
      <tr><td>audit_permissions</td><td>Historique modifications permissions</td></tr>
      <tr><td>user_roles</td><td>Rôles auth (admin, employee, client)</td></tr>
    </tbody>
  </table>
</div>

<!-- ====== 20. RÉCAPITULATIF ====== -->
<div class="s" id="s20">
  <h2>20. Récapitulatif des Priorités</h2>

  <div class="sg">
    <div class="sc"><div class="n" style="color:${C.urgent}">5</div><div class="l">🔴 CRITIQUES</div></div>
    <div class="sc"><div class="n" style="color:${C.haute}">5</div><div class="l">🟠 IMPORTANTS</div></div>
    <div class="sc"><div class="n" style="color:${C.ok}">20</div><div class="l">🟢 CONFORMES</div></div>
    <div class="sc"><div class="n" style="color:${C.muted}">6</div><div class="l">⚪ MODULES MANQUANTS</div></div>
  </div>

  <h3>🔴 Critiques (non conformes à la Bible)</h3>
  <table>
    <thead><tr><th>#</th><th>Écart</th><th>Fichier(s) concernés</th><th>Impact</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Onboarding : refondre en 4 étapes Bible</td><td>OnboardingWizard.tsx</td><td>Tunnel d'inscription non conforme</td></tr>
      <tr><td>2</td><td>Socle fixe : Clients &amp; Dossiers + Analyse hors quota</td><td>DemoPlanContext.tsx, use-subscription.ts, AdminModulesSection.tsx</td><td>Comptage modules incorrect</td></tr>
      <tr><td>3</td><td>Fiche dossier : ajouter 8 onglets obligatoires</td><td>AdminDossierDetail.tsx</td><td>UX non conforme</td></tr>
      <tr><td>4</td><td>Secteurs manquants : 2-3 à ajouter</td><td>DemoPlanContext.tsx, sectorModules.ts, sectorTimelines.ts</td><td>Couverture métier incomplète</td></tr>
      <tr><td>5</td><td>Modules verrouillés : UI grisée + modal upsell dans sidebar</td><td>AdminSidebar.tsx</td><td>Upsell non visible</td></tr>
    </tbody>
  </table>

  <h3>🟠 Importants (partiellement conformes)</h3>
  <table>
    <thead><tr><th>#</th><th>Écart</th><th>Fichier(s)</th></tr></thead>
    <tbody>
      <tr><td>6</td><td>Vocabulaire nom employé/client : compléter et utiliser systématiquement</td><td>sectorModules.ts, composants UI</td></tr>
      <tr><td>7</td><td>Messagerie : restrictions par rôle (client → admin uniquement)</td><td>AdminMessaging.tsx, ClientMessaging.tsx</td></tr>
      <tr><td>8</td><td>Timeline Business+ : restriction avancer étapes pour employés</td><td>DossierTimeline, use-subscription</td></tr>
      <tr><td>9</td><td>Modules pré-sélectionnés : aligner avec les 6 recommandations Bible</td><td>DemoPlanContext.tsx</td></tr>
      <tr><td>10</td><td>Espaces personnalisés : ouvrir au plan Business</td><td>AdminSidebar.tsx, use-custom-spaces</td></tr>
    </tbody>
  </table>

  <h3>🟢 Conformes (20 points)</h3>
  <table>
    <thead><tr><th>#</th><th>Élément</th><th>Section</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Architecture tronc commun unique</td><td>§1</td></tr>
      <tr><td>2</td><td>Providers chaîne conforme</td><td>§1</td></tr>
      <tr><td>3</td><td>Backend 36+ tables + RLS</td><td>§1</td></tr>
      <tr><td>4</td><td>Prix 3 offres (150/250/500)</td><td>§2</td></tr>
      <tr><td>5</td><td>Enterprise = all modules</td><td>§2</td></tr>
      <tr><td>6</td><td>Labels modules par secteur (544 lignes)</td><td>§4</td></tr>
      <tr><td>7</td><td>Vocabulaire dossier par secteur</td><td>§4</td></tr>
      <tr><td>8</td><td>22/28 modules implémentés</td><td>§5</td></tr>
      <tr><td>9</td><td>Timeline presets par secteur (25 secteurs)</td><td>§7</td></tr>
      <tr><td>10</td><td>Espace Admin complet (28 pages, CRUD)</td><td>§9</td></tr>
      <tr><td>11</td><td>Auth : user_roles + has_role + handle_new_user</td><td>§10</td></tr>
      <tr><td>12</td><td>Permissions F-03 (11 permissions, rôles, audit)</td><td>§11</td></tr>
      <tr><td>13</td><td>Multi-tenant compte_id + trigger + RLS</td><td>§12</td></tr>
      <tr><td>14</td><td>Emails V2 complet (5 tables, 5 Edge Functions)</td><td>§13</td></tr>
      <tr><td>15</td><td>25 fichiers données démo</td><td>§14</td></tr>
      <tr><td>16</td><td>UI : toasts, modals, loading, animations</td><td>§15</td></tr>
      <tr><td>17</td><td>Responsive mobile (MobileBottomNav)</td><td>§15</td></tr>
      <tr><td>18</td><td>White Label (Enterprise)</td><td>§17</td></tr>
      <tr><td>19</td><td>16 Edge Functions déployées</td><td>§18</td></tr>
      <tr><td>20</td><td>SuperAdmin (7 pages)</td><td>§9</td></tr>
    </tbody>
  </table>
</div>

<div class="footer">
  MBA Audit Complet Bible v3 — ${now} — IMPARTIAL GAMES — Confidentiel<br>
  20 sections · 36+ tables · 16 Edge Functions · 22 modules · 24 secteurs · 3 espaces
</div>

</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `MBA-Audit-Bible-v3-${now.replace(/\//g, "-")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
