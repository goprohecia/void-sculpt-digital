import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useClients } from "@/hooks/use-clients";
import { useDossiers } from "@/hooks/use-dossiers";
import { useDemandes } from "@/hooks/use-demandes";
import type { Client } from "@/data/mockData";
import { Search, Users, Eye, X, Building2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState<"tous" | "actif" | "inactif">("tous");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const isMobile = useIsMobile();
  const { clients } = useClients();
  const { getDossiersByClient } = useDossiers();
  const { getDemandesByClient } = useDemandes();

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.prenom.toLowerCase().includes(search.toLowerCase()) ||
      c.entreprise.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "tous" || c.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const clientDossiers = selectedClient ? getDossiersByClient(selectedClient.id) : [];
  const clientDemandes = selectedClient ? getDemandesByClient(selectedClient.id) : [];

  const ClientDetail = () => (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="coordonnees" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Coordonnées</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Email</p><p className="break-all">{selectedClient?.email}</p></div>
          <div><p className="text-muted-foreground">Téléphone</p><p>{selectedClient?.telephone}</p></div>
          <div><p className="text-muted-foreground">Statut</p><StatusBadge status={selectedClient?.statut || "actif"} /></div>
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
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Clients</h1>
            <p className="text-muted-foreground text-sm">{clients.length} clients enregistrés</p>
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

          {/* Mobile cards */}
          <motion.div className="sm:hidden space-y-3" variants={staggerItem}>
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Aucun client trouvé</div>
            ) : filtered.map((c) => (
              <div key={c.id} className="glass-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{c.prenom} {c.nom}</p>
                    <p className="text-xs text-muted-foreground">{c.entreprise}</p>
                  </div>
                  <StatusBadge status={c.statut} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{c.nombreDossiers} dossier{c.nombreDossiers > 1 ? "s" : ""}</span>
                  <button onClick={() => setSelectedClient(c)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <Eye className="h-3 w-3" /> Voir
                  </button>
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
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden xl:table-cell">SIRET</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden xl:table-cell">Ville</th>
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
                      <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground text-xs">{c.siret || "—"}</td>
                      <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground text-xs">{c.ville ? `${c.codePostal} ${c.ville}` : "—"}</td>
                      <td className="py-3 px-4 text-center">{c.nombreDossiers}</td>
                      <td className="py-3 px-4 text-center"><StatusBadge status={c.statut} /></td>
                      <td className="py-3 px-4 text-center">
                        <button onClick={() => setSelectedClient(c)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <Eye className="h-3 w-3" /> Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </AdminPageTransition>

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
    </AdminLayout>
  );
}
