import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SectorStepper } from "@/components/admin/SectorStepper";
import {
  MOCK_BOUTIQUE_CLIENT_COMMANDES,
  MOCK_BOUTIQUE_FIDELITE,
  BOUTIQUE_STEPS,
} from "@/data/mockBoutiqueData";
import { ShoppingBag, FileText, Star, Download, Gift, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export function BoutiqueClientView() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const fidelite = MOCK_BOUTIQUE_FIDELITE;
  const progression = Math.round((fidelite.points / fidelite.pointsProchain) * 100);

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" /> Mes commandes
        </h1>
        <p className="text-muted-foreground text-sm">
          {MOCK_BOUTIQUE_CLIENT_COMMANDES.length} commandes · Carte fidélité {fidelite.palier}
        </p>
      </motion.div>

      {/* Carte fidélité */}
      <motion.div variants={staggerItem}>
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                <span className="font-semibold text-sm">Carte fidélité — {fidelite.palier}</span>
              </div>
              <Badge variant="secondary">{fidelite.points} pts</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{fidelite.points} / {fidelite.pointsProchain} pts</span>
                <span>Prochain palier : {fidelite.prochainPalier}</span>
              </div>
              <Progress value={progression} className="h-2" />
            </div>
            <div className="space-y-1">
              {fidelite.historique.slice(0, 3).map((h, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{h.date} — {h.description}</span>
                  <span className="font-medium text-primary">+{h.points} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Commandes */}
      <motion.div variants={staggerItem} className="space-y-3">
        {MOCK_BOUTIQUE_CLIENT_COMMANDES.map((cmd) => (
          <Card key={cmd.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{cmd.reference}</p>
                  <p className="text-xs text-muted-foreground">{cmd.date} · {cmd.total.toFixed(2)} €</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={cmd.etape >= 5 ? "default" : "secondary"} className="text-xs">
                    {BOUTIQUE_STEPS[cmd.etape] || BOUTIQUE_STEPS[0]}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => setExpanded(expanded === cmd.id ? null : cmd.id)}>
                    {expanded === cmd.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {expanded === cmd.id && (
                <div className="space-y-3">
                  <SectorStepper currentStep={cmd.etape} />
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Articles :</p>
                    {cmd.articles.map((a, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {a}</p>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => toast.success("Facture téléchargée (mock)")}
                  >
                    <Download className="h-3.5 w-3.5" /> Télécharger la facture
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
