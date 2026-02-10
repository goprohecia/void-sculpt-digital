import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FolderOpen, FileText, Receipt, MessageSquare, ArrowRight, Send, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useDossiers } from "@/hooks/use-dossiers";
import { useFactures } from "@/hooks/use-factures";
import { useDevis } from "@/hooks/use-devis";
import { useDemandes } from "@/hooks/use-demandes";
import { getConversationsByClient, getRendezVousByClient, DEMO_CLIENT_ID } from "@/data/mockData";
import { WelcomeBookingDialog } from "@/components/admin/WelcomeBookingDialog";

export default function ClientDashboard() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { getDossiersByClient } = useDossiers();
  const { getFacturesByClient } = useFactures();
  const { getDevisByClient } = useDevis();
  const { getDemandesByClient } = useDemandes();

  useEffect(() => {
    const hasVisited = localStorage.getItem("impartial_first_visit_done");
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  const mesDossiers = getDossiersByClient(DEMO_CLIENT_ID);
  const mesFactures = getFacturesByClient(DEMO_CLIENT_ID);
  const mesDevis = getDevisByClient(DEMO_CLIENT_ID);
  const mesDemandes = getDemandesByClient(DEMO_CLIENT_ID);
  const mesConversations = getConversationsByClient(DEMO_CLIENT_ID);
  const mesRdv = getRendezVousByClient(DEMO_CLIENT_ID);

  const dossiersEnCours = mesDossiers.filter((d) => d.statut === "en_cours").length;
  const facturesEnAttente = mesFactures.filter((f) => f.statut === "en_attente" || f.statut === "en_retard").length;
  const devisEnAttente = mesDevis.filter((d) => d.statut === "en_attente").length;
  const messagesNonLus = mesConversations.reduce((acc, c) => acc + c.nonLus, 0);
  const demandesEnCours = mesDemandes.filter((d) => d.statut === "nouvelle" || d.statut === "en_revue").length;
  const rdvAVenir = mesRdv.filter((r) => r.statut === "a_venir").length;

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold">Bienvenue, Sophie</h1>
            <p className="text-muted-foreground text-sm">Votre espace client — Luxe & Mode</p>
          </motion.div>

          {/* KPIs */}
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={staggerItem}><DashboardKPI title="Dossiers en cours" value={dossiersEnCours} icon={FolderOpen} /></motion.div>
            <motion.div variants={staggerItem}><DashboardKPI title="Demandes" value={demandesEnCours} icon={Send} /></motion.div>
            <motion.div variants={staggerItem}><DashboardKPI title="Devis en attente" value={devisEnAttente} icon={FileText} /></motion.div>
            <motion.div variants={staggerItem}><DashboardKPI title="Factures à régler" value={facturesEnAttente} icon={Receipt} /></motion.div>
            <motion.div variants={staggerItem}><DashboardKPI title="Messages non lus" value={messagesNonLus} icon={MessageSquare} /></motion.div>
            <motion.div variants={staggerItem}><DashboardKPI title="RDV à venir" value={rdvAVenir} icon={CalendarDays} /></motion.div>
          </motion.div>

          {/* Dossiers récents */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Mes dossiers</h3>
              <Link to="/client/dossiers" className="text-xs text-primary hover:underline flex items-center gap-1">Voir tous <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="space-y-3">
              {mesDossiers.slice(0, 4).map((d) => (
                <Link key={d.id} to={`/client/dossiers/${d.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{d.typePrestation}</p>
                    <p className="text-xs text-muted-foreground font-mono">{d.reference}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium hidden sm:block">{d.montant.toLocaleString()} €</span>
                    <StatusBadge status={d.statut} />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Demandes */}
          {mesDemandes.length > 0 && (
            <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Mes demandes</h3>
                <Link to="/client/demandes" className="text-xs text-primary hover:underline flex items-center gap-1">Voir toutes <ArrowRight className="h-3 w-3" /></Link>
              </div>
              <div className="space-y-3">
                {mesDemandes.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{d.titre}</p>
                      <p className="text-xs text-muted-foreground">{d.typePrestation}</p>
                    </div>
                    <StatusBadge status={d.statut} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Derniers devis */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Derniers devis</h3>
              <Link to="/client/devis" className="text-xs text-primary hover:underline flex items-center gap-1">Voir tous <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="space-y-3">
              {mesDevis.slice(0, 3).map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{d.titre}</p>
                    <p className="text-xs text-muted-foreground font-mono">{d.reference}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium hidden sm:block">{d.montant.toLocaleString()} €</span>
                    <StatusBadge status={d.statut} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {messagesNonLus > 0 && (
            <motion.div variants={staggerItem}>
              <Link to="/client/messagerie" className="glass-card p-4 flex items-center gap-3 hover:border-[hsl(200,100%,50%)]/30 transition-colors block">
                <div className="rounded-xl bg-[hsl(200,100%,50%)]/10 p-2"><MessageSquare className="h-5 w-5 text-[hsl(200,100%,60%)]" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{messagesNonLus} message{messagesNonLus > 1 ? "s" : ""} non lu{messagesNonLus > 1 ? "s" : ""}</p>
                  <p className="text-xs text-muted-foreground">Consultez vos conversations</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </AdminPageTransition>

      <WelcomeBookingDialog open={showWelcome} onOpenChange={setShowWelcome} />
    </ClientLayout>
  );
}
