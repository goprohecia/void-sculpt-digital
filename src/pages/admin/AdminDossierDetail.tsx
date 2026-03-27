// [MBA] Fiche dossier enrichie — bible v3 section 5
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
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { isAssignationEnabled } from "@/data/sectorModules";
// [MBA] Utilise teamMembers du secteur actif via useDemoData (pas teamMembers générique)
import { type DossierAssignment } from "@/data/mockData";
import { AssignModal } from "@/components/admin/AssignModal";
import {
  ArrowLeft, FolderOpen, Ban, Users, Crown, Shield, Star, Plus, X,
  Mail, Phone, Bell, MessageSquare, CheckCircle2, ChevronLeft,
  DollarSign, Wallet, CreditCard, UserCheck, Pencil, Check, Send, Lock,
} from "lucide-react";
import { AIContextButton } from "@/components/admin/AIContextButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { DossierStatus } from "@/data/mockData";
import { DossierTimeline } from "@/components/admin/DossierTimeline";
// [MBA] DossierTeamPanel supprimé (doublon avec la section Équipe assignée inline)
import { useSubscription } from "@/hooks/use-subscription";
// [MBA] Droits centralisés — bible v3 sections 4.1/4.2/4.3
import { useRoleRights } from "@/hooks/use-role-rights";
// [MBA] Vocabulaire secteur pour messagerie groupée — bible v3 section 4.4
import { useSectorRoleLabels } from "@/hooks/use-sector-role-labels";

// [MBA] Tab components — 8 onglets obligatoires
import { DossierResume } from "@/components/dossier/DossierResume";
import { DossierRDV } from "@/components/dossier/DossierRDV";
import { DossierPaiements } from "@/components/dossier/DossierPaiements";
import { DossierDocuments } from "@/components/dossier/DossierDocuments";
import { DossierPhotos } from "@/components/dossier/DossierPhotos";
import { DossierMesures } from "@/components/dossier/DossierMesures";
import { DossierMessages } from "@/components/dossier/DossierMessages";
import { DossierNotes } from "@/components/dossier/DossierNotes";

