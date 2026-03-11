import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Sparkles, ArrowUpRight, X, Search, Bell } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useNotificationsData } from "@/hooks/use-notifications-data";
import { useSubscription, PLAN_INFO, type SubscriptionPlan } from "@/hooks/use-subscription";
import { AdminSidebar } from "./AdminSidebar";
import { NotificationPanel } from "./NotificationPanel";
import { AdminPageTransition } from "./AdminPageTransition";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated: isDemoAuth, user } = useDemoAuth();
  const { isDemo, isLoading, supabaseUserId } = useIsDemo();
  const { getNotificationsAdmin, markNotificationRead, markAllNotificationsRead } = useNotificationsData();
  const { plan, updatePlan } = useSubscription();
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    setShowBanner(true);
  }, [plan]);

  if (isLoading) return null;

  if (!isDemoAuth && !supabaseUserId) {
    return <Navigate to="/client/login" replace />;
  }

  const initials = user?.nom?.charAt(0) || "U";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="h-16 flex items-center px-8 gap-4 bg-card border-b border-border">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-mba-green-50 rounded-lg p-2 transition-colors" />

            {/* Search */}
            <div className="relative w-80 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full h-9 pl-9 pr-4 rounded-[var(--radius-xl)] bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="flex-1" />

            {/* Right side */}
            <NotificationPanel
              notifications={getNotificationsAdmin()}
              onMarkRead={markNotificationRead}
              onMarkAllRead={() => markAllNotificationsRead("admin")}
            />

            {isDemo ? (
              <Select value={plan} onValueChange={(v) => updatePlan.mutate(v as SubscriptionPlan)}>
                <SelectTrigger className="w-auto h-8 gap-2 border border-border bg-mba-green-100 text-xs font-semibold text-mba-green-700 px-3 rounded-[var(--radius-xl)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PLAN_INFO) as [SubscriptionPlan, typeof PLAN_INFO.starter][]).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <span className="font-semibold">{info.label}</span>
                      <span className="text-muted-foreground ml-1.5">{info.price}€/mois</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full bg-mba-green-100 text-mba-green-700 font-medium">
                Connecté
              </span>
            )}

            {/* Separator */}
            <div className="h-6 w-px bg-border" />

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-[13px] font-medium text-foreground leading-tight">{user?.nom || "Admin"}</p>
                <p className="text-[11px] text-muted-foreground capitalize">{user?.role || "admin"}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 overflow-auto">
            {plan !== "enterprise" && showBanner && (
              <div className="mb-4 rounded-[var(--radius-lg)] border border-primary/20 bg-mba-green-50 p-4 flex items-center gap-3 relative">
                <button
                  onClick={() => setShowBanner(false)}
                  className="absolute top-2 right-2 p-1 rounded-md hover:bg-mba-green-100 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Masquer"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-sm font-medium text-foreground">
                    Vous êtes en plan <span className="font-bold text-primary">{PLAN_INFO[plan].label}</span> — débloquez {plan === "starter" ? "plus de modules et fonctionnalités" : "tous les modules, l'IA et les espaces personnalisés"}
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
