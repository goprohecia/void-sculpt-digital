import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Euro, FolderOpen, Users, Receipt, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  dossiers,
  clients,
  factures,
  activites,
  donneesMensuelles,
  statsFactures,
  totalNonLus,
} from "@/data/mockData";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const dossiersActifs = dossiers.filter((d) => d.statut === "en_cours").length;
  const nouveauxClients = clients.filter((c) => c.dateCreation >= "2026-02-01").length;
  const facturesEnAttente = factures.filter((f) => f.statut === "en_attente").length;
  const caFevrier = donneesMensuelles[1]?.caTotal || 0;

  const sparklineData = donneesMensuelles.slice(0, 6).map((d) => ({ ca: d.caTotal }));

  const dossiersRecents = dossiers.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
          <p className="text-muted-foreground text-sm">Tableau de bord de l'activité</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardKPI
            title="Chiffre d'affaires"
            value={`${(caFevrier / 1000).toFixed(1)}k €`}
            icon={Euro}
            trend={{ value: 23.5, label: "vs jan." }}
          />
          <DashboardKPI
            title="Dossiers actifs"
            value={dossiersActifs}
            icon={FolderOpen}
            trend={{ value: 12, label: "vs jan." }}
          />
          <DashboardKPI
            title="Nouveaux clients"
            value={nouveauxClients}
            icon={Users}
            trend={{ value: 50, label: "vs jan." }}
          />
          <DashboardKPI
            title="Factures en attente"
            value={facturesEnAttente}
            icon={Receipt}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sparkline CA */}
          <div className="glass-card p-6 lg:col-span-1">
            <h3 className="text-sm font-semibold mb-2">Tendance CA</h3>
            <p className="text-xs text-muted-foreground mb-4">Janvier – Juin 2026</p>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient id="caGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(265, 85%, 60%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(265, 85%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="ca"
                    stroke="hsl(265, 85%, 60%)"
                    fill="url(#caGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activités récentes */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Activités récentes</h3>
              <span className="text-xs text-muted-foreground">{activites.length} activités</span>
            </div>
            <div className="space-y-3">
              {activites.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 rounded-full shrink-0" style={{
                    backgroundColor: a.type === "dossier" ? "hsl(200,100%,50%)" :
                      a.type === "client" ? "hsl(155,100%,45%)" :
                      a.type === "facture" ? "hsl(45,93%,55%)" :
                      a.type === "message" ? "hsl(265,85%,60%)" :
                      "hsl(0,84%,60%)"
                  }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate">{a.description}</p>
                    <p className="text-xs text-muted-foreground">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dossiers récents */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Dossiers récents</h3>
            <Link to="/admin/dossiers" className="text-xs text-primary hover:underline flex items-center gap-1">
              Voir tous <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Référence</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Client</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">Prestation</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Montant</th>
                  <th className="text-center py-2 px-3 text-muted-foreground font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {dossiersRecents.map((d) => (
                  <tr key={d.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-xs">{d.reference}</td>
                    <td className="py-2.5 px-3">{d.clientNom}</td>
                    <td className="py-2.5 px-3 hidden md:table-cell text-muted-foreground">{d.typePrestation}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{d.montant.toLocaleString()} €</td>
                    <td className="py-2.5 px-3 text-center"><StatusBadge status={d.statut} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Messages non lus */}
        {totalNonLus > 0 && (
          <Link to="/admin/messagerie" className="glass-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors block">
            <div className="rounded-xl bg-primary/10 p-2">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{totalNonLus} message{totalNonLus > 1 ? "s" : ""} non lu{totalNonLus > 1 ? "s" : ""}</p>
              <p className="text-xs text-muted-foreground">Consultez votre messagerie</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
      </div>
    </AdminLayout>
  );
}
