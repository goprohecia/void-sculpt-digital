import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { useDossiers } from "@/hooks/use-dossiers";
import { useFactures } from "@/hooks/use-factures";
import { useDevis } from "@/hooks/use-devis";
import { usePreviewVisits } from "@/hooks/use-preview-visits";
import { useCahiers } from "@/hooks/use-cahiers";
import { useDemandes } from "@/hooks/use-demandes";
import { useDemoData } from "@/contexts/DemoDataContext";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { isAssignationEnabled } from "@/data/sectorModules";
import { MOCK_TEAM_MEMBERS, type DossierAssignment } from "@/data/mockData";
import { AssignModal } from "@/components/admin/AssignModal";
import { ArrowLeft, FolderOpen, CalendarDays, FileText, Ban, Users, Crown, Shield, Star, Plus, X } from "lucide-react";
import { AIContextButton } from "@/components/admin/AIContextButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { DossierStatus } from "@/data/mockData";
import { DossierTimeline } from "@/components/admin/DossierTimeline";
import { DossierTeamPanel } from "@/components/admin/DossierTeamPanel";
import { useSubscription } from "@/hooks/use-subscription";

// Tab components
import { DossierResume } from "@/components/dossier/DossierResume";
import { DossierRDV } from "@/components/dossier/DossierRDV";
import { DossierPaiements } from "@/components/dossier/DossierPaiements";
import { DossierDocuments } from "@/components/dossier/DossierDocuments";
import { DossierPhotos } from "@/components/dossier/DossierPhotos";
import { DossierMesures } from "@/components/dossier/DossierMesures";
import { DossierMessages } from "@/components/dossier/DossierMessages";
import { DossierNotes } from "@/components/dossier/DossierNotes";

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

