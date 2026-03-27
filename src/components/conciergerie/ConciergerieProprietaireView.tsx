// [MBA] CDC Conciergerie — Espace Propriétaire (= Client adapté)
// Fonctionnalités: logements avec statut, calendrier réservations, rapports ménage avec photos,
// factures, messagerie admin uniquement
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_CONCIERGERIE_BIENS,
  MOCK_CONCIERGERIE_RESERVATIONS,
  MOCK_CONCIERGERIE_HISTORIQUE,
  MOCK_PROPRIETAIRE_REVENUS,
} from "@/data/mockConciergerieData";
import {
  Home, CalendarDays, Euro, Camera, FileText, Download,
  Clock, CheckCircle, AlertTriangle, MapPin, Star, MessageSquare,
} from "lucide-react";

const CURRENT_PROPRIETAIRE_ID = "prop-1";

// [MBA] CDC Conciergerie — statut logement
const LOGEMENT_STATUS: Record<string, { label: string; color: string }> = {
  disponible: { label: "Disponible", color: "bg-green-50 text-green-600 border-green-200" },
  reserve: { label: "Réservé", color: "bg-blue-50 text-blue-600 border-blue-200" },
  en_menage: { label: "En ménage", color: "bg-amber-50 text-amber-600 border-amber-200" },
};

export function ConciergerieProprietaireView() {
  const mesBiens = MOCK_CONCIERGERIE_BIENS.filter((b) => b.proprietaireId === CURRENT_PROPRIETAIRE_ID);
  const mesReservations = MOCK_CONCIERGERIE_RESERVATIONS.filter((r) => r.proprietaireId === CURRENT_PROPRIETAIRE_ID);
  const revenus = MOCK_PROPRIETAIRE_REVENUS;
  const historique = MOCK_CONCIERGERIE_HISTORIQUE;

  const revenuTotal = revenus.reduce((s, r) => s + r.montant, 0);
  const alertes = mesBiens.filter((bien) => {
    const prochainCheckIn = mesReservations.find((r) => r.bienId === bien.id && r.etape === 0);
    return prochainCheckIn;
  });

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      {/* [MBA] CDC Conciergerie — header propriétaire */}
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Home className="h-6 w-6 text-green-600" /> Espace Propriétaire
        </h1>
        <p className="text-sm text-gray-500">Suivi en temps réel de vos biens et interventions</p>
      </motion.div>

      {/* [MBA] CDC Conciergerie — KPIs propriétaire */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" variants={staggerItem}>
        <DashboardKPI icon={Home} title="Mes logements" value={mesBiens.length} iconColor="emerald" />
        <DashboardKPI icon={CalendarDays} title="Réservations" value={mesReservations.length} iconColor="blue" />
        <DashboardKPI icon={Star} title="Note moyenne" value="4.7/5" iconColor="amber" />
        <DashboardKPI icon={Euro} title="Revenus du mois" value={`${revenuTotal.toLocaleString()} €`} iconColor="violet" />
      </motion.div>

      {/* [MBA] CDC Conciergerie — mes logements avec statut */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Home className="h-4 w-4 text-green-600" /> Mes logements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mesBiens.map((bien) => {
              const biensResa = mesReservations.filter(r => r.bienId === bien.id);
              const statut = biensResa.some(r => r.etape >= 2 && r.etape < 5) ? "reserve" : "disponible";
              const statusInfo = LOGEMENT_STATUS[statut];
              return (
                <div key={bien.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{bien.nom}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {bien.ville}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${statusInfo.color}`}>{statusInfo.label}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                    <span>{bien.type}</span>
                    <span>Capacité: {bien.capacite}</span>
                    <span>Taux occ: {bien.tauxOccupation}%</span>
                  </div>
                  {biensResa.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-1.5">Réservations à venir</p>
                      {biensResa.slice(0, 2).map(r => (
                        <div key={r.id} className="flex items-center justify-between text-xs py-1">
                          <span className="text-gray-700">{r.voyageurNom}</span>
                          <span className="text-gray-400">{r.dateArrivee} → {r.dateDepart}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* [MBA] CDC Conciergerie — rapports ménage (clé différenciante) */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Camera className="h-4 w-4 text-green-600" /> Rapports ménage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {historique.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucun rapport disponible</p>
            ) : (
              historique.map((rapport) => (
                <div key={rapport.id} className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{rapport.bienNom}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{rapport.date} · {rapport.agent}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-[10px]">
                      <CheckCircle className="h-3 w-3 mr-1" /> Validé
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {rapport.heureDebut} → {rapport.heureFin}</span>
                    <span className="flex items-center gap-1"><Camera className="h-3 w-3" /> {rapport.nbPhotos} photos</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {rapport.note}/5</span>
                  </div>
                  {/* [MBA] CDC Conciergerie — photos après ménage (grille) */}
                  {rapport.nbPhotos > 0 && (
                    <div className="flex gap-2 mt-3">
                      {Array.from({ length: Math.min(rapport.nbPhotos, 4) }).map((_, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <Camera className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                      {rapport.nbPhotos > 4 && (
                        <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                          +{rapport.nbPhotos - 4}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs gap-1"><FileText className="h-3 w-3" /> Voir rapport</Button>
                    <Button size="sm" variant="outline" className="text-xs gap-1"><Download className="h-3 w-3" /> PDF</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* [MBA] CDC Conciergerie — factures propriétaire */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Euro className="h-4 w-4 text-green-600" /> Mes factures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-xs">
                    <th className="text-left py-2.5">Mois</th>
                    <th className="text-left py-2.5">Logement</th>
                    <th className="text-right py-2.5">Montant</th>
                    <th className="text-center py-2.5">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {revenus.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100">
                      <td className="py-2.5 text-gray-700">{r.mois}</td>
                      <td className="py-2.5 text-gray-600">{r.logement}</td>
                      <td className="py-2.5 text-right font-medium text-gray-900">{r.montant.toLocaleString()} €</td>
                      <td className="py-2.5 text-center">
                        <Badge variant="outline" className={`text-[10px] ${r.statut === "payee" ? "bg-green-50 text-green-600 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                          {r.statut === "payee" ? "Payé" : "En attente"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* [MBA] CDC Conciergerie — messagerie admin uniquement */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4 text-green-600" /> Messagerie</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Contactez la direction pour toute question</p>
            <Button size="sm" className="mt-3 gap-1.5 bg-green-600 hover:bg-green-700 text-white">
              <MessageSquare className="h-3.5 w-3.5" /> Envoyer un message
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
