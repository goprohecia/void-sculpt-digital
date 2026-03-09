import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  CheckSquare, Plus, GripVertical, Circle, CheckCircle2, Clock,
  AlertCircle, CalendarIcon, Pencil, Trash2, MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  titre: string;
  description?: string;
  statut: "todo" | "en_cours" | "termine";
  priorite: "haute" | "moyenne" | "basse";
  assignee: string;
  dossier?: string;
  dateEcheance?: string;
}

const DEMO_TASKS: Task[] = [
  { id: "1", titre: "Finaliser la maquette du site web", statut: "en_cours", priorite: "haute", assignee: "Sophie M.", dossier: "DOS-2026-042", dateEcheance: "2026-03-15" },
  { id: "2", titre: "Envoyer le devis au client Dupont", statut: "todo", priorite: "haute", assignee: "Admin", dossier: "DOS-2026-038", dateEcheance: "2026-03-10" },
  { id: "3", titre: "Mettre à jour le catalogue produits", statut: "todo", priorite: "moyenne", assignee: "Marc L.", dateEcheance: "2026-03-20" },
  { id: "4", titre: "Préparer le rapport mensuel", statut: "todo", priorite: "basse", assignee: "Admin", dateEcheance: "2026-03-31" },
  { id: "5", titre: "Relancer fournisseur ABC", statut: "en_cours", priorite: "moyenne", assignee: "Sophie M.", dateEcheance: "2026-03-12" },
  { id: "6", titre: "Valider les livrables du dossier Martin", statut: "termine", priorite: "haute", assignee: "Admin", dossier: "DOS-2026-035" },
  { id: "7", titre: "Configurer le domaine personnalisé", statut: "termine", priorite: "moyenne", assignee: "Marc L." },
  { id: "8", titre: "Former le nouveau salarié sur l'outil", statut: "en_cours", priorite: "basse", assignee: "Admin", dateEcheance: "2026-03-18" },
];

const COLUMNS = [
  { key: "todo" as const, label: "À faire", icon: Circle, color: "text-muted-foreground" },
  { key: "en_cours" as const, label: "En cours", icon: Clock, color: "text-amber-400" },
  { key: "termine" as const, label: "Terminé", icon: CheckCircle2, color: "text-emerald-400" },
];

const PRIORITE_BADGE: Record<string, string> = {
  haute: "bg-red-500/10 text-red-400 border-red-500/20",
  moyenne: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  basse: "bg-muted text-muted-foreground border-border",
};

const ASSIGNEES = ["Admin", "Sophie M.", "Marc L.", "Julie R.", "Thomas D."];

const DEMO_DOSSIERS = [
  { reference: "DOS-2026-042", client_nom: "Martin SARL" },
  { reference: "DOS-2026-038", client_nom: "Dupont Pierre" },
  { reference: "DOS-2026-035", client_nom: "Lefèvre & Associés" },
  { reference: "DOS-2026-041", client_nom: "Garcia Maria" },
  { reference: "DOS-2026-040", client_nom: "Tech Solutions SAS" },
];

const emptyForm = (): Omit<Task, "id"> => ({
  titre: "",
  description: "",
  statut: "todo",
  priorite: "moyenne",
  assignee: "Admin",
  dossier: "",
  dateEcheance: "",
});

