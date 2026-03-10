import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_SESSIONS } from "@/data/mockFormateurData";
import { FormateurStepper } from "./FormateurStepper";
import { GraduationCap, FileText, Download, Clock, CheckCircle, Award } from "lucide-react";
import { toast } from "sonner";

export function FormateurStagiaireView() {
  // Mock: current stagiaire is st-1 in session sess-1
  const session = MOCK_SESSIONS[0];
  const stagiaire = session.stagiaires[0];
  const [conventionSignee, setConventionSignee] = useState(stagiaire.conventionSignee);

  const pctHeures = Math.round((session.heuresEffectuees / session.heuresTotal) * 100);

  const handleSignConvention = () => {
    setConventionSignee(true);
    toast.success("Convention signée électroniquement !");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> Espace Stagiaire
        </h1>
        <p className="text-muted-foreground text-sm">{session.intitule}</p>
      </div>

      {/* Stepper */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <FormateurStepper currentStep={session.step} />
        </CardContent>
      </Card>

      {/* Statut formation */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Progression</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Heures effectuées</span>
            <span className="font-semibold">{session.heuresEffectuees}h / {session.heuresTotal}h</span>
          </div>
          <Progress value={pctHeures} className="h-2" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Dates</span>
              <p className="font-medium">{new Date(session.dateDebut).toLocaleDateString("fr-FR")} — {new Date(session.dateFin).toLocaleDateString("fr-FR")}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Lieu</span>
              <p className="font-medium">{session.lieu}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Programme */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Programme — Module par module</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {session.modules.map((m, i) => {
            const past = new Date(m.date) < new Date();
            return (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${past ? "bg-primary border-primary text-primary-foreground" : "border-muted text-muted-foreground"}`}>
                  {past ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.titre}</p>
                  <p className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString("fr-FR")} · {m.duree} · {m.formateur}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Documents</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Convention */}
          <div className="p-3 rounded-lg bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Convention de formation</p>
              {conventionSignee ? (
                <Badge variant="secondary" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Signée</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">En attente de signature</Badge>
              )}
            </div>
            {!conventionSignee && (
              <Button size="sm" onClick={handleSignConvention} className="gap-1">
                <FileText className="h-3.5 w-3.5" /> Signer électroniquement
              </Button>
            )}
          </div>

          {/* Supports */}
          {[
            { label: "Support de cours — Module 1", file: "Module1_Management.pdf" },
            { label: "Support de cours — Module 2", file: "Module2_Leadership.pdf" },
            { label: "Support de cours — Module 3", file: "Module3_Conflits.pdf" },
          ].map((doc) => (
            <div key={doc.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <p className="text-sm font-medium">{doc.label}</p>
              <Button size="sm" variant="ghost" className="gap-1">
                <Download className="h-3.5 w-3.5" /> {doc.file}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attestation */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4" /> Attestation de formation</CardTitle></CardHeader>
        <CardContent>
          {stagiaire.attestationEmise ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/5">
                <p className="text-sm font-medium">✓ Attestation de fin de formation disponible</p>
                <p className="text-xs text-muted-foreground mt-1">Formation complétée avec succès.</p>
              </div>
              <Button variant="outline" className="gap-1">
                <Download className="h-3.5 w-3.5" /> Télécharger l'attestation
              </Button>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">
                L'attestation sera disponible une fois la formation terminée et l'évaluation validée par le formateur.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
