// [MBA] CDC Conciergerie — Espace Prestataire mobile-first
// Layout: tab bar en bas, pas de sidebar, boutons 44px minimum
// Navigation: Missions | Historique | Messages | Profil
// Fonctionnalités: missions du jour, check-list, upload photos, tracking heure début/fin
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Briefcase, History, MessageSquare, User, MapPin, Clock, Camera,
  Play, Square, CheckCircle, AlertTriangle, ChevronRight, Upload,
} from "lucide-react";
import { toast } from "sonner";

// [MBA] CDC Conciergerie — types props statiques (en attente schéma Supabase Hamza)
interface Mission {
  id: string;
  logementNom: string;
  adresse: string;
  type: "standard" | "depart" | "grand_menage";
  heure: string;
  statut: "a_faire" | "en_cours" | "terminee";
  checklist: { label: string; done: boolean }[];
  photos: { url: string; timestamp: string }[];
  heureDebut?: string;
  heureFin?: string;
}

// [MBA] CDC Conciergerie — données mockées statiques pour le layout
const MOCK_MISSIONS: Mission[] = [
  {
    id: "m1", logementNom: "T3 Vieux-Port Marseille", adresse: "12 rue Saint-Ferréol, 13001 Marseille",
    type: "depart", heure: "09:00", statut: "a_faire",
    checklist: [
      { label: "Aspirateur salon et chambres", done: false },
      { label: "Laver sol cuisine", done: false },
      { label: "Changer draps et serviettes", done: false },
      { label: "Nettoyer salle de bain", done: false },
      { label: "Vider poubelles", done: false },
      { label: "Vérifier équipements", done: false },
    ],
    photos: [],
  },
  {
    id: "m2", logementNom: "Studio Cannes Croisette", adresse: "45 bd de la Croisette, 06400 Cannes",
    type: "standard", heure: "14:00", statut: "a_faire",
    checklist: [
      { label: "Aspirateur", done: false },
      { label: "Surfaces cuisine", done: false },
      { label: "Salle de bain", done: false },
      { label: "Poubelles", done: false },
    ],
    photos: [],
  },
];

const MOCK_HISTORIQUE: { id: string; logementNom: string; date: string; type: string; statut: string }[] = [
  { id: "h1", logementNom: "Villa Cap Ferret", date: "25/03/2026", type: "grand_menage", statut: "terminee" },
  { id: "h2", logementNom: "T3 Vieux-Port Marseille", date: "24/03/2026", type: "standard", statut: "terminee" },
  { id: "h3", logementNom: "Loft Paris 11e", date: "23/03/2026", type: "depart", statut: "terminee" },
];

const TYPE_LABELS: Record<string, string> = { standard: "Standard", depart: "Ménage départ", grand_menage: "Grand ménage" };
const TYPE_COLORS: Record<string, string> = { standard: "bg-blue-50 text-blue-600", depart: "bg-amber-50 text-amber-600", grand_menage: "bg-purple-50 text-purple-600" };

type TabKey = "missions" | "historique" | "messages" | "profil";

