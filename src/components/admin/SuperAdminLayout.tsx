import { Navigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { AdminPageTransition } from "./AdminPageTransition";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";

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
          <header className="h-16 flex items-center px-8 gap-4 bg-card border-b border-border">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-mba-green-50 rounded-lg p-2 transition-colors" />
            <div className="relative w-80 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full h-9 pl-9 pr-4 rounded-[var(--radius-xl)] bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="flex-1" />
            <span className="text-xs px-3 py-1 rounded-full bg-mba-green-100 text-mba-green-700 font-medium">
              Super Admin MBA
            </span>
            <div className="h-6 w-px bg-border" />
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {user?.nom?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            <AdminPageTransition>{children}</AdminPageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
