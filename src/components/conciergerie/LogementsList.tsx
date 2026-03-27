// [MBA] Module Gestion Logements — liste des logements (vue principale)
// Vue tableau ou grille, filtres, recherche, compteur
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ConciergerieBien } from "@/data/mockConciergerieData";
import {
  Home, Search, Plus, LayoutGrid, LayoutList, MapPin, Users as UsersIcon,
  Building2, Eye, Upload,
} from "lucide-react";

// [MBA] Module Logements interactif — props au lieu d'import mock direct
interface LogementsListProps {
  logements: ConciergerieBien[];
  onSelectLogement: (id: string) => void;
  onCreateClick: () => void;
}

// [MBA] Module Gestion Logements — statuts avec couleurs
const STATUT_CONFIG: Record<string, { label: string; color: string }> = {
  disponible: { label: "Disponible", color: "bg-green-50 text-green-700 border-green-200" },
  reserve: { label: "Réservé", color: "bg-blue-50 text-blue-700 border-blue-200" },
  en_menage: { label: "En ménage", color: "bg-amber-50 text-amber-700 border-amber-200" },
  indisponible: { label: "Indisponible", color: "bg-red-50 text-red-700 border-red-200" },
  maintenance: { label: "Maintenance", color: "bg-gray-100 text-gray-600 border-gray-300" },
};

const PLATEFORME_COLORS: Record<string, string> = {
  Airbnb: "bg-rose-50 text-rose-600", Booking: "bg-blue-50 text-blue-600",
  Vrbo: "bg-indigo-50 text-indigo-600", Direct: "bg-emerald-50 text-emerald-600",
};

const TYPE_LABELS: Record<string, string> = {
  appartement: "Appartement", maison: "Maison", villa: "Villa", studio: "Studio",
  loft: "Loft", chambre_hotes: "Chambre d'hôtes", gite: "Gîte",
};

type ViewMode = "grid" | "list";

