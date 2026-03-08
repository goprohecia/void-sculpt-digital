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
}

const DEMO_SPACES: CustomSpace[] = [
  { id: "demo-1", name: "Conseillère", base_role: "employee", enabled_modules: ["overview", "dossiers", "calendrier", "messagerie"], sort_order: 0 },
  { id: "demo-2", name: "Comptabilité", base_role: "employee", enabled_modules: ["overview", "facturation", "relances", "analyse"], sort_order: 1 },
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
      }));
    },
  });

  const createSpace = useMutation({
    mutationFn: async (space: Omit<CustomSpace, "id" | "sort_order">) => {
      if (isDemo) {
        const newSpace: CustomSpace = { ...space, id: `demo-${Date.now()}`, sort_order: demoSpaces.length };
        setDemoSpaces((prev) => [...prev, newSpace]);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("custom_spaces").insert({
        user_id: user.id,
        name: space.name,
        base_role: space.base_role,
        enabled_modules: space.enabled_modules,
        sort_order: spaces.length,
      });
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["custom-spaces"] }),
  });

  const updateSpace = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CustomSpace> & { id: string }) => {
      if (isDemo) {
        setDemoSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
        return;
      }
      const { error } = await supabase.from("custom_spaces").update({
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.base_role !== undefined && { base_role: updates.base_role }),
        ...(updates.enabled_modules !== undefined && { enabled_modules: updates.enabled_modules }),
        ...(updates.sort_order !== undefined && { sort_order: updates.sort_order }),
      }).eq("id", id);
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["custom-spaces"] }),
  });

  const deleteSpace = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) {
        setDemoSpaces((prev) => prev.filter((s) => s.id !== id));
        return;
      }
      const { error } = await supabase.from("custom_spaces").delete().eq("id", id);
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["custom-spaces"] }),
  });

  return { spaces: isDemo ? demoSpaces : spaces, isLoading, createSpace, updateSpace, deleteSpace };
}
