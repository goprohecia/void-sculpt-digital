import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AutoEcoleOnboardingBanner } from "./AutoEcoleOnboardingBanner";
import {
  MOCK_ELEVES, MOCK_MONITEURS, MOCK_LECONS,
  AUTO_ECOLE_KPIS, AUTO_ECOLE_STEPS,
} from "@/data/mockAutoEcoleData";
import {
  Car, Users, TrendingUp, Euro, Clock, CalendarDays,
  GraduationCap, AlertTriangle, CheckCircle2, FileText,
} from "lucide-react";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const HEURES = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

export function AutoEcoleDashboard() {
  const [selectedMoniteur, setSelectedMoniteur] = useState<string | null>(null);
  const moniteurs = MOCK_MONITEURS.filter((m) => m.statut === "actif");
  const nephEnAttente = MOCK_ELEVES.filter((e) => e.nephStatut === "en_attente");

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <AutoEcoleOnboardingBanner />

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          Espace Directeur
        </h1>
        <p className="text-muted-foreground text-sm">Dashboard, planning moniteurs et gestion des dossiers</p>
      </motion.div>

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" variants={staggerItem}>
        {[
          { icon: Users, label: "Élèves actifs", value: AUTO_ECOLE_KPIS.elevesActifs, color: "text-blue-400" },
          { icon: GraduationCap, label: "Réussite code", value: `${AUTO_ECOLE_KPIS.tauxReussiteCode}%`, color: "text-emerald-400" },
          { icon: Car, label: "Réussite conduite", value: `${AUTO_ECOLE_KPIS.tauxReussiteConduite}%`, color: "text-violet-400" },
          { icon: Euro, label: "CA mensuel", value: `${(AUTO_ECOLE_KPIS.caMensuel / 1000).toFixed(1)}k€`, color: "text-primary" },
          { icon: Clock, label: "Heures à vendre", value: AUTO_ECOLE_KPIS.heuresRestantesAVendre, color: "text-amber-400" },
          { icon: FileText, label: "NEPH en attente", value: AUTO_ECOLE_KPIS.dossiersNephEnAttente, color: nephEnAttente.length > 0 ? "text-red-400" : "text-muted-foreground" },
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

      {/* NEPH Alerts */}
      {nephEnAttente.length > 0 && (
        <motion.div variants={staggerItem}>
          <Card className="glass-card border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Dossiers NEPH en attente ({nephEnAttente.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {nephEnAttente.map((eleve) => {
                const jours = Math.floor((Date.now() - new Date(eleve.dateInscription).getTime()) / 86400000);
                return (
                  <div key={eleve.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
                    <div>
                      <p className="text-sm font-medium">{eleve.prenom} {eleve.nom}</p>
                      <p className="text-xs text-muted-foreground">Inscrit le {eleve.dateInscription}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={jours > 7 ? "destructive" : "secondary"} className="text-[10px]">
                        {jours}j en attente
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Planning moniteurs */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Planning moniteurs — Semaine du 10/03
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-muted-foreground">Moniteur</th>
                    {JOURS.map((j) => (
                      <th key={j} className="text-center p-2 text-muted-foreground">{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {moniteurs.map((m) => {
                    const lecons = MOCK_LECONS.filter((l) => l.moniteurId === m.id);
                    return (
                      <tr key={m.id} className="border-t border-border/20">
                        <td className="p-2">
                          <p className="font-medium">{m.prenom} {m.nom}</p>
                          <p className="text-muted-foreground">{m.vehicule}</p>
                        </td>
                        {JOURS.map((_, ji) => {
                          const dayLecons = lecons.filter((l) => {
                            const d = new Date(l.date);
                            return d.getDay() === (ji + 1); // Mon=1
                          });
                          return (
                            <td key={ji} className="p-1 text-center">
                              {dayLecons.length > 0 ? (
                                <div className="space-y-1">
                                  {dayLecons.map((dl) => (
                                    <div key={dl.id} className="bg-primary/10 rounded px-1 py-0.5 text-[10px]">
                                      {dl.heure} {dl.eleveNom.split(" ")[0]}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground/30">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Élèves list */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Dossiers élèves
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_ELEVES.map((e) => {
              const progress = Math.round(((e.etape - 1) / (AUTO_ECOLE_STEPS.length - 1)) * 100);
              return (
                <div key={e.id} className="p-3 rounded-lg border border-border/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{e.prenom} {e.nom}</p>
                      <p className="text-xs text-muted-foreground">{e.forfait} · Moniteur : {MOCK_MONITEURS.find((m) => m.id === e.moniteurId)?.prenom}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-[10px]">{AUTO_ECOLE_STEPS[e.etape - 1]}</Badge>
                      <p className="text-xs mt-1">{e.heuresEffectuees}/{e.heuresForfait}h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground">{progress}%</span>
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
