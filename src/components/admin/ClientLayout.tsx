import { Navigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { ClientSidebar } from "./ClientSidebar";
import { NotificationPanel } from "./NotificationPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getNotificationsByClient, DEMO_CLIENT_ID } from "@/data/mockData";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated, user } = useDemoAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== "client") {
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
            <NotificationPanel notifications={getNotificationsByClient(DEMO_CLIENT_ID)} />
            <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-[hsl(200,100%,50%)]/10 text-[hsl(200,100%,60%)] font-medium">
              Mode démo
            </span>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
