import { useState, useMemo } from "react";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Building2, TrendingUp, Users, CreditCard, DollarSign, ArrowDownRight, ArrowUpRight, Percent, BarChart3 } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { SECTORS } from "@/contexts/DemoPlanContext";

type Period = "6m" | "12m" | "annee";

const ALL_MONTHLY_DATA = [
  { mois: "Avr", inscrits: 3, churn: 1, mrr: 6800, arr: 81600, churnRate: 3.5, revenue: 6800, depenses: 2800 },
  { mois: "Mai", inscrits: 4, churn: 0, mrr: 7500, arr: 90000, churnRate: 3.2, revenue: 7500, depenses: 3000 },
  { mois: "Juin", inscrits: 5, churn: 1, mrr: 8200, arr: 98400, churnRate: 3.0, revenue: 8200, depenses: 3200 },
  { mois: "Juil", inscrits: 3, churn: 0, mrr: 8800, arr: 105600, churnRate: 2.9, revenue: 8800, depenses: 3400 },
  { mois: "Août", inscrits: 6, churn: 2, mrr: 9200, arr: 110400, churnRate: 3.3, revenue: 9200, depenses: 3600 },
  { mois: "Sep", inscrits: 4, churn: 1, mrr: 9700, arr: 116400, churnRate: 3.0, revenue: 9700, depenses: 3800 },
  { mois: "Oct", inscrits: 5, churn: 1, mrr: 10200, arr: 122400, churnRate: 2.8, revenue: 10200, depenses: 4100 },
  { mois: "Nov", inscrits: 7, churn: 0, mrr: 11450, arr: 137400, churnRate: 2.4, revenue: 11450, depenses: 4300 },
  { mois: "Déc", inscrits: 4, churn: 2, mrr: 11850, arr: 142200, churnRate: 3.1, revenue: 11850, depenses: 4500 },
  { mois: "Jan", inscrits: 8, churn: 1, mrr: 12800, arr: 153600, churnRate: 2.5, revenue: 12800, depenses: 4700 },
  { mois: "Fév", inscrits: 6, churn: 1, mrr: 13500, arr: 162000, churnRate: 2.3, revenue: 13500, depenses: 4900 },
  { mois: "Mar", inscrits: 9, churn: 0, mrr: 14350, arr: 172200, churnRate: 2.1, revenue: 14350, depenses: 5100 },
];

const PLAN_DISTRIBUTION = [
  { name: "Starter", value: 18, fill: "hsl(var(--muted-foreground))" },
  { name: "Business", value: 17, fill: "hsl(var(--neon-blue, 217 91% 60%))" },
  { name: "Enterprise", value: 12, fill: "hsl(45, 93%, 58%)" },
];

