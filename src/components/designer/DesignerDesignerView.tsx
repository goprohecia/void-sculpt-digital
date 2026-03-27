import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SectorStepper } from "@/components/admin/SectorStepper";
import {
  MOCK_DESIGNER_PROJETS, type DesignerVersionStatus,
} from "@/data/mockDesignerData";
import {
  Palette, Image, Upload, FileText, MessageCircle, CalendarDays, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_LABELS: Record<DesignerVersionStatus, string> = {
  soumise: "Soumise",
  validee: "Validée",
  corrections: "Corrections",
};

export function DesignerDesignerView() {
  const mesProjets = MOCK_DESIGNER_PROJETS.filter((p) => p.designerAssigne === "Léa Fontaine");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ description: "", lien: "" });
  const [uploadProjet, setUploadProjet] = useState("");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Proposition uploadée (mock)");
    setShowUpload(false);
    setUploadForm({ description: "", lien: "" });
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" /> Espace Designer
        </h1>
        <p className="text-muted-foreground text-sm">{mesProjets.length} projet(s) actif(s)</p>
      </motion.div>

      {mesProjets.map((p) => (
        <motion.div key={p.id} variants={staggerItem}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{p.clientNom} — {p.typeCreation}</CardTitle>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => { setUploadProjet(p.id); setShowUpload(true); }}>
                  <Upload className="h-3.5 w-3.5" /> Soumettre version
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" /> Deadline : {p.deadline}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <SectorStepper currentStep={p.etape} />

              {/* Brief */}
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><FileText className="h-3 w-3" /> Brief</p>
                <p className="text-sm">{p.brief}</p>
              </div>

              {/* Moodboard */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Image className="h-3 w-3" /> Moodboard</p>
                <div className="flex gap-2 flex-wrap">
                  {p.moodboardImages.map((img, i) => (
                    <div key={i} className="px-3 py-2 rounded-lg border bg-muted/20 text-xs text-muted-foreground">
                      🎨 {img}
                    </div>
                  ))}
                </div>
              </div>

              {/* Versions & retours */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Versions soumises</p>
                <div className="space-y-2">
                  {p.versions.map((v) => (
                    <div key={v.id} className="p-3 rounded-lg border space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">V{v.numero}</Badge>
                          <span className="text-sm font-medium">{v.description}</span>
                        </div>
                        <Badge variant={v.statut === "validee" ? "default" : v.statut === "corrections" ? "destructive" : "secondary"} className="text-xs">
                          {STATUS_LABELS[v.statut]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{v.dateUpload} · {v.lienFichier}</p>
                      {v.commentaireClient && (
                        <div className="p-2 rounded bg-muted/30 flex items-start gap-2 mt-1">
                          <MessageCircle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">{v.commentaireClient}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Dialog upload */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Soumettre une proposition</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <p className="text-sm text-muted-foreground">Projet : {mesProjets.find((p) => p.id === uploadProjet)?.clientNom}</p>
            <div className="space-y-2">
              <Label>Description de la version</Label>
              <Textarea value={uploadForm.description} onChange={(e) => setUploadForm((f) => ({ ...f, description: e.target.value }))} placeholder="Décrivez les changements apportés..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Lien fichier</Label>
              <Input value={uploadForm.lien} onChange={(e) => setUploadForm((f) => ({ ...f, lien: e.target.value }))} placeholder="https://drive.google.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Fichier (simulé)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground text-xs">
                Glissez un fichier ici ou cliquez pour importer (simulé)
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={!uploadForm.description}>Soumettre</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
