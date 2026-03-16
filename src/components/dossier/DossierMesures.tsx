import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Ruler, Plus, Pencil, Info } from "lucide-react";
import { toast } from "sonner";

interface Mesure {
  id: string;
  libelle: string;
  valeur: string;
  unite: string;
  date: string;
}

const MESURES_PAR_SECTEUR: Record<string, { libelle: string; unite: string }[]> = {
  mariage: [
    { libelle: "Tour de poitrine", unite: "cm" },
    { libelle: "Tour de taille", unite: "cm" },
    { libelle: "Tour de hanches", unite: "cm" },
    { libelle: "Longueur dos", unite: "cm" },
    { libelle: "Pointure", unite: "" },
  ],
  coiffure: [
    { libelle: "Tour de tête", unite: "cm" },
    { libelle: "Longueur cheveux", unite: "cm" },
  ],
  "coach-sportif": [
    { libelle: "Poids", unite: "kg" },
    { libelle: "Taille", unite: "cm" },
    { libelle: "IMC", unite: "" },
    { libelle: "Tour de bras", unite: "cm" },
    { libelle: "Tour de cuisse", unite: "cm" },
  ],
  "association-sportive": [
    { libelle: "Poids", unite: "kg" },
    { libelle: "Taille", unite: "cm" },
  ],
};

const SECTEURS_AVEC_MESURES = Object.keys(MESURES_PAR_SECTEUR);

interface Props {
  dossierId: string;
  sector?: string;
}

export function DossierMesures({ dossierId, sector }: Props) {
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ libelle: "", valeur: "", unite: "cm" });

  const applicable = sector && SECTEURS_AVEC_MESURES.includes(sector);

  if (!applicable) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Info className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">Non applicable pour ce secteur</p>
      </div>
    );
  }

  const templates = MESURES_PAR_SECTEUR[sector!] || [];

  const openAdd = () => { setEditId(null); setForm({ libelle: "", valeur: "", unite: "cm" }); setDialogOpen(true); };
  const openEdit = (m: Mesure) => { setEditId(m.id); setForm({ libelle: m.libelle, valeur: m.valeur, unite: m.unite }); setDialogOpen(true); };

  const save = () => {
    if (!form.libelle || !form.valeur) { toast.error("Champs requis"); return; }
    if (editId) {
      setMesures(prev => prev.map(m => m.id === editId ? { ...m, ...form, date: new Date().toISOString().split("T")[0] } : m));
      toast.success("Mesure modifiée");
    } else {
      setMesures(prev => [...prev, { id: `mes-${Date.now()}`, ...form, date: new Date().toISOString().split("T")[0] }]);
      toast.success("Mesure ajoutée");
    }
    setDialogOpen(false);
  };

  const initFromTemplates = () => {
    const newMesures = templates.map(t => ({
      id: `mes-${Date.now()}-${Math.random()}`,
      libelle: t.libelle,
      valeur: "",
      unite: t.unite,
      date: new Date().toISOString().split("T")[0],
    }));
    setMesures(newMesures);
    toast.success("Mesures initialisées depuis le modèle");
  };

  if (mesures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Ruler className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground mb-3">Aucune mesure enregistrée</p>
        <div className="flex gap-2">
          <Button onClick={initFromTemplates} className="gap-1.5"><Plus className="h-4 w-4" /> Initialiser les mesures</Button>
          <Button variant="outline" onClick={openAdd} className="gap-1.5"><Plus className="h-4 w-4" /> Ajouter manuellement</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={openAdd} className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Ajouter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead>Valeur</TableHead>
            <TableHead>Unité</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mesures.map(m => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.libelle}</TableCell>
              <TableCell>{m.valeur || <span className="text-muted-foreground italic">—</span>}</TableCell>
              <TableCell className="text-muted-foreground">{m.unite}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{m.date}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" onClick={() => openEdit(m)}><Pencil className="h-3.5 w-3.5" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Modifier" : "Nouvelle mesure"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input value={form.libelle} onChange={e => setForm(p => ({ ...p, libelle: e.target.value }))} placeholder="Libellé" />
            <Input value={form.valeur} onChange={e => setForm(p => ({ ...p, valeur: e.target.value }))} placeholder="Valeur" />
            <Input value={form.unite} onChange={e => setForm(p => ({ ...p, unite: e.target.value }))} placeholder="Unité" />
          </div>
          <DialogFooter><Button onClick={save}>{editId ? "Modifier" : "Ajouter"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