export function LogementsList({ logements, onSelectLogement, onCreateClick }: LogementsListProps) {
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterVille, setFilterVille] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterPlateforme, setFilterPlateforme] = useState("");

  const biens = logements;

  const villes = useMemo(() => [...new Set(biens.map(b => b.ville))], [biens]);
  const types = useMemo(() => [...new Set(biens.map(b => b.type))], [biens]);

  const filtered = useMemo(() => {
    let list = biens;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b => b.nom.toLowerCase().includes(q) || b.adresse.toLowerCase().includes(q) || b.proprietaireNom.toLowerCase().includes(q));
    }
    if (filterType) list = list.filter(b => b.type === filterType);
    if (filterVille) list = list.filter(b => b.ville === filterVille);
    if (filterStatut) list = list.filter(b => b.statut === filterStatut);
    if (filterPlateforme) list = list.filter(b => b.plateformes.includes(filterPlateforme as any));
    return list;
  }, [biens, search, filterType, filterVille, filterStatut, filterPlateforme]);

  return (
    <motion.div className="space-y-5" variants={staggerContainer} initial="initial" animate="animate">
      {/* [MBA] Module Gestion Logements — header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Home className="h-6 w-6 text-green-600" /> Gestion des logements
          </h1>
          <p className="text-sm text-gray-500">{filtered.length} logement{filtered.length > 1 ? "s" : ""} actif{filtered.length > 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          {/* [MBA] Phase 2/3 — boutons sync grisés */}
          <Button size="sm" variant="outline" className="gap-1.5 text-gray-400" disabled>
            <Upload className="h-3.5 w-3.5" /> iCal <Badge variant="secondary" className="text-[8px] ml-1">Bientot</Badge>
          </Button>
          <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white" onClick={onCreateClick}>
            <Plus className="h-3.5 w-3.5" /> Ajouter un logement
          </Button>
        </div>
      </motion.div>

      {/* [MBA] Module Gestion Logements — filtres + recherche + switch vue */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un logement..." className="pl-9 h-10 bg-white border-gray-200" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={filterType || "__all__"} onValueChange={v => setFilterType(v === "__all__" ? "" : v)}>
            <SelectTrigger className="w-36 h-10 text-sm"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tous les types</SelectItem>
              {types.map(t => <SelectItem key={t} value={t}>{TYPE_LABELS[t] || t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterVille || "__all__"} onValueChange={v => setFilterVille(v === "__all__" ? "" : v)}>
            <SelectTrigger className="w-32 h-10 text-sm"><SelectValue placeholder="Ville" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Toutes</SelectItem>
              {villes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatut || "__all__"} onValueChange={v => setFilterStatut(v === "__all__" ? "" : v)}>
            <SelectTrigger className="w-36 h-10 text-sm"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tous</SelectItem>
              {Object.entries(STATUT_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-green-50 text-green-600" : "text-gray-400 hover:text-gray-600"}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-green-50 text-green-600" : "text-gray-400 hover:text-gray-600"}`}>
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* [MBA] Module Gestion Logements — vue grille */}
      {view === "grid" && (
        <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(bien => {
            const statut = STATUT_CONFIG[bien.statut] || STATUT_CONFIG.disponible;
            return (
              <Card key={bien.id} className="overflow-hidden border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer group" onClick={() => onSelectLogement(bien.id)}>
                {/* Photo placeholder */}
                <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  <Home className="h-10 w-10 text-gray-300" />
                  <Badge variant="outline" className={`absolute top-2 right-2 text-[10px] ${statut.color}`}>{statut.label}</Badge>
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-600 transition-colors">{bien.nom}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {bien.ville}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-gray-500">{TYPE_LABELS[bien.type]}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><UsersIcon className="h-3 w-3" /> {bien.capacite}</span>
                    {bien.surface && <span>{bien.surface}m²</span>}
                    <span>{bien.tauxOccupation}% occ.</span>
                  </div>
                  <div className="flex gap-1">
                    {bien.plateformes.map(p => (
                      <Badge key={p} variant="outline" className={`text-[9px] px-1.5 py-0 ${PLATEFORME_COLORS[p]}`}>{p}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{bien.proprietaireNom}</span>
                    <span className="text-sm font-semibold text-green-600">{bien.tarifNuit ? `${bien.tarifNuit}€/nuit` : `${bien.revenuMensuel}€/mois`}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      )}

      {/* [MBA] Module Gestion Logements — vue liste (tableau) */}
      {view === "list" && (
        <motion.div variants={staggerItem} className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs bg-gray-50">
                  <th className="text-left py-3 px-4">Logement</th>
                  <th className="text-left py-3 px-4 hidden md:table-cell">Type</th>
                  <th className="text-left py-3 px-4 hidden md:table-cell">Ville</th>
                  <th className="text-left py-3 px-4 hidden lg:table-cell">Propriétaire</th>
                  <th className="text-center py-3 px-4 hidden lg:table-cell">Plateformes</th>
                  <th className="text-center py-3 px-4">Occ.</th>
                  <th className="text-center py-3 px-4">Statut</th>
                  <th className="text-right py-3 px-4">Tarif</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(bien => {
                  const statut = STATUT_CONFIG[bien.statut] || STATUT_CONFIG.disponible;
                  return (
                    <tr key={bien.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onSelectLogement(bien.id)}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Home className="h-4 w-4 text-gray-400" /></div>
                          <div>
                            <p className="font-medium text-gray-900">{bien.nom}</p>
                            <p className="text-xs text-gray-400">{bien.adresse}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-gray-600">{TYPE_LABELS[bien.type]}</td>
                      <td className="py-3 px-4 hidden md:table-cell text-gray-600">{bien.ville}</td>
                      <td className="py-3 px-4 hidden lg:table-cell text-gray-600">{bien.proprietaireNom}</td>
                      <td className="py-3 px-4 hidden lg:table-cell text-center">
                        <div className="flex gap-1 justify-center">
                          {bien.plateformes.map(p => <Badge key={p} variant="outline" className={`text-[9px] px-1 py-0 ${PLATEFORME_COLORS[p]}`}>{p}</Badge>)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">{bien.tauxOccupation}%</td>
                      <td className="py-3 px-4 text-center"><Badge variant="outline" className={`text-[10px] ${statut.color}`}>{statut.label}</Badge></td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">{bien.tarifNuit ? `${bien.tarifNuit}€` : "—"}</td>
                      <td className="py-3 px-4 text-center">
                        <Button size="sm" variant="ghost" className="gap-1 text-xs"><Eye className="h-3 w-3" /> Voir</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Home className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun logement trouvé</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
