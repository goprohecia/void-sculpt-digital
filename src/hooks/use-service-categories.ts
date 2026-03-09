import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";

export type ServiceCategory = {
  id: string;
  nom: string;
  couleur: string;
  mots_cles: string[];
  ordre: number;
};

const DEFAULT_CATEGORIES: ServiceCategory[] = [
  { id: "1", nom: "Site web", couleur: "hsl(265, 85%, 60%)", mots_cles: ["site web", "vitrine", "application web", "landing"], ordre: 0 },
  { id: "2", nom: "App mobile", couleur: "hsl(200, 100%, 50%)", mots_cles: ["mobile"], ordre: 1 },
  { id: "3", nom: "E-commerce", couleur: "hsl(155, 100%, 45%)", mots_cles: ["commerce"], ordre: 2 },
  { id: "4", nom: "Back-office", couleur: "hsl(45, 93%, 55%)", mots_cles: ["back-office", "backoffice"], ordre: 3 },
  { id: "5", nom: "360", couleur: "hsl(330, 80%, 55%)", mots_cles: ["360"], ordre: 4 },
  { id: "6", nom: "Autres", couleur: "hsl(250, 10%, 45%)", mots_cles: [], ordre: 5 },
];

export function useServiceCategories() {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();

  const { data: categories = DEFAULT_CATEGORIES, isLoading } = useQuery({
    queryKey: ["service-categories"],
    queryFn: async (): Promise<ServiceCategory[]> => {
      if (isDemo) return DEFAULT_CATEGORIES;
      const { data, error } = await (supabase as any)
        .from("service_categories")
        .select("id, nom, couleur, mots_cles, ordre")
        .order("ordre", { ascending: true });
      if (error) throw error;
      return (data && data.length > 0) ? data : DEFAULT_CATEGORIES;
    },
  });

  const addCategory = useMutation({
    mutationFn: async (cat: Omit<ServiceCategory, "id">) => {
      if (isDemo) return;
      const { error } = await (supabase as any)
        .from("service_categories")
        .insert(cat);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-categories"] }),
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceCategory> & { id: string }) => {
      if (isDemo) return;
      const { error } = await (supabase as any)
        .from("service_categories")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-categories"] }),
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return;
      const { error } = await (supabase as any)
        .from("service_categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-categories"] }),
  });

  // Categorize a type_prestation string using keywords
  const categorize = (type: string): string => {
    const t = type.toLowerCase();
    for (const cat of categories) {
      if (cat.mots_cles.length === 0) continue;
      if (cat.mots_cles.some((kw) => t.includes(kw.toLowerCase()))) return cat.nom;
    }
    // Fallback to last category (usually "Autres")
    return categories[categories.length - 1]?.nom || "Autres";
  };

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    categorize,
    DEFAULT_CATEGORIES,
  };
}
