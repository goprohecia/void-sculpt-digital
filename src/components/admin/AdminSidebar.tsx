import { useState, useRef, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SECTORS, type SectorKey } from "@/contexts/DemoPlanContext";
import { getSectorRoleLabel } from "@/data/sectorModules";
import {
  LayoutDashboard, Users, FolderOpen, MessageSquare, Receipt, Bell, Mail,
  BarChart3, LifeBuoy, Settings, LogOut, CalendarDays, Package, CheckSquare,
  Calendar, FileText, FolderClosed, Timer, Zap, StickyNote, Target, Bot,
  Building2, Briefcase, Wrench, ClipboardList, ChevronDown, Truck,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarSeparator,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import logoMba from "@/assets/logo-mba.png";

const principalKeys = ["overview", "clients", "employees", "dossiers"];
const commercialKeys = ["pipeline", "facturation", "relances", "stock", "fournisseurs"];
const outilsKeys = ["messagerie", "emails", "rendez-vous", "agenda", "taches", "support", "notes"];
const gestionKeys = ["analyse", "rapports", "documents", "temps", "automatisations", "ia", "parametres"];

type GroupConfig = { label: string; icon: LucideIcon; keys: string[] };

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
  const { getModuleLabel, isModuleHidden, demoSector, setDemoSector } = useDemoPlan();

  const totalNonLus = conversations.reduce((sum, c) => sum + (c.nonLus || 0), 0);
  const openTickets = tickets.filter((t) => t.statut === "ouvert" || t.statut === "en_cours").length;

  const allNavItems = [
    { title: getModuleLabel("overview"), url: "/admin", icon: LayoutDashboard, moduleKey: "overview" },
    { title: getModuleLabel("clients"), url: "/admin/clients", icon: Users, moduleKey: "clients" },
    { title: getModuleLabel("employees"), url: "/admin/employees", icon: Users, moduleKey: "employees" },
    { title: getModuleLabel("dossiers"), url: "/admin/dossiers", icon: FolderOpen, moduleKey: "dossiers" },
    { title: getModuleLabel("rendez-vous"), url: "/admin/rendez-vous", icon: CalendarDays, moduleKey: "rendez-vous" },
    { title: getModuleLabel("pipeline"), url: "/admin/pipeline", icon: Target, moduleKey: "pipeline" },
    { title: getModuleLabel("messagerie"), url: "/admin/messagerie", icon: MessageSquare, badge: totalNonLus, moduleKey: "messagerie" },
    { title: getModuleLabel("facturation"), url: "/admin/facturation", icon: Receipt, moduleKey: "facturation" },
    { title: getModuleLabel("relances"), url: "/admin/relances", icon: Bell, moduleKey: "relances" },
    { title: getModuleLabel("emails"), url: "/admin/emails", icon: Mail, moduleKey: "emails" },
    { title: getModuleLabel("support"), url: "/admin/support", icon: LifeBuoy, badge: openTickets, moduleKey: "support" },
    { title: getModuleLabel("stock"), url: "/admin/stock", icon: Package, moduleKey: "stock" },
    { title: getModuleLabel("fournisseurs"), url: "/admin/fournisseurs", icon: Truck, moduleKey: "fournisseurs" },
    { title: getModuleLabel("analyse"), url: "/admin/analyse", icon: BarChart3, moduleKey: "analyse" },
    { title: getModuleLabel("taches"), url: "/admin/taches", icon: CheckSquare, moduleKey: "taches" },
    { title: getModuleLabel("agenda"), url: "/admin/agenda", icon: Calendar, moduleKey: "agenda" },
    { title: getModuleLabel("rapports"), url: "/admin/rapports", icon: FileText, moduleKey: "rapports" },
    { title: getModuleLabel("documents"), url: "/admin/documents", icon: FolderClosed, moduleKey: "documents" },
    { title: getModuleLabel("temps"), url: "/admin/temps", icon: Timer, moduleKey: "temps" },
    { title: getModuleLabel("automatisations"), url: "/admin/automatisations", icon: Zap, moduleKey: "automatisations" },
    { title: getModuleLabel("notes"), url: "/admin/notes", icon: StickyNote, moduleKey: "notes" },
    { title: getModuleLabel("ia"), url: "/admin/ia", icon: Bot, moduleKey: "ia" },
    { title: getModuleLabel("parametres"), url: "/admin/parametres", icon: Settings, moduleKey: "parametres" },
  ];

  const enabledItems = allNavItems
    .filter((item) => enabledModules.includes(item.moduleKey))
    .filter((item) => !isModuleHidden(item.moduleKey));
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

  const groupHasActive = (keys: string[]) =>
    navItems.some((item) => keys.includes(item.moduleKey) && isActive(item.url));

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    GROUPS.forEach((g) => { initial[g.label] = true; });
    return initial;
  });

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const renderItems = (items: typeof navItems) =>
    items.map((item) => {
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
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#22c55e] text-[10px] font-bold text-[#14532d] px-1">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="!bg-white !border-r !border-[#e4e8df]" style={{ boxShadow: "var(--shadow-sidebar)" }}>
      <SidebarHeader className="p-5 pb-4 border-b border-[#e4e8df]">
        <Link to="/admin" className="flex flex-col items-center text-center gap-1">
          {wl.logoUrl ? (
            <img src={wl.logoUrl} alt={wl.brandName} className="h-8 object-contain" />
          ) : (
            <img src={logoMba} alt="MBA" className="h-24 w-auto object-contain" />
          )}
          <p className="text-[11px] text-[#9ca3af]">
            {getSectorRoleLabel(demoSector, "admin") ? `Espace ${getSectorRoleLabel(demoSector, "admin")}` : wl.brandName}
          </p>
        </Link>
      </SidebarHeader>

      {/* Sector selector */}
      <div className="px-3 pb-2 pt-2">
        <select
          value={demoSector || ""}
          onChange={(e) => setDemoSector(e.target.value ? (e.target.value as SectorKey) : null)}
          className="w-full h-8 rounded-[var(--radius-md)] bg-[#f7f8f5] border border-[#e4e8df] px-2 text-xs text-[#4a5e46] focus:outline-none focus:ring-2 focus:ring-[#22c55e]/30 focus:border-[#22c55e]/40 truncate transition-colors"
        >
          <option value="">— Générique —</option>
          {SECTORS.map((s) => (
            <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
          ))}
        </select>
      </div>

      <SidebarContent ref={scrollRef} onScroll={handleScroll}>
        {GROUPS.map((group) => {
          const items = navItems.filter((item) => group.keys.includes(item.moduleKey));
          if (items.length === 0) return null;
          const GroupIcon = group.icon;
          const isOpen = openGroups[group.label] ?? true;

          return (
            <Collapsible key={group.label} open={isOpen} onOpenChange={() => toggleGroup(group.label)}>
              <SidebarGroup>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#9ca3af] flex items-center gap-1.5 cursor-pointer hover:text-[#4a5e46] transition-colors select-none px-5 py-3">
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

        {isEnterprise && spaces.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#9ca3af] flex items-center gap-1.5 px-5">
              <Sparkles className="h-3.5 w-3.5 text-[#22c55e]" />
              Espaces personnalisés
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {spaces.map((space) => (
                  <SidebarMenuItem key={space.id}>
                    <SidebarMenuButton tooltip={space.name}>
                      <span className="flex items-center gap-3 px-5 py-[9px] text-[#4a5e46] hover:text-[#14532d] transition-colors">
                        <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
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

      <SidebarFooter className="p-4 bg-[#f7f8f5] border-t border-[#e4e8df]">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-[#14532d] flex items-center justify-center text-sm font-extrabold text-[#22c55e]">
            {user?.nom?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate text-[#1a2318]">{user?.nom || "My Business Assistant"}</p>
            <p className="text-[11px] text-[#9ca3af] capitalize">{user?.role || "Admin"}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); supabase.auth.signOut(); navigate("/admin/access", { replace: true }); }}
          className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-[#9ca3af] hover:text-[#dc2626] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
