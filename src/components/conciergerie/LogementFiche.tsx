// [MBA] Module Gestion Logements — fiche logement détaillée
// En-tête sticky + 6 onglets : Calendrier, Réservations, Missions, Tarification, Documents, Statistiques
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  MOCK_CONCIERGERIE_INTERVENTIONS,
  type ConciergerieBien, type ConciergerieReservation,
} from "@/data/mockConciergerieData";
import { ReservationFormModal } from "@/components/conciergerie/ReservationFormModal";
import {
  Home, MapPin, Users as UsersIcon, ArrowLeft, Pencil, CalendarDays, ClipboardList,
  Euro, FileText, BarChart3, Lock, Key, Ban, Plus, Camera,
  ChevronLeft, ChevronRight, Star,
} from "lucide-react";

// [MBA] Module Gestion Logements — statuts
const STATUT_CONFIG: Record<string, { label: string; color: string }> = {
  disponible: { label: "Disponible", color: "bg-green-50 text-green-700 border-green-200" },
  reserve: { label: "Réservé", color: "bg-blue-50 text-blue-700 border-blue-200" },
  en_menage: { label: "En ménage", color: "bg-amber-50 text-amber-700 border-amber-200" },
  indisponible: { label: "Indisponible", color: "bg-red-50 text-red-700 border-red-200" },
  maintenance: { label: "Maintenance", color: "bg-gray-100 text-gray-600 border-gray-300" },
};

