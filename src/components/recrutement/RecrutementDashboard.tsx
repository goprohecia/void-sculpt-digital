import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import {
  MOCK_MISSIONS, MOCK_CANDIDATS, MOCK_ENTRETIENS,
  RECRUTEMENT_STEPS, RECRUTEMENT_KPIS,
} from "@/data/mockRecrutementData";
import {
  Briefcase, Users, TrendingUp, Clock, Euro, Target,
  CalendarDays, Building2, UserCheck, BarChart3,
} from "lucide-react";

export function RecrutementDashboard() {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const missionsActives = MOCK_MISSIONS.filter((m) => m.statut === "active");

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <SectorOnboardingBanner />

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Espace Direction
        </h1>
        <p className="text-muted-foreground text-sm">Portefeuille missions, KPIs et facturation</p>
      </motion.div>

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" variants={staggerItem}>
        {[
          { icon: Briefcase, label: "Missions actives", value: RECRUTEMENT_KPIS.missionsActives, color: "text-blue-400" },
          { icon: UserCheck, label: "Pourvues", value: RECRUTEMENT_KPIS.missionsPourvues, color: "text-emerald-400" },
          { icon: Target, label: "Taux transformation", value: `${RECRUTEMENT_KPIS.tauxTransformation}%`, color: "text-violet-400" },
          { icon: Clock, label: "Délai moyen", value: `${RECRUTEMENT_KPIS.delaiMoyenPlacement}j`, color: "text-amber-400" },
          { icon: Euro, label: "CA potentiel", value: `${(RECRUTEMENT_KPIS.caPotentiel / 1000).toFixed(0)}k€`, color: "text-primary" },
          { icon: TrendingUp, label: "CA réalisé", value: `${(RECRUTEMENT_KPIS.caRealise / 1000).toFixed(0)}k€`, color: "text-emerald-400" },
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

      {/* Missions actives */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Missions actives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {missionsActives.map((mission) => {
              const candidats = MOCK_CANDIDATS.filter((c) => c.missionId === mission.id);
              const avgStep = mission.etapeMoyenne;
              const progress = Math.round((avgStep / (RECRUTEMENT_STEPS.length - 1)) * 100);
              return (
                <div
                  key={mission.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedMission === mission.id ? "border-primary bg-primary/5" : "border-border/30 hover:border-primary/40"}`}
                  onClick={() => setSelectedMission(selectedMission === mission.id ? null : mission.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{mission.clientEntreprise}</span>
                        <span className="font-mono text-xs text-muted-foreground">{mission.reference}</span>
                      </div>
                      <p className="text-sm text-foreground font-medium">{mission.poste}</p>
                      <p className="text-xs text-muted-foreground">{mission.salaireFourchette} · {mission.typeContrat}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className="text-xs">{candidats.length} candidat{candidats.length > 1 ? "s" : ""}</Badge>
                      <p className="text-sm font-medium text-primary">{mission.honoraires.toLocaleString()} €</p>
                      <p className="text-[10px] text-muted-foreground">{mission.honorairesType === "pourcentage" ? "% salaire" : "forfait"}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-muted-foreground">Avancement moyen</span>
                      <span className="text-[11px] font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  {selectedMission === mission.id && (
                    <div className="mt-3 pt-3 border-t border-border/20 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Candidats :</p>
                      {candidats.map((c) => (
                        <div key={c.id} className="flex items-center justify-between text-xs">
                          <span>{c.prenom} {c.nom}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px]">{RECRUTEMENT_STEPS[c.etape - 1]}</Badge>
                            <span className="text-muted-foreground">Score: {c.scoring}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Facturation */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" />
              Facturation – Honoraires par mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MOCK_MISSIONS.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{m.poste}</p>
                    <p className="text-xs text-muted-foreground">{m.clientEntreprise}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{m.honoraires.toLocaleString()} €</p>
                    <Badge variant={m.statut === "pourvue" ? "default" : "secondary"} className="text-[10px]">
                      {m.statut === "pourvue" ? "Facturée" : "En cours"}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border/30 flex justify-between">
                <span className="text-sm font-medium">Total potentiel</span>
                <span className="text-sm font-bold text-primary">
                  {MOCK_MISSIONS.reduce((s, m) => s + m.honoraires, 0).toLocaleString()} €
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Prochains entretiens */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Prochains entretiens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_ENTRETIENS.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <p className="text-sm font-medium">{e.candidatNom}</p>
                  <p className="text-xs text-muted-foreground">{e.missionPoste} · {e.lieu}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{e.date}</p>
                  <p className="text-xs text-muted-foreground">{e.heure}</p>
                  <Badge variant={e.type === "client" ? "default" : "secondary"} className="text-[10px] mt-1">
                    {e.type === "client" ? "Chez le client" : "Au cabinet"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
