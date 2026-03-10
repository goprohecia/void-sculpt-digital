import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { Building2, Users, HandCoins, Euro, ArrowRight, Plus, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_BIENS, MOCK_AGENTS, IMMO_STEPS, MOCK_VISITES_RDV } from "@/data/mockImmobilierData";
import { ImmobilierOnboardingBanner } from "./ImmobilierOnboardingBanner";
import { Badge } from "@/components/ui/badge";

export function ImmobilierDashboard() {
  const [biens] = useState(MOCK_BIENS);

  const mandatsActifs = biens.filter((b) => b.etape < 5).length;
  const enVisite = biens.filter((b) => b.etape === 2).length;
  const offresRecues = biens.filter((b) => b.etape >= 3 && b.etape < 5).length;
  const caCommissions = biens
    .filter((b) => b.type === "vente" && b.etape >= 3)
    .reduce((sum, b) => sum + Math.round(b.prix * 0.04), 0);

  const todayVisites = MOCK_VISITES_RDV.filter((v) => v.date === "2026-03-10");

  return (
    <>
      <ImmobilierOnboardingBanner />

      <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
        {/* Header */}
        <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" variants={staggerItem}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span>🏠</span> Espace Direction
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble du portefeuille</p>
          </div>
          <Link
            to="/admin/dossiers"
            className="glass-card px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:border-primary/40 transition-colors w-fit"
          >
            <Plus className="h-4 w-4 text-primary" />
            Nouveau mandat
          </Link>
        </motion.div>

        {/* KPIs */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <DashboardKPI title="Mandats actifs" value={mandatsActifs} icon={Building2} iconColor="blue" />
          </motion.div>
          <motion.div variants={staggerItem}>
            <DashboardKPI title="En visite" value={enVisite} icon={Users} iconColor="violet" />
          </motion.div>
          <motion.div variants={staggerItem}>
            <DashboardKPI title="Offres reçues" value={offresRecues} icon={HandCoins} iconColor="amber" />
          </motion.div>
          <motion.div variants={staggerItem}>
            <DashboardKPI title="Commissions prév." value={`${(caCommissions / 1000).toFixed(1)}k €`} icon={Euro} iconColor="emerald" />
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={staggerItem}>
          {/* Performance agents */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-primary" />
              Performance agents
            </h3>
            <div className="space-y-3">
              {MOCK_AGENTS.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{a.nom}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{a.nbMandats} mandats</span>
                    <Badge variant="secondary" className="text-[10px]">{a.tauxConversion}% conversion</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visites du jour */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-primary" />
              Visites du jour
            </h3>
            <div className="space-y-3">
              {todayVisites.length > 0 ? todayVisites.map((v, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-xs font-mono text-muted-foreground w-12">{v.heure}</span>
                  <div className="flex-1">
                    <p className="font-medium">{v.clientNom}</p>
                    <p className="text-xs text-muted-foreground">{v.adresse}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Aucune visite prévue aujourd'hui.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Pipeline kanban simplifié */}
        <motion.div variants={staggerItem}>
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Pipeline mandats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {IMMO_STEPS.map((step, i) => {
                const count = biens.filter((b) => b.etape === i).length;
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

        {/* Lien vers liste */}
        <motion.div variants={staggerItem}>
          <Link
            to="/admin/dossiers"
            className="glass-card p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Voir tous les mandats</p>
                <p className="text-xs text-muted-foreground">{biens.length} biens au total</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
