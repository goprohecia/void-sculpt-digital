import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useFactures } from "@/hooks/use-factures";
import { useClients } from "@/hooks/use-clients";
import { DEMO_CLIENT_ID } from "@/data/mockData";
import { Receipt, CreditCard, Download } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Button } from "@/components/ui/button";
import { generateFacturePdf } from "@/lib/generatePdf";

export default function ClientFactures() {
  const { getFacturesByClient } = useFactures();
  const { getClientById } = useClients();
  const mesFactures = getFacturesByClient(DEMO_CLIENT_ID);
  const client = getClientById(DEMO_CLIENT_ID);

  const totalDu = mesFactures
    .filter((f) => f.statut === "en_attente" || f.statut === "en_retard")
    .reduce((acc, f) => acc + f.montant, 0);

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="h-6 w-6 text-[hsl(200,100%,60%)]" />
              Mes factures
            </h1>
            <p className="text-muted-foreground text-sm">{mesFactures.length} factures</p>
          </motion.div>

          {mesFactures.length === 0 ? (
            <motion.div variants={staggerItem}>
              <AdminEmptyState
                icon={Receipt}
                title="Aucune facture"
                description="Vos factures apparaîtront ici après l'acceptation d'un devis."
                hint="Acceptez un devis pour recevoir votre première facture."
              />
            </motion.div>
          ) : (
            <>
              {totalDu > 0 && (
                <motion.div className="glass-card p-4 border-l-4 border-l-[hsl(45,93%,55%)]" variants={staggerItem}>
                  <p className="text-sm font-medium">Montant restant dû</p>
                  <p className="text-2xl font-bold text-[hsl(45,93%,65%)]">{totalDu.toLocaleString()} €</p>
                </motion.div>
              )}

              {/* Table */}
              <motion.div className="glass-card overflow-hidden hidden sm:block" variants={staggerItem}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Référence</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Montant</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Échéance</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mesFactures.map((f) => (
                        <tr key={f.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs">{f.reference}</td>
                          <td className="py-3 px-4 text-right font-medium">{f.montant.toLocaleString()} €</td>
                          <td className="py-3 px-4 text-center"><StatusBadge status={f.statut} /></td>
                          <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{new Date(f.dateEcheance).toLocaleDateString("fr-FR")}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => generateFacturePdf(f, client)}>
                                <Download className="h-3 w-3" /> PDF
                              </Button>
                              {(f.statut === "en_attente" || f.statut === "en_retard") && (
                                <Link to={`/client/paiement/${f.id}`}>
                                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                                    <CreditCard className="h-3 w-3" /> Payer
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Mobile Cards */}
              <motion.div className="space-y-3 sm:hidden" variants={staggerContainer} initial="initial" animate="animate">
                {mesFactures.map((f) => (
                  <motion.div key={f.id} variants={staggerItem} className="glass-card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">{f.reference}</span>
                      <StatusBadge status={f.statut} />
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/20">
                      <span className="text-sm font-medium">{f.montant.toLocaleString()} €</span>
                      <span className="text-xs text-muted-foreground">Échéance : {new Date(f.dateEcheance).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="w-full h-8 text-xs gap-1" onClick={() => generateFacturePdf(f, client)}>
                      <Download className="h-3 w-3" /> Télécharger PDF
                    </Button>
                    {(f.statut === "en_attente" || f.statut === "en_retard") && (
                      <Link to={`/client/paiement/${f.id}`} className="block pt-1">
                        <Button size="sm" variant="outline" className="w-full h-8 text-xs gap-1">
                          <CreditCard className="h-3 w-3" /> Payer cette facture
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
