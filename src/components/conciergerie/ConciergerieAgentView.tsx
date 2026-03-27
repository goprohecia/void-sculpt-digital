// [MBA] CDC Conciergerie — Espace Employé avec affichage conditionnel agent/manager
// Agent: voit SES missions, sa check-list, ses signalements
// Manager: voit les missions de son équipe, assigne agents, valide missions, commissions
// Director: voit tout
// Pas de composant séparé — un seul composant avec affichage conditionnel selon employeeLevel
import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MOCK_CONCIERGERIE_INTERVENTIONS,
  MOCK_CONCIERGERIE_AGENTS,
  type ConciergerieIntervention,
} from "@/data/mockConciergerieData";
import {
  ClipboardList, MapPin, Clock, CheckCircle, Users, Euro,
  SprayCan, DoorOpen, DoorClosed, Wrench, Eye, Megaphone, TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

// [MBA] CDC Conciergerie — simulation du niveau employé (en attente space_key Hamza)
// En production: const { role, spaceKey } = useAuth();
// const isManager = role === 'employee' && spaceKey === 'manager';
const EMPLOYEE_LEVEL: "agent" | "manager" | "director" = "agent";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "ménage": SprayCan, "check-in": DoorOpen, "check-out": DoorClosed, "maintenance": Wrench,
};

const STATUT_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  "à_faire": { bg: "bg-amber-100", text: "text-amber-700", label: "En attente" },
  "en_cours": { bg: "bg-green-100", text: "text-green-700", label: "En cours" },
  "terminé": { bg: "bg-gray-100", text: "text-gray-500", label: "Terminée" },
};

export function ConciergerieAgentView() {
  // [MBA] CDC Conciergerie — niveau employé pour affichage conditionnel
  const employeeLevel = EMPLOYEE_LEVEL;
  const showTeamView = employeeLevel === "manager" || employeeLevel === "director";
  const showCommissions = employeeLevel === "manager" || employeeLevel === "director";
  const showAllDossiers = employeeLevel === "director";

  const agents = MOCK_CONCIERGERIE_AGENTS;
  const [interventions, setInterventions] = useState<ConciergerieIntervention[]>(
    showAllDossiers
      ? MOCK_CONCIERGERIE_INTERVENTIONS
      : MOCK_CONCIERGERIE_INTERVENTIONS.filter((i) => i.agentId === "conc-agent-1")
  );

  const toggleChecklist = (intId: string, idx: number) => {
    setInterventions((prev) => prev.map((i) =>
      i.id === intId ? { ...i, checklist: i.checklist.map((c, ci) => ci === idx ? { ...c, done: !c.done } : c) } : i
    ));
  };

  const advanceStatut = (id: string) => {
    setInterventions(prev => prev.map(i => {
      if (i.id !== id) return i;
      if (i.statut === "à_faire") return { ...i, statut: "en_cours" };
      if (i.statut === "en_cours") return { ...i, statut: "terminé" };
      return i;
    }));
    toast.success("Statut mis à jour");
  };

  const missionsEnCours = interventions.filter(i => i.statut !== "terminé");
  const missionsTerminees = interventions.filter(i => i.statut === "terminé");

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      {/* [MBA] CDC Conciergerie — header espace employé */}
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-green-600" />
          {showTeamView ? "Gestion equipe" : "Mes missions"}
        </h1>
        <p className="text-sm text-gray-500">
          {showTeamView ? "Vue manager — missions de votre equipe" : `${missionsEnCours.length} mission(s) en cours`}
        </p>
      </motion.div>

      {/* [MBA] CDC Conciergerie — section manager: vue équipe */}
      {showTeamView && (
        <motion.div variants={staggerItem}>
          <Card className="shadow-md border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-green-600" /> Mon equipe</span>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Megaphone className="h-3.5 w-3.5" /> Message groupe
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {agents.map(a => {
                  const agentMissions = interventions.filter(i => i.agentId === a.id);
                  const enCours = agentMissions.some(i => i.statut === "en_cours");
                  return (
                    <div key={a.id} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{a.prenom} {a.nom}</p>
                        <Badge variant="outline" className={`text-[10px] ${enCours ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                          {enCours ? "En mission" : "Disponible"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">{agentMissions.length} mission(s) aujourd'hui</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* [MBA] CDC Conciergerie — section manager: commissions */}
      {showCommissions && (
        <motion.div variants={staggerItem}>
          <Card className="shadow-md border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Euro className="h-4 w-4 text-green-600" /> Mes commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Ce mois</p>
                  <p className="text-xl font-semibold text-green-600">1 240 €</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Cumul annuel</p>
                  <p className="text-xl font-semibold text-gray-900">8 750 €</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Taux commission</p>
                  <p className="text-xl font-semibold text-gray-900">15%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* [MBA] CDC Conciergerie — missions en cours */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-green-600" />
              {showTeamView ? "Missions equipe" : "Missions du jour"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {missionsEnCours.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-10 w-10 text-green-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Toutes les missions sont terminées</p>
              </div>
            ) : (
              missionsEnCours.map((intervention) => {
                const status = STATUT_COLORS[intervention.statut] || STATUT_COLORS["à_faire"];
                const TypeIcon = TYPE_ICONS[intervention.type] || SprayCan;
                const checkDone = intervention.checklist.filter(c => c.done).length;
                const checkTotal = intervention.checklist.length;
                const agent = showTeamView ? agents.find(a => a.id === intervention.agentId) : null;

                return (
                  <div key={intervention.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] ${status.bg} ${status.text}`}>{status.label}</Badge>
                        <Badge variant="outline" className="text-[10px] capitalize gap-1">
                          <TypeIcon className="h-3 w-3" /> {intervention.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {intervention.heure}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{intervention.bienNom}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {intervention.adresse}</p>
                      {agent && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Users className="h-3 w-3" /> {agent.prenom} {agent.nom}</p>}
                    </div>

                    {/* Check-list */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-gray-500">Check-list</p>
                        <span className="text-xs text-gray-400">{checkDone}/{checkTotal}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                        <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${checkTotal > 0 ? (checkDone / checkTotal) * 100 : 0}%` }} />
                      </div>
                      {!showTeamView && (
                        <div className="space-y-1.5">
                          {intervention.checklist.map((item, idx) => (
                            <label key={idx} className="flex items-center gap-2 text-xs cursor-pointer">
                              <Checkbox checked={item.done} onCheckedChange={() => toggleChecklist(intervention.id, idx)} />
                              <span className={item.done ? "line-through text-gray-400" : "text-gray-700"}>{item.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {intervention.statut !== "terminé" && (
                        <Button size="sm" onClick={() => advanceStatut(intervention.id)}
                          className="gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          {intervention.statut === "à_faire" ? "Démarrer" : "Terminer"}
                        </Button>
                      )}
                      {showTeamView && (
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                          <Eye className="h-3 w-3" /> Voir détail
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* [MBA] CDC Conciergerie — missions terminées */}
      {missionsTerminees.length > 0 && (
        <motion.div variants={staggerItem}>
          <Card className="shadow-md border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gray-400" /> Terminées ({missionsTerminees.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {missionsTerminees.map(i => (
                <div key={i.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{i.bienNom}</p>
                    <p className="text-xs text-gray-400">{i.heure} · {i.type}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
