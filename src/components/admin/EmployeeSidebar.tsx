import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  CalendarDays,
  UserCircle,
  LogOut,
  Package,
  Users,
  Receipt,
  Bell,
  Mail,
  LifeBuoy,
  BarChart3,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useWhiteLabel } from "@/hooks/use-white-label";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function EmployeeSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();
  const { employeeVisibleModules } = useAppSettings();
  const { config: wl } = useWhiteLabel();
  const { getModuleLabel, isModuleHidden } = useDemoPlan();

  const allNavItems = [
    { title: getModuleLabel("overview"), url: "/employee", icon: LayoutDashboard, moduleKey: "overview" },
    { title: getModuleLabel("clients"), url: "/employee/clients", icon: Users, moduleKey: "clients" },
    { title: getModuleLabel("dossiers"), url: "/employee/dossiers", icon: FolderOpen, moduleKey: "dossiers" },
    { title: getModuleLabel("agenda"), url: "/employee/calendrier", icon: CalendarDays, moduleKey: "agenda" },
    { title: getModuleLabel("messagerie"), url: "/employee/messagerie", icon: MessageSquare, moduleKey: "messagerie" },
    { title: getModuleLabel("facturation"), url: "/employee/facturation", icon: Receipt, moduleKey: "facturation" },
    { title: getModuleLabel("relances"), url: "/employee/relances", icon: Bell, moduleKey: "relances" },
    { title: getModuleLabel("emails"), url: "/employee/emails", icon: Mail, moduleKey: "emails" },
    { title: getModuleLabel("rendez-vous"), url: "/employee/rendez-vous", icon: CalendarDays, moduleKey: "rendez-vous" },
    { title: getModuleLabel("support"), url: "/employee/support", icon: LifeBuoy, moduleKey: "support" },
    { title: getModuleLabel("stock"), url: "/employee/stock", icon: Package, moduleKey: "stock" },
    { title: getModuleLabel("analyse"), url: "/employee/analyse", icon: BarChart3, moduleKey: "analyse" },
    { title: "Mon profil", url: "/employee/profil", icon: UserCircle, moduleKey: "profil" },
  ];

  const navItems = allNavItems.filter((item) => employeeVisibleModules.includes(item.moduleKey));

  const isActive = (url: string) => {
    if (url === "/employee") return location.pathname === "/employee";
    return location.pathname.startsWith(url);
  };

  const initials = user?.nom?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "SA";

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link to="/employee" className="flex items-center gap-2">
          {wl.logoUrl ? (
            <img src={wl.logoUrl} alt={wl.brandName} className="h-8 object-contain" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">{wl.brandShort}</span>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{wl.brandName}</p>
            <p className="text-xs text-muted-foreground">Espace salarié</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-3" />
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nom}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || "salarié"}</p>
          </div>
        </div>
        <button
          onClick={async () => { logout(); await supabase.auth.signOut(); navigate("/client/login", { replace: true }); }}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
