import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

export interface Role {
  id: string;
  nom: string;
  description: string;
  compte_id: string | null;
  date_creation: string;
}

export interface Permission {
  id: string;
  code: string;
  description_lisible: string;
  categorie: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
  valeur: boolean;
}

export interface EmployeRole {
  id: string;
  employe_id: string;
  role_id: string;
  compte_id: string | null;
  date_assignation: string;
}

// ---------- DEMO DATA ----------
const DEMO_PERMISSIONS: Permission[] = [
  { id: "p1", code: "voir_dossiers_equipe", description_lisible: "Voir les dossiers de l'équipe", categorie: "dossiers" },
  { id: "p2", code: "modifier_dossiers_equipe", description_lisible: "Modifier les dossiers de l'équipe", categorie: "dossiers" },
  { id: "p3", code: "assigner_dossiers", description_lisible: "Assigner des dossiers aux employés", categorie: "dossiers" },
  { id: "p4", code: "voir_planning_equipe", description_lisible: "Voir le planning de l'équipe", categorie: "planning" },
  { id: "p5", code: "modifier_planning_equipe", description_lisible: "Modifier le planning de l'équipe", categorie: "planning" },
  { id: "p6", code: "voir_analytique_complete", description_lisible: "Accéder aux analytics complètes", categorie: "analytique" },
  { id: "p7", code: "modifier_roles", description_lisible: "Modifier les rôles et permissions", categorie: "administration" },
  { id: "p8", code: "creer_salaries", description_lisible: "Créer de nouveaux employés", categorie: "administration" },
  { id: "p9", code: "supprimer_salaries", description_lisible: "Supprimer des employés", categorie: "administration" },
  { id: "p10", code: "voir_tous_dossiers", description_lisible: "Voir tous les dossiers du compte", categorie: "dossiers" },
  { id: "p11", code: "acceder_parametres", description_lisible: "Accéder aux paramètres du compte", categorie: "administration" },
];

const DEMO_ROLES: Role[] = [
  { id: "r1", nom: "Employé", description: "Accès basique aux dossiers assignés", compte_id: "demo-compte", date_creation: new Date().toISOString() },
  { id: "r2", nom: "Manager", description: "Gestion d'équipe et dossiers", compte_id: "demo-compte", date_creation: new Date().toISOString() },
  { id: "r3", nom: "Directeur", description: "Accès complet à toutes les fonctionnalités", compte_id: "demo-compte", date_creation: new Date().toISOString() },
];

const DEMO_ROLE_PERMISSIONS: RolePermission[] = [
  // Employé: all false
  ...DEMO_PERMISSIONS.map((p) => ({ role_id: "r1", permission_id: p.id, valeur: false })),
  // Manager: dossiers + planning + analytique
  ...DEMO_PERMISSIONS.map((p) => ({
    role_id: "r2",
    permission_id: p.id,
    valeur: ["voir_dossiers_equipe", "modifier_dossiers_equipe", "assigner_dossiers", "voir_planning_equipe", "modifier_planning_equipe", "voir_analytique_complete"].includes(p.code),
  })),
  // Directeur: all true
  ...DEMO_PERMISSIONS.map((p) => ({ role_id: "r3", permission_id: p.id, valeur: true })),
];

