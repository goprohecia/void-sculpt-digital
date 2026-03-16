import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Building2, Bell, Save, CheckCircle, Mail, Phone, MapPin, Lock, Eye, EyeOff, Puzzle, Receipt, Tag, Plus, Trash2, Pencil, Crown, Sparkles, Palette, Globe, Upload, Type, Image, Clock, BarChart3, GripVertical, CalendarDays, Copy, Link, ArrowRightLeft, TrendingUp, Shield, RotateCcw } from "lucide-react";
import { WhiteLabelPreview } from "@/components/admin/WhiteLabelPreview";
import { AVAILABLE_FONTS } from "@/hooks/use-white-label";
import { useOnboardingStatus } from "@/hooks/use-onboarding";
import { TimelineTemplateEditor } from "@/components/admin/TimelineTemplateEditor";
import { StepNotificationSettings } from "@/components/admin/StepNotificationSettings";
import { BookingSettingsTab } from "@/components/admin/BookingSettingsTab";
import { AdminModulesSection } from "@/components/admin/AdminModulesSection";
import { Textarea } from "@/components/ui/textarea";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAppSettings, ALL_ADMIN_MODULES, ALL_CLIENT_MODULES, ALL_EMPLOYEE_MODULES } from "@/hooks/use-app-settings";
import { useTags } from "@/hooks/use-produits";
import { useServiceCategories, type ServiceCategory } from "@/hooks/use-service-categories";
import { useSubscription } from "@/hooks/use-subscription";
import { useCustomSpaces, SECTOR_SPACE_TEMPLATES } from "@/hooks/use-custom-spaces";
import { UpgradeBanner } from "@/components/admin/UpgradeBanner";
import { useWhiteLabel } from "@/hooks/use-white-label";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { getSectorRoleLabel } from "@/data/sectorModules";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RolesPermissionsSettings } from "@/components/admin/RolesPermissionsSettings";
import { BrevoConfigSettings } from "@/components/admin/BrevoConfigSettings";
import { CalendlyConfigSettings } from "@/components/admin/CalendlyConfigSettings";

const AVAILABLE_MODULE_KEYS_FOR_SPACES = [
  "overview", "dossiers", "clients-dossiers", "calendrier", "messagerie", "messagerie-groupee", "facturation",
  "relances", "support", "stock", "analyse", "taches", "agenda",
  "rapports", "documents", "temps", "automatisations", "notes", "pipeline", "profil",
  "rendez-vous", "abonnement", "signature",
];

