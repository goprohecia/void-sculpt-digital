import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useDossiers } from "@/hooks/use-dossiers";
import { useCahiers } from "@/hooks/use-cahiers";
import { useClientId } from "@/hooks/use-client-id";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { FolderOpen, Eye, AlertTriangle } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Badge } from "@/components/ui/badge";
import { GarageClientView } from "@/components/garage/GarageClientView";
import { ImmobilierProprietaireView } from "@/components/immobilier/ImmobilierProprietaireView";
import { ImmobilierAcheteurView } from "@/components/immobilier/ImmobilierAcheteurView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BTPClientView } from "@/components/btp/BTPClientView";
import { ConciergerieProprietaireView } from "@/components/conciergerie/ConciergerieProprietaireView";
import { CoiffureClientView } from "@/components/coiffure/CoiffureClientView";
import { RecrutementClientView } from "@/components/recrutement/RecrutementClientView";
import { RecrutementCandidatView } from "@/components/recrutement/RecrutementCandidatView";
import { AutoEcoleEleveView } from "@/components/auto-ecole/AutoEcoleEleveView";
import { MariageClientView } from "@/components/mariage/MariageClientView";
import { AvocatClientView } from "@/components/avocat/AvocatClientView";
import { ComptableClientView } from "@/components/comptable/ComptableClientView";
import { BoutiqueClientView } from "@/components/boutique/BoutiqueClientView";
import { SportMembreView } from "@/components/sport/SportMembreView";

export default function ClientDossiers() {
  const { clientId, isLoading: clientLoading } = useClientId();
  const { getDossiersByClient, dossiers } = useDossiers();
  const { getCahierByDemande } = useCahiers();
  const { demoSector } = useDemoPlan();
  const mesDossiers = clientId ? getDossiersByClient(clientId) : [];

  if (demoSector === "garages") {
    return <GarageClientView />;
  }

  if (demoSector === "immobilier") {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <Tabs defaultValue="proprietaire" className="space-y-4">
            <TabsList>
              <TabsTrigger value="proprietaire">Espace Propriétaire</TabsTrigger>
              <TabsTrigger value="acheteur">Espace Acheteur</TabsTrigger>
            </TabsList>
            <TabsContent value="proprietaire">
              <ImmobilierProprietaireView />
            </TabsContent>
            <TabsContent value="acheteur">
              <ImmobilierAcheteurView />
            </TabsContent>
          </Tabs>
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  if (demoSector === "btp") {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <BTPClientView />
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  if (demoSector === "conciergerie") {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <ConciergerieProprietaireView />
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  if (demoSector === "coiffure") {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <CoiffureClientView />
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  if (demoSector === "cabinet-recrutement") {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <Tabs defaultValue="entreprise" className="space-y-4">
            <TabsList>
              <TabsTrigger value="entreprise">Espace Client Entreprise</TabsTrigger>
              <TabsTrigger value="candidat">Espace Candidat</TabsTrigger>
            </TabsList>
            <TabsContent value="entreprise">
              <RecrutementClientView />
            </TabsContent>
            <TabsContent value="candidat">
              <RecrutementCandidatView />
            </TabsContent>
          </Tabs>
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  if (demoSector === "auto-ecole") {
    return <AutoEcoleEleveView />;
  }

  if (demoSector === "mariage") {
    return <MariageClientView />;
  }

  if (demoSector === "cabinet-avocats") {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <AvocatClientView />
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  if (demoSector === "expert-comptable") {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <ComptableClientView />
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  if (demoSector === "boutique") {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <BoutiqueClientView />
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  if (demoSector === "coach-sportif") {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <SportMembreView />
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  const getCahierByDossier = (dossierId: string) => {
    const dossier = dossiers.find((d) => d.id === dossierId);
    if (!dossier?.demandeId) return undefined;
    return getCahierByDemande(dossier.demandeId);
  };

  if (clientLoading) return <ClientLayout><div className="p-8 text-center text-muted-foreground">Chargement...</div></ClientLayout>;

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-[hsl(200,100%,60%)]" />
              Mes dossiers
            </h1>
            <p className="text-muted-foreground text-sm">{mesDossiers.length} dossiers</p>
          </motion.div>

          {mesDossiers.length === 0 ? (
            <motion.div variants={staggerItem}>
              <AdminEmptyState
                icon={FolderOpen}
                title="Aucun dossier"
                description="Vos dossiers de projet apparaîtront ici dès qu'ils seront créés."
                hint="Soumettez une demande pour démarrer un nouveau projet."
              />
            </motion.div>
          ) : (
            <>
              {/* Desktop Table */}
              <motion.div className="glass-card overflow-hidden hidden sm:block" variants={staggerItem}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Référence</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Prestation</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Montant</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Échéance</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mesDossiers.map((d) => {
                        const cdc = getCahierByDossier(d.id);
                        const cdcRequired = (d.statut === "en_cours") && d.demandeId && (!cdc || cdc.statut === "brouillon");
                        const cdcPending = (d.statut === "en_cours") && d.demandeId && cdc?.statut === "complet";
                        return (
                        <tr key={d.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs">{d.reference}</td>
                          <td className="py-3 px-4">{d.typePrestation}</td>
                          <td className="py-3 px-4 text-right font-medium">{d.montant.toLocaleString()} €</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <StatusBadge status={d.statut} />
                              {cdcRequired && (
                                <Badge variant="outline" className="text-[hsl(45,100%,50%)] border-[hsl(45,100%,50%)]/40 gap-1 text-[10px] px-1.5">
                                  <AlertTriangle className="h-2.5 w-2.5" /> CDC requis
                                </Badge>
                              )}
                              {cdcPending && (
                                <Badge variant="outline" className="text-[hsl(200,100%,60%)] border-[hsl(200,100%,60%)]/40 gap-1 text-[10px] px-1.5">
                                  CDC en validation
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{d.dateEcheance ? new Date(d.dateEcheance).toLocaleDateString("fr-FR") : "—"}</td>
                          <td className="py-3 px-4 text-center">
                            <Link to={`/client/dossiers/${d.id}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                              <Eye className="h-3 w-3" /> Voir
                            </Link>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Mobile Card Stack */}
              <motion.div className="space-y-3 sm:hidden" variants={staggerContainer} initial="initial" animate="animate">
                {mesDossiers.map((d) => {
                  const cdc = getCahierByDossier(d.id);
                  const cdcRequired = (d.statut === "en_cours") && d.demandeId && cdc?.statut !== "complet";
                  return (
                  <Link key={d.id} to={`/client/dossiers/${d.id}`}>
                    <motion.div variants={staggerItem} className="glass-card p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{d.reference}</span>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={d.statut} />
                          {cdcRequired && (
                            <Badge variant="outline" className="text-[hsl(45,100%,50%)] border-[hsl(45,100%,50%)]/40 gap-1 text-[10px] px-1.5">
                              <AlertTriangle className="h-2.5 w-2.5" /> CDC
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="font-medium text-sm">{d.typePrestation}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-border/20">
                        <span className="text-sm font-medium">{d.montant.toLocaleString()} €</span>
                        <span className="text-xs text-muted-foreground">{d.dateEcheance ? new Date(d.dateEcheance).toLocaleDateString("fr-FR") : "—"}</span>
                      </div>
                    </motion.div>
                  </Link>
                  );
                })}
              </motion.div>
            </>
          )}
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
