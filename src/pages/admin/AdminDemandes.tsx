import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemandes } from "@/hooks/use-demandes";
import { useCahiers } from "@/hooks/use-cahiers";
import { CahierDesChargesView } from "@/components/admin/CahierDesChargesView";
import { Search, FileText, Eye, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const statutFilters = [
  { key: "tous", label: "Toutes" },
  { key: "nouvelle", label: "Nouvelles" },
  { key: "en_revue", label: "En revue" },
  { key: "validee", label: "Validées" },
  { key: "refusee", label: "Refusées" },
];

export default function AdminDemandes() {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [cdcDemandeId, setCdcDemandeId] = useState<string | null>(null);

  const { demandes, updateDemandeStatut } = useDemandes();
  const { getCahierByDemande } = useCahiers();

  const cdcDemande = cdcDemandeId ? demandes.find((d) => d.id === cdcDemandeId) : null;

  const filtered = useMemo(() => {
    let list = demandes;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) =>
        d.reference.toLowerCase().includes(q) ||
        d.clientNom.toLowerCase().includes(q) ||
        d.titre.toLowerCase().includes(q)
      );
    }
    if (filterStatut !== "tous") {
      list = list.filter((d) => d.statut === filterStatut);
    }
    return list;
  }, [demandes, search, filterStatut]);

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Demandes</h1>
              <p className="text-muted-foreground text-sm">Gérez les demandes de vos clients</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une demande..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="w-[160px] bg-card">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statutFilters.map((f) => (
                  <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <AdminEmptyState
              icon={FileText}
              title="Aucune demande"
              description="Les demandes de vos clients apparaîtront ici."
            />
          ) : (
            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="py-3 px-4 text-left font-medium">Référence</th>
                    <th className="py-3 px-4 text-left font-medium">Client</th>
                    <th className="py-3 px-4 text-left font-medium">Titre</th>
                    <th className="py-3 px-4 text-left font-medium">Type</th>
                    <th className="py-3 px-4 text-center font-medium">Statut</th>
                    <th className="py-3 px-4 text-center font-medium">CDC</th>
                    <th className="py-3 px-4 text-center font-medium">Date</th>
                    <th className="py-3 px-4 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => {
                    const cahier = getCahierByDemande(d.id);
                    return (
                      <tr key={d.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs">{d.reference}</td>
                        <td className="py-3 px-4">{d.clientNom}</td>
                        <td className="py-3 px-4 max-w-[200px] truncate">{d.titre}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">{d.typePrestation}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center"><StatusBadge status={d.statut} /></td>
                        <td className="py-3 px-4 text-center">
                          {cahier ? (
                            <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={() => setCdcDemandeId(d.id)}>
                              <Eye className="h-3 w-3" /> Voir CDC
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-muted-foreground">
                          {new Date(d.dateCreation).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {d.statut === "nouvelle" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => {
                                  updateDemandeStatut({ id: d.id, statut: "en_revue" });
                                  toast.success("Demande passée en revue");
                                }}
                              >
                                Traiter
                              </Button>
                            )}
                            {d.statut === "en_revue" && (
                              <Button
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  updateDemandeStatut({ id: d.id, statut: "validee" });
                                  toast.success("Demande validée");
                                }}
                              >
                                Valider
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {cdcDemande && (
          <CahierDesChargesView
            open={!!cdcDemandeId}
            onOpenChange={(open) => { if (!open) setCdcDemandeId(null); }}
            cahier={getCahierByDemande(cdcDemande.id) || null}
            demandeTitre={cdcDemande.titre}
          />
        )}
      </AdminPageTransition>
    </AdminLayout>
  );
}
