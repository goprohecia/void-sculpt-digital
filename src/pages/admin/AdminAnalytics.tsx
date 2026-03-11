import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { useFactures } from "@/hooks/use-factures";
import { useDemandes } from "@/hooks/use-demandes";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useClients } from "@/hooks/use-clients";
import { useDossiers } from "@/hooks/use-dossiers";
import { useTickets } from "@/hooks/use-tickets";
import { donneesMensuelles as mockDonneesMensuelles } from "@/data/mockData";
import { Euro, TrendingUp, FolderOpen, Users, BarChart3, LifeBuoy, Clock, CheckCircle, Download, Loader2, FileText, CreditCard, FileSpreadsheet, Pencil, Check, X, ArrowDownUp } from "lucide-react";
import { AIContextButton } from "@/components/admin/AIContextButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { exportCsv } from "@/lib/exportCsv";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { useObjectifs } from "@/hooks/use-objectifs";
import { useServiceCategories } from "@/hooks/use-service-categories";
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
  const { isDemo } = useIsDemo();
  const { factures } = useFactures();
  const { demandes } = useDemandes();
  const { clients } = useClients();
  const { dossiers: allDossiers } = useDossiers();
  const { tickets } = useTickets();

  const donneesMensuelles = isDemo ? mockDonneesMensuelles : [];

  // Editable objectives — persisted in DB
  const { objectifs, updateObjectif } = useObjectifs();
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const dataWithObjectifs = useMemo(
    () => donneesMensuelles.map((d) => ({ ...d, objectif: objectifs[d.mois] ?? d.objectif })),
    [objectifs, donneesMensuelles]
  );

  const startEdit = useCallback((mois: string) => {
    setEditingMonth(mois);
    setEditValue(String(objectifs[mois]));
  }, [objectifs]);

  const confirmEdit = useCallback(() => {
    if (!editingMonth) return;
    const val = parseInt(editValue.replace(/\s/g, ""), 10);
    if (!isNaN(val) && val >= 0) {
      updateObjectif(editingMonth, val);
    }
    setEditingMonth(null);
  }, [editingMonth, editValue, updateObjectif]);

  const cancelEdit = useCallback(() => setEditingMonth(null), []);

  const totalCA = dataWithObjectifs.reduce((acc, d) => acc + d.caTotal, 0);
  const totalEncaissements = dataWithObjectifs.reduce((acc, d) => acc + d.encaissements, 0);
  const totalDossiers = dataWithObjectifs.reduce((acc, d) => acc + d.dossiers, 0);
  const totalNouveauxClients = dataWithObjectifs.reduce((acc, d) => acc + d.nouveauxClients, 0);

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
    })), [donneesMensuelles]);

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

  // Ventes par type de projet par mois (from dossiers) — dynamic categories
  const { categories: serviceCategories, categorize } = useServiceCategories();
  const CATS = useMemo(() => serviceCategories.map((c) => c.nom), [serviceCategories]);
  const catColors = useMemo(() => {
    const map: Record<string, string> = {};
    serviceCategories.forEach((c) => { map[c.nom] = c.couleur; });
    return map;
  }, [serviceCategories]);

  const moisMap: Record<string, string> = useMemo(() => ({
    "Jan": "01", "Fév": "02", "Mar": "03", "Avr": "04",
    "Mai": "05", "Juin": "06", "Juil": "07", "Août": "08",
    "Sep": "09", "Oct": "10", "Nov": "11", "Déc": "12",
  }), []);

  const ventesParType = useMemo(() => {
    const moisList = donneesMensuelles.map((d) => d.mois);
    return moisList.map((mois) => {
      const mm = moisMap[mois];
      const monthDossiers = allDossiers.filter((d) => d.dateCreation.startsWith("2026-" + mm));
      const result: Record<string, number | string> = { mois };
      CATS.forEach((c) => { result[c] = 0; result[c + "_n"] = 0; });
      monthDossiers.forEach((d) => {
        const cat = categorize(d.typePrestation);
        result[cat] = (result[cat] as number) + d.montant;
        result[cat + "_n"] = (result[cat + "_n"] as number) + 1;
      });
      return result;
    });
  }, [categorize, moisMap, donneesMensuelles, allDossiers, CATS]);

  // Totals per category across all months
  const ventesTotaux = useMemo(() => {
    const totals: Record<string, { ca: number; count: number }> = {};
    CATS.forEach((c) => { totals[c] = { ca: 0, count: 0 }; });
    ventesParType.forEach((row) => {
      CATS.forEach((c) => {
        totals[c].ca += (row[c] as number) || 0;
        totals[c].count += (row[c + "_n"] as number) || 0;
      });
    });
    return totals;
  }, [ventesParType, CATS]);

  // Support stats (dynamic)
  const ticketStatuts = useMemo(() => [
    { name: "Ouverts", value: tickets.filter((t) => t.statut === "ouvert").length, color: "hsl(45, 93%, 55%)" },
    { name: "En cours", value: tickets.filter((t) => t.statut === "en_cours").length, color: "hsl(200, 100%, 50%)" },
    { name: "Résolus", value: tickets.filter((t) => t.statut === "resolu").length, color: "hsl(155, 100%, 45%)" },
    { name: "Fermés", value: tickets.filter((t) => t.statut === "ferme").length, color: "hsl(250, 10%, 45%)" },
  ], [tickets]);

  const ticketPriorites = useMemo(() => [
    { name: "Urgente", value: tickets.filter((t) => t.priorite === "urgente").length, color: "hsl(0, 84%, 60%)" },
    { name: "Haute", value: tickets.filter((t) => t.priorite === "haute").length, color: "hsl(45, 93%, 55%)" },
    { name: "Normale", value: tickets.filter((t) => t.priorite === "normale").length, color: "hsl(200, 100%, 50%)" },
    { name: "Basse", value: tickets.filter((t) => t.priorite === "basse").length, color: "hsl(250, 10%, 45%)" },
  ], [tickets]);

  const openTicketsCount = tickets.filter((t) => t.statut === "ouvert" || t.statut === "en_cours").length;
  const resolvedTicketsCount = tickets.filter((t) => t.statut === "resolu" || t.statut === "ferme").length;
  const resolutionRate = tickets.length > 0 ? Math.round((resolvedTicketsCount / tickets.length) * 100) : 0;

  // ======= DEPENSES (bons de commande) =======
  const { data: bonsCommande = [] } = useQuery({
    queryKey: ["bons-commande-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bons_commande").select("montant_total, date_commande, statut");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo,
  });

  const totalDepenses = useMemo(() => {
    if (isDemo) return 42500; // demo mock
    return bonsCommande.reduce((acc, bc) => acc + Number(bc.montant_total), 0);
  }, [bonsCommande, isDemo]);

  const depensesVsRecettes = useMemo(() => {
    if (isDemo) {
      return [
        { mois: "Jan", recettes: 18500, depenses: 5200 },
        { mois: "Fév", recettes: 22300, depenses: 7800 },
        { mois: "Mar", recettes: 28900, depenses: 9500 },
        { mois: "Avr", recettes: 31200, depenses: 6300 },
        { mois: "Mai", recettes: 26800, depenses: 8100 },
        { mois: "Juin", recettes: 35600, depenses: 5600 },
      ];
    }
    const moisList = donneesMensuelles.map((d) => d.mois);
    return moisList.map((mois) => {
      const mm = moisMap[mois];
      const monthRecettes = factures
        .filter((f) => f.statut === "payee" && f.dateEmission.startsWith("2026-" + mm))
        .reduce((s, f) => s + f.montant, 0);
      const monthDepenses = bonsCommande
        .filter((bc) => bc.date_commande?.startsWith("2026-" + mm))
        .reduce((s, bc) => s + Number(bc.montant_total), 0);
      return { mois, recettes: monthRecettes, depenses: monthDepenses };
    });
  }, [isDemo, donneesMensuelles, factures, bonsCommande, moisMap]);

  const margeNette = useMemo(() => {
    const totalRecettes = depensesVsRecettes.reduce((s, d) => s + d.recettes, 0);
    const totalDep = depensesVsRecettes.reduce((s, d) => s + d.depenses, 0);
    return totalRecettes - totalDep;
  }, [depensesVsRecettes]);

  // Static mock support timeline data — only in demo
  const ticketsByWeek = isDemo ? [
    { semaine: "S4 Jan", ouverts: 1, fermes: 1 },
    { semaine: "S5 Fév", ouverts: 2, fermes: 0 },
    { semaine: "S6 Fév", ouverts: 1, fermes: 1 },
    { semaine: "S7 Fév", ouverts: 1, fermes: 1 },
    { semaine: "S8 Fév", ouverts: 0, fermes: 1 },
  ] : [];

  const tempsReponseMoyen = isDemo ? [
    { semaine: "S4 Jan", heures: 4.5 },
    { semaine: "S5 Fév", heures: 6.2 },
    { semaine: "S6 Fév", heures: 3.8 },
    { semaine: "S7 Fév", heures: 2.5 },
    { semaine: "S8 Fév", heures: 5.0 },
  ] : [];

  const tickFontSize = isMobile ? 10 : 12;

  const hasData = donneesMensuelles.length > 0;

  const exportPDF = async () => {
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();
      const now = new Date().toLocaleDateString("fr-FR");

      doc.setFontSize(20);
      doc.text("Rapport Analytique — My Business Assistant", 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Généré le ${now}`, 14, 28);

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

      const afterKpi = (doc as any).lastAutoTable?.finalY || 60;
      doc.setFontSize(14);
      doc.text("Tendances mensuelles", 14, afterKpi + 10);
      autoTable(doc, {
        startY: afterKpi + 14,
        head: [["Mois", "Objectif", "CA Total", "Encaissements", "Dossiers", "Panier moy."]],
        body: dataWithObjectifs.map((d) => [
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

      const afterMonthly = (doc as any).lastAutoTable?.finalY || 120;
      doc.setFontSize(14);
      doc.text("Ventes par type de projet", 14, afterMonthly + 10);
      autoTable(doc, {
        startY: afterMonthly + 14,
        head: [["Mois", ...CATS.map((c) => `${c} (CA)`), ...CATS.map((c) => `${c} (Nb)`), "Total CA"]],
        body: ventesParType.map((row) => [
          row.mois as string,
          ...CATS.map((c) => (row[c] as number) > 0 ? `${((row[c] as number) / 1000).toFixed(1)}k €` : "–"),
          ...CATS.map((c) => (row[c + "_n"] as number) > 0 ? String(row[c + "_n"]) : "–"),
          `${(CATS.reduce((s, c) => s + ((row[c] as number) || 0), 0) / 1000).toFixed(1)}k €`,
        ]),
        foot: [[
          "Total",
          ...CATS.map((c) => ventesTotaux[c].ca > 0 ? `${(ventesTotaux[c].ca / 1000).toFixed(1)}k €` : "–"),
          ...CATS.map((c) => ventesTotaux[c].count > 0 ? String(ventesTotaux[c].count) : "–"),
          `${(Object.values(ventesTotaux).reduce((s, v) => s + v.ca, 0) / 1000).toFixed(1)}k €`,
        ], [
          "Panier moy.",
          ...CATS.map((c) => ventesTotaux[c].count > 0 ? `${Math.round(ventesTotaux[c].ca / ventesTotaux[c].count).toLocaleString()} €` : "–"),
          ...CATS.map(() => ""),
          (() => { const t = Object.values(ventesTotaux).reduce((s, v) => s + v.ca, 0); const n = Object.values(ventesTotaux).reduce((s, v) => s + v.count, 0); return n > 0 ? `${Math.round(t / n).toLocaleString()} €` : "–"; })(),
        ]],
        theme: "striped",
        headStyles: { fillColor: [100, 60, 180], fontSize: 6 },
        bodyStyles: { fontSize: 6 },
        footStyles: { fillColor: [240, 240, 250], textColor: [40, 40, 40], fontSize: 6 },
        styles: { cellPadding: 1.5 },
      });

      // Support section
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Activité Support", 14, 20);

      doc.setFontSize(10);
      doc.text(`Tickets ouverts : ${openTicketsCount}  |  Résolus/Fermés : ${resolvedTicketsCount}  |  Taux résolution : ${resolutionRate}%`, 14, 30);

      if (ticketsByWeek.length > 0) {
        autoTable(doc, {
          startY: 36,
          head: [["Semaine", "Ouverts", "Fermés"]],
          body: ticketsByWeek.map((w) => [w.semaine, String(w.ouverts), String(w.fermes)]),
          theme: "grid",
          headStyles: { fillColor: [0, 150, 200] },
        });
      }

      const afterSupport = (doc as any).lastAutoTable?.finalY || 80;
      if (tickets.length > 0) {
        autoTable(doc, {
          startY: afterSupport + 6,
          head: [["Réf.", "Client", "Sujet", "Priorité", "Statut"]],
          body: tickets.map((t) => [t.reference, t.clientNom, t.sujet, t.priorite, t.statut]),
          theme: "striped",
          headStyles: { fillColor: [0, 150, 200] },
          styles: { fontSize: 8 },
        });
      }

      doc.save(`rapport-mba-${now.replace(/\//g, "-")}.pdf`);
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
              <p className="text-white/60 text-sm">Données analytiques 2026</p>
            </div>
            <div className="flex flex-wrap gap-2 self-start">
              <AIContextButton
                label="Analyse IA"
                context={`analyse - CA total: ${totalCA}€, Encaissements: ${totalEncaissements}€, ${totalDossiers} dossiers, ${totalNouveauxClients} nouveaux clients. Factures: ${factures.filter(f => f.statut === "payee").length} payées, ${factures.filter(f => f.statut === "en_retard").length} en retard.`}
                prompt="Analyse les données financières et commerciales. Identifie les tendances, les points forts, les risques et propose des recommandations stratégiques concrètes."
              />
              <button
                onClick={exportPDF}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                PDF
              </button>
              <button
                onClick={() => {
                  exportCsv("factures.csv",
                    ["Référence", "Client", "Montant", "Statut", "Date émission", "Échéance"],
                    factures.map((f) => [f.reference, f.clientNom, `${f.montant}`, f.statut, f.dateEmission, f.dateEcheance])
                  );
                  toast.success("Export factures CSV téléchargé");
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#e4e8df] text-[#4a5e46] text-xs sm:text-sm font-medium hover:bg-[#f0fdf4] hover:border-[#22c55e] hover:text-[#16a34a] transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" /> <span className="hidden sm:inline">Factures</span><span className="sm:hidden">Fact.</span>
              </button>
              <button
                onClick={() => {
                  exportCsv("demandes.csv",
                    ["Référence", "Client", "Titre", "Type prestation", "Statut", "Date création"],
                    demandes.map((d) => [d.reference, d.clientNom, d.titre, d.typePrestation, d.statut, d.dateCreation])
                  );
                  toast.success("Export demandes CSV téléchargé");
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#e4e8df] text-[#4a5e46] text-xs sm:text-sm font-medium hover:bg-[#f0fdf4] hover:border-[#22c55e] hover:text-[#16a34a] transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" /> <span className="hidden sm:inline">Demandes</span><span className="sm:hidden">Dem.</span>
              </button>
              <button
                onClick={() => {
                  exportCsv("clients.csv",
                    ["Nom", "Prénom", "Email", "Entreprise", "Statut", "Date création", "Nb dossiers"],
                    clients.map((c) => [c.nom, c.prenom, c.email, c.entreprise, c.statut, c.dateCreation, `${c.nombreDossiers}`])
                  );
                  toast.success("Export clients CSV téléchargé");
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#e4e8df] text-[#4a5e46] text-xs sm:text-sm font-medium hover:bg-[#f0fdf4] hover:border-[#22c55e] hover:text-[#16a34a] transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" /> <span className="hidden sm:inline">Clients</span><span className="sm:hidden">Cli.</span>
              </button>
              <button
                onClick={() => {
                  const headers = ["Mois", ...CATS.flatMap((c) => [`${c} (CA)`, `${c} (Nb)`]), "Total CA", "Total Nb", "Panier moyen"];
                  const rows = ventesParType.map((row) => {
                    const totalCa = CATS.reduce((s, c) => s + ((row[c] as number) || 0), 0);
                    const totalNb = CATS.reduce((s, c) => s + ((row[c + "_n"] as number) || 0), 0);
                    return [
                      row.mois as string,
                      ...CATS.flatMap((c) => [`${(row[c] as number) || 0}`, `${(row[c + "_n"] as number) || 0}`]),
                      `${totalCa}`,
                      `${totalNb}`,
                      totalNb > 0 ? `${Math.round(totalCa / totalNb)}` : "0",
                    ];
                  });
                  exportCsv("ventes-par-type.csv", headers, rows);
                  toast.success("Export ventes par type CSV téléchargé");
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#e4e8df] text-[#4a5e46] text-xs sm:text-sm font-medium hover:bg-[#f0fdf4] hover:border-[#22c55e] hover:text-[#16a34a] transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" /> <span className="hidden sm:inline">Ventes/Type</span><span className="sm:hidden">V/T</span>
              </button>
            </div>
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
          {hasData ? (
            <>
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
                      {dataWithObjectifs.map((d) => (
                        <tr key={d.mois} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                          <td className="py-2 px-3 font-medium">{d.mois}</td>
                          <td className="py-2 px-3 text-right">
                            {editingMonth === d.mois ? (
                              <div className="flex items-center justify-end gap-1">
                                <Input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") cancelEdit(); }}
                                  className="h-7 w-28 text-right text-xs"
                                  autoFocus
                                />
                                <button onClick={confirmEdit} className="p-1 text-green-400 hover:text-green-300"><Check className="h-3.5 w-3.5" /></button>
                                <button onClick={cancelEdit} className="p-1 text-red-400 hover:text-red-300"><X className="h-3.5 w-3.5" /></button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEdit(d.mois)}
                                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
                              >
                                {d.objectif.toLocaleString()} €
                                <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            )}
                          </td>
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
                    <LineChart data={dataWithObjectifs}>
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
                    <BarChart data={dataWithObjectifs}>
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

              {/* Ventes par type de projet */}
              <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
                <h3 className="text-sm font-semibold mb-4">Ventes par type de projet (mensuel)</h3>
                <div className="h-56 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ventesParType}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                      <XAxis dataKey="mois" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} />
                      <YAxis tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} width={isMobile ? 35 : 60} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: tickFontSize }} />
                      {CATS.map((cat, i) => (
                        <Bar
                          key={cat}
                          dataKey={cat}
                          name={cat}
                          stackId="a"
                          fill={catColors[cat] || `hsl(${(i * 60) % 360}, 70%, 55%)`}
                          radius={i === CATS.length - 1 ? [4, 4, 0, 0] : undefined}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Tableau récapitulatif ventes par type */}
              <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
                <h3 className="text-sm font-semibold mb-4">Récapitulatif par type de projet</h3>
                <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">Mois</th>
                        {CATS.map((cat) => (
                          <th key={cat} className="text-center py-2 px-1 text-muted-foreground font-medium" colSpan={2}>
                            <span className="text-xs">{cat}</span>
                          </th>
                        ))}
                        <th className="text-right py-2 px-2 text-muted-foreground font-medium">Total</th>
                      </tr>
                      <tr className="border-b border-border/30">
                        <th className="py-1 px-2" />
                        {CATS.map((cat) => (
                          <React.Fragment key={cat}>
                            <th className="text-center py-1 px-1 text-muted-foreground font-normal text-[10px]">CA</th>
                            <th className="text-center py-1 px-1 text-muted-foreground font-normal text-[10px]">Nb</th>
                          </React.Fragment>
                        ))}
                        <th className="py-1 px-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {ventesParType.map((row) => {
                        const totalMois = CATS.reduce((s, c) => s + ((row[c] as number) || 0), 0);
                        const totalNb = CATS.reduce((s, c) => s + ((row[c + "_n"] as number) || 0), 0);
                        return (
                          <tr key={row.mois as string} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                            <td className="py-2 px-2 font-medium">{row.mois as string}</td>
                            {CATS.map((cat) => (
                              <React.Fragment key={cat}>
                                <td className="py-2 px-1 text-center text-xs">
                                  {(row[cat] as number) > 0 ? `${((row[cat] as number) / 1000).toFixed(1)}k` : "–"}
                                </td>
                                <td className="py-2 px-1 text-center text-xs text-muted-foreground">
                                  {(row[cat + "_n"] as number) > 0 ? (row[cat + "_n"] as number) : "–"}
                                </td>
                              </React.Fragment>
                            ))}
                            <td className="py-2 px-2 text-right font-medium text-xs">
                              {totalMois > 0 ? `${(totalMois / 1000).toFixed(1)}k €` : "–"}
                              {totalNb > 0 && <span className="text-muted-foreground ml-1">({totalNb})</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-border/50 font-semibold">
                        <td className="py-2 px-2">Total</td>
                        {CATS.map((cat) => (
                          <React.Fragment key={cat}>
                            <td className="py-2 px-1 text-center text-xs">
                              {ventesTotaux[cat].ca > 0 ? `${(ventesTotaux[cat].ca / 1000).toFixed(1)}k` : "–"}
                            </td>
                            <td className="py-2 px-1 text-center text-xs text-muted-foreground">
                              {ventesTotaux[cat].count > 0 ? ventesTotaux[cat].count : "–"}
                            </td>
                          </React.Fragment>
                        ))}
                        <td className="py-2 px-2 text-right text-xs">
                          {(Object.values(ventesTotaux).reduce((s, v) => s + v.ca, 0) / 1000).toFixed(1)}k €
                          <span className="text-muted-foreground ml-1">({Object.values(ventesTotaux).reduce((s, v) => s + v.count, 0)})</span>
                        </td>
                      </tr>
                      <tr className="font-medium text-muted-foreground">
                        <td className="py-2 px-2 text-xs">Panier moyen</td>
                        {CATS.map((cat) => (
                          <React.Fragment key={cat}>
                            <td className="py-2 px-1 text-center text-xs" colSpan={2}>
                              {ventesTotaux[cat].count > 0
                                ? `${Math.round(ventesTotaux[cat].ca / ventesTotaux[cat].count).toLocaleString()} €`
                                : "–"}
                            </td>
                          </React.Fragment>
                        ))}
                        <td className="py-2 px-2 text-right text-xs">
                          {(() => {
                            const totalCa = Object.values(ventesTotaux).reduce((s, v) => s + v.ca, 0);
                            const totalCount = Object.values(ventesTotaux).reduce((s, v) => s + v.count, 0);
                            return totalCount > 0 ? `${Math.round(totalCa / totalCount).toLocaleString()} €` : "–";
                          })()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
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
            </>
          ) : (
            <motion.div className="glass-card p-8 text-center" variants={staggerItem}>
              <p className="text-muted-foreground text-sm">Aucune donnée mensuelle disponible. Les graphiques s'afficheront dès que l'activité commencera.</p>
            </motion.div>
          )}

          {/* ======= SECTION DEPENSES VS RECETTES ======= */}
          <motion.div variants={staggerItem} className="pt-4">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <ArrowDownUp className="h-5 w-5 text-primary" />
              Dépenses vs Recettes
            </h2>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Total dépenses" value={`${(totalDepenses / 1000).toFixed(0)}k €`} icon={TrendingUp} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Total recettes" value={`${(depensesVsRecettes.reduce((s, d) => s + d.recettes, 0) / 1000).toFixed(0)}k €`} icon={Euro} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Marge nette" value={`${(margeNette / 1000).toFixed(0)}k €`} icon={CheckCircle} trend={margeNette > 0 ? { value: Math.round((margeNette / Math.max(depensesVsRecettes.reduce((s, d) => s + d.recettes, 0), 1)) * 100), label: "marge" } : undefined} />
            </motion.div>
          </motion.div>

          {depensesVsRecettes.length > 0 && (
            <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
              <h3 className="text-sm font-semibold mb-4">Recettes vs Dépenses (mensuel)</h3>
              <div className="h-56 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={depensesVsRecettes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                    <XAxis dataKey="mois" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} />
                    <YAxis tick={{ fill: "hsl(250, 10%, 55%)", fontSize: tickFontSize }} width={isMobile ? 40 : 60} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: tickFontSize }} />
                    <Bar dataKey="recettes" name="Recettes €" fill="hsl(155, 100%, 45%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Bar dataKey="depenses" name="Dépenses €" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Line type="monotone" dataKey="recettes" name="Tendance recettes" stroke="hsl(155, 100%, 65%)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

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
              <DashboardKPI title="Validées" value={demandesStats.validees} icon={CheckCircle} trend={demandesStats.total > 0 ? { value: Math.round((demandesStats.validees / demandesStats.total) * 100), label: "taux" } : undefined} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="En revue" value={demandesStats.enRevue} icon={Clock} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Taux d'encaissement" value={`${totalCA > 0 ? Math.round((totalEncaissements / totalCA) * 100) : 0}%`} icon={Euro} />
            </motion.div>
          </motion.div>

          {/* Répartition paiements + demandes */}
          {(factures.length > 0 || demandes.length > 0) && (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerItem}>
              {factures.length > 0 && (
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
              )}
              {demandes.length > 0 && (
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
              )}
            </motion.div>
          )}

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
              <DashboardKPI title="Tickets ouverts" value={openTicketsCount} icon={LifeBuoy} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Temps réponse moyen" value={isDemo ? "4.4h" : "–"} icon={Clock} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Taux résolution" value={tickets.length > 0 ? `${resolutionRate}%` : "–"} icon={CheckCircle} />
            </motion.div>
          </motion.div>

          {/* Tickets ouverts/fermés par semaine */}
          {ticketsByWeek.length > 0 && (
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
          )}

          {/* Temps de réponse moyen */}
          {tempsReponseMoyen.length > 0 && (
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
          )}

          {/* Répartition par statut et priorité */}
          {tickets.length > 0 && (
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
          )}
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
