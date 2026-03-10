import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DevStepper } from "./DevStepper";
import { MOCK_DEV_PROJETS } from "@/data/mockDevData";
import {
  Code, CheckCircle, XCircle, FileSignature, Download, ExternalLink, Euro, Receipt,
} from "lucide-react";
import { toast } from "sonner";

export function DevClientView() {
  // Simulate client = MediSanté (prj1)
  const projet = MOCK_DEV_PROJETS.find((p) => p.id === "prj1")!;
  const [sprintActions, setSprintActions] = useState<Record<string, "valide" | "refuse">>({});
  const [pvSigned, setPvSigned] = useState<Record<string, boolean>>({});
  const [commentaires, setCommentaires] = useState<Record<string, string>>({});

  const handleValidate = (sprintId: string) => {
    setSprintActions((prev) => ({ ...prev, [sprintId]: "valide" }));
    toast.success("Sprint validé ✓");
  };

  const handleRefuse = (sprintId: string) => {
    if (!commentaires[sprintId]?.trim()) {
      toast.error("Ajoutez un commentaire pour refuser");
      return;
    }
    setSprintActions((prev) => ({ ...prev, [sprintId]: "refuse" }));
    toast("Sprint refusé — corrections demandées (mock)");
  };

  const handleSignPV = (sprintId: string) => {
    setPvSigned((prev) => ({ ...prev, [sprintId]: true }));
    toast.success("PV de livraison signé ✓");
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" /> {projet.nom}
        </h1>
        <p className="text-muted-foreground text-sm">{projet.clientNom} · Dev : {projet.devAssigne}</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base">Avancement</CardTitle></CardHeader>
          <CardContent><DevStepper currentStep={projet.etape} /></CardContent>
        </Card>
      </motion.div>

      {/* Sprints */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base">Sprints</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {projet.sprints.map((s) => {
              const action = sprintActions[s.id];
              const finalStatut = action || s.statut;
              const signed = s.pvSigne || pvSigned[s.id];
              return (
                <div key={s.id} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{s.nom}</p>
                      <p className="text-xs text-muted-foreground">{s.dateDebut} → {s.dateFin}</p>
                    </div>
                    <Badge variant={finalStatut === "valide" ? "default" : finalStatut === "refuse" ? "destructive" : "secondary"} className="text-xs capitalize">
                      {finalStatut === "en_cours" ? "En cours" : finalStatut === "recette" ? "Recette" : finalStatut === "valide" ? "Validé" : "Refusé"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground"><strong>Scope :</strong> {s.scope}</p>

                  {s.lienDemo && (
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => toast("Lien démo (mock)")}>
                      <ExternalLink className="h-3.5 w-3.5" /> Voir la démo
                    </Button>
                  )}

                  {/* Actions recette */}
                  {(s.statut === "recette" || s.statut === "en_cours") && !action && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="space-y-1">
                        <Label className="text-xs">Commentaire</Label>
                        <Textarea
                          value={commentaires[s.id] || ""}
                          onChange={(e) => setCommentaires((prev) => ({ ...prev, [s.id]: e.target.value }))}
                          placeholder="Vos retours sur ce sprint..."
                          rows={2} className="text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleValidate(s.id)} className="gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Valider
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRefuse(s.id)} className="gap-1">
                          <XCircle className="h-3.5 w-3.5" /> Refuser
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* PV signature */}
                  {(finalStatut === "valide") && (
                    <div className="pt-2 border-t">
                      {signed ? (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium">PV signé</span>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => handleSignPV(s.id)} className="gap-1">
                          <FileSignature className="h-3.5 w-3.5" /> Signer le PV de livraison
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Facturation jalons */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Receipt className="h-4 w-4" /> Facturation par jalon</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {projet.jalons.map((j) => (
              <div key={j.id} className="flex items-center justify-between p-2 rounded border">
                <div>
                  <p className="text-sm font-medium">{j.label}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{j.montant.toLocaleString()} €</span>
                  <Badge variant={j.statut === "paye" ? "default" : j.statut === "facture" ? "secondary" : "outline"} className="text-xs capitalize">
                    {j.statut === "a_facturer" ? "À facturer" : j.statut === "facture" ? "Facturé" : "Payé"}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t text-sm font-bold">
              <span>Total</span>
              <span>{projet.montantTotal.toLocaleString()} €</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