const MOCK_ENTERPRISES = [
  { nom: "TechVision SAS", plan: "enterprise", users: 12, mrr: 400, statut: "actif", date: "2025-09-15", sector: "developpeur" },
  { nom: "Studio Créatif", plan: "business", users: 5, mrr: 250, statut: "actif", date: "2025-11-02", sector: "designer" },
  { nom: "BTP Renov", plan: "starter", users: 2, mrr: 150, statut: "actif", date: "2026-01-10", sector: "btp" },
  { nom: "Immo+", plan: "business", users: 8, mrr: 250, statut: "actif", date: "2025-10-20", sector: "immobilier" },
  { nom: "CleanPro", plan: "enterprise", users: 15, mrr: 400, statut: "actif", date: "2025-08-05", sector: "nettoyage" },
  { nom: "DigitalCraft", plan: "starter", users: 1, mrr: 150, statut: "essai", date: "2026-02-28", sector: "community-manager" },
  { nom: "EventPro", plan: "business", users: 4, mrr: 250, statut: "actif", date: "2026-01-15", sector: "evenementiel" },
  { nom: "CoachFit", plan: "starter", users: 1, mrr: 150, statut: "actif", date: "2026-02-01", sector: "coach-sportif" },
  { nom: "SnapStudio", plan: "business", users: 3, mrr: 250, statut: "actif", date: "2025-12-10", sector: "photographe" },
  { nom: "GarageExpert", plan: "enterprise", users: 10, mrr: 400, statut: "actif", date: "2025-07-20", sector: "garages" },
  { nom: "FormaPlus", plan: "business", users: 2, mrr: 250, statut: "actif", date: "2025-11-15", sector: "formateur" },
  { nom: "ConciergeVIP", plan: "starter", users: 1, mrr: 150, statut: "actif", date: "2026-01-20", sector: "conciergerie" },
  { nom: "ConsultPro", plan: "business", users: 3, mrr: 250, statut: "actif", date: "2025-10-05", sector: "consultant" },
  { nom: "WedDream", plan: "enterprise", users: 6, mrr: 400, statut: "actif", date: "2025-09-01", sector: "mariage" },
  { nom: "TraiteurSaveur", plan: "starter", users: 2, mrr: 150, statut: "actif", date: "2026-02-15", sector: "traiteur" },
  { nom: "RepairMobile", plan: "starter", users: 1, mrr: 150, statut: "actif", date: "2026-03-01", sector: "reparateur" },
  { nom: "DJ Max", plan: "business", users: 1, mrr: 250, statut: "actif", date: "2025-12-20", sector: "dj-animateur" },
  { nom: "SalonGlam", plan: "business", users: 4, mrr: 250, statut: "actif", date: "2025-11-25", sector: "coiffure" },
  { nom: "CabinetDroit", plan: "enterprise", users: 7, mrr: 400, statut: "actif", date: "2025-08-15", sector: "cabinets" },
  { nom: "ShopTrend", plan: "starter", users: 2, mrr: 150, statut: "actif", date: "2026-01-05", sector: "boutique" },
];

const planColors: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  business: "bg-neon-blue/10 text-neon-blue",
  enterprise: "bg-amber-500/10 text-amber-400",
};

const MOCK_KPIS = [
  { label: "MRR", value: "14 350€", icon: DollarSign, change: "+6.3%", positive: true, color: "text-primary" },
  { label: "ARR", value: "172 200€", icon: TrendingUp, change: "+6.3%", positive: true, color: "text-emerald-400" },
  { label: "Taux de churn", value: "2.1%", icon: ArrowDownRight, change: "-0.2%", positive: true, color: "text-amber-400" },
  { label: "Entreprises actives", value: "47", icon: Building2, change: "+5", positive: true, color: "text-neon-blue" },
  { label: "Utilisateurs totaux", value: "312", icon: Users, change: "+23", positive: true, color: "text-primary" },
  { label: "ARPU", value: "305€", icon: CreditCard, change: "+4%", positive: true, color: "text-emerald-400" },
  { label: "Net Revenue", value: "9 250€", icon: Percent, change: "+8%", positive: true, color: "text-amber-400" },
  { label: "LTV moyen", value: "7 320€", icon: DollarSign, change: "+12%", positive: true, color: "text-neon-blue" },
];

const mrrChartConfig = { mrr: { label: "MRR (€)", color: "hsl(var(--primary))" } };
const arrChartConfig = { arr: { label: "ARR (€)", color: "hsl(142, 71%, 45%)" } };
const churnChartConfig = { churnRate: { label: "Churn (%)", color: "hsl(45, 93%, 58%)" } };
const revenueChartConfig = { revenue: { label: "Revenus (€)", color: "hsl(var(--primary))" }, depenses: { label: "Dépenses (€)", color: "hsl(var(--destructive))" } };
const inscritsChartConfig = { inscrits: { label: "Inscriptions", color: "hsl(142, 71%, 45%)" }, churn: { label: "Churns", color: "hsl(var(--destructive))" } };

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "6m", label: "6 mois" },
  { value: "12m", label: "12 mois" },
  { value: "annee", label: "Année" },
];

