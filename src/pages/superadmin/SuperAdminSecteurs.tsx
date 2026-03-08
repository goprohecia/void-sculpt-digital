import { useState } from "react";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { useDemoPlan, SECTORS, ALL_MODULE_KEYS, type SectorKey } from "@/contexts/DemoPlanContext";
import { GENERIC_MODULE_LABELS, type SectorModuleOverride, type SectorModulesConfig } from "@/data/sectorModules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Save, RotateCcw, Eye, EyeOff, Pencil, MonitorSmartphone,
  LayoutDashboard, Users, FolderOpen, Target, Receipt, Bell,
  Package, MessageSquare, Mail, CalendarDays, Calendar,
  CheckSquare, LifeBuoy, StickyNote, BarChart3, FileText,
  FolderClosed, Timer, Zap, Bot, Settings,
} from "lucide-react";

// Icon map for sidebar preview
const MODULE_ICONS: Record<string, React.ElementType> = {
  overview: LayoutDashboard, clients: Users, employees: Users,
  dossiers: FolderOpen, pipeline: Target, facturation: Receipt,
  relances: Bell, stock: Package, messagerie: MessageSquare,
  emails: Mail, "rendez-vous": CalendarDays, agenda: Calendar,
  taches: CheckSquare, support: LifeBuoy, notes: StickyNote,
  analyse: BarChart3, rapports: FileText, documents: FolderClosed,
  temps: Timer, automatisations: Zap, ia: Bot, parametres: Settings,
};

