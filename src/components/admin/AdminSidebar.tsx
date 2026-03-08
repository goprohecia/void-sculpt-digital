import { useLocation, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  Package,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useConversations } from "@/hooks/use-conversations";
import { useTickets } from "@/hooks/use-tickets";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useCustomSpaces } from "@/hooks/use-custom-spaces";
import { useSubscription } from "@/hooks/use-subscription";
import { Sparkles } from "lucide-react";
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

const mainMenuKeys = ["overview", "clients", "employees", "dossiers", "rendez-vous"];
const toolsKeys = ["messagerie", "facturation", "relances", "emails", "support", "stock", "analyse", "parametres"];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();
  const { conversations } = useConversations();
  const { tickets } = useTickets();
  const { enabledModules } = useAppSettings();

  const totalNonLus = conversations.reduce((sum, c) => sum + (c.nonLus || 0), 0);
  const openTickets = tickets.filter((t) => t.statut === "ouvert" || t.statut === "en_cours").length;

  const allNavItems = [
    { title: "Vue d'ensemble", url: "/admin", icon: LayoutDashboard, moduleKey: "overview" },
    { title: "Clients", url: "/admin/clients", icon: Users, moduleKey: "clients" },
    { title: "Salariés", url: "/admin/employees", icon: Users, moduleKey: "employees" },
    { title: "Dossiers", url: "/admin/dossiers", icon: FolderOpen, moduleKey: "dossiers" },
    { title: "Rendez-vous", url: "/admin/rendez-vous", icon: CalendarDays, moduleKey: "rendez-vous" },
    { title: "Messagerie", url: "/admin/messagerie", icon: MessageSquare, badge: totalNonLus, moduleKey: "messagerie" },
    { title: "Facturation", url: "/admin/facturation", icon: Receipt, moduleKey: "facturation" },
    { title: "Relances", url: "/admin/relances", icon: Bell, moduleKey: "relances" },
    { title: "Emails", url: "/admin/emails", icon: Mail, moduleKey: "emails" },
    { title: "Support", url: "/admin/support", icon: LifeBuoy, badge: openTickets, moduleKey: "support" },
    { title: "Stock", url: "/admin/stock", icon: Package, moduleKey: "stock" },
    { title: "Analyse", url: "/admin/analyse", icon: BarChart3, moduleKey: "analyse" },
    { title: "Paramètres", url: "/admin/parametres", icon: Settings, moduleKey: "parametres" },
  ];

  const navItems = allNavItems.filter((item) => enabledModules.includes(item.moduleKey));
  const mainItems = navItems.filter((item) => mainMenuKeys.includes(item.moduleKey));
  const toolItems = navItems.filter((item) => toolsKeys.includes(item.moduleKey));

  const isActive = (url: string) => {
    if (url === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(url);
  };

  const renderItems = (items: typeof navItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
          <Link to={item.url} className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.title}</span>
            {item.badge ? (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                {item.badge}
              </span>
            ) : null}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="p-5 pb-4">
        <Link to="/admin" className="flex flex-col items-center text-center gap-1">
          <p className="text-lg font-bold tracking-tight">MBA</p>
          <p className="text-xs text-muted-foreground">My Business Assistant</p>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {mainItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70">
              Menu principal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {toolItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70">
              Outils
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderItems(toolItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-3" />
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
              {user?.nom?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nom || "My Business Assistant"}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || "Admin"}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); supabase.auth.signOut(); navigate("/admin/access", { replace: true }); }}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
