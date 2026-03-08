import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical, Pencil, Save, X, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTimelineTemplates, DEFAULT_TIMELINE_STEPS } from "@/hooks/use-timeline";
import { useSubscription } from "@/hooks/use-subscription";
import { UpgradeBanner } from "@/components/admin/UpgradeBanner";
import { staggerItem } from "@/components/admin/AdminPageTransition";

export function TimelineTemplateEditor() {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useTimelineTemplates();
  const { plan, isEnterprise } = useSubscription();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSteps, setEditSteps] = useState<string[]>([]);
  const [newStepInput, setNewStepInput] = useState("");
  const [creating, setCreating] = useState(false);

  if (!isEnterprise) {
    return (
      <motion.div variants={staggerItem}>
        <UpgradeBanner
          currentPlan={plan}
          requiredPlan="enterprise"
          feature="Personnalisation de la timeline de livraison"
        />
      </motion.div>
    );
  }

  const startEdit = (template: { id: string; name: string; steps: string[] }) => {
    setEditingId(template.id);
    setEditName(template.name);
    setEditSteps([...template.steps]);
    setCreating(false);
  };

  const startCreate = () => {
    setEditingId(null);
    setEditName("");
    setEditSteps([...DEFAULT_TIMELINE_STEPS]);
    setCreating(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCreating(false);
  };

  const addStep = () => {
    if (!newStepInput.trim()) return;
    setEditSteps([...editSteps, newStepInput.trim()]);
    setNewStepInput("");
  };

  const removeStep = (index: number) => {
    setEditSteps(editSteps.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const newSteps = [...editSteps];
    const target = index + direction;
    if (target < 0 || target >= newSteps.length) return;
    [newSteps[index], newSteps[target]] = [newSteps[target], newSteps[index]];
    setEditSteps(newSteps);
  };

  const saveTemplate = () => {
    if (!editName.trim() || editSteps.length < 2) {
      toast.error("Le template doit avoir un nom et au moins 2 étapes");
      return;
    }
    if (creating) {
      createTemplate.mutate({ name: editName, steps: editSteps });
      toast.success("Template créé");
    } else if (editingId) {
      updateTemplate.mutate({ id: editingId, name: editName, steps: editSteps });
      toast.success("Template mis à jour");
    }
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    deleteTemplate.mutate(id);
    toast.success("Template supprimé");
  };

  const isEditing = creating || !!editingId;

  return (
    <motion.div className="space-y-4" variants={staggerItem}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Templates de timeline
          <Badge variant="outline" className="text-[10px] gap-1">
            <Sparkles className="h-3 w-3" /> Enterprise
          </Badge>
        </h3>
        {!isEditing && (
          <Button size="sm" variant="outline" onClick={startCreate} className="gap-1.5 text-xs">
            <Plus className="h-3 w-3" /> Nouveau template
          </Button>
        )}
      </div>

      {/* Existing templates */}
      {!isEditing && templates.map((t) => (
        <Card key={t.id} className="bg-muted/20 border-border/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{t.name}</p>
                {t.isDefault && <Badge variant="secondary" className="text-[9px]">Défaut</Badge>}
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(t)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                {!t.isDefault && (
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {t.steps.map((s, i) => (
                <Badge key={i} variant="outline" className="text-[9px]">{i + 1}. {s}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Editor */}
      {isEditing && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{creating ? "Nouveau template" : "Modifier le template"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nom du template"
              className="h-8 text-sm"
            />
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Étapes ({editSteps.length})</p>
              {editSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-1.5 group">
                  <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
                  <Input
                    value={step}
                    onChange={(e) => {
                      const newSteps = [...editSteps];
                      newSteps[i] = e.target.value;
                      setEditSteps(newSteps);
                    }}
                    className="h-7 text-xs flex-1"
                  />
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100" onClick={() => moveStep(i, -1)} disabled={i === 0}>↑</Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100" onClick={() => moveStep(i, 1)} disabled={i === editSteps.length - 1}>↓</Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeStep(i)} disabled={editSteps.length <= 2}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-1.5 mt-1">
                <Input
                  value={newStepInput}
                  onChange={(e) => setNewStepInput(e.target.value)}
                  placeholder="Nouvelle étape..."
                  className="h-7 text-xs flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addStep()}
                />
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={addStep}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-xs">Annuler</Button>
              <Button size="sm" onClick={saveTemplate} className="text-xs gap-1">
                <Save className="h-3 w-3" /> Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
