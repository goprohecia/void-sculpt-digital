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
    <Sidebar variant="floating" collapsible="icon" className="!bg-[#0c3b1e] !border-none" style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.20)" }}>
      <SidebarHeader className="p-5 pb-4 border-b border-white/10">
        <Link to="/superadmin" className="flex flex-col items-center text-center gap-1">
          <p className="text-[22px] font-extrabold text-[#4ade80] tracking-tight">MBA</p>
          <p className="text-[11px] text-white/40">Super Administration</p>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[1.5px] font-bold text-white/40 px-5 py-3">
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
                        className={`flex items-center gap-3 py-[10px] px-5 border-l-[3px] transition-all duration-[120ms] ${
                          active
                            ? "bg-white/[0.15] text-white font-semibold border-l-[#4ade80]"
                            : "text-white/[0.80] border-l-transparent hover:bg-white/[0.10] hover:text-white"
                        }`}
                      >
                        <item.icon className={`h-[18px] w-[18px] ${active ? "text-[#4ade80]" : "opacity-70"}`} />
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

      <SidebarFooter className="p-4 bg-[#082b14] border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-[#22c55e] flex items-center justify-center text-sm font-extrabold text-[#14532d]">
            {user?.nom?.charAt(0) || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate text-white">{user?.nom || "Super Admin"}</p>
            <p className="text-[11px] text-white/[0.45]">Super Admin</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/client/login", { replace: true }); }}
          className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
