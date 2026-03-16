import { useParams, Navigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCustomSpaces } from "@/hooks/use-custom-spaces";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAnalyticsData } from "@/hooks/use-analytics-data";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import { motion } from "framer-motion";
import {
  Sparkles, FolderOpen, Euro, Users, Receipt, MessageSquare,
  AlertTriangle, Package, Calendar, ArrowRight, ShieldCheck,
  TrendingUp
} from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";

// Demo data for preview
const DEMO_DOSSIERS = [
  { id: "1", reference: "DOS-2026-042", client_nom: "Marie Dupont", statut: "en_cours", type_prestation: "Robe de mariée", montant: 2800 },
  { id: "2", reference: "DOS-2026-043", client_nom: "Sophie Martin", statut: "en_attente", type_prestation: "Retouches", montant: 450 },
  { id: "3", reference: "DOS-2026-044", client_nom: "Julie Bernard", statut: "en_cours", type_prestation: "Accessoires", montant: 1200 },
];
const DEMO_FACTURES = [
  { id: "1", reference: "FAC-2026-018", client_nom: "Marie Dupont", montant: 2800, statut: "payee" },
  { id: "2", reference: "FAC-2026-019", client_nom: "Sophie Martin", montant: 450, statut: "en_attente" },
  { id: "3", reference: "FAC-2026-020", client_nom: "Julie Bernard", montant: 1200, statut: "en_retard" },
];
const DEMO_TICKETS = [
  { id: "1", reference: "TIC-042", sujet: "Question livraison", client_nom: "Marie Dupont", statut: "ouvert", priorite: "haute" },
  { id: "2", reference: "TIC-043", sujet: "Modification commande", client_nom: "Sophie Martin", statut: "en_cours", priorite: "moyenne" },
];

function has(modules: string[], key: string) {
  return modules.includes(key);
}

