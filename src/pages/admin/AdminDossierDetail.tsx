import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useDossiers } from "@/hooks/use-dossiers";
import { useFactures } from "@/hooks/use-factures";
import { useDevis } from "@/hooks/use-devis";
import { usePreviewVisits } from "@/hooks/use-preview-visits";
import { useCahiers } from "@/hooks/use-cahiers";
import { useDemandes } from "@/hooks/use-demandes";
import { ArrowLeft, FolderOpen, ExternalLink, Copy, Check, Link2, Pencil, Eye, Monitor, Smartphone, Tablet, FileText, ShieldCheck, CalendarDays, Sparkles } from "lucide-react";
import { AIContextButton } from "@/components/admin/AIContextButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { DossierStatus } from "@/data/mockData";
import { CahierDesChargesView } from "@/components/admin/CahierDesChargesView";
import { DossierTimeline } from "@/components/admin/DossierTimeline";
import { useSubscription } from "@/hooks/use-subscription";

const etapes = ["Demande reçue", "Rendez-vous", "Cahier des charges", "Devis envoyé", "Devis accepté", "En cours", "Livraison", "Terminé"];

function getEtapeIndex(statut: string, rdvEffectue: boolean, cdcComplete: boolean): number {
  switch (statut) {
    case "en_attente":
      if (!rdvEffectue) return 0;
      if (!cdcComplete) return 1;
      return 2;
    case "en_cours": return 5;
    case "termine": return 7;
    case "annule": return -1;
    default: return 0;
  }
}

function PreviewLinkSection({ dossier, onUpdateUrl }: { dossier: { id: string; previewUrl?: string }; onUpdateUrl: (args: { id: string; previewUrl: string }) => void }) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [urlInput, setUrlInput] = useState(dossier.previewUrl || "");

  const copyToClipboard = () => {
    if (!dossier.previewUrl) return;
    navigator.clipboard.writeText(dossier.previewUrl);
    setCopied(true);
    toast.success("Lien copié dans le presse-papier");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveUrl = () => {
    onUpdateUrl({ id: dossier.id, previewUrl: urlInput });
    setEditing(false);
    toast.success("Lien de preview mis à jour");
  };

  return (
    <motion.div className="glass-card p-5" variants={staggerItem}>
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Link2 className="h-4 w-4 text-primary" />
        Lien de preview client
      </h2>
      {editing ? (
        <div className="flex gap-2">
          <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://projet-preview.lovable.app" className="flex-1" />
          <Button size="sm" onClick={saveUrl}>Enregistrer</Button>
          <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setUrlInput(dossier.previewUrl || ""); }}>Annuler</Button>
        </div>
      ) : dossier.previewUrl ? (
        <div className="flex items-center gap-2 flex-wrap">
          <code className="text-xs bg-muted px-2 py-1 rounded flex-1 min-w-0 truncate">{dossier.previewUrl}</code>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={copyToClipboard}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copié" : "Copier"}
          </Button>
          <a href={dossier.previewUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> Ouvrir</Button>
          </a>
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" /> Modifier
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">Aucun lien de preview configuré</p>
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Ajouter un lien</Button>
        </div>
      )}
    </motion.div>
  );
}

