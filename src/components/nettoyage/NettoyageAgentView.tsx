import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_INTERVENTIONS } from "@/data/mockNettoyageData";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { ClipboardList, MapPin, KeyRound, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function NettoyageAgentView() {
  const today = "2026-03-11";
  const mesInterventions = MOCK_INTERVENTIONS.filter((i) => i.date === today && i.agent === "Fatou Diallo");
  const [selected, setSelected] = useState(mesInterventions[0]);
  const [checklists, setChecklists] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    MOCK_INTERVENTIONS.forEach((i) => {
      init[i.id] = {};
      i.checklist.forEach((c) => { init[i.id][c.id] = c.fait; });
    });
    return init;
  });
  const [anomalies, setAnomalies] = useState<Record<string, string>>({});
  const [terminees, setTerminees] = useState<Record<string, boolean>>({});

  const toggleCheck = (intId: string, ckId: string) => {
    setChecklists((prev) => ({
      ...prev,
      [intId]: { ...prev[intId], [ckId]: !prev[intId]?.[ckId] },
    }));
  };

  const handleTerminer = (intId: string) => {
    setTerminees((prev) => ({ ...prev, [intId]: true }));
    toast.success("Intervention terminée — rapport généré !");
  };

  if (!selected) return <div className="p-8 text-center text-muted-foreground">Aucune intervention aujourd'hui.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> Espace Agent
        </h1>
        <p className="text-muted-foreground text-sm">Interventions du {new Date(today).toLocaleDateString("fr-FR")}</p>
      </div>

      {/* Sélecteur */}
      <div className="flex gap-2 flex-wrap">
        {mesInterventions.map((i) => (
          <Button key={i.id} variant={selected.id === i.id ? "default" : "outline"} size="sm" onClick={() => setSelected(i)}>
            {i.heure} — {i.client}
          </Button>
        ))}
      </div>

      {/* Stepper */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <SectorStepper currentStep={terminees[selected.id] ? 4 : selected.step} />
        </CardContent>
      </Card>

      {/* Fiche intervention */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Détails intervention</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="font-medium">{selected.adresse}</p><p className="text-muted-foreground">{selected.type} · {selected.duree}</p></div></div>
            <div className="flex items-start gap-2"><KeyRound className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-muted-foreground">Accès</p><p className="font-medium">{selected.codeAcces}</p></div></div>
            <div className="flex items-start gap-2"><Phone className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-muted-foreground">Contact</p><p className="font-medium">{selected.contactSurPlace}</p></div></div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Instructions spéciales</CardTitle></CardHeader>
          <CardContent>
            {selected.instructions ? (
              <div className="p-3 rounded-lg bg-amber-500/10 text-sm">{selected.instructions}</div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune instruction particulière.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Checklist */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Checklist d'intervention</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {selected.checklist.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
              <Checkbox
                checked={checklists[selected.id]?.[c.id] || false}
                onCheckedChange={() => toggleCheck(selected.id, c.id)}
                disabled={!!terminees[selected.id]}
              />
              <span className="text-sm">{c.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Anomalie */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Signalement d'anomalie</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            placeholder="Décrivez toute anomalie constatée (dégât, panne, accès bloqué…)"
            value={anomalies[selected.id] || ""}
            onChange={(e) => setAnomalies((prev) => ({ ...prev, [selected.id]: e.target.value }))}
            disabled={!!terminees[selected.id]}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Terminer */}
      {terminees[selected.id] ? (
        <Card className="glass-card border-primary/30">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Intervention terminée</p>
              <p className="text-xs text-muted-foreground">Rapport automatique généré et envoyé au client.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => handleTerminer(selected.id)} className="w-full sm:w-auto">
          Terminer l'intervention
        </Button>
      )}
    </div>
  );
}
