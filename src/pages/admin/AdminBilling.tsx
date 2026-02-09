import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { factures, statsFactures, type FactureStatus } from "@/data/mockData";
import { Receipt, Euro, AlertTriangle } from "lucide-react";

const statusFilters: { key: "tous" | FactureStatus; label: string }[] = [
  { key: "tous", label: "Toutes" },
  { key: "payee", label: "Payées" },
  { key: "en_attente", label: "En attente" },
  { key: "en_retard", label: "En retard" },
];

export default function AdminBilling() {
  const [filterStatut, setFilterStatut] = useState<"tous" | FactureStatus>("tous");

  const filtered = factures.filter(
    (f) => filterStatut === "tous" || f.statut === filterStatut
  );

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" />
              Facturation
            </h1>
            <p className="text-muted-foreground text-sm">{factures.length} factures</p>
          </motion.div>

          {/* Summary */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={staggerItem} className="glass-card p-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Euro className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total facturé</p>
                <p className="text-lg font-bold">{statsFactures.total.toLocaleString()} €</p>
              </div>
            </motion.div>
            <motion.div variants={staggerItem} className="glass-card p-4 flex items-center gap-3">
              <div className="rounded-xl bg-[hsl(155,100%,45%)]/10 p-2.5">
                <Euro className="h-5 w-5 text-[hsl(155,100%,55%)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Encaissé</p>
                <p className="text-lg font-bold text-[hsl(155,100%,65%)]">{statsFactures.payees.toLocaleString()} €</p>
              </div>
            </motion.div>
            <motion.div variants={staggerItem} className="glass-card p-4 flex items-center gap-3">
              <div className="rounded-xl bg-destructive/10 p-2.5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">En retard</p>
                <p className="text-lg font-bold text-destructive">{statsFactures.enRetard.toLocaleString()} €</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Filters */}
          <motion.div className="flex gap-2 flex-wrap" variants={staggerItem}>
            {statusFilters.map((s) => (
              <button
                key={s.key}
                onClick={() => setFilterStatut(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatut === s.key
                    ? "bg-primary text-primary-foreground"
                    : "glass-button"
                }`}
              >
                {s.label}
              </button>
            ))}
          </motion.div>

          {/* Table */}
          <motion.div className="glass-card overflow-hidden" variants={staggerItem}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Référence</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Client</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Montant</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Émission</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Échéance</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((f) => (
                    <tr key={f.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs">{f.reference}</td>
                      <td className="py-3 px-4">{f.clientNom}</td>
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
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                Aucune facture trouvée
              </div>
            )}
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
