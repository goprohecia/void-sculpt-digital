import { Navigate } from "react-router-dom";
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
            <AdminPageTransition>{children}</AdminPageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
