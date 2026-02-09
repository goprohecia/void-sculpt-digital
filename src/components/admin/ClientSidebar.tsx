import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Receipt,
  MessageSquare,
  LifeBuoy,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { getConversationsByClient, getOpenTicketsCount, DEMO_CLIENT_ID } from "@/data/mockData";
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

const clientConvNonLus = getConversationsByClient(DEMO_CLIENT_ID).reduce((acc, c) => acc + c.nonLus, 0);

const navItems = [
  { title: "Tableau de bord", url: "/client", icon: LayoutDashboard },
  { title: "Mes dossiers", url: "/client/dossiers", icon: FolderOpen },
  { title: "Devis", url: "/client/devis", icon: FileText },
  { title: "Factures", url: "/client/factures", icon: Receipt },
  { title: "Messagerie", url: "/client/messagerie", icon: MessageSquare, badge: clientConvNonLus },
  { title: "Support", url: "/client/support", icon: LifeBuoy, badge: getOpenTicketsCount(DEMO_CLIENT_ID) },
  { title: "Mon profil", url: "/client/profil", icon: UserCircle },
];

export function ClientSidebar() {
  const location = useLocation();
  const { user, logout } = useDemoAuth();

  const isActive = (url: string) => {
    if (url === "/client") return location.pathname === "/client";
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <Link to="/client" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[hsl(200,100%,50%)]/20 flex items-center justify-center">
            <span className="text-[hsl(200,100%,60%)] font-bold text-sm">IM</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Impartial</p>
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
              {user?.nom?.charAt(0) || "C"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nom}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