function SidebarPreview({ overrides, sectorKey }: { overrides: SectorModulesConfig; sectorKey: string }) {
  const sectorInfo = SECTORS.find((s) => s.key === sectorKey);

  const modules = ALL_MODULE_KEYS.map((key) => {
    const override = overrides[key];
    const label = override?.label || GENERIC_MODULE_LABELS[key] || key;
    const hidden = override?.hidden === true;
    const isOverridden = !!override;
    const Icon = MODULE_ICONS[key] || FolderOpen;
    return { key, label, hidden, isOverridden, Icon };
  });

  return (
    <div className="w-[260px] rounded-2xl border border-border/50 bg-sidebar/80 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/30 text-center">
        <p className="text-lg font-bold">{sectorInfo?.icon} {sectorInfo?.label}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Prévisualisation sidebar</p>
      </div>

      {/* Module list */}
      <ScrollArea className="h-[420px]">
        <div className="p-2 space-y-0.5">
          {modules.map((m) => {
            if (m.hidden) {
              return (
                <div key={m.key} className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg opacity-30 line-through text-xs text-muted-foreground">
                  <m.Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{m.label}</span>
                  <EyeOff className="h-3 w-3 ml-auto shrink-0" />
                </div>
              );
            }
            return (
              <div
                key={m.key}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  m.key === "overview" ? "bg-primary/10 text-primary font-medium" : "text-foreground/80 hover:bg-muted/50"
                }`}
              >
                <m.Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{m.label}</span>
                {m.isOverridden && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shrink-0" title="Override actif" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border/30 text-center">
        <p className="text-[10px] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-1 align-middle" />
          = module avec override
        </p>
      </div>
    </div>
  );
}

export default function SuperAdminSecteurs() {
  const { sectorModuleOverrides, setSectorModuleOverrides, setDemoSector } = useDemoPlan();
  const [selectedSector, setSelectedSector] = useState<string>(SECTORS[0].key);
  const [localOverrides, setLocalOverrides] = useState<Record<string, SectorModulesConfig>>(() => JSON.parse(JSON.stringify(sectorModuleOverrides)));
  const [editingModule, setEditingModule] = useState<string | null>(null);

  const currentOverrides = localOverrides[selectedSector] || {};
  const sectorInfo = SECTORS.find((s) => s.key === selectedSector);

  const getOverride = (moduleKey: string): SectorModuleOverride => {
    return currentOverrides[moduleKey] || { label: GENERIC_MODULE_LABELS[moduleKey] || moduleKey };
  };

  const updateOverride = (moduleKey: string, patch: Partial<SectorModuleOverride>) => {
    setLocalOverrides((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy[selectedSector]) copy[selectedSector] = {};
      const existing = copy[selectedSector][moduleKey] || { label: GENERIC_MODULE_LABELS[moduleKey] || moduleKey };
      copy[selectedSector][moduleKey] = { ...existing, ...patch };
      return copy;
    });
  };

  const removeOverride = (moduleKey: string) => {
    setLocalOverrides((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy[selectedSector]) {
        delete copy[selectedSector][moduleKey];
      }
      return copy;
    });
    setEditingModule(null);
  };

  const handleSave = () => {
    setSectorModuleOverrides(localOverrides);
    toast.success("Overrides sectoriels sauvegardés !");
  };

  const handleReset = () => {
    setLocalOverrides(JSON.parse(JSON.stringify(sectorModuleOverrides)));
    toast.info("Modifications annulées");
  };

  const handlePreviewInAdmin = () => {
    // Save current overrides to context, switch sector, and open admin in new tab
    setSectorModuleOverrides(localOverrides);
    setDemoSector(selectedSector as SectorKey);
    window.open("/admin", "_blank");
  };

  const overriddenKeys = Object.keys(currentOverrides);
  const nonOverriddenKeys = ALL_MODULE_KEYS.filter((k) => !overriddenKeys.includes(k));

  return (
    <SuperAdminLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Overrides sectoriels</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Personnalisez les labels, descriptions et visibilité des modules par secteur d'activité.
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MonitorSmartphone className="h-4 w-4 mr-1" /> Prévisualiser
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-fit">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {sectorInfo?.icon} Prévisualisation — {sectorInfo?.label}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-4">
                  <SidebarPreview overrides={currentOverrides} sectorKey={selectedSector} />
                </div>
                <div className="flex justify-center">
                  <Button size="sm" variant="secondary" onClick={handlePreviewInAdmin}>
                    <Eye className="h-4 w-4 mr-1" /> Ouvrir dans l'espace Admin
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Annuler
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Sauvegarder
            </Button>
          </div>
        </div>

        {/* Sector selector */}
        <Card className="glass-card glass-noise">
          <CardContent className="pt-6">
            <Label className="text-sm font-medium mb-2 block">Secteur</Label>
            <Select value={selectedSector} onValueChange={(v) => { setSelectedSector(v); setEditingModule(null); }}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.icon} {s.label}
                    {localOverrides[s.key] && Object.keys(localOverrides[s.key]).length > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({Object.keys(localOverrides[s.key]).length} overrides)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Overridden modules */}
        <Card className="glass-card glass-noise">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {sectorInfo?.icon} Modules personnalisés — {sectorInfo?.label}
              <Badge variant="secondary" className="ml-auto">{overriddenKeys.length} overrides</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overriddenKeys.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Aucun override pour ce secteur. Cliquez sur un module ci-dessous pour en ajouter.
              </p>
            )}
            {overriddenKeys.map((moduleKey) => {
              const override = getOverride(moduleKey);
              const isEditing = editingModule === moduleKey;
              const isHidden = override.hidden === true;

              return (
                <div
                  key={moduleKey}
                  className={`rounded-xl border p-4 transition-all ${isEditing ? "border-primary bg-primary/5" : "border-border/50 bg-muted/30"} ${isHidden ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">{moduleKey}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{override.label}</span>
                        {isHidden && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            <EyeOff className="h-3 w-3 mr-0.5" /> Masqué
                          </Badge>
                        )}
                      </div>
                      {override.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{override.description}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingModule(isEditing ? null : moduleKey)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {isEditing && (
                    <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Label personnalisé</Label>
                          <Input
                            value={override.label}
                            onChange={(e) => updateOverride(moduleKey, { label: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-5">
                          <Switch
                            checked={isHidden}
                            onCheckedChange={(v) => updateOverride(moduleKey, { hidden: v })}
                          />
                          <Label className="text-xs">Masquer ce module</Label>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={override.description || ""}
                          onChange={(e) => updateOverride(moduleKey, { description: e.target.value || undefined })}
                          className="mt-1 min-h-[60px]"
                          placeholder="Description affichée dans les tooltips et guides..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button variant="destructive" size="sm" onClick={() => removeOverride(moduleKey)}>
                          Supprimer l'override
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Add override for non-overridden modules */}
        <Card className="glass-card glass-noise">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" /> Modules sans override
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {nonOverriddenKeys.map((moduleKey) => (
                <button
                  key={moduleKey}
                  onClick={() => {
                    updateOverride(moduleKey, { label: GENERIC_MODULE_LABELS[moduleKey] || moduleKey });
                    setEditingModule(moduleKey);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/50 text-sm transition-colors text-left"
                >
                  <span className="font-mono text-xs text-muted-foreground">{moduleKey}</span>
                  <span className="text-muted-foreground ml-auto">+</span>
                </button>
              ))}
            </div>
            {nonOverriddenKeys.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Tous les modules ont un override pour ce secteur.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
