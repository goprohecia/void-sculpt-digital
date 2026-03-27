// [MBA] CDC Conciergerie — Espace Admin Dashboard
// Layout: sidebar standard MBA, KPIs CDC, missions en cours avec code couleur, équipe, alertes
// Données: mockConciergerieData.ts pour la démo, Supabase pour la production (attente Hamza)
import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import {
  MOCK_CONCIERGERIE_BIENS,
  MOCK_CONCIERGERIE_RESERVATIONS,
  MOCK_CONCIERGERIE_AGENTS,
  MOCK_CONCIERGERIE_INTERVENTIONS,
  CONCIERGERIE_STEPS,
  type ConciergerieIntervention,
} from "@/data/mockConciergerieData";
import {
  Home, CalendarDays, Users, Euro, ClipboardList, Plus, AlertTriangle,
  Clock, MapPin, Phone, Link2, RefreshCw, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// [MBA] CDC Conciergerie — code couleur statut mission
const MISSION_STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  "à_faire": { bg: "bg-amber-100", text: "text-amber-700", label: "En attente" },
  "assignee": { bg: "bg-blue-100", text: "text-blue-700", label: "Assignée" },
  "en_cours": { bg: "bg-green-100", text: "text-green-700", label: "En cours" },
  "terminé": { bg: "bg-gray-100", text: "text-gray-500", label: "Terminée" },
  "probleme": { bg: "bg-red-100", text: "text-red-700", label: "Problème" },
};

