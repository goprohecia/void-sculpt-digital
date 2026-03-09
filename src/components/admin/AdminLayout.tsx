import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Sparkles, ArrowUpRight, X } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useNotificationsData } from "@/hooks/use-notifications-data";
import { useSubscription, PLAN_INFO, type SubscriptionPlan } from "@/hooks/use-subscription";
import { AdminSidebar } from "./AdminSidebar";
import { NotificationPanel } from "./NotificationPanel";
import { AdminPageTransition } from "./AdminPageTransition";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated: isDemoAuth } = useDemoAuth();
  const { isDemo, isLoading, supabaseUserId } = useIsDemo();
  const { getNotificationsAdmin, markNotificationRead, markAllNotificationsRead } = useNotificationsData();
  const { plan, updatePlan } = useSubscription();
  const [showBanner, setShowBanner] = useState(true);

  // Reset banner visibility when plan changes
  useEffect(() => {
    setShowBanner(true);
  }, [plan]);

  if (isLoading) return null;

  if (!isDemoAuth && !supabaseUserId) {
    return <Navigate to="/client/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center px-4 gap-4 mx-4 mt-3 rounded-2xl glass-card glass-noise border border-white/10">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex-1" />
            <NotificationPanel
              notifications={getNotificationsAdmin()}
              onMarkRead={markNotificationRead}
              onMarkAllRead={() => markAllNotificationsRead("admin")}
            />
            {isDemo ? (
              <Select value={plan} onValueChange={(v) => updatePlan.mutate(v as SubscriptionPlan)}>
                <SelectTrigger className="w-auto h-8 gap-2 border-0 bg-muted/50 text-xs font-medium px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PLAN_INFO) as [SubscriptionPlan, typeof PLAN_INFO.starter][]).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <span className={`font-semibold ${info.color}`}>{info.label}</span>
                      <span className="text-muted-foreground ml-1.5">{info.price}€/mois</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                Connecté
              </span>
            )}
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {plan !== "enterprise" && showBanner && (
              <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3 relative">
                <button
                  onClick={() => setShowBanner(false)}
                  className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Masquer"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-sm font-medium">
                    Vous êtes en plan <span className={PLAN_INFO[plan].color}>{PLAN_INFO[plan].label}</span> — débloquez {plan === "starter" ? "plus de modules et fonctionnalités" : "tous les modules, l'IA et les espaces personnalisés"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {plan === "starter"
                      ? `Passez en Business (${PLAN_INFO.business.price}€/mois) ou Enterprise (${PLAN_INFO.enterprise.price}€/mois)`
                      : `Passez en Enterprise (${PLAN_INFO.enterprise.price}€/mois) pour un accès illimité`}
                  </p>
                </div>
                <a
                  href="/contact?subject=Upgrade%20abonnement%20MBA"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0"
                >
                  Passer au supérieur
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            )}
            <AdminPageTransition>{children}</AdminPageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
