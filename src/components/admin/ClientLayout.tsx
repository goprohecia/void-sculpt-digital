import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useNotificationsData } from "@/hooks/use-notifications-data";
import { useClientId } from "@/hooks/use-client-id";
import { supabase } from "@/integrations/supabase/client";
import { ClientSidebar } from "./ClientSidebar";
import { NotificationPanel } from "./NotificationPanel";
import { AdminPageTransition } from "./AdminPageTransition";
import { MobileBottomNav } from "./MobileBottomNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import logoMba from "@/assets/logo-mba.png";
import { AnnouncementPopup } from "@/components/messaging/AnnouncementPopup";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated: isDemoAuth, user: demoUser } = useDemoAuth();
  const { clientId, isDemo, clientInitials } = useClientId();
  const { getNotificationsByClient, markNotificationRead, markAllNotificationsRead } = useNotificationsData();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isDemoClient = isDemoAuth && demoUser?.role === "client";
  const isRealAuth = !!supabaseUser;

  if (loading) return null;
  if (!isDemoClient && !isRealAuth) return <Navigate to="/client/login" replace />;
  if (isDemoAuth && demoUser?.role !== "client" && !isRealAuth) return <Navigate to="/admin" replace />;

  return (
    <SidebarProvider>
      <div className="mba-app min-h-screen flex w-full" style={{ background: "hsl(150, 60%, 10%)" }}>
        <ClientSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 md:h-16 flex items-center px-3 md:px-8 gap-2 md:gap-4 bg-[#F6F5F2] border-b border-[#e4e8df] shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
            <SidebarTrigger className="text-[#9ca3af] hover:text-[#1a2318] hover:bg-[#f0fdf4] rounded-[var(--radius-sm)] p-2 transition-colors" />
            <img src={logoMba} alt="MBA" className="h-7 md:hidden" />
            <div className="relative w-[300px] hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full h-9 pl-9 pr-4 rounded-[var(--radius-full,9999px)] bg-[#f7f8f5] border border-[#e4e8df] text-sm text-[#1a2318] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#22c55e] focus:ring-[3px] focus:ring-[rgba(34,197,94,0.15)] transition-all"
              />
            </div>
            <div className="flex-1" />
            {isDemo && clientId && (
              <>
                <NotificationPanel
                  notifications={getNotificationsByClient(clientId)}
                  onMarkRead={markNotificationRead}
                  onMarkAllRead={() => markAllNotificationsRead("client", clientId)}
                />
                <span className="text-xs px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] font-medium hidden md:inline">
                  Mode démo
                </span>
              </>
            )}
            {isRealAuth && !isDemo && (
              <span className="text-xs text-[#9ca3af] hidden md:inline">{supabaseUser.email}</span>
            )}
            <div className="h-6 w-px bg-[#e4e8df] hidden md:block" />
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#22c55e] flex items-center justify-center text-sm font-extrabold text-[#14532d]">
              {clientInitials?.charAt(0) || "C"}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-7 overflow-auto pb-20 md:pb-7">
            <AdminPageTransition>{children}</AdminPageTransition>
          </main>
        </div>
        <MobileBottomNav variant="client" />
        <AnnouncementPopup />
      </div>
    </SidebarProvider>
  );
}
