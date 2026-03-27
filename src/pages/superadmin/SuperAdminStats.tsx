import { useState, useMemo } from "react";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Target, Percent } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart,
  Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip, Area, AreaChart,
} from "recharts";
import { SECTORS, type SectorKey } from "@/contexts/DemoPlanContext";

// ── Mock data: enterprises with sectors ──
const ENTERPRISES = [
  { nom: "TechVision SAS", plan: "enterprise", mrr: 400, sector: "developpeur", date: "2025-04" },
  { nom: "Studio Créatif", plan: "business", mrr: 250, sector: "designer", date: "2025-05" },
  { nom: "BTP Renov", plan: "starter", mrr: 150, sector: "btp", date: "2025-06" },
  { nom: "Immo+", plan: "business", mrr: 250, sector: "immobilier", date: "2025-06" },
  { nom: "CleanPro", plan: "enterprise", mrr: 400, sector: "conciergerie-nettoyage", date: "2025-07" },
  { nom: "DigitalCraft", plan: "starter", mrr: 150, sector: "community-manager", date: "2025-08" },
  { nom: "EventPro", plan: "business", mrr: 250, sector: "evenementiel", date: "2025-08" },
  { nom: "CoachFit", plan: "starter", mrr: 150, sector: "coach-sportif", date: "2025-09" },
  { nom: "SnapStudio", plan: "business", mrr: 250, sector: "photographe", date: "2025-09" },
  { nom: "GarageExpert", plan: "enterprise", mrr: 400, sector: "garages", date: "2025-10" },
  { nom: "FormaPlus", plan: "business", mrr: 250, sector: "formateur", date: "2025-10" },
  { nom: "ConciergeVIP", plan: "starter", mrr: 150, sector: "conciergerie-immo", date: "2025-11" },
  { nom: "ConsultPro", plan: "business", mrr: 250, sector: "consultant", date: "2025-11" },
  { nom: "WedDream", plan: "enterprise", mrr: 400, sector: "mariage", date: "2025-12" },
  { nom: "TraiteurSaveur", plan: "starter", mrr: 150, sector: "traiteur", date: "2025-12" },
  { nom: "RepairMobile", plan: "starter", mrr: 150, sector: "reparateur", date: "2026-01" },
  { nom: "DJ Max", plan: "business", mrr: 250, sector: "dj-animateur", date: "2026-01" },
  { nom: "SalonGlam", plan: "business", mrr: 250, sector: "coiffure", date: "2026-02" },
  { nom: "CabinetDroit", plan: "enterprise", mrr: 400, sector: "cabinets", date: "2026-02" },
  { nom: "ShopTrend", plan: "starter", mrr: 150, sector: "boutique", date: "2026-03" },
  { nom: "DevAgile", plan: "business", mrr: 250, sector: "developpeur", date: "2026-01" },
  { nom: "PhotoArt", plan: "enterprise", mrr: 400, sector: "photographe", date: "2025-07" },
  { nom: "CoachZen", plan: "business", mrr: 250, sector: "coach-sportif", date: "2026-03" },
  { nom: "NetClean+", plan: "business", mrr: 250, sector: "conciergerie-nettoyage", date: "2025-11" },
  { nom: "ImmoLux", plan: "enterprise", mrr: 400, sector: "immobilier", date: "2025-09" },
];

// Mock conversion rates by sector (leads → paid)
const SECTOR_CONVERSION: Record<string, { leads: number; converted: number; churn: number }> = {
  developpeur: { leads: 18, converted: 12, churn: 1 },
  designer: { leads: 10, converted: 6, churn: 0 },
  btp: { leads: 14, converted: 8, churn: 2 },
  immobilier: { leads: 20, converted: 14, churn: 1 },
  nettoyage: { leads: 12, converted: 9, churn: 1 },
  "community-manager": { leads: 8, converted: 4, churn: 1 },
  evenementiel: { leads: 9, converted: 5, churn: 0 },
  "coach-sportif": { leads: 15, converted: 10, churn: 2 },
  photographe: { leads: 11, converted: 8, churn: 0 },
  garages: { leads: 7, converted: 5, churn: 1 },
  formateur: { leads: 13, converted: 7, churn: 1 },
  conciergerie: { leads: 6, converted: 3, churn: 0 },
  consultant: { leads: 16, converted: 11, churn: 1 },
  mariage: { leads: 8, converted: 6, churn: 0 },
  traiteur: { leads: 5, converted: 3, churn: 1 },
  reparateur: { leads: 7, converted: 4, churn: 0 },
  "dj-animateur": { leads: 4, converted: 2, churn: 0 },
  coiffure: { leads: 12, converted: 9, churn: 1 },
  cabinets: { leads: 10, converted: 8, churn: 0 },
  boutique: { leads: 9, converted: 5, churn: 1 },
};

