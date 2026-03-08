import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Building2, TrendingUp, Users, CreditCard } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const MOCK_KPIS = [
  { label: "Entreprises actives", value: "47", icon: Building2, change: "+5 ce mois", color: "text-primary" },
  { label: "MRR", value: "14 350€", icon: TrendingUp, change: "+12%", color: "text-emerald-400" },
  { label: "Utilisateurs totaux", value: "312", icon: Users, change: "+23", color: "text-neon-blue" },
  { label: "Taux de churn", value: "2.1%", icon: CreditCard, change: "-0.3%", color: "text-amber-400" },
];

const MONTHLY_DATA = [
  { mois: "Oct", inscrits: 5, churn: 1, mrr: 10200 },
  { mois: "Nov", inscrits: 7, churn: 0, mrr: 11450 },
  { mois: "Déc", inscrits: 4, churn: 2, mrr: 11850 },
  { mois: "Jan", inscrits: 8, churn: 1, mrr: 12800 },
  { mois: "Fév", inscrits: 6, churn: 1, mrr: 13500 },
  { mois: "Mar", inscrits: 9, churn: 0, mrr: 14350 },
];

const MOCK_ENTERPRISES = [
  { nom: "TechVision SAS", plan: "enterprise", users: 12, mrr: 400, statut: "actif", date: "2025-09-15" },
  { nom: "Studio Créatif", plan: "business", users: 5, mrr: 250, statut: "actif", date: "2025-11-02" },
  { nom: "BTP Renov", plan: "starter", users: 2, mrr: 150, statut: "actif", date: "2026-01-10" },
  { nom: "Immo+", plan: "business", users: 8, mrr: 250, statut: "actif", date: "2025-10-20" },
  { nom: "CleanPro", plan: "enterprise", users: 15, mrr: 400, statut: "actif", date: "2025-08-05" },
  { nom: "DigitalCraft", plan: "starter", users: 1, mrr: 150, statut: "essai", date: "2026-02-28" },
];

const planColors: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  business: "bg-neon-blue/10 text-neon-blue",
  enterprise: "bg-amber-500/10 text-amber-400",
};

const mrrChartConfig = {
  mrr: { label: "MRR (€)", color: "hsl(var(--primary))" },
};

const inscritsChartConfig = {
  inscrits: { label: "Inscriptions", color: "hsl(142, 71%, 45%)" },
  churn: { label: "Churns", color: "hsl(var(--destructive))" },
};

export default function SuperAdminDashboard() {
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard MBA</h1>
          <p className="text-muted-foreground text-sm">Vue d'ensemble de l'activité globale</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_KPIS.map((kpi) => (
            <Card key={kpi.label} className="glass-card border-white/10">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  <span className="text-xs text-emerald-400">{kpi.change}</span>
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Évolution du MRR</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={mrrChartConfig} className="h-[220px] w-full">
                <AreaChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" fill="url(#mrrGradient)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Inscriptions vs Churns</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={inscritsChartConfig} className="h-[220px] w-full">
                <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="inscrits" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="churn" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Répartition par plan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {(["starter", "business", "enterprise"] as const).map((plan) => {
            const count = MOCK_ENTERPRISES.filter((e) => e.plan === plan).length;
            const labels = { starter: "Starter", business: "Business", enterprise: "Enterprise" };
            return (
              <Card key={plan} className="glass-card border-white/10">
                <CardContent className="p-5 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${planColors[plan]}`}>
                    {labels[plan]}
                  </span>
                  <p className="text-3xl font-bold mt-3">{count}</p>
                  <p className="text-xs text-muted-foreground">entreprises</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Liste des entreprises */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Dernières entreprises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Entreprise</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Plan</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Utilisateurs</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">MRR</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ENTERPRISES.map((e, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-medium">{e.nom}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[e.plan]}`}>
                          {e.plan}
                        </span>
                      </td>
                      <td className="py-3 text-center">{e.users}</td>
                      <td className="py-3 text-right">{e.mrr}€</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${e.statut === "actif" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {e.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
