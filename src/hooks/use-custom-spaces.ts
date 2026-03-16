import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useState } from "react";

export interface CustomSpace {
  id: string;
  name: string;
  base_role: "employee" | "client";
  enabled_modules: string[];
  sort_order: number;
  role_id: string | null;
}

export interface SpaceTemplate {
  nom: string;
  modules: string[];
}

export const SECTOR_SPACE_TEMPLATES: Record<string, SpaceTemplate[]> = {
  mariage: [
    { nom: "Conseillère", modules: ["clients-dossiers", "rendez-vous", "messagerie", "agenda"] },
    { nom: "Retoucheuse", modules: ["clients-dossiers", "notes", "agenda"] },
    { nom: "Comptabilité", modules: ["facturation", "relances", "rapports"] },
  ],
  btp: [
    { nom: "Chef de chantier", modules: ["clients-dossiers", "agenda", "stock", "notes"] },
  ],
  conciergerie: [
    { nom: "Agent d'entretien", modules: ["clients-dossiers", "agenda", "taches"] },
  ],
  "centre-islamique": [
    { nom: "Professeur", modules: ["clients-dossiers", "agenda", "messagerie-groupee"] },
  ],
  "association-sportive": [
    { nom: "Entraîneur", modules: ["clients-dossiers", "agenda", "messagerie-groupee"] },
  ],
};

const DEMO_SPACES: CustomSpace[] = [
  { id: "demo-1", name: "Conseillère", base_role: "employee", enabled_modules: ["overview", "dossiers", "calendrier", "messagerie"], sort_order: 0, role_id: "r-demo-1" },
  { id: "demo-2", name: "Comptabilité", base_role: "employee", enabled_modules: ["overview", "facturation", "relances", "analyse"], sort_order: 1, role_id: "r-demo-2" },
];

export function useCustomSpaces() {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const [demoSpaces, setDemoSpaces] = useState<CustomSpace[]>(DEMO_SPACES);

  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ["custom-spaces"],
    queryFn: async (): Promise<CustomSpace[]> => {
      if (isDemo) return demoSpaces;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("custom_spaces")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order");

      if (error) throw error;
      return (data || []).map((s) => ({
        id: s.id,
        name: s.name,
        base_role: s.base_role as "employee" | "client",
        enabled_modules: (s.enabled_modules as string[]) || [],
        sort_order: s.sort_order,
        role_id: (s as any).role_id ?? null,
      }));
    },
  });

  const createSpace = useMutation({
    mutationFn: async (space: Omit<CustomSpace, "id" | "sort_order" | "role_id">) => {
      if (isDemo) {
        const roleId = `r-demo-${Date.now()}`;
        const newSpace: CustomSpace = { ...space, id: `demo-${Date.now()}`, sort_order: demoSpaces.length, role_id: roleId };
        setDemoSpaces((prev) => [...prev, newSpace]);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Create associated role
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .insert({ nom: space.name, description: `Rôle lié à l'espace "${space.name}"` })
        .select("id")
        .single();
      if (roleError) throw roleError;

      // 2. Create space with role_id
      const { error } = await supabase.from("custom_spaces").insert({
        user_id: user.id,
        name: space.name,
        base_role: space.base_role,
        enabled_modules: space.enabled_modules,
        sort_order: spaces.length,
        role_id: roleData.id,
      } as any);
      if (error) throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const updateSpace = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CustomSpace> & { id: string }) => {
      if (isDemo) {
        setDemoSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
        return;
      }
      const updateObj: any = {};
      if (updates.name !== undefined) updateObj.name = updates.name;
      if (updates.base_role !== undefined) updateObj.base_role = updates.base_role;
      if (updates.enabled_modules !== undefined) updateObj.enabled_modules = updates.enabled_modules;
      if (updates.sort_order !== undefined) updateObj.sort_order = updates.sort_order;

      const { error } = await supabase.from("custom_spaces").update(updateObj).eq("id", id);
      if (error) throw error;

      // Also update role name if name changed
      if (updates.name !== undefined) {
        const space = spaces.find((s) => s.id === id);
        if (space?.role_id) {
          await supabase.from("roles").update({ nom: updates.name }).eq("id", space.role_id);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const deleteSpace = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) {
        setDemoSpaces((prev) => prev.filter((s) => s.id !== id));
        return;
      }
      // Find space to get role_id before deleting
      const space = spaces.find((s) => s.id === id);

      const { error } = await supabase.from("custom_spaces").delete().eq("id", id);
      if (error) throw error;

      // Delete associated role
      if (space?.role_id) {
        await supabase.from("roles").delete().eq("id", space.role_id);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return { spaces: isDemo ? demoSpaces : spaces, isLoading, createSpace, updateSpace, deleteSpace };
}
