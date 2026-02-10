import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  MessageSquare,
  Receipt,
  Bell,
  Mail,
  BarChart3,
  LifeBuoy,
  Settings,
  LogOut,
  CalendarDays,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useConversations } from "@/hooks/use-conversations";
import { useTickets } from "@/hooks/use-tickets";
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

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();
  const { conversations } = useConversations();
  const { tickets } = useTickets();

  const totalNonLus = conversations.reduce((sum, c) => sum + (c.nonLus || 0), 0);
  const openTickets = tickets.filter((t) => t.statut === "ouvert" || t.statut === "en_cours").length;

  const navItems = [
    { title: "Vue d'ensemble", url: "/admin", icon: LayoutDashboard },
    { title: "Clients", url: "/admin/clients", icon: Users },
    { title: "Dossiers", url: "/admin/dossiers", icon: FolderOpen },
    { title: "Messagerie", url: "/admin/messagerie", icon: MessageSquare, badge: totalNonLus },
    { title: "Facturation", url: "/admin/facturation", icon: Receipt },
    { title: "Relances", url: "/admin/relances", icon: Bell },
    { title: "Emails", url: "/admin/emails", icon: Mail },
    { title: "Rendez-vous", url: "/admin/rendez-vous", icon: CalendarDays },
    { title: "Support", url: "/admin/support", icon: LifeBuoy, badge: openTickets },
    { title: "Analyse", url: "/admin/analyse", icon: BarChart3 },
    { title: "Paramètres", url: "/admin/parametres", icon: Settings },
  ];

  const isActive = (url: string) => {
    if (url === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">IM</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Impartial</p>
            <p className="text-xs text-muted-foreground">Back-office</p>
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
                      {item.badge ? (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {item.badge}
                        </span>
                      ) : null}
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
            <span className="text-xs font-semibold text-primary">
              {user?.nom?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nom}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
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
