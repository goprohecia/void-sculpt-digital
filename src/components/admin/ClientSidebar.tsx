import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, FileText, Receipt, MessageSquare,
  LifeBuoy, UserCircle, Settings, LogOut, Send, CalendarDays,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useConversations } from "@/hooks/use-conversations";
import { useTickets } from "@/hooks/use-tickets";
import { useClientId } from "@/hooks/use-client-id";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useWhiteLabel } from "@/hooks/use-white-label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarSeparator,
} from "@/components/ui/sidebar";

export function ClientSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();
  const { clientId, clientName, clientInitials } = useClientId();
  const { conversations } = useConversations();
  const { tickets } = useTickets();
  const { clientVisibleModules } = useAppSettings();
  const { config: wl } = useWhiteLabel();

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
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link to="/client" className="flex items-center gap-2">
          {wl.logoUrl ? (
            <img src={wl.logoUrl} alt={wl.brandName} className="h-8 object-contain" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">{clientInitials}</span>
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-foreground">{clientName}</p>
            <p className="text-[11px] text-muted-foreground">Espace client · {wl.brandShort}</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">Navigation</SidebarGroupLabel>
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
                        <span className="flex-1">{item.title}</span>
                        {item.badge ? (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {item.badge}
                          </span>
                        ) : null}
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
              {clientInitials?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-foreground">{user?.nom || clientName}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || "client"}</p>
          </div>
        </div>
        <button
          onClick={async () => { logout(); await supabase.auth.signOut(); navigate("/client/login", { replace: true }); }}
          className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-mba-green-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
