import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_CM_CONTENUS, MOCK_CM_RAPPORTS, RESEAU_COLORS, CM_STEPS,
  type CMContentStatus,
} from "@/data/mockCMData";
import {
  Megaphone, CalendarDays, CheckCircle, XCircle, Download, BarChart3,
  TrendingUp, Users, Send, Star,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_LABELS: Record<CMContentStatus, string> = {
  brouillon: "Brouillon",
  a_valider: "À valider",
  valide: "Validé",
  publie: "Publié",
};

export function CMClientView() {
  // Simulate client = cmc1 (FreshFood)
  const clientId = "cmc1";
  const contenus = MOCK_CM_CONTENUS.filter((c) => c.clientId === clientId);
  const aValider = contenus.filter((c) => c.statut === "a_valider");
  const planifies = contenus.filter((c) => c.statut !== "brouillon");
  const rapports = MOCK_CM_RAPPORTS;
  const [validatedIds, setValidatedIds] = useState<string[]>([]);

  const handleApprove = (id: string) => {
    setValidatedIds((prev) => [...prev, id]);
    toast.success("Contenu approuvé ✓");
  };

  const handleReject = (id: string) => {
    toast("Demande de modifications envoyée (mock)");
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" /> Mon espace — FreshFood
        </h1>
        <p className="text-muted-foreground text-sm">{planifies.length} contenus planifiés ce mois</p>
      </motion.div>

      {/* Contenus à valider */}
      {aValider.length > 0 && (
        <motion.div variants={staggerItem}>
          <Card className="border-amber-500/30">
            <CardHeader><CardTitle className="text-base flex items-center gap-2 text-amber-500"><CheckCircle className="h-4 w-4" /> En attente de validation ({aValider.filter((c) => !validatedIds.includes(c.id)).length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {aValider.filter((c) => !validatedIds.includes(c.id)).map((c) => (
                <div key={c.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${RESEAU_COLORS[c.reseau] || ""}`}>{c.reseau}</Badge>
                    <span className="text-xs text-muted-foreground">{c.datePublication}</span>
                  </div>
                  <p className="font-medium text-sm">{c.titre}</p>
                  <p className="text-xs text-muted-foreground">{c.texte}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(c.id)} className="gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Approuver
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(c.id)} className="gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Modifications
                    </Button>
                  </div>
                </div>
              ))}
              {aValider.filter((c) => !validatedIds.includes(c.id)).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">Tous les contenus ont été validés ✓</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Calendrier éditorial lecture */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Calendrier éditorial</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {planifies.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2 rounded border">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge className={`text-xs flex-shrink-0 ${RESEAU_COLORS[c.reseau] || ""}`}>{c.reseau}</Badge>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.titre}</p>
                    <p className="text-xs text-muted-foreground">{c.datePublication}</p>
                  </div>
                </div>
                <Badge variant={c.statut === "publie" ? "default" : validatedIds.includes(c.id) ? "default" : "secondary"} className="text-xs flex-shrink-0">
                  {validatedIds.includes(c.id) ? "Validé" : STATUS_LABELS[c.statut]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Rapports */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Rapports mensuels</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {rapports.map((r) => (
              <div key={r.mois} className="p-3 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{r.mois}</p>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.success("Rapport téléchargé (mock)")}>
                    <Download className="h-3.5 w-3.5" /> PDF
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: "Reach", value: r.reach.toLocaleString(), icon: TrendingUp },
                    { label: "Engagement", value: `${r.engagement}%`, icon: Star },
                    { label: "Posts publiés", value: r.postsPublies, icon: Send },
                    { label: "Nv. abonnés", value: `+${r.nouveauxAbonnes}`, icon: Users },
                  ].map((kpi) => (
                    <div key={kpi.label} className="text-center p-2 rounded border">
                      <p className="text-lg font-bold">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">🏆 Top post : {r.topPost}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
