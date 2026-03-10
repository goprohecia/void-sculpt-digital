import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MariageOnboardingBanner } from "./MariageOnboardingBanner";
import {
  MOCK_DOSSIERS_MARIEE, MOCK_ESSAYAGES, MOCK_CONSEILLERES, MOCK_RETOUCHEUSES,
  MOCK_ROBES_STOCK, MARIAGE_STEPS, MARIAGE_KPIS,
} from "@/data/mockMariageData";
import {
  Heart, Users, Euro, CalendarDays, ShoppingBag,
  AlertTriangle, Scissors, UserCheck,
} from "lucide-react";

export function MariageDashboard() {
  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <MariageOnboardingBanner />

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Espace Admin Boutique
        </h1>
        <p className="text-muted-foreground text-sm">Vue globale des commandes, planning et facturation</p>
      </motion.div>

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" variants={staggerItem}>
        {[
          { icon: Heart, label: "En cours", value: MARIAGE_KPIS.commandesEnCours, color: "text-pink-400" },
          { icon: UserCheck, label: "Terminées", value: MARIAGE_KPIS.commandesTerminees, color: "text-emerald-400" },
          { icon: CalendarDays, label: "Essayages sem.", value: MARIAGE_KPIS.essayagesCetteSemaine, color: "text-violet-400" },
          { icon: Euro, label: "CA total", value: `${(MARIAGE_KPIS.caTotal / 1000).toFixed(1)}k€`, color: "text-primary" },
          { icon: Euro, label: "Acomptes reçus", value: `${(MARIAGE_KPIS.acomptesRecus / 1000).toFixed(1)}k€`, color: "text-emerald-400" },
          { icon: ShoppingBag, label: "Robes en stock", value: MARIAGE_KPIS.robesEnStock, color: "text-amber-400" },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass-card">
            <CardContent className="p-4 text-center">
              <kpi.icon className={`h-5 w-5 mx-auto mb-1 ${kpi.color}`} />
              <p className="text-xl font-bold">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Commandes par étape */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              Commandes en cours par étape
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_DOSSIERS_MARIEE.filter(d => d.etape < 8).map((d) => {
              const progress = Math.round(((d.etape - 1) / (MARIAGE_STEPS.length - 1)) * 100);
              const conseillere = MOCK_CONSEILLERES.find(c => c.id === d.conseillereId);
              return (
                <div key={d.id} className="p-4 rounded-lg border border-border/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{d.marieePrenom} {d.marieeNom}</p>
                      <p className="text-xs text-muted-foreground">{d.modeleChoisi}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-[10px]">{MARIAGE_STEPS[d.etape - 1]}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Mariage : {d.dateMariage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Conseillère : {conseillere?.prenom}</span>
                    <span>Reste : {d.resteDu.toLocaleString()} €</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Planning essayages */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Planning essayages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_ESSAYAGES.map((e) => {
              const cons = MOCK_CONSEILLERES.find(c => c.id === e.conseillereId);
              return (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{e.marieeNom}</p>
                    <p className="text-xs text-muted-foreground">Avec {cons?.prenom} {cons?.nom}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{e.date}</p>
                    <p className="text-xs text-muted-foreground">{e.heure}</p>
                    <Badge variant={e.type === "final" ? "default" : "secondary"} className="text-[10px] mt-1 capitalize">
                      {e.type === "decouverte" ? "Découverte" : e.type === "recuperation" ? "Récupération" : e.type}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Équipe */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Conseillères
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_CONSEILLERES.map((c) => {
              const nbDossiers = MOCK_DOSSIERS_MARIEE.filter(d => d.conseillereId === c.id && d.etape < 8).length;
              return (
                <div key={c.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{c.prenom} {c.nom}</p>
                    <p className="text-[10px] text-muted-foreground">{c.specialite}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{nbDossiers} mariée{nbDossiers > 1 ? "s" : ""}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Scissors className="h-4 w-4 text-primary" />
              Retoucheuses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_RETOUCHEUSES.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                <div>
                  <p className="text-sm font-medium">{r.prenom} {r.nom}</p>
                  <p className="text-[10px] text-muted-foreground">{r.specialite}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Facturation alertes */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" />
              Facturation — Soldes restants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_DOSSIERS_MARIEE.filter(d => d.resteDu > 0).map((d) => {
              const isLate = new Date(d.dateLimitePaiement) < new Date("2026-04-01");
              return (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{d.marieePrenom} {d.marieeNom}</p>
                    <p className="text-xs text-muted-foreground">{d.modeleChoisi.split("—")[0].trim()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{d.resteDu.toLocaleString()} €</p>
                    <p className={`text-[10px] ${isLate ? "text-destructive" : "text-muted-foreground"}`}>
                      {isLate && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                      Échéance : {d.dateLimitePaiement}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stock robes */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              Stock robes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {MOCK_ROBES_STOCK.map((r) => (
                <div key={r.id} className="p-3 rounded-lg border border-border/30 text-center space-y-1">
                  <p className="text-xs font-medium">{r.modele}</p>
                  <p className="text-[10px] text-muted-foreground">T{r.taille} · {r.couleur}</p>
                  <p className="text-sm font-medium">{r.prix.toLocaleString()} €</p>
                  <Badge
                    variant={r.statut === "disponible" ? "secondary" : r.statut === "reserve" ? "outline" : "default"}
                    className="text-[10px]"
                  >
                    {r.statut === "disponible" ? "Disponible" : r.statut === "reserve" ? "Réservée" : "Vendue"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
