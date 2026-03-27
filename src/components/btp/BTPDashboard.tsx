import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { HardHat, FileText, Receipt, AlertTriangle, Euro, ArrowRight, Plus, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_CHANTIERS, BTP_STEPS, MOCK_PLANNING_SEMAINE } from "@/data/mockBTPData";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import { Badge } from "@/components/ui/badge";

export function BTPDashboard() {
  const [chantiers] = useState(MOCK_CHANTIERS);

  const enCours = chantiers.filter((c) => c.etape === 3).length;
  const devisEnAttente = chantiers.filter((c) => c.etape === 0).length;
  const facturesImpayees = chantiers.filter((c) => c.etape === 5).length;
  const caTotal = chantiers.filter((c) => c.etape >= 1).reduce((sum, c) => sum + c.montantTTC, 0);

  // Alertes: devis envoyé > 5 jours sans réponse
  const today = new Date("2026-03-10");
  const alertesDevis = chantiers.filter((c) => {
    if (c.etape !== 0) return false;
    const d = c.stepDates[0];
    if (!d) return false;
    return (today.getTime() - new Date(d).getTime()) / (1000 * 60 * 60 * 24) > 5;
  });

  return (
    <>
      <SectorOnboardingBanner />

      <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
        <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" variants={staggerItem}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span>🏗️</span> Espace Dirigeant
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble des chantiers</p>
          </div>
          <Link
            to="/admin/dossiers"
            className="glass-card px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:border-primary/40 transition-colors w-fit"
          >
            <Plus className="h-4 w-4 text-primary" />
            Nouveau chantier
          </Link>
        </motion.div>

        {/* KPIs */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <DashboardKPI title="Chantiers en cours" value={enCours} icon={HardHat} iconColor="blue" />
          </motion.div>
          <motion.div variants={staggerItem}>
            <DashboardKPI title="Devis en attente" value={devisEnAttente} icon={FileText} iconColor="amber" />
          </motion.div>
          <motion.div variants={staggerItem}>
            <DashboardKPI title="Factures impayées" value={facturesImpayees} icon={Receipt} iconColor="violet" />
          </motion.div>
          <motion.div variants={staggerItem}>
            <DashboardKPI title="CA signé" value={`${(caTotal / 1000).toFixed(1)}k €`} icon={Euro} iconColor="emerald" />
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={staggerItem}>
          {/* Planning semaine */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-primary" />
              Planning semaine
            </h3>
            <div className="space-y-3">
              {MOCK_PLANNING_SEMAINE.map((j) => (
                <div key={j.jour}>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{j.jour}</p>
                  {j.chantiers.map((ch) => (
                    <div key={ch.id + ch.heure} className="flex items-center gap-3 text-sm ml-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground w-24 shrink-0">{ch.heure}</span>
                      <div className="flex-1">
                        <p className="text-xs">{ch.label}</p>
                        <p className="text-[10px] text-muted-foreground">{ch.equipe}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Alertes */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Alertes
            </h3>
            {alertesDevis.length > 0 ? (
              <div className="space-y-2">
                {alertesDevis.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-medium">{c.clientNom}</p>
                      <p className="text-xs text-muted-foreground">Devis en attente depuis + de 5 jours — {c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune alerte pour le moment.</p>
            )}

            {facturesImpayees > 0 && (
              <div className="mt-3 space-y-2">
                {chantiers.filter((c) => c.etape === 5).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <Receipt className="h-4 w-4 text-rose-400 shrink-0" />
                    <div>
                      <p className="font-medium">{c.clientNom}</p>
                      <p className="text-xs text-muted-foreground">Facture de {c.montantTTC.toLocaleString()} € en attente</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Pipeline */}
        <motion.div variants={staggerItem}>
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Pipeline chantiers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {BTP_STEPS.map((step, i) => {
                const count = chantiers.filter((c) => c.etape === i).length;
                return (
                  <div key={step} className="text-center p-3 rounded-xl bg-muted/20 border border-border/30">
                    <p className="text-lg font-bold">{count}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-1">{step}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Link
            to="/admin/dossiers"
            className="glass-card p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HardHat className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Voir tous les chantiers</p>
                <p className="text-xs text-muted-foreground">{chantiers.length} chantiers au total</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
