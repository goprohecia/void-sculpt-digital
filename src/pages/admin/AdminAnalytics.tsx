import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { donneesMensuelles, statsFactures, dossiers, clients } from "@/data/mockData";
import { Euro, TrendingUp, FolderOpen, Users, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Area,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs space-y-1 border border-border/50">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">
            {typeof entry.value === "number"
              ? entry.name.includes("%") || entry.name.includes("Conversion") || entry.name.includes("conversion")
                ? `${entry.value}%`
                : entry.value.toLocaleString() + (entry.name.includes("€") || entry.name.includes("CA") || entry.name.includes("Objectif") || entry.name.includes("Encaissements") || entry.name.includes("Panier") ? " €" : "")
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  const totalCA = donneesMensuelles.reduce((acc, d) => acc + d.caTotal, 0);
  const totalEncaissements = donneesMensuelles.reduce((acc, d) => acc + d.encaissements, 0);
  const totalDossiers = donneesMensuelles.reduce((acc, d) => acc + d.dossiers, 0);
  const totalNouveauxClients = donneesMensuelles.reduce((acc, d) => acc + d.nouveauxClients, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analyse
          </h1>
          <p className="text-muted-foreground text-sm">Données analytiques 2026</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardKPI
            title="CA total 2026"
            value={`${(totalCA / 1000).toFixed(0)}k €`}
            icon={Euro}
          />
          <DashboardKPI
            title="Encaissements"
            value={`${(totalEncaissements / 1000).toFixed(0)}k €`}
            icon={TrendingUp}
          />
          <DashboardKPI
            title="Nouveaux dossiers"
            value={totalDossiers}
            icon={FolderOpen}
          />
          <DashboardKPI
            title="Nouveaux clients"
            value={totalNouveauxClients}
            icon={Users}
          />
        </div>

        {/* Tendances Mensuelles Table */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">Tendances mensuelles 2026</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Mois</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Objectif</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">CA Total</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Encaissements</th>
                  <th className="text-center py-2 px-3 text-muted-foreground font-medium">Dossiers</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Panier moyen</th>
                </tr>
              </thead>
              <tbody>
                {donneesMensuelles.map((d) => (
                  <tr key={d.mois} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="py-2 px-3 font-medium">{d.mois}</td>
                    <td className="py-2 px-3 text-right text-muted-foreground">{d.objectif.toLocaleString()} €</td>
                    <td className="py-2 px-3 text-right font-medium"
                      style={{ color: d.caTotal >= d.objectif ? "hsl(155,100%,65%)" : "hsl(0,84%,70%)" }}
                    >
                      {d.caTotal.toLocaleString()} €
                    </td>
                    <td className="py-2 px-3 text-right">{d.encaissements.toLocaleString()} €</td>
                    <td className="py-2 px-3 text-center">{d.dossiers}</td>
                    <td className="py-2 px-3 text-right">{d.panierMoyen.toLocaleString()} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Évolution du CA */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">Évolution du chiffre d'affaires</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donneesMensuelles}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                <XAxis dataKey="mois" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(250, 10%, 55%)", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="objectif" name="Objectif" stroke="hsl(250, 10%, 45%)" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="caTotal" name="CA Total" stroke="hsl(265, 85%, 60%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(265, 85%, 60%)" }} />
                <Line type="monotone" dataKey="encaissements" name="Encaissements" stroke="hsl(155, 100%, 45%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(155, 100%, 45%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analyse quantitative des ventes */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">Analyse quantitative des ventes</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donneesMensuelles}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                <XAxis dataKey="mois" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="dossiers" name="Dossiers" fill="hsl(200, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Bar yAxisId="left" dataKey="panierMoyen" name="Panier moyen" fill="hsl(265, 85%, 60%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Bar yAxisId="right" dataKey="conversion" name="Conversion %" fill="hsl(155, 100%, 45%)" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution panier moyen et conversion */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">Évolution du panier moyen et taux de conversion</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={donneesMensuelles}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 15%, 20%)" />
                <XAxis dataKey="mois" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(250, 10%, 55%)", fontSize: 12 }} domain={[50, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area yAxisId="left" type="monotone" dataKey="panierMoyen" name="Panier moyen" fill="hsl(265, 85%, 60%)" fillOpacity={0.15} stroke="hsl(265, 85%, 60%)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="conversion" name="Conversion %" stroke="hsl(45, 93%, 55%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(45, 93%, 55%)" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
