import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useRef } from "react";

export type SubscriptionPlan = "starter" | "business" | "enterprise";

export interface SubscriptionData {
  plan: SubscriptionPlan;
  status: string;
  modulesLimit: number | null;
  customModules: Record<string, string>; // key -> custom label
}

const PLAN_LIMITS: Record<SubscriptionPlan, number | null> = {
  starter: 3,
  business: 6,
  enterprise: null, // unlimited
};

export function useSubscription() {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const demoOverride = useRef<SubscriptionPlan>("business");

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async (): Promise<SubscriptionData> => {
      if (isDemo) {
        const plan = demoOverride.current;
        return {
          plan,
          status: "active",
          modulesLimit: PLAN_LIMITS[plan],
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
        // Default to starter if no subscription exists
        return {
          plan: "starter",
          status: "active",
          modulesLimit: PLAN_LIMITS.starter,
          customModules: {},
        };
      }

      const plan = (data.plan as SubscriptionPlan) || "starter";
      return {
        plan,
        status: data.status,
        modulesLimit: data.modules_limit ?? PLAN_LIMITS[plan],
        customModules: (data.custom_modules as Record<string, string>) || {},
      };
    },
  });

  const updatePlan = useMutation({
    mutationFn: async (newPlan: SubscriptionPlan) => {
      if (isDemo) {
        demoOverride.current = newPlan;
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
            modules_limit: PLAN_LIMITS[newPlan],
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

  const plan = subscription?.plan ?? "starter";

  return {
    plan,
    status: subscription?.status ?? "active",
    modulesLimit: subscription?.modulesLimit ?? PLAN_LIMITS[plan],
    customModules: subscription?.customModules ?? {},
    isLoading,
    isEnterprise: plan === "enterprise",
    isBusiness: plan === "business",
    isStarter: plan === "starter",
    canCustomizeSpaces: plan === "enterprise",
    canRenameModules: plan === "enterprise",
    canWhiteLabel: plan === "enterprise",
    updatePlan,
    PLAN_LIMITS,
  };
}
