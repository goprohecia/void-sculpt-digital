import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/use-clients";
import { useDossiers } from "@/hooks/use-dossiers";
import { useDemandes } from "@/hooks/use-demandes";
import type { Client } from "@/data/mockData";
import { Search, Users, Eye, X, Building2, MapPin, Pencil, Trash2, UserCheck, UserX, Save, UserPlus, Tag, Mail, Send, FolderOpen, Archive } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { ClientTagManager, ClientTagBadges } from "@/components/admin/ClientTagManager";
import { useTags, useClientTags } from "@/hooks/use-produits";
import { supabase } from "@/integrations/supabase/client";
import { ClientDossiersLinked } from "@/components/admin/ClientDossiersLinked";
import { useSectorRoleLabels } from "@/hooks/use-sector-role-labels";

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState<"tous" | "actif" | "inactif">("tous");
  const [filterSegment, setFilterSegment] = useState<"tous" | "client" | "prospect">("tous");
  const [filterTagId, setFilterTagId] = useState<string | null>(null);
  const { tags } = useTags();
  const { clientTags: allClientTags } = useClientTags();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showBulkEmailDialog, setShowBulkEmailDialog] = useState(false);
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkSending, setBulkSending] = useState(false);
  const [newClient, setNewClient] = useState({ prenom: "", nom: "", email: "", telephone: "", entreprise: "", siret: "", adresse: "", codePostal: "", ville: "", pays: "", segment: "client" });
  const [newClientTagIds, setNewClientTagIds] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { clients, createClient, updateClient, updateClientAsync, deleteClient } = useClients();
  const { clientLabel, clientsLabel } = useSectorRoleLabels();
  const { getDossiersByClient } = useDossiers();
  const { getDemandesByClient } = useDemandes();

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.prenom.toLowerCase().includes(search.toLowerCase()) ||
      c.entreprise.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "tous" || c.statut === filterStatut;
    const matchSegment = filterSegment === "tous" || (c as any).segment === filterSegment;
    const matchTag = !filterTagId || allClientTags.some((ct: any) => ct.client_id === c.id && ct.tag_id === filterTagId);
    return matchSearch && matchStatut && matchSegment && matchTag;
  });

  const clientDossiers = selectedClient ? getDossiersByClient(selectedClient.id) : [];
  const clientDemandes = selectedClient ? getDemandesByClient(selectedClient.id) : [];

  const handleToggleStatus = (client: Client) => {
    const newStatus = client.statut === "actif" ? "inactif" : "actif";
    updateClient({ id: client.id, updates: { statut: newStatus } });
    toast.success(`Client ${client.prenom} ${client.nom} ${newStatus === "actif" ? "activé" : "désactivé"}`);
    if (selectedClient?.id === client.id) {
      setSelectedClient({ ...client, statut: newStatus as Client["statut"] });
    }
  };

  const handleDelete = () => {
    if (!deletingClient) return;
    deleteClient(deletingClient.id);
    toast.success(`Client ${deletingClient.prenom} ${deletingClient.nom} supprimé`);
    if (selectedClient?.id === deletingClient.id) setSelectedClient(null);
    setDeletingClient(null);
  };

  const handleSaveEdit = async () => {
    if (!editingClient) return;
    try {
      await updateClientAsync({
        id: editingClient.id,
        updates: {
          nom: editingClient.nom,
          prenom: editingClient.prenom,
          email: editingClient.email,
          telephone: editingClient.telephone,
          entreprise: editingClient.entreprise,
          siret: editingClient.siret,
          adresse: editingClient.adresse,
          codePostal: editingClient.codePostal,
          ville: editingClient.ville,
          pays: editingClient.pays,
        },
      });
      toast.success("Client mis à jour");
      if (selectedClient?.id === editingClient.id) setSelectedClient(editingClient);
      setEditingClient(null);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.prenom || !newClient.nom || !newClient.email || !newClient.telephone) {
      toast.error("Prénom, nom, email et téléphone sont obligatoires");
      return;
    }
    try {
      await createClient(newClient);
      // Assign tags if any selected — find the newly created client by email
      if (newClientTagIds.length > 0) {
        const { data: createdClients } = await supabase
          .from("clients")
          .select("id")
          .eq("email", newClient.email)
          .order("created_at", { ascending: false })
          .limit(1);
        if (createdClients?.[0]) {
          const clientId = createdClients[0].id;
          await Promise.all(
            newClientTagIds.map((tagId) =>
              supabase.from("client_tags").insert({ client_id: clientId, tag_id: tagId })
            )
          );
        }
      }
      toast.success(`${clientLabel} ${newClient.prenom} ${newClient.nom} créé — un email d'invitation a été envoyé`);
      setNewClient({ prenom: "", nom: "", email: "", telephone: "", entreprise: "", siret: "", adresse: "", codePostal: "", ville: "", pays: "", segment: "client" });
      setNewClientTagIds([]);
      setShowCreateDialog(false);
    } catch {
      toast.error("Erreur lors de la création du client");
    }
  };

  const handleSendBulkEmail = async () => {
    if (!bulkSubject.trim() || !bulkMessage.trim()) {
      toast.error("Sujet et message sont obligatoires");
      return;
    }
    if (filtered.length === 0) {
      toast.error("Aucun client dans la sélection");
      return;
    }
    setBulkSending(true);
    try {
      const recipients = filtered.map((c) => ({ email: c.email, prenom: c.prenom, clientId: c.id }));
      const { data, error } = await supabase.functions.invoke("send-bulk-email", {
        body: { recipients, subject: bulkSubject, message: bulkMessage },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Email envoyé à ${data?.sent || filtered.length} client(s)`);
      setShowBulkEmailDialog(false);
      setBulkSubject("");
      setBulkMessage("");
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de l'envoi");
    } finally {
      setBulkSending(false);
    }
  };

  const getSegmentBadge = (client: Client) => {
    const seg = (client as any).segment || "client";
    return seg === "prospect" ? (
      <span className="text-[10px] rounded-full px-1.5 py-0.5 bg-amber-500/20 text-amber-400">Prospect</span>
    ) : (
      <span className="text-[10px] rounded-full px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400">{clientLabel}</span>
    );
  };

  const ActionButtons = ({ client, compact = false }: { client: Client; compact?: boolean }) => (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-1.5"}`}>
      <button onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }} className="inline-flex items-center gap-1 text-xs text-primary hover:underline" title="Voir">
        <Eye className="h-3 w-3" />{!compact && " Voir"}
      </button>
      <button onClick={(e) => { e.stopPropagation(); setEditingClient({ ...client }); }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" title="Modifier">
        <Pencil className="h-3 w-3" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(client); }}
        className={`inline-flex items-center gap-1 text-xs ${client.statut === "actif" ? "text-orange-400 hover:text-orange-300" : "text-emerald-400 hover:text-emerald-300"}`}
        title={client.statut === "actif" ? "Désactiver" : "Activer"}>
        {client.statut === "actif" ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
      </button>
      <button onClick={(e) => { e.stopPropagation(); setDeletingClient(client); }} className="inline-flex items-center gap-1 text-xs text-destructive hover:text-destructive/80" title="Supprimer">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );

  const ClientDetail = () => (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="projets" className="gap-1.5"><FolderOpen className="h-3.5 w-3.5" /> Projets</TabsTrigger>
        <TabsTrigger value="coordonnees" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Coordonnées</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <div className="flex items-center gap-2 justify-end">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setEditingClient({ ...selectedClient! })}>
            <Pencil className="h-3 w-3" /> Modifier
          </Button>
          <Button size="sm" variant="outline"
            className={`gap-1.5 text-xs ${selectedClient?.statut === "actif" ? "text-orange-400 border-orange-400/30 hover:bg-orange-400/10" : "text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10"}`}
            onClick={() => selectedClient && handleToggleStatus(selectedClient)}>
            {selectedClient?.statut === "actif" ? <><UserX className="h-3 w-3" /> Désactiver</> : <><UserCheck className="h-3 w-3" /> Activer</>}
          </Button>
          <Button size="sm" variant="destructive" className="gap-1.5 text-xs" onClick={() => setDeletingClient(selectedClient!)}>
            <Trash2 className="h-3 w-3" /> Supprimer
          </Button>
        </div>

        {/* Tags */}
        {selectedClient && (
          <div>
            <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Tags</p>
            <ClientTagManager clientId={selectedClient.id} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Email</p><p className="break-all">{selectedClient?.email}</p></div>
          <div><p className="text-muted-foreground">Téléphone</p><p>{selectedClient?.telephone}</p></div>
          <div><p className="text-muted-foreground">Statut</p><StatusBadge status={selectedClient?.statut || "actif"} /></div>
          <div><p className="text-muted-foreground">Segment</p>{selectedClient && getSegmentBadge(selectedClient)}</div>
          <div><p className="text-muted-foreground">Depuis</p><p>{selectedClient ? new Date(selectedClient.dateCreation).toLocaleDateString("fr-FR") : ""}</p></div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Dossiers ({clientDossiers.length})</h3>
          {clientDossiers.length > 0 ? (
            <div className="space-y-2">
              {clientDossiers.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div><p className="text-sm font-mono">{d.reference}</p><p className="text-xs text-muted-foreground">{d.typePrestation}</p></div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{d.montant.toLocaleString()} €</span>
                    <StatusBadge status={d.statut} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">Aucun dossier</p>}
        </div>

        {clientDemandes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Demandes ({clientDemandes.length})</h3>
            <div className="space-y-2">
              {clientDemandes.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div><p className="text-sm font-medium">{d.titre}</p><p className="text-xs text-muted-foreground">{d.typePrestation}</p></div>
                  <StatusBadge status={d.statut} />
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="projets" className="space-y-6">
        {selectedClient && <ClientDossiersLinked clientId={selectedClient.id} />}
        
        {/* Archived dossiers */}
        {clientDossiers.filter(d => d.statut === ("archive" as any)).length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
              <Archive className="h-3.5 w-3.5 text-muted-foreground" />
              Historique archivé
            </h3>
            <div className="space-y-2">
              {clientDossiers.filter(d => d.statut === ("archive" as any)).map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 opacity-70">
                  <div><p className="text-sm font-mono">{d.reference}</p><p className="text-xs text-muted-foreground">{d.typePrestation}</p></div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{d.montant.toLocaleString()} €</span>
                    <StatusBadge status="termine" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="coordonnees" className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Entreprise</p><p className="font-medium">{selectedClient?.entreprise || "—"}</p></div>
          <div><p className="text-muted-foreground">SIRET</p><p>{selectedClient?.siret || "Non renseigné"}</p></div>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground flex items-center gap-1.5 mb-1"><MapPin className="h-3.5 w-3.5" /> Adresse</p>
          {selectedClient?.adresse ? (
            <div>
              <p>{selectedClient.adresse}</p>
              <p>{selectedClient.codePostal} {selectedClient.ville}</p>
              {selectedClient.pays && <p>{selectedClient.pays}</p>}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Non renseignée par le client</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border/30">
          <div><p className="text-muted-foreground">Email</p><p className="break-all">{selectedClient?.email}</p></div>
          <div><p className="text-muted-foreground">Téléphone</p><p>{selectedClient?.telephone}</p></div>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3" variants={staggerItem}>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Clients</h1>
              <p className="text-muted-foreground text-sm">{clients.length} clients enregistrés</p>
            </div>
            <div className="flex gap-2 self-start">
              {filtered.length > 0 && (
                <Button variant="outline" onClick={() => setShowBulkEmailDialog(true)} className="gap-1.5 text-xs sm:text-sm">
                  <Mail className="h-4 w-4" /> <span className="hidden sm:inline">Email groupé</span> ({filtered.length})
                </Button>
              )}
              <Button onClick={() => setShowCreateDialog(true)} className="gap-1.5 text-xs sm:text-sm">
                <UserPlus className="h-4 w-4" /> <span className="hidden sm:inline">Nouveau</span> client
              </Button>
            </div>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row gap-3" variants={staggerItem}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input border-0 pl-9 h-10" />
            </div>
            <div className="flex gap-2">
              {(["tous", "actif", "inactif"] as const).map((s) => (
                <button key={s} onClick={() => setFilterStatut(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatut === s ? "bg-primary text-primary-foreground" : "glass-button"}`}>
                  {s === "tous" ? "Tous" : s === "actif" ? "Actifs" : "Inactifs"}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Segment filter */}
          <motion.div className="flex flex-wrap gap-2 items-center" variants={staggerItem}>
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            {SEGMENTS.map((seg) => (
              <button
                key={seg.value}
                onClick={() => setFilterSegment(seg.value as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterSegment === seg.value ? "bg-primary text-primary-foreground" : "glass-button"}`}
              >
                {seg.label}
              </button>
            ))}
          </motion.div>

          {/* Tag filters */}
          {tags.length > 0 && (
            <motion.div className="flex flex-wrap gap-1.5 items-center" variants={staggerItem}>
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              <button
                onClick={() => setFilterTagId(null)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!filterTagId ? "bg-primary text-primary-foreground" : "glass-button"}`}
              >
                Tous
              </button>
              {tags.map((tag: any) => (
                <button
                  key={tag.id}
                  onClick={() => setFilterTagId(filterTagId === tag.id ? null : tag.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${filterTagId === tag.id ? "ring-2 ring-offset-1 ring-offset-background" : "hover:opacity-80"}`}
                  style={{
                    backgroundColor: `${tag.couleur || "#6366f1"}${filterTagId === tag.id ? "40" : "20"}`,
                    color: tag.couleur || "#6366f1",
                    ...(filterTagId === tag.id ? { ringColor: tag.couleur } : {}),
                  }}
                >
                  {tag.nom}
                </button>
              ))}
            </motion.div>
          )}

          {/* Mobile cards */}
          <motion.div className="sm:hidden space-y-3" variants={staggerItem}>
            {filtered.length === 0 ? (
              <AdminEmptyState icon={Users} title="Aucun client" description="Vos clients apparaîtront ici dès qu'ils seront enregistrés." hint="Invitez votre premier client pour commencer." />
            ) : filtered.map((c) => (
              <div key={c.id} className="glass-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{c.prenom} {c.nom}</p>
                    <p className="text-xs text-muted-foreground">{c.entreprise}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getSegmentBadge(c)}
                      <ClientTagBadges clientId={c.id} />
                    </div>
                  </div>
                  <StatusBadge status={c.statut} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{c.nombreDossiers} dossier{c.nombreDossiers > 1 ? "s" : ""}</span>
                  <ActionButtons client={c} compact />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Desktop table */}
          <motion.div className="glass-card overflow-hidden hidden sm:block" variants={staggerItem}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                 <tr className="border-b border-border/50 bg-muted/20">
                     <th className="text-left py-3 px-4 text-muted-foreground font-medium">Client</th>
                     <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Email</th>
                     <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Téléphone</th>
                     <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden xl:table-cell">Tags</th>
                     <th className="text-center py-3 px-4 text-muted-foreground font-medium">Dossiers</th>
                     <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                     <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filtered.map((c) => (
                     <tr key={c.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                       <td className="py-3 px-4"><div><p className="font-medium">{c.prenom} {c.nom}</p><p className="text-xs text-muted-foreground">{c.entreprise}</p></div></td>
                       <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{c.email}</td>
                       <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{c.telephone}</td>
                       <td className="py-3 px-4 hidden xl:table-cell"><ClientTagBadges clientId={c.id} /></td>
                       <td className="py-3 px-4 text-center">{c.nombreDossiers}</td>
                      <td className="py-3 px-4 text-center"><StatusBadge status={c.statut} /></td>
                      <td className="py-3 px-4 text-center">
                        <ActionButtons client={c} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </AdminPageTransition>

      {/* View detail drawer/modal */}
      {isMobile ? (
        <Drawer open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
          <DrawerContent className="max-h-[85dvh]">
            <DrawerHeader className="text-left">
              <DrawerTitle>{selectedClient?.prenom} {selectedClient?.nom}</DrawerTitle>
              <p className="text-sm text-muted-foreground">{selectedClient?.entreprise}</p>
            </DrawerHeader>
            <div className="px-4 pb-6 overflow-auto"><ClientDetail /></div>
          </DrawerContent>
        </Drawer>
      ) : (
        <AnimatePresence>
          {selectedClient && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedClient(null)}>
              <motion.div className="glass-modal w-full max-w-2xl max-h-[80vh] overflow-auto p-6 space-y-6"
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between">
                  <div><h2 className="text-lg font-bold">{selectedClient.prenom} {selectedClient.nom}</h2><p className="text-sm text-muted-foreground">{selectedClient.entreprise}</p></div>
                  <button onClick={() => setSelectedClient(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                </div>
                <ClientDetail />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editingClient} onOpenChange={(open) => !open && setEditingClient(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>Modifiez les informations du client ci-dessous.</DialogDescription>
          </DialogHeader>
          {editingClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Prénom</label>
                  <Input value={editingClient.prenom} onChange={(e) => setEditingClient({ ...editingClient, prenom: e.target.value })} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Nom</label>
                  <Input value={editingClient.nom} onChange={(e) => setEditingClient({ ...editingClient, nom: e.target.value })} className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <Input type="email" value={editingClient.email} onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Téléphone</label>
                  <Input value={editingClient.telephone} onChange={(e) => setEditingClient({ ...editingClient, telephone: e.target.value })} className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Entreprise</label>
                  <Input value={editingClient.entreprise} onChange={(e) => setEditingClient({ ...editingClient, entreprise: e.target.value })} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">SIRET</label>
                  <Input value={editingClient.siret || ""} onChange={(e) => setEditingClient({ ...editingClient, siret: e.target.value })} className="h-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Adresse</label>
                <Input value={editingClient.adresse || ""} onChange={(e) => setEditingClient({ ...editingClient, adresse: e.target.value })} className="h-9" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Code postal</label>
                  <Input value={editingClient.codePostal || ""} onChange={(e) => setEditingClient({ ...editingClient, codePostal: e.target.value })} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Ville</label>
                  <Input value={editingClient.ville || ""} onChange={(e) => setEditingClient({ ...editingClient, ville: e.target.value })} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Pays</label>
                  <Input value={editingClient.pays || ""} onChange={(e) => setEditingClient({ ...editingClient, pays: e.target.value })} className="h-9" />
                </div>
              </div>
              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Tag className="h-3 w-3" /> Tags</label>
                <ClientTagManager clientId={editingClient.id} />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditingClient(null)} className="w-full sm:w-auto">Annuler</Button>
            <Button onClick={handleSaveEdit} className="gap-1.5 w-full sm:w-auto"><Save className="h-3.5 w-3.5" /> Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingClient} onOpenChange={(open) => !open && setDeletingClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce client ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le client <strong>{deletingClient?.prenom} {deletingClient?.nom}</strong> et ses données associées seront supprimés définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create client dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau client</DialogTitle>
            <DialogDescription>Renseignez les informations du nouveau client.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Prénom *</label>
                <Input value={newClient.prenom} onChange={(e) => setNewClient({ ...newClient, prenom: e.target.value })} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Nom *</label>
                <Input value={newClient.nom} onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })} className="h-9" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Email *</label>
                <Input type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Téléphone *</label>
                <Input value={newClient.telephone} onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })} className="h-9" placeholder="+33 6 12 34 56 78" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Entreprise <span className="text-muted-foreground/60">(facultatif)</span></label>
                <Input value={newClient.entreprise} onChange={(e) => setNewClient({ ...newClient, entreprise: e.target.value })} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Segment</label>
                <div className="flex gap-2">
                  {(["client", "prospect"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewClient({ ...newClient, segment: s })}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${newClient.segment === s ? "bg-primary text-primary-foreground" : "glass-button"}`}
                    >
                      {s === "client" ? clientLabel : "Prospect"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Tags selector */}
            {tags.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Tag className="h-3 w-3" /> Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag: any) => {
                    const isSelected = newClientTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setNewClientTagIds(
                          isSelected
                            ? newClientTagIds.filter((id) => id !== tag.id)
                            : [...newClientTagIds, tag.id]
                        )}
                        className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 transition-all border ${
                          isSelected ? "border-current" : "border-transparent hover:opacity-80"
                        }`}
                        style={{
                          backgroundColor: `${tag.couleur || "#6366f1"}${isSelected ? "30" : "15"}`,
                          color: tag.couleur || "#6366f1",
                        }}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tag.couleur || "#6366f1" }} />
                        {tag.nom}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">SIRET <span className="text-muted-foreground/60">(facultatif)</span></label>
                <Input value={newClient.siret} onChange={(e) => setNewClient({ ...newClient, siret: e.target.value })} className="h-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Adresse</label>
              <Input value={newClient.adresse} onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })} className="h-9" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Code postal</label>
                <Input value={newClient.codePostal} onChange={(e) => setNewClient({ ...newClient, codePostal: e.target.value })} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Ville</label>
                <Input value={newClient.ville} onChange={(e) => setNewClient({ ...newClient, ville: e.target.value })} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Pays</label>
                <Input value={newClient.pays} onChange={(e) => setNewClient({ ...newClient, pays: e.target.value })} className="h-9" />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="w-full sm:w-auto">Annuler</Button>
            <Button onClick={handleCreateClient} className="gap-1.5 w-full sm:w-auto"><UserPlus className="h-3.5 w-3.5" /> Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk email dialog */}
      <Dialog open={showBulkEmailDialog} onOpenChange={setShowBulkEmailDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Email groupé</DialogTitle>
            <DialogDescription>
              Envoyez un email à {filtered.length} client{filtered.length > 1 ? "s" : ""} correspondant aux filtres actifs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1 p-3 rounded-lg bg-muted/20 max-h-24 overflow-auto">
              {filtered.slice(0, 10).map((c) => (
                <span key={c.id} className="text-[10px] rounded-full px-2 py-0.5 bg-primary/10 text-primary">
                  {c.prenom} {c.nom}
                </span>
              ))}
              {filtered.length > 10 && <span className="text-[10px] text-muted-foreground">+{filtered.length - 10} autres</span>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sujet *</label>
              <Input value={bulkSubject} onChange={(e) => setBulkSubject(e.target.value)} placeholder="Sujet de l'email" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Message *</label>
              <Textarea value={bulkMessage} onChange={(e) => setBulkMessage(e.target.value)} placeholder="Contenu de l'email..." rows={6} />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowBulkEmailDialog(false)} className="w-full sm:w-auto">Annuler</Button>
            <Button onClick={handleSendBulkEmail} disabled={bulkSending || !bulkSubject.trim() || !bulkMessage.trim()} className="gap-1.5 w-full sm:w-auto">
              <Send className="h-3.5 w-3.5" /> {bulkSending ? "Envoi..." : `Envoyer (${filtered.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
