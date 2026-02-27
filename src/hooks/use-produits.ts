import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

export function useProduits() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["produits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produits")
        .select("*, product_categories(nom, couleur), fournisseurs(nom)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const addProduit = useMutation({
    mutationFn: async (p: { reference: string; nom: string; description?: string; categorie_id?: string; fournisseur_id?: string; prix_achat: number; prix_vente: number; quantite_stock: number; seuil_alerte: number; unite?: string; sku?: string }) => {
      const { error } = await supabase.from("produits").insert(p);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produits"] }),
  });

  const updateProduit = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("produits").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produits"] }),
  });

  const deleteProduit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("produits").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produits"] }),
  });

  return {
    produits: isDemo ? [] : (query.data ?? []),
    loading: authLoading || (!isDemo && query.isLoading),
    addProduit: addProduit.mutateAsync,
    updateProduit: updateProduit.mutateAsync,
    deleteProduit: deleteProduit.mutateAsync,
    isPending: addProduit.isPending,
  };
}

export function useCategories() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["product_categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_categories").select("*").order("nom");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const addCategory = useMutation({
    mutationFn: async (c: { nom: string; description?: string; couleur?: string }) => {
      const { error } = await supabase.from("product_categories").insert(c);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product_categories"] }),
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product_categories"] }),
  });

  return {
    categories: isDemo ? [] : (query.data ?? []),
    addCategory: addCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
  };
}

export function useFournisseurs() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["fournisseurs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fournisseurs").select("*").order("nom");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const addFournisseur = useMutation({
    mutationFn: async (f: { nom: string; email?: string; telephone?: string; adresse?: string; ville?: string; pays?: string; notes?: string }) => {
      const { error } = await supabase.from("fournisseurs").insert(f);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fournisseurs"] }),
  });

  const deleteFournisseur = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fournisseurs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fournisseurs"] }),
  });

  return {
    fournisseurs: isDemo ? [] : (query.data ?? []),
    addFournisseur: addFournisseur.mutateAsync,
    deleteFournisseur: deleteFournisseur.mutateAsync,
  };
}

export function useStockMouvements(produitId?: string) {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["stock_mouvements", produitId],
    queryFn: async () => {
      let q = supabase.from("stock_mouvements").select("*").order("created_at", { ascending: false });
      if (produitId) q = q.eq("produit_id", produitId);
      const { data, error } = await q.limit(100);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const addMouvement = useMutation({
    mutationFn: async (m: { produit_id: string; type: string; quantite: number; motif?: string; reference_doc?: string }) => {
      const { error: mvtError } = await supabase.from("stock_mouvements").insert(m);
      if (mvtError) throw mvtError;

      // Update stock quantity
      const { data: produit } = await supabase.from("produits").select("quantite_stock").eq("id", m.produit_id).single();
      if (produit) {
        const delta = m.type === "entree" ? m.quantite : m.type === "sortie" ? -m.quantite : 0;
        await supabase.from("produits").update({ quantite_stock: produit.quantite_stock + delta }).eq("id", m.produit_id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock_mouvements"] });
      queryClient.invalidateQueries({ queryKey: ["produits"] });
    },
  });

  return {
    mouvements: isDemo ? [] : (query.data ?? []),
    addMouvement: addMouvement.mutateAsync,
    isPending: addMouvement.isPending,
  };
}

export function useBonsCommande() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["bons_commande"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bons_commande")
        .select("*, fournisseurs(nom)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const addBonCommande = useMutation({
    mutationFn: async (bc: { reference: string; fournisseur_id: string; montant_total: number; notes?: string; date_livraison_prevue?: string }) => {
      const { error } = await supabase.from("bons_commande").insert(bc);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bons_commande"] }),
  });

  const updateBonStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
      const { error } = await supabase.from("bons_commande").update({ statut }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bons_commande"] }),
  });

  return {
    bonsCommande: isDemo ? [] : (query.data ?? []),
    addBonCommande: addBonCommande.mutateAsync,
    updateBonStatut: updateBonStatut.mutateAsync,
  };
}

export function useTags() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const queryClient = useQueryClient();
  const [demoTags, setDemoTags] = useState<Array<{ id: string; nom: string; couleur: string | null; created_at: string }>>([]);

  const query = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tags").select("*").order("nom");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const addTag = useMutation({
    mutationFn: async (t: { nom: string; couleur?: string }) => {
      if (isDemo) {
        setDemoTags((prev) => [...prev, { id: crypto.randomUUID(), nom: t.nom, couleur: t.couleur || "#6366f1", created_at: new Date().toISOString() }]);
        return;
      }
      const { error } = await supabase.from("tags").insert(t);
      if (error) throw error;
    },
    onSuccess: () => { if (!isDemo) queryClient.invalidateQueries({ queryKey: ["tags"] }); },
  });

  const updateTag = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; nom?: string; couleur?: string }) => {
      if (isDemo) {
        setDemoTags((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t));
        return;
      }
      const { error } = await supabase.from("tags").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { if (!isDemo) queryClient.invalidateQueries({ queryKey: ["tags"] }); },
  });

  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) {
        setDemoTags((prev) => prev.filter((t) => t.id !== id));
        return;
      }
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { if (!isDemo) queryClient.invalidateQueries({ queryKey: ["tags"] }); },
  });

  return {
    tags: isDemo ? demoTags : (query.data ?? []),
    addTag: addTag.mutateAsync,
    updateTag: updateTag.mutateAsync,
    deleteTag: deleteTag.mutateAsync,
  };
}

export function useClientTags(clientId?: string) {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const queryClient = useQueryClient();
  const [demoClientTags, setDemoClientTags] = useState<Array<{ id: string; client_id: string; tag_id: string; tags: any }>>([]);

  const query = useQuery({
    queryKey: ["client_tags", clientId],
    queryFn: async () => {
      let q = supabase.from("client_tags").select("*, tags(*)");
      if (clientId) q = q.eq("client_id", clientId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const addClientTag = useMutation({
    mutationFn: async ({ client_id, tag_id }: { client_id: string; tag_id: string }) => {
      if (isDemo) {
        setDemoClientTags((prev) => [...prev, { id: crypto.randomUUID(), client_id, tag_id, tags: null }]);
        return;
      }
      const { error } = await supabase.from("client_tags").insert({ client_id, tag_id });
      if (error) throw error;
    },
    onSuccess: () => { if (!isDemo) queryClient.invalidateQueries({ queryKey: ["client_tags"] }); },
  });

  const removeClientTag = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) {
        setDemoClientTags((prev) => prev.filter((ct) => ct.id !== id));
        return;
      }
      const { error } = await supabase.from("client_tags").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { if (!isDemo) queryClient.invalidateQueries({ queryKey: ["client_tags"] }); },
  });

  const allTags = isDemo ? demoClientTags : (query.data ?? []);
  const filtered = clientId ? allTags.filter((ct: any) => ct.client_id === clientId) : allTags;

  return {
    clientTags: filtered,
    addClientTag: addClientTag.mutateAsync,
    removeClientTag: removeClientTag.mutateAsync,
  };
}
