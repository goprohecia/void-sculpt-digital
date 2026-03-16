import { motion } from "framer-motion";
import { staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Link2, ShieldCheck, ExternalLink, Copy, Check, Pencil, Monitor, Smartphone, Tablet, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { CahierDesChargesView } from "@/components/admin/CahierDesChargesView";
import type { Dossier, Facture, Devis, PreviewVisit, CahierDesCharges } from "@/data/mockData";

interface Props {
  dossier: Dossier;
  facturesDossier: Facture[];
  devisDossier: Devis[];
  previewVisits: PreviewVisit[];
  cahier?: CahierDesCharges;
  demandeTitre?: string;
  onUpdatePreviewUrl: (args: { id: string; previewUrl: string }) => void;
  onValidateCdc?: (demandeId: string) => void;
  onAddPreviewVisit?: (dossierId: string) => void;
}

export function DossierResume({ dossier, facturesDossier, devisDossier, previewVisits, cahier, demandeTitre, onUpdatePreviewUrl, onValidateCdc, onAddPreviewVisit }: Props) {
  const [cdcViewOpen, setCdcViewOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [urlInput, setUrlInput] = useState(dossier.previewUrl || "");

  const totalMontant = dossier.montant;
  const encaisse = facturesDossier.filter(f => f.statut === "payee").reduce((s, f) => s + f.montant, 0);
  const restantDu = totalMontant - encaisse;

  const copyToClipboard = () => {
    if (!dossier.previewUrl) return;
    navigator.clipboard.writeText(dossier.previewUrl);
    setCopied(true);
    toast.success("Lien copié");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveUrl = () => {
    onUpdatePreviewUrl({ id: dossier.id, previewUrl: urlInput });
    setEditing(false);
    toast.success("Lien de preview mis à jour");
  };

  return (
    <div className="space-y-5">
      {/* Bloc financier */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">Montant total</p>
          <p className="text-xl font-bold">{totalMontant.toLocaleString()} €</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">Encaissé</p>
          <p className="text-xl font-bold text-[hsl(var(--primary))]">{encaisse.toLocaleString()} €</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">Restant dû</p>
          <p className="text-xl font-bold text-destructive">{restantDu.toLocaleString()} €</p>
        </div>
      </div>

      {/* CDC résumé */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Cahier des charges
          {cahier && (
            <Badge variant={cahier.statut === "validé" ? "default" : cahier.statut === "rejeté" ? "destructive" : "outline"} className="ml-1">
              {cahier.statut === "validé" ? "✓ Validé" : cahier.statut === "rejeté" ? "✗ Rejeté" : cahier.statut === "complet" ? "En validation" : "Brouillon"}
            </Badge>
          )}
        </h3>
        {cahier ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-2">{cahier.contexte}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setCdcViewOpen(true)}>
                <Eye className="h-3.5 w-3.5" /> Voir complet
              </Button>
              {cahier.statut === "complet" && onValidateCdc && (
                <Button size="sm" className="gap-1.5" onClick={() => { onValidateCdc(cahier.demandeId); toast.success("CDC validé"); }}>
                  <ShieldCheck className="h-3.5 w-3.5" /> Valider
                </Button>
              )}
            </div>
          </div>
        ) : <p className="text-sm text-muted-foreground">Aucun CDC associé</p>}
      </div>

      {/* Preview link */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" /> Lien de preview
        </h3>
        {editing ? (
          <div className="flex gap-2">
            <Input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://..." className="flex-1" />
            <Button size="sm" onClick={saveUrl}>Enregistrer</Button>
            <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setUrlInput(dossier.previewUrl || ""); }}>Annuler</Button>
          </div>
        ) : dossier.previewUrl ? (
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{dossier.previewUrl}</code>
            <Button size="sm" variant="outline" onClick={copyToClipboard}>{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</Button>
            <a href={dossier.previewUrl} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline"><ExternalLink className="h-3.5 w-3.5" /></Button></a>
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5" /></Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Aucun lien configuré</p>
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Ajouter</Button>
          </div>
        )}
      </div>

      {/* Devis + Factures rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-2">Devis ({devisDossier.length})</h3>
          {devisDossier.length > 0 ? devisDossier.slice(0, 3).map(d => (
            <div key={d.id} className="flex items-center justify-between py-1.5 text-sm">
              <span className="font-mono text-xs">{d.reference}</span>
              <div className="flex items-center gap-2">
                <span>{d.montant.toLocaleString()} €</span>
                <StatusBadge status={d.statut} />
              </div>
            </div>
          )) : <p className="text-sm text-muted-foreground">Aucun devis</p>}
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-2">Factures ({facturesDossier.length})</h3>
          {facturesDossier.length > 0 ? facturesDossier.slice(0, 3).map(f => (
            <div key={f.id} className="flex items-center justify-between py-1.5 text-sm">
              <span className="font-mono text-xs">{f.reference}</span>
              <div className="flex items-center gap-2">
                <span>{f.montant.toLocaleString()} €</span>
                <StatusBadge status={f.statut} />
              </div>
            </div>
          )) : <p className="text-sm text-muted-foreground">Aucune facture</p>}
        </div>
      </div>

      {/* Preview visits */}
      {dossier.previewUrl && previewVisits.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" /> Visites preview ({previewVisits.length})
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-muted/30 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{previewVisits.length}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{previewVisits.filter(v => new Date(v.date).toDateString() === new Date().toDateString()).length}</p>
              <p className="text-[10px] text-muted-foreground">Aujourd'hui</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{previewVisits.filter(v => { const d = new Date(v.date); const w = new Date(); w.setDate(w.getDate() - 7); return d >= w; }).length}</p>
              <p className="text-[10px] text-muted-foreground">7 jours</p>
            </div>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {previewVisits.slice(0, 10).map(v => (
              <div key={v.id} className="flex items-center justify-between p-1.5 rounded bg-muted/10 text-xs">
                <div className="flex items-center gap-1.5">
                  {v.device === "desktop" && <Monitor className="h-3 w-3 text-muted-foreground" />}
                  {v.device === "mobile" && <Smartphone className="h-3 w-3 text-muted-foreground" />}
                  {v.device === "tablet" && <Tablet className="h-3 w-3 text-muted-foreground" />}
                  <span className="capitalize">{v.device}</span>
                </div>
                <span className="text-muted-foreground">{new Date(v.date).toLocaleDateString("fr-FR")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <CahierDesChargesView open={cdcViewOpen} onOpenChange={setCdcViewOpen} cahier={cahier || null} demandeTitre={demandeTitre} />
    </div>
  );
}
