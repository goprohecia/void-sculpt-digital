import { useState } from "react";
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
import { Settings, User, Building2, Bell, Save, CheckCircle, Mail, Phone, MapPin, Lock, Eye, EyeOff, Puzzle, Receipt, Tag, Plus, Trash2, Pencil, Crown, Sparkles, Palette, Globe, Upload, Type, Image } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAppSettings, ALL_ADMIN_MODULES, ALL_CLIENT_MODULES, ALL_EMPLOYEE_MODULES } from "@/hooks/use-app-settings";
import { useTags } from "@/hooks/use-produits";
import { useSubscription } from "@/hooks/use-subscription";
import { useCustomSpaces } from "@/hooks/use-custom-spaces";
import { UpgradeBanner } from "@/components/admin/UpgradeBanner";
import { useWhiteLabel } from "@/hooks/use-white-label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const AVAILABLE_MODULES_FOR_SPACES = [
  { key: "overview", label: "Vue d'ensemble" },
  { key: "dossiers", label: "Dossiers" },
  { key: "calendrier", label: "Calendrier" },
  { key: "messagerie", label: "Messagerie" },
  { key: "facturation", label: "Facturation" },
  { key: "relances", label: "Relances" },
  { key: "support", label: "Support" },
  { key: "stock", label: "Stock" },
  { key: "analyse", label: "Analyse" },
  { key: "taches", label: "Tâches" },
  { key: "agenda", label: "Agenda" },
  { key: "rapports", label: "Rapports" },
  { key: "documents", label: "Documents" },
  { key: "temps", label: "Suivi du temps" },
  { key: "automatisations", label: "Automatisations" },
  { key: "notes", label: "Notes" },
  { key: "pipeline", label: "Pipeline CRM" },
  { key: "profil", label: "Profil" },
];