function PeriodFilter({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/30 p-0.5">
      {PERIOD_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
            value === opt.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [period, setPeriod] = useState<Period>("6m");

  const filteredData = useMemo(() => {
    switch (period) {
      case "6m": return ALL_MONTHLY_DATA.slice(-6);
      case "12m": return ALL_MONTHLY_DATA;
      case "annee": return ALL_MONTHLY_DATA; // same data, would be calendar year in production
      default: return ALL_MONTHLY_DATA.slice(-6);
    }
  }, [period]);

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Dashboard MBA</h1>
            <p className="text-muted-foreground text-sm">Vue d'ensemble de l'activité globale et des revenus</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MOCK_KPIS.map((kpi) => (
            <Card key={kpi.label} className="glass-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  <span className={`text-[10px] font-medium flex items-center gap-0.5 ${kpi.positive ? "text-emerald-400" : "text-destructive"}`}>
                    {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MRR + ARR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Évolution du MRR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={mrrChartConfig} className="h-[220px] w-full">
                <AreaChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
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
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Évolution de l'ARR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={arrChartConfig} className="h-[220px] w-full">
                <AreaChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="arr" stroke="hsl(142, 71%, 45%)" fill="url(#arrGradient)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Churn + Revenue vs Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-amber-400" />
                Taux de churn mensuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={churnChartConfig} className="h-[220px] w-full">
                <LineChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" tickFormatter={(v) => `${v}%`} domain={[0, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="churnRate" stroke="hsl(45, 93%, 58%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(45, 93%, 58%)" }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                Revenus vs Dépenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueChartConfig} className="h-[220px] w-full">
                <BarChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="depenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Inscriptions + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="glass-card border-white/10 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Inscriptions vs Churns</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={inscritsChartConfig} className="h-[220px] w-full">
                <BarChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
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

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Répartition par plan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={PLAN_DISTRIBUTION} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {PLAN_DISTRIBUTION.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                {PLAN_DISTRIBUTION.map((p) => (
                  <div key={p.name} className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
                    <span className="text-muted-foreground">{p.name}</span>
                    <span className="font-medium">{p.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytiques par secteur */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top secteurs par MRR */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Top secteurs par MRR
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const sectorMrr = MOCK_ENTERPRISES.reduce((acc, e) => {
                  const s = SECTORS.find(s => s.key === e.sector);
                  const label = s ? `${s.icon} ${s.label}` : e.sector;
                  acc[label] = (acc[label] || 0) + e.mrr;
                  return acc;
                }, {} as Record<string, number>);
                const data = Object.entries(sectorMrr)
                  .map(([name, mrr]) => ({ name, mrr }))
                  .sort((a, b) => b.mrr - a.mrr)
                  .slice(0, 8);
                return (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis type="number" tick={{ fontSize: 11 }} className="fill-muted-foreground" tickFormatter={(v) => `${v}€`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" width={130} />
                      <Tooltip formatter={(v: number) => [`${v}€`, "MRR"]} />
                      <Bar dataKey="mrr" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </CardContent>
          </Card>

          {/* Répartition secteurs par plan (stacked) */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-neon-blue" />
                Secteurs par plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const sectorPlan: Record<string, { name: string; starter: number; business: number; enterprise: number }> = {};
                MOCK_ENTERPRISES.forEach((e) => {
                  const s = SECTORS.find(s => s.key === e.sector);
                  const label = s ? s.label : e.sector;
                  if (!sectorPlan[label]) sectorPlan[label] = { name: label, starter: 0, business: 0, enterprise: 0 };
                  sectorPlan[label][e.plan as "starter" | "business" | "enterprise"] += 1;
                });
                const data = Object.values(sectorPlan).sort((a, b) => (b.starter + b.business + b.enterprise) - (a.starter + a.business + a.enterprise)).slice(0, 8);
                return (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} className="fill-muted-foreground" angle={-30} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" allowDecimals={false} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="starter" stackId="a" fill="hsl(var(--muted-foreground))" name="Starter" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="business" stackId="a" fill="hsl(217, 91%, 60%)" name="Business" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="enterprise" stackId="a" fill="hsl(45, 93%, 58%)" name="Enterprise" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </CardContent>
          </Card>
        </div>

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
