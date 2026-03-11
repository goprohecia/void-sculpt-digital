import { Navigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { AdminPageTransition } from "./AdminPageTransition";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
      <div className="min-h-screen flex w-full" style={{ background: "#14532d" }}>
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center px-8 gap-4 bg-white border-b border-[#e4e8df] shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
            <SidebarTrigger className="text-[#9ca3af] hover:text-[#1a2318] hover:bg-[#f0fdf4] rounded-[var(--radius-sm)] p-2 transition-colors" />
            <div className="relative w-[300px] hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full h-9 pl-9 pr-4 rounded-[var(--radius-full,9999px)] bg-[#f7f8f5] border border-[#e4e8df] text-sm text-[#1a2318] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#22c55e] focus:ring-[3px] focus:ring-[rgba(34,197,94,0.15)] transition-all"
              />
            </div>
            <div className="flex-1" />
            <span className="text-xs px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] font-medium">
              Super Admin MBA
            </span>
            <div className="h-6 w-px bg-[#e4e8df]" />
            <div className="h-9 w-9 rounded-full bg-[#22c55e] flex items-center justify-center text-sm font-extrabold text-[#14532d]">
              {user?.nom?.charAt(0) || "S"}
            </div>
          </header>
          <main className="flex-1 p-7 overflow-auto">
            <AdminPageTransition>{children}</AdminPageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