export default function AdminDossierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDossierById, updateDossierStatut, updateDossierPreviewUrl, marquerRdvEffectue } = useDossiers();
  const { isEnterprise } = useSubscription();
  const { getFacturesByDossier, updateFactureStatut } = useFactures();
  const { getDevisByDossier } = useDevis();
  const { getPreviewVisitsByDossier, addPreviewVisit } = usePreviewVisits();
  const { getCahierByDemande, validateCahier } = useCahiers();
  const { demandes } = useDemandes();
  const { getAssignmentsByDossier, assignDossier, addNotification } = useDemoData();
  const { demoSector } = useDemoPlan();
  const assignEnabled = isAssignationEnabled(demoSector);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignModalMode, setAssignModalMode] = useState<"full" | "add">("full");

  const dossier = id ? getDossierById(id) : undefined;
  const facturesDossier = id ? getFacturesByDossier(id) : [];
  const devisDossier = id ? getDevisByDossier(id) : [];
  const previewVisits = id ? getPreviewVisitsByDossier(id) : [];
  const currentAssignments = id ? getAssignmentsByDossier(id) : [];
  const cahier = dossier?.demandeId ? getCahierByDemande(dossier.demandeId) : undefined;
  const demandeTitre = cahier ? demandes.find((d) => d.id === cahier.demandeId)?.titre : undefined;

  const handleAssign = (assignments: DossierAssignment[]) => {
    assignDossier(dossier?.id ?? "", assignments);
    assignments.forEach((a, i) => {
      const member = MOCK_TEAM_MEMBERS.find((m) => m.id === a.employeeId);
      addNotification({
        id: `notif_assign_${Date.now()}_${i}`,
        type: "assignation",
        titre: "Nouveau dossier assigné",
        description: `${dossier?.reference ?? ""} — Vous êtes ${a.role === "responsable" ? "Responsable" : "Renfort"}`,
        date: new Date().toISOString(),
        lu: false,
        lien: `/admin/dossiers/${dossier?.id}`,
        destinataire: "employee",
        employeeId: a.employeeId,
        canal: "both",
      });
    });
  };

  const cancellationPolicy = { politique: "total" as const, pourcentagePartiel: 50, acomptePaye: 30 };
  const montantRembourse = cancellationPolicy.politique === "total"
    ? cancellationPolicy.acomptePaye
    : cancellationPolicy.politique === "partiel"
      ? Math.round(cancellationPolicy.acomptePaye * cancellationPolicy.pourcentagePartiel / 100)
      : 0;

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
          {/* ===== HEADER (unchanged) ===== */}
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
              <div className="flex items-center gap-3 flex-wrap">
                {dossier.statut !== "annule" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-1.5"><Ban className="h-3.5 w-3.5" /> Annuler la réservation</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <p>Vous êtes sur le point d'annuler le dossier <strong>{dossier.reference}</strong>.</p>
                          <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Acompte payé</span><span className="font-medium">{cancellationPolicy.acomptePaye} €</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Politique</span><span className="font-medium capitalize">{cancellationPolicy.politique === "total" ? "Remboursement total" : cancellationPolicy.politique === "partiel" ? `Partiel (${cancellationPolicy.pourcentagePartiel}%)` : "Aucun remboursement"}</span></div>
                            <Separator />
                            <div className="flex justify-between font-semibold"><span>Montant remboursé</span><span className="text-primary">{montantRembourse} €</span></div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { handleStatutChange("annule"); toast.success(`Réservation annulée — Remboursement de ${montantRembourse} € initié`); }}>Confirmer l'annulation</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <AIContextButton
                  label="Résumé IA"
                  context={`DOSSIER: ${dossier.reference}\n- Client: ${dossier.clientNom}\n- Prestation: ${dossier.typePrestation}\n- Montant: ${dossier.montant.toLocaleString()} €\n- Statut: ${dossier.statut}`}
                  prompt="Fais un résumé détaillé de ce dossier."
                />
                <StatusBadge status={dossier.statut} />
                <Select value={dossier.statut} onValueChange={handleStatutChange}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="archive">Archivé</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Info grid */}
          <motion.div className="glass-card p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm" variants={staggerItem}>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Montant</p><p className="font-bold text-base sm:text-lg">{dossier.montant.toLocaleString()} €</p></div>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Création</p><p>{new Date(dossier.dateCreation).toLocaleDateString("fr-FR")}</p></div>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Échéance</p><p>{dossier.dateEcheance ? new Date(dossier.dateEcheance).toLocaleDateString("fr-FR") : "—"}</p></div>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Client</p><p>{dossier.clientNom}</p></div>
          </motion.div>

          {/* Équipe assignée */}
          {assignEnabled && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Équipe assignée</h2>
                <div className="flex items-center gap-2">
                  {currentAssignments.length > 0 && <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setAssignModalMode("add"); setAssignModalOpen(true); }}><Plus className="h-3.5 w-3.5" /> Ajouter</Button>}
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setAssignModalMode("full"); setAssignModalOpen(true); }}><Users className="h-3.5 w-3.5" /> {currentAssignments.length > 0 ? "Modifier" : "Assigner"}</Button>
                </div>
              </div>
              {currentAssignments.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {currentAssignments.map((a) => {
                    const member = MOCK_TEAM_MEMBERS.find((m) => m.id === a.employeeId);
                    if (!member) return null;
                    const isResp = a.role === "responsable";
                    return (
                      <div key={a.employeeId} className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/30">
                        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">{member.prenom[0]}{member.nom[0]}</AvatarFallback></Avatar>
                        <div><p className="text-xs font-medium">{member.prenom} {member.nom}</p><p className="text-[10px] text-muted-foreground">{member.poste}</p></div>
                        <button type="button" onClick={() => { if (isResp) return; const updated = currentAssignments.map((x) => ({ ...x, role: x.employeeId === a.employeeId ? "responsable" as const : "renfort" as const })); handleAssign(updated); toast.success(`${member.prenom} est maintenant responsable`); }} className="p-1 rounded hover:bg-muted/50 transition-colors" title={isResp ? "Responsable" : "Désigner comme responsable"}>
                          <Star className={`h-4 w-4 transition-colors ${isResp ? "fill-amber-400 text-amber-400" : "text-muted-foreground hover:text-amber-300"}`} />
                        </button>
                        {isResp ? <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1"><Crown className="h-2.5 w-2.5" /> Responsable</Badge> : <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1"><Shield className="h-2.5 w-2.5" /> Renfort</Badge>}
                        <AlertDialog>
                          <AlertDialogTrigger asChild><button type="button" className="p-1 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" title="Retirer"><X className="h-3.5 w-3.5" /></button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Retirer {member.prenom} {member.nom} ?</AlertDialogTitle><AlertDialogDescription>{isResp && currentAssignments.length > 1 ? "Ce membre est le responsable. Le prochain deviendra responsable." : `${member.prenom} ne sera plus assigné(e).`}</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { let updated = currentAssignments.filter((x) => x.employeeId !== a.employeeId); if (isResp && updated.length > 0) updated = updated.map((x, i) => i === 0 ? { ...x, role: "responsable" as const } : x); handleAssign(updated); toast.success(`${member.prenom} retiré(e)`); }}>Retirer</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-sm text-muted-foreground">Aucun membre assigné</p>}
            </motion.div>
          )}

          {assignEnabled && (
            <AssignModal open={assignModalOpen} onOpenChange={setAssignModalOpen} currentAssignments={assignModalMode === "add" ? [] : currentAssignments} filterOut={assignModalMode === "add" ? currentAssignments.map((a) => a.employeeId) : []} onAssign={(newAssignments) => { const finalAssignments = assignModalMode === "add" ? [...currentAssignments.map((a) => ({ ...a, role: "renfort" as const })), ...newAssignments].map((a) => { const existingResp = currentAssignments.find((x) => x.role === "responsable"); if (existingResp) return { ...a, role: a.employeeId === existingResp.employeeId ? "responsable" as const : a.role }; return a; }) : newAssignments; handleAssign(finalAssignments); toast.success(`${finalAssignments.length} membre(s) assigné(s)`); }} />
          )}

          <motion.div variants={staggerItem}><DossierTeamPanel dossierId={dossier.id} /></motion.div>

          {/* Progression stepper */}
          {dossier.statut !== "annule" && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Progression</h2>
                {!rdvEffectue && dossier.statut === "en_attente" && (
                  <Button size="sm" className="gap-1.5" onClick={() => { marquerRdvEffectue(dossier.id); toast.success("RDV marqué effectué"); }}><CalendarDays className="h-3.5 w-3.5" /> Marquer RDV effectué</Button>
                )}
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {etapes.map((e, i) => (
                  <div key={e} className="flex items-center flex-1 min-w-0">
                    <div className={`flex flex-col items-center flex-1 ${i <= etapeActive ? "text-primary" : "text-muted-foreground"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= etapeActive ? "bg-primary text-primary-foreground" : "bg-muted border border-border"}`}>
                        {i === 1 ? <CalendarDays className="h-3 w-3" /> : i === 2 ? <FileText className="h-3 w-3" /> : i + 1}
                      </div>
                      <span className="text-[10px] mt-1 text-center leading-tight">{e}</span>
                      {i === 1 && <span className={`text-[8px] ${rdvEffectue ? "text-primary" : "text-muted-foreground"}`}>{rdvEffectue ? "Effectué" : "À planifier"}</span>}
                      {i === 2 && <span className={`text-[8px] ${cdcComplete ? "text-primary" : cdcRejected ? "text-destructive" : cdcSubmitted ? "text-accent-foreground" : "text-muted-foreground"}`}>{cdcComplete ? "Validé" : cdcRejected ? "Rejeté" : cdcSubmitted ? "En validation" : "À remplir"}</span>}
                    </div>
                    {i < etapes.length - 1 && <div className={`h-0.5 flex-1 min-w-4 ${i < etapeActive ? "bg-primary" : "bg-border"}`} />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Timeline */}
          {dossier.statut !== "annule" && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <DossierTimeline dossierId={dossier.id} isAdmin={true} isEnterprise={isEnterprise} />
            </motion.div>
          )}

          {/* ===== 8 ONGLETS ===== */}
          <motion.div variants={staggerItem}>
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-card border">
                <TabsTrigger value="resume">Résumé</TabsTrigger>
                <TabsTrigger value="rdv">RDV</TabsTrigger>
                <TabsTrigger value="paiements">Paiements</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="mesures">Mesures</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="resume">
                <DossierResume
                  dossier={dossier}
                  facturesDossier={facturesDossier}
                  devisDossier={devisDossier}
                  previewVisits={previewVisits}
                  cahier={cahier}
                  demandeTitre={demandeTitre}
                  onUpdatePreviewUrl={updateDossierPreviewUrl}
                  onValidateCdc={(demandeId) => { validateCahier(demandeId); }}
                  onAddPreviewVisit={addPreviewVisit}
                />
              </TabsContent>

              <TabsContent value="rdv">
                <DossierRDV dossierId={dossier.id} rdvEffectue={rdvEffectue} />
              </TabsContent>

              <TabsContent value="paiements">
                <DossierPaiements
                  dossierId={dossier.id}
                  facturesDossier={facturesDossier}
                  montantTotal={dossier.montant}
                  onMarquerPayee={(fId) => updateFactureStatut({ id: fId, statut: "payee" })}
                />
              </TabsContent>

              <TabsContent value="documents">
                <DossierDocuments dossierId={dossier.id} />
              </TabsContent>

              <TabsContent value="photos">
                <DossierPhotos dossierId={dossier.id} />
              </TabsContent>

              <TabsContent value="mesures">
                <DossierMesures dossierId={dossier.id} sector={demoSector} />
              </TabsContent>

              <TabsContent value="messages">
                <DossierMessages dossierId={dossier.id} clientNom={dossier.clientNom} />
              </TabsContent>

              <TabsContent value="notes">
                <DossierNotes dossierId={dossier.id} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
