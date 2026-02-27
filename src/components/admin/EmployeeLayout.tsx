import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeSidebar } from "./EmployeeSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const { isAuthenticated: isDemoAuth, user: demoUser } = useDemoAuth();
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

  if (loading) return null;

  if (!isDemoEmployee && !isRealAuth) {
    return <Navigate to="/client/login" replace />;
  }

  if (isDemoAuth && demoUser?.role !== "employee" && !isRealAuth) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <EmployeeSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border/50 flex items-center px-4 gap-4 glass-nav">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex-1" />
            {isDemoEmployee && (
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                Mode démo
              </span>
            )}
            {isRealAuth && !isDemoEmployee && (
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
