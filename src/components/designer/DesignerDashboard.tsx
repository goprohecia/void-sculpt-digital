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
  DESIGNER_KPIS, DESIGNER_STEPS, MOCK_DESIGNER_PROJETS, MOCK_DESIGNER_EQUIPE,
} from "@/data/mockDesignerData";
import {
  Palette, Euro, Users, Layers, CalendarDays, UserCheck,
} from "lucide-react";

export function DesignerDashboard() {
  const [tab, setTab] = useState<"projets" | "equipe" | "facturation">("projets");

  const kpiCards = [
    { title: "Projets en cours", value: DESIGNER_KPIS.projetsEnCours, icon: Layers, color: "text-blue-400" },
    { title: "Projets livrés", value: DESIGNER_KPIS.projetsLivres, icon: Palette, color: "text-green-400" },
    { title: "CA total", value: `${DESIGNER_KPIS.caTotal.toLocaleString()} €`, icon: Euro, color: "text-amber-400" },
    { title: "Soldes en attente", value: `${DESIGNER_KPIS.soldesEnAttente.toLocaleString()} €`, icon: Euro, color: "text-violet-400" },
  ];

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}><SectorOnboardingBanner /></motion.div>

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" /> Espace Studio
        </h1>
        <p className="text-muted-foreground text-sm">{DESIGNER_KPIS.projetsEnCours} projets actifs · {DESIGNER_KPIS.projetsLivres} livré(s) ce mois</p>
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
          { key: "projets", label: "Projets", icon: Layers },
          { key: "equipe", label: "Planning", icon: UserCheck },
          { key: "facturation", label: "Facturation", icon: Euro },
        ] as const).map((t) => (
          <Button key={t.key} size="sm" variant={tab === t.key ? "default" : "outline"} onClick={() => setTab(t.key)} className="gap-1">
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </Button>
        ))}
      </motion.div>

      {tab === "projets" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Projets en cours par designer</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Designer</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Étape</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_DESIGNER_PROJETS.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-sm">{p.clientNom}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.typeCreation}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.designerAssigne}</TableCell>
                      <TableCell>
                        <span className="text-sm">{p.deadline}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{DESIGNER_STEPS[p.etape] || DESIGNER_STEPS[0]}</Badge>
                      </TableCell>
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
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Planning charge — cette semaine</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_DESIGNER_EQUIPE.map((d) => (
                <div key={d.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{d.nom}</p>
                    <p className="text-xs text-muted-foreground">{d.specialite} · {d.projetsActifs} projet(s)</p>
                  </div>
                  <div className="text-right space-y-1 w-36">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Charge {d.chargeSemaine}%</span>
                      <Badge variant={d.disponible ? "default" : "secondary"} className="text-xs">
                        {d.disponible ? "Dispo" : "Occupé"}
                      </Badge>
                    </div>
                    <Progress value={d.chargeSemaine} className="h-1.5" />
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
            <CardHeader><CardTitle className="text-base">Facturation par projet</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_DESIGNER_PROJETS.map((p) => (
                <div key={p.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{p.clientNom}</p>
                    <p className="text-xs text-muted-foreground">{p.typeCreation}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-bold">{p.montant.toLocaleString()} €</p>
                    <p className="text-xs text-muted-foreground">
                      Acompte {p.acompte.toLocaleString()} € · Solde {p.solde.toLocaleString()} €
                    </p>
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