function CustomSpacesManager() {
  const { spaces, createSpace, updateSpace, deleteSpace } = useCustomSpaces();
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
              {AVAILABLE_MODULES_FOR_SPACES.map((mod) => (
                <label key={mod.key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={newModules.includes(mod.key)} onCheckedChange={() => toggleModule(mod.key)} />
                  {mod.label}
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
                      <p className="text-sm font-medium">{space.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Base : {space.base_role === "employee" ? "Salarié" : "Client"} · {space.enabled_modules.length} modules
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

export default function AdminSettings() {
  const { user } = useDemoAuth();
  const { enabledModules, clientVisibleModules, employeeVisibleModules, updateSetting } = useAppSettings();
  const { plan, modulesLimit, canCustomizeSpaces, canRenameModules, isEnterprise } = useSubscription();
  const { config: wlConfig, updateConfig: updateWhiteLabel } = useWhiteLabel();
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
    nom: "My Business Assistant",
    siret: "123 456 789 00012",
    adresse: "42 avenue des Champs-Élysées",
    codePostal: "75008",
    ville: "Paris",
    emailContact: "contact@mba.app",
    telephone: "01 23 45 67 89",
  });

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

  const handleSave = (section: string) => {
    setSaving(true);
    // Persist white label for WL sections
    const wlSections = ["Identité visuelle", "Couleurs", "Domaine", "Emails", "Page de connexion", "CSS personnalisé"];
    if (wlSections.includes(section)) {
      updateWhiteLabel(whiteLabel);
    }
    setTimeout(() => {
      setSaving(false);
      toast.success(`${section} mis à jour avec succès`);
    }, 500);
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

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6 max-w-3xl" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Paramètres
            </h1>
            <p className="text-muted-foreground text-sm">Gérez votre profil, votre entreprise et vos notifications</p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Tabs defaultValue="profil" className="space-y-4">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="profil" className="gap-1.5"><User className="h-3.5 w-3.5" /> Profil</TabsTrigger>
                <TabsTrigger value="entreprise" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Entreprise</TabsTrigger>
                <TabsTrigger value="facturation" className="gap-1.5"><Receipt className="h-3.5 w-3.5" /> Facturation</TabsTrigger>
                <TabsTrigger value="tags" className="gap-1.5"><Tag className="h-3.5 w-3.5" /> Tags</TabsTrigger>
                <TabsTrigger value="modules" className="gap-1.5"><Puzzle className="h-3.5 w-3.5" /> Modules</TabsTrigger>
                <TabsTrigger value="whitelabel" className="gap-1.5"><Palette className="h-3.5 w-3.5" /> White Label</TabsTrigger>
                <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
              </TabsList>

              {/* PROFIL TAB */}
              <TabsContent value="profil">
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
              </TabsContent>

              {/* ENTREPRISE TAB */}
              <TabsContent value="entreprise">
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
              </TabsContent>

              {/* FACTURATION TAB */}
              <TabsContent value="facturation">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Receipt className="h-4 w-4" /> Personnalisation des factures / devis
                    </CardTitle>
                    <CardDescription>Ces informations apparaîtront sur les PDF générés.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="inv-logo">URL du logo (optionnel)</Label>
                      <Input id="inv-logo" placeholder="https://example.com/logo.png" value={invoiceSettings.logoUrl} onChange={(e) => setInvoiceSettings((s) => ({ ...s, logoUrl: e.target.value }))} />
                      <p className="text-xs text-muted-foreground">Le logo sera affiché en haut à gauche des factures et devis.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inv-iban">IBAN</Label>
                        <Input id="inv-iban" placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" value={invoiceSettings.iban} onChange={(e) => setInvoiceSettings((s) => ({ ...s, iban: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inv-bic">BIC / SWIFT</Label>
                        <Input id="inv-bic" placeholder="BNPAFRPP" value={invoiceSettings.bic} onChange={(e) => setInvoiceSettings((s) => ({ ...s, bic: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-mentions">Mentions légales</Label>
                      <Textarea id="inv-mentions" rows={4} placeholder="Conditions de paiement, pénalités de retard..." value={invoiceSettings.mentionsLegales} onChange={(e) => setInvoiceSettings((s) => ({ ...s, mentionsLegales: e.target.value }))} />
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button onClick={() => handleSave("Facturation")} disabled={saving} className="gap-2">
                        {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                        Enregistrer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAGS TAB */}
              <TabsContent value="tags">
                <TagsManager />
              </TabsContent>

              {/* MODULES TAB */}
              <TabsContent value="modules">
                <div className="space-y-6">
                  {/* Plan indicator */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Crown className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Plan actuel : <span className="text-primary capitalize">{plan}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {modulesLimit ? `${enabledModules.filter(k => k !== "overview" && k !== "parametres").length}/${modulesLimit} modules activés` : "Modules illimités"}
                            </p>
                          </div>
                        </div>
                        {!isEnterprise && (
                          <Badge variant="outline" className="gap-1.5 text-primary border-primary/30">
                            <Sparkles className="h-3 w-3" />
                            Upgrade disponible
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Admin modules */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Puzzle className="h-4 w-4" /> Modules admin actifs
                      </CardTitle>
                      <CardDescription>
                        Choisissez les modules visibles dans votre navigation admin.
                        {modulesLimit && (
                          <span className="ml-1 font-medium text-primary">
                            ({enabledModules.filter(k => k !== "overview" && k !== "parametres").length}/{modulesLimit} utilisés)
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {ALL_ADMIN_MODULES.map((mod) => {
                        const isAlwaysOn = mod.key === "overview" || mod.key === "parametres";
                        const isOn = enabledModules.includes(mod.key);
                        const activeCount = enabledModules.filter(k => k !== "overview" && k !== "parametres").length;
                        const atLimit = modulesLimit !== null && activeCount >= modulesLimit && !isOn && !isAlwaysOn;

                        return (
                          <div key={mod.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium ${atLimit ? "text-muted-foreground" : ""}`}>{mod.label}</p>
                              {atLimit && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30">
                                  Upgrade
                                </Badge>
                              )}
                            </div>
                            <Switch
                              checked={isOn}
                              disabled={isAlwaysOn || atLimit}
                              onCheckedChange={(v) => {
                                const next = v
                                  ? [...enabledModules, mod.key]
                                  : enabledModules.filter((k) => k !== mod.key);
                                updateSetting.mutate({ key: "enabled_modules", value: next });
                                toast.success(`Module "${mod.label}" ${v ? "activé" : "désactivé"}`);
                              }}
                            />
                          </div>
                        );
                      })}

                      {modulesLimit !== null && enabledModules.filter(k => k !== "overview" && k !== "parametres").length >= modulesLimit && (
                        <UpgradeBanner
                          currentPlan={plan}
                          requiredPlan={plan === "starter" ? "business" : "enterprise"}
                          feature="Plus de modules"
                          className="mt-4"
                        />
                      )}
                    </CardContent>
                  </Card>

                  {/* Client visible modules */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Modules visibles côté client</CardTitle>
                      <CardDescription>Configurez les onglets accessibles dans l'espace client. Seuls les modules activés côté admin sont proposés.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {ALL_CLIENT_MODULES.map((mod) => {
                        const isOn = clientVisibleModules.includes(mod.key);
                        const adminHasIt = enabledModules.includes(mod.key) || mod.key === "overview" || mod.key === "profil" || mod.key === "parametres" || mod.key === "demandes" || mod.key === "devis" || mod.key === "factures";
                        return (
                          <div key={mod.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium ${!adminHasIt ? "text-muted-foreground" : ""}`}>{mod.label}</p>
                              {!adminHasIt && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30">
                                  Désactivé côté admin
                                </Badge>
                              )}
                            </div>
                            <Switch
                              checked={isOn}
                              disabled={!adminHasIt}
                              onCheckedChange={(v) => {
                                const next = v
                                  ? [...clientVisibleModules, mod.key]
                                  : clientVisibleModules.filter((k) => k !== mod.key);
                                updateSetting.mutate({ key: "client_visible_modules", value: next });
                              }}
                            />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Employee visible modules */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Modules visibles côté salarié</CardTitle>
                      <CardDescription>Configurez les onglets accessibles dans l'espace salarié. Seuls les modules activés côté admin sont proposés.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {ALL_EMPLOYEE_MODULES.map((mod) => {
                        const isOn = employeeVisibleModules.includes(mod.key);
                        // Map employee module keys to admin equivalents
                        const adminKeyMap: Record<string, string> = { calendrier: "rendez-vous" };
                        const adminKey = adminKeyMap[mod.key] || mod.key;
                        const adminHasIt = enabledModules.includes(adminKey) || mod.key === "overview" || mod.key === "profil";
                        return (
                          <div key={mod.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium ${!adminHasIt ? "text-muted-foreground" : ""}`}>{mod.label}</p>
                              {!adminHasIt && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30">
                                  Désactivé côté admin
                                </Badge>
                              )}
                            </div>
                            <Switch
                              checked={isOn}
                              disabled={!adminHasIt}
                              onCheckedChange={(v) => {
                                const next = v
                                  ? [...employeeVisibleModules, mod.key]
                                  : employeeVisibleModules.filter((k) => k !== mod.key);
                                updateSetting.mutate({ key: "employee_visible_modules", value: next });
                              }}
                            />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Custom Spaces - Enterprise only */}
                  {canCustomizeSpaces ? (
                    <CustomSpacesManager />
                  ) : (
                    <UpgradeBanner
                      currentPlan={plan}
                      requiredPlan="enterprise"
                      feature="Espaces personnalisés & renommage de modules"
                    />
                  )}
                </div>
              </TabsContent>

              {/* WHITE LABEL TAB */}
              <TabsContent value="whitelabel">
                {isEnterprise ? (
                  <div className="space-y-6">
                    {/* Branding */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Image className="h-4 w-4" /> Identité visuelle
                        </CardTitle>
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
                            <p className="text-xs text-muted-foreground">Affichée dans les sidebars (3-5 car.).</p>
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
                            <p className="text-xs text-muted-foreground">Logo affiché dans le header et la page de connexion.</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="wl-favicon" className="flex items-center gap-1.5"><Image className="h-3.5 w-3.5" /> URL du favicon</Label>
                            <Input id="wl-favicon" placeholder="https://example.com/favicon.ico" value={whiteLabel.faviconUrl} onChange={(e) => setWhiteLabel((s) => ({ ...s, faviconUrl: e.target.value }))} />
                          </div>
                        </div>

                        {/* Preview */}
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

                    {/* Colors */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Palette className="h-4 w-4" /> Couleurs personnalisées
                        </CardTitle>
                        <CardDescription>Définissez la palette de couleurs de votre plateforme.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Couleur primaire</Label>
                            <div className="flex items-center gap-3">
                              <input type="color" value={whiteLabel.primaryColor} onChange={(e) => setWhiteLabel((s) => ({ ...s, primaryColor: e.target.value }))} className="h-10 w-14 rounded-lg border border-border cursor-pointer" />
                              <Input value={whiteLabel.primaryColor} onChange={(e) => setWhiteLabel((s) => ({ ...s, primaryColor: e.target.value }))} className="font-mono text-sm" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Couleur d'accent</Label>
                            <div className="flex items-center gap-3">
                              <input type="color" value={whiteLabel.accentColor} onChange={(e) => setWhiteLabel((s) => ({ ...s, accentColor: e.target.value }))} className="h-10 w-14 rounded-lg border border-border cursor-pointer" />
                              <Input value={whiteLabel.accentColor} onChange={(e) => setWhiteLabel((s) => ({ ...s, accentColor: e.target.value }))} className="font-mono text-sm" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Fond principal</Label>
                            <div className="flex items-center gap-3">
                              <input type="color" value={whiteLabel.bgColor} onChange={(e) => setWhiteLabel((s) => ({ ...s, bgColor: e.target.value }))} className="h-10 w-14 rounded-lg border border-border cursor-pointer" />
                              <Input value={whiteLabel.bgColor} onChange={(e) => setWhiteLabel((s) => ({ ...s, bgColor: e.target.value }))} className="font-mono text-sm" />
                            </div>
                          </div>
                        </div>

                        {/* Color preview */}
                        <div className="p-4 rounded-xl border border-border/30 space-y-3">
                          <p className="text-xs text-muted-foreground font-medium">Aperçu</p>
                          <div className="flex gap-3 items-center">
                            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: whiteLabel.primaryColor }} />
                            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: whiteLabel.accentColor }} />
                            <div className="h-12 w-12 rounded-lg border border-border" style={{ backgroundColor: whiteLabel.bgColor }} />
                            <div className="flex-1 h-12 rounded-lg flex items-center px-4 text-sm font-medium" style={{ backgroundColor: whiteLabel.primaryColor, color: "#fff" }}>
                              {whiteLabel.brandName || "Bouton primaire"}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button onClick={() => handleSave("Couleurs")} disabled={saving} className="gap-2">
                            {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                            Enregistrer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Custom domain */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Globe className="h-4 w-4" /> Domaine personnalisé
                        </CardTitle>
                        <CardDescription>Utilisez votre propre nom de domaine pour accéder à la plateforme.</CardDescription>
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

                    {/* Email customization */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Emails personnalisés
                        </CardTitle>
                        <CardDescription>Personnalisez l'expéditeur et l'apparence des emails envoyés par la plateforme.</CardDescription>
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
                            <p className="text-xs text-muted-foreground">Nécessite la vérification du domaine.</p>
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

                    {/* Login page */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Type className="h-4 w-4" /> Page de connexion
                        </CardTitle>
                        <CardDescription>Personnalisez les textes affichés sur la page de connexion de vos clients et salariés.</CardDescription>
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

                        {/* Login preview */}
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
                            <div className="h-9 rounded-md flex items-center justify-center text-xs font-medium" style={{ backgroundColor: whiteLabel.primaryColor, color: "#fff" }}>
                              Se connecter
                            </div>
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

                    {/* Custom CSS */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Settings className="h-4 w-4" /> CSS personnalisé (avancé)
                        </CardTitle>
                        <CardDescription>Injectez du CSS personnalisé pour un contrôle total sur l'apparence.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          rows={8}
                          placeholder={`:root {\n  --primary: 240 5.9% 50%;\n  --radius: 0.75rem;\n}`}
                          value={whiteLabel.customCss}
                          onChange={(e) => setWhiteLabel((s) => ({ ...s, customCss: e.target.value }))}
                          className="font-mono text-xs"
                        />
                        <div className="flex justify-end pt-2">
                          <Button onClick={() => handleSave("CSS personnalisé")} disabled={saving} className="gap-2">
                            {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                            Appliquer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <UpgradeBanner
                    currentPlan={plan}
                    requiredPlan="enterprise"
                    feature="White Label & Personnalisation complète"
                  />
                )}
              </TabsContent>

              {/* NOTIFICATIONS TAB */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4" /> Préférences de notifications
                    </CardTitle>
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
                        <Switch
                          checked={notifs[item.key]}
                          onCheckedChange={(v) => setNotifs((n) => ({ ...n, [item.key]: v }))}
                        />
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
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
