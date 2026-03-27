import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import {
  SPORT_KPIS, MOCK_SPORT_MEMBRES, MOCK_SPORT_COACHS, MOCK_SPORT_COURS,
} from "@/data/mockSportData";
import {
  Dumbbell, Users, Euro, TrendingUp, CalendarDays, UserCheck, Clock,
} from "lucide-react";

export function SportDashboard() {
  const [tab, setTab] = useState<"abonnements" | "cours" | "coachs">("abonnements");

  const kpiCards = [
    { title: "Membres actifs", value: SPORT_KPIS.membresActifs, icon: Users, color: "text-blue-400" },
    { title: "Revenus abonnements", value: `${SPORT_KPIS.revenusAbonnements.toLocaleString()} €`, icon: Euro, color: "text-green-400" },
    { title: "Taux de rétention", value: `${SPORT_KPIS.tauxRetention}%`, icon: TrendingUp, color: "text-violet-400" },
    { title: "Coachs actifs", value: SPORT_KPIS.coachsActifs, icon: UserCheck, color: "text-amber-400" },
  ];

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}><SectorOnboardingBanner /></motion.div>

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" /> Espace Gérant
        </h1>
        <p className="text-muted-foreground text-sm">
          {SPORT_KPIS.coursCollectifsSemaine} cours collectifs · {SPORT_KPIS.seancesPersoSemaine} séances perso / semaine
        </p>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map((k) => (
          <Card key={k.title}>
            <CardContent className="p-4 flex items-center gap-3">
              <k.icon className={`h-5 w-5 ${k.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{k.title}</p>
                <p className="text-lg font-bold">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="flex gap-2 flex-wrap">
        {([
          { key: "abonnements", label: "Abonnements", icon: Users },
          { key: "cours", label: "Cours collectifs", icon: CalendarDays },
          { key: "coachs", label: "Coachs", icon: UserCheck },
        ] as const).map((t) => (
          <Button key={t.key} size="sm" variant={tab === t.key ? "default" : "outline"} onClick={() => setTab(t.key)} className="gap-1">
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </Button>
        ))}
      </motion.div>

      {tab === "abonnements" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Gestion abonnements</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Renouvellement</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SPORT_MEMBRES.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium text-sm">{m.nom}</TableCell>
                      <TableCell className="text-sm capitalize">{m.abonnement}</TableCell>
                      <TableCell className="text-sm">{m.dateFin}</TableCell>
                      <TableCell className="text-sm">{m.renouvellementAuto ? "Auto" : "Manuel"}</TableCell>
                      <TableCell>
                        <Badge variant={m.statut === "actif" ? "default" : m.statut === "expire" ? "destructive" : "secondary"} className="text-xs capitalize">
                          {m.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {tab === "cours" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Planning cours collectifs</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_SPORT_COURS.map((c) => {
                const pct = Math.round((c.inscrits / c.capacite) * 100);
                return (
                  <div key={c.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{c.nom}</p>
                        <p className="text-xs text-muted-foreground">{c.jour} {c.heure} · {c.duree} min · {c.coach}</p>
                      </div>
                      <Badge variant={pct >= 100 ? "destructive" : pct >= 80 ? "secondary" : "default"} className="text-xs">
                        {c.inscrits}/{c.capacite}
                      </Badge>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {tab === "coachs" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Équipe coaching</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_SPORT_COACHS.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{c.nom}</p>
                    <p className="text-xs text-muted-foreground">{c.specialite}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{c.membresAssignes} membres</p>
                    <p className="text-xs text-muted-foreground">{c.seancesSemaine} séances/sem.</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
