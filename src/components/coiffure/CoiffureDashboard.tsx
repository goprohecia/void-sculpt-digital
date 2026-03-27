import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import {
  MOCK_COIFFURE_PRATICIENS,
  MOCK_COIFFURE_RDV,
  MOCK_COIFFURE_STOCK,
  MOCK_COIFFURE_NOSHOWS,
  COIFFURE_STEPS,
} from "@/data/mockCoiffureData";
import { Scissors, Euro, CalendarDays, Users, AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";

export function CoiffureDashboard() {
  const [rdvs, setRdvs] = useState(MOCK_COIFFURE_RDV);
  const stock = MOCK_COIFFURE_STOCK;
  const praticiens = MOCK_COIFFURE_PRATICIENS;

  const rdvsAujourdhui = rdvs.filter((r) => r.date === "2026-03-10");
  const caJour = rdvsAujourdhui.filter((r) => r.etape >= 4).reduce((s, r) => s + r.prix, 0);
  const totalCreneaux = praticiens.length * 8; // 8 créneaux par praticien
  const tauxRemplissage = Math.round((rdvsAujourdhui.length / totalCreneaux) * 100);
  const ruptures = stock.filter((p) => p.quantite <= p.seuil);

  const advanceRdv = (id: string) => {
    setRdvs((prev) => prev.map((r) => r.id === id ? { ...r, etape: Math.min(r.etape + 1, 5) } : r));
    toast.success("Étape avancée");
  };

  // Heures du planning
  const heures = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <SectorOnboardingBanner />

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Scissors className="h-6 w-6 text-primary" /> Espace Gérant
        </h1>
        <p className="text-muted-foreground text-sm">Planning global et indicateurs du salon</p>
      </motion.div>

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={staggerItem}>
        <DashboardKPI icon={Euro} title="CA du jour" value={`${caJour} €`} iconColor="emerald" />
        <DashboardKPI icon={CalendarDays} title="Taux remplissage" value={`${tauxRemplissage}%`} iconColor="blue" />
        <DashboardKPI icon={Users} title="No-shows semaine" value={MOCK_COIFFURE_NOSHOWS} iconColor="rose" />
        <DashboardKPI icon={Package} title="Alertes stock" value={ruptures.length} iconColor="amber" />
      </motion.div>

      {/* Planning hebdomadaire par praticien */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Planning du jour — 10 mars 2026
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-2 pr-3 text-muted-foreground">Heure</th>
                    {praticiens.map((p) => (
                      <th key={p.id} className="text-left py-2 px-2">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2.5 w-2.5 rounded-full ${p.couleur}`} />
                          <span>{p.prenom}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heures.map((h) => (
                    <tr key={h} className="border-b border-border/10">
                      <td className="py-1.5 pr-3 font-mono text-muted-foreground">{h}</td>
                      {praticiens.map((p) => {
                        const rdv = rdvsAujourdhui.find((r) => r.praticienId === p.id && r.heure === h);
                        return (
                          <td key={p.id} className="py-1.5 px-2">
                            {rdv ? (
                              <div
                                className="glass-card p-1.5 cursor-pointer hover:bg-muted/10 transition-colors"
                                onClick={() => advanceRdv(rdv.id)}
                              >
                                <p className="font-medium truncate">{rdv.clientNom}</p>
                                <p className="text-muted-foreground">{rdv.prestationNom} · {rdv.duree}min</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Badge variant="outline" className={`text-[9px] ${COIFFURE_STEPS[rdv.etape] ? "" : ""}`}>
                                    {COIFFURE_STEPS[rdv.etape]}
                                  </Badge>
                                  {rdv.acomptePaye && <Badge variant="secondary" className="text-[9px]">💳</Badge>}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/30">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gestion stock */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Stock produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stock.map((p) => {
                const level = p.quantite === 0 ? "destructive" : p.quantite <= p.seuil ? "warning" : "ok";
                return (
                  <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-2">
                      {level === "destructive" && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                      {level === "warning" && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                      <div>
                        <p className="text-sm font-medium">{p.nom}</p>
                        <p className="text-[10px] text-muted-foreground">{p.categorie}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={level === "ok" ? "secondary" : "outline"} className={`text-xs ${
                        level === "destructive" ? "border-destructive/50 text-destructive" :
                        level === "warning" ? "border-amber-500/50 text-amber-400" : ""
                      }`}>
                        {p.quantite} / seuil {p.seuil}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
