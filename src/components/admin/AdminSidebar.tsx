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
  CheckSquare,
  Calendar,
  FileText,
  FolderClosed,
  Timer,
  Zap,
  StickyNote,
  Target,
  Bot,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useConversations } from "@/hooks/use-conversations";
import { useTickets } from "@/hooks/use-tickets";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useCustomSpaces } from "@/hooks/use-custom-spaces";
import { useSubscription } from "@/hooks/use-subscription";
import { useWhiteLabel } from "@/hooks/use-white-label";
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

const principalKeys = ["overview", "clients", "employees", "dossiers"];
const commercialKeys = ["pipeline", "facturation", "relances", "stock"];
const outilsKeys = ["messagerie", "emails", "rendez-vous", "agenda", "taches", "support", "notes"];
const gestionKeys = ["analyse", "rapports", "documents", "temps", "automatisations", "ia", "parametres"];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();
  const { conversations } = useConversations();
  const { tickets } = useTickets();
  const { enabledModules } = useAppSettings();
  const { spaces } = useCustomSpaces();
  const { isEnterprise } = useSubscription();
  const { config: wl } = useWhiteLabel();

  const totalNonLus = conversations.reduce((sum, c) => sum + (c.nonLus || 0), 0);
  const openTickets = tickets.filter((t) => t.statut === "ouvert" || t.statut === "en_cours").length;

  const allNavItems = [
    { title: "Vue d'ensemble", url: "/admin", icon: LayoutDashboard, moduleKey: "overview" },
    { title: "Clients", url: "/admin/clients", icon: Users, moduleKey: "clients" },
    { title: "Salariés", url: "/admin/employees", icon: Users, moduleKey: "employees" },
    { title: "Dossiers", url: "/admin/dossiers", icon: FolderOpen, moduleKey: "dossiers" },
    { title: "Rendez-vous", url: "/admin/rendez-vous", icon: CalendarDays, moduleKey: "rendez-vous" },
    { title: "Pipeline CRM", url: "/admin/pipeline", icon: Target, moduleKey: "pipeline" },
    { title: "Messagerie", url: "/admin/messagerie", icon: MessageSquare, badge: totalNonLus, moduleKey: "messagerie" },
    { title: "Facturation", url: "/admin/facturation", icon: Receipt, moduleKey: "facturation" },
    { title: "Relances", url: "/admin/relances", icon: Bell, moduleKey: "relances" },
    { title: "Emails", url: "/admin/emails", icon: Mail, moduleKey: "emails" },
    { title: "Support", url: "/admin/support", icon: LifeBuoy, badge: openTickets, moduleKey: "support" },
    { title: "Stock", url: "/admin/stock", icon: Package, moduleKey: "stock" },
    { title: "Analyse", url: "/admin/analyse", icon: BarChart3, moduleKey: "analyse" },
    { title: "Tâches", url: "/admin/taches", icon: CheckSquare, moduleKey: "taches" },
    { title: "Agenda", url: "/admin/agenda", icon: Calendar, moduleKey: "agenda" },
    { title: "Rapports", url: "/admin/rapports", icon: FileText, moduleKey: "rapports" },
    { title: "Documents", url: "/admin/documents", icon: FolderClosed, moduleKey: "documents" },
    { title: "Suivi du temps", url: "/admin/temps", icon: Timer, moduleKey: "temps" },
    { title: "Automatisations", url: "/admin/automatisations", icon: Zap, moduleKey: "automatisations" },
    { title: "Notes", url: "/admin/notes", icon: StickyNote, moduleKey: "notes" },
    { title: "Paramètres", url: "/admin/parametres", icon: Settings, moduleKey: "parametres" },
  ];

  const navItems = allNavItems.filter((item) => enabledModules.includes(item.moduleKey));
  const principalItems = navItems.filter((item) => principalKeys.includes(item.moduleKey));
  const commercialItems = navItems.filter((item) => commercialKeys.includes(item.moduleKey));
  const outilsItems = navItems.filter((item) => outilsKeys.includes(item.moduleKey));
  const gestionItems = navItems.filter((item) => gestionKeys.includes(item.moduleKey));

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

  const groupLabel = "text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70";

  const renderGroup = (label: string, items: typeof navItems) =>
    items.length > 0 ? (
      <SidebarGroup>
        <SidebarGroupLabel className={groupLabel}>{label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{renderItems(items)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    ) : null;

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="p-5 pb-4">
        <Link to="/admin" className="flex flex-col items-center text-center gap-1">
          {wl.logoUrl ? (
            <img src={wl.logoUrl} alt={wl.brandName} className="h-8 object-contain" />
          ) : (
            <p className="text-lg font-bold tracking-tight">{wl.brandShort}</p>
          )}
          <p className="text-xs text-muted-foreground">{wl.brandName}</p>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {renderGroup("Principal", principalItems)}
        {renderGroup("Commercial", commercialItems)}
        {renderGroup("Outils", outilsItems)}
        {renderGroup("Gestion", gestionItems)}

        {/* Custom Spaces - Enterprise only */}
        {isEnterprise && spaces.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Espaces personnalisés
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {spaces.map((space) => (
                  <SidebarMenuItem key={space.id}>
                    <SidebarMenuButton tooltip={space.name}>
                      <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-amber-400/60" />
                        <span>{space.name}</span>
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
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
