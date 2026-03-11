import { useLocation, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, CreditCard, BarChart3, Settings, LogOut, Layers, MapPin } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="p-5 pb-4">
        <Link to="/superadmin" className="flex flex-col items-center text-center gap-1">
          <p className="text-xl font-extrabold bg-gradient-to-r from-mba-green-500 to-mba-green-900 bg-clip-text text-transparent">MBA</p>
          <p className="text-[11px] text-muted-foreground">Super Administration</p>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">
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
                        className={`flex items-center gap-3 transition-all duration-120 rounded-r-[var(--radius-sm)] ${
                          active
                            ? "bg-mba-green-50 text-primary font-semibold border-l-[3px] border-primary pl-[calc(0.75rem-3px)]"
                            : "text-muted-foreground hover:bg-mba-green-50 hover:text-primary"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
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

      <SidebarFooter className="p-4 bg-secondary border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {user?.nom?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-foreground">{user?.nom || "Super Admin"}</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/client/login", { replace: true }); }}
          className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-mba-green-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
