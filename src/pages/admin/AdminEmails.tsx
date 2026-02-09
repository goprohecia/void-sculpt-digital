import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { EmailLogPanel } from "@/components/admin/EmailLogPanel";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { EmailLogType } from "@/contexts/DemoDataContext";
import { exportCsv } from "@/lib/exportCsv";
import { Mail, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const typeFilters: { label: string; value: EmailLogType | "all" }[] = [
  { label: "Tous", value: "all" },
  { label: "Relance", value: "relance" },
  { label: "Devis", value: "devis" },
  { label: "Paiement", value: "paiement" },
  { label: "Demande", value: "demande" },
  { label: "Validation", value: "validation" },
];

export default function AdminEmails() {
  const { emailLogs } = useDemoData();
  const [typeFilter, setTypeFilter] = useState<EmailLogType | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = emailLogs;
    if (typeFilter !== "all") list = list.filter((e) => e.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.destinataire.toLowerCase().includes(q) ||
          e.sujet.toLowerCase().includes(q) ||
          (e.reference && e.reference.toLowerCase().includes(q))
      );
    }
    return list;
  }, [emailLogs, typeFilter, search]);

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      toast.error("Aucun email à exporter");
      return;
    }
    exportCsv(
      `emails-${new Date().toISOString().slice(0, 10)}.csv`,
      ["ID", "Type", "Destinataire", "Sujet", "Date", "Référence"],
      filtered.map((e) => [
        e.id,
        e.type,
        e.destinataire,
        e.sujet,
        new Date(e.dateEnvoi).toLocaleString("fr-FR"),
        e.reference || "",
      ])
    );
    toast.success("Export CSV téléchargé");
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          {/* Header */}
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                Journal des emails
              </h1>
              <p className="text-muted-foreground text-sm">
                {emailLogs.length} email{emailLogs.length !== 1 ? "s" : ""} envoyé{emailLogs.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button onClick={handleExportCsv} variant="outline" size="sm" className="self-start">
              <Download className="h-4 w-4 mr-1" />
              Exporter CSV
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-wrap gap-1.5">
              {typeFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    typeFilter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </motion.div>

          {/* Email list */}
          <motion.div variants={staggerItem} className="glass-card p-4 sm:p-6">
            <p className="text-xs text-muted-foreground mb-3">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            </p>
            <EmailLogPanel emails={filtered} />
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
