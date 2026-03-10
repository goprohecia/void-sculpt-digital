import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SportStepper } from "./SportStepper";
import {
  MOCK_SPORT_MEMBRES, MOCK_SPORT_COURS, MOCK_SPORT_MEMBER_SEANCES, SPORT_STEPS,
} from "@/data/mockSportData";
import {
  Dumbbell, CreditCard, CalendarDays, TrendingDown, Clock, Star, ChevronDown, ChevronUp,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { toast } from "sonner";

export function SportMembreView() {
  const [showCours, setShowCours] = useState(false);

  // Simulate current member = sm1
  const membre = MOCK_SPORT_MEMBRES[0];
  const poidsData = membre.poids.map((p, i) => ({ mois: `M${i + 1}`, poids: p }));

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" /> Espace Membre
        </h1>
        <p className="text-muted-foreground text-sm">Bienvenue, {membre.nom}</p>
      </motion.div>

      {/* Abonnement */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Mon abonnement</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium capitalize">Abonnement {membre.abonnement}</p>
                <p className="text-xs text-muted-foreground">Du {membre.dateDebut} au {membre.dateFin}</p>
              </div>
              <Badge variant={membre.statut === "actif" ? "default" : "destructive"} className="capitalize">{membre.statut}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Renouvellement : {membre.renouvellementAuto ? "Automatique ✓" : "Manuel — pensez à renouveler"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stepper */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base">Mon parcours</CardTitle></CardHeader>
          <CardContent>
            <SportStepper currentStep={membre.etape} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Cours collectifs */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Cours collectifs</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setShowCours(!showCours)}>
              {showCours ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>
          {showCours && (
            <CardContent className="space-y-2">
              {MOCK_SPORT_COURS.map((c) => {
                const full = c.inscrits >= c.capacite;
                return (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded border">
                    <div>
                      <p className="text-sm font-medium">{c.nom}</p>
                      <p className="text-xs text-muted-foreground">{c.jour} {c.heure} · {c.duree} min · {c.coach}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={full ? "destructive" : "secondary"} className="text-xs">
                        {c.inscrits}/{c.capacite}
                      </Badge>
                      <Button size="sm" variant="outline" disabled={full} onClick={() => toast.success(`Inscrit au cours ${c.nom} (mock)`)}>
                        {full ? "Complet" : "Réserver"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Suivi progression */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingDown className="h-4 w-4" /> Suivi progression</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Évolution du poids (kg)</p>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={poidsData}>
                    <XAxis dataKey="mois" tick={{ fontSize: 10 }} />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="poids" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            {membre.mensurations.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Dernières mensurations ({membre.mensurations[membre.mensurations.length - 1].date})</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Bras", val: membre.mensurations[membre.mensurations.length - 1].tour_bras },
                    { label: "Taille", val: membre.mensurations[membre.mensurations.length - 1].tour_taille },
                    { label: "Cuisses", val: membre.mensurations[membre.mensurations.length - 1].tour_cuisses },
                  ].map((m) => (
                    <div key={m.label} className="text-center p-2 rounded border">
                      <p className="text-lg font-bold">{m.val} cm</p>
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Objectifs</p>
              <div className="flex flex-wrap gap-2">
                {membre.objectifs.map((o) => (
                  <Badge key={o} variant="outline" className="text-xs">{o}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Historique séances */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Historique séances</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {MOCK_SPORT_MEMBER_SEANCES.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded border">
                <div>
                  <p className="text-sm font-medium">{s.date} — {s.type}</p>
                  <p className="text-xs text-muted-foreground">{s.coach} · {s.duree} min</p>
                </div>
                <p className="text-xs text-muted-foreground max-w-[180px] truncate">{s.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
