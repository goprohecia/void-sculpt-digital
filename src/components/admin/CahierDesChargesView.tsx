import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, FileText, Download, MessageSquare, Save, Clock, CheckCircle2, PenLine, Send, UserCheck } from "lucide-react";
import { toast } from "sonner";
import type { CahierDesCharges } from "@/contexts/DemoDataContext";
import { useDemoData } from "@/contexts/DemoDataContext";
import { generateCdcPdf } from "@/lib/generateCdcPdf";

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
  const { updateCahierComment } = useDemoData();
  const [comment, setComment] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Sync local state when dialog opens with a new cahier
  if (cahier && open && !initialized) {
    setComment(cahier.commentairesAdmin || "");
    setInitialized(true);
  }
  if (!open && initialized) {
    setInitialized(false);
  }

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
      ...(cahier.commentairesAdmin ? ["", "--- COMMENTAIRES ADMIN ---", cahier.commentairesAdmin] : []),
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines);
    toast.success("Cahier des charges copié");
  };

  const handleExportPdf = () => {
    generateCdcPdf(cahier, demandeTitre);
    toast.success("PDF téléchargé");
  };

  const handleSaveComment = () => {
    updateCahierComment(cahier.demandeId, comment);
    toast.success("Commentaire enregistré");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <DialogTitle>Cahier des charges</DialogTitle>
            <Badge variant={cahier.statut === "validé" ? "default" : cahier.statut === "complet" ? "secondary" : "outline"}>
              {cahier.statut === "validé" ? "✓ Validé" : cahier.statut === "complet" ? "En attente de validation" : "Brouillon"}
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

          {/* Admin comments section */}
          <div className="border-t border-border/40 pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Commentaires admin</h4>
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajoutez vos remarques pour l'équipe dev..."
              className="min-h-[80px] text-sm"
            />
            <Button variant="outline" size="sm" onClick={handleSaveComment} className="gap-1">
              <Save className="h-3.5 w-3.5" /> Enregistrer le commentaire
            </Button>
          </div>

          {/* Historique */}
          {cahier.historique && cahier.historique.length > 0 && (
            <div className="border-t border-border/40 pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Historique</h4>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {[...cahier.historique].reverse().map((entry) => {
                  const iconMap = {
                    creation: <FileText className="h-3 w-3 text-muted-foreground" />,
                    mise_a_jour: <PenLine className="h-3 w-3 text-muted-foreground" />,
                    soumission: <Send className="h-3 w-3 text-[hsl(200,100%,60%)]" />,
                    commentaire_admin: <MessageSquare className="h-3 w-3 text-primary" />,
                    validation: <CheckCircle2 className="h-3 w-3 text-green-400" />,
                  };
                  return (
                    <div key={entry.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 text-xs">
                      {iconMap[entry.action]}
                      <span className="flex-1">{entry.description}</span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0">
                        {entry.auteur === "admin" ? "Admin" : "Client"}
                      </Badge>
                      <span className="text-muted-foreground whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString("fr-FR")} à {new Date(entry.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2 border-t border-border/20">
            Dernière mise à jour : {new Date(cahier.dateMiseAJour).toLocaleDateString("fr-FR")}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyToClipboard} className="flex-1 gap-1">
              <Copy className="h-4 w-4" /> Copier
            </Button>
            <Button onClick={handleExportPdf} className="flex-1 gap-1">
              <Download className="h-4 w-4" /> Exporter PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
