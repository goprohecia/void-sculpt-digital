import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, LifeBuoy, Settings, FolderOpen, Receipt, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type NavVariant = "admin" | "client" | "employee" | "superadmin";

interface MobileBottomNavProps {
  variant: NavVariant;
}

const navItems: Record<NavVariant, { label: string; icon: React.ElementType; path: string }[]> = {
  admin: [
    { label: "Accueil", icon: LayoutDashboard, path: "/admin" },
    { label: "Clients", icon: Users, path: "/admin/clients" },
    { label: "Dossiers", icon: FolderOpen, path: "/admin/dossiers" },
    { label: "Messages", icon: MessageSquare, path: "/admin/messagerie" },
    { label: "Réglages", icon: Settings, path: "/admin/parametres" },
  ],
  client: [
    { label: "Accueil", icon: LayoutDashboard, path: "/client/dashboard" },
    { label: "Dossiers", icon: FolderOpen, path: "/client/dossiers" },
    { label: "Factures", icon: Receipt, path: "/client/factures" },
    { label: "Messages", icon: MessageSquare, path: "/client/messagerie" },
    { label: "Support", icon: LifeBuoy, path: "/client/support" },
  ],
  employee: [
    { label: "Accueil", icon: LayoutDashboard, path: "/employee/dashboard" },
    { label: "Clients", icon: Users, path: "/employee/clients" },
    { label: "Dossiers", icon: FolderOpen, path: "/employee/dossiers" },
    { label: "Messages", icon: MessageSquare, path: "/employee/messagerie" },
    { label: "Support", icon: LifeBuoy, path: "/employee/support" },
  ],
  superadmin: [
    { label: "Accueil", icon: LayoutDashboard, path: "/superadmin" },
    { label: "Entreprises", icon: Users, path: "/superadmin/entreprises" },
    { label: "Formules", icon: Receipt, path: "/superadmin/formules" },
    { label: "Secteurs", icon: FolderOpen, path: "/superadmin/secteurs" },
    { label: "Stats", icon: Settings, path: "/superadmin/stats" },
  ],
};

export function MobileBottomNav({ variant }: MobileBottomNavProps) {
  const location = useLocation();
  const items = navItems[variant];

  const isActive = (path: string) => {
    if (path === "/admin" || path === "/superadmin") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e4e8df] shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-2 transition-colors touch-manipulation",
                active ? "text-[#22c55e]" : "text-[#9ca3af]"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              <span className={cn("text-[10px] leading-tight", active && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
