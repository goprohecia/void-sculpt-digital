import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, MessageSquare, CalendarDays, UserCircle,
  LogOut, Package, Users, Receipt, Bell, Mail, LifeBuoy, BarChart3,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useWhiteLabel } from "@/hooks/use-white-label";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { getSectorRoleLabel } from "@/data/sectorModules";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarSeparator,
} from "@/components/ui/sidebar";
import logoMba from "@/assets/logo-mba.png";

export function EmployeeSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();
  const { employeeVisibleModules } = useAppSettings();
  const { config: wl } = useWhiteLabel();
  const { getModuleLabel, isModuleHidden, demoSector } = useDemoPlan();

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

  const navItems = allNavItems
    .filter((item) => employeeVisibleModules.includes(item.moduleKey))
    .filter((item) => !isModuleHidden(item.moduleKey));

  const isActive = (url: string) => {
    if (url === "/employee") return location.pathname === "/employee";
    return location.pathname.startsWith(url);
  };

  const initials = user?.nom?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "SA";

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="!bg-white !border-r !border-[#e4e8df]" style={{ boxShadow: "var(--shadow-sidebar)" }}>
      <SidebarHeader className="p-5 pb-4 border-b border-[#e4e8df]">
        <Link to="/employee" className="flex items-center gap-2">
          {wl.logoUrl ? (
            <img src={wl.logoUrl} alt={wl.brandName} className="h-8 object-contain" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-[#14532d] flex items-center justify-center">
              <span className="text-[#22c55e] font-extrabold text-sm">{wl.brandShort}</span>
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-[#1a2318]">{wl.brandName}</p>
            <p className="text-[11px] text-[#9ca3af]">
              {getSectorRoleLabel(demoSector, "employee") ? `Espace ${getSectorRoleLabel(demoSector, "employee")}` : "Espace salarié"}
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#9ca3af] px-5 py-3">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 py-[9px] px-5 border-l-[3px] transition-all duration-[120ms] ${
                          active
                            ? "bg-[#14532d] text-white font-bold border-l-[#22c55e] rounded-r-[var(--radius-sm)] mr-2 shadow-[0_2px_8px_rgba(20,83,45,0.25)]"
                            : "text-[#4a5e46] border-l-transparent hover:bg-[#f0fdf4] hover:text-[#1a2318]"
                        }`}
                      >
                        <item.icon className={`h-[18px] w-[18px] ${active ? "text-[#22c55e]" : "opacity-65"}`} />
                        <span className="flex-1">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-[#f7f8f5] border-t border-[#e4e8df]">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-[#14532d] flex items-center justify-center text-sm font-extrabold text-[#22c55e]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate text-[#1a2318]">{user?.nom}</p>
            <p className="text-[11px] text-[#9ca3af] capitalize">{user?.role || "salarié"}</p>
          </div>
        </div>
        <button
          onClick={async () => { logout(); await supabase.auth.signOut(); navigate("/client/login", { replace: true }); }}
          className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-[#9ca3af] hover:text-[#dc2626] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
