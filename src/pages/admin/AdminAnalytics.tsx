import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { useDemoData } from "@/contexts/DemoDataContext";
import { donneesMensuelles, tickets, clients } from "@/data/mockData";
import { Euro, TrendingUp, FolderOpen, Users, BarChart3, LifeBuoy, Clock, CheckCircle, Download, Loader2, FileText, CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Support analytics data
const ticketsByWeek = [
  { semaine: "S4 Jan", ouverts: 1, fermes: 1 },
  { semaine: "S5 Fév", ouverts: 2, fermes: 0 },
  { semaine: "S6 Fév", ouverts: 1, fermes: 1 },
  { semaine: "S7 Fév", ouverts: 1, fermes: 1 },
  { semaine: "S8 Fév", ouverts: 0, fermes: 1 },
];

const tempsReponseMoyen = [
  { semaine: "S4 Jan", heures: 4.5 },
  { semaine: "S5 Fév", heures: 6.2 },
  { semaine: "S6 Fév", heures: 3.8 },
  { semaine: "S7 Fév", heures: 2.5 },
  { semaine: "S8 Fév", heures: 5.0 },
];

const ticketStatuts = [
  { name: "Ouverts", value: tickets.filter((t) => t.statut === "ouvert").length, color: "hsl(45, 93%, 55%)" },
  { name: "En cours", value: tickets.filter((t) => t.statut === "en_cours").length, color: "hsl(200, 100%, 50%)" },
  { name: "Résolus", value: tickets.filter((t) => t.statut === "resolu").length, color: "hsl(155, 100%, 45%)" },
  { name: "Fermés", value: tickets.filter((t) => t.statut === "ferme").length, color: "hsl(250, 10%, 45%)" },
];

const ticketPriorites = [
  { name: "Urgente", value: tickets.filter((t) => t.priorite === "urgente").length, color: "hsl(0, 84%, 60%)" },
  { name: "Haute", value: tickets.filter((t) => t.priorite === "haute").length, color: "hsl(45, 93%, 55%)" },
  { name: "Normale", value: tickets.filter((t) => t.priorite === "normale").length, color: "hsl(200, 100%, 50%)" },
  { name: "Basse", value: tickets.filter((t) => t.priorite === "basse").length, color: "hsl(250, 10%, 45%)" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs space-y-1 border border-border/50">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">
            {typeof entry.value === "number"
              ? entry.name.includes("%") || entry.name.includes("Conversion") || entry.name.includes("conversion")
                ? `${entry.value}%`
                : entry.value.toLocaleString() + (entry.name.includes("€") || entry.name.includes("CA") || entry.name.includes("Objectif") || entry.name.includes("Encaissements") || entry.name.includes("Panier") ? " €" : "")
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  const isMobile = useIsMobile();
  const [exporting, setExporting] = useState(false);
  const { factures, demandes } = useDemoData();

  const totalCA = donneesMensuelles.reduce((acc, d) => acc + d.caTotal, 0);
  const totalEncaissements = donneesMensuelles.reduce((acc, d) => acc + d.encaissements, 0);
  const totalDossiers = donneesMensuelles.reduce((acc, d) => acc + d.dossiers, 0);
  const totalNouveauxClients = donneesMensuelles.reduce((acc, d) => acc + d.nouveauxClients, 0);

  // Dynamic payment distribution
  const paymentDistribution = useMemo(() => [
    { name: "Payées", value: factures.filter((f) => f.statut === "payee").length, color: "hsl(155, 100%, 45%)" },
    { name: "En attente", value: factures.filter((f) => f.statut === "en_attente").length, color: "hsl(45, 93%, 55%)" },
    { name: "En retard", value: factures.filter((f) => f.statut === "en_retard").length, color: "hsl(0, 84%, 60%)" },
  ], [factures]);

  // Collection rate per month
  const tauxEncaissement = useMemo(() =>
    donneesMensuelles.map((d) => ({
      mois: d.mois,
      taux: d.caTotal > 0 ? Math.round((d.encaissements / d.caTotal) * 100) : 0,
    })), []);

  // Top clients by CA
  const topClients = useMemo(() => {
    const caByClient: Record<string, { nom: string; ca: number }> = {};
    factures.filter((f) => f.statut === "payee").forEach((f) => {
      if (!caByClient[f.clientId]) caByClient[f.clientId] = { nom: f.clientNom, ca: 0 };
      caByClient[f.clientId].ca += f.montant;
    });
    return Object.values(caByClient).sort((a, b) => b.ca - a.ca).slice(0, 5);
  }, [factures]);

  // Demandes stats
  const demandesStats = useMemo(() => ({
    total: demandes.length,
    validees: demandes.filter((d) => d.statut === "validee").length,
    refusees: demandes.filter((d) => d.statut === "refusee").length,
    enRevue: demandes.filter((d) => d.statut === "en_revue").length,
    nouvelles: demandes.filter((d) => d.statut === "nouvelle").length,
  }), [demandes]);

  const demandesDistribution = useMemo(() => [
    { name: "Nouvelles", value: demandesStats.nouvelles, color: "hsl(200, 100%, 50%)" },
    { name: "En revue", value: demandesStats.enRevue, color: "hsl(45, 93%, 55%)" },
    { name: "Validées", value: demandesStats.validees, color: "hsl(155, 100%, 45%)" },
    { name: "Refusées", value: demandesStats.refusees, color: "hsl(0, 84%, 60%)" },
  ], [demandesStats]);

  const tickFontSize = isMobile ? 10 : 12;

  const exportPDF = async () => {
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();
      const now = new Date().toLocaleDateString("fr-FR");

      // Title
      doc.setFontSize(20);
      doc.text("Rapport Analytique — Impartial", 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Généré le ${now}`, 14, 28);

      // KPIs
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text("Indicateurs clés 2026", 14, 40);
      autoTable(doc, {
        startY: 44,
        head: [["CA Total", "Encaissements", "Dossiers", "Nouveaux clients"]],
        body: [[
          `${(totalCA / 1000).toFixed(0)}k €`,
          `${(totalEncaissements / 1000).toFixed(0)}k €`,
          String(totalDossiers),
          String(totalNouveauxClients),
        ]],
        theme: "grid",
        headStyles: { fillColor: [100, 60, 180] },
      });

      // Monthly table
      const afterKpi = (doc as any).lastAutoTable?.finalY || 60;
      doc.setFontSize(14);
      doc.text("Tendances mensuelles", 14, afterKpi + 10);
      autoTable(doc, {
        startY: afterKpi + 14,
        head: [["Mois", "Objectif", "CA Total", "Encaissements", "Dossiers", "Panier moy."]],
        body: donneesMensuelles.map((d) => [
          d.mois,
          `${d.objectif.toLocaleString()} €`,
          `${d.caTotal.toLocaleString()} €`,
          `${d.encaissements.toLocaleString()} €`,
          String(d.dossiers),
          `${d.panierMoyen.toLocaleString()} €`,
        ]),
        theme: "striped",
        headStyles: { fillColor: [100, 60, 180] },
        styles: { fontSize: 8 },
      });

      // Support section — new page
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Activité Support", 14, 20);

      const openTickets = tickets.filter((t) => t.statut === "ouvert" || t.statut === "en_cours").length;
      const resolvedTickets = tickets.filter((t) => t.statut === "resolu" || t.statut === "ferme").length;
      doc.setFontSize(10);
      doc.text(`Tickets ouverts : ${openTickets}  |  Résolus/Fermés : ${resolvedTickets}  |  Temps rép. moyen : 4.4h  |  Taux résolution : ${Math.round((resolvedTickets / tickets.length) * 100)}%`, 14, 30);

      autoTable(doc, {
        startY: 36,
        head: [["Semaine", "Ouverts", "Fermés"]],
        body: ticketsByWeek.map((w) => [w.semaine, String(w.ouverts), String(w.fermes)]),
        theme: "grid",
        headStyles: { fillColor: [0, 150, 200] },
      });

      const afterSupport = (doc as any).lastAutoTable?.finalY || 80;
      autoTable(doc, {
        startY: afterSupport + 6,
        head: [["Réf.", "Client", "Sujet", "Priorité", "Statut"]],
        body: tickets.map((t) => [t.reference, t.clientNom, t.sujet, t.priorite, t.statut]),
        theme: "striped",
        headStyles: { fillColor: [0, 150, 200] },
        styles: { fontSize: 8 },
      });

      doc.save(`rapport-impartial-${now.replace(/\//g, "-")}.pdf`);
      toast.success("Rapport PDF exporté avec succès");
    } catch (err) {
      toast.error("Erreur lors de l'export PDF");
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Analyse
              </h1>
              <p className="text-muted-foreground text-sm">Données analytiques 2026</p>
            </div>
            <button
              onClick={exportPDF}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors self-start"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Exporter en PDF
            </button>
          </motion.div>

          {/* KPIs */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={staggerItem}>
              <DashboardKPI title="CA total 2026" value={`${(totalCA / 1000).toFixed(0)}k €`} icon={Euro} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Encaissements" value={`${(totalEncaissements / 1000).toFixed(0)}k €`} icon={TrendingUp} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Nouveaux dossiers" value={totalDossiers} icon={FolderOpen} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Nouveaux clients" value={totalNouveauxClients} icon={Users} />
            </motion.div>
          </motion.div>

          {/* Tendances Mensuelles Table */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4">Tendances mensuelles 2026</h3>
            <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Mois</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Objectif</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">CA Total</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Encaissements</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Dossiers</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Panier moyen</th>
                  </tr>
                </thead>
                <tbody>
                  {donneesMensuelles.map((d) => (
                    <tr key={d.mois} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="py-2 px-3 font-medium">{d.mois}</td>
                      <td className="py-2 px-3 text-right text-muted-foreground">{d.objectif.toLocaleString()} €</td>
                      <td className="py-2 px-3 text-right font-medium"
                        style={{ color: d.caTotal >= d.objectif ? "hsl(155,100%,65%)" : "hsl(0,84%,70%)" }}
                      >
                        {d.caTotal.toLocaleString()} €
                      </td>
                      <td className="py-2 px-3 text-right">{d.encaissements.toLocaleString()} €</td>
                      <td className="py-2 px-3 text-center">{d.dossiers}</td>
                      <td className="py-2 px-3 text-right">{d.panierMoyen.toLocaleString()} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Évolution du CA */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4">Évolution du chiffre d'affaires</h3>
            <div className="h-48 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donneesMensuelles}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                  <XAxis dataKey="mois" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} />
                  <YAxis tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} width={isMobile ? 40 : 60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: tickFontSize }} />
                  <Line type="monotone" dataKey="objectif" name="Objectif" stroke="hsl(250, 10%, 45%)" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="caTotal" name="CA Total" stroke="hsl(265, 85%, 60%)" strokeWidth={2.5} dot={isMobile ? false : { r: 3, fill: "hsl(265, 85%, 60%)" }} />
                  <Line type="monotone" dataKey="encaissements" name="Encaissements" stroke="hsl(155, 100%, 45%)" strokeWidth={2} dot={isMobile ? false : { r: 3, fill: "hsl(155, 100%, 45%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Analyse quantitative des ventes */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4">Analyse quantitative des ventes</h3>
            <div className="h-48 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donneesMensuelles}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                  <XAxis dataKey="mois" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} width={isMobile ? 35 : 60} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} width={isMobile ? 30 : 60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: tickFontSize }} />
                  <Bar yAxisId="left" dataKey="dossiers" name="Dossiers" fill="hsl(200, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar yAxisId="left" dataKey="panierMoyen" name="Panier moyen" fill="hsl(265, 85%, 60%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar yAxisId="right" dataKey="conversion" name="Conversion %" fill="hsl(155, 100%, 45%)" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* ======= SECTION PAIEMENTS & DEMANDES ======= */}
          <motion.div variants={staggerItem} className="pt-4">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              Paiements & Demandes
            </h2>
          </motion.div>

          {/* KPIs Demandes */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Total demandes" value={demandesStats.total} icon={FileText} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Validées" value={demandesStats.validees} icon={CheckCircle} trend={{ value: demandesStats.total > 0 ? Math.round((demandesStats.validees / demandesStats.total) * 100) : 0, label: "taux" }} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="En revue" value={demandesStats.enRevue} icon={Clock} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Taux d'encaissement" value={`${totalCA > 0 ? Math.round((totalEncaissements / totalCA) * 100) : 0}%`} icon={Euro} />
            </motion.div>
          </motion.div>

          {/* Répartition paiements + demandes */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerItem}>
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-sm font-semibold mb-4">Répartition des paiements</h3>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentDistribution} cx="50%" cy="50%" innerRadius={isMobile ? 40 : 55} outerRadius={isMobile ? 65 : 80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`} labelLine={false} style={{ fontSize: tickFontSize }}>
                      {paymentDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-sm font-semibold mb-4">Répartition des demandes</h3>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={demandesDistribution} cx="50%" cy="50%" innerRadius={isMobile ? 40 : 55} outerRadius={isMobile ? 65 : 80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`} labelLine={false} style={{ fontSize: tickFontSize }}>
                      {demandesDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Taux d'encaissement */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4">Évolution du taux d'encaissement</h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tauxEncaissement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                  <XAxis dataKey="mois" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} />
                  <YAxis tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} unit="%" domain={[0, 100]} width={isMobile ? 35 : 50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="taux" name="Taux %" fill="hsl(155, 100%, 45%)" fillOpacity={0.15} stroke="hsl(155, 100%, 45%)" strokeWidth={2.5} dot={isMobile ? false : { r: 4, fill: "hsl(155, 100%, 45%)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top clients */}
          {topClients.length > 0 && (
            <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
              <h3 className="text-sm font-semibold mb-4">Top clients par CA encaissé</h3>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topClients} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                    <XAxis type="number" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} />
                    <YAxis dataKey="nom" type="category" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} width={isMobile ? 80 : 120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="ca" name="CA €" fill="hsl(265, 85%, 60%)" radius={[0, 4, 4, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* ======= SECTION SUPPORT ======= */}
          <motion.div variants={staggerItem} className="pt-4">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <LifeBuoy className="h-5 w-5 text-primary" />
              Activité Support
            </h2>
          </motion.div>

          {/* KPI Support */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Tickets ouverts" value={tickets.filter((t) => t.statut === "ouvert" || t.statut === "en_cours").length} icon={LifeBuoy} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Temps réponse moyen" value="4.4h" icon={Clock} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Taux résolution" value={`${Math.round((tickets.filter((t) => t.statut === "resolu" || t.statut === "ferme").length / tickets.length) * 100)}%`} icon={CheckCircle} />
            </motion.div>
          </motion.div>

          {/* Tickets ouverts/fermés par semaine */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4">Tickets ouverts vs fermés par semaine</h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketsByWeek}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                  <XAxis dataKey="semaine" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} />
                  <YAxis tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} allowDecimals={false} width={isMobile ? 30 : 40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: tickFontSize }} />
                  <Bar dataKey="ouverts" name="Ouverts" fill="hsl(45, 93%, 55%)" radius={[4, 4, 0, 0]} opacity={0.85} />
                  <Bar dataKey="fermes" name="Fermés" fill="hsl(155, 100%, 45%)" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Temps de réponse moyen */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4">Temps de réponse moyen (heures)</h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={tempsReponseMoyen}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                  <XAxis dataKey="semaine" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} />
                  <YAxis tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} width={isMobile ? 30 : 40} unit="h" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="heures" name="Temps de réponse" fill="hsl(200, 100%, 50%)" fillOpacity={0.15} stroke="hsl(200, 100%, 50%)" strokeWidth={2.5} dot={isMobile ? false : { r: 4, fill: "hsl(200, 100%, 50%)" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Répartition par statut et priorité */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerItem}>
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-sm font-semibold mb-4">Répartition par statut</h3>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ticketStatuts} cx="50%" cy="50%" innerRadius={isMobile ? 40 : 55} outerRadius={isMobile ? 65 : 80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`} labelLine={false} style={{ fontSize: tickFontSize }}>
                      {ticketStatuts.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-sm font-semibold mb-4">Répartition par priorité</h3>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ticketPriorites} cx="50%" cy="50%" innerRadius={isMobile ? 40 : 55} outerRadius={isMobile ? 65 : 80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`} labelLine={false} style={{ fontSize: tickFontSize }}>
                      {ticketPriorites.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
