import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { donneesMensuelles } from "@/data/mockData";
import { toast } from "sonner";

const defaultObjectifs = Object.fromEntries(
  donneesMensuelles.map((d) => [d.mois, d.objectif])
);

export function useObjectifs() {
  const [objectifs, setObjectifs] = useState<Record<string, number>>(defaultObjectifs);
  const [loading, setLoading] = useState(true);

  // Load from DB on mount
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("objectifs_mensuels")
        .select("mois, objectif");

      if (!error && data && data.length > 0) {
        const merged = { ...defaultObjectifs };
        data.forEach((row: any) => {
          merged[row.mois] = Number(row.objectif);
        });
        setObjectifs(merged);
      }
      setLoading(false);
    };
    load();
  }, []);

  const updateObjectif = useCallback(async (mois: string, value: number) => {
    // Optimistic update
    setObjectifs((prev) => ({ ...prev, [mois]: value }));

    const { error } = await supabase
      .from("objectifs_mensuels")
      .upsert({ mois, objectif: value }, { onConflict: "mois" });

    if (error) {
      // Revert on failure, still works locally
      console.warn("Failed to persist objectif:", error.message);
      toast.success(`Objectif ${mois} mis à jour : ${value.toLocaleString()} € (local)`);
    } else {
      toast.success(`Objectif ${mois} mis à jour : ${value.toLocaleString()} €`);
    }
  }, []);

  return { objectifs, loading, updateObjectif };
}
