import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDossiers } from "@/hooks/use-dossiers";
import { useDemandes } from "@/hooks/use-demandes";
import { useCahiers } from "@/hooks/use-cahiers";
import { useClients } from "@/hooks/use-clients";
import { useDemoData } from "@/contexts/DemoDataContext";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { isAssignationEnabled } from "@/data/sectorModules";
import { MOCK_TEAM_MEMBERS } from "@/data/mockData";
import type { DossierStatus } from "@/data/mockData";
import { Search, FolderOpen, Eye, FileText, Filter } from "lucide-react";
import { GarageVehicleList } from "@/components/garage/GarageVehicleList";
import { ImmobilierDashboard } from "@/components/immobilier/ImmobilierDashboard";
import { BTPDashboard } from "@/components/btp/BTPDashboard";
import { ConciergerieDashboard } from "@/components/conciergerie/ConciergerieDashboard";
import { AIContextButton } from "@/components/admin/AIContextButton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CahierDesChargesView } from "@/components/admin/CahierDesChargesView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";

const statusFilters: { key: "tous" | DossierStatus; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "en_cours", label: "En cours" },
  { key: "termine", label: "Terminés" },
  { key: "en_attente", label: "En attente" },
  { key: "annule", label: "Annulés" },
];

export default function AdminDossiers() {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState<"tous" | DossierStatus>("tous");
  const [filterMontantMin, setFilterMontantMin] = useState("");
  const [filterMontantMax, setFilterMontantMax] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cdcDemandeId, setCdcDemandeId] = useState<string | null>(null);
  
  const { dossiers, addDossier } = useDossiers();
  const { demandes, updateDemandeStatut } = useDemandes();
  const { getCahierByDemande } = useCahiers();
  const { clients } = useClients();
  const { isDemo } = useIsDemo();
  const { getAssignmentsByDossier } = useDemoData();
  const { demoSector } = useDemoPlan();
  const assignEnabled = isAssignationEnabled(demoSector);

  // Fetch tags
  const { data: tags = [] } = useQuery<any[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      if (isDemo) return [{ id: "t1", nom: "VIP" }, { id: "t2", nom: "Premium" }];
      const { data, error } = await (supabase as any).from("tags").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch client_tags for filtering
  const { data: clientTags = [] } = useQuery<any[]>({
    queryKey: ["client_tags"],
    queryFn: async () => {
      if (isDemo) return [];
      const { data, error } = await (supabase as any).from("client_tags").select("*");
      if (error) throw error;
      return data || [];
    },
  });
  
  const cdcDemande = cdcDemandeId ? demandes.find((d) => d.id === cdcDemandeId) : null;

  const filtered = useMemo(() => {
    let list = dossiers;
    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) =>
        d.reference.toLowerCase().includes(q) ||
        d.clientNom.toLowerCase().includes(q) ||
        d.typePrestation.toLowerCase().includes(q)
      );
    }
    // Status
    if (filterStatut !== "tous") list = list.filter((d) => d.statut === filterStatut);
    // Montant min/max
    if (filterMontantMin) list = list.filter((d) => d.montant >= parseFloat(filterMontantMin));
    if (filterMontantMax) list = list.filter((d) => d.montant <= parseFloat(filterMontantMax));
    // Tag filter
    if (filterTag) {
      const clientIdsWithTag = clientTags.filter((ct: any) => ct.tag_id === filterTag).map((ct: any) => ct.client_id);
      list = list.filter((d) => clientIdsWithTag.includes(d.clientId));
    }
    return list;
  }, [dossiers, search, filterStatut, filterMontantMin, filterMontantMax, filterTag, clientTags]);

  const handleTransformDemande = (dem: typeof demandes[0]) => {
    const newDossier = {
      id: `d${Date.now()}`,
      reference: `DOS-2026-${String(dossiers.length + 26).padStart(3, "0")}`,
      clientId: dem.clientId,
      clientNom: dem.clientNom,
      typePrestation: dem.typePrestation,
      montant: 0,
      statut: "en_attente" as DossierStatus,
      dateCreation: new Date().toISOString().split("T")[0],
      dateEcheance: "",
    };
    addDossier(newDossier);
    updateDemandeStatut({ id: dem.id, statut: "validee" });
    toast.success(`Dossier ${newDossier.reference} créé depuis la demande`);
  };

  if (demoSector === "garages") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <GarageVehicleList />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "immobilier") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <ImmobilierDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "btp") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <BTPDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-primary" />
                Dossiers & Demandes
              </h1>
              <p className="text-muted-foreground text-sm">{dossiers.length} dossiers · {demandes.length} demandes</p>
            </div>
            <AIContextButton
              label="Résumé IA"
              context={`RÉSUMÉ GLOBAL DE TOUS LES DOSSIERS:
- Total: ${dossiers.length} dossiers, ${demandes.length} demandes
- En cours: ${dossiers.filter(d => d.statut === "en_cours").length} dossiers
- Terminés: ${dossiers.filter(d => d.statut === "termine").length} dossiers
- En attente: ${dossiers.filter(d => d.statut === "en_attente").length} dossiers
- Annulés: ${dossiers.filter(d => d.statut === "annule").length} dossiers
- CA total: ${dossiers.reduce((sum, d) => sum + d.montant, 0).toLocaleString()} €
- CA en cours: ${dossiers.filter(d => d.statut === "en_cours").reduce((sum, d) => sum + d.montant, 0).toLocaleString()} €

DÉTAIL DES DOSSIERS:
${dossiers.map(d => `• ${d.reference} - ${d.clientNom} - ${d.typePrestation} - ${d.montant.toLocaleString()}€ - ${d.statut}`).join('\n')}`}
              prompt="Fais un résumé synthétique de l'ensemble des dossiers. Analyse les tendances, identifie les points d'attention (dossiers en attente depuis longtemps, gros montants), les priorités et les prochaines actions recommandées. Donne une vue globale de la santé du portefeuille."
            />
          </motion.div>

          <Tabs defaultValue="dossiers">
            <TabsList>
              <TabsTrigger value="dossiers">Dossiers ({dossiers.length})</TabsTrigger>
              <TabsTrigger value="demandes">Demandes ({demandes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="dossiers" className="space-y-4 mt-4">
              {/* Filters */}
              <motion.div className="flex flex-col gap-3" variants={staggerItem}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input border-0 pl-9 h-10" />
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    {statusFilters.map((s) => (
                      <button key={s.key} onClick={() => setFilterStatut(s.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatut === s.key ? "bg-primary text-primary-foreground" : "glass-button"}`}>
                        {s.label}
                      </button>
                    ))}
                    <Button size="sm" variant="ghost" onClick={() => setShowAdvanced(!showAdvanced)} className="gap-1">
                      <Filter className="h-3.5 w-3.5" /> Filtres
                    </Button>
                  </div>
                </div>

                {showAdvanced && (
                  <div className="flex flex-wrap gap-3 p-3 rounded-lg bg-muted/10 border border-border/20">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Montant min (€)</label>
                      <Input type="number" placeholder="0" value={filterMontantMin} onChange={(e) => setFilterMontantMin(e.target.value)} className="h-8 w-28 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Montant max (€)</label>
                      <Input type="number" placeholder="∞" value={filterMontantMax} onChange={(e) => setFilterMontantMax(e.target.value)} className="h-8 w-28 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Tag client</label>
                      <Select value={filterTag || "__all__"} onValueChange={(v) => setFilterTag(v === "__all__" ? "" : v)}>
                        <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="Tous" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">Tous</SelectItem>
                          {tags.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.nom}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm" variant="ghost" className="self-end h-8 text-xs" onClick={() => { setFilterMontantMin(""); setFilterMontantMax(""); setFilterTag(""); }}>Réinitialiser</Button>
                  </div>
                )}
              </motion.div>

              {/* Table */}
              <motion.div className="glass-card overflow-hidden hidden sm:block" variants={staggerItem}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Référence</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Client</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Prestation</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Montant</th>
                        {assignEnabled && <th className="text-center py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Assigné à</th>}
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((d) => (
                        <tr key={d.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs">{d.reference}</td>
                          <td className="py-3 px-4">{d.clientNom}</td>
                          <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{d.typePrestation}</td>
                          <td className="py-3 px-4 text-right font-medium">{d.montant.toLocaleString()} €</td>
                          {assignEnabled && (
                            <td className="py-3 px-4 text-center hidden lg:table-cell">
                              {(() => {
                                const assigns = getAssignmentsByDossier(d.id);
                                if (assigns.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
                                const shown = assigns.slice(0, 3);
                                const rest = assigns.length - 3;
                                return (
                                  <div className="flex items-center justify-center -space-x-2">
                                    {shown.map((a) => {
                                      const m = MOCK_TEAM_MEMBERS.find((t) => t.id === a.employeeId);
                                      return m ? (
                                        <Avatar key={a.employeeId} className="h-6 w-6 border-2 border-background">
                                          <AvatarFallback className="text-[9px] font-semibold bg-primary/10 text-primary">
                                            {m.prenom[0]}{m.nom[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                      ) : null;
                                    })}
                                    {rest > 0 && (
                                      <span className="text-[10px] text-muted-foreground ml-1">+{rest}</span>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>
                          )}
                          <td className="py-3 px-4 text-center"><StatusBadge status={d.statut} /></td>
                          <td className="py-3 px-4 text-center">
                            <Link to={`/admin/dossiers/${d.id}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><Eye className="h-3 w-3" /> Voir</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filtered.length === 0 && <AdminEmptyState icon={FolderOpen} title="Aucun dossier" description="Les dossiers de vos projets clients apparaîtront ici." hint="Créez un dossier à partir d'une demande validée." />}
              </motion.div>

              {/* Mobile */}
              <motion.div className="space-y-3 sm:hidden" variants={staggerContainer} initial="initial" animate="animate">
                {filtered.map((d) => (
                  <Link key={d.id} to={`/admin/dossiers/${d.id}`}>
                    <motion.div variants={staggerItem} className="glass-card p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted-foreground">{d.reference}</span>
                        <StatusBadge status={d.statut} />
                      </div>
                      <p className="font-medium text-sm">{d.clientNom}</p>
                      <p className="text-xs text-muted-foreground">{d.typePrestation}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-border/20">
                        <span className="text-sm font-medium">{d.montant.toLocaleString()} €</span>
                        <span className="text-xs text-muted-foreground">{d.dateEcheance ? new Date(d.dateEcheance).toLocaleDateString("fr-FR") : "—"}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="demandes" className="space-y-4 mt-4">
              <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
                {demandes.map((dem) => (
                  <motion.div key={dem.id} variants={staggerItem} className="glass-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{dem.reference}</span>
                        {(() => {
                          const cahier = getCahierByDemande(dem.id);
                          if (!cahier) return <Badge variant="outline" className="text-[10px] px-1.5 py-0">CDC vide</Badge>;
                          if (cahier.statut === "complet") return <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-green-600">CDC complet</Badge>;
                          return <Badge variant="secondary" className="text-[10px] px-1.5 py-0">CDC brouillon</Badge>;
                        })()}
                      </div>
                      <StatusBadge status={dem.statut} />
                    </div>
                    <div><p className="font-medium text-sm">{dem.titre}</p><p className="text-xs text-muted-foreground">{dem.clientNom} · {dem.typePrestation}</p></div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{dem.description}</p>
                    {dem.budget && <p className="text-xs text-muted-foreground">Budget : {dem.budget}</p>}
                    <div className="flex items-center justify-between pt-2 border-t border-border/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{new Date(dem.dateCreation).toLocaleDateString("fr-FR")}</span>
                        {getCahierByDemande(dem.id) && (
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setCdcDemandeId(dem.id)}><FileText className="h-3 w-3" /> Voir CDC</Button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {dem.statut !== "validee" && dem.statut !== "refusee" && (
                          <>
                            <Select onValueChange={(val) => { updateDemandeStatut({ id: dem.id, statut: val as any }); toast.success("Statut mis à jour"); }}>
                              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Changer statut" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en_revue">En revue</SelectItem>
                                <SelectItem value="validee">Valider</SelectItem>
                                <SelectItem value="refusee">Refuser</SelectItem>
                              </SelectContent>
                            </Select>
                            {dem.statut === "en_revue" && (
                              <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => handleTransformDemande(dem)}><FolderOpen className="h-3 w-3" /> Créer dossier</Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {demandes.length === 0 && <div className="p-8 text-center text-muted-foreground">Aucune demande</div>}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <CahierDesChargesView
          open={!!cdcDemandeId}
          onOpenChange={(o) => { if (!o) setCdcDemandeId(null); }}
          cahier={cdcDemandeId ? getCahierByDemande(cdcDemandeId) || null : null}
          demandeTitre={cdcDemande?.titre}
        />
      </AdminPageTransition>
    </AdminLayout>
  );
}
