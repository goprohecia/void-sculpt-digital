import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PdfPreviewDialog } from "@/components/admin/PdfPreviewDialog";
import { useFactures } from "@/hooks/use-factures";
import { useDevis } from "@/hooks/use-devis";
import { useClients } from "@/hooks/use-clients";
import { useDossiers } from "@/hooks/use-dossiers";
import { useSendLogs } from "@/hooks/use-send-logs";
import { useIsDemo } from "@/hooks/useIsDemo";
import { supabase } from "@/integrations/supabase/client";
import type { FactureStatus, Facture, Devis } from "@/data/mockData";
import { Receipt, Euro, AlertTriangle, Plus, Download, Eye, Send, Clock } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { generateFacturePdf, generateDevisPdf, previewFacturePdf, previewDevisPdf } from "@/lib/generatePdf";

const factureFilters: { key: "tous" | FactureStatus; label: string }[] = [
  { key: "tous", label: "Toutes" },
  { key: "payee", label: "Payées" },
  { key: "en_attente", label: "En attente" },
  { key: "en_retard", label: "En retard" },
];

export default function AdminBilling() {
  const { factures, addFacture } = useFactures();
  const { devis, addDevis } = useDevis();
  const { clients, getClientById } = useClients();
  const { getDossiersByClient } = useDossiers();
  const { sendLogs, addSendLog } = useSendLogs();
  const { isDemo } = useIsDemo();

  const [filterStatut, setFilterStatut] = useState<"tous" | FactureStatus>("tous");
  const [openFacture, setOpenFacture] = useState(false);
  const [openDevis, setOpenDevis] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewClientName, setPreviewClientName] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDownload, setPreviewDownload] = useState<(() => void) | null>(null);
  const [previewSend, setPreviewSend] = useState<(() => void) | null>(null);

  const handlePreviewFacture = useCallback((f: Facture) => {
    const url = previewFacturePdf(f, getClientById(f.clientId));
    setPreviewUrl(url);
    setPreviewTitle(`Facture ${f.reference}`);
    setPreviewClientName(f.clientNom);
    setPreviewDownload(() => () => { generateFacturePdf(f, getClientById(f.clientId)); toast.success(`PDF ${f.reference} téléchargé`); });
    setPreviewSend(() => () => { addSendLog("facture", f.reference, f.clientId, f.clientNom); });
    setPreviewOpen(true);
  }, [getClientById, addSendLog]);

  const handlePreviewDevis = useCallback((d: Devis) => {
    const url = previewDevisPdf(d, getClientById(d.clientId));
    setPreviewUrl(url);
    setPreviewTitle(`Devis ${d.reference}`);
    setPreviewClientName(d.clientNom);
    setPreviewDownload(() => () => { generateDevisPdf(d, getClientById(d.clientId)); toast.success(`PDF ${d.reference} téléchargé`); });
    setPreviewSend(() => () => { addSendLog("devis", d.reference, d.clientId, d.clientNom); });
    setPreviewOpen(true);
  }, [getClientById, addSendLog]);

  // New facture form
  const [fClientId, setFClientId] = useState("");
  const [fDossierId, setFDossierId] = useState("");
  const [fMontant, setFMontant] = useState("");
  const [fEcheance, setFEcheance] = useState("");

  // New devis form
  const [dClientId, setDClientId] = useState("");
  const [dDossierId, setDDossierId] = useState("");
  const [dTitre, setDTitre] = useState("");
  const [dMontant, setDMontant] = useState("");
  const [dValidite, setDValidite] = useState("");

  const filteredFactures = factures.filter((f) => filterStatut === "tous" || f.statut === filterStatut);
  const statsFactures = {
    total: factures.reduce((acc, f) => acc + f.montant, 0),
    payees: factures.filter((f) => f.statut === "payee").reduce((acc, f) => acc + f.montant, 0),
    enRetard: factures.filter((f) => f.statut === "en_retard").reduce((acc, f) => acc + f.montant, 0),
  };

  const fClientDossiers = fClientId ? getDossiersByClient(fClientId) : [];
  const dClientDossiers = dClientId ? getDossiersByClient(dClientId) : [];

  const handleAddFacture = () => {
    if (!fClientId || !fMontant) { toast.error("Client et montant requis"); return; }
    const client = clients.find((c) => c.id === fClientId);
    addFacture({
      id: `f${Date.now()}`, reference: `FAC-2026-${String(factures.length + 16).padStart(3, "0")}`,
      clientId: fClientId, clientNom: client?.entreprise || "", dossierId: fDossierId,
      montant: parseFloat(fMontant), statut: "en_attente",
      dateEmission: new Date().toISOString().split("T")[0], dateEcheance: fEcheance || new Date().toISOString().split("T")[0],
    });
    toast.success("Facture créée");
    setOpenFacture(false); setFClientId(""); setFDossierId(""); setFMontant(""); setFEcheance("");
  };

  const handleAddDevis = async () => {
    if (!dClientId || !dMontant || !dTitre) { toast.error("Client, titre et montant requis"); return; }
    const client = clients.find((c) => c.id === dClientId);
    const ref = `DEV-2026-${String(devis.length + 13).padStart(3, "0")}`;
    const validite = dValidite || new Date().toISOString().split("T")[0];
    addDevis({
      id: `dv${Date.now()}`, reference: ref,
      clientId: dClientId, clientNom: client?.entreprise || "", dossierId: dDossierId || undefined,
      titre: dTitre, montant: parseFloat(dMontant), statut: "en_attente",
      dateEmission: new Date().toISOString().split("T")[0], dateValidite: validite,
    });

    // Send real email via edge function when not in demo
    if (!isDemo && client?.email) {
      try {
        await supabase.functions.invoke("send-devis", {
          body: {
            email: client.email,
            prenom: client.prenom,
            devisRef: ref,
            titre: dTitre,
            montant: parseFloat(dMontant),
            dateValidite: validite,
          },
        });
      } catch (e: any) {
        console.error("Erreur envoi email devis:", e);
      }
    }

    toast.success("Devis créé");
    setOpenDevis(false); setDClientId(""); setDDossierId(""); setDTitre(""); setDMontant(""); setDValidite("");
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" />
              Facturation
            </h1>
          </motion.div>

          {/* Summary */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={staggerItem} className="glass-card p-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5"><Euro className="h-5 w-5 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">Total facturé</p><p className="text-lg font-bold">{statsFactures.total.toLocaleString()} €</p></div>
            </motion.div>
            <motion.div variants={staggerItem} className="glass-card p-4 flex items-center gap-3">
              <div className="rounded-xl bg-[hsl(155,100%,45%)]/10 p-2.5"><Euro className="h-5 w-5 text-[hsl(155,100%,55%)]" /></div>
              <div><p className="text-xs text-muted-foreground">Encaissé</p><p className="text-lg font-bold text-[hsl(155,100%,65%)]">{statsFactures.payees.toLocaleString()} €</p></div>
            </motion.div>
            <motion.div variants={staggerItem} className="glass-card p-4 flex items-center gap-3">
              <div className="rounded-xl bg-destructive/10 p-2.5"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
              <div><p className="text-xs text-muted-foreground">En retard</p><p className="text-lg font-bold text-destructive">{statsFactures.enRetard.toLocaleString()} €</p></div>
            </motion.div>
          </motion.div>

          <Tabs defaultValue="factures">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <TabsList>
                <TabsTrigger value="factures">Factures ({factures.length})</TabsTrigger>
                <TabsTrigger value="devis">Devis ({devis.length})</TabsTrigger>
                <TabsTrigger value="historique" className="gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Envois ({sendLogs.length})
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Dialog open={openFacture} onOpenChange={setOpenFacture}>
                  <DialogTrigger asChild><Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Facture</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Nouvelle facture</DialogTitle></DialogHeader>
                    <div className="space-y-3 pt-2">
                      <div><label className="text-sm font-medium block mb-1">Client *</label>
                        <Select value={fClientId} onValueChange={(v) => { setFClientId(v); setFDossierId(""); }}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.entreprise}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      {fClientDossiers.length > 0 && <div><label className="text-sm font-medium block mb-1">Dossier</label>
                        <Select value={fDossierId} onValueChange={setFDossierId}>
                          <SelectTrigger><SelectValue placeholder="Associer à un dossier" /></SelectTrigger>
                          <SelectContent>{fClientDossiers.map((d) => <SelectItem key={d.id} value={d.id}>{d.reference} — {d.typePrestation}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>}
                      <div><label className="text-sm font-medium block mb-1">Montant (€) *</label><Input type="number" value={fMontant} onChange={(e) => setFMontant(e.target.value)} /></div>
                      <div><label className="text-sm font-medium block mb-1">Échéance</label><Input type="date" value={fEcheance} onChange={(e) => setFEcheance(e.target.value)} /></div>
                      <Button onClick={handleAddFacture} className="w-full">Créer la facture</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={openDevis} onOpenChange={setOpenDevis}>
                  <DialogTrigger asChild><Button size="sm" variant="outline" className="gap-1"><Plus className="h-4 w-4" /> Devis</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Nouveau devis</DialogTitle></DialogHeader>
                    <div className="space-y-3 pt-2">
                      <div><label className="text-sm font-medium block mb-1">Client *</label>
                        <Select value={dClientId} onValueChange={(v) => { setDClientId(v); setDDossierId(""); }}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.entreprise}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      {dClientDossiers.length > 0 && <div><label className="text-sm font-medium block mb-1">Dossier</label>
                        <Select value={dDossierId} onValueChange={setDDossierId}>
                          <SelectTrigger><SelectValue placeholder="Associer à un dossier" /></SelectTrigger>
                          <SelectContent>{dClientDossiers.map((d) => <SelectItem key={d.id} value={d.id}>{d.reference} — {d.typePrestation}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>}
                      <div><label className="text-sm font-medium block mb-1">Titre *</label><Input value={dTitre} onChange={(e) => setDTitre(e.target.value)} /></div>
                      <div><label className="text-sm font-medium block mb-1">Montant (€) *</label><Input type="number" value={dMontant} onChange={(e) => setDMontant(e.target.value)} /></div>
                      <div><label className="text-sm font-medium block mb-1">Date de validité</label><Input type="date" value={dValidite} onChange={(e) => setDValidite(e.target.value)} /></div>
                      <Button onClick={handleAddDevis} className="w-full">Créer le devis</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="factures" className="space-y-4 mt-4">
              <motion.div className="flex gap-2 flex-wrap" variants={staggerItem}>
                {factureFilters.map((s) => (
                  <button key={s.key} onClick={() => setFilterStatut(s.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatut === s.key ? "bg-primary text-primary-foreground" : "glass-button"}`}>
                    {s.label}
                  </button>
                ))}
              </motion.div>
              {/* Mobile cards factures */}
              <div className="sm:hidden space-y-3">
                {filteredFactures.length === 0 ? (
                  <AdminEmptyState icon={Receipt} title="Aucune facture" description="Vos factures apparaîtront ici." hint="Créez votre première facture avec le bouton ci-dessus." />
                ) : filteredFactures.map((f) => (
                  <div key={f.id} className="glass-card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs">{f.reference}</span>
                      <StatusBadge status={f.statut} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{f.clientNom}</span>
                      <span className="font-medium">{f.montant.toLocaleString()} €</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{new Date(f.dateEmission).toLocaleDateString("fr-FR")}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handlePreviewFacture(f)} className="flex items-center gap-1 text-primary hover:underline">
                          <Eye className="h-3 w-3" /> Aperçu
                        </button>
                        <button onClick={() => { generateFacturePdf(f, getClientById(f.clientId)); toast.success(`PDF ${f.reference} téléchargé`); }}
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                          <Download className="h-3 w-3" /> PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table factures */}
              <motion.div className="glass-card overflow-hidden hidden sm:block" variants={staggerItem}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Référence</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Client</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Montant</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Émission</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFactures.map((f) => (
                        <tr key={f.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs">{f.reference}</td>
                          <td className="py-3 px-4">{f.clientNom}</td>
                          <td className="py-3 px-4 text-right font-medium">{f.montant.toLocaleString()} €</td>
                          <td className="py-3 px-4 text-center"><StatusBadge status={f.statut} /></td>
                          <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{new Date(f.dateEmission).toLocaleDateString("fr-FR")}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => handlePreviewFacture(f)} className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-primary hover:text-primary/80" title="Aperçu">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button onClick={() => { generateFacturePdf(f, getClientById(f.clientId)); toast.success(`PDF ${f.reference} téléchargé`); }}
                                className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Télécharger PDF">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredFactures.length === 0 && <AdminEmptyState icon={Receipt} title="Aucune facture" description="Vos factures apparaîtront ici." hint="Créez votre première facture avec le bouton ci-dessus." />}
              </motion.div>
            </TabsContent>

            <TabsContent value="devis" className="space-y-4 mt-4">
              {/* Mobile cards devis */}
              <div className="sm:hidden space-y-3">
                {devis.length === 0 ? (
                  <AdminEmptyState icon={Receipt} title="Aucun devis" description="Vos devis apparaîtront ici." hint="Créez votre premier devis avec le bouton ci-dessus." />
                ) : devis.map((d) => (
                  <div key={d.id} className="glass-card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs">{d.reference}</span>
                      <StatusBadge status={d.statut} />
                    </div>
                    <p className="text-sm font-medium">{d.titre}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{d.clientNom}</span>
                      <span className="font-medium">{d.montant.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handlePreviewDevis(d)} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Eye className="h-3 w-3" /> Aperçu
                      </button>
                      <button onClick={() => { generateDevisPdf(d, getClientById(d.clientId)); toast.success(`PDF ${d.reference} téléchargé`); }}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        <Download className="h-3 w-3" /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table devis */}
              <motion.div className="glass-card overflow-hidden hidden sm:block" variants={staggerItem}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Référence</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Client</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Titre</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Montant</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devis.map((d) => (
                        <tr key={d.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs">{d.reference}</td>
                          <td className="py-3 px-4">{d.clientNom}</td>
                          <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{d.titre}</td>
                          <td className="py-3 px-4 text-right font-medium">{d.montant.toLocaleString()} €</td>
                          <td className="py-3 px-4 text-center"><StatusBadge status={d.statut} /></td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => handlePreviewDevis(d)} className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-primary hover:text-primary/80" title="Aperçu">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button onClick={() => { generateDevisPdf(d, getClientById(d.clientId)); toast.success(`PDF ${d.reference} téléchargé`); }}
                                className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Télécharger PDF">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {devis.length === 0 && <div className="p-8 text-center text-muted-foreground">Aucun devis</div>}
              </motion.div>
            </TabsContent>

            <TabsContent value="historique" className="space-y-4 mt-4">
              {sendLogs.length === 0 ? (
                <div className="glass-card p-8 text-center text-muted-foreground">
                  <Send className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <p>Aucun envoi pour le moment</p>
                  <p className="text-xs mt-1">Les documents envoyés via l'aperçu apparaîtront ici</p>
                </div>
              ) : (
                <>
                  {/* Mobile cards */}
                  <div className="sm:hidden space-y-3">
                    {sendLogs.map((log) => (
                      <div key={log.id} className="glass-card p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs">{log.docReference}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            log.docType === "facture" ? "bg-primary/10 text-primary" : "bg-accent/50 text-accent-foreground"
                          }`}>
                            {log.docType === "facture" ? "Facture" : "Devis"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{log.clientNom}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.dateEnvoi).toLocaleDateString("fr-FR")} à {new Date(log.dateEnvoi).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <motion.div className="glass-card overflow-hidden hidden sm:block" variants={staggerItem}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50 bg-muted/20">
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Référence</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Client</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date d'envoi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sendLogs.map((log) => (
                            <tr key={log.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                              <td className="py-3 px-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  log.docType === "facture" ? "bg-primary/10 text-primary" : "bg-accent/50 text-accent-foreground"
                                }`}>
                                  {log.docType === "facture" ? "Facture" : "Devis"}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-xs">{log.docReference}</td>
                              <td className="py-3 px-4">{log.clientNom}</td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {new Date(log.dateEnvoi).toLocaleDateString("fr-FR")} à {new Date(log.dateEnvoi).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        <PdfPreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          pdfUrl={previewUrl}
          title={previewTitle}
          clientName={previewClientName}
          onDownload={previewDownload || undefined}
          onSend={previewSend || undefined}
        />
      </AdminPageTransition>
    </AdminLayout>
  );
}
