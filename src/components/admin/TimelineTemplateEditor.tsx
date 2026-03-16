import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Save, Clock, Sparkles, Layers, ChevronDown, ChevronUp, ArrowDownToLine, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTimelineTemplates, DEFAULT_TIMELINE_STEPS } from "@/hooks/use-timeline";
import { useSubscription } from "@/hooks/use-subscription";
import { UpgradeBanner } from "@/components/admin/UpgradeBanner";
import { staggerItem } from "@/components/admin/AdminPageTransition";
import { useDemoPlan, SECTORS } from "@/contexts/DemoPlanContext";
import { getPresetsForSector, getAllSectorPresets, getAllCategories, PRESET_CATEGORY_LABELS, type TimelinePreset, type PresetCategory } from "@/data/sectorTimelines";

interface TimelineTemplateEditorProps {
  filterCategory?: "livraison" | "suivi";
}

export function TimelineTemplateEditor({ filterCategory }: TimelineTemplateEditorProps) {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useTimelineTemplates();
  const { plan, isEnterprise, isBusiness } = useSubscription();
  const { demoSector } = useDemoPlan();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSteps, setEditSteps] = useState<string[]>([]);
  const [newStepInput, setNewStepInput] = useState("");
  const [creating, setCreating] = useState(false);
  const [showAllSectors, setShowAllSectors] = useState(false);
  const [selectedBrowseSector, setSelectedBrowseSector] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const hasAccess = isEnterprise || isBusiness;

  if (!hasAccess) {
    return (
      <motion.div variants={staggerItem}>
        <UpgradeBanner
          currentPlan={plan}
          requiredPlan="business"
          feature={`Personnalisation de la timeline de ${filterCategory || "livraison"}`}
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

  const startFromPreset = (preset: TimelinePreset) => {
    setEditingId(null);
    setEditName(preset.name);
    setEditSteps([...preset.steps]);
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

  // Category-level filter based on prop
  const categoryFilter = (presets: TimelinePreset[]) => {
    if (!filterCategory) return presets;
    if (filterCategory === "suivi") return presets.filter((p) => p.category === "suivi");
    return presets.filter((p) => p.category !== "suivi");
  };

  // Presets for current sector
  const currentSectorLabel = SECTORS.find((s) => s.key === demoSector)?.label || "Générique";
  const sectorPresets = categoryFilter(getPresetsForSector(demoSector));

  // All sectors for browsing
  const allSectorPresets = getAllSectorPresets().map((s) => ({ ...s, presets: categoryFilter(s.presets) })).filter((s) => s.presets.length > 0);
  const allCategories = getAllCategories().filter((cat) => {
    if (!filterCategory) return true;
    if (filterCategory === "suivi") return cat === "suivi";
    return cat !== "suivi";
  });

  // Apply both sector and category filters
  const filteredSectorPresets = allSectorPresets
    .filter((s) => selectedBrowseSector === "all" || s.sectorKey === selectedBrowseSector)
    .map((s) => ({
      ...s,
      presets: selectedCategory === "all" ? s.presets : s.presets.filter((p) => p.category === selectedCategory),
    }))
    .filter((s) => s.presets.length > 0);

  // Also filter sector suggestions by category
  const filteredSectorSuggestions = selectedCategory === "all"
    ? sectorPresets
    : sectorPresets.filter((p) => p.category === selectedCategory);

  return (
    <motion.div className="space-y-4" variants={staggerItem}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <Clock className="h-4 w-4 text-primary" />
          Templates de timeline
          <Badge className="text-[10px] gap-1 bg-primary/10 text-primary border border-primary/30">
            <Sparkles className="h-3 w-3" /> Business / Enterprise
          </Badge>
        </h3>
        {!isEditing && (
          <Button size="sm" variant="outline" onClick={startCreate} className="gap-1.5 text-xs">
            <Plus className="h-3 w-3" /> Nouveau template
          </Button>
        )}
      </div>

      {/* Category filter */}
      {!isEditing && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <button
            onClick={() => setSelectedCategory("all")}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${selectedCategory === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-border hover:bg-muted"}`}
          >
            Tous
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? "all" : cat)}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${selectedCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-border hover:bg-muted"}`}
            >
              {PRESET_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* Sector-specific suggestions */}
      {!isEditing && filteredSectorSuggestions.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-3 space-y-2">
            <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Suggestions pour {currentSectorLabel}
            </p>
            <div className="space-y-2">
              {filteredSectorSuggestions.map((preset, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-background/60 border border-border/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <p className="text-xs font-medium">{preset.name}</p>
                      <Badge variant="secondary" className="text-[8px] px-1.5 py-0">{PRESET_CATEGORY_LABELS[preset.category]}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {preset.steps.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-[8px] px-1.5 py-0">{i + 1}. {s}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 h-7 text-[10px] gap-1" onClick={() => startFromPreset(preset)}>
                    <ArrowDownToLine className="h-3 w-3" /> Utiliser
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Browse all sectors */}
      {!isEditing && (
        <div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs gap-1 text-muted-foreground w-full justify-start"
            onClick={() => setShowAllSectors(!showAllSectors)}
          >
            {showAllSectors ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Parcourir les modèles par secteur d'activité
          </Button>

          {showAllSectors && (
            <div className="mt-2 space-y-2">
              <Select value={selectedBrowseSector} onValueChange={setSelectedBrowseSector}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Tous les secteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  {allSectorPresets.map((s) => (
                    <SelectItem key={s.sectorKey} value={s.sectorKey}>{s.sectorLabel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {filteredSectorPresets.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">Aucun modèle pour cette combinaison de filtres</p>
                )}
                {filteredSectorPresets.map((sector) => (
                  <div key={sector.sectorKey}>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{sector.sectorLabel}</p>
                    <div className="space-y-1.5">
                      {sector.presets.map((preset, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-muted/30 border border-border/20">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <p className="text-xs font-medium">{preset.name}</p>
                              <Badge variant="secondary" className="text-[8px] px-1 py-0">{PRESET_CATEGORY_LABELS[preset.category]}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-0.5">
                              {preset.steps.map((s, i) => (
                                <Badge key={i} variant="outline" className="text-[8px] px-1 py-0">{s}</Badge>
                              ))}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0 h-6 text-[10px] gap-1" onClick={() => startFromPreset(preset)}>
                            <ArrowDownToLine className="h-2.5 w-2.5" /> Utiliser
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
