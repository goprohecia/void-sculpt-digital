import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_FICHES, REPARATEUR_STEPS } from "@/data/mockReparateurData";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { Smartphone, FileText, CheckCircle, XCircle, Bell, QrCode } from "lucide-react";
import { toast } from "sonner";

export function ReparateurClientView() {
  const fiche = MOCK_FICHES[0]; // client view for first fiche
  const [devisReponse, setDevisReponse] = useState<"accepte" | "refuse" | null>(fiche.devisAccepte ? "accepte" : null);
  const [step, setStep] = useState(fiche.step);

  const handleAccepter = () => {
    setDevisReponse("accepte");
    setStep(Math.max(step, 3));
    toast.success("Devis accepté — la réparation va commencer !");
  };

  const handleRefuser = () => {
    setDevisReponse("refuse");
    toast.info("Devis refusé. Vous pouvez récupérer votre appareil.");
  };

  const estPret = step >= 6;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Smartphone className="h-6 w-6 text-primary" /> Suivi de ma réparation</h1>
        <p className="text-muted-foreground text-sm">{fiche.marque} {fiche.modele} — {fiche.panneDeclaree}</p>
      </div>

      {/* Stepper */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <SectorStepper currentStep={step} />
        </CardContent>
      </Card>

      {/* Notification prêt */}
      {estPret && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Votre appareil est prêt !</p>
              <p className="text-xs text-muted-foreground">Vous pouvez venir le récupérer à l'atelier.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code de retrait */}
      {estPret && (
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><QrCode className="h-4 w-4" /> Code de retrait</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <div className="bg-muted/30 rounded-xl px-8 py-4">
              <p className="text-3xl font-bold font-mono tracking-widest">{fiche.codeRetrait}</p>
            </div>
            <p className="text-xs text-muted-foreground">Présentez ce code à l'atelier pour récupérer votre appareil</p>
          </CardContent>
        </Card>
      )}

      {/* Devis */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Devis de réparation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Appareil</span>
              <span className="font-medium">{fiche.marque} {fiche.modele}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Diagnostic</span>
              <span className="font-medium">{fiche.panneConstatee}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Pièces</span>
              <span className="font-medium">{fiche.piecesNecessaires.join(", ")}</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-primary/5">
              <span className="font-medium">Montant total</span>
              <span className="text-lg font-bold">{fiche.montantDevis} €</span>
            </div>
          </div>

          {devisReponse === null ? (
            <div className="flex gap-3">
              <Button onClick={handleAccepter} className="flex-1 gap-2"><CheckCircle className="h-4 w-4" /> Accepter</Button>
              <Button onClick={handleRefuser} variant="outline" className="flex-1 gap-2"><XCircle className="h-4 w-4" /> Refuser</Button>
            </div>
          ) : (
            <Badge variant={devisReponse === "accepte" ? "default" : "destructive"} className="text-xs gap-1">
              {devisReponse === "accepte" ? <><CheckCircle className="h-3 w-3" /> Devis accepté</> : <><XCircle className="h-3 w-3" /> Devis refusé</>}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Infos appareil */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Détails de l'appareil</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Marque</span><p className="font-medium">{fiche.marque}</p></div>
          <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Modèle</span><p className="font-medium">{fiche.modele}</p></div>
          <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Panne</span><p className="font-medium">{fiche.panneDeclaree}</p></div>
          <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Délai estimé</span><p className="font-medium">{fiche.delaiEstime}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
