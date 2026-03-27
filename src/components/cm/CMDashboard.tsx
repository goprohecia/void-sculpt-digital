import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import {
  CM_KPIS, CM_STEPS, MOCK_CM_CLIENTS, MOCK_CM_CMS,
} from "@/data/mockCMData";
import {
  Megaphone, Users, Euro, FileText, AlertTriangle, UserCheck, Send,
} from "lucide-react";

export function CMDashboard() {
  const [tab, setTab] = useState<"clients" | "equipe">("clients");

  const kpiCards = [
    { title: "Clients actifs", value: CM_KPIS.clientsActifs, icon: Users, color: "text-blue-400" },
    { title: "Posts publiés", value: CM_KPIS.postsPublies, icon: Send, color: "text-green-400" },
    { title: "En attente validation", value: CM_KPIS.enAttenteValidation, icon: FileText, color: "text-amber-400" },
    { title: "CA du mois", value: `${CM_KPIS.caMois.toLocaleString()} €`, icon: Euro, color: "text-violet-400" },
  ];

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}><SectorOnboardingBanner /></motion.div>

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" /> Espace Direction
        </h1>
        <p className="text-muted-foreground text-sm">
          {CM_KPIS.retards} contenu(s) en retard
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
          { key: "clients", label: "Clients", icon: Users },
          { key: "equipe", label: "Équipe CM", icon: UserCheck },
        ] as const).map((t) => (
          <Button key={t.key} size="sm" variant={tab === t.key ? "default" : "outline"} onClick={() => setTab(t.key)} className="gap-1">
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </Button>
        ))}
      </motion.div>

      {tab === "clients" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Clients actifs</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Compte</TableHead>
                    <TableHead>CM assigné</TableHead>
                    <TableHead className="text-center">Posts/mois</TableHead>
                    <TableHead>Étape</TableHead>
                    <TableHead>Paiement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_CM_CLIENTS.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-sm">{c.nom}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.cmAssigne}</TableCell>
                      <TableCell className="text-center text-sm">{c.postsMois}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{CM_STEPS[c.etape] || CM_STEPS[0]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.statutPaiement === "payé" ? "default" : c.statutPaiement === "en_retard" ? "destructive" : "secondary"} className="text-xs capitalize">
                          {c.statutPaiement}
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

      {tab === "equipe" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Équipe CM</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_CM_CMS.map((cm) => (
                <div key={cm.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{cm.nom}</p>
                    <p className="text-xs text-muted-foreground">{cm.poste} · {cm.clientsActifs} clients</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold">{cm.postsTotal} posts</p>
                      {cm.enRetard > 0 && (
                        <p className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {cm.enRetard} retard</p>
                      )}
                    </div>
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
