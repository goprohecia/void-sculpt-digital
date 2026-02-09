import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getDevisByClient, DEMO_CLIENT_ID } from "@/data/mockData";
import { FileText } from "lucide-react";

export default function ClientDevis() {
  const mesDevis = getDevisByClient(DEMO_CLIENT_ID);

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
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Émission</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Validité</th>
                  </tr>
                </thead>
                <tbody>
                  {mesDevis.map((d) => (
                    <tr key={d.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs">{d.reference}</td>
                      <td className="py-3 px-4">{d.titre}</td>
                      <td className="py-3 px-4 text-right font-medium">{d.montant.toLocaleString()} €</td>
                      <td className="py-3 px-4 text-center"><StatusBadge status={d.statut} /></td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                        {new Date(d.dateEmission).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                        {new Date(d.dateValidite).toLocaleDateString("fr-FR")}
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
                  <span className="text-xs text-muted-foreground">
                    Valide jusqu'au {new Date(d.dateValidite).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