const PLATEFORME_BADGE: Record<string, string> = {
  Airbnb: "bg-rose-50 text-rose-600 border-rose-200",
  Booking: "bg-blue-50 text-blue-600 border-blue-200",
  Vrbo: "bg-indigo-50 text-indigo-600 border-indigo-200",
  Direct: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

export function ConciergerieDashboard() {
  const [reservations, setReservations] = useState(MOCK_CONCIERGERIE_RESERVATIONS);

  const biens = MOCK_CONCIERGERIE_BIENS;
  const agents = MOCK_CONCIERGERIE_AGENTS;
  const interventions = MOCK_CONCIERGERIE_INTERVENTIONS;

  // [MBA] CDC Conciergerie — KPIs spécifiques admin
  const missionsJour = interventions.filter((i) => i.statut !== "terminé").length;
  const missionsSemaine = interventions.length;
  const logementsActifs = biens.length;
  const caTotal = biens.reduce((s, b) => s + b.revenuMensuel, 0);
  const agentsDisponibles = agents.filter((a) => !interventions.some((i) => i.agentId === a.id && i.statut === "en_cours")).length;

  // [MBA] CDC Conciergerie — alertes
  const alertes: string[] = [];
  const missionsNonAssignees = interventions.filter((i) => !i.agentId || i.agentId === "");
  if (missionsNonAssignees.length > 0) alertes.push(`${missionsNonAssignees.length} mission(s) sans prestataire`);
  const reservationsSansIntervention = reservations.filter((r) => r.etape >= 4 && !interventions.some((i) => i.reservationId === r.id));
  if (reservationsSansIntervention.length > 0) alertes.push(`${reservationsSansIntervention.length} check-out sans ménage planifié`);

  const advanceReservation = (id: string) => {
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, etape: Math.min(r.etape + 1, 6) } : r));
    toast.success("Étape avancée");
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <SectorOnboardingBanner />

      {/* [MBA] CDC Conciergerie — header admin */}
      <motion.div variants={staggerItem} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Home className="h-6 w-6 text-green-600" /> Tableau de bord Conciergerie
          </h1>
          <p className="text-sm text-gray-500">Vue globale de vos missions, logements et équipe</p>
        </div>
        {/* [MBA] CDC Conciergerie — boutons sync plateformes (Phase 2) + nouvelle mission */}
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="gap-1.5 text-rose-500 border-rose-200" disabled>
            <RefreshCw className="h-3.5 w-3.5" /> Airbnb
            <Badge variant="secondary" className="text-[9px] ml-1">Bientot</Badge>
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-blue-500 border-blue-200" disabled>
            <RefreshCw className="h-3.5 w-3.5" /> Booking
            <Badge variant="secondary" className="text-[9px] ml-1">Bientot</Badge>
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-indigo-500 border-indigo-200" disabled>
            <RefreshCw className="h-3.5 w-3.5" /> Vrbo
            <Badge variant="secondary" className="text-[9px] ml-1">Bientot</Badge>
          </Button>
          <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-3.5 w-3.5" /> Nouvelle mission
          </Button>
        </div>
      </motion.div>

      {/* [MBA] CDC Conciergerie — alertes */}
      {alertes.length > 0 && (
        <motion.div variants={staggerItem} className="space-y-2">
          {alertes.map((alerte, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{alerte}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* [MBA] CDC Conciergerie — KPIs admin */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-5 gap-3" variants={staggerItem}>
        <DashboardKPI icon={ClipboardList} title="Missions du jour" value={missionsJour} iconColor="amber" />
        <DashboardKPI icon={CalendarDays} title="Missions semaine" value={missionsSemaine} iconColor="blue" />
        <DashboardKPI icon={Home} title="Logements actifs" value={logementsActifs} iconColor="emerald" />
        <DashboardKPI icon={Users} title="Agents disponibles" value={`${agentsDisponibles}/${agents.length}`} iconColor="violet" />
        <DashboardKPI icon={Euro} title="CA mensuel" value={`${caTotal.toLocaleString()} €`} iconColor="amber" />
      </motion.div>

      {/* [MBA] CDC Conciergerie — missions en cours avec code couleur */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-green-600" /> Missions en cours</span>
              <span className="text-xs font-normal text-gray-400">{interventions.filter(i => i.statut !== "terminé").length} actives</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {interventions.filter(i => i.statut !== "terminé").length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune mission en cours</p>
            ) : (
              interventions.filter(i => i.statut !== "terminé").map((mission) => {
                const status = MISSION_STATUS_COLORS[mission.statut] || MISSION_STATUS_COLORS["à_faire"];
                const agent = agents.find(a => a.id === mission.agentId);
                return (
                  <div key={mission.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all cursor-pointer">
                    <div className={`shrink-0 px-2 py-1 rounded text-[10px] font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{mission.bienNom}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {mission.heure}</span>
                        <span className="text-xs text-gray-500 capitalize">{mission.type}</span>
                        {agent && <span className="text-xs text-gray-500 flex items-center gap-1"><Users className="h-3 w-3" /> {agent.prenom} {agent.nom[0]}.</span>}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs gap-1"><Eye className="h-3 w-3" /> Voir</Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* [MBA] CDC Conciergerie — équipe prestataires */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-green-600" /> Equipe prestataires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {agents.map((a) => {
                const agentMissions = interventions.filter((i) => i.agentId === a.id);
                const enCours = agentMissions.some(i => i.statut === "en_cours");
                return (
                  <div key={a.id} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{a.prenom} {a.nom}</p>
                      <Badge variant="outline" className={`text-[10px] ${enCours ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                        {enCours ? "En mission" : "Disponible"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Phone className="h-3 w-3" /> {a.telephone}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{agentMissions.length} mission(s) aujourd'hui</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* [MBA] CDC Conciergerie — calendrier réservations par logement */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4 text-green-600" /> Reservations par logement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {biens.map((bien) => {
              const biensResa = reservations.filter((r) => r.bienId === bien.id);
              return (
                <div key={bien.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="min-w-0 w-40 shrink-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{bien.nom}</p>
                    <p className="text-xs text-gray-400">{bien.ville}</p>
                  </div>
                  <div className="flex-1 flex gap-1.5 flex-wrap">
                    {biensResa.length === 0 && <span className="text-xs text-gray-400">Aucune reservation</span>}
                    {biensResa.map((r) => (
                      <Badge key={r.id} variant="outline" className={`text-[10px] cursor-pointer hover:shadow-sm ${PLATEFORME_BADGE[r.plateforme] || ""}`} onClick={() => advanceReservation(r.id)}>
                        {r.voyageurNom} · {r.dateArrivee.slice(5)} → {r.dateDepart.slice(5)}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* [MBA] CDC Conciergerie — rapport mensuel par propriétaire */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Euro className="h-4 w-4 text-green-600" /> Rapport mensuel par proprietaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-xs">
                    <th className="text-left py-2.5">Proprietaire</th>
                    <th className="text-left py-2.5">Biens</th>
                    <th className="text-right py-2.5">Taux occ.</th>
                    <th className="text-right py-2.5">Revenus</th>
                    <th className="text-right py-2.5">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {["prop-1", "prop-2", "prop-3"].map((pid) => {
                    const propBiens = biens.filter((b) => b.proprietaireId === pid);
                    if (propBiens.length === 0) return null;
                    const nom = propBiens[0]?.proprietaireNom || pid;
                    const avgOcc = Math.round(propBiens.reduce((s, b) => s + b.tauxOccupation, 0) / propBiens.length);
                    const revenu = propBiens.reduce((s, b) => s + b.revenuMensuel, 0);
                    const commission = propBiens.reduce((s, b) => s + b.commissionConciergerie, 0);
                    return (
                      <tr key={pid} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2.5 font-medium text-gray-900">{nom}</td>
                        <td className="py-2.5 text-gray-600">{propBiens.length} bien{propBiens.length > 1 ? "s" : ""}</td>
                        <td className="py-2.5 text-right text-gray-600">{avgOcc}%</td>
                        <td className="py-2.5 text-right font-medium text-gray-900">{revenu.toLocaleString()} €</td>
                        <td className="py-2.5 text-right text-green-600">{commission.toLocaleString()} €</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