// Monthly sector inscription evolution
const MONTHS = ["Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc", "Jan", "Fév", "Mar"];
const MONTH_KEYS = ["2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03"];

const PLAN_COLORS: Record<string, string> = {
  starter: "hsl(var(--muted-foreground))",
  business: "hsl(217, 91%, 60%)",
  enterprise: "hsl(45, 93%, 58%)",
};

const conversionConfig = {
  leads: { label: "Leads", color: "hsl(var(--muted-foreground))" },
  converted: { label: "Convertis", color: "hsl(142, 71%, 45%)" },
};

const evolutionConfig = {
  inscriptions: { label: "Inscriptions", color: "hsl(var(--primary))" },
  mrr: { label: "MRR cumulé", color: "hsl(142, 71%, 45%)" },
};

export default function SuperAdminStats() {
  const [selectedSector, setSelectedSector] = useState<string>("all");

  // ── Computed data ──

  const filteredEnterprises = useMemo(() => {
    if (selectedSector === "all") return ENTERPRISES;
    return ENTERPRISES.filter((e) => e.sector === selectedSector);
  }, [selectedSector]);

  // Sector distribution for pie
  const sectorDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEnterprises.forEach((e) => {
      const s = SECTORS.find((s) => s.key === e.sector);
      const label = s ? `${s.icon} ${s.label}` : e.sector;
      map[label] = (map[label] || 0) + 1;
    });
    const colors = [
      "hsl(var(--primary))", "hsl(142, 71%, 45%)", "hsl(45, 93%, 58%)",
      "hsl(217, 91%, 60%)", "hsl(var(--destructive))", "hsl(280, 65%, 60%)",
      "hsl(180, 60%, 50%)", "hsl(30, 80%, 55%)", "hsl(340, 70%, 55%)", "hsl(160, 50%, 45%)",
    ];
    return Object.entries(map)
      .map(([name, value], i) => ({ name, value, fill: colors[i % colors.length] }))
      .sort((a, b) => b.value - a.value);
  }, [filteredEnterprises]);

  // Conversion data
  const conversionData = useMemo(() => {
    const sectors = selectedSector === "all"
      ? Object.keys(SECTOR_CONVERSION)
      : [selectedSector];
    return sectors
      .map((key) => {
        const s = SECTORS.find((s) => s.key === key);
        const conv = SECTOR_CONVERSION[key];
        if (!conv) return null;
        return {
          name: s ? s.label : key,
          leads: conv.leads,
          converted: conv.converted,
          rate: Math.round((conv.converted / conv.leads) * 100),
          churn: conv.churn,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.rate - a!.rate)
      .slice(0, 12) as { name: string; leads: number; converted: number; rate: number; churn: number }[];
  }, [selectedSector]);

  // Monthly evolution
  const monthlyEvolution = useMemo(() => {
    let cumulMrr = 0;
    return MONTH_KEYS.map((mk, i) => {
      const monthEnterprises = filteredEnterprises.filter((e) => e.date === mk);
      cumulMrr += monthEnterprises.reduce((sum, e) => sum + e.mrr, 0);
      return {
        mois: MONTHS[i],
        inscriptions: monthEnterprises.length,
        mrr: cumulMrr,
      };
    });
  }, [filteredEnterprises]);

  // KPIs
  const totalMrr = filteredEnterprises.reduce((s, e) => s + e.mrr, 0);
  const totalEnterprises = filteredEnterprises.length;
  const avgConversion = conversionData.length > 0
    ? Math.round(conversionData.reduce((s, c) => s + c.rate, 0) / conversionData.length)
    : 0;
  const totalChurn = conversionData.reduce((s, c) => s + c.churn, 0);

  // Plan distribution per sector
  const planBySector = useMemo(() => {
    const map: Record<string, { name: string; starter: number; business: number; enterprise: number }> = {};
    filteredEnterprises.forEach((e) => {
      const s = SECTORS.find((s) => s.key === e.sector);
      const label = s ? s.label : e.sector;
      if (!map[label]) map[label] = { name: label, starter: 0, business: 0, enterprise: 0 };
      map[label][e.plan as "starter" | "business" | "enterprise"] += 1;
    });
    return Object.values(map).sort((a, b) => (b.starter + b.business + b.enterprise) - (a.starter + a.business + a.enterprise)).slice(0, 10);
  }, [filteredEnterprises]);

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Statistiques détaillées</h1>
            <p className="text-muted-foreground text-sm">Analyse par secteur d'activité, conversion et évolution</p>
          </div>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-[240px] glass-input border-0">
              <SelectValue placeholder="Tous les secteurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les secteurs</SelectItem>
              {SECTORS.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.icon} {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Entreprises", value: totalEnterprises.toString(), icon: Users, color: "text-primary", change: `${totalEnterprises}`, positive: true },
            { label: "MRR total", value: `${totalMrr.toLocaleString("fr-FR")}€`, icon: TrendingUp, color: "text-emerald-400", change: "+8%", positive: true },
            { label: "Taux conversion", value: `${avgConversion}%`, icon: Target, color: "text-neon-blue", change: "+2.1%", positive: true },
            { label: "Churn total", value: totalChurn.toString(), icon: Percent, color: "text-amber-400", change: "-3", positive: true },
          ].map((kpi) => (
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

        {/* Conversion par secteur + Pie répartition */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="glass-card border-white/10 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-neon-blue" />
                Taux de conversion par secteur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={conversionConfig} className="h-[300px] w-full">
                <BarChart data={conversionData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} className="fill-muted-foreground" angle={-30} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="leads" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Répartition par secteur</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={sectorDistribution.slice(0, 8)} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {sectorDistribution.slice(0, 8).map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {sectorDistribution.slice(0, 6).map((p) => (
                  <div key={p.name} className="flex items-center gap-1 text-[10px]">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.fill }} />
                    <span className="text-muted-foreground truncate max-w-[80px]">{p.name}</span>
                    <span className="font-medium">{p.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Évolution temporelle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Évolution des inscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={evolutionConfig} className="h-[250px] w-full">
                <BarChart data={monthlyEvolution} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="inscriptions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                MRR cumulé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={evolutionConfig} className="h-[250px] w-full">
                <AreaChart data={monthlyEvolution} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrrCumulGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="mrr" stroke="hsl(142, 71%, 45%)" fill="url(#mrrCumulGrad)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Plans par secteur (stacked) */}
        {selectedSector === "all" && (
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Distribution des plans par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={planBySector} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} className="fill-muted-foreground" angle={-25} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" allowDecimals={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="starter" stackId="a" fill={PLAN_COLORS.starter} name="Starter" />
                  <Bar dataKey="business" stackId="a" fill={PLAN_COLORS.business} name="Business" />
                  <Bar dataKey="enterprise" stackId="a" fill={PLAN_COLORS.enterprise} name="Enterprise" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Tableau détaillé conversion */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Détail conversion par secteur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Secteur</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Leads</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Convertis</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Taux</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Churns</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionData.map((row) => (
                    <tr key={row.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-medium">
                        {SECTORS.find((s) => s.label === row.name)?.icon}{" "}
                        {row.name}
                      </td>
                      <td className="py-3 text-center text-muted-foreground">{row.leads}</td>
                      <td className="py-3 text-center text-emerald-400">{row.converted}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          row.rate >= 70 ? "bg-emerald-500/10 text-emerald-400" :
                          row.rate >= 50 ? "bg-amber-500/10 text-amber-400" :
                          "bg-destructive/10 text-destructive"
                        }`}>
                          {row.rate}%
                        </span>
                      </td>
                      <td className="py-3 text-center text-destructive">{row.churn > 0 ? `-${row.churn}` : "0"}</td>
                      <td className="py-3 text-right font-semibold text-primary">+{row.converted - row.churn}</td>
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
