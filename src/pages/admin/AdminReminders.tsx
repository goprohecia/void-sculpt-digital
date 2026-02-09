import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { relances, type RelanceStatus } from "@/data/mockData";
import { Bell, Calendar } from "lucide-react";

const statusFilters: { key: "tous" | RelanceStatus; label: string }[] = [
  { key: "tous", label: "Toutes" },
  { key: "a_envoyer", label: "À envoyer" },
  { key: "envoyee", label: "Envoyées" },
  { key: "reponse_recue", label: "Réponse reçue" },
];

export default function AdminReminders() {
  const [filterStatut, setFilterStatut] = useState<"tous" | RelanceStatus>("tous");

  const filtered = relances.filter(
    (r) => filterStatut === "tous" || r.statut === filterStatut
  );

  const prochaines = relances
    .filter((r) => r.statut === "a_envoyer" && r.dateProchaine)
    .sort((a, b) => a.dateProchaine.localeCompare(b.dateProchaine));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Relances
          </h1>
          <p className="text-muted-foreground text-sm">{relances.length} relances</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming reminders */}
          <div className="glass-card p-6 lg:col-span-1">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              Prochaines relances
            </h3>
            <div className="space-y-3">
              {prochaines.length > 0 ? prochaines.map((r) => (
                <div key={r.id} className="p-3 rounded-lg bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{r.clientNom}</p>
                    <span className="text-xs text-[hsl(45,93%,65%)]">
                      {new Date(r.dateProchaine).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.factureRef} — {r.montant.toLocaleString()} €</p>
                  <p className="text-xs text-muted-foreground">{r.type}</p>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Aucune relance programmée</p>
              )}
            </div>
          </div>

          {/* Reminders list */}
          <div className="lg:col-span-2 space-y-4">
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

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Client</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Facture</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Montant</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Type</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">Statut</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-medium">{r.clientNom}</td>
                        <td className="py-3 px-4 font-mono text-xs">{r.factureRef}</td>
                        <td className="py-3 px-4 text-right font-medium">{r.montant.toLocaleString()} €</td>
                        <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{r.type}</td>
                        <td className="py-3 px-4 text-center"><StatusBadge status={r.statut} /></td>
                        <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                          {new Date(r.dateRelance).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Aucune relance trouvée
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
