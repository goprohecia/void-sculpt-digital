import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Sparkles, ArrowUpRight, X, Search } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useNotificationsData } from "@/hooks/use-notifications-data";
import { useSubscription, PLAN_INFO, type SubscriptionPlan } from "@/hooks/use-subscription";
import { AdminSidebar } from "./AdminSidebar";
import { NotificationPanel } from "./NotificationPanel";
import { AdminPageTransition } from "./AdminPageTransition";
import { MobileBottomNav } from "./MobileBottomNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AnnouncementPopup } from "@/components/messaging/AnnouncementPopup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { useOnboardingStatus } from "@/hooks/use-onboarding";
import logoMba from "@/assets/logo-mba.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated: isDemoAuth, user } = useDemoAuth();
  const { isDemo, isLoading, supabaseUserId } = useIsDemo();
  const { getNotificationsAdmin, markNotificationRead, markAllNotificationsRead } = useNotificationsData();
  const { plan, updatePlan } = useSubscription();
  const { isOnboardingComplete, isLoading: onboardingLoading, markComplete } = useOnboardingStatus();
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
    <>
      {!isOnboardingComplete && !onboardingLoading && (
        <OnboardingWizard onComplete={markComplete} />
      )}
    <SidebarProvider>
      <div className="mba-app min-h-screen flex w-full" style={{ background: "hsl(150, 60%, 10%)" }}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header — responsive */}
          <header className="h-14 md:h-16 flex items-center px-3 md:px-8 gap-2 md:gap-4 bg-[#F6F5F2] border-b border-[#e4e8df] shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
            <SidebarTrigger className="text-[#9ca3af] hover:text-[#1a2318] hover:bg-[#f0fdf4] rounded-[var(--radius-sm)] p-2 transition-colors" />

            {/* Logo mobile centré */}
            <img src={logoMba} alt="MBA" className="h-7 md:hidden" />

            {/* Search desktop */}
            <div className="relative w-[300px] hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full h-9 pl-9 pr-4 rounded-[var(--radius-full,9999px)] bg-[#f7f8f5] border border-[#e4e8df] text-sm text-[#1a2318] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#22c55e] focus:ring-[3px] focus:ring-[rgba(34,197,94,0.15)] transition-all"
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
                <SelectTrigger className="w-auto h-8 gap-2 border border-[#bbf7d0] bg-[#dcfce7] text-xs font-semibold text-[#15803d] px-3 rounded-[var(--radius-full,9999px)] font-mono hidden md:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PLAN_INFO) as [SubscriptionPlan, typeof PLAN_INFO.starter][]).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <span className="font-semibold">{info.label}</span>
                      <span className="text-[#9ca3af] ml-1.5">{info.price}€/mois</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] font-medium hidden md:inline">
                Connecté
              </span>
            )}

            <div className="h-6 w-px bg-[#e4e8df] hidden md:block" />

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#22c55e] flex items-center justify-center text-sm font-extrabold text-[#14532d]">
                {initials}
              </div>
              <div className="hidden md:block">
                <p className="text-[13px] font-semibold text-[#1a2318] leading-tight">{user?.nom || "Admin"}</p>
                <p className="text-[11px] text-[#9ca3af] capitalize">{user?.role || "admin"}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-7 overflow-auto pb-20 md:pb-7">
            {plan !== "enterprise" && showBanner && (
              <div className="mb-4 rounded-[var(--radius-lg)] border-[1.5px] border-[#bbf7d0] bg-[#F6F5F2] p-4 flex items-center gap-3 relative shadow-[var(--shadow-card)]">
                <button
                  onClick={() => setShowBanner(false)}
                  className="absolute top-2 right-2 p-1 rounded-md hover:bg-[#f0fdf4] text-[#9ca3af] hover:text-[#1a2318] transition-colors"
                  aria-label="Masquer"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="h-10 w-10 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-[#22c55e]" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-sm font-semibold text-[#1a2318]">
                    Vous êtes en plan <span className="font-bold text-[#22c55e]">{PLAN_INFO[plan].label}</span> — débloquez {plan === "starter" ? "plus de modules et fonctionnalités" : "tous les modules, l'IA et les espaces personnalisés"}
                  </p>
                  <p className="text-[13px] text-[#4a5e46] mt-0.5 hidden md:block">
                    {plan === "starter"
                      ? `Passez en Business (${PLAN_INFO.business.price}€/mois) ou Enterprise (${PLAN_INFO.enterprise.price}€/mois)`
                      : `Passez en Enterprise (${PLAN_INFO.enterprise.price}€/mois) pour un accès illimité`}
                  </p>
                </div>
                <a
                  href="/contact?subject=Upgrade%20abonnement%20MBA"
                  className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#22c55e] hover:underline shrink-0"
                >
                  Passer au supérieur
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            )}
            <AdminPageTransition>{children}</AdminPageTransition>
          </main>
        </div>
        <MobileBottomNav variant="admin" />
        <AnnouncementPopup />
      </div>
    </SidebarProvider>
  );
}
