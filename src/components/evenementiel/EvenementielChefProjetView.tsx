import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_EVENEMENTS, EVENEMENTIEL_STEPS } from "@/data/mockEvenementielData";
import { EvenementielStepper } from "./EvenementielStepper";
import { CalendarDays, AlertTriangle, Users, ClipboardList, StickyNote } from "lucide-react";
import { toast } from "sonner";

export function EvenementielChefProjetView() {
  const [selected, setSelected] = useState(MOCK_EVENEMENTS.filter((e) => e.statut === "en_cours")[0]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const toggleCheck = (prestaId: string) => {
    setChecklist((prev) => ({ ...prev, [prestaId]: !prev[prestaId] }));
    toast.success("Checklist mise à jour");
  };

  const enCours = MOCK_EVENEMENTS.filter((e) => e.statut === "en_cours");

  const typeLabels: Record<string, string> = {
    traiteur: "🍽️ Traiteur",
    salle: "🏛️ Salle",
    technique: "🔊 Technique",
    decoration: "🌸 Décoration",
    photo: "📷 Photo",
    animation: "🎵 Animation",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> Espace Chef de Projet
        </h1>
        <p className="text-muted-foreground text-sm">Gestion opérationnelle de vos événements</p>
      </div>

      {/* Sélecteur d'événement */}
      <div className="flex gap-2 flex-wrap">
        {enCours.map((evt) => (
          <Button
            key={evt.id}
            variant={selected?.id === evt.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelected(evt)}
          >
            {evt.nom}
          </Button>
        ))}
      </div>

      {selected && (
        <>
          {/* Stepper */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <EvenementielStepper currentStep={selected.step} />
            </CardContent>
          </Card>

          {/* Fiche événement */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-base">Fiche événement</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Client :</span> {selected.client}</p>
                <p><span className="text-muted-foreground">Type :</span> {selected.type}</p>
                <p><span className="text-muted-foreground">Date :</span> {new Date(selected.date).toLocaleDateString("fr-FR")}</p>
                <p><span className="text-muted-foreground">Lieu :</span> {selected.lieu}</p>
                <p><span className="text-muted-foreground">Budget :</span> {selected.budget.toLocaleString()} €</p>
              </CardContent>
            </Card>

            {/* Budget détaillé */}
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-base">Budget par poste</CardTitle></CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-muted-foreground">
                      <th className="text-left p-3 font-medium">Poste</th>
                      <th className="text-right p-3 font-medium">Prévu</th>
                      <th className="text-right p-3 font-medium">Réel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.budgetPostes.map((bp) => (
                      <tr key={bp.id} className="border-b border-border/30">
                        <td className="p-3">{bp.poste}</td>
                        <td className="p-3 text-right text-muted-foreground">{bp.prevu.toLocaleString()} €</td>
                        <td className="p-3 text-right font-medium">{bp.reel > 0 ? `${bp.reel.toLocaleString()} €` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Rétroplanning */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Rétroplanning</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {selected.jalons.map((j) => (
                <div key={j.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${j.fait ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                    <div>
                      <p className="text-sm font-medium">{j.label}</p>
                      <p className="text-xs text-muted-foreground">{new Date(j.date).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  {j.alerte && !j.fait && (
                    <Badge variant="destructive" className="text-xs gap-1">
                      <AlertTriangle className="h-3 w-3" /> {j.alerte}
                    </Badge>
                  )}
                  {j.fait && <Badge variant="secondary" className="text-xs">✓ Fait</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Checklist prestataires */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Checklist prestataires</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {selected.prestataires.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <Checkbox
                    checked={checklist[p.id] || false}
                    onCheckedChange={() => toggleCheck(p.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{typeLabels[p.type] || p.type} — {p.nom}</p>
                    <p className="text-xs text-muted-foreground">{p.contact} · {p.montant.toLocaleString()} €</p>
                  </div>
                  <Badge variant={p.statut === "confirmé" ? "secondary" : p.statut === "refusé" ? "destructive" : "outline"} className="text-xs">
                    {p.statut}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><StickyNote className="h-4 w-4" /> Notes chef de projet</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ajoutez vos notes pour cet événement…"
                value={notes[selected.id] || ""}
                onChange={(e) => setNotes((prev) => ({ ...prev, [selected.id]: e.target.value }))}
                rows={4}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