export function PrestataireDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("missions");
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);
  const [activeMission, setActiveMission] = useState<string | null>(null);

  // [MBA] CDC Conciergerie — démarrer mission avec horodatage
  const startMission = (id: string) => {
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMissions(prev => prev.map(m => m.id === id ? { ...m, statut: "en_cours", heureDebut: now } : m));
    setActiveMission(id);
    toast.success(`Mission démarrée à ${now}`);
  };

  // [MBA] CDC Conciergerie — terminer mission avec horodatage
  const endMission = (id: string) => {
    const mission = missions.find(m => m.id === id);
    const allDone = mission?.checklist.every(c => c.done);
    if (!allDone) { toast.error("Complétez toute la check-list avant de terminer"); return; }
    if (!mission?.photos.length) { toast.error("Ajoutez au moins 1 photo avant de terminer"); return; }
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMissions(prev => prev.map(m => m.id === id ? { ...m, statut: "terminee", heureFin: now } : m));
    setActiveMission(null);
    toast.success(`Mission terminée à ${now}`);
  };

  // [MBA] CDC Conciergerie — toggle checklist
  const toggleChecklist = (missionId: string, idx: number) => {
    setMissions(prev => prev.map(m =>
      m.id === missionId ? { ...m, checklist: m.checklist.map((c, i) => i === idx ? { ...c, done: !c.done } : c) } : m
    ));
  };

  // [MBA] CDC Conciergerie — simuler upload photo avec horodatage
  const handlePhotoUpload = (missionId: string) => {
    const timestamp = new Date().toISOString();
    setMissions(prev => prev.map(m =>
      m.id === missionId ? { ...m, photos: [...m.photos, { url: `photo-${m.photos.length + 1}`, timestamp }] } : m
    ));
    toast.success("Photo ajoutée avec horodatage");
  };

  const currentMission = activeMission ? missions.find(m => m.id === activeMission) : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 md:pb-0">
      {/* [MBA] CDC Conciergerie — header prestataire */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-900">Mes missions</h1>
        <p className="text-xs text-gray-500">
          {missions.filter(m => m.statut === "a_faire").length} mission(s) aujourd'hui
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* [MBA] CDC Conciergerie — onglet Missions */}
        {activeTab === "missions" && (
          <>
            {/* Mission active en cours */}
            {currentMission && currentMission.statut === "en_cours" && (
              <Card className="border-green-500 border-2 shadow-md">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-700 text-xs">En cours</Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Démarré à {currentMission.heureDebut}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentMission.logementNom}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {currentMission.adresse}</p>
                  </div>

                  {/* Check-list interactive */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Check-list — {currentMission.checklist.filter(c => c.done).length}/{currentMission.checklist.length}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                      <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${(currentMission.checklist.filter(c => c.done).length / currentMission.checklist.length) * 100}%` }} />
                    </div>
                    <div className="space-y-2">
                      {currentMission.checklist.map((item, idx) => (
                        <label key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 cursor-pointer min-h-[44px]">
                          <Checkbox checked={item.done} onCheckedChange={() => toggleChecklist(currentMission.id, idx)} />
                          <span className={`text-sm ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Upload photos */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Photos ({currentMission.photos.length})</p>
                    <div className="flex gap-2 flex-wrap">
                      {currentMission.photos.map((p, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 border border-gray-300">
                          <Camera className="h-4 w-4" />
                        </div>
                      ))}
                      <button onClick={() => handlePhotoUpload(currentMission.id)}
                        className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 transition-colors min-h-[44px]"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="text-[9px] mt-0.5">Photo</span>
                      </button>
                    </div>
                  </div>

                  {/* Bouton terminer */}
                  <Button onClick={() => endMission(currentMission.id)}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white gap-2 text-base"
                  >
                    <Square className="h-4 w-4" /> Terminer la mission
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Liste des missions à faire */}
            {missions.filter(m => m.statut === "a_faire").map(mission => (
              <Card key={mission.id} className="shadow-md border-gray-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${TYPE_COLORS[mission.type]}`}>{TYPE_LABELS[mission.type]}</Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {mission.heure}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{mission.logementNom}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {mission.adresse}</p>
                  </div>
                  <p className="text-xs text-gray-400">{mission.checklist.length} tâches · {TYPE_LABELS[mission.type]}</p>
                  <Button onClick={() => startMission(mission.id)}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white gap-2 text-base"
                    disabled={!!activeMission}
                  >
                    <Play className="h-4 w-4" /> Démarrer la mission
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Missions terminées */}
            {missions.filter(m => m.statut === "terminee").length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-400 mb-2">Terminées aujourd'hui</p>
                {missions.filter(m => m.statut === "terminee").map(mission => (
                  <div key={mission.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{mission.logementNom}</p>
                      <p className="text-xs text-gray-400">{mission.heureDebut} → {mission.heureFin} · {mission.photos.length} photo(s)</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {missions.filter(m => m.statut !== "terminee").length === 0 && !activeMission && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                <p className="text-gray-500">Toutes les missions sont terminées</p>
                <p className="text-xs text-gray-400 mt-1">Bonne journée !</p>
              </div>
            )}
          </>
        )}

        {/* [MBA] CDC Conciergerie — onglet Historique */}
        {activeTab === "historique" && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 mb-3">Dernières missions</p>
            {MOCK_HISTORIQUE.map(h => (
              <div key={h.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{h.logementNom}</p>
                  <p className="text-xs text-gray-400">{h.date} · {TYPE_LABELS[h.type] || h.type}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>
            ))}
          </div>
        )}

        {/* [MBA] CDC Conciergerie — onglet Messages */}
        {activeTab === "messages" && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun message</p>
            <p className="text-xs text-gray-400 mt-1">Les messages de votre manager apparaîtront ici</p>
          </div>
        )}

        {/* [MBA] CDC Conciergerie — onglet Profil */}
        {activeTab === "profil" && (
          <div className="space-y-4">
            <Card className="shadow-md border-gray-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Fatima Bouazza</p>
                    <p className="text-xs text-gray-500">Agent d'entretien</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div><p className="text-xs text-gray-400">Missions ce mois</p><p className="text-lg font-semibold text-gray-900">24</p></div>
                  <div><p className="text-xs text-gray-400">Note moyenne</p><p className="text-lg font-semibold text-gray-900">4.8/5</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* [MBA] CDC Conciergerie — tab bar mobile en bas */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-20">
        <div className="flex justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {([
            { key: "missions" as TabKey, icon: Briefcase, label: "Missions" },
            { key: "historique" as TabKey, icon: History, label: "Historique" },
            { key: "messages" as TabKey, icon: MessageSquare, label: "Messages" },
            { key: "profil" as TabKey, icon: User, label: "Profil" },
          ]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 min-h-[44px] min-w-[44px] transition-colors ${activeTab === tab.key ? "text-green-600" : "text-gray-400"}`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
