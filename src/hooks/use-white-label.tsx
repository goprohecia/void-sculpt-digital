import { createContext, useContext, useEffect, useMemo, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useRef } from "react";

export interface WhiteLabelConfig {
  brandName: string;
  brandShort: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  customDomain: string;
  senderName: string;
  senderEmail: string;
  loginTitle: string;
  loginSubtitle: string;
  footerText: string;
  hidePoweredBy: boolean;
  customCss: string;
}

const DEFAULT_CONFIG: WhiteLabelConfig = {
  brandName: "My Business Assistant",
  brandShort: "MBA",
  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#6366f1",
  accentColor: "#8b5cf6",
  bgColor: "#0a0a0f",
  customDomain: "",
  senderName: "My Business Assistant",
  senderEmail: "noreply@mondomaine.com",
  loginTitle: "Bienvenue sur votre espace",
  loginSubtitle: "Connectez-vous pour accéder à votre tableau de bord",
  footerText: "© 2026 My Business Assistant. Tous droits réservés.",
  hidePoweredBy: true,
  customCss: "",
};

const WhiteLabelContext = createContext<{
  config: WhiteLabelConfig;
  updateConfig: (partial: Partial<WhiteLabelConfig>) => void;
  isLoading: boolean;
}>({
  config: DEFAULT_CONFIG,
  updateConfig: () => {},
  isLoading: false,
});

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 0%";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function WhiteLabelProvider({ children }: { children: ReactNode }) {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const demoOverride = useRef<Partial<WhiteLabelConfig>>({});

  const { data: config, isLoading } = useQuery({
    queryKey: ["white-label"],
    queryFn: async (): Promise<WhiteLabelConfig> => {
      if (isDemo) {
        return { ...DEFAULT_CONFIG, ...demoOverride.current };
      }
      const { data, error } = await supabase
        .from("app_settings" as any)
        .select("key, value")
        .eq("key", "white_label")
        .maybeSingle();
      if (error || !data) return DEFAULT_CONFIG;
      return { ...DEFAULT_CONFIG, ...((data as any).value as Partial<WhiteLabelConfig>) };
    },
  });

  const mutation = useMutation({
    mutationFn: async (partial: Partial<WhiteLabelConfig>) => {
      const merged = { ...(config || DEFAULT_CONFIG), ...partial };
      if (isDemo) {
        demoOverride.current = merged;
        return;
      }
      const { error } = await (supabase as any)
        .from("app_settings")
        .upsert({ key: "white_label", value: merged, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
    },
    onMutate: async (partial) => {
      await queryClient.cancelQueries({ queryKey: ["white-label"] });
      const prev = queryClient.getQueryData(["white-label"]);
      queryClient.setQueryData(["white-label"], (old: any) => ({ ...(old || DEFAULT_CONFIG), ...partial }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["white-label"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["white-label"] }),
  });

  const resolved = config || DEFAULT_CONFIG;

  // Inject CSS custom properties dynamically
  useEffect(() => {
    const root = document.documentElement;
    if (resolved.primaryColor && resolved.primaryColor !== DEFAULT_CONFIG.primaryColor) {
      root.style.setProperty("--primary", hexToHsl(resolved.primaryColor));
      root.style.setProperty("--primary-foreground", "0 0% 100%");
    } else {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
    }
    if (resolved.accentColor && resolved.accentColor !== DEFAULT_CONFIG.accentColor) {
      root.style.setProperty("--accent", hexToHsl(resolved.accentColor));
    } else {
      root.style.removeProperty("--accent");
    }
    if (resolved.bgColor && resolved.bgColor !== DEFAULT_CONFIG.bgColor) {
      root.style.setProperty("--background", hexToHsl(resolved.bgColor));
    } else {
      root.style.removeProperty("--background");
    }

    // Custom CSS injection
    let styleEl = document.getElementById("wl-custom-css");
    if (resolved.customCss) {
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "wl-custom-css";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = resolved.customCss;
    } else if (styleEl) {
      styleEl.remove();
    }

    // Favicon
    if (resolved.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) link.href = resolved.faviconUrl;
    }

    return () => {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--background");
      const el = document.getElementById("wl-custom-css");
      if (el) el.remove();
    };
  }, [resolved.primaryColor, resolved.accentColor, resolved.bgColor, resolved.customCss, resolved.faviconUrl]);

  const value = useMemo(() => ({
    config: resolved,
    updateConfig: (partial: Partial<WhiteLabelConfig>) => mutation.mutate(partial),
    isLoading,
  }), [resolved, isLoading, mutation]);

  return (
    <WhiteLabelContext.Provider value={value}>
      {children}
    </WhiteLabelContext.Provider>
  );
}

export function useWhiteLabel() {
  return useContext(WhiteLabelContext);
}
