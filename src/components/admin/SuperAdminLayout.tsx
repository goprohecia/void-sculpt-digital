import { Navigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { AdminPageTransition } from "./AdminPageTransition";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const { isAuthenticated, user } = useDemoAuth();

  if (!isAuthenticated || user?.role !== "superadmin") {
    return <Navigate to="/client/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center px-4 gap-4 mx-4 mt-3 rounded-2xl glass-card glass-noise border border-amber-500/20">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex-1" />
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">
              Super Admin MBA
            </span>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <AdminPageTransition>{children}</AdminPageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
