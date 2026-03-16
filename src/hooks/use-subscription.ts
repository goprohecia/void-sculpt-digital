import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useDemoPlan, QUOTA_LIMITS, SOCLE_FIXE, type SubscriptionPlan } from "@/contexts/DemoPlanContext";

export type { SubscriptionPlan };
export { QUOTA_LIMITS, SOCLE_FIXE };

export interface SubscriptionData {
  plan: SubscriptionPlan;
  status: string;
  modulesLimit: number | null;
  customModules: Record<string, string>;
}

export const PLAN_INFO: Record<SubscriptionPlan, { label: string; price: number; color: string }> = {
  starter: { label: "Starter", price: 150, color: "text-muted-foreground" },
  business: { label: "Business", price: 250, color: "text-neon-blue" },
  enterprise: { label: "Enterprise", price: 500, color: "text-amber-400" },
};

export function useSubscription() {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const { demoPlan, setDemoPlan, planModules } = useDemoPlan();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription", isDemo ? demoPlan : "real"],
    queryFn: async (): Promise<SubscriptionData> => {
      if (isDemo) {
        const plan = demoPlan;
        return {
          plan,
          status: "active",
          modulesLimit: QUOTA_LIMITS[plan],
          customModules: {},
        };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return {
          plan: "starter",
          status: "active",
          modulesLimit: QUOTA_LIMITS.starter,
          customModules: {},
        };
      }

      const plan = (data.plan as SubscriptionPlan) || "starter";
      return {
        plan,
        status: data.status,
        modulesLimit: data.modules_limit ?? QUOTA_LIMITS[plan],
        customModules: (data.custom_modules as Record<string, string>) || {},
      };
    },
  });

  const updatePlan = useMutation({
    mutationFn: async (newPlan: SubscriptionPlan) => {
      if (isDemo) {
        setDemoPlan(newPlan);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("subscriptions")
        .upsert(
          {
            user_id: user.id,
            plan: newPlan,
            status: "active",
            modules_limit: QUOTA_LIMITS[newPlan],
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      if (error) throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });

  const plan = subscription?.plan ?? (isDemo ? demoPlan : "starter");

  // Use dynamic planModules from context (editable by SuperAdmin)
  const currentPlanModules = planModules;

  return {
    plan,
    status: subscription?.status ?? "active",
    modulesLimit: subscription?.modulesLimit ?? QUOTA_LIMITS[plan],
    customModules: subscription?.customModules ?? {},
    isLoading,
    isEnterprise: plan === "enterprise",
    isBusiness: plan === "business",
    isStarter: plan === "starter",
    canCustomizeSpaces: plan === "enterprise",
    canRenameModules: plan === "enterprise",
    canWhiteLabel: plan === "enterprise",
    updatePlan,
    QUOTA_LIMITS,
    currentPlanModules,
  };
}
