import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { ConciergerieStepper } from "./ConciergerieStepper";
import {
  MOCK_CONCIERGERIE_BIENS,
  MOCK_CONCIERGERIE_RESERVATIONS,
  MOCK_CONCIERGERIE_HISTORIQUE,
  MOCK_PROPRIETAIRE_REVENUS,
} from "@/data/mockConciergerieData";
import { Home, CalendarDays, Euro, ClipboardList, AlertTriangle, TrendingUp, FileText, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

// Simulate the connected proprietaire as prop-1
const CURRENT_PROPRIETAIRE_ID = "prop-1";

export function ConciergerieProprietaireView() {
  const mesBiens = MOCK_CONCIERGERIE_BIENS.filter((b) => b.proprietaireId === CURRENT_PROPRIETAIRE_ID);
  const mesReservations = MOCK_CONCIERGERIE_RESERVATIONS.filter((r) => r.proprietaireId === CURRENT_PROPRIETAIRE_ID);
  const revenus = MOCK_PROPRIETAIRE_REVENUS;
  const historique = MOCK_CONCIERGERIE_HISTORIQUE;

  // Alerte: ménage non fait avant prochain check-in
  const alertes = mesBiens.filter((bien) => {
    const prochainCheckIn = mesReservations.find((r) => r.bienId === bien.id && r.etape === 0);
    const dernierMenage = mesReservations.find((r) => r.bienId === bien.id && r.etape >= 5);
    return prochainCheckIn && !dernierMenage;
  });

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" /> Espace Propriétaire
        </h1>
        <p className="text-muted-foreground text-sm">Suivi en temps réel de vos biens</p>
      </motion.div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <motion.div variants={staggerItem}>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            <span>Ménage non effectué avant le prochain check-in sur {alertes.map(a => a.nom).join(", ")}</span>
          </div>
        </motion.div>
      )}

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={staggerItem}>
        <DashboardKPI icon={Home} title="Biens gérés" value={mesBiens.length} color="text-blue-400" />
        <DashboardKPI icon={CalendarDays} title="Réservations" value={mesReservations.length} color="text-emerald-400" />
        <DashboardKPI icon={TrendingUp} title="Taux occupation" value={`${revenus.tauxOccupationMoyen}%`} color="text-amber-400" />
        <DashboardKPI icon={Euro} title="Solde net" value={`${revenus.soldeNet.toLocaleString()} €`} color="text-violet-400" />
      </motion.div>

      {/* Mes biens */}
      {mesBiens.map((bien) => {
        const bienResas = mesReservations.filter((r) => r.bienId === bien.id);
        const resaActive = bienResas.find((r) => r.etape > 0 && r.etape < 6);
        const prochaineResa = bienResas.find((r) => r.etape === 0);
        return (
          <motion.div key={bien.id} variants={staggerItem}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{bien.nom}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {bien.type} · {bien.capacite} pers.
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{bien.adresse}, {bien.ville}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-4 text-sm">
                  <span>Taux d'occupation : <strong>{bien.tauxOccupation}%</strong></span>
                  <span>Revenu : <strong>{bien.revenuMensuel.toLocaleString()} €</strong></span>
                </div>
                {resaActive && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold">Séjour en cours — {resaActive.voyageurNom}</p>
                    <ConciergerieStepper currentStep={resaActive.etape} agentNom={resaActive.agentNom} />
                  </div>
                )}
                {prochaineResa && (
                  <div className="text-xs text-muted-foreground">
                    Prochaine réservation : {prochaineResa.voyageurNom} · {prochaineResa.dateArrivee}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Revenus */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" /> Revenus — {revenus.mois}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Loyers perçus</p>
                <p className="font-semibold text-lg">{revenus.loyersPercus.toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Commission conciergerie</p>
                <p className="font-semibold text-lg text-destructive">-{revenus.commissionConciergerie.toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Frais entretien</p>
                <p className="font-semibold text-lg text-destructive">-{revenus.fraisEntretien.toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Solde net</p>
                <p className="font-semibold text-lg text-emerald-400">{revenus.soldeNet.toLocaleString()} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Historique interventions */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" /> Historique des interventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {historique.map((h, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0">
                  <Badge variant="secondary" className="text-[10px] shrink-0">{h.type}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{h.bienNom}</p>
                    <p className="text-xs text-muted-foreground">{h.rapport}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs">{h.date}</p>
                    <p className="text-[10px] text-muted-foreground">{h.agentNom}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Messagerie */}
      <motion.div variants={staggerItem}>
        <Link to="/client/messagerie" className="glass-card p-4 flex items-center gap-3 hover:bg-muted/10 transition-colors">
          <MessageSquare className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">Messagerie avec votre conciergerie</p>
            <p className="text-xs text-muted-foreground">Contacter votre gestionnaire</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
