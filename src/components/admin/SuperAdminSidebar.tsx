import { useLocation, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, CreditCard, BarChart3, Settings, LogOut, Layers, MapPin } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarSeparator,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Vue d'ensemble", url: "/superadmin", icon: LayoutDashboard },
  { title: "Entreprises", url: "/superadmin/entreprises", icon: Building2 },
  { title: "Abonnements", url: "/superadmin/abonnements", icon: CreditCard },
  { title: "Formules", url: "/superadmin/formules", icon: Layers },
  { title: "Secteurs", url: "/superadmin/secteurs", icon: MapPin },
  { title: "Statistiques", url: "/superadmin/stats", icon: BarChart3 },
  { title: "Paramètres MBA", url: "/superadmin/parametres", icon: Settings },
];

export function SuperAdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();

  const isActive = (url: string) => {
    if (url === "/superadmin") return location.pathname === "/superadmin";
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="!bg-white !border-r !border-[#e4e8df]" style={{ boxShadow: "var(--shadow-sidebar)" }}>
      <SidebarHeader className="p-5 pb-4 border-b border-[#e4e8df]">
        <Link to="/superadmin" className="flex flex-col items-center text-center gap-1">
          <p className="text-[22px] font-extrabold text-[#14532d] tracking-tight" style={{ fontFamily: "'Syne', 'Inter', sans-serif" }}>MBA</p>
          <p className="text-[11px] text-[#9ca3af]">Super Administration</p>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#9ca3af] px-5 py-3">
            Gestion globale
          </SidebarGroupLabel>
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
                        <span>{item.title}</span>
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
            {user?.nom?.charAt(0) || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate text-[#1a2318]">{user?.nom || "Super Admin"}</p>
            <p className="text-[11px] text-[#9ca3af]">Super Admin</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/client/login", { replace: true }); }}
          className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-[#9ca3af] hover:text-[#dc2626] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