export default function AdminCustomSpace() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { spaces } = useCustomSpaces();
  const { getModuleLabel } = useDemoPlan();
  const { isDemo } = useIsDemo();

  const now = new Date();
  const range = { from: startOfMonth(now), to: endOfMonth(now) };
  const analytics = useAnalyticsData(range);

  const space = spaces.find((s) => s.id === spaceId);

  if (!space) {
    return <Navigate to="/admin" replace />;
  }

  const mods = space.enabled_modules;

  // Use analytics data or demo fallback
  const dossiers = isDemo ? DEMO_DOSSIERS : (analytics.dossiers ?? []);
  const factures = isDemo ? DEMO_FACTURES : (analytics.factures ?? []);
  const tickets = isDemo ? DEMO_TICKETS : (analytics.tickets ?? []);

  const dossiersOuverts = dossiers.filter((d: any) => d.statut !== "termine" && d.statut !== "archive").length;
  const caTotal = factures.filter((f: any) => f.statut === "payee").reduce((s: number, f: any) => s + Number(f.montant), 0);
  const facturesEnAttente = factures.filter((f: any) => f.statut === "en_attente" || f.statut === "en_retard").length;
  const ticketsOuverts = tickets.filter((t: any) => t.statut === "ouvert" || t.statut === "en_cours").length;

  // Determine which KPI cards to show
  const kpis: React.ReactNode[] = [];

  if (has(mods, "clients-dossiers") || has(mods, "dossiers") || has(mods, "overview")) {
    kpis.push(
      <DashboardKPI
        key="dossiers"
        title="Dossiers actifs"
        value={dossiersOuverts}
        icon={FolderOpen}
        iconColor="emerald"
        isHero={kpis.length === 0}
      />
    );
  }
  if (has(mods, "facturation") || has(mods, "overview")) {
    kpis.push(
      <DashboardKPI
        key="ca"
        title="CA encaissé"
        value={`${caTotal.toLocaleString("fr-FR")} €`}
        icon={Euro}
        iconColor="blue"
        isHero={kpis.length === 0}
      />
    );
  }
  if (has(mods, "relances") || has(mods, "facturation")) {
    kpis.push(
      <DashboardKPI
        key="factures"
        title="Factures en attente"
        value={facturesEnAttente}
        icon={Receipt}
        iconColor="amber"
      />
    );
  }
  if (has(mods, "support")) {
    kpis.push(
      <DashboardKPI
        key="tickets"
        title="Tickets ouverts"
        value={ticketsOuverts}
        icon={AlertTriangle}
        iconColor="rose"
      />
    );
  }
  if (has(mods, "messagerie") || has(mods, "messagerie-groupee")) {
    kpis.push(
      <DashboardKPI
        key="messages"
        title="Messages"
        value={isDemo ? 12 : 0}
        icon={MessageSquare}
        iconColor="violet"
      />
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{space.name}</h1>
              <p className="text-sm text-muted-foreground">
                Espace {space.base_role === "employee" ? "Salarié" : "Client"} · {mods.length} modules actifs
              </p>
            </div>
          </div>
          {space.role_id && (
            <Link to="/admin/parametres" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
              <ShieldCheck className="h-3.5 w-3.5" />
              Gérer les permissions
            </Link>
          )}
        </motion.div>

        {/* Module badges */}
        <div className="flex flex-wrap gap-1.5">
          {mods.map((mod) => (
            <Badge
              key={mod}
              variant="secondary"
              className="text-xs bg-primary/10 text-primary border-0"
            >
              {getModuleLabel(mod)}
            </Badge>
          ))}
        </div>

        {/* KPI Grid */}
        {kpis.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kpis}
          </div>
        )}

        {/* Data tables based on modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dossiers table */}
          {(has(mods, "clients-dossiers") || has(mods, "dossiers")) && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    Dossiers récents
                  </CardTitle>
                  <Link to="/admin/dossiers" className="text-xs text-primary hover:underline flex items-center gap-1">
                    Voir tout <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Réf.</TableHead>
                      <TableHead className="text-xs">Client</TableHead>
                      <TableHead className="text-xs">Statut</TableHead>
                      <TableHead className="text-xs text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dossiers.slice(0, 5).map((d: any) => (
                      <TableRow key={d.id}>
                        <TableCell className="text-xs font-mono">{d.reference}</TableCell>
                        <TableCell className="text-xs">{d.client_nom}</TableCell>
                        <TableCell><StatusBadge status={d.statut} /></TableCell>
                        <TableCell className="text-xs text-right font-medium">{Number(d.montant).toLocaleString("fr-FR")} €</TableCell>
                      </TableRow>
                    ))}
                    {dossiers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">Aucun dossier</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Factures table */}
          {(has(mods, "facturation") || has(mods, "relances")) && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    Factures récentes
                  </CardTitle>
                  <Link to="/admin/facturation" className="text-xs text-primary hover:underline flex items-center gap-1">
                    Voir tout <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Réf.</TableHead>
                      <TableHead className="text-xs">Client</TableHead>
                      <TableHead className="text-xs">Statut</TableHead>
                      <TableHead className="text-xs text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {factures.slice(0, 5).map((f: any) => (
                      <TableRow key={f.id}>
                        <TableCell className="text-xs font-mono">{f.reference}</TableCell>
                        <TableCell className="text-xs">{f.client_nom}</TableCell>
                        <TableCell><StatusBadge status={f.statut} /></TableCell>
                        <TableCell className="text-xs text-right font-medium">{Number(f.montant).toLocaleString("fr-FR")} €</TableCell>
                      </TableRow>
                    ))}
                    {factures.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">Aucune facture</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Support tickets */}
          {has(mods, "support") && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    Tickets support
                  </CardTitle>
                  <Link to="/admin/support" className="text-xs text-primary hover:underline flex items-center gap-1">
                    Voir tout <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Réf.</TableHead>
                      <TableHead className="text-xs">Sujet</TableHead>
                      <TableHead className="text-xs">Priorité</TableHead>
                      <TableHead className="text-xs">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.slice(0, 5).map((t: any) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-xs font-mono">{t.reference}</TableCell>
                        <TableCell className="text-xs">{t.sujet}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${t.priorite === "haute" ? "border-destructive text-destructive" : "border-muted-foreground text-muted-foreground"}`}>
                            {t.priorite}
                          </Badge>
                        </TableCell>
                        <TableCell><StatusBadge status={t.statut} /></TableCell>
                      </TableRow>
                    ))}
                    {tickets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">Aucun ticket</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Quick actions for other modules */}
          {(has(mods, "agenda") || has(mods, "rendez-vous") || has(mods, "messagerie") || has(mods, "notes") || has(mods, "stock")) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Accès rapide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(has(mods, "agenda") || has(mods, "rendez-vous")) && (
                  <Link to="/admin/calendrier" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{getModuleLabel(has(mods, "agenda") ? "agenda" : "rendez-vous")}</p>
                      <p className="text-xs text-muted-foreground">Gérer le planning</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Link>
                )}
                {has(mods, "messagerie") && (
                  <Link to="/admin/messagerie" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Messagerie</p>
                      <p className="text-xs text-muted-foreground">Conversations clients</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Link>
                )}
                {has(mods, "stock") && (
                  <Link to="/admin/stock" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Package className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Stock</p>
                      <p className="text-xs text-muted-foreground">Gestion des produits</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Link>
                )}
                {has(mods, "notes") && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-xs text-muted-foreground">Notes internes de l'espace</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Empty state if no data modules */}
        {kpis.length === 0 && !has(mods, "clients-dossiers") && !has(mods, "dossiers") && !has(mods, "facturation") && !has(mods, "support") && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-medium">Cet espace est configuré</p>
              <p className="text-sm mt-1">Utilisez les accès rapides ci-dessus pour naviguer vers les modules activés.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
