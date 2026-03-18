import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

// Module-level: survives component unmount/remount
let _savedScrollTop = 0;
import { supabase } from "@/integrations/supabase/client";
import { SECTORS, type SectorKey, DEFAULT_PLAN_MODULES } from "@/contexts/DemoPlanContext";
import { getSectorRoleLabel } from "@/data/sectorModules";
import {
  LayoutDashboard, Users, FolderOpen, MessageSquare, Receipt, Bell, Mail,
  BarChart3, LifeBuoy, Settings, LogOut, CalendarDays, Package, CheckSquare,
  Calendar, FileText, FolderClosed, Timer, Zap, StickyNote, Target, Bot,
  Building2, Briefcase, Wrench, ClipboardList, ChevronDown, Truck, ArrowUpRight,
  Lock,
} from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useConversations } from "@/hooks/use-conversations";
import { useTickets } from "@/hooks/use-tickets";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useCustomSpaces } from "@/hooks/use-custom-spaces";
import { useSubscription, PLAN_INFO, SOCLE_FIXE } from "@/hooks/use-subscription";
import { useWhiteLabel } from "@/hooks/use-white-label";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { Sparkles } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarSeparator,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import logoMba from "@/assets/logo-mba.png";

const principalKeys = ["overview", "clients-dossiers", "employees"];
const commercialKeys = ["pipeline", "dossiers", "facturation", "relances", "stock", "fournisseurs"];
const outilsKeys = ["messagerie", "emails", "rendez-vous", "agenda", "taches", "support", "notes"];
const gestionKeys = ["analyse", "rapports", "documents", "temps", "automatisations", "ia", "parametres"];

type GroupConfig = { label: string; icon: LucideIcon; keys: string[] };

const GROUPS: GroupConfig[] = [
  { label: "Principal", icon: Building2, keys: principalKeys },
  { label: "Commercial", icon: Briefcase, keys: commercialKeys },
  { label: "Outils", icon: Wrench, keys: outilsKeys },
  { label: "Gestion", icon: ClipboardList, keys: gestionKeys },
];

const MODULE_DESCRIPTIONS: Record<string, string> = {
  "overview": "Tableau de bord avec vue d'ensemble de votre activité.",
  "clients-dossiers": "Gérez vos clients et leurs dossiers en un seul endroit.",
  "employees": "Gérez votre équipe, rôles et permissions.",
  "pipeline": "Suivez vos opportunités commerciales étape par étape.",
  "dossiers": "Gérez et suivez tous vos dossiers en cours.",
  "demandes": "Consultez et traitez les demandes de vos clients.",
  "facturation": "Créez et gérez vos factures et devis.",
  "relances": "Automatisez le suivi de vos impayés.",
  "stock": "Gérez votre inventaire et vos produits.",
  "fournisseurs": "Suivez vos fournisseurs et bons de commande.",
  "messagerie": "Communiquez avec vos clients en temps réel.",
  "emails": "Envoyez des campagnes email et suivez les résultats.",
  "rendez-vous": "Planifiez et gérez vos rendez-vous clients.",
  "agenda": "Vue calendrier de toutes vos activités.",
  "taches": "Organisez et suivez vos tâches quotidiennes.",
  "support": "Gérez les tickets de support de vos clients.",
  "notes": "Prenez des notes liées à vos projets et clients.",
  "analyse": "Visualisez vos KPIs et tendances clés.",
  "rapports": "Générez des rapports détaillés sur votre activité.",
  "documents": "Stockez et organisez vos documents importants.",
  "temps": "Suivez le temps passé sur chaque projet.",
  "automatisations": "Automatisez vos processus métier répétitifs.",
  "ia": "Exploitez l'intelligence artificielle pour votre business.",
  "parametres": "Configurez votre espace et vos préférences.",
};