// ---------- HOOK ----------
export function usePermissions() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("roles").select("*").order("date_creation");
      if (error) throw error;
      return data as Role[];
    },
    enabled: !isDemo && !authLoading,
  });

  const permissionsQuery = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("permissions").select("*").order("categorie");
      if (error) throw error;
      return data as Permission[];
    },
    enabled: !isDemo && !authLoading,
  });

  const rolePermissionsQuery = useQuery({
    queryKey: ["role_permissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("role_permissions").select("*");
      if (error) throw error;
      return data as RolePermission[];
    },
    enabled: !isDemo && !authLoading,
  });

  const employeRolesQuery = useQuery({
    queryKey: ["employe_role"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employe_role").select("*");
      if (error) throw error;
      return data as EmployeRole[];
    },
    enabled: !isDemo && !authLoading,
  });

  const roles: Role[] = isDemo ? DEMO_ROLES : (rolesQuery.data ?? []);
  const permissions: Permission[] = isDemo ? DEMO_PERMISSIONS : (permissionsQuery.data ?? []);
  const rolePermissions: RolePermission[] = isDemo ? DEMO_ROLE_PERMISSIONS : (rolePermissionsQuery.data ?? []);
  const employeRoles: EmployeRole[] = isDemo ? [] : (employeRolesQuery.data ?? []);

  const loading = authLoading || (!isDemo && (rolesQuery.isLoading || permissionsQuery.isLoading || rolePermissionsQuery.isLoading));

  // Get permission value for a role
  const getPermissionValue = (roleId: string, permissionId: string): boolean => {
    const rp = rolePermissions.find((r) => r.role_id === roleId && r.permission_id === permissionId);
    return rp?.valeur ?? false;
  };

  // Create a new role
  const createRole = useMutation({
    mutationFn: async ({ nom, description }: { nom: string; description: string }) => {
      if (isDemo) return;
      const { error } = await supabase.from("roles").insert({ nom, description });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });

  // Delete a role
  const deleteRole = useMutation({
    mutationFn: async (roleId: string) => {
      if (isDemo) return;
      const { error } = await supabase.from("roles").delete().eq("id", roleId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
      qc.invalidateQueries({ queryKey: ["role_permissions"] });
    },
  });

  // Save permission matrix for a role (upsert all)
  const saveRolePermissions = useMutation({
    mutationFn: async ({
      roleId,
      permissionValues,
      userId,
    }: {
      roleId: string;
      permissionValues: { permissionId: string; code: string; valeur: boolean }[];
      userId?: string;
    }) => {
      if (isDemo) return;

      // Get current values for audit
      const currentValues = rolePermissions.filter((rp) => rp.role_id === roleId);

      // Upsert all permissions
      const rows = permissionValues.map((pv) => ({
        role_id: roleId,
        permission_id: pv.permissionId,
        valeur: pv.valeur,
      }));

      // Delete existing then insert (simpler than upsert with composite PK)
      await supabase.from("role_permissions").delete().eq("role_id", roleId);
      const { error } = await supabase.from("role_permissions").insert(rows);
      if (error) throw error;

      // Audit trail
      const auditRows = permissionValues
        .filter((pv) => {
          const current = currentValues.find((c) => c.permission_id === pv.permissionId);
          return !current || current.valeur !== pv.valeur;
        })
        .map((pv) => {
          const current = currentValues.find((c) => c.permission_id === pv.permissionId);
          return {
            role_id: roleId,
            user_id: userId,
            permission_code: pv.code,
            ancienne_valeur: current?.valeur ?? null,
            nouvelle_valeur: pv.valeur,
          };
        });

      if (auditRows.length > 0) {
        await supabase.from("audit_permissions").insert(auditRows);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["role_permissions"] }),
  });

  // Assign role to employee
  const assignRoleToEmployee = useMutation({
    mutationFn: async ({ employeId, roleId }: { employeId: string; roleId: string }) => {
      if (isDemo) return;
      const { error } = await supabase.from("employe_role").upsert(
        { employe_id: employeId, role_id: roleId },
        { onConflict: "employe_id,role_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employe_role"] }),
  });

  // Remove role from employee
  const removeRoleFromEmployee = useMutation({
    mutationFn: async ({ employeId, roleId }: { employeId: string; roleId: string }) => {
      if (isDemo) return;
      const { error } = await supabase.from("employe_role").delete().eq("employe_id", employeId).eq("role_id", roleId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employe_role"] }),
  });

  // Check if user has permission (for use in components)
  const hasPermission = async (permissionCode: string): Promise<boolean> => {
    if (isDemo) return true; // In demo mode, admin has all perms
    const { data } = await supabase.rpc("check_permission", {
      _user_id: (await supabase.auth.getUser()).data.user?.id ?? "",
      _permission_code: permissionCode,
    });
    return data === true;
  };

  return {
    roles,
    permissions,
    rolePermissions,
    employeRoles,
    loading,
    getPermissionValue,
    createRole: createRole.mutate,
    deleteRole: deleteRole.mutate,
    saveRolePermissions: saveRolePermissions.mutateAsync,
    assignRoleToEmployee: assignRoleToEmployee.mutate,
    removeRoleFromEmployee: removeRoleFromEmployee.mutate,
    hasPermission,
  };
}
