import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDemoData } from "@/contexts/DemoDataContext";
import { supabase } from "@/integrations/supabase/client";
import { ClientSidebar } from "./ClientSidebar";
import { NotificationPanel } from "./NotificationPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DEMO_CLIENT_ID } from "@/data/mockData";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated: isDemoAuth, user: demoUser } = useDemoAuth();
  const { getNotificationsByClient, markNotificationRead, markAllNotificationsRead } = useDemoData();
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

  const isDemo = isDemoAuth && demoUser?.role === "client";
  const isRealAuth = !!supabaseUser;

  if (loading) return null;

  if (!isDemo && !isRealAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isDemoAuth && demoUser?.role !== "client" && !isRealAuth) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ClientSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border/50 flex items-center px-4 gap-4 glass-nav">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex-1" />
            {isDemo && (
              <>
                <NotificationPanel
                  notifications={getNotificationsByClient(DEMO_CLIENT_ID)}
                  onMarkRead={markNotificationRead}
                  onMarkAllRead={() => markAllNotificationsRead("client", DEMO_CLIENT_ID)}
                />
                <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-[hsl(200,100%,50%)]/10 text-[hsl(200,100%,60%)] font-medium">
                  Mode démo
                </span>
              </>
            )}
            {isRealAuth && !isDemo && (
              <span className="text-xs text-muted-foreground">
                {supabaseUser.email}
              </span>
            )}
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
