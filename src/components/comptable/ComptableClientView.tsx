import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ComptableStepper } from "./ComptableStepper";
import { toast } from "sonner";
import {
  MOCK_MISSIONS, MOCK_DECLARATIONS, MOCK_COLLABORATEURS_COMPTABLES,
  MOCK_DOCUMENTS_DEPOSES, CHECKLIST_PIECES, COMPTABLE_STEPS,
} from "@/data/mockComptableData";
import {
  Calculator, FileText, Euro, Upload, Download,
  CheckCircle2, Clock, User,
} from "lucide-react";

const CURRENT_CLIENT_MISSION_ID = "mc-1";

export function ComptableClientView() {
  const mission = MOCK_MISSIONS.find(m => m.id === CURRENT_CLIENT_MISSION_ID)!;
  const collab = MOCK_COLLABORATEURS_COMPTABLES.find(c => c.id === mission.collaborateurId)!;
  const declarations = MOCK_DECLARATIONS.filter(d => d.missionId === CURRENT_CLIENT_MISSION_ID);
  const documents = MOCK_DOCUMENTS_DEPOSES.filter(d => d.missionId === CURRENT_CLIENT_MISSION_ID);

  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKLIST_PIECES.map(p => [p, mission.piecesRecues.some(r => r.toLowerCase().includes(p.toLowerCase().split(" ")[0]))]))
  );
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Simulate upload
    const newFiles = Array.from(e.dataTransfer.files).map(f => f.name);
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} fichier(s) déposé(s) (simulé)`);
    }
  };

  const handleSimulateUpload = () => {
    const fakeFile = `Document_${Date.now().toString(36)}.pdf`;
    setUploadedFiles(prev => [...prev, fakeFile]);
    toast.success("Fichier déposé avec succès (simulé)");
  };

  const restant = mission.honorairesAnnuels - mission.honorairesPaies;

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Espace Client Entreprise
        </h1>
        <p className="text-muted-foreground text-sm">{mission.entrepriseNom} — {mission.typeMission}</p>
      </motion.div>

      {/* Collaborateur */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium">{collab.prenom} {collab.nom}</p>
              <p className="text-xs text-muted-foreground">{collab.specialite}</p>
              <p className="text-xs text-muted-foreground">{collab.telephone}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stepper */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Avancement de votre mission</CardTitle>
          </CardHeader>
          <CardContent>
            <ComptableStepper currentStep={mission.etape - 1} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Dépôt de documents */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              Dépôt de documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Drag & drop zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver ? "border-primary bg-primary/5" : "border-border/50"}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Glissez vos fichiers ici</p>
              <p className="text-[10px] text-muted-foreground mt-1">ou</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleSimulateUpload}>
                Sélectionner un fichier
              </Button>
            </div>

            {/* Fichiers déjà déposés */}
            {(documents.length > 0 || uploadedFiles.length > 0) && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Fichiers déposés</p>
                {documents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm">{d.nom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{d.dateDepot}</span>
                      <Badge variant={d.statut === "traite" ? "default" : "secondary"} className="text-[10px]">
                        {d.statut === "traite" ? "Traité" : "Reçu"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/20">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm">{f}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Reçu</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Checklist pièces */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Pièces à fournir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {CHECKLIST_PIECES.map((piece) => (
              <div key={piece} className="flex items-center gap-2 p-2 rounded bg-muted/20">
                <Checkbox
                  checked={checklist[piece] || false}
                  onCheckedChange={() => setChecklist(prev => ({ ...prev, [piece]: !prev[piece] }))}
                />
                <span className={`text-sm ${checklist[piece] ? "line-through text-muted-foreground" : ""}`}>{piece}</span>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground mt-2 italic">
              Cochez les pièces que vous avez déjà transmises à votre comptable
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Suivi déclarations */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Suivi des déclarations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {declarations.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <p className="text-sm font-medium">{d.type}</p>
                  <p className="text-xs text-muted-foreground">{d.periodicite} · Échéance {d.echeance}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={d.statut === "envoyee" ? "default" : d.statut === "validee" ? "secondary" : d.statut === "preparee" ? "outline" : "destructive"}
                    className="text-[10px]"
                  >
                    {d.statut === "envoyee" ? "Envoyée" : d.statut === "validee" ? "Validée" : d.statut === "preparee" ? "Préparée" : "À préparer"}
                  </Badge>
                  {d.dateTransmission && (
                    <p className="text-[10px] text-muted-foreground mt-1">Transmise le {d.dateTransmission}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Téléchargement bilan */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              Documents à télécharger
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm">Bilan 2025 — {mission.entrepriseNom}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("Téléchargement simulé — fichier mock PDF")}>
                <Download className="h-3.5 w-3.5 mr-1" /> PDF
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm">Liasse fiscale 2025</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("Téléchargement simulé — fichier mock PDF")}>
                <Download className="h-3.5 w-3.5 mr-1" /> PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Honoraires */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" />
              Honoraires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-sm">Forfait mensuel</span>
              <span className="text-sm font-medium">{mission.honorairesMensuels} €/mois</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-sm">Total annuel</span>
              <span className="text-sm font-medium">{mission.honorairesAnnuels.toLocaleString()} €</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-sm">Payé</span>
              <span className="text-sm font-medium text-emerald-400">{mission.honorairesPaies.toLocaleString()} €</span>
            </div>
            {restant > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <span className="text-sm font-medium">Reste dû</span>
                <span className="text-sm font-bold text-amber-400">{restant.toLocaleString()} €</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
