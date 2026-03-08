import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, GripVertical, Circle, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  titre: string;
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

export default function AdminTaches() {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), titre: newTask.trim(), statut: "todo", priorite: "moyenne", assignee: "Admin" },
    ]);
    setNewTask("");
  };

  const moveTask = (id: string, newStatut: Task["statut"]) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, statut: newStatut } : t)));
  };

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
            <div className="flex gap-2">
              <Input placeholder="Nouvelle tâche..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} className="w-64" />
              <Button onClick={addTask} disabled={!newTask.trim()} className="gap-1.5">
                <Plus className="h-4 w-4" /> Ajouter
              </Button>
            </div>
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
                      <div key={task.id} className="p-3 rounded-lg bg-background border border-border/50 space-y-2 hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground/30 mt-0.5 shrink-0" />
                          <p className="text-sm font-medium flex-1">{task.titre}</p>
                        </div>
                        <div className="flex items-center gap-2 pl-6 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] ${PRIORITE_BADGE[task.priorite]}`}>
                            {task.priorite === "haute" && <AlertCircle className="h-3 w-3 mr-0.5" />}
                            {task.priorite}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{task.assignee}</span>
                          {task.dossier && <span className="text-[10px] text-primary/60">{task.dossier}</span>}
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
      </AdminPageTransition>
    </AdminLayout>
  );
}
