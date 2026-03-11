import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useDemoData } from "@/contexts/DemoDataContext";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeSidebar } from "./EmployeeSidebar";
import { AdminPageTransition } from "./AdminPageTransition";
import { NotificationPanel } from "./NotificationPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const { isAuthenticated: isDemoAuth, user: demoUser } = useDemoAuth();
  const { getNotificationsByEmployee, markNotificationRead, markAllNotificationsRead } = useDemoData();
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

  const isDemoEmployee = isDemoAuth && demoUser?.role === "employee";
  const isRealAuth = !!supabaseUser;
  const employeeId = isDemoEmployee ? (demoUser as any)?.employeeId || "emp_1" : supabaseUser?.id || "";
  const employeeNotifications = getNotificationsByEmployee(employeeId);

  if (loading) return null;
  if (!isDemoEmployee && !isRealAuth) return <Navigate to="/client/login" replace />;
  if (isDemoAuth && demoUser?.role !== "employee" && !isRealAuth) return <Navigate to="/admin" replace />;

  const initials = demoUser?.nom?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "SA";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ background: "#14532d" }}>
        <EmployeeSidebar />
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
            <NotificationPanel
              notifications={employeeNotifications}
              onMarkAllRead={() => markAllNotificationsRead("admin")}
              onMarkRead={markNotificationRead}
            />
            {isDemoEmployee && (
              <span className="text-xs px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] font-medium">
                Mode démo
              </span>
            )}
            {isRealAuth && !isDemoEmployee && (
              <span className="text-xs text-[#9ca3af]">{supabaseUser.email}</span>
            )}
            <div className="h-6 w-px bg-[#e4e8df]" />
            <div className="h-9 w-9 rounded-full bg-[#22c55e] flex items-center justify-center text-sm font-extrabold text-[#14532d]">
              {initials}
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
