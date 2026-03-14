import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";

export function useOnboardingStatus() {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();

  const { data: isComplete, isLoading } = useQuery({
    queryKey: ["onboarding-status"],
    queryFn: async () => {
      if (isDemo) return true; // Skip onboarding in demo mode
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "onboarding_complete")
        .maybeSingle();
      if (error) return true; // Default to complete on error
      return data?.value === true;
    },
  });

  const markComplete = () => {
    queryClient.setQueryData(["onboarding-status"], true);
    queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
  };

  const resetOnboarding = async () => {
    if (isDemo) {
      queryClient.setQueryData(["onboarding-status"], false);
      return;
    }
    await (supabase as any)
      .from("app_settings")
      .upsert(
        { key: "onboarding_complete", value: false, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    queryClient.setQueryData(["onboarding-status"], false);
  };

  return {
    isOnboardingComplete: isComplete ?? true,
    isLoading,
    markComplete,
    resetOnboarding,
  };
}