const PLATEFORME_COLORS: Record<string, string> = {
  Airbnb: "bg-rose-50 text-rose-600 border-rose-200", Booking: "bg-blue-50 text-blue-600 border-blue-200",
  Vrbo: "bg-indigo-50 text-indigo-600 border-indigo-200", Direct: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

// [MBA] Module Logements interactif — props depuis AdminLogements
interface Props {
  logementId: string;
  logements: ConciergerieBien[];
  reservations: ConciergerieReservation[];
  onBack?: () => void;
  onAddReservation: (resa: ConciergerieReservation) => void;
}

export function LogementFiche({ logementId, logements, reservations: allReservations, onBack, onAddReservation }: Props) {
  const bien = logements.find(b => b.id === logementId);
  const reservations = allReservations.filter(r => r.bienId === logementId);
  const missions = MOCK_CONCIERGERIE_INTERVENTIONS.filter(i => i.bienId === logementId);

  const [calMonth, setCalMonth] = useState(() => new Date(2026, 2));
  // [MBA] Module Logements interactif — modal réservation/blocage
  const [showResaModal, setShowResaModal] = useState(false);
  const [clickedDate, setClickedDate] = useState<string | undefined>();
  // [MBA] Module Logements interactif — dates bloquées (state local)
  const [blockedDates, setBlockedDates] = useState<{ dateDebut: string; dateFin: string; motif: string }[]>([]);

  if (!bien) {
    return (
      <div className="text-center py-12">
        <Home className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Logement introuvable</p>
        {onBack && <Button variant="outline" onClick={onBack} className="mt-3 gap-1"><ArrowLeft className="h-4 w-4" /> Retour</Button>}
      </div>
    );
  }

  const statut = STATUT_CONFIG[bien.statut] || STATUT_CONFIG.disponible;

  // [MBA] Module Gestion Logements — calendrier simple mensuel
  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay();
  const monthName = calMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  // Trouver les jours réservés
  const reservedDays: Record<number, { plateforme: string; voyageur: string }> = {};
  reservations.forEach(r => {
    const start = new Date(r.dateArrivee);
    const end = new Date(r.dateDepart);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getMonth() === calMonth.getMonth() && d.getFullYear() === calMonth.getFullYear()) {
        reservedDays[d.getDate()] = { plateforme: r.plateforme, voyageur: r.voyageurNom };
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* [MBA] Module Gestion Logements — en-tête sticky */}
      <div className="sticky top-0 z-10 bg-[#EDE9E3]/95 backdrop-blur-sm pb-4 -mx-1 px-1">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 gap-1"><ArrowLeft className="h-4 w-4" /> Retour aux logements</Button>
        )}
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                <Home className="h-8 w-8 text-gray-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-semibold text-gray-900">{bien.nom}</h1>
                  <Badge variant="outline" className={`text-xs ${statut.color}`}>{statut.label}</Badge>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {bien.adresse}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><UsersIcon className="h-3 w-3" /> {bien.capacite} voyageurs</span>
                  {bien.surface && <span>{bien.surface}m²</span>}
                  {bien.etage && <span>Étage: {bien.etage}</span>}
                  <span>Propriétaire: <strong className="text-gray-600">{bien.proprietaireNom}</strong></span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {bien.plateformes.map(p => <Badge key={p} variant="outline" className={`text-[10px] ${PLATEFORME_COLORS[p]}`}>{p}</Badge>)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Modifier</Button>
              <Button size="sm" variant="outline" className="gap-1.5"><Ban className="h-3.5 w-3.5" /> Bloquer dates</Button>
              <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"><Plus className="h-3.5 w-3.5" /> Mission ménage</Button>
            </div>
          </div>
        </div>
      </div>

      {/* [MBA] Module Gestion Logements — infos accès prestataire */}
      {(bien.codeAcces || bien.instructionsMenage) && (
        <Card className="border-gray-200 shadow-md">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Key className="h-4 w-4 text-green-600" /> Accès & Instructions</h3>
            {bien.codeAcces && (
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500">Code d'accès:</span>
                <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-900 font-mono text-xs">{bien.codeAcces}</code>
              </div>
            )}
            {bien.instructionsMenage && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                <p className="font-medium text-xs mb-1">Instructions ménage</p>
                <p>{bien.instructionsMenage}</p>
              </div>
            )}
            {bien.equipements && bien.equipements.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-1">
                {bien.equipements.map(eq => <Badge key={eq} variant="outline" className="text-[10px] text-gray-500">{eq}</Badge>)}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* [MBA] Module Gestion Logements — 6 onglets */}
      <Tabs defaultValue="calendrier" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-white border border-gray-200 shadow-sm rounded-xl p-1">
          <TabsTrigger value="calendrier" className="gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Calendrier</TabsTrigger>
          <TabsTrigger value="reservations" className="gap-1.5"><ClipboardList className="h-3.5 w-3.5" /> Réservations</TabsTrigger>
          <TabsTrigger value="missions" className="gap-1.5"><Camera className="h-3.5 w-3.5" /> Missions</TabsTrigger>
          <TabsTrigger value="tarification" className="gap-1.5"><Euro className="h-3.5 w-3.5" /> Tarification</TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Documents</TabsTrigger>
          <TabsTrigger value="stats" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Statistiques</TabsTrigger>
        </TabsList>

        {/* [MBA] Onglet Calendrier — channel manager simplifié */}
        <TabsContent value="calendrier" className="mt-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4 text-green-600" /> Calendrier des réservations</CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1))}><ChevronLeft className="h-4 w-4" /></Button>
                  <span className="text-sm font-medium capitalize min-w-[140px] text-center">{monthName}</span>
                  <Button size="sm" variant="ghost" onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1))}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-0.5">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(d => (
                  <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
                ))}
                {Array.from({ length: (firstDayOfWeek + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {/* [MBA] Module Logements interactif — jours cliquables */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const resa = reservedDays[day];
                  const dateStr = `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isBlocked = blockedDates.some(b => dateStr >= b.dateDebut && dateStr <= b.dateFin);
                  const platColor = resa ? { Airbnb: "bg-rose-200 text-rose-800", Booking: "bg-blue-200 text-blue-800", Vrbo: "bg-indigo-200 text-indigo-800", Direct: "bg-emerald-200 text-emerald-800" }[resa.plateforme] || "bg-gray-200" : "";
                  return (
                    <div key={day}
                      onClick={() => { if (!resa && !isBlocked) { setClickedDate(dateStr); setShowResaModal(true); } }}
                      className={`relative h-10 flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all ${
                        isBlocked ? "bg-gray-200 text-gray-400 line-through" :
                        resa ? platColor : "hover:bg-green-50 hover:border-green-300 border border-transparent text-gray-700"
                      }`}
                      title={isBlocked ? "Bloqué" : resa ? `${resa.voyageur} (${resa.plateforme})` : "Cliquer pour ajouter"}
                    >
                      {day}
                      {isBlocked && <Ban className="absolute top-0.5 right-0.5 h-2.5 w-2.5 text-gray-400" />}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-4 justify-center">
                {Object.entries(PLATEFORME_COLORS).map(([name, cls]) => (
                  <div key={name} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className={`h-3 w-3 rounded ${cls.split(" ")[0]}`} />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* [MBA] Onglet Réservations */}
        <TabsContent value="reservations" className="mt-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Réservations ({reservations.length})</CardTitle>
                <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white" onClick={() => { setClickedDate(undefined); setShowResaModal(true); }}><Plus className="h-3.5 w-3.5" /> Ajouter</Button>
              </div>
            </CardHeader>
            <CardContent>
              {reservations.length === 0 ? (
                <div className="text-center py-8"><CalendarDays className="h-10 w-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">Aucune réservation</p></div>
              ) : (
                <div className="space-y-2">
                  {reservations.map(r => (
                    <div key={r.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all">
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${PLATEFORME_COLORS[r.plateforme]}`}>{r.plateforme}</Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{r.voyageurNom}</p>
                        <p className="text-xs text-gray-400">{r.dateArrivee} → {r.dateDepart}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{r.montantSejour} €</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* [MBA] Onglet Missions ménage */}
        <TabsContent value="missions" className="mt-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-base">Missions ménage ({missions.length})</CardTitle></CardHeader>
            <CardContent>
              {missions.length === 0 ? (
                <div className="text-center py-8"><Camera className="h-10 w-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">Aucune mission</p></div>
              ) : (
                <div className="space-y-2">
                  {missions.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${m.statut === "terminé" ? "bg-green-50 text-green-600 border-green-200" : m.statut === "en_cours" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                        {m.statut === "terminé" ? "Terminée" : m.statut === "en_cours" ? "En cours" : "À faire"}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 capitalize">{m.type}</p>
                        <p className="text-xs text-gray-400">{m.date} · {m.heure} · {m.agentNom}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* [MBA] Onglet Tarification */}
        <TabsContent value="tarification" className="mt-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-base">Tarification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Tarif/nuit</p><p className="text-lg font-semibold text-gray-900">{bien.tarifNuit || "—"}€</p></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Revenu mensuel</p><p className="text-lg font-semibold text-gray-900">{bien.revenuMensuel.toLocaleString()}€</p></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Commission</p><p className="text-lg font-semibold text-green-600">{bien.commissionConciergerie.toLocaleString()}€</p></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Net propriétaire</p><p className="text-lg font-semibold text-gray-900">{(bien.revenuMensuel - bien.commissionConciergerie).toLocaleString()}€</p></div>
              </div>
              <p className="text-xs text-gray-400 text-center">Configuration tarifaire par saison — Bientôt disponible</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* [MBA] Onglet Documents */}
        <TabsContent value="documents" className="mt-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-base">Documents</CardTitle></CardHeader>
            <CardContent className="text-center py-8">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Aucun document</p>
              <Button size="sm" variant="outline" className="mt-3 gap-1.5"><Plus className="h-3.5 w-3.5" /> Ajouter un document</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* [MBA] Onglet Statistiques */}
        <TabsContent value="stats" className="mt-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-base">Statistiques</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Taux occupation</p><p className="text-xl font-semibold text-gray-900">{bien.tauxOccupation}%</p></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Réservations</p><p className="text-xl font-semibold text-gray-900">{reservations.length}</p></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Missions ménage</p><p className="text-xl font-semibold text-gray-900">{missions.length}</p></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Revenu total</p><p className="text-xl font-semibold text-green-600">{bien.revenuMensuel.toLocaleString()}€</p></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Durée moy. séjour</p><p className="text-xl font-semibold text-gray-900">3.5j</p></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-400">Note moyenne</p><p className="text-xl font-semibold text-amber-500 flex items-center justify-center gap-1"><Star className="h-4 w-4" /> 4.7</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* [MBA] Module Logements interactif — modal réservation/blocage */}
      {bien && (
        <ReservationFormModal
          open={showResaModal}
          onOpenChange={setShowResaModal}
          logementId={bien.id}
          logementNom={bien.nom}
          defaultDate={clickedDate}
          onAddReservation={onAddReservation}
          onBlockDates={(block) => setBlockedDates(prev => [...prev, block])}
        />
      )}
    </div>
  );
}
