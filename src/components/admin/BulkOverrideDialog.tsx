import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SECTORS, ALL_MODULE_KEYS, type SectorKey } from "@/contexts/DemoPlanContext";
import { GENERIC_MODULE_LABELS, type SectorModulesConfig } from "@/data/sectorModules";
import { Layers, Search, CheckSquare, Square, Filter } from "lucide-react";
import { toast } from "sonner";

type FilterMode = "all" | "with-overrides" | "without-overrides";

interface BulkOverrideDialogProps {
  localOverrides: Record<string, SectorModulesConfig>;
  onApply: (
    sectors: string[],
    moduleKey: string,
    patch: { label?: string; description?: string; hidden?: boolean }
  ) => void;
}

export function BulkOverrideDialog({ localOverrides, onApply }: BulkOverrideDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>(ALL_MODULE_KEYS[0]);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [hidden, setHidden] = useState(false);
  const [useCustomLabel, setUseCustomLabel] = useState(false);
  const [useCustomDesc, setUseCustomDesc] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  // Reset form when module changes
  const handleModuleChange = (mod: string) => {
    setSelectedModule(mod);
    setLabel(GENERIC_MODULE_LABELS[mod] || mod);
    setDescription("");
    setHidden(false);
    setUseCustomLabel(false);
    setUseCustomDesc(false);
    setSelectedSectors(new Set());
  };

  const filteredSectors = useMemo(() => {
    return SECTORS.filter((s) => {
      const matchesSearch =
        s.label.toLowerCase().includes(search.toLowerCase()) ||
        s.key.toLowerCase().includes(search.toLowerCase());
      const overrideCount = Object.keys(localOverrides[s.key] || {}).length;
      const moduleHasOverride = !!(localOverrides[s.key]?.[selectedModule]);
      if (filterMode === "with-overrides" && !moduleHasOverride) return false;
      if (filterMode === "without-overrides" && moduleHasOverride) return false;
      return matchesSearch;
    });
  }, [search, filterMode, selectedModule, localOverrides]);

  const allFilteredSelected =
    filteredSectors.length > 0 &&
    filteredSectors.every((s) => selectedSectors.has(s.key));

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelectedSectors((prev) => {
        const next = new Set(prev);
        filteredSectors.forEach((s) => next.delete(s.key));
        return next;
      });
    } else {
      setSelectedSectors((prev) => {
        const next = new Set(prev);
        filteredSectors.forEach((s) => next.add(s.key));
        return next;
      });
    }
  };

  const toggleSector = (key: string) => {
    setSelectedSectors((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleApply = () => {
    if (selectedSectors.size === 0) {
      toast.error("Sélectionnez au moins un secteur.");
      return;
    }
    const patch: { label?: string; description?: string; hidden?: boolean } = { hidden };
    if (useCustomLabel && label.trim()) patch.label = label.trim();
    if (useCustomDesc) patch.description = description.trim() || undefined;
    onApply([...selectedSectors], selectedModule, patch);
    toast.success(`Override "${selectedModule}" appliqué à ${selectedSectors.size} secteur(s).`);
    setOpen(false);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (v) {
      setSelectedModule(ALL_MODULE_KEYS[0]);
      setLabel(GENERIC_MODULE_LABELS[ALL_MODULE_KEYS[0]] || ALL_MODULE_KEYS[0]);
      setDescription("");
      setHidden(false);
      setUseCustomLabel(false);
      setUseCustomDesc(false);
      setSelectedSectors(new Set());
      setSearch("");
      setFilterMode("all");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Layers className="h-4 w-4 mr-1" /> Override en masse
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Appliquer un override sur plusieurs secteurs
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 overflow-y-auto flex-1 pr-1">
          {/* Step 1: Choose module */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">1. Choisir le module</Label>
            <Select value={selectedModule} onValueChange={handleModuleChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_MODULE_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    <span className="font-mono text-xs text-muted-foreground mr-2">{key}</span>
                    {GENERIC_MODULE_LABELS[key] || key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Step 2: Configure override */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold block">2. Configurer l'override</Label>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
              <Switch checked={hidden} onCheckedChange={setHidden} />
              <div>
                <p className="text-sm font-medium">Masquer le module</p>
                <p className="text-xs text-muted-foreground">Cache ce module dans la sidebar pour les secteurs sélectionnés</p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="use-label"
                  checked={useCustomLabel}
                  onCheckedChange={(v) => setUseCustomLabel(!!v)}
                />
                <Label htmlFor="use-label" className="text-sm cursor-pointer">Personnaliser le label</Label>
              </div>
              {useCustomLabel && (
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={`Label par défaut : ${GENERIC_MODULE_LABELS[selectedModule] || selectedModule}`}
                  className="mt-1"
                />
              )}
            </div>

            <div className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="use-desc"
                  checked={useCustomDesc}
                  onCheckedChange={(v) => setUseCustomDesc(!!v)}
                />
                <Label htmlFor="use-desc" className="text-sm cursor-pointer">Ajouter une description</Label>
              </div>
              {useCustomDesc && (
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description affichée dans les tooltips..."
                  className="mt-1 min-h-[60px]"
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Step 3: Select sectors */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">3. Sélectionner les secteurs</Label>
              {selectedSectors.size > 0 && (
                <Badge variant="secondary">{selectedSectors.size} sélectionné(s)</Badge>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un secteur..."
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <Select value={filterMode} onValueChange={(v) => setFilterMode(v as FilterMode)}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  <SelectItem value="with-overrides">Avec override sur ce module</SelectItem>
                  <SelectItem value="without-overrides">Sans override sur ce module</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select all row */}
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border/60 hover:bg-muted/40 transition-colors text-sm text-muted-foreground"
            >
              {allFilteredSelected ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {allFilteredSelected ? "Tout désélectionner" : "Tout sélectionner"} ({filteredSectors.length})
            </button>

            {/* Sector list */}
            <ScrollArea className="h-[200px] border border-border/40 rounded-xl">
              <div className="p-2 space-y-0.5">
                {filteredSectors.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">Aucun secteur trouvé.</p>
                )}
                {filteredSectors.map((s) => {
                  const isChecked = selectedSectors.has(s.key);
                  const hasModuleOverride = !!(localOverrides[s.key]?.[selectedModule]);
                  const totalOverrides = Object.keys(localOverrides[s.key] || {}).length;

                  return (
                    <button
                      key={s.key}
                      onClick={() => toggleSector(s.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-sm text-left ${
                        isChecked ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/40 border border-transparent"
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleSector(s.key)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-base leading-none">{s.icon}</span>
                      <span className="font-medium flex-1">{s.label}</span>
                      {hasModuleOverride && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-primary border-primary/40">
                          override
                        </Badge>
                      )}
                      {totalOverrides > 0 && (
                        <span className="text-[10px] text-muted-foreground">{totalOverrides} total</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={selectedSectors.size === 0}
          >
            <Layers className="h-4 w-4 mr-1" />
            Appliquer à {selectedSectors.size} secteur(s)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
