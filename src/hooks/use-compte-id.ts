import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

/**
 * Resolves the current user's tenant ID (compte_id).
 * - Admin → their own auth.uid()
 * - Employee → their admin's compte_id (from employees table)
 * - Client → their admin's compte_id (from clients table)
 * - Fallback → auth.uid()
 *
 * In demo mode, returns a static "demo-compte" string.
 */
export function useCompteId() {
  const { isDemo, isLoading: authLoading, supabaseUserId } = useIsDemo();
  const [compteId, setCompteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setCompteId("demo-compte");
      setLoading(false);
      return;
    }

    if (authLoading) return;

    if (!supabaseUserId) {
      setCompteId(null);
      setLoading(false);
      return;
    }

    const resolve = async () => {
      try {
        // Check if admin
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: supabaseUserId,
          _role: "admin",
        });
        if (isAdmin) {
          setCompteId(supabaseUserId);
          setLoading(false);
          return;
        }

        // Check employee
        const { data: emp } = await supabase
          .from("employees")
          .select("compte_id")
          .eq("user_id", supabaseUserId)
          .maybeSingle();
        if ((emp as any)?.compte_id) {
          setCompteId((emp as any).compte_id);
          setLoading(false);
          return;
        }

        // Check client
        const { data: client } = await supabase
          .from("clients")
          .select("compte_id")
          .eq("user_id", supabaseUserId)
          .maybeSingle();
        if ((client as any)?.compte_id) {
          setCompteId((client as any).compte_id);
          setLoading(false);
          return;
        }

        // Fallback
        setCompteId(supabaseUserId);
      } catch {
        setCompteId(supabaseUserId);
      }
      setLoading(false);
    };

    resolve();
  }, [isDemo, authLoading, supabaseUserId]);

  return { compteId, loading };
}
