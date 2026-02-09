import { Navigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDemoData } from "@/contexts/DemoDataContext";
import { AdminSidebar } from "./AdminSidebar";
import { NotificationPanel } from "./NotificationPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated } = useDemoAuth();
  const { getNotificationsAdmin, markNotificationRead, markAllNotificationsRead } = useDemoData();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border/50 flex items-center px-4 gap-4 glass-nav">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex-1" />
            <NotificationPanel
              notifications={getNotificationsAdmin()}
              onMarkRead={markNotificationRead}
              onMarkAllRead={() => markAllNotificationsRead("admin")}
            />
            <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
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
