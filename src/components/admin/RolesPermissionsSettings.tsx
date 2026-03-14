import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Shield, Plus, Trash2, Save, ChevronRight, FolderOpen, CalendarDays, BarChart3, Settings } from "lucide-react";
import { usePermissions, type Role } from "@/hooks/use-permissions";
import { toast } from "sonner";

const CATEGORIE_ICONS: Record<string, typeof FolderOpen> = {
  dossiers: FolderOpen,
  planning: CalendarDays,
  analytique: BarChart3,
  administration: Settings,
};

const CATEGORIE_LABELS: Record<string, string> = {
  dossiers: "Dossiers",
  planning: "Planning",
  analytique: "Analytique",
  administration: "Administration",
};

export function RolesPermissionsSettings() {
  const {
    roles,
    permissions,
    rolePermissions,
    loading,
    getPermissionValue,
    createRole,
    deleteRole,
    saveRolePermissions,
  } = usePermissions();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const { employeRoles } = usePermissions();

  // Count employees per role
  const getEmployeeCount = (roleId: string) => employeRoles.filter((er) => er.role_id === roleId).length;
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [editedPermissions, setEditedPermissions] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  // Group permissions by category
  const categories = [...new Set(permissions.map((p) => p.categorie))];

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    // Load current values
    const vals: Record<string, boolean> = {};
    permissions.forEach((p) => {
      vals[p.id] = getPermissionValue(roleId, p.id);
    });
    setEditedPermissions(vals);
  };

  const handleTogglePermission = (permissionId: string) => {
    setEditedPermissions((prev) => ({ ...prev, [permissionId]: !prev[permissionId] }));
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    setSaving(true);
    try {
      const permissionValues = permissions.map((p) => ({
        permissionId: p.id,
        code: p.code,
        valeur: editedPermissions[p.id] ?? false,
      }));
      await saveRolePermissions({ roleId: selectedRoleId, permissionValues });
      toast.success("Permissions sauvegardées");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
    setSaving(false);
  };

  const handleCreate = () => {
    if (!newRoleName.trim()) return;
    createRole({ nom: newRoleName.trim(), description: newRoleDesc.trim() });
    setNewRoleName("");
    setNewRoleDesc("");
    setShowCreateDialog(false);
    toast.success("Rôle créé");
  };

  const handleDelete = () => {
    if (!deletingRole) return;
    deleteRole(deletingRole.id);
    if (selectedRoleId === deletingRole.id) {
      setSelectedRoleId(null);
    }
    setDeletingRole(null);
    toast.success("Rôle supprimé");
  };

  // Check if permissions changed
  const hasChanges = selectedRoleId
    ? permissions.some((p) => {
        const current = getPermissionValue(selectedRoleId, p.id);
        return (editedPermissions[p.id] ?? false) !== current;
      })
    : false;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Chargement des permissions…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Rôles et permissions
              </CardTitle>
              <CardDescription>
                Gérez les rôles de votre équipe et leurs droits d'accès
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Nouveau rôle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {/* Roles list */}
            <div className="w-56 shrink-0 space-y-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedRoleId === role.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span>{role.nom}</span>
                    <span className="text-[10px] text-muted-foreground">{getEmployeeCount(role.id)} salarié{getEmployeeCount(role.id) > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedRoleId !== role.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingRole(role);
                        }}
                        className="p-1 rounded hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              ))}
              {roles.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Aucun rôle créé
                </p>
              )}
            </div>

            <Separator orientation="vertical" className="h-auto" />

            {/* Permission matrix */}
            <div className="flex-1 min-w-0">
              {selectedRole ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{selectedRole.nom}</h3>
                      <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingRole(selectedRole)}
                        className="gap-1.5 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className="gap-1.5"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {saving ? "Enregistrement…" : "Sauvegarder"}
                      </Button>
                    </div>
                  </div>

                  {categories.map((cat) => {
                    const Icon = CATEGORIE_ICONS[cat] ?? Shield;
                    const catPerms = permissions.filter((p) => p.categorie === cat);
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {CATEGORIE_LABELS[cat] ?? cat}
                          </h4>
                        </div>
                        <div className="space-y-1.5">
                          {catPerms.map((perm) => (
                            <label
                              key={perm.id}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                            >
                              <Checkbox
                                checked={editedPermissions[perm.id] ?? false}
                                onCheckedChange={() => handleTogglePermission(perm.id)}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{perm.description_lisible}</p>
                                <p className="text-[11px] text-muted-foreground font-mono">{perm.code}</p>
                              </div>
                              <Badge
                                variant={editedPermissions[perm.id] ? "default" : "outline"}
                                className={`text-[10px] px-1.5 py-0 ${
                                  editedPermissions[perm.id]
                                    ? "bg-green-500/20 text-green-600 border-green-500/30"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {editedPermissions[perm.id] ? "Activé" : "Désactivé"}
                              </Badge>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
                  Sélectionnez un rôle pour modifier ses permissions
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create role dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Nouveau rôle
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom du rôle</Label>
              <Input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Ex: Manager, Superviseur..."
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                placeholder="Description du rôle..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={!newRoleName.trim()}>
              Créer le rôle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingRole} onOpenChange={(o) => !o && setDeletingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le rôle "{deletingRole?.nom}" ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les employés assignés à ce rôle perdront leurs permissions associées. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
