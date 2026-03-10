import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DesignerStepper } from "./DesignerStepper";
import {
  MOCK_DESIGNER_PROJETS, type DesignerVersionStatus,
} from "@/data/mockDesignerData";
import {
  Palette, CheckCircle, XCircle, FileSignature, Download, MessageCircle, Layers,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_LABELS: Record<DesignerVersionStatus, string> = {
  soumise: "En attente",
  validee: "Validée",
  corrections: "Corrections demandées",
};

export function DesignerClientView() {
  // Simulate client = CaféNova (dp1)
  const projet = MOCK_DESIGNER_PROJETS.find((p) => p.id === "dp1")!;
  const [validatedIds, setValidatedIds] = useState<string[]>([]);
  const [commentaires, setCommentaires] = useState<Record<string, string>>({});
  const [batSigned, setBatSigned] = useState(false);

  const handleValidate = (id: string) => {
    setValidatedIds((prev) => [...prev, id]);
    toast.success("Version validée ✓");
  };

  const handleRequestCorrections = (id: string) => {
    if (!commentaires[id]?.trim()) {
      toast.error("Ajoutez un commentaire pour demander des corrections");
      return;
    }
    toast("Demande de corrections envoyée (mock)");
  };

  const handleSignBAT = () => {
    setBatSigned(true);
    toast.success("BAT signé électroniquement ✓");
  };

  const allValidated = projet.versions.every((v) => v.statut === "validee" || validatedIds.includes(v.id));

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" /> Mon projet — {projet.clientNom}
        </h1>
        <p className="text-muted-foreground text-sm">{projet.typeCreation} · Designer : {projet.designerAssigne}</p>
      </motion.div>

      {/* Stepper */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base">Avancement du projet</CardTitle></CardHeader>
          <CardContent>
            <DesignerStepper currentStep={projet.etape} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Versions soumises */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4" /> Versions soumises</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {projet.versions.map((v) => {
              const isValidated = v.statut === "validee" || validatedIds.includes(v.id);
              return (
                <div key={v.id} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-bold">V{v.numero}</Badge>
                      <span className="font-medium text-sm">{v.description}</span>
                    </div>
                    <Badge variant={isValidated ? "default" : v.statut === "corrections" ? "destructive" : "secondary"} className="text-xs">
                      {isValidated ? "Validée" : STATUS_LABELS[v.statut]}
                    </Badge>
                  </div>

                  {/* Prévisualisation mock */}
                  <div className="rounded-lg border bg-muted/20 p-8 text-center">
                    <Layers className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Prévisualisation — {v.lienFichier}</p>
                  </div>

                  <p className="text-xs text-muted-foreground">Soumis le {v.dateUpload}</p>

                  {/* Commentaire existant */}
                  {v.commentaireClient && (
                    <div className="p-2 rounded bg-muted/30 flex items-start gap-2">
                      <MessageCircle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">{v.commentaireClient}</p>
                    </div>
                  )}

                  {/* Actions si soumise */}
                  {v.statut === "soumise" && !validatedIds.includes(v.id) && (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Commentaire</Label>
                        <Textarea
                          value={commentaires[v.id] || ""}
                          onChange={(e) => setCommentaires((prev) => ({ ...prev, [v.id]: e.target.value }))}
                          placeholder="Vos retours sur cette version..."
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleValidate(v.id)} className="gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Valider
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRequestCorrections(v.id)} className="gap-1">
                          <XCircle className="h-3.5 w-3.5" /> Demander corrections
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* BAT final */}
      <motion.div variants={staggerItem}>
        <Card className={batSigned ? "border-green-500/30" : "border-amber-500/30"}>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileSignature className="h-4 w-4" /> BAT — Bon à tirer</CardTitle></CardHeader>
          <CardContent>
            {batSigned ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
                <p className="font-medium text-sm">BAT signé électroniquement</p>
                <p className="text-xs text-muted-foreground">Signature validée le {new Date().toLocaleDateString("fr-FR")}</p>
                <Button variant="outline" className="gap-1" onClick={() => toast.success("Fichiers téléchargés (mock)")}>
                  <Download className="h-3.5 w-3.5" /> Télécharger les fichiers finaux
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {allValidated
                    ? "Toutes les versions sont validées. Signez le BAT pour recevoir les fichiers finaux."
                    : "Validez toutes les versions avant de signer le BAT."}
                </p>
                <Button onClick={handleSignBAT} disabled={!allValidated} className="gap-1">
                  <FileSignature className="h-4 w-4" /> Signer le BAT électroniquement
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
