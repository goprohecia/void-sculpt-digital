import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectorStepper } from "@/components/admin/SectorStepper";
import {
  MOCK_CONSULTANT_MISSIONS, MOCK_CONSULTANT_CR, MOCK_CONSULTANT_DOCUMENTS,
} from "@/data/mockConsultantData";
import {
  Briefcase, FileText, CheckCircle, Download, FileSignature, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

export function ConsultantClientView() {
  // Simulate client = Groupe Nexus (mis1)
  const mission = MOCK_CONSULTANT_MISSIONS.find((m) => m.id === "mis1")!;
  const compteRendus = MOCK_CONSULTANT_CR.filter((cr) => cr.missionId === mission.id);
  const documents = MOCK_CONSULTANT_DOCUMENTS.filter((d) => d.titre.includes("Nexus"));
  const [validatedIds, setValidatedIds] = useState<string[]>([]);

  const handleValidate = (id: string) => {
    setValidatedIds((prev) => [...prev, id]);
    toast.success("Livrable validé ✓");
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" /> Suivi mission — {mission.clientNom}
        </h1>
        <p className="text-muted-foreground text-sm">Consultant : {mission.consultantAssigne} · {mission.dateDebut} → {mission.dateFin || "En cours"}</p>
      </motion.div>

      {/* Stepper avancement */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base">Avancement</CardTitle></CardHeader>
          <CardContent>
            <SectorStepper currentStep={mission.etape} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Livrables */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Livrables</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {mission.livrables.map((l) => {
              const isValidated = l.statut === "valide" || validatedIds.includes(l.id);
              return (
                <div key={l.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{l.titre}</p>
                      <p className="text-xs text-muted-foreground">{l.description}</p>
                    </div>
                    <Badge variant={isValidated ? "default" : l.statut === "livre" ? "secondary" : "outline"} className="text-xs">
                      {isValidated ? "Validé" : l.statut === "livre" ? "Livré" : "En cours"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Échéance : {l.deadline}</span>
                    {l.statut === "livre" && !validatedIds.includes(l.id) && (
                      <Button size="sm" onClick={() => handleValidate(l.id)} className="gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Valider
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Documents signés */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileSignature className="h-4 w-4" /> Documents signés</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {documents.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-2 rounded border">
                <div>
                  <p className="text-sm font-medium">{d.titre}</p>
                  <p className="text-xs text-muted-foreground capitalize">{d.type} · {d.date}</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.success("Téléchargement (mock)")}>
                  <Download className="h-3.5 w-3.5" /> PDF
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Historique échanges */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Comptes-rendus</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {compteRendus.map((cr) => (
              <div key={cr.id} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">{cr.semaine}</Badge>
                  <span className="text-xs text-muted-foreground">{cr.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{cr.contenu}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
