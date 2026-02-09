import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, FileText } from "lucide-react";
import { toast } from "sonner";
import type { CahierDesCharges } from "@/contexts/DemoDataContext";

interface CahierDesChargesViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cahier: CahierDesCharges | null;
  demandeTitre?: string;
}

function Section({ title, content }: { title: string; content: string | string[] | undefined }) {
  if (!content || (Array.isArray(content) && content.length === 0)) return null;
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      {Array.isArray(content) ? (
        <ul className="list-disc list-inside space-y-0.5 text-sm text-muted-foreground">
          {content.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
}

export function CahierDesChargesView({ open, onOpenChange, cahier, demandeTitre }: CahierDesChargesViewProps) {
  if (!cahier) return null;

  const copyToClipboard = () => {
    const lines = [
      `CAHIER DES CHARGES — ${demandeTitre || ""}`,
      `Statut : ${cahier.statut === "complet" ? "Complet" : "Brouillon"}`,
      `Dernière MAJ : ${cahier.dateMiseAJour}`,
      "",
      "--- CONTEXTE ---", cahier.contexte,
      "", "--- PUBLIC CIBLE ---", cahier.publicCible,
      "", "--- FONCTIONNALITÉS ---", cahier.fonctionnalites.map((f, i) => `${i + 1}. ${f}`).join("\n"),
      "", "--- DESIGN ---", cahier.designNotes,
      "", "--- CONTRAINTES TECHNIQUES ---", cahier.contraintesTechniques,
      "", "--- PLANNING ---", cahier.planningSouhaite,
      "", "--- BUDGET ---", cahier.budgetComplementaire,
      "", "--- REMARQUES ---", cahier.remarques,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines);
    toast.success("Cahier des charges copié");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <DialogTitle>Cahier des charges</DialogTitle>
            <Badge variant={cahier.statut === "complet" ? "default" : "secondary"}>
              {cahier.statut === "complet" ? "Complet" : "Brouillon"}
            </Badge>
          </div>
          {demandeTitre && <p className="text-sm text-muted-foreground mt-1">{demandeTitre}</p>}
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Section title="Contexte du projet" content={cahier.contexte} />
          <Section title="Public cible" content={cahier.publicCible} />
          <Section title="Fonctionnalités attendues" content={cahier.fonctionnalites} />
          <Section title="Design et charte graphique" content={cahier.designNotes} />
          <Section title="Contraintes techniques" content={cahier.contraintesTechniques} />
          <Section title="Planning souhaité" content={cahier.planningSouhaite} />
          <Section title="Budget complémentaire" content={cahier.budgetComplementaire} />
          <Section title="Documents / Remarques" content={cahier.remarques} />
          <div className="text-xs text-muted-foreground pt-2 border-t border-border/20">
            Dernière mise à jour : {new Date(cahier.dateMiseAJour).toLocaleDateString("fr-FR")}
          </div>
          <Button variant="outline" onClick={copyToClipboard} className="w-full gap-1">
            <Copy className="h-4 w-4" /> Copier le contenu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
