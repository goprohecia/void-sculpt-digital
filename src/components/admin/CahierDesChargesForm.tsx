import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { CahierDesCharges } from "@/contexts/DemoDataContext";

interface CahierDesChargesFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demandeId: string;
  existing?: CahierDesCharges | null;
  onSave: (cahier: CahierDesCharges) => void;
}

export function CahierDesChargesForm({ open, onOpenChange, demandeId, existing, onSave }: CahierDesChargesFormProps) {
  const [contexte, setContexte] = useState("");
  const [publicCible, setPublicCible] = useState("");
  const [fonctionnalites, setFonctionnalites] = useState<string[]>([""]);
  const [designNotes, setDesignNotes] = useState("");
  const [contraintesTechniques, setContraintesTechniques] = useState("");
  const [planningSouhaite, setPlanningSouhaite] = useState("");
  const [budgetComplementaire, setBudgetComplementaire] = useState("");
  const [remarques, setRemarques] = useState("");

  useEffect(() => {
    if (existing) {
      setContexte(existing.contexte);
      setPublicCible(existing.publicCible);
      setFonctionnalites(existing.fonctionnalites.length > 0 ? [...existing.fonctionnalites] : [""]);
      setDesignNotes(existing.designNotes);
      setContraintesTechniques(existing.contraintesTechniques);
      setPlanningSouhaite(existing.planningSouhaite);
      setBudgetComplementaire(existing.budgetComplementaire);
      setRemarques(existing.remarques);
    } else {
      setContexte(""); setPublicCible(""); setFonctionnalites([""]); setDesignNotes("");
      setContraintesTechniques(""); setPlanningSouhaite(""); setBudgetComplementaire(""); setRemarques("");
    }
  }, [existing, open]);

  const addFonctionnalite = () => setFonctionnalites((prev) => [...prev, ""]);
  const removeFonctionnalite = (idx: number) => setFonctionnalites((prev) => prev.filter((_, i) => i !== idx));
  const updateFonctionnalite = (idx: number, val: string) => setFonctionnalites((prev) => prev.map((f, i) => (i === idx ? val : f)));

  const buildCahier = (statut: "brouillon" | "complet"): CahierDesCharges => ({
    id: existing?.id || `cdc_${Date.now()}`,
    demandeId,
    contexte: contexte.trim(),
    publicCible: publicCible.trim(),
    fonctionnalites: fonctionnalites.map((f) => f.trim()).filter(Boolean),
    designNotes: designNotes.trim(),
    contraintesTechniques: contraintesTechniques.trim(),
    planningSouhaite: planningSouhaite.trim(),
    budgetComplementaire: budgetComplementaire.trim(),
    remarques: remarques.trim(),
    statut,
    dateMiseAJour: new Date().toISOString().split("T")[0],
  });

  const handleSaveDraft = () => {
    onSave(buildCahier("brouillon"));
    toast.success("Brouillon enregistré");
    onOpenChange(false);
  };

  const handleFinalize = () => {
    if (!contexte.trim()) { toast.error("Le contexte du projet est requis"); return; }
    onSave(buildCahier("complet"));
    toast.success("Cahier des charges finalisé");
    onOpenChange(false);
  };

  const sectionClass = "space-y-2";
  const sectionTitle = "text-sm font-semibold text-foreground";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cahier des charges</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          {/* Contexte */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Contexte du projet *</Label>
            <Textarea value={contexte} onChange={(e) => setContexte(e.target.value)} placeholder="Présentez votre entreprise et les objectifs du projet..." rows={3} />
          </div>

          {/* Public cible */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Public cible</Label>
            <Textarea value={publicCible} onChange={(e) => setPublicCible(e.target.value)} placeholder="Décrivez les utilisateurs visés, personas..." rows={2} />
          </div>

          {/* Fonctionnalités */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Fonctionnalités attendues</Label>
            {fonctionnalites.map((f, idx) => (
              <div key={idx} className="flex gap-2">
                <Input value={f} onChange={(e) => updateFonctionnalite(idx, e.target.value)} placeholder={`Fonctionnalité ${idx + 1}`} />
                {fonctionnalites.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFonctionnalite(idx)} className="shrink-0">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addFonctionnalite} className="gap-1">
              <Plus className="h-3 w-3" /> Ajouter
            </Button>
          </div>

          {/* Design */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Design et charte graphique</Label>
            <Textarea value={designNotes} onChange={(e) => setDesignNotes(e.target.value)} placeholder="Préférences visuelles, couleurs, inspirations (URLs)..." rows={2} />
          </div>

          {/* Contraintes techniques */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Contraintes techniques</Label>
            <Textarea value={contraintesTechniques} onChange={(e) => setContraintesTechniques(e.target.value)} placeholder="Technologies imposées, hébergement, intégrations tierces..." rows={2} />
          </div>

          {/* Planning */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Planning souhaité</Label>
            <Input value={planningSouhaite} onChange={(e) => setPlanningSouhaite(e.target.value)} placeholder="Date de livraison souhaitée, jalons..." />
          </div>

          {/* Budget */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Budget complémentaire</Label>
            <Input value={budgetComplementaire} onChange={(e) => setBudgetComplementaire(e.target.value)} placeholder="Informations budgétaires additionnelles..." />
          </div>

          {/* Remarques */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Documents / Remarques</Label>
            <Textarea value={remarques} onChange={(e) => setRemarques(e.target.value)} placeholder="Notes supplémentaires..." rows={3} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleSaveDraft} className="flex-1 gap-1">
              <Save className="h-4 w-4" /> Enregistrer brouillon
            </Button>
            <Button onClick={handleFinalize} className="flex-1 gap-1">
              <CheckCircle className="h-4 w-4" /> Finaliser
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
