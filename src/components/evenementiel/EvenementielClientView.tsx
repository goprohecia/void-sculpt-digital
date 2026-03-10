import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_EVENEMENTS } from "@/data/mockEvenementielData";
import { EvenementielStepper } from "./EvenementielStepper";
import { PartyPopper, FileText, Euro, ClipboardList, Download, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function EvenementielClientView() {
  const evt = MOCK_EVENEMENTS[0]; // mock: first event as "my event"
  const [contratSigne, setContratSigne] = useState(evt.contratSigne);
  const [briefFinal, setBriefFinal] = useState(evt.briefFinalComplete);
  const [briefText, setBriefText] = useState("");
  const [validations, setValidations] = useState<Record<string, boolean>>(
    Object.fromEntries(evt.budgetPostes.map((bp) => [bp.id, bp.valideClient]))
  );

  const totalPrevu = evt.budgetPostes.reduce((s, bp) => s + bp.prevu, 0);
  const totalReel = evt.budgetPostes.reduce((s, bp) => s + bp.reel, 0);

  const handleValidatePoste = (id: string) => {
    setValidations((prev) => ({ ...prev, [id]: true }));
    toast.success("Poste budgétaire validé");
  };

  const handleSignContrat = () => {
    setContratSigne(true);
    toast.success("Contrat signé électroniquement !");
  };

  const handleSubmitBrief = () => {
    if (!briefText.trim()) {
      toast.error("Veuillez remplir le brief final");
      return;
    }
    setBriefFinal(true);
    toast.success("Brief final J-7 soumis !");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PartyPopper className="h-6 w-6 text-primary" /> Mon événement
        </h1>
        <p className="text-muted-foreground text-sm">{evt.nom} — {evt.type}</p>
      </div>

      {/* Stepper avec pourcentage */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <EvenementielStepper currentStep={evt.step} showPercentage />
        </CardContent>
      </Card>

      {/* Détails événement */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Détails de l'événement</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
          <p><span className="text-muted-foreground">Date :</span> {new Date(evt.date).toLocaleDateString("fr-FR")}</p>
          <p><span className="text-muted-foreground">Lieu :</span> {evt.lieu}</p>
          <p><span className="text-muted-foreground">Type :</span> {evt.type}</p>
          <p><span className="text-muted-foreground">Chef de projet :</span> {evt.chefDeProjet}</p>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Euro className="h-4 w-4" /> Budget prévisionnel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground">
                <th className="text-left p-3 font-medium">Poste</th>
                <th className="text-right p-3 font-medium">Prévu</th>
                <th className="text-right p-3 font-medium">Réel</th>
                <th className="text-right p-3 font-medium">Validation</th>
              </tr>
            </thead>
            <tbody>
              {evt.budgetPostes.map((bp) => (
                <tr key={bp.id} className="border-b border-border/30">
                  <td className="p-3">{bp.poste}</td>
                  <td className="p-3 text-right text-muted-foreground">{bp.prevu.toLocaleString()} €</td>
                  <td className="p-3 text-right">{bp.reel > 0 ? `${bp.reel.toLocaleString()} €` : "—"}</td>
                  <td className="p-3 text-right">
                    {validations[bp.id] ? (
                      <Badge variant="secondary" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Validé</Badge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleValidatePoste(bp.id)}>Valider</Button>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">{totalPrevu.toLocaleString()} €</td>
                <td className="p-3 text-right">{totalReel.toLocaleString()} €</td>
                <td />
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Documents</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Contrat */}
          <div className="p-3 rounded-lg bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Contrat de prestation</p>
              {contratSigne ? (
                <Badge variant="secondary" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Signé</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">En attente de signature</Badge>
              )}
            </div>
            {!contratSigne && (
              <SignaturePad onSign={handleSignContrat} label="Signer le contrat" />
            )}
          </div>

          {/* CDC & Programme */}
          {[
            { label: "Cahier des charges", file: "CDC_evenement.pdf" },
            { label: "Programme de la journée", file: "Programme_jour_J.pdf" },
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

      {/* Brief final J-7 */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" /> Brief final J-7
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {briefFinal ? (
            <div className="p-3 rounded-lg bg-emerald-500/10 text-sm">
              <p className="font-medium text-emerald-400">✓ Brief final soumis</p>
              <p className="text-muted-foreground mt-1">Votre brief a bien été transmis au chef de projet.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Complétez ce formulaire au plus tard 7 jours avant l'événement.
              </p>
              <Textarea
                placeholder="Confirmations de dernière minute, modifications de programme, nombre final d'invités, régimes alimentaires spéciaux, demandes particulières…"
                value={briefText}
                onChange={(e) => setBriefText(e.target.value)}
                rows={5}
              />
              <Button onClick={handleSubmitBrief} className="w-full sm:w-auto">Soumettre le brief final</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Programme */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Programme de la journée</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {evt.programme.map((line, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <p className="text-sm">{line}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
