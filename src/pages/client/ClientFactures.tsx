import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getFacturesByClient, DEMO_CLIENT_ID } from "@/data/mockData";
import { Receipt } from "lucide-react";

export default function ClientFactures() {
  const mesFactures = getFacturesByClient(DEMO_CLIENT_ID);

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

          {/* Summary */}
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
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Émission</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Échéance</th>
                  </tr>
                </thead>
                <tbody>
                  {mesFactures.map((f) => (
                    <tr key={f.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs">{f.reference}</td>
                      <td className="py-3 px-4 text-right font-medium">{f.montant.toLocaleString()} €</td>
                      <td className="py-3 px-4 text-center"><StatusBadge status={f.statut} /></td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                        {new Date(f.dateEmission).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                        {new Date(f.dateEcheance).toLocaleDateString("fr-FR")}
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
                  <span className="text-xs text-muted-foreground">
                    Échéance : {new Date(f.dateEcheance).toLocaleDateString("fr-FR")}
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
