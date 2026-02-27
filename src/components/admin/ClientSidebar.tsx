import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Receipt,
  MessageSquare,
  LifeBuoy,
  UserCircle,
  Settings,
  LogOut,
  Send,
  CalendarDays,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useConversations } from "@/hooks/use-conversations";
import { useTickets } from "@/hooks/use-tickets";
import { useClientId } from "@/hooks/use-client-id";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/use-app-settings";
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

export function ClientSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();
  const { clientId, clientName, clientInitials } = useClientId();
  const { conversations } = useConversations();
  const { tickets } = useTickets();
  const { clientVisibleModules } = useAppSettings();

  const clientConvNonLus = clientId
    ? conversations.filter((c) => c.clientId === clientId).reduce((acc, c) => acc + (c.nonLus || 0), 0)
    : 0;

  const openClientTickets = clientId
    ? tickets.filter((t) => t.clientId === clientId && (t.statut === "ouvert" || t.statut === "en_cours")).length
    : 0;

  const allNavItems = [
    { title: "Tableau de bord", url: "/client", icon: LayoutDashboard, moduleKey: "overview" },
    { title: "Mes dossiers", url: "/client/dossiers", icon: FolderOpen, moduleKey: "dossiers" },
    { title: "Demandes", url: "/client/demandes", icon: Send, moduleKey: "demandes" },
    { title: "Devis", url: "/client/devis", icon: FileText, moduleKey: "devis" },
    { title: "Factures", url: "/client/factures", icon: Receipt, moduleKey: "factures" },
    { title: "Messagerie", url: "/client/messagerie", icon: MessageSquare, badge: clientConvNonLus, moduleKey: "messagerie" },
    { title: "Rendez-vous", url: "/client/rendez-vous", icon: CalendarDays, moduleKey: "rendez-vous" },
    { title: "Support", url: "/client/support", icon: LifeBuoy, badge: openClientTickets, moduleKey: "support" },
    { title: "Mon profil", url: "/client/profil", icon: UserCircle, moduleKey: "profil" },
    { title: "Paramètres", url: "/client/parametres", icon: Settings, moduleKey: "parametres" },
  ];

  const navItems = allNavItems.filter((item) => clientVisibleModules.includes(item.moduleKey));

  const isActive = (url: string) => {
    if (url === "/client") return location.pathname === "/client";
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <Link to="/client" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[hsl(200,100%,50%)]/20 flex items-center justify-center">
            <span className="text-[hsl(200,100%,60%)] font-bold text-sm">
              {clientInitials}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold">{clientName}</p>
            <p className="text-xs text-muted-foreground">Espace client</p>
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
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(200,100%,50%)] text-[10px] font-bold text-white">
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
          <div className="h-8 w-8 rounded-full bg-[hsl(200,100%,50%)]/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-[hsl(200,100%,60%)]">
              {clientInitials.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nom || clientName}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || "client"}</p>
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