export default function AdminDossierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDossierById, updateDossierStatut, updateDossierPreviewUrl, marquerRdvEffectue } = useDossiers();
  const { isEnterprise, isStarter, plan } = useSubscription();
  const { getFacturesByDossier, updateFactureStatut } = useFactures();
  const { getDevisByDossier } = useDevis();
  const { getPreviewVisitsByDossier, addPreviewVisit } = usePreviewVisits();
  const { getCahierByDemande, validateCahier } = useCahiers();
  const { demandes } = useDemandes();
  // [MBA] teamMembers dynamiques selon secteur actif
  const { getAssignmentsByDossier, assignDossier, addNotification, getClientById, teamMembers } = useDemoData();
  const { demoSector } = useDemoPlan();
  const { user } = useDemoAuth();
  const assignEnabled = isAssignationEnabled(demoSector);

  // [MBA] Droits centralisés — bible v3 sections 4.1/4.2/4.3
  const rights = useRoleRights();
  const { isAdmin, isEmployee, isClient } = rights;
  // [MBA] Vocabulaire secteur pour messagerie groupée (ex: "Coach", "Professeur")
  const { employeeLabel } = useSectorRoleLabels();

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignModalMode, setAssignModalMode] = useState<"full" | "add">("full");
  // [MBA] Active tab state — controlled so Contacter can switch to messages
  const [activeTab, setActiveTab] = useState("resume");
  // [MBA] Notification modal state
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifCanal, setNotifCanal] = useState<"email" | "sms" | "both">("email");
  // [MBA] Info contextuelle éditable
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoContextuelle, setInfoContextuelle] = useState("");

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
      const member = teamMembers.find((m) => m.id === a.employeeId);
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

  // [MBA] Client info pour en-tête enrichi
  const client = getClientById(dossier.clientId);

  // [MBA] Blocs financiers — bible v3 section 5.3
  const encaisse = facturesDossier.filter(f => f.statut === "payee").reduce((s, f) => s + f.montant, 0);
  const restantDu = dossier.montant - encaisse;
  const responsable = currentAssignments.find(a => a.role === "responsable");
  const responsableMember = responsable ? teamMembers.find(m => m.id === responsable.employeeId) : null;

  const handleStatutChange = (val: string) => {
    updateDossierStatut({ id: dossier.id, statut: val as DossierStatus });
    toast.success(`Statut mis à jour : ${val}`);
  };

  // [MBA] Envoyer notification — modal complet
  const handleSendNotification = () => {
    if (!notifTitle.trim()) { toast.error("Veuillez saisir un titre"); return; }
    addNotification({
      id: `notif_${Date.now()}`,
      type: "statut",
      titre: notifTitle.trim(),
      description: notifMessage.trim() || `Mise à jour du dossier ${dossier.reference}`,
      date: new Date().toISOString(),
      lu: false,
      lien: `/client/dossiers/${dossier.id}`,
      destinataire: "client",
      canal: notifCanal,
    });
    const canalLabel = notifCanal === "both" ? "Email + SMS" : notifCanal === "email" ? "Email" : "SMS";
    toast.success(`Notification envoyée par ${canalLabel}`);
    setNotifModalOpen(false);
    setNotifTitle("");
    setNotifMessage("");
  };

  // [MBA] Contacter — ouvre l'onglet Messages directement
  const handleContacter = () => {
    setActiveTab("messages");
    toast.info(`Conversation avec ${dossier.clientNom}`);
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          {/* [MBA] ===== EN-TÊTE ENRICHI (sticky) — bible v3 section 5.1 ===== */}
          <motion.div variants={staggerItem} className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 -mx-1 px-1">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>

            {/* Ligne 1 : Nom client + badge type + statut */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FolderOpen className="h-6 w-6 text-primary" />
                  {dossier.clientNom}
                  <Badge variant="outline" className="text-xs font-normal">{dossier.typePrestation}</Badge>
                </h1>
                <p className="text-muted-foreground text-sm">{dossier.reference}</p>
              </div>
              {/* [MBA] Statut — admin et employé Business+ peuvent modifier — bible v3 section 4 */}
              {rights.canAdvanceTimeline && (
                <div className="flex items-center gap-2">
                  <StatusBadge status={dossier.statut} />
                  <Select value={dossier.statut} onValueChange={handleStatutChange}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="termine">Terminé</SelectItem>
                      <SelectItem value="archive">Archivé</SelectItem>
                      <SelectItem value="annule">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* [MBA] Client voit statut en lecture seule */}
              {isClient && (
                <StatusBadge status={dossier.statut} />
              )}
            </div>

            {/* Ligne 2 : Email + Tél + Info contextuelle + Employé assigné */}
            <div className="flex items-center gap-4 mt-2 flex-wrap text-sm">
              {client?.email && (
                <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-3.5 w-3.5" /> {client.email}
                </a>
              )}
              {client?.telephone && (
                <a href={`tel:${client.telephone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-3.5 w-3.5" /> {client.telephone}
                </a>
              )}
              {/* [MBA] Employé assigné cliquable → réassigner */}
              {(isAdmin || isEmployee) && (
                responsableMember ? (
                  <button type="button" onClick={() => { setAssignModalMode("full"); setAssignModalOpen(true); }} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <UserCheck className="h-3.5 w-3.5" /> {responsableMember.prenom} {responsableMember.nom} ({responsableMember.poste})
                  </button>
                ) : (
                  <button type="button" onClick={() => { setAssignModalMode("full"); setAssignModalOpen(true); }} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <Users className="h-3.5 w-3.5" /> Assigner un employ&eacute;
                  </button>
                )
              )}
            </div>

            {/* [MBA] Info contextuelle éditable — bible v3 section 5.1 */}
            <div className="flex items-center gap-2 mt-2">
              {editingInfo ? (
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Input
                    value={infoContextuelle}
                    onChange={(e) => setInfoContextuelle(e.target.value)}
                    placeholder="Info contextuelle (ex: Renault Clio 2019, Mariage 21 juin...)"
                    className="h-7 text-xs"
                    onKeyDown={(e) => { if (e.key === "Enter") setEditingInfo(false); }}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingInfo(false)}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { if (rights.canEditContextInfo) setEditingInfo(true); }}
                  className={`text-xs text-muted-foreground flex items-center gap-1.5 ${rights.canEditContextInfo ? "hover:text-primary cursor-pointer" : ""}`}
                >
                  {infoContextuelle || (rights.canEditContextInfo ? "Ajouter une info contextuelle..." : "")}
                  {rights.canEditContextInfo && <Pencil className="h-3 w-3" />}
                </button>
              )}
            </div>

            {/* [MBA] Ligne 3 : Boutons d'action — bible v3 section 5.5 — droits par rôle */}
            {!isClient && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {/* [MBA] Étape précédente — admin uniquement (bible v3: canRevertTimeline) */}
                {rights.canRevertTimeline && dossier.statut !== "annule" && dossier.statut !== "en_attente" && (
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
                    if (dossier.statut === "en_cours") { handleStatutChange("en_attente"); }
                    else if (dossier.statut === "termine") { handleStatutChange("en_cours"); }
                    toast.success("Étape précédente");
                  }}>
                    <ChevronLeft className="h-3.5 w-3.5" /> Étape précédente
                  </Button>
                )}
                {/* [MBA] Notifier — admin et employé (bible v3: canNotifyClient) */}
                {rights.canNotifyClient && (
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setNotifModalOpen(true)}>
                    <Bell className="h-3.5 w-3.5" /> Notifier
                  </Button>
                )}
                {/* [MBA] Contacter — admin et employé (switch to Messages tab) */}
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleContacter}>
                  <MessageSquare className="h-3.5 w-3.5" /> Contacter
                </Button>
                {/* [MBA] Dossier terminé — admin toujours, employé Business+ (bible v3: canMarkDossierComplete) */}
                {rights.canMarkDossierComplete && dossier.statut !== "termine" && dossier.statut !== "annule" && (
                  <Button size="sm" className="gap-1.5" onClick={() => { handleStatutChange("termine"); toast.success("Dossier marqué comme terminé"); }}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Dossier terminé
                  </Button>
                )}
                {/* [MBA] Annuler — admin uniquement (bible v3: canCancelDossier) */}
                {rights.canCancelDossier && dossier.statut !== "annule" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-1.5"><Ban className="h-3.5 w-3.5" /> Annuler</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Annuler le dossier ?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <p>Vous êtes sur le point d&apos;annuler le dossier <strong>{dossier.reference}</strong>.</p>
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
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { handleStatutChange("annule"); toast.success(`Réservation annulée — Remboursement de ${montantRembourse} € initié`); }}>Confirmer l&apos;annulation</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <AIContextButton
                  label="Résumé IA"
                  context={`DOSSIER: ${dossier.reference}\n- Client: ${dossier.clientNom}\n- Prestation: ${dossier.typePrestation}\n- Montant: ${dossier.montant.toLocaleString()} €\n- Statut: ${dossier.statut}`}
                  prompt="Fais un résumé détaillé de ce dossier."
                />
              </div>
            )}
          </motion.div>

          {/* [MBA] ===== BLOCS FINANCIERS (4 blocs — admin uniquement) — bible v3 section 5.3 ===== */}
          {rights.canViewFinancials && (
            <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3" variants={staggerItem}>
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1"><DollarSign className="h-4 w-4 text-muted-foreground" /></div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{dossier.montant.toLocaleString()} €</p>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1"><Wallet className="h-4 w-4 text-green-500" /></div>
                <p className="text-xs text-muted-foreground">Encaissé</p>
                <p className="text-xl font-bold text-green-500">{encaisse.toLocaleString()} €</p>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1"><CreditCard className={`h-4 w-4 ${restantDu > 0 ? "text-destructive" : "text-green-500"}`} /></div>
                <p className="text-xs text-muted-foreground">Restant dû</p>
                <p className={`text-xl font-bold ${restantDu > 0 ? "text-destructive" : "text-green-500"}`}>{restantDu.toLocaleString()} €</p>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1"><UserCheck className="h-4 w-4 text-primary" /></div>
                <p className="text-xs text-muted-foreground">Employé assigné</p>
                <p className="text-sm font-semibold mt-0.5">{responsableMember ? `${responsableMember.prenom} ${responsableMember.nom[0]}.` : "Non assigné"}</p>
              </div>
            </motion.div>
          )}

          {/* [MBA] Équipe assignée — admin et employé */}
          {assignEnabled && !isClient && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Équipe assignée</h2>
                {/* [MBA] Gestion équipe — admin uniquement (bible v3: canManageTeam) */}
                {rights.canManageTeam && (
                  <div className="flex items-center gap-2">
                    {currentAssignments.length > 0 && <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setAssignModalMode("add"); setAssignModalOpen(true); }}><Plus className="h-3.5 w-3.5" /> Ajouter</Button>}
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setAssignModalMode("full"); setAssignModalOpen(true); }}><Users className="h-3.5 w-3.5" /> {currentAssignments.length > 0 ? "Modifier" : "Assigner"}</Button>
                  </div>
                )}
              </div>
              {currentAssignments.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {currentAssignments.map((a) => {
                    const member = teamMembers.find((m) => m.id === a.employeeId);
                    if (!member) return null;
                    const isResp = a.role === "responsable";
                    return (
                      <div key={a.employeeId} className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/30">
                        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">{member.prenom[0]}{member.nom[0]}</AvatarFallback></Avatar>
                        <div><p className="text-xs font-medium">{member.prenom} {member.nom}</p><p className="text-[10px] text-muted-foreground">{member.poste}</p></div>
                        {rights.canManageTeam && (
                          <button type="button" onClick={() => { if (isResp) return; const updated = currentAssignments.map((x) => ({ ...x, role: x.employeeId === a.employeeId ? "responsable" as const : "renfort" as const })); handleAssign(updated); toast.success(`${member.prenom} est maintenant responsable`); }} className="p-1 rounded hover:bg-muted/50 transition-colors" title={isResp ? "Responsable" : "Désigner comme responsable"}>
                            <Star className={`h-4 w-4 transition-colors ${isResp ? "fill-amber-400 text-amber-400" : "text-muted-foreground hover:text-amber-300"}`} />
                          </button>
                        )}
                        {isResp ? <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1"><Crown className="h-2.5 w-2.5" /> Responsable</Badge> : <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1"><Shield className="h-2.5 w-2.5" /> Renfort</Badge>}
                        {rights.canManageTeam && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild><button type="button" className="p-1 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" title="Retirer"><X className="h-3.5 w-3.5" /></button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Retirer {member.prenom} {member.nom} ?</AlertDialogTitle><AlertDialogDescription>{isResp && currentAssignments.length > 1 ? "Ce membre est le responsable. Le prochain deviendra responsable." : `${member.prenom} ne sera plus assigné(e).`}</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { let updated = currentAssignments.filter((x) => x.employeeId !== a.employeeId); if (isResp && updated.length > 0) updated = updated.map((x, i) => i === 0 ? { ...x, role: "responsable" as const } : x); handleAssign(updated); toast.success(`${member.prenom} retiré(e)`); }}>Retirer</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-sm text-muted-foreground">Aucun membre assigné</p>}
            </motion.div>
          )}

          {assignEnabled && rights.canManageTeam && (
            <AssignModal open={assignModalOpen} onOpenChange={setAssignModalOpen} currentAssignments={assignModalMode === "add" ? [] : currentAssignments} filterOut={assignModalMode === "add" ? currentAssignments.map((a) => a.employeeId) : []} onAssign={(newAssignments) => { const finalAssignments = assignModalMode === "add" ? [...currentAssignments.map((a) => ({ ...a, role: "renfort" as const })), ...newAssignments].map((a) => { const existingResp = currentAssignments.find((x) => x.role === "responsable"); if (existingResp) return { ...a, role: a.employeeId === existingResp.employeeId ? "responsable" as const : a.role }; return a; }) : newAssignments; handleAssign(finalAssignments); toast.success(`${finalAssignments.length} membre(s) assigné(s)`); }} />
          )}

          {/* [MBA] DossierTeamPanel supprimé — doublon avec la section "Équipe assignée" ci-dessus */}

          {/* [MBA] ===== TIMELINE INTERACTIVE — bible v3 section 5.2 ===== */}
          {/* Sector-specific, cliquable. Admin peut toujours avancer, employé en Business+ uniquement */}
          {dossier.statut !== "annule" && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <DossierTimeline
                dossierId={dossier.id}
                isAdmin={isAdmin}
                isEmployee={isEmployee}
                isEnterprise={isEnterprise}
              />
            </motion.div>
          )}

          {/* [MBA] ===== 8 ONGLETS OBLIGATOIRES — bible v3 section 5.4 ===== */}
          {/* Tous les onglets TOUJOURS présents. Onglet vide = message + bouton d'action */}
          <motion.div variants={staggerItem}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* [MBA] Point 24 audit — bible v3 section 5.4 : les 8 onglets sont TOUJOURS visibles */}
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
                  // [MBA] CDC validation et preview edit — admin uniquement (bible v3 section 4.1)
                  onValidateCdc={rights.canValidateCDC ? (demandeId) => { validateCahier(demandeId); } : undefined}
                  onAddPreviewVisit={addPreviewVisit}
                  canEditPreviewUrl={rights.canEditPreviewUrl}
                  canViewFinancials={rights.canViewFinancials}
                />
              </TabsContent>

              <TabsContent value="rdv">
                <DossierRDV dossierId={dossier.id} rdvEffectue={dossier.rdvEffectue === true} />
              </TabsContent>

              {/* [MBA] Point 24 audit — Paiements toujours présent, "Accès réservé" pour employé */}
              <TabsContent value="paiements">
                {rights.canViewPaymentSchedule ? (
                  <DossierPaiements
                    dossierId={dossier.id}
                    facturesDossier={facturesDossier}
                    montantTotal={dossier.montant}
                    onMarquerPayee={rights.canMarkPaymentPaid ? (fId) => updateFactureStatut({ id: fId, statut: "payee" }) : undefined}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Lock className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">Accès réservé à l'administrateur</p>
                    <p className="text-xs text-muted-foreground mt-1">Les informations de paiement ne sont pas accessibles pour votre rôle.</p>
                  </div>
                )}
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
                {/* [MBA] Messagerie — rôle + label employé pour bible v3 section 4.4 */}
                <DossierMessages dossierId={dossier.id} clientNom={dossier.clientNom} userRole={rights.role} canContactEmployee={rights.canContactEmployee} employeeRoleLabel={employeeLabel} />
              </TabsContent>

              {/* [MBA] Point 24 audit — Notes toujours présent, "Accès réservé" pour client */}
              <TabsContent value="notes">
                {rights.canViewInternalNotes ? (
                  <DossierNotes dossierId={dossier.id} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Lock className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">Accès réservé à l'équipe</p>
                    <p className="text-xs text-muted-foreground mt-1">Les notes internes ne sont pas accessibles pour votre rôle.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>

        {/* [MBA] ===== MODAL NOTIFICATION — bible v3 section 5.5 ===== */}
        <Dialog open={notifModalOpen} onOpenChange={setNotifModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifier {dossier.clientNom}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Titre de la notification</label>
                <Input
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="Ex: Mise à jour de votre dossier"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message (optionnel)</label>
                <Textarea
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Détails de la notification..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Canal d&apos;envoi</label>
                <Select value={notifCanal} onValueChange={(v) => setNotifCanal(v as "email" | "sms" | "both")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Email + SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setNotifModalOpen(false)}>Annuler</Button>
              <Button onClick={handleSendNotification} className="gap-1.5">
                <Send className="h-4 w-4" /> Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
