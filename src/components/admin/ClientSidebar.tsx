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
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarSeparator,
} from "@/components/ui/sidebar";
import logoMba from "@/assets/logo-mba.png";

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
    <Sidebar variant="sidebar" collapsible="icon" className="!bg-white !border-r !border-[#e4e8df]" style={{ boxShadow: "var(--shadow-sidebar)" }}>
      <SidebarHeader className="p-5 pb-4 border-b border-[#e4e8df]">
        <Link to="/client" className="flex items-center gap-2">
          {wl.logoUrl ? (
            <img src={wl.logoUrl} alt={wl.brandName} className="h-8 object-contain" />
          ) : (
            <img src={logoMba} alt="MBA" className="h-8 w-auto object-contain" />
          )}
          <div>
            <p className="text-sm font-bold text-[#1a2318]">{clientName}</p>
            <p className="text-[11px] text-[#9ca3af]">Espace client · {wl.brandShort}</p>
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
                        {item.badge ? (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] text-[10px] font-bold text-[#14532d]">
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

      <SidebarFooter className="p-4 bg-[#f7f8f5] border-t border-[#e4e8df]">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-[#14532d] flex items-center justify-center text-sm font-extrabold text-[#22c55e]">
            {clientInitials?.charAt(0) || "C"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate text-[#1a2318]">{user?.nom || clientName}</p>
            <p className="text-[11px] text-[#9ca3af] capitalize">{user?.role || "client"}</p>
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
