import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConciergerieStepper } from "./ConciergerieStepper";
import { ConciergerieOnboardingBanner } from "./ConciergerieOnboardingBanner";
import {
  MOCK_CONCIERGERIE_BIENS,
  MOCK_CONCIERGERIE_RESERVATIONS,
  MOCK_CONCIERGERIE_AGENTS,
  MOCK_CONCIERGERIE_INTERVENTIONS,
  CONCIERGERIE_STEPS,
  CONCIERGERIE_STEP_COLORS,
} from "@/data/mockConciergerieData";
import { Home, CalendarDays, Users, Euro, ClipboardList } from "lucide-react";
import { toast } from "sonner";

const PLATEFORME_COLORS: Record<string, string> = {
  Airbnb: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Booking: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Direct: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function ConciergerieDashboard() {
  const [reservations, setReservations] = useState(MOCK_CONCIERGERIE_RESERVATIONS);

  const biens = MOCK_CONCIERGERIE_BIENS;
  const agents = MOCK_CONCIERGERIE_AGENTS;
  const interventions = MOCK_CONCIERGERIE_INTERVENTIONS;

  const biensActifs = biens.length;
  const reservationsActives = reservations.filter((r) => r.etape < 6).length;
  const interventionsJour = interventions.filter((i) => i.statut !== "terminé").length;
  const caTotal = biens.reduce((s, b) => s + b.revenuMensuel, 0);

  const advanceReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => r.id === id ? { ...r, etape: Math.min(r.etape + 1, 6) } : r)
    );
    toast.success("Étape avancée");
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <ConciergerieOnboardingBanner />

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" /> Espace Conciergerie
        </h1>
        <p className="text-muted-foreground text-sm">Vue globale de vos biens et réservations</p>
      </motion.div>

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={staggerItem}>
        <DashboardKPI icon={Home} title="Biens gérés" value={biensActifs} iconColor="blue" />
        <DashboardKPI icon={CalendarDays} title="Réservations actives" value={reservationsActives} iconColor="emerald" />
        <DashboardKPI icon={ClipboardList} title="Interventions du jour" value={interventionsJour} iconColor="amber" />
        <DashboardKPI icon={Euro} title="Revenus mensuels" value={`${caTotal.toLocaleString()} €`} iconColor="violet" />
      </motion.div>

      {/* Calendrier multi-biens */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Calendrier des réservations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {biens.map((bien) => {
              const biensResa = reservations.filter((r) => r.bienId === bien.id);
              return (
                <div key={bien.id} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-36 truncate">{bien.nom}</span>
                  <div className="flex-1 flex gap-1 flex-wrap">
                    {biensResa.length === 0 && <span className="text-xs text-muted-foreground">Aucune réservation</span>}
                    {biensResa.map((r) => (
                      <Badge key={r.id} variant="outline" className={`text-[10px] ${PLATEFORME_COLORS[r.plateforme] || ""}`}>
                        {r.voyageurNom} · {r.dateArrivee.slice(5)} → {r.dateDepart.slice(5)} · {CONCIERGERIE_STEPS[r.etape]}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Vue équipe */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Équipe d'entretien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {agents.map((a) => {
                const agentInterventions = interventions.filter((i) => i.agentId === a.id);
                return (
                  <div key={a.id} className="glass-card p-3 space-y-1">
                    <p className="font-medium text-sm">{a.prenom} {a.nom}</p>
                    <p className="text-xs text-muted-foreground">{a.telephone}</p>
                    <div className="flex gap-1 flex-wrap">
                      {agentInterventions.map((i) => (
                        <Badge key={i.id} variant="secondary" className="text-[10px]">
                          {i.heure} — {i.type} · {i.bienNom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rapport par propriétaire */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" /> Rapport mensuel par propriétaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground text-xs">
                    <th className="text-left py-2">Propriétaire</th>
                    <th className="text-left py-2">Biens</th>
                    <th className="text-right py-2">Taux occ.</th>
                    <th className="text-right py-2">Revenus</th>
                    <th className="text-right py-2">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {["prop-1", "prop-2", "prop-3"].map((pid) => {
                    const propBiens = biens.filter((b) => b.proprietaireId === pid);
                    const nom = propBiens[0]?.proprietaireNom || pid;
                    const avgOcc = Math.round(propBiens.reduce((s, b) => s + b.tauxOccupation, 0) / propBiens.length);
                    const revenu = propBiens.reduce((s, b) => s + b.revenuMensuel, 0);
                    const commission = propBiens.reduce((s, b) => s + b.commissionConciergerie, 0);
                    return (
                      <tr key={pid} className="border-b border-border/20">
                        <td className="py-2 font-medium">{nom}</td>
                        <td className="py-2">{propBiens.length} bien{propBiens.length > 1 ? "s" : ""}</td>
                        <td className="py-2 text-right">{avgOcc}%</td>
                        <td className="py-2 text-right">{revenu.toLocaleString()} €</td>
                        <td className="py-2 text-right">{commission.toLocaleString()} €</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pipeline réservations */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline des séjours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {CONCIERGERIE_STEPS.map((step, i) => {
                const stepResas = reservations.filter((r) => r.etape === i);
                return (
                  <div key={step} className="space-y-2">
                    <div className={`text-[10px] font-semibold px-2 py-1 rounded text-white ${CONCIERGERIE_STEP_COLORS[i]}`}>
                      {step} ({stepResas.length})
                    </div>
                    {stepResas.map((r) => (
                      <div key={r.id} className="glass-card p-2 space-y-1 text-xs cursor-pointer hover:bg-muted/10" onClick={() => advanceReservation(r.id)}>
                        <p className="font-medium truncate">{r.bienNom}</p>
                        <p className="text-muted-foreground">{r.voyageurNom}</p>
                        <Badge variant="outline" className={`text-[9px] ${PLATEFORME_COLORS[r.plateforme]}`}>{r.plateforme}</Badge>
                      </div>
                    ))}
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
