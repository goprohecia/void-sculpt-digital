import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { dossiers, type DossierStatus } from "@/data/mockData";
import { Search, FolderOpen } from "lucide-react";

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

  const filtered = dossiers.filter((d) => {
    const matchSearch =
      d.reference.toLowerCase().includes(search.toLowerCase()) ||
      d.clientNom.toLowerCase().includes(search.toLowerCase()) ||
      d.typePrestation.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "tous" || d.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-primary" />
            Dossiers
          </h1>
          <p className="text-muted-foreground text-sm">{dossiers.length} dossiers au total</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par référence, client, prestation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input border-0 pl-9 h-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
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
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Référence</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Client</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Prestation</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Montant</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Échéance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs">{d.reference}</td>
                    <td className="py-3 px-4">{d.clientNom}</td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{d.typePrestation}</td>
                    <td className="py-3 px-4 text-right font-medium">{d.montant.toLocaleString()} €</td>
                    <td className="py-3 px-4 text-center"><StatusBadge status={d.statut} /></td>
                    <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                      {new Date(d.dateEcheance).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Aucun dossier trouvé
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
