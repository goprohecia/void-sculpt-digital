import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import {
  MOCK_AFFAIRES, MOCK_AUDIENCES, MOCK_COLLABORATEURS, MOCK_TACHES,
  AVOCAT_STEPS, AVOCAT_KPIS,
} from "@/data/mockAvocatData";
import {
  Scale, Users, Euro, CalendarDays, Briefcase,
  AlertTriangle, UserCheck, Clock,
} from "lucide-react";

export function AvocatDashboard() {
  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <SectorOnboardingBanner />

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          Espace Cabinet
        </h1>
        <p className="text-muted-foreground text-sm">Vue globale des affaires, audiences et honoraires</p>
      </motion.div>

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" variants={staggerItem}>
        {[
          { icon: Briefcase, label: "Actives", value: AVOCAT_KPIS.affairesActives, color: "text-primary" },
          { icon: UserCheck, label: "Clôturées", value: AVOCAT_KPIS.affairesClôturees, color: "text-emerald-400" },
          { icon: CalendarDays, label: "Audiences sem.", value: AVOCAT_KPIS.audiencesCetteSemaine, color: "text-violet-400" },
          { icon: Euro, label: "Honoraires", value: `${(AVOCAT_KPIS.honorairesTotaux / 1000).toFixed(1)}k€`, color: "text-primary" },
          { icon: Euro, label: "Encaissés", value: `${(AVOCAT_KPIS.honorairesEncaisses / 1000).toFixed(1)}k€`, color: "text-emerald-400" },
          { icon: Euro, label: "Restants", value: `${(AVOCAT_KPIS.honorairesRestants / 1000).toFixed(1)}k€`, color: "text-amber-400" },
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

      {/* Affaires par avocat */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Charge de travail par collaborateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_COLLABORATEURS.map((collab) => {
              const affaires = MOCK_AFFAIRES.filter(a => a.avocatId === collab.id && a.etape < 8);
              const taches = MOCK_TACHES.filter(t => affaires.some(a => a.id === t.affaireId) && t.statut !== "fait");
              return (
                <div key={collab.id} className="p-3 rounded-lg border border-border/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{collab.prenom} {collab.nom}</p>
                      <p className="text-xs text-muted-foreground">{collab.specialite} · Barreau de {collab.barreau}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-[10px]">{affaires.length} affaire{affaires.length > 1 ? "s" : ""}</Badge>
                      <Badge variant="outline" className="text-[10px]">{taches.length} tâche{taches.length > 1 ? "s" : ""}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Affaires actives */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Affaires actives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_AFFAIRES.filter(a => a.etape < 8).map((a) => {
              const progress = Math.round(((a.etape - 1) / (AVOCAT_STEPS.length - 1)) * 100);
              const avocat = MOCK_COLLABORATEURS.find(c => c.id === a.avocatId);
              return (
                <div key={a.id} className="p-4 rounded-lg border border-border/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{a.clientPrenom} {a.clientNom}</p>
                      <p className="text-xs text-muted-foreground">{a.typeLitige}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-[10px]">{AVOCAT_STEPS[a.etape - 1]}</Badge>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{a.reference}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Avocat : {avocat?.prenom}</span>
                    <span>Échéance : {a.prochaineEcheance}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Audiences à venir */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Audiences à venir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_AUDIENCES.map((aud) => {
              const avocat = MOCK_COLLABORATEURS.find(c => c.id === aud.avocatId);
              return (
                <div key={aud.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{aud.clientNom}</p>
                    <p className="text-xs text-muted-foreground">{aud.juridiction}</p>
                    <p className="text-[10px] text-muted-foreground">Avec {avocat?.prenom} {avocat?.nom}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{aud.date}</p>
                    <p className="text-xs text-muted-foreground">{aud.heure}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1">{aud.type}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Facturation honoraires */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" />
              Honoraires — Provisions & Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_AFFAIRES.map((a) => {
              const restant = a.honorairesFactures - a.honorairesPaies;
              return (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{a.clientPrenom} {a.clientNom}</p>
                    <p className="text-xs text-muted-foreground">Provision : {a.honorairesProvision.toLocaleString()} €</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Facturé : {a.honorairesFactures.toLocaleString()} €</p>
                    <p className={`text-sm font-bold ${restant > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                      {restant > 0 ? `Dû : ${restant.toLocaleString()} €` : "Soldé"}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
