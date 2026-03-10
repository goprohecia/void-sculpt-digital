import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Car, Search, Plus, Eye } from "lucide-react";
import { MOCK_VEHICULES, GARAGE_STEPS, type MockVehicule } from "@/data/mockGarageData";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function GarageVehicleList() {
  const [vehicules, setVehicules] = useState<MockVehicule[]>(MOCK_VEHICULES);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ client: "", marque: "", modele: "", immatriculation: "", kilometrage: "", motif: "" });

  const filtered = vehicules.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.immatriculation.toLowerCase().includes(q) ||
      v.clientNom.toLowerCase().includes(q) ||
      v.modele.toLowerCase().includes(q) ||
      v.marque.toLowerCase().includes(q)
    );
  });

  const handleCreate = () => {
    if (!form.client || !form.immatriculation) {
      toast.error("Client et immatriculation requis");
      return;
    }
    const newV: MockVehicule = {
      id: `veh-${Date.now()}`,
      clientNom: form.client,
      clientId: `c-new-${Date.now()}`,
      immatriculation: form.immatriculation.toUpperCase(),
      marque: form.marque,
      modele: form.modele,
      kilometrage: parseInt(form.kilometrage) || 0,
      motifEntree: form.motif,
      mecanicienId: "",
      mecanicienNom: "Non assigné",
      etape: 0,
      dateDepot: new Date().toISOString().split("T")[0],
      notes: "",
      stepDates: [new Date().toISOString().split("T")[0], null, null, null, null, null, null],
    };
    setVehicules((prev) => [newV, ...prev]);
    setForm({ client: "", marque: "", modele: "", immatriculation: "", kilometrage: "", motif: "" });
    setDialogOpen(false);
    toast.success(`Véhicule ${newV.immatriculation} ajouté`);
  };

  const stepColor = (etape: number) => {
    if (etape <= 1) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (etape <= 3) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (etape <= 4) return "bg-violet-500/20 text-violet-400 border-violet-500/30";
    if (etape === 5) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            Véhicules
          </h1>
          <p className="text-muted-foreground text-sm">{vehicules.length} véhicules en atelier</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> Nouveau véhicule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau véhicule</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div><Label>Client *</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Nom du client" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Marque</Label><Input value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} placeholder="Renault" /></div>
                <div><Label>Modèle</Label><Input value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} placeholder="Clio V" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Immatriculation *</Label><Input value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value })} placeholder="AB-123-CD" /></div>
                <div><Label>Kilométrage</Label><Input type="number" value={form.kilometrage} onChange={(e) => setForm({ ...form, kilometrage: e.target.value })} placeholder="45000" /></div>
              </div>
              <div><Label>Motif d'entrée</Label><Textarea value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} placeholder="Bruit au freinage, voyant moteur..." rows={2} /></div>
              <Button onClick={handleCreate} className="w-full">Créer le véhicule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <motion.div variants={staggerItem}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher par immatriculation, client, modèle..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input border-0 pl-9 h-10" />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div className="glass-card overflow-hidden hidden sm:block" variants={staggerItem}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Immatriculation</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Client</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Véhicule</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Étape</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Mécanicien</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-semibold">{v.immatriculation}</td>
                  <td className="py-3 px-4">{v.clientNom}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{v.marque} {v.modele}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="outline" className={`text-[10px] ${stepColor(v.etape)}`}>
                      {GARAGE_STEPS[v.etape]}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground text-xs">{v.mecanicienNom}</td>
                  <td className="py-3 px-4 text-center">
                    <Link to={`/admin/dossiers/${v.id}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <Eye className="h-3 w-3" /> Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mobile cards */}
      <motion.div className="space-y-3 sm:hidden" variants={staggerContainer} initial="initial" animate="animate">
        {filtered.map((v) => (
          <motion.div key={v.id} variants={staggerItem} className="glass-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold">{v.immatriculation}</span>
              <Badge variant="outline" className={`text-[10px] ${stepColor(v.etape)}`}>
                {GARAGE_STEPS[v.etape]}
              </Badge>
            </div>
            <p className="font-medium text-sm">{v.clientNom}</p>
            <p className="text-xs text-muted-foreground">{v.marque} {v.modele} · {v.mecanicienNom}</p>
            <p className="text-xs text-muted-foreground">{v.motifEntree}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
