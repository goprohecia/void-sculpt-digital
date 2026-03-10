import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConsultantOnboardingBanner } from "./ConsultantOnboardingBanner";
import { ConsultantStepper } from "./ConsultantStepper";
import {
  CONSULTANT_KPIS, CONSULTANT_STEPS, MOCK_CONSULTANT_MISSIONS, MOCK_CONSULTANT_EQUIPE,
} from "@/data/mockConsultantData";
import {
  Briefcase, Euro, Users, TrendingUp, Target, Trophy, XCircle, UserCheck,
} from "lucide-react";

export function ConsultantDashboard() {
  const [tab, setTab] = useState<"missions" | "equipe" | "facturation">("missions");

  const kpiCards = [
    { title: "Missions actives", value: CONSULTANT_KPIS.missionsActives, icon: Briefcase, color: "text-blue-400" },
    { title: "CA total", value: `${CONSULTANT_KPIS.caTotal.toLocaleString()} €`, icon: Euro, color: "text-green-400" },
    { title: "Taux d'occupation", value: `${CONSULTANT_KPIS.tauxOccupation}%`, icon: TrendingUp, color: "text-amber-400" },
    { title: "Consultants actifs", value: CONSULTANT_KPIS.consultantsActifs, icon: Users, color: "text-violet-400" },
  ];

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}><ConsultantOnboardingBanner /></motion.div>

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" /> Espace Direction
        </h1>
        <p className="text-muted-foreground text-sm">
          <Trophy className="inline h-3.5 w-3.5 mr-1 text-green-400" />{CONSULTANT_KPIS.missionsGagnees} gagnées · <XCircle className="inline h-3.5 w-3.5 mr-1 text-destructive" />{CONSULTANT_KPIS.missionsPerdues} perdue(s)
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

      <motion.div variants={staggerItem} className="flex gap-2">
        {([
          { key: "missions", label: "Missions", icon: Target },
          { key: "equipe", label: "Équipe", icon: UserCheck },
          { key: "facturation", label: "Facturation", icon: Euro },
        ] as const).map((t) => (
          <Button key={t.key} size="sm" variant={tab === t.key ? "default" : "outline"} onClick={() => setTab(t.key)} className="gap-1">
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </Button>
        ))}
      </motion.div>

      {tab === "missions" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Portefeuille missions</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Consultant</TableHead>
                    <TableHead>Étape</TableHead>
                    <TableHead className="text-right">CA</TableHead>
                    <TableHead>Prochaine fact.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_CONSULTANT_MISSIONS.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{m.clientNom}</p>
                        <p className="text-xs text-muted-foreground">{m.objet}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.consultantAssigne}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{CONSULTANT_STEPS[m.etape] || CONSULTANT_STEPS[0]}</Badge></TableCell>
                      <TableCell className="text-right text-sm font-medium">{m.ca.toLocaleString()} €</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.prochaineFact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {tab === "equipe" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Équipe de consultants</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_CONSULTANT_EQUIPE.map((c) => (
                <div key={c.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{c.nom}</p>
                    <p className="text-xs text-muted-foreground">{c.poste} · {c.missionsActives} mission(s)</p>
                  </div>
                  <div className="text-right space-y-1 w-32">
                    <p className="text-xs text-muted-foreground">Occupation {c.tauxOccupation}%</p>
                    <Progress value={c.tauxOccupation} className="h-1.5" />
                    <p className="text-sm font-semibold">{c.ca.toLocaleString()} €</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {tab === "facturation" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Facturation par mission</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_CONSULTANT_MISSIONS.filter((m) => m.etape >= 2).map((m) => (
                <div key={m.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{m.clientNom}</p>
                    <p className="text-xs text-muted-foreground">{m.objet}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{m.ca.toLocaleString()} €</p>
                    <p className="text-xs text-muted-foreground">Prochaine : {m.prochaineFact}</p>
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