export default function AdminDossierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDossierById, updateDossierStatut, updateDossierPreviewUrl, marquerRdvEffectue } = useDossiers();
  const { isEnterprise } = useSubscription();
  const { getFacturesByDossier } = useFactures();
  const { getDevisByDossier } = useDevis();
  const { getPreviewVisitsByDossier, addPreviewVisit } = usePreviewVisits();
  const { getCahierByDemande, validateCahier, cahiersDesCharges } = useCahiers();
  const { demandes } = useDemandes();

  const dossier = id ? getDossierById(id) : undefined;
  const facturesDossier = id ? getFacturesByDossier(id) : [];
  const devisDossier = id ? getDevisByDossier(id) : [];
  const previewVisits = id ? getPreviewVisitsByDossier(id) : [];

  // Find cahier by dossier's demandeId
  const cahier = dossier?.demandeId ? getCahierByDemande(dossier.demandeId) : undefined;
  const demandeTitre = cahier ? demandes.find((d) => d.id === cahier.demandeId)?.titre : undefined;
  const [cdcViewOpen, setCdcViewOpen] = useState(false);

  if (!dossier) {
    return <AdminLayout><div className="p-8 text-center text-muted-foreground">Dossier introuvable</div></AdminLayout>;
  }

  const cdcComplete = cahier?.statut === "validé";
  const cdcSubmitted = cahier?.statut === "complet" || cahier?.statut === "validé";
  const cdcRejected = cahier?.statut === "rejeté";
  const rdvEffectue = dossier.rdvEffectue === true;
  const etapeActive = getEtapeIndex(dossier.statut, rdvEffectue, cdcComplete);

  const handleStatutChange = (val: string) => {
    updateDossierStatut({ id: dossier.id, statut: val as DossierStatus });
    toast.success(`Statut mis à jour : ${val}`);
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FolderOpen className="h-6 w-6 text-primary" />
                  {dossier.reference}
                </h1>
                <p className="text-muted-foreground text-sm">{dossier.typePrestation} — {dossier.clientNom}</p>
              </div>
              <div className="flex items-center gap-3">
                <AIContextButton
                  label="Résumé IA"
                  context={`DOSSIER SPÉCIFIQUE: ${dossier.reference}
- Client: ${dossier.clientNom}
- Prestation: ${dossier.typePrestation}
- Montant: ${dossier.montant.toLocaleString()} €
- Statut: ${dossier.statut}
- Date création: ${new Date(dossier.dateCreation).toLocaleDateString("fr-FR")}
- Échéance: ${dossier.dateEcheance ? new Date(dossier.dateEcheance).toLocaleDateString("fr-FR") : "Non définie"}
- RDV effectué: ${rdvEffectue ? "Oui" : "Non"}
- Cahier des charges: ${cdcComplete ? "Validé" : cdcRejected ? "Rejeté" : cdcSubmitted ? "En validation" : "À remplir"}
- Factures liées: ${facturesDossier.length}
- Devis liés: ${devisDossier.length}
- Visites preview: ${previewVisits.length}`}
                  prompt="Fais un résumé détaillé de ce dossier spécifique. Analyse son avancement, identifie les prochaines étapes à accomplir, les éventuels blocages et propose des recommandations pour faire avancer ce dossier."
                />
                <StatusBadge status={dossier.statut} />
                <Select value={dossier.statut} onValueChange={handleStatutChange}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div className="glass-card p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm" variants={staggerItem}>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Montant</p><p className="font-bold text-base sm:text-lg">{dossier.montant.toLocaleString()} €</p></div>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Création</p><p>{new Date(dossier.dateCreation).toLocaleDateString("fr-FR")}</p></div>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Échéance</p><p>{dossier.dateEcheance ? new Date(dossier.dateEcheance).toLocaleDateString("fr-FR") : "—"}</p></div>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Client</p><p>{dossier.clientNom}</p></div>
          </motion.div>

          {/* Timeline */}
          {dossier.statut !== "annule" && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Progression</h2>
                {!rdvEffectue && dossier.statut === "en_attente" && (
                  <Button size="sm" className="gap-1.5" onClick={() => { marquerRdvEffectue(dossier.id); toast.success("Rendez-vous marqué comme effectué"); }}>
                    <CalendarDays className="h-3.5 w-3.5" /> Marquer RDV effectué
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {etapes.map((e, i) => (
                  <div key={e} className="flex items-center flex-1 min-w-0">
                    <div className={`flex flex-col items-center flex-1 ${i <= etapeActive ? "text-primary" : "text-muted-foreground"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i <= etapeActive ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
                      }`}>
                        {i === 1 ? <CalendarDays className="h-3 w-3" /> : i === 2 ? <FileText className="h-3 w-3" /> : i + 1}
                      </div>
                      <span className="text-[10px] mt-1 text-center leading-tight">{e}</span>
                      {i === 1 && (
                        <span className={`text-[8px] ${rdvEffectue ? "text-green-400" : "text-muted-foreground"}`}>
                          {rdvEffectue ? "Effectué" : "À planifier"}
                        </span>
                      )}
                      {i === 2 && (
                        <span className={`text-[8px] ${cdcComplete ? "text-green-400" : cdcRejected ? "text-destructive" : cdcSubmitted ? "text-[hsl(200,100%,60%)]" : "text-muted-foreground"}`}>
                          {cdcComplete ? "Validé" : cdcRejected ? "Rejeté" : cdcSubmitted ? "En validation" : "À remplir"}
                        </span>
                      )}
                    </div>
                    {i < etapes.length - 1 && (
                      <div className={`h-0.5 flex-1 min-w-4 ${i < etapeActive ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Timeline de livraison */}
          {dossier.statut !== "annule" && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <DossierTimeline dossierId={dossier.id} isAdmin={true} isEnterprise={isEnterprise} />
            </motion.div>
          )}

          {/* Cahier des charges */}
          <motion.div className="glass-card p-5" variants={staggerItem}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Cahier des charges
              {cahier && (
                <>
                  <Badge variant={cahier.statut === "validé" ? "default" : cahier.statut === "rejeté" ? "destructive" : cahier.statut === "complet" ? "secondary" : "outline"} className="ml-1">
                    {cahier.statut === "validé" ? "✓ Validé" : cahier.statut === "rejeté" ? "✗ Rejeté" : cahier.statut === "complet" ? "En attente de validation" : "Brouillon"}
                  </Badge>
                  {(cahier.nbRejets || 0) >= 2 && (
                    <Badge variant="destructive" className="ml-1 text-[10px]">
                      {cahier.nbRejets} rejets
                    </Badge>
                  )}
                </>
              )}
            </h2>
            {cahier ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground line-clamp-3">{cahier.contexte}</div>
                {cahier.fonctionnalites.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Fonctionnalités ({cahier.fonctionnalites.length})</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                      {cahier.fonctionnalites.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}
                      {cahier.fonctionnalites.length > 3 && <li className="text-primary">+{cahier.fonctionnalites.length - 3} autres…</li>}
                    </ul>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setCdcViewOpen(true)}>
                    <Eye className="h-3.5 w-3.5" /> Voir le cahier des charges complet
                  </Button>
                  {cahier.statut === "complet" && (
                    <Button size="sm" className="gap-1.5" onClick={() => { validateCahier(cahier.demandeId); toast.success("Cahier des charges validé"); }}>
                      <ShieldCheck className="h-3.5 w-3.5" /> Valider le CDC
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun cahier des charges associé à ce dossier</p>
            )}
          </motion.div>

          <CahierDesChargesView open={cdcViewOpen} onOpenChange={setCdcViewOpen} cahier={cahier || null} demandeTitre={demandeTitre} />

          {/* Preview Link */}
          <PreviewLinkSection dossier={dossier} onUpdateUrl={updateDossierPreviewUrl} />

          {/* Preview Visits */}
          {dossier.previewUrl && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  Historique des visites ({previewVisits.length})
                </h2>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => addPreviewVisit(dossier.id)}>
                  + Simuler une visite
                </Button>
              </div>
              {previewVisits.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{previewVisits.length}</p>
                      <p className="text-xs text-muted-foreground">Total visites</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{previewVisits.filter(v => { const d = new Date(v.date); const now = new Date(); return d.toDateString() === now.toDateString(); }).length}</p>
                      <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{previewVisits.filter(v => { const d = new Date(v.date); const now = new Date(); const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 7); return d >= weekAgo; }).length}</p>
                      <p className="text-xs text-muted-foreground">7 derniers jours</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto">
                    {previewVisits.slice(0, 20).map((v) => (
                      <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/10 text-xs">
                        <div className="flex items-center gap-2">
                          {v.device === "desktop" && <Monitor className="h-3.5 w-3.5 text-muted-foreground" />}
                          {v.device === "mobile" && <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />}
                          {v.device === "tablet" && <Tablet className="h-3.5 w-3.5 text-muted-foreground" />}
                          <span className="capitalize">{v.device}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {new Date(v.date).toLocaleDateString("fr-FR")} à {new Date(v.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune visite enregistrée</p>
              )}
            </motion.div>
          )}

          {/* Devis */}
          <motion.div className="glass-card p-5" variants={staggerItem}>
            <h2 className="text-sm font-semibold mb-3">Devis associés ({devisDossier.length})</h2>
            {devisDossier.length > 0 ? (
              <div className="space-y-2">
                {devisDossier.map((d) => (
                  <div key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/20 gap-2">
                    <div><p className="text-sm font-mono">{d.reference}</p><p className="text-xs text-muted-foreground">{d.titre}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{d.montant.toLocaleString()} €</span>
                      <StatusBadge status={d.statut} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">Aucun devis</p>}
          </motion.div>

          {/* Factures */}
          <motion.div className="glass-card p-5" variants={staggerItem}>
            <h2 className="text-sm font-semibold mb-3">Factures associées ({facturesDossier.length})</h2>
            {facturesDossier.length > 0 ? (
              <div className="space-y-2">
                {facturesDossier.map((f) => (
                  <div key={f.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/20 gap-2">
                    <div><p className="text-sm font-mono">{f.reference}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{f.montant.toLocaleString()} €</span>
                      <StatusBadge status={f.statut} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">Aucune facture</p>}
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
