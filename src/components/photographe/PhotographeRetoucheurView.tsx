import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_SEANCES } from "@/data/mockPhotographeData";
import { PhotographeStepper } from "./PhotographeStepper";
import { Camera, ImageIcon, Clock, Bell } from "lucide-react";
import { toast } from "sonner";

export function PhotographeRetoucheurView() {
  const mesSeances = MOCK_SEANCES.filter((s) => s.statut !== "terminee");
  const [selected, setSelected] = useState(mesSeances[0]);
  const [nbPhotos, setNbPhotos] = useState<Record<string, string>>({});
  const [tempsRetouche, setTempsRetouche] = useState<Record<string, string>>({});
  const [retouchesTerminees, setRetouchesTerminees] = useState<Record<string, boolean>>({});

  if (!selected) return null;

  const handleTerminerRetouches = () => {
    setRetouchesTerminees((prev) => ({ ...prev, [selected.id]: true }));
    toast.success("Retouches terminées — notification envoyée au client !");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Camera className="h-6 w-6 text-primary" /> Espace Photographe / Retoucheur</h1>
        <p className="text-muted-foreground text-sm">Gestion de vos séances et retouches</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {mesSeances.map((s) => (
          <Button key={s.id} variant={selected.id === s.id ? "default" : "outline"} size="sm" onClick={() => setSelected(s)}>{s.client} — {s.type}</Button>
        ))}
      </div>

      <Card className="glass-card"><CardContent className="p-4"><PhotographeStepper currentStep={retouchesTerminees[selected.id] ? 5 : selected.step} /></CardContent></Card>

      {/* Brief */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Brief créatif</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{selected.brief}</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Type</span><p className="font-medium">{selected.type}</p></div>
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Lieu</span><p className="font-medium">{selected.lieu}</p></div>
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Date</span><p className="font-medium">{new Date(selected.date).toLocaleDateString("fr-FR")}</p></div>
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Durée</span><p className="font-medium">{selected.duree}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Saisie photos */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Photos sélectionnées</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Nombre de clichés</Label>
              <Input type="number" value={nbPhotos[selected.id] ?? (selected.nbPhotos || "")} onChange={(e) => setNbPhotos((p) => ({ ...p, [selected.id]: e.target.value }))} disabled={!!retouchesTerminees[selected.id]} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Temps de retouche estimé</Label>
              <Input value={tempsRetouche[selected.id] ?? selected.tempsRetouche || ""} onChange={(e) => setTempsRetouche((p) => ({ ...p, [selected.id]: e.target.value }))} placeholder="ex: 6h" disabled={!!retouchesTerminees[selected.id]} />
            </div>
          </div>

          {retouchesTerminees[selected.id] ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5">
              <Bell className="h-4 w-4 text-primary" />
              <div><p className="text-sm font-medium">Retouches terminées</p><p className="text-xs text-muted-foreground">Le client a été notifié. La galerie peut être livrée.</p></div>
            </div>
          ) : (
            <Button onClick={handleTerminerRetouches} disabled={selected.step < 3}>
              <Clock className="h-4 w-4 mr-2" /> Retouches terminées — Notifier le client
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