export default function AdminTaches() {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<Omit<Task, "id">>(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: dossiers = [] } = useQuery({
    queryKey: ["dossiers-for-tasks"],
    queryFn: async () => {
      const { data } = await supabase
        .from("dossiers")
        .select("reference, client_nom")
        .order("created_at", { ascending: false })
        .limit(50);
      return (data && data.length > 0) ? data : DEMO_DOSSIERS;
    },
  });

  // Helper to get client name for a dossier reference
  const getDossierLabel = (ref: string) => {
    const d = dossiers.find(dos => dos.reference === ref);
    return d ? `${ref} — ${d.client_nom}` : ref;
  };

  const openCreate = () => {
    setEditingTask(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ titre: task.titre, description: task.description || "", statut: task.statut, priorite: task.priorite, assignee: task.assignee, dossier: task.dossier || "", dateEcheance: task.dateEcheance || "" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.titre.trim()) return;
    if (editingTask) {
      setTasks((prev) => prev.map((t) => t.id === editingTask.id ? { ...t, ...form, dossier: form.dossier || undefined } : t));
    } else {
      setTasks((prev) => [...prev, { id: Date.now().toString(), ...form, dossier: form.dossier || undefined }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  const moveTask = (id: string, newStatut: Task["statut"]) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, statut: newStatut } : t)));
  };

  const selectedDate = form.dateEcheance ? new Date(form.dateEcheance) : undefined;

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CheckSquare className="h-6 w-6 text-primary" /> Tâches
              </h1>
              <p className="text-muted-foreground text-sm">{tasks.filter((t) => t.statut !== "termine").length} tâches en cours</p>
            </div>
            <Button onClick={openCreate} className="gap-1.5">
              <Plus className="h-4 w-4" /> Ajouter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t) => t.statut === col.key);
              return (
                <Card key={col.key} className="bg-muted/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <col.icon className={`h-4 w-4 ${col.color}`} />
                      {col.label}
                      <Badge variant="outline" className="ml-auto text-xs">{colTasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 min-h-[200px]">
                    {colTasks.map((task) => (
                      <div key={task.id} className="p-3 rounded-lg bg-background border border-border/50 space-y-2 hover:border-primary/30 transition-colors group">
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground/30 mt-0.5 shrink-0" />
                          <p className="text-sm font-medium flex-1">{task.titre}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(task)}>
                                <Pencil className="h-3.5 w-3.5 mr-2" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteConfirm(task.id)}>
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-2 pl-6 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] ${PRIORITE_BADGE[task.priorite]}`}>
                            {task.priorite === "haute" && <AlertCircle className="h-3 w-3 mr-0.5" />}
                            {task.priorite}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{task.assignee}</span>
                          {task.dossier && (
                            <span className="text-[10px] text-primary/60">
                              {getDossierLabel(task.dossier)}
                            </span>
                          )}
                          {task.dateEcheance && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <CalendarIcon className="h-2.5 w-2.5" />
                              {format(new Date(task.dateEcheance), "dd MMM", { locale: fr })}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 pl-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          {col.key !== "todo" && (
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => moveTask(task.id, "todo")}>← À faire</Button>
                          )}
                          {col.key !== "en_cours" && (
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => moveTask(task.id, "en_cours")}>En cours</Button>
                          )}
                          {col.key !== "termine" && (
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => moveTask(task.id, "termine")}>✓ Fait</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Create / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
              </DialogTitle>
              <DialogDescription>
                {editingTask ? "Modifiez les détails de la tâche." : "Remplissez les informations pour créer une tâche."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input value={form.titre} onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))} placeholder="Titre de la tâche" />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description optionnelle…" rows={2} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select value={form.priorite} onValueChange={(v) => setForm((f) => ({ ...f, priorite: v as Task["priorite"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="haute">🔴 Haute</SelectItem>
                      <SelectItem value="moyenne">🟡 Moyenne</SelectItem>
                      <SelectItem value="basse">⚪ Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select value={form.statut} onValueChange={(v) => setForm((f) => ({ ...f, statut: v as Task["statut"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">À faire</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="termine">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assigné à</Label>
                <Select value={form.assignee} onValueChange={(v) => setForm((f) => ({ ...f, assignee: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ASSIGNEES.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dossier lié</Label>
                <Select value={form.dossier || "_none"} onValueChange={(v) => setForm((f) => ({ ...f, dossier: v === "_none" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Aucun</SelectItem>
                    {dossiers.map((d) => (
                      <SelectItem key={d.reference} value={d.reference}>
                        {d.reference} — {d.client_nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date d'échéance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => setForm((f) => ({ ...f, dateEcheance: d ? format(d, "yyyy-MM-dd") : "" }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleSave} disabled={!form.titre.trim()}>
                {editingTask ? "Enregistrer" : "Créer la tâche"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Supprimer la tâche ?</DialogTitle>
              <DialogDescription>Cette action est irréversible.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
              <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
