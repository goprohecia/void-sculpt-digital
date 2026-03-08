import { useState } from "react";
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
  Building2,
  Briefcase,
  Wrench,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useConversations } from "@/hooks/use-conversations";
import { useTickets } from "@/hooks/use-tickets";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useCustomSpaces } from "@/hooks/use-custom-spaces";
import { useSubscription } from "@/hooks/use-subscription";
import { useWhiteLabel } from "@/hooks/use-white-label";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import type { LucideIcon } from "lucide-react";

const principalKeys = ["overview", "clients", "employees", "dossiers"];
const commercialKeys = ["pipeline", "facturation", "relances", "stock"];
const outilsKeys = ["messagerie", "emails", "rendez-vous", "agenda", "taches", "support", "notes"];
const gestionKeys = ["analyse", "rapports", "documents", "temps", "automatisations", "ia", "parametres"];

type GroupConfig = {
  label: string;
  icon: LucideIcon;
  keys: string[];
};

const GROUPS: GroupConfig[] = [
  { label: "Principal", icon: Building2, keys: principalKeys },
  { label: "Commercial", icon: Briefcase, keys: commercialKeys },
  { label: "Outils", icon: Wrench, keys: outilsKeys },
  { label: "Gestion", icon: ClipboardList, keys: gestionKeys },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();
  const { conversations } = useConversations();
  const { tickets } = useTickets();
  const { enabledModules } = useAppSettings();
  const { spaces } = useCustomSpaces();
  const { isEnterprise, plan, currentPlanModules } = useSubscription();
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
    { title: "Intelligence IA", url: "/admin/ia", icon: Bot, moduleKey: "ia" },
    { title: "Paramètres", url: "/admin/parametres", icon: Settings, moduleKey: "parametres" },
  ];

  // Filter by enabled modules, then apply plan-specific module list (from context)
  const enabledItems = allNavItems.filter((item) => enabledModules.includes(item.moduleKey));
  const alwaysVisible = ["overview", "parametres"];
  const planModules = currentPlanModules[plan];
  const navItems = planModules === "all"
    ? enabledItems
    : enabledItems.filter((item) =>
        alwaysVisible.includes(item.moduleKey) || planModules.includes(item.moduleKey)
      );

  const isActive = (url: string) => {
    if (url === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(url);
  };

  // Determine which groups have an active route (for default open)
  const groupHasActive = (keys: string[]) =>
    navItems.some((item) => keys.includes(item.moduleKey) && isActive(item.url));

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    GROUPS.forEach((g) => { initial[g.label] = groupHasActive(g.keys) || g.label === "Principal"; });
    return initial;
  });

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

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
        {GROUPS.map((group) => {
          const items = navItems.filter((item) => group.keys.includes(item.moduleKey));
          if (items.length === 0) return null;
          const GroupIcon = group.icon;
          const isOpen = openGroups[group.label] ?? true;

          return (
            <Collapsible key={group.label} open={isOpen} onOpenChange={() => toggleGroup(group.label)}>
              <SidebarGroup>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70 flex items-center gap-1.5 cursor-pointer hover:text-muted-foreground transition-colors select-none">
                    <GroupIcon className="h-3.5 w-3.5" />
                    <span className="flex-1">{group.label}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>{renderItems(items)}</SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        {/* Custom Spaces - Enterprise only */}
        {isEnterprise && spaces.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
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
