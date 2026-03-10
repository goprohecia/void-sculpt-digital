import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { Car, Wrench, Clock, CheckCircle, CalendarDays, AlertTriangle, ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_VEHICULES, MOCK_GARAGE_RDV, GARAGE_STEPS } from "@/data/mockGarageData";
import { GarageOnboardingBanner } from "./GarageOnboardingBanner";

export function GarageDashboard() {
  const [vehicules] = useState(MOCK_VEHICULES);

  const recus = vehicules.filter((v) => v.etape === 0).length;
  const enDiag = vehicules.filter((v) => v.etape === 1).length;
  const enReparation = vehicules.filter((v) => v.etape >= 2 && v.etape <= 4).length;
  const prets = vehicules.filter((v) => v.etape === 5).length;

  // Alertes: devis envoyé il y a plus de 2 jours sans acceptation
  const today = new Date("2026-03-10");
  const alertesDevis = vehicules.filter((v) => {
    if (v.etape !== 2) return false;
    const devisDate = v.stepDates[2];
    if (!devisDate) return false;
    const diff = (today.getTime() - new Date(devisDate).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 2;
  });

  return (
    <>
      <GarageOnboardingBanner />

      <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
        {/* Header */}
        <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" variants={staggerItem}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span>🔧</span> Espace Réceptionniste
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de l'atelier</p>
          </div>
          <Link
            to="/admin/dossiers"
            className="glass-card px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:border-primary/40 transition-colors w-fit"
          >
            <Plus className="h-4 w-4 text-primary" />
            Nouveau véhicule
          </Link>
        </motion.div>

        {/* KPIs */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <DashboardKPI title="Véhicules reçus" value={recus} icon={Car} iconColor="blue" />
          </motion.div>
          <motion.div variants={staggerItem}>
            <DashboardKPI title="En diagnostic" value={enDiag} icon={Clock} iconColor="amber" />
          </motion.div>
          <motion.div variants={staggerItem}>
            <DashboardKPI title="En réparation" value={enReparation} icon={Wrench} iconColor="violet" />
          </motion.div>
          <motion.div variants={staggerItem}>
            <DashboardKPI title="Prêts à récupérer" value={prets} icon={CheckCircle} iconColor="emerald" />
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={staggerItem}>
          {/* RDV du jour */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-primary" />
              Rendez-vous du jour
            </h3>
            <div className="space-y-3">
              {MOCK_GARAGE_RDV.map((rdv, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-xs font-mono text-muted-foreground w-12">{rdv.heure}</span>
                  <div className="flex-1">
                    <p className="font-medium">{rdv.clientNom}</p>
                    <p className="text-xs text-muted-foreground">{rdv.motif} — {rdv.immatriculation}</p>
                  </div>
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
                {alertesDevis.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-medium text-amber-200">{v.immatriculation} — {v.clientNom}</p>
                      <p className="text-xs text-muted-foreground">Devis en attente depuis + de 48h</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune alerte pour le moment.</p>
            )}
          </div>
        </motion.div>

        {/* Lien vers liste */}
        <motion.div variants={staggerItem}>
          <Link
            to="/admin/dossiers"
            className="glass-card p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Voir tous les véhicules</p>
                <p className="text-xs text-muted-foreground">{vehicules.length} véhicules au total</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
