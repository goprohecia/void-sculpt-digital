import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

/**
 * Returns true if the current session is a demo account (not a real Supabase user).
 * Returns { isDemo, isLoading, supabaseUserId }
 */
export function useIsDemo() {
  const { isAuthenticated: isDemoAuth } = useDemoAuth();
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUserId(session?.user?.id ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUserId(session?.user?.id ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isDemo = isDemoAuth && !supabaseUserId;

  return { isDemo, isLoading: loading, supabaseUserId };
}
