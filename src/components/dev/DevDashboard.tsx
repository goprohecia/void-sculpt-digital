import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DevOnboardingBanner } from "./DevOnboardingBanner";
import {
  DEV_KPIS, DEV_STEPS, MOCK_DEV_PROJETS, MOCK_DEV_EQUIPE,
} from "@/data/mockDevData";
import { Code, Euro, Layers, Clock, UserCheck } from "lucide-react";

export function DevDashboard() {
  const [tab, setTab] = useState<"projets" | "equipe">("projets");

  const kpiCards = [
    { title: "Projets actifs", value: DEV_KPIS.projetsActifs, icon: Layers, color: "text-blue-400" },
    { title: "CA total", value: `${DEV_KPIS.caTotal.toLocaleString()} €`, icon: Euro, color: "text-green-400" },
    { title: "À facturer", value: `${DEV_KPIS.aFacturer.toLocaleString()} €`, icon: Euro, color: "text-amber-400" },
    { title: "Heures totales", value: `${DEV_KPIS.tempsTotal}h`, icon: Clock, color: "text-violet-400" },
  ];

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}><DevOnboardingBanner /></motion.div>

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" /> Espace Studio
        </h1>
        <p className="text-muted-foreground text-sm">{DEV_KPIS.projetsActifs} projets en cours</p>
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
          { key: "equipe", label: "Équipe", icon: UserCheck },
        ] as const).map((t) => (
          <Button key={t.key} size="sm" variant={tab === t.key ? "default" : "outline"} onClick={() => setTab(t.key)} className="gap-1">
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </Button>
        ))}
      </motion.div>

      {tab === "projets" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Projets actifs</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client / Projet</TableHead>
                    <TableHead>Dev</TableHead>
                    <TableHead>Sprint</TableHead>
                    <TableHead>Livraison</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_DEV_PROJETS.map((p) => {
                    const currentSprint = p.sprints.find((s) => s.statut === "en_cours" || s.statut === "recette");
                    return (
                      <TableRow key={p.id}>
                        <TableCell>
                          <p className="font-medium text-sm">{p.clientNom}</p>
                          <p className="text-xs text-muted-foreground">{p.nom}</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.devAssigne}</TableCell>
                        <TableCell>
                          {currentSprint ? (
                            <Badge variant="secondary" className="text-xs">{currentSprint.nom}</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{p.prochaineLivraison}</TableCell>
                        <TableCell className="text-right">
                          <p className="text-sm font-medium">{p.montantTotal.toLocaleString()} €</p>
                          <p className="text-xs text-muted-foreground">{p.tempsTotal}h</p>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {tab === "equipe" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Équipe & temps</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_DEV_EQUIPE.map((d) => (
                <div key={d.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{d.nom}</p>
                    <p className="text-xs text-muted-foreground">{d.poste} · {d.projetsActifs} projet(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{d.tempsHebdo}h / sem</p>
                    <p className="text-xs text-muted-foreground">{d.tauxHoraire} €/h</p>
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
