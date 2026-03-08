import { useLocation, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, CreditCard, BarChart3, Settings, LogOut, Layers, MapPin } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
          <p className="text-lg font-bold tracking-tight text-amber-400">MBA</p>
          <p className="text-xs text-muted-foreground">Super Administration</p>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70">
            Gestion globale
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-amber-500/20 text-amber-400 text-sm font-semibold">
              {user?.nom?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nom || "Super Admin"}</p>
            <p className="text-xs text-amber-400">Super Admin</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/client/login", { replace: true }); }}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
