import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_INTERVENTIONS, MOCK_CONTRATS, NETTOYAGE_STEPS } from "@/data/mockNettoyageData";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { CalendarDays, FileText, CheckCircle, Download, Euro } from "lucide-react";
import { toast } from "sonner";

export function NettoyageClientView() {
  // Mock: current client = "Immeuble Haussmann"
  const clientName = "Immeuble Haussmann";
  const mesInterventions = MOCK_INTERVENTIONS.filter((i) => i.client === clientName);
  const monContrat = MOCK_CONTRATS.find((c) => c.client === clientName);
  const [validations, setValidations] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    mesInterventions.forEach((i) => { init[i.id] = i.rapportValide; });
    return init;
  });

  const handleValider = (id: string) => {
    setValidations((prev) => ({ ...prev, [id]: true }));
    toast.success("Rapport validé — prestation confirmée !");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" /> Mes interventions
        </h1>
        <p className="text-muted-foreground text-sm">{clientName}</p>
      </div>

      {/* Contrat info */}
      {monContrat && (
        <Card className="glass-card">
          <CardContent className="p-4 grid sm:grid-cols-3 gap-3 text-sm">
            <div><span className="text-muted-foreground">Fréquence</span><p className="font-medium">{monContrat.frequence}</p></div>
            <div><span className="text-muted-foreground">Prochain passage</span><p className="font-medium">{new Date(monContrat.prochainPassage).toLocaleDateString("fr-FR")}</p></div>
            <div><span className="text-muted-foreground">Montant mensuel</span><p className="font-medium">{monContrat.montantMensuel.toLocaleString()} €</p></div>
          </CardContent>
        </Card>
      )}

      {/* Calendrier interventions */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Interventions planifiées & passées</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mesInterventions.map((i) => {
            const past = i.statut === "termine";
            return (
              <div key={i.id} className="p-3 rounded-lg bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{new Date(i.date).toLocaleDateString("fr-FR")} à {i.heure}</p>
                    <p className="text-xs text-muted-foreground">{i.type} · {i.duree} · Agent : {i.agent}</p>
                  </div>
                  <Badge variant={past ? "secondary" : "default"} className="text-xs">
                    {NETTOYAGE_STEPS[Math.min(i.step, NETTOYAGE_STEPS.length - 1)]}
                  </Badge>
                </div>

                {/* Rapport */}
                {i.rapportSoumis && (
                  <div className="space-y-2 border-t border-border/30 pt-3">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> Rapport d'intervention</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                      {i.checklist.map((c) => (
                        <div key={c.id} className="flex items-center gap-1.5 text-xs">
                          <div className={`w-2 h-2 rounded-full ${c.fait ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      {validations[i.id] ? (
                        <Badge variant="secondary" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Rapport validé</Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleValider(i.id)}>Valider le rapport</Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Stepper mini */}
                {!past && (
                  <div className="pt-2">
                    <SectorStepper currentStep={i.step} />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Factures récurrentes */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Euro className="h-4 w-4" /> Factures récurrentes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {["Février 2026", "Janvier 2026", "Décembre 2025"].map((mois, i) => (
            <div key={mois} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <p className="text-sm font-medium">Facture — {mois}</p>
                <p className="text-xs text-muted-foreground">{monContrat?.montantMensuel.toLocaleString()} €</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Payée</Badge>
                <Button size="sm" variant="ghost" className="gap-1">
                  <Download className="h-3.5 w-3.5" /> PDF
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