function CustomSpacesManager() {
  const { spaces, createSpace, updateSpace, deleteSpace } = useCustomSpaces();
  const { getModuleLabel, demoSector } = useDemoPlan();
  const [newName, setNewName] = useState("");
  const [newBaseRole, setNewBaseRole] = useState<"employee" | "client">("employee");
  const [newModules, setNewModules] = useState<string[]>(["overview"]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createSpace.mutateAsync({ name: newName.trim(), base_role: newBaseRole, enabled_modules: newModules });
      setNewName("");
      setNewModules(["overview"]);
      toast.success("Espace créé");
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  const toggleModule = (key: string) => {
    setNewModules((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" /> Espaces personnalisés
        </CardTitle>
        <CardDescription>Créez des espaces sur mesure au-delà d'Admin, Salarié et Client.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sector templates */}
        {(() => {
          const templates = SECTOR_SPACE_TEMPLATES[demoSector] || [];
          if (templates.length === 0) return null;
          const sectorLabel = demoSector.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
          return (
            <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Espaces recommandés pour {sectorLabel}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.nom}
                    type="button"
                    className="text-left p-3 rounded-lg border border-border/50 bg-background hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    onClick={() => {
                      setNewName(tpl.nom);
                      setNewBaseRole("employee");
                      setNewModules(tpl.modules.filter((m) => AVAILABLE_MODULE_KEYS_FOR_SPACES.includes(m)));
                      toast.info(`Pré-remplissage : "${tpl.nom}" — modifiez si besoin puis validez.`);
                    }}
                  >
                    <p className="text-sm font-medium">{tpl.nom}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tpl.modules.length} modules · Base salarié</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Create form */}
        <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/30">
          <p className="text-sm font-medium">Nouvel espace</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nom</Label>
              <Input placeholder="Ex: Conseillère" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Rôle de base</Label>
              <Select value={newBaseRole} onValueChange={(v) => setNewBaseRole(v as "employee" | "client")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Salarié</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Modules activés</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_MODULE_KEYS_FOR_SPACES.map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={newModules.includes(key)} onCheckedChange={() => toggleModule(key)} />
                  {getModuleLabel(key)}
                </label>
              ))}
            </div>
          </div>
          <Button onClick={handleCreate} disabled={!newName.trim()} className="gap-1.5">
            <Plus className="h-4 w-4" /> Créer l'espace
          </Button>
        </div>

        <Separator />

        {/* List */}
        {spaces.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun espace personnalisé créé.</p>
        ) : (
          <div className="space-y-3">
            {spaces.map((space) => (
              <div key={space.id} className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex-1 min-w-0">
                  {editingId === space.id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateSpace.mutate({ id: space.id, name: editingName.trim() });
                          setEditingId(null);
                          toast.success("Espace renommé");
                        }
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onBlur={() => {
                        if (editingName.trim() && editingName !== space.name) {
                          updateSpace.mutate({ id: space.id, name: editingName.trim() });
                          toast.success("Espace renommé");
                        }
                        setEditingId(null);
                      }}
                      className="h-7 text-sm"
                      autoFocus
                    />
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{space.name}</p>
                        {space.role_id && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/30 text-amber-600 bg-amber-500/10 gap-1">
                            <Shield className="h-2.5 w-2.5" />
                            Rôle lié
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Base : {space.base_role === "employee" ? (getSectorRoleLabel(demoSector, "employee") || "Salarié") : (getSectorRoleLabel(demoSector, "client") || "Client")} · {space.enabled_modules.length} modules
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {editingId !== space.id && (
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditingId(space.id); setEditingName(space.name); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => { deleteSpace.mutate(space.id); toast.success("Espace supprimé"); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const TAG_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#06b6d4",
];

function TagsManager() {
  const { tags, addTag, updateTag, deleteTag } = useTags();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(TAG_COLORS[0]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await addTag({ nom: newName.trim(), couleur: newColor });
      setNewName("");
      toast.success("Tag créé");
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteTag(id);
      toast.success("Tag supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  };

  const handleStartRename = (tag: any) => {
    setEditingId(tag.id);
    setEditingName(tag.nom);
  };

  const handleRename = async (id: string) => {
    if (!editingName.trim() || editingName.trim() === tags.find((t: any) => t.id === id)?.nom) {
      setEditingId(null);
      return;
    }
    try {
      await updateTag({ id, nom: editingName.trim() });
      toast.success("Tag renommé");
    } catch {
      toast.error("Erreur lors du renommage");
    } finally {
      setEditingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Tag className="h-4 w-4" /> Gestion des tags
        </CardTitle>
        <CardDescription>Créez et gérez les tags que vous pouvez attribuer à vos clients.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-1.5">
            <Label>Nouveau tag</Label>
            <Input
              placeholder="Nom du tag"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Couleur</Label>
            <div className="flex gap-1">
              {TAG_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={`h-9 w-9 rounded-lg border-2 transition-all ${newColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleCreate} disabled={!newName.trim()} className="gap-1.5 h-9">
            <Plus className="h-4 w-4" /> Créer
          </Button>
        </div>

        <Separator />

        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun tag créé pour le moment.</p>
        ) : (
          <div className="space-y-2">
            {tags.map((tag: any) => (
              <div key={tag.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: tag.couleur || "#6366f1" }} />
                  {editingId === tag.id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(tag.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onBlur={() => handleRename(tag.id)}
                      className="h-7 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="text-sm font-medium cursor-pointer hover:text-primary transition-colors truncate"
                      onDoubleClick={() => handleStartRename(tag)}
                      title="Double-cliquer pour renommer"
                    >
                      {tag.nom}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {editingId !== tag.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => handleStartRename(tag)}
                      title="Renommer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(tag.id)}
                    disabled={deleting === tag.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const SERVICE_COLORS = [
  "hsl(265, 85%, 60%)", "hsl(200, 100%, 50%)", "hsl(155, 100%, 45%)",
  "hsl(45, 93%, 55%)", "hsl(330, 80%, 55%)", "hsl(250, 10%, 45%)",
  "hsl(0, 84%, 60%)", "hsl(280, 70%, 55%)", "hsl(170, 80%, 45%)",
  "hsl(30, 90%, 55%)",
];

function ServiceCategoriesManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useServiceCategories();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(SERVICE_COLORS[0]);
  const [newKeywords, setNewKeywords] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editKeywords, setEditKeywords] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const maxOrdre = categories.reduce((m, c) => Math.max(m, c.ordre), -1);
    try {
      await addCategory.mutateAsync({
        nom: newName.trim(),
        couleur: newColor,
        mots_cles: newKeywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean),
        ordre: maxOrdre + 1,
      });
      setNewName("");
      setNewKeywords("");
      toast.success("Catégorie créée");
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  const startEdit = (cat: ServiceCategory) => {
    setEditingId(cat.id);
    setEditName(cat.nom);
    setEditKeywords(cat.mots_cles.join(", "));
    setEditColor(cat.couleur);
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    try {
      await updateCategory.mutateAsync({
        id: editingId,
        nom: editName.trim(),
        couleur: editColor,
        mots_cles: editKeywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean),
      });
      toast.success("Catégorie mise à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Catégorie supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Catégories de services
        </CardTitle>
        <CardDescription>
          Définissez les types de prestations de votre entreprise. Ils seront utilisés dans les graphiques d'analyse.
          Les mots-clés permettent de classer automatiquement vos dossiers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Create form */}
        <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/30">
          <p className="text-sm font-medium">Nouvelle catégorie</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nom</Label>
              <Input placeholder="Ex: Mariage, Formation…" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Mots-clés (séparés par des virgules)</Label>
              <Input placeholder="mariage, wedding, cérémonie" value={newKeywords} onChange={(e) => setNewKeywords(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Couleur</Label>
            <div className="flex gap-1.5 flex-wrap">
              {SERVICE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={`h-8 w-8 rounded-lg border-2 transition-all ${newColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleCreate} disabled={!newName.trim()} className="gap-1.5">
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        </div>

        <Separator />

        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucune catégorie créée.</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/20 border border-border/30">
                {editingId === cat.id ? (
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 text-sm"
                        placeholder="Nom"
                        autoFocus
                      />
                      <Input
                        value={editKeywords}
                        onChange={(e) => setEditKeywords(e.target.value)}
                        className="h-8 text-sm"
                        placeholder="Mots-clés"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {SERVICE_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setEditColor(c)}
                            className={`h-6 w-6 rounded border-2 transition-all ${editColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-1 ml-auto">
                        <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={saveEdit}>
                          <CheckCircle className="h-3.5 w-3.5" /> OK
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => setEditingId(null)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: cat.couleur }} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{cat.nom}</p>
                        {cat.mots_cles.length > 0 && (
                          <p className="text-[11px] text-muted-foreground truncate">
                            Mots-clés : {cat.mots_cles.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(cat)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminSettings() {
  const { user } = useDemoAuth();
  const { enabledModules, clientVisibleModules, employeeVisibleModules, updateSetting } = useAppSettings();
  const { getModuleLabel } = useDemoPlan();
  const { plan, modulesLimit, canCustomizeSpaces, canRenameModules, isEnterprise } = useSubscription();
  const { config: wlConfig, updateConfig: updateWhiteLabel } = useWhiteLabel();
  const { resetOnboarding } = useOnboardingStatus();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [whiteLabel, setWhiteLabel] = useState({
    brandName: "",
    brandShort: "",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "",
    accentColor: "",
    bgColor: "",
    customDomain: "",
    senderName: "",
    senderEmail: "",
    loginTitle: "",
    loginSubtitle: "",
    footerText: "",
    hidePoweredBy: true,
    customCss: "",
    fontFamily: "",
  });
  const [wlInitialized, setWlInitialized] = useState(false);

  // Sync from hook config once loaded
  if (!wlInitialized && wlConfig.brandName) {
    setWhiteLabel({ ...wlConfig });
    setWlInitialized(true);
  }

  const [profile, setProfile] = useState({
    nom: user?.nom || "Admin",
    email: "admin@mba.demo",
    telephone: "01 23 45 67 89",
    newPassword: "",
    confirmPassword: "",
  });

  const [company, setCompany] = useState({
    nom: "",
    siret: "",
    adresse: "",
    codePostal: "",
    ville: "",
    emailContact: "",
    telephone: "",
  });

  // Load business_name from app_settings on mount
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("key, value")
        .in("key", ["business_name"]);
      if (data) {
        const row = (data as any[]).find((r: any) => r.key === "business_name");
        if (row?.value) {
          const name = typeof row.value === "string" ? row.value : String(row.value);
          setCompany((c) => ({ ...c, nom: name }));
        }
      }
    })();
  }, []);

  const [invoiceSettings, setInvoiceSettings] = useState({
    logoUrl: "",
    mentionsLegales: "Conditions de paiement : 30 jours net. En cas de retard, des pénalités de 3 fois le taux d'intérêt légal seront appliquées.",
    iban: "",
    bic: "",
  });

  const [notifs, setNotifs] = useState({
    emailRelance: true,
    emailPaiement: true,
    emailDemande: true,
    emailDevis: true,
    emailValidation: true,
    emailSupport: true,
  });

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      // Persist white label for WL sections
      const wlSections = ["Identité visuelle", "Couleurs", "Domaine", "Emails", "Page de connexion", "CSS personnalisé", "Police"];
      if (wlSections.includes(section)) {
        updateWhiteLabel(whiteLabel);
      }
      // Persist business_name to app_settings when saving Entreprise
      if (section === "Entreprise") {
        const { error } = await (supabase as any)
          .from("app_settings")
          .upsert(
            { key: "business_name", value: JSON.stringify(company.nom), updated_at: new Date().toISOString() },
            { onConflict: "key" }
          );
        if (error) throw error;
      }
      toast.success(`${section} mis à jour avec succès`);
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!profile.newPassword || !profile.confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (profile.newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: profile.newPassword });
    setChangingPassword(false);

    if (error) {
      toast.error("Erreur lors du changement de mot de passe");
      return;
    }

    toast.success("Mot de passe modifié avec succès");
    setProfile((p) => ({ ...p, newPassword: "", confirmPassword: "" }));
  };

  const SETTINGS_NAV = [
    { group: "Général", items: [
      { key: "profil", label: "Profil", icon: User },
      { key: "entreprise", label: "Entreprise", icon: Building2 },
      { key: "facturation", label: "Facturation", icon: Receipt },
      { key: "compte", label: "Compte", icon: RotateCcw },
    ]},
    { group: "Organisation", items: [
      { key: "tags", label: "Tags", icon: Tag },
      { key: "services", label: "Services", icon: BarChart3 },
      { key: "modules", label: "Modules", icon: Puzzle },
      { key: "timeline", label: "Timeline", icon: Clock },
      { key: "roles", label: "Rôles & Droits", icon: Shield },
    ]},
    { group: "Avancé", items: [
      { key: "reservation", label: "Réservation", icon: CalendarDays },
      { key: "whitelabel", label: "White Label", icon: Palette },
      { key: "emails", label: "Emails (Brevo)", icon: Mail },
      { key: "calendly", label: "Calendly", icon: CalendarDays },
      { key: "notifications", label: "Notifications", icon: Bell },
      { key: "suivi-client", label: "Suivi client", icon: Mail },
    ]},
  ];

  const [activeTab, setActiveTab] = useState("profil");

  const renderContent = () => {
    switch (activeTab) {
      case "profil":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" /> Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-nom">Nom complet</Label>
                  <Input id="admin-nom" value={profile.nom} onChange={(e) => setProfile((p) => ({ ...p, nom: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
                  <Input id="admin-email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-tel" className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Téléphone</Label>
                <Input id="admin-tel" value={profile.telephone} onChange={(e) => setProfile((p) => ({ ...p, telephone: e.target.value }))} />
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium flex items-center gap-1.5 mb-3"><Lock className="h-3.5 w-3.5" /> Changer le mot de passe</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-pw">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input id="new-pw" type={showPasswords.new ? "text" : "password"} placeholder="Min. 8 caractères" value={profile.newPassword} onChange={(e) => setProfile((p) => ({ ...p, newPassword: e.target.value }))} className="pr-10" />
                        <button type="button" onClick={() => setShowPasswords(s => ({ ...s, new: !s.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-pw">Confirmer</Label>
                      <div className="relative">
                        <Input id="confirm-pw" type={showPasswords.confirm ? "text" : "password"} placeholder="Répétez le mot de passe" value={profile.confirmPassword} onChange={(e) => setProfile((p) => ({ ...p, confirmPassword: e.target.value }))} className="pr-10" />
                        <button type="button" onClick={() => setShowPasswords(s => ({ ...s, confirm: !s.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleChangePassword} disabled={changingPassword} variant="outline" className="gap-2">
                      <Lock className="h-4 w-4" />
                      {changingPassword ? "Modification..." : "Changer le mot de passe"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => handleSave("Profil")} disabled={saving} className="gap-2">
                  {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "entreprise":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Informations de l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="co-nom">Raison sociale</Label>
                  <Input id="co-nom" value={company.nom} onChange={(e) => setCompany((c) => ({ ...c, nom: e.target.value }))} />
                  <p className="text-xs text-muted-foreground">Ce nom sera utilisé dans les emails d'invitation envoyés à vos clients.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-siret">SIRET</Label>
                  <Input id="co-siret" value={company.siret} onChange={(e) => setCompany((c) => ({ ...c, siret: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="co-adresse" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Adresse</Label>
                <Input id="co-adresse" value={company.adresse} onChange={(e) => setCompany((c) => ({ ...c, adresse: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="co-cp">Code postal</Label>
                  <Input id="co-cp" value={company.codePostal} onChange={(e) => setCompany((c) => ({ ...c, codePostal: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-ville">Ville</Label>
                  <Input id="co-ville" value={company.ville} onChange={(e) => setCompany((c) => ({ ...c, ville: e.target.value }))} />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="co-email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email de contact</Label>
                  <Input id="co-email" type="email" value={company.emailContact} onChange={(e) => setCompany((c) => ({ ...c, emailContact: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-tel" className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Téléphone</Label>
                  <Input id="co-tel" value={company.telephone} onChange={(e) => setCompany((c) => ({ ...c, telephone: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => handleSave("Entreprise")} disabled={saving} className="gap-2">
                  {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "facturation":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4" /> Paramètres de facturation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="inv-logo" className="flex items-center gap-1.5"><Upload className="h-3.5 w-3.5" /> Logo sur les factures</Label>
                <Input id="inv-logo" placeholder="URL du logo" value={invoiceSettings.logoUrl} onChange={(e) => setInvoiceSettings((s) => ({ ...s, logoUrl: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-mentions">Mentions légales</Label>
                <Textarea id="inv-mentions" rows={4} value={invoiceSettings.mentionsLegales} onChange={(e) => setInvoiceSettings((s) => ({ ...s, mentionsLegales: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inv-iban">IBAN</Label>
                  <Input id="inv-iban" value={invoiceSettings.iban} onChange={(e) => setInvoiceSettings((s) => ({ ...s, iban: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inv-bic">BIC</Label>
                  <Input id="inv-bic" value={invoiceSettings.bic} onChange={(e) => setInvoiceSettings((s) => ({ ...s, bic: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => handleSave("Facturation")} disabled={saving} className="gap-2">
                  {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "tags":
        return <TagsManager />;

      case "services":
        return <ServiceCategoriesManager />;

      case "modules":
        return (
          <div className="space-y-6">
            <AdminModulesSection
              plan={plan}
              modulesLimit={modulesLimit}
              enabledModules={enabledModules}
              clientVisibleModules={clientVisibleModules}
              employeeVisibleModules={employeeVisibleModules}
              getModuleLabel={getModuleLabel}
              updateSetting={updateSetting}
              canCustomizeSpaces={canCustomizeSpaces}
            />
            {canCustomizeSpaces && <CustomSpacesManager />}
          </div>
        );

      case "timeline":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Timeline de livraison
                </CardTitle>
                <CardDescription>
                  Personnalisez les étapes de livraison de vos projets — du devis à la clôture du dossier.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimelineTemplateEditor filterCategory="livraison" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Timeline de suivi
                </CardTitle>
                <CardDescription>
                  Personnalisez les étapes de suivi de vos clients — onboarding, accompagnement, renouvellement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimelineTemplateEditor filterCategory="suivi" />
              </CardContent>
            </Card>
          </div>
        );

      case "reservation":
        return <BookingSettingsTab />;

      case "whitelabel":
        return isEnterprise ? (
          <div className="flex gap-6">
            {/* Left: settings cards */}
            <div className="flex-1 min-w-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Image className="h-4 w-4" /> Identité visuelle</CardTitle>
                  <CardDescription>Personnalisez l'apparence de votre plateforme avec votre marque.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wl-brand">Nom de la marque</Label>
                      <Input id="wl-brand" value={whiteLabel.brandName} onChange={(e) => setWhiteLabel((s) => ({ ...s, brandName: e.target.value }))} placeholder="Votre marque" />
                      <p className="text-xs text-muted-foreground">Remplace "My Business Assistant" partout.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wl-short">Abréviation</Label>
                      <Input id="wl-short" value={whiteLabel.brandShort} onChange={(e) => setWhiteLabel((s) => ({ ...s, brandShort: e.target.value }))} placeholder="MBA" maxLength={5} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wl-footer">Texte du footer</Label>
                      <Input id="wl-footer" value={whiteLabel.footerText} onChange={(e) => setWhiteLabel((s) => ({ ...s, footerText: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wl-logo" className="flex items-center gap-1.5"><Upload className="h-3.5 w-3.5" /> URL du logo</Label>
                      <Input id="wl-logo" placeholder="https://example.com/logo.png" value={whiteLabel.logoUrl} onChange={(e) => setWhiteLabel((s) => ({ ...s, logoUrl: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wl-favicon" className="flex items-center gap-1.5"><Image className="h-3.5 w-3.5" /> URL du favicon</Label>
                      <Input id="wl-favicon" placeholder="https://example.com/favicon.ico" value={whiteLabel.faviconUrl} onChange={(e) => setWhiteLabel((s) => ({ ...s, faviconUrl: e.target.value }))} />
                    </div>
                  </div>
                  {whiteLabel.logoUrl && (
                    <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">Aperçu du logo :</p>
                      <img src={whiteLabel.logoUrl} alt="Logo preview" className="h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/20 border border-border/30">
                    <div>
                      <p className="text-sm font-medium">Masquer "Powered by MBA"</p>
                      <p className="text-xs text-muted-foreground">Supprime toute mention MBA de l'interface.</p>
                    </div>
                    <Switch checked={whiteLabel.hidePoweredBy} onCheckedChange={(v) => setWhiteLabel((s) => ({ ...s, hidePoweredBy: v }))} />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => handleSave("Identité visuelle")} disabled={saving} className="gap-2">
                      {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Font picker - Enterprise only */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Type className="h-4 w-4" /> Police d'écriture</CardTitle>
                  <CardDescription>Choisissez la typographie de votre plateforme.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preload all fonts for preview */}
                  {AVAILABLE_FONTS.map((f) => (
                    <link key={f.key} rel="stylesheet" href={f.url} />
                  ))}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {AVAILABLE_FONTS.map((font) => (
                      <button
                        key={font.key}
                        onClick={() => setWhiteLabel((s) => ({ ...s, fontFamily: font.key }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                          whiteLabel.fontFamily === font.key
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border/40 hover:border-border hover:bg-muted/30"
                        }`}
                      >
                        <p className="text-lg font-semibold" style={{ fontFamily: `'${font.key}', sans-serif` }}>
                          {font.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: `'${font.key}', sans-serif` }}>
                          Aa Bb Cc 123
                        </p>
                      </button>
                    ))}
                    {/* Reset option */}
                    <button
                      onClick={() => setWhiteLabel((s) => ({ ...s, fontFamily: "" }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                        !whiteLabel.fontFamily
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/40 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <p className="text-lg font-semibold">Par défaut</p>
                      <p className="text-xs text-muted-foreground mt-1">Police système</p>
                    </button>
                  </div>
                  <div className="flex justify-end pt-2 gap-2">
                    <Button variant="outline" onClick={() => setWhiteLabel((s) => ({ ...s, fontFamily: wlConfig.fontFamily || "" }))} className="gap-2">
                      Annuler
                    </Button>
                    <Button onClick={() => handleSave("Police")} disabled={saving} className="gap-2">
                      {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Palette className="h-4 w-4" /> Couleurs personnalisées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {([
                      { key: "primaryColor" as const, label: "Couleur primaire" },
                      { key: "accentColor" as const, label: "Couleur d'accent" },
                      { key: "bgColor" as const, label: "Fond principal" },
                    ]).map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}</Label>
                        <div className="flex items-center gap-3">
                          <input type="color" value={whiteLabel[key]} onChange={(e) => setWhiteLabel((s) => ({ ...s, [key]: e.target.value }))} className="h-10 w-14 rounded-lg border border-border cursor-pointer" />
                          <Input value={whiteLabel[key]} onChange={(e) => setWhiteLabel((s) => ({ ...s, [key]: e.target.value }))} className="font-mono text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2 gap-2">
                    <Button variant="outline" onClick={() => setWhiteLabel((s) => ({ ...s, primaryColor: wlConfig.primaryColor, accentColor: wlConfig.accentColor, bgColor: wlConfig.bgColor }))} className="gap-2">
                      Annuler
                    </Button>
                    <Button onClick={() => handleSave("Couleurs")} disabled={saving} className="gap-2">
                      {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" /> Domaine personnalisé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="wl-domain">Nom de domaine</Label>
                    <Input id="wl-domain" placeholder="app.monentreprise.com" value={whiteLabel.customDomain} onChange={(e) => setWhiteLabel((s) => ({ ...s, customDomain: e.target.value }))} />
                    <p className="text-xs text-muted-foreground">Configurez un enregistrement CNAME pointant vers notre plateforme.</p>
                  </div>
                  {whiteLabel.customDomain && (
                    <div className="p-4 rounded-lg bg-muted/20 border border-border/30 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Configuration DNS requise :</p>
                      <div className="font-mono text-xs bg-background/50 rounded-md p-3 space-y-1">
                        <p><span className="text-primary">Type:</span> CNAME</p>
                        <p><span className="text-primary">Nom:</span> {whiteLabel.customDomain.split('.')[0]}</p>
                        <p><span className="text-primary">Valeur:</span> app.mba-platform.com</p>
                      </div>
                      <Badge variant="outline" className="text-amber-500 border-amber-500/30">En attente de vérification</Badge>
                    </div>
                  )}
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => handleSave("Domaine")} disabled={saving} className="gap-2">
                      {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" /> Emails personnalisés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wl-sender-name">Nom de l'expéditeur</Label>
                      <Input id="wl-sender-name" value={whiteLabel.senderName} onChange={(e) => setWhiteLabel((s) => ({ ...s, senderName: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wl-sender-email">Email de l'expéditeur</Label>
                      <Input id="wl-sender-email" type="email" value={whiteLabel.senderEmail} onChange={(e) => setWhiteLabel((s) => ({ ...s, senderEmail: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => handleSave("Emails")} disabled={saving} className="gap-2">
                      {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Type className="h-4 w-4" /> Page de connexion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wl-login-title">Titre de la page</Label>
                      <Input id="wl-login-title" value={whiteLabel.loginTitle} onChange={(e) => setWhiteLabel((s) => ({ ...s, loginTitle: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wl-login-sub">Sous-titre</Label>
                      <Input id="wl-login-sub" value={whiteLabel.loginSubtitle} onChange={(e) => setWhiteLabel((s) => ({ ...s, loginSubtitle: e.target.value }))} />
                    </div>
                  </div>
                  <div className="p-6 rounded-xl border border-border/30 text-center space-y-3" style={{ backgroundColor: whiteLabel.bgColor }}>
                    <p className="text-xs text-muted-foreground font-medium mb-4">Aperçu page de connexion</p>
                    {whiteLabel.logoUrl ? (
                      <img src={whiteLabel.logoUrl} alt="Logo" className="h-10 mx-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="h-10 w-10 rounded-lg mx-auto flex items-center justify-center text-sm font-bold" style={{ backgroundColor: whiteLabel.primaryColor, color: "#fff" }}>
                        {whiteLabel.brandName?.charAt(0) || "M"}
                      </div>
                    )}
                    <p className="text-base font-semibold" style={{ color: "#fff" }}>{whiteLabel.loginTitle}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{whiteLabel.loginSubtitle}</p>
                    <div className="max-w-xs mx-auto space-y-2 mt-2">
                      <div className="h-9 rounded-md bg-white/10 border border-white/10" />
                      <div className="h-9 rounded-md bg-white/10 border border-white/10" />
                      <div className="h-9 rounded-md flex items-center justify-center text-xs font-medium" style={{ backgroundColor: whiteLabel.primaryColor, color: "#fff" }}>Se connecter</div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => handleSave("Page de connexion")} disabled={saving} className="gap-2">
                      {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Settings className="h-4 w-4" /> CSS personnalisé (avancé)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea rows={8} placeholder={`:root {\n  --primary: 240 5.9% 50%;\n  --radius: 0.75rem;\n}`} value={whiteLabel.customCss} onChange={(e) => setWhiteLabel((s) => ({ ...s, customCss: e.target.value }))} className="font-mono text-xs" />
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => handleSave("CSS personnalisé")} disabled={saving} className="gap-2">
                      {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                      Appliquer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: live preview panel */}
            <div className="hidden lg:block w-72 shrink-0">
              <WhiteLabelPreview config={whiteLabel as any} />
            </div>
          </div>
        ) : (
          <UpgradeBanner currentPlan={plan} requiredPlan="enterprise" feature="White Label & Personnalisation complète" />
        );

      case "notifications":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Préférences de notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Choisissez les types de notifications email que vous souhaitez recevoir.</p>
              {[
                { key: "emailRelance" as const, label: "Relances de paiement", desc: "Recevoir une notification lors de l'envoi d'une relance" },
                { key: "emailPaiement" as const, label: "Confirmations de paiement", desc: "Être notifié lorsqu'un paiement est reçu" },
                { key: "emailDemande" as const, label: "Nouvelles demandes", desc: "Recevoir une alerte pour chaque nouvelle demande client" },
                { key: "emailDevis" as const, label: "Devis acceptés / refusés", desc: "Être notifié du statut des devis" },
                { key: "emailValidation" as const, label: "Validations", desc: "Notifications de validation de demandes" },
                { key: "emailSupport" as const, label: "Tickets support", desc: "Être alerté des nouveaux tickets et réponses" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={notifs[item.key]} onCheckedChange={(v) => setNotifs((n) => ({ ...n, [item.key]: v }))} />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button onClick={() => handleSave("Notifications")} disabled={saving} className="gap-2">
                  {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "suivi-client":
        return <StepNotificationSettings />;

      case "roles":
        return <RolesPermissionsSettings />;

      case "emails":
        return <BrevoConfigSettings />;

      case "calendly":
        return <CalendlyConfigSettings />;

      case "compte":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <RotateCcw className="h-4 w-4" /> Configuration initiale
              </CardTitle>
              <CardDescription>Relancez le questionnaire d'onboarding pour reconfigurer la structure de votre compte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showResetConfirm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(true)}
                  className="gap-2 text-amber-600 border-amber-300 hover:bg-amber-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Relancer la configuration initiale
                </Button>
              ) : (
                <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/50 space-y-3">
                  <p className="text-sm font-medium text-amber-800">
                    ⚠️ Cette action réinitialisera les rôles et la structure de votre compte.
                  </p>
                  <p className="text-xs text-amber-700">
                    Vos données clients et dossiers ne seront pas affectées. Seuls les rôles et la configuration métier seront recréés.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await resetOnboarding();
                        setShowResetConfirm(false);
                        toast.success("Configuration réinitialisée. L'assistant va se relancer.");
                      }}
                    >
                      Confirmer la réinitialisation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowResetConfirm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Paramètres
            </h1>
            <p className="text-muted-foreground text-sm">Gérez votre profil, votre entreprise et vos notifications</p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Vertical sidebar navigation */}
              <nav className="md:w-56 shrink-0">
                <div className="md:sticky md:top-6 bg-[#F6F5F2] rounded-xl border border-[#e4e8df] p-4 shadow-sm space-y-5">
                  {SETTINGS_NAV.map((group) => (
                    <div key={group.group}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5 px-3">
                        {group.group}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.key;
                          return (
                            <button
                              key={item.key}
                              onClick={() => setActiveTab(item.key)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive
                                  ? "bg-[#f0fdf4] text-[#16a34a]"
                                  : "text-[#6b7280] hover:text-[#1a2318] hover:bg-[#f7f8f5]"
                              }`}
                            >
                              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#16a34a]" : ""}`} />
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </nav>

              {/* Content area */}
              <div className={`flex-1 min-w-0 ${activeTab === "whitelabel" ? "max-w-5xl" : "max-w-3xl"}`}>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
