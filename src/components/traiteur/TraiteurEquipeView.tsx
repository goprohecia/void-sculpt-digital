import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_COMMANDES, TRAITEUR_STEPS } from "@/data/mockTraiteurData";
import { TraiteurStepper } from "./TraiteurStepper";
import { UtensilsCrossed, MapPin, Clock, ClipboardCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function TraiteurEquipeView() {
  const commandes = MOCK_COMMANDES.filter((c) => c.step >= 4 && c.step < 7);
  const toutesCommandes = commandes.length > 0 ? commandes : [MOCK_COMMANDES[0]];
  const [selected, setSelected] = useState(toutesCommandes[0]);
  const [checksMap, setChecksMap] = useState<Record<string, Set<string>>>({});
  const [signalement, setSignalement] = useState("");
  const [signalementEnvoye, setSignalementEnvoye] = useState<Record<string, boolean>>({});

  const checks = checksMap[selected.id] ?? new Set<string>();

  const toggleCheck = (item: string) => {
    setChecksMap((prev) => {
      const s = new Set(prev[selected.id] ?? []);
      if (s.has(item)) s.delete(item); else s.add(item);
      return { ...prev, [selected.id]: s };
    });
  };

  const handleSignalement = () => {
    if (!signalement.trim()) return;
    setSignalementEnvoye((prev) => ({ ...prev, [selected.id]: true }));
    setSignalement("");
    toast.success("Signalement envoyé au gérant !");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><UtensilsCrossed className="h-6 w-6 text-primary" /> Espace Équipe / Cuisinier</h1>
        <p className="text-muted-foreground text-sm">Vos commandes à préparer</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {toutesCommandes.map((c) => (
          <Button key={c.id} variant={selected.id === c.id ? "default" : "outline"} size="sm" onClick={() => setSelected(c)}>
            {c.client} — {c.type}
          </Button>
        ))}
      </div>

      <Card className="glass-card"><CardContent className="p-4"><TraiteurStepper currentStep={selected.step} /></CardContent></Card>

      {/* Détails commande */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Détails de la commande</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Type</span><p className="font-medium">{selected.type}</p></div>
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Couverts</span><p className="font-medium">{selected.nbCouverts}</p></div>
            <div className="p-2 rounded-lg bg-muted/30 flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" /><div><span className="text-muted-foreground">Lieu</span><p className="font-medium">{selected.lieu}</p></div></div>
            <div className="p-2 rounded-lg bg-muted/30 flex items-start gap-2"><Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" /><div><span className="text-muted-foreground">Heure livraison</span><p className="font-medium">{selected.heureLivraison}</p></div></div>
          </div>

          {/* Menu détaillé */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu</p>
            {selected.menu.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 text-sm">
                <div><span className="text-muted-foreground text-xs">{m.categorie}</span> <span className="font-medium ml-1">{m.nom}</span></div>
                <span className="text-muted-foreground">×{m.quantite}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checklist préparation */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardCheck className="h-4 w-4" /> Checklist préparation</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {selected.checklistPrep.map((item) => (
            <label key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
              <Checkbox checked={checks.has(item)} onCheckedChange={() => toggleCheck(item)} />
              <span className="text-sm">{item}</span>
            </label>
          ))}
          <p className="text-xs text-muted-foreground pt-2">{checks.size}/{selected.checklistPrep.length} étapes complétées</p>
        </CardContent>
      </Card>

      {/* Signalement */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Signaler un problème</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {signalementEnvoye[selected.id] ? (
            <div className="p-3 rounded-lg bg-primary/5 text-sm">
              <p className="font-medium">Signalement envoyé ✓</p>
              <p className="text-xs text-muted-foreground">Le gérant a été notifié.</p>
            </div>
          ) : (
            <>
              <Textarea placeholder="Décrivez le problème (rupture ingrédient, retard, matériel manquant...)" value={signalement} onChange={(e) => setSignalement(e.target.value)} rows={3} />
              <Button onClick={handleSignalement} variant="outline" disabled={!signalement.trim()}>
                <AlertCircle className="h-4 w-4 mr-2" /> Envoyer au gérant
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
