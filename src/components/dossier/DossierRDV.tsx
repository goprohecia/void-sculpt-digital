import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarDays, Plus, Trash2, Bell, Pencil } from "lucide-react";
import { toast } from "sonner";

interface RDV {
  id: string;
  date: string;
  heure: string;
  type: string;
  statut: "a_venir" | "passe" | "annule";
}

interface Props {
  dossierId: string;
  rdvEffectue?: boolean;
}

export function DossierRDV({ dossierId, rdvEffectue }: Props) {
  const [rdvs, setRdvs] = useState<RDV[]>(() => {
    if (rdvEffectue) {
      return [{
        id: "rdv-initial",
        date: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
        heure: "10:00",
        type: "Rendez-vous initial",
        statut: "passe",
      }];
    }
    return [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ date: "", heure: "10:00", type: "Rendez-vous" });

  const openAdd = () => { setEditId(null); setForm({ date: "", heure: "10:00", type: "Rendez-vous" }); setDialogOpen(true); };
  const openEdit = (r: RDV) => { setEditId(r.id); setForm({ date: r.date, heure: r.heure, type: r.type }); setDialogOpen(true); };

  const save = () => {
    if (!form.date) { toast.error("Date requise"); return; }
    const statut: RDV["statut"] = new Date(form.date) < new Date() ? "passe" : "a_venir";
    if (editId) {
      setRdvs(prev => prev.map(r => r.id === editId ? { ...r, ...form, statut } : r));
      toast.success("RDV modifié");
    } else {
      setRdvs(prev => [...prev, { id: `rdv-${Date.now()}`, ...form, statut }]);
      toast.success("RDV ajouté");
    }
    setDialogOpen(false);
  };

  const remove = (id: string) => { setRdvs(prev => prev.filter(r => r.id !== id)); toast.success("RDV supprimé"); };

  const statutBadge = (s: RDV["statut"]) => {
    if (s === "a_venir") return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">À venir</Badge>;
    if (s === "passe") return <Badge className="bg-primary/20 text-primary border-primary/30">Passé</Badge>;
    return <Badge variant="destructive">Annulé</Badge>;
  };

  if (rdvs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CalendarDays className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground mb-3">Aucun rendez-vous planifié</p>
        <Button onClick={openAdd} className="gap-1.5"><Plus className="h-4 w-4" /> Programmer un RDV</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={openAdd} className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Ajouter RDV</Button>
      </div>
      <div className="space-y-2">
        {rdvs.map(r => (
          <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{r.type}</p>
                <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString("fr-FR")} à {r.heure}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statutBadge(r.statut)}
              <Button size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Rappel envoyé au client")}><Bell className="h-3.5 w-3.5" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Supprimer ce RDV ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => remove(r.id)}>Supprimer</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Modifier le RDV" : "Nouveau RDV"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            <Input type="time" value={form.heure} onChange={e => setForm(p => ({ ...p, heure: e.target.value }))} />
            <Input value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} placeholder="Type de RDV" />
          </div>
          <DialogFooter><Button onClick={save}>{editId ? "Modifier" : "Ajouter"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
