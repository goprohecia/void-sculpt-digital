import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useDevis } from "@/hooks/use-devis";
import { useClients } from "@/hooks/use-clients";
import { DEMO_CLIENT_ID } from "@/data/mockData";
import { FileText, Check, X, Eraser, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import SignaturePad, { type SignaturePadRef } from "@/components/SignaturePad";
import { generateDevisPdf } from "@/lib/generatePdf";

export default function ClientDevis() {
  const { getDevisByClient, updateDevisStatut, updateDevisSignature } = useDevis();
  const { getClientById } = useClients();
  const mesDevis = getDevisByClient(DEMO_CLIENT_ID);
  const client = getClientById(DEMO_CLIENT_ID);

  const [bonPourAccord, setBonPourAccord] = useState(false);
  const [signatureEmpty, setSignatureEmpty] = useState(true);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState<string | null>(null);
  const signaturePadRef = useRef<SignaturePadRef>(null);

  const handleAccept = (id: string) => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) return;
    const signatureDataUrl = signaturePadRef.current.toDataURL();
    const signataireNom = client ? `${client.prenom} ${client.nom}` : "Client";
    const dateSignature = new Date().toISOString();

    updateDevisStatut({ id, statut: "accepte" });
    updateDevisSignature({ id, signatureDataUrl, signataireNom, dateSignature });
    toast.success("Devis accepté et signé");
    resetSignatureState();
  };

  const handleRefuse = (id: string) => {
    updateDevisStatut({ id, statut: "refuse" });
    toast.success("Devis refusé");
  };

  const resetSignatureState = () => {
    setBonPourAccord(false);
    setSignatureEmpty(true);
    setAcceptDialogOpen(null);
  };

  const canConfirm = !signatureEmpty && bonPourAccord;

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-[hsl(200,100%,60%)]" />
              Mes devis
            </h1>
            <p className="text-muted-foreground text-sm">{mesDevis.length} devis</p>
          </motion.div>

          {/* Desktop Table */}
          <motion.div className="glass-card overflow-hidden hidden sm:block" variants={staggerItem}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Référence</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Description</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Montant</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Validité</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mesDevis.map((d) => (
                    <tr key={d.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs">{d.reference}</td>
                      <td className="py-3 px-4">{d.titre}</td>
                      <td className="py-3 px-4 text-right font-medium">{d.montant.toLocaleString()} €</td>
                      <td className="py-3 px-4 text-center"><StatusBadge status={d.statut} /></td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{new Date(d.dateValidite).toLocaleDateString("fr-FR")}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1 justify-center">
                          {d.statut === "en_attente" && (
                            <>
                              <Dialog open={acceptDialogOpen === d.id} onOpenChange={(open) => { if (!open) resetSignatureState(); else setAcceptDialogOpen(d.id); }}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-[hsl(155,100%,55%)] border-[hsl(155,100%,45%)]/30">
                                    <Check className="h-3 w-3" /> Accepter
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader><DialogTitle>Signer et accepter le devis</DialogTitle></DialogHeader>
                                  <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                      <p className="font-medium text-foreground">{d.titre}</p>
                                      <p>Montant : {d.montant.toLocaleString()} € TTC</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Votre signature</label>
                                      <SignaturePad ref={signaturePadRef} onSignatureChange={(empty) => setSignatureEmpty(empty)} />
                                      <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => signaturePadRef.current?.clear()}>
                                        <Eraser className="h-3 w-3" /> Effacer
                                      </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox id={`bon-${d.id}`} checked={bonPourAccord} onCheckedChange={(v) => setBonPourAccord(v === true)} />
                                      <label htmlFor={`bon-${d.id}`} className="text-sm cursor-pointer">J'appose la mention « Bon pour accord »</label>
                                    </div>
                                    <div className="flex gap-2 justify-end pt-2">
                                      <Button variant="outline" size="sm" onClick={resetSignatureState}>Annuler</Button>
                                      <Button size="sm" disabled={!canConfirm} onClick={() => handleAccept(d.id)}>Confirmer et signer</Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive border-destructive/30">
                                    <X className="h-3 w-3" /> Refuser
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader><DialogTitle>Refuser ce devis ?</DialogTitle></DialogHeader>
                                  <p className="text-sm text-muted-foreground">{d.titre} — {d.montant.toLocaleString()} €</p>
                                  <div className="flex gap-2 justify-end pt-2">
                                    <DialogClose asChild><Button variant="outline" size="sm">Annuler</Button></DialogClose>
                                    <DialogClose asChild><Button size="sm" variant="destructive" onClick={() => handleRefuse(d.id)}>Confirmer le refus</Button></DialogClose>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => generateDevisPdf(d, client)}>
                            <Download className="h-3 w-3" /> PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Mobile Card Stack */}
          <motion.div className="space-y-3 sm:hidden" variants={staggerContainer} initial="initial" animate="animate">
            {mesDevis.map((d) => (
              <motion.div key={d.id} variants={staggerItem} className="glass-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{d.reference}</span>
                  <StatusBadge status={d.statut} />
                </div>
                <p className="font-medium text-sm">{d.titre}</p>
                <div className="flex items-center justify-between pt-1 border-t border-border/20">
                  <span className="text-sm font-medium">{d.montant.toLocaleString()} €</span>
                  <span className="text-xs text-muted-foreground">Valide jusqu'au {new Date(d.dateValidite).toLocaleDateString("fr-FR")}</span>
                </div>
                {d.statut === "en_attente" && (
                  <div className="flex gap-2 pt-2">
                    <Dialog open={acceptDialogOpen === d.id} onOpenChange={(open) => { if (!open) resetSignatureState(); else setAcceptDialogOpen(d.id); }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                          <Check className="h-3 w-3 mr-1" /> Accepter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw]">
                        <DialogHeader><DialogTitle>Signer et accepter</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">{d.titre} — {d.montant.toLocaleString()} €</p>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Votre signature</label>
                            <SignaturePad ref={signaturePadRef} onSignatureChange={(empty) => setSignatureEmpty(empty)} height={120} />
                            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => signaturePadRef.current?.clear()}>
                              <Eraser className="h-3 w-3" /> Effacer
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id={`bon-mob-${d.id}`} checked={bonPourAccord} onCheckedChange={(v) => setBonPourAccord(v === true)} />
                            <label htmlFor={`bon-mob-${d.id}`} className="text-xs cursor-pointer">J'appose la mention « Bon pour accord »</label>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={resetSignatureState}>Annuler</Button>
                            <Button size="sm" disabled={!canConfirm} onClick={() => handleAccept(d.id)}>Confirmer</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs text-destructive" onClick={() => handleRefuse(d.id)}>
                      <X className="h-3 w-3 mr-1" /> Refuser
                    </Button>
                  </div>
                )}
                <Button size="sm" variant="ghost" className="w-full h-8 text-xs gap-1" onClick={() => generateDevisPdf(d, client)}>
                  <Download className="h-3 w-3" /> Télécharger PDF
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
