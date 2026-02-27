import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";

// All available module keys
export const ALL_ADMIN_MODULES = [
  { key: "overview", label: "Vue d'ensemble" },
  { key: "clients", label: "Clients" },
  { key: "employees", label: "Salariés" },
  { key: "dossiers", label: "Dossiers" },
  { key: "messagerie", label: "Messagerie" },
  { key: "facturation", label: "Facturation" },
  { key: "relances", label: "Relances" },
  { key: "emails", label: "Emails" },
  { key: "rendez-vous", label: "Rendez-vous" },
  { key: "support", label: "Support" },
  { key: "stock", label: "Stock / Produits" },
  { key: "analyse", label: "Analyse" },
  { key: "parametres", label: "Paramètres" },
] as const;

export const ALL_CLIENT_MODULES = [
  { key: "overview", label: "Tableau de bord" },
  { key: "dossiers", label: "Dossiers" },
  { key: "demandes", label: "Demandes" },
  { key: "devis", label: "Devis" },
  { key: "factures", label: "Factures" },
  { key: "messagerie", label: "Messagerie" },
  { key: "rendez-vous", label: "Rendez-vous" },
  { key: "support", label: "Support" },
  { key: "profil", label: "Mon profil" },
  { key: "parametres", label: "Paramètres" },
] as const;

export const ALL_EMPLOYEE_MODULES = [
  { key: "overview", label: "Tableau de bord" },
  { key: "dossiers", label: "Dossiers assignés" },
  { key: "calendrier", label: "Calendrier" },
  { key: "messagerie", label: "Messagerie" },
  { key: "stock", label: "Stock" },
  { key: "profil", label: "Mon profil" },
] as const;

const DEFAULT_ADMIN = ALL_ADMIN_MODULES.map((m) => m.key);
const DEFAULT_CLIENT = ALL_CLIENT_MODULES.map((m) => m.key);
const DEFAULT_EMPLOYEE = ALL_EMPLOYEE_MODULES.map((m) => m.key);

export function useAppSettings() {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["app-settings"],
    queryFn: async () => {
      if (isDemo) {
        return {
          enabled_modules: DEFAULT_ADMIN as unknown as string[],
          client_visible_modules: DEFAULT_CLIENT as unknown as string[],
          employee_visible_modules: DEFAULT_EMPLOYEE as unknown as string[],
        };
      }
      const { data, error } = await supabase
        .from("app_settings" as any)
        .select("key, value");
      if (error) throw error;
      const map: Record<string, string[]> = {};
      (data as any[])?.forEach((row: { key: string; value: any }) => {
        map[row.key] = row.value as string[];
      });
      return {
        enabled_modules: (map["enabled_modules"] ?? DEFAULT_ADMIN) as string[],
        client_visible_modules: (map["client_visible_modules"] ?? DEFAULT_CLIENT) as string[],
        employee_visible_modules: (map["employee_visible_modules"] ?? DEFAULT_EMPLOYEE) as string[],
      };
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string[] }) => {
      if (isDemo) return;
      const { error } = await (supabase as any)
        .from("app_settings")
        .update({ value })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-settings"] });
    },
  });

  return {
    enabledModules: settings?.enabled_modules ?? DEFAULT_ADMIN,
    clientVisibleModules: settings?.client_visible_modules ?? DEFAULT_CLIENT,
    employeeVisibleModules: settings?.employee_visible_modules ?? DEFAULT_EMPLOYEE,
    isLoading,
    updateSetting,
  };
}