function getRequiredPlan(moduleKey: string): "business" | "enterprise" {
  const businessModules = DEFAULT_PLAN_MODULES.business;
  if (Array.isArray(businessModules) && businessModules.includes(moduleKey)) {
    return "business";
  }
  return "enterprise";
}

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDemoAuth();
  const { conversations } = useConversations();
  const { tickets } = useTickets();
  const { enabledModules } = useAppSettings();
  const { spaces } = useCustomSpaces();
  const { isEnterprise, isBusiness, plan, currentPlanModules } = useSubscription();
  const { config: wl } = useWhiteLabel();
  const { getModuleLabel, isModuleHidden, demoSector, setDemoSector } = useDemoPlan();

  const [upsellModule, setUpsellModule] = useState<string | null>(null);

  const totalNonLus = conversations.reduce((sum, c) => sum + (c.nonLus || 0), 0);
  const openTickets = tickets.filter((t) => t.statut === "ouvert" || t.statut === "en_cours").length;

  const allNavItems = [
    { title: getModuleLabel("overview"), url: "/admin", icon: LayoutDashboard, moduleKey: "overview" },
    { title: getModuleLabel("clients-dossiers"), url: "/admin/clients", icon: Users, moduleKey: "clients-dossiers" },
    { title: getModuleLabel("employees"), url: "/admin/employees", icon: Users, moduleKey: "employees" },
    { title: getModuleLabel("rendez-vous"), url: "/admin/rendez-vous", icon: CalendarDays, moduleKey: "rendez-vous" },
    { title: getModuleLabel("pipeline"), url: "/admin/pipeline", icon: Target, moduleKey: "pipeline" },
    { title: "Dossiers", url: "/admin/dossiers", icon: FolderOpen, moduleKey: "dossiers" },
    { title: "Demandes", url: "/admin/demandes", icon: FileText, moduleKey: "demandes" },
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

  // All enabled items (settings + sector visibility)
  const enabledItems = allNavItems
    .filter((item) => enabledModules.includes(item.moduleKey))
    .filter((item) => !isModuleHidden(item.moduleKey));

  const planModules = currentPlanModules[plan];

  // Determine which items are active vs locked
  const isModuleInPlan = (moduleKey: string) => {
    if (planModules === "all") return true;
    return SOCLE_FIXE.includes(moduleKey) || planModules.includes(moduleKey);
  };

  const activeItems = enabledItems.filter((item) => isModuleInPlan(item.moduleKey));
  const lockedItems = enabledItems.filter((item) => !isModuleInPlan(item.moduleKey));
  const lockedKeys = new Set(lockedItems.map((i) => i.moduleKey));

  // Combined: active first, locked after, within each group
  const orderedItems = [...activeItems, ...lockedItems];

  const isActive = (url: string) => {
    if (url === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(url);
  };

  const groupHasActive = (keys: string[]) =>
    orderedItems.some((item) => keys.includes(item.moduleKey) && isActive(item.url));

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    GROUPS.forEach((g) => { initial[g.label] = true; });
    return initial;
  });

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  // Preserve sidebar scroll position across navigations (module-level backup)
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    _savedScrollTop = e.currentTarget.scrollTop;
  }, []);

  // Restore scroll after remount
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = _savedScrollTop;
    }
  });

  const renderItems = (items: typeof orderedItems) =>
    items.map((item) => {
      const locked = lockedKeys.has(item.moduleKey);
      const active = !locked && isActive(item.url);

      if (locked) {
        const requiredPlan = getRequiredPlan(item.moduleKey);
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title}>
              <button
                type="button"
                onClick={() => setUpsellModule(item.moduleKey)}
                className="flex items-center gap-3 py-[9px] px-5 w-full border-l-[3px] border-l-transparent opacity-[0.45] cursor-pointer hover:opacity-60 transition-all duration-[120ms] text-[#4a5e46]"
              >
                <item.icon className="h-[18px] w-[18px] opacity-65" />
                <span className="flex-1 text-left">{item.title}</span>
                <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${
                  requiredPlan === "business"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {requiredPlan === "business" ? "Business" : "Enterprise"}
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
            <Link
              to={item.url}
              className={`flex items-center gap-3 py-[9px] px-5 border-l-[3px] transition-all duration-[120ms] ${
                active
                  ? "bg-[#14532d] text-white font-bold border-l-[#22c55e] rounded-r-[var(--radius-sm)] mr-2 shadow-[0_2px_8px_rgba(20,83,45,0.25)]"
                  : "text-[#4a5e46] border-l-transparent hover:bg-[#14532d]/80 hover:text-white"
              }`}
            >
              <item.icon className={`h-[18px] w-[18px] ${active ? "text-[#22c55e]" : "opacity-65"}`} />
              <span className={`flex-1 ${active ? "!text-white" : ""}`}>{item.title}</span>
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

  // Upsell dialog data
  const upsellPlan = upsellModule ? getRequiredPlan(upsellModule) : "business";
  const upsellLabel = upsellModule ? getModuleLabel(upsellModule) : "";
  const upsellDesc = upsellModule ? (MODULE_DESCRIPTIONS[upsellModule] || "") : "";

  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon" className="!bg-[#F6F5F2] !border-r !border-[#e4e8df]" style={{ boxShadow: "var(--shadow-sidebar)" }}>
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
            // Get items for this group in order: active first, locked after
            const groupActive = activeItems.filter((item) => group.keys.includes(item.moduleKey));
            const groupLocked = lockedItems.filter((item) => group.keys.includes(item.moduleKey));
            const items = [...groupActive, ...groupLocked];
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

          {(isEnterprise || isBusiness) && spaces.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#9ca3af] flex items-center gap-1.5 px-5">
                <Sparkles className="h-3.5 w-3.5 text-[#22c55e]" />
                Espaces personnalisés
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {spaces.map((space) => (
                    <SidebarMenuItem key={space.id}>
                      <SidebarMenuButton tooltip={space.name} asChild>
                        <Link to={`/admin/espace/${space.id}`} className="flex items-center gap-3 px-5 py-[9px] text-[#4a5e46] hover:bg-[#14532d]/80 hover:!text-white transition-colors">
                          <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                          <span>{space.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="p-4 bg-[#f7f8f5] border-t border-[#e4e8df]">
          {/* Plan badge */}
          <div className="mb-3 flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
              plan === "enterprise"
                ? "bg-amber-100 text-amber-700"
                : plan === "business"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                plan === "enterprise" ? "bg-amber-500" : plan === "business" ? "bg-blue-500" : "bg-gray-400"
              }`} />
              Offre {PLAN_INFO[plan]?.label || plan}
            </span>
            {plan !== "enterprise" && (
              <Link
                to="/admin/upgrade"
                className="text-[11px] font-medium text-primary hover:underline flex items-center gap-0.5"
              >
                Upgrader <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}
          </div>
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
            onClick={() => { logout(); supabase.auth.signOut(); navigate("/client/login", { replace: true }); }}
            className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-[#9ca3af] hover:text-[#dc2626] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* Upsell Dialog */}
      <Dialog open={!!upsellModule} onOpenChange={(open) => { if (!open) setUpsellModule(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              {upsellLabel}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {upsellDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <p className="text-sm text-foreground">
              Ce module est disponible à partir de l'offre{" "}
              <span className={`font-semibold ${upsellPlan === "business" ? "text-amber-700" : "text-purple-700"}`}>
                {upsellPlan === "business" ? "Business" : "Enterprise"}
              </span>.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setUpsellModule(null)}>
              Fermer
            </Button>
            <Button onClick={() => { setUpsellModule(null); navigate("/admin/upgrade"); }}>
              Voir les offres
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}