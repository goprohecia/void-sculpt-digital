// [MBA] Module Logements interactif — modal création logement
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, X, Home, Lock, Link2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { ConciergerieBien } from "@/data/mockConciergerieData";

const TYPES = [
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "villa", label: "Villa" },
  { value: "studio", label: "Studio" },
  { value: "loft", label: "Loft" },
  { value: "chambre_hotes", label: "Chambre d'hôtes" },
  { value: "gite", label: "Gîte" },
];

const DEFAULT_CHECKLIST = [
  "Aspirateur salon et chambres",
  "Laver sol cuisine",
  "Changer draps et serviettes",
  "Nettoyer salle de bain",
  "Vider poubelles",
  "Vérifier équipements",
  "Recharger produits d'accueil",
];

const PROPRIETAIRES = [
  { id: "prop-1", nom: "M. Dupont" },
  { id: "prop-2", nom: "Mme Bernard" },
  { id: "prop-3", nom: "M. Lefèvre" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (logement: ConciergerieBien) => void;
}

export function LogementCreateModal({ open, onOpenChange, onSave }: Props) {
  const [nom, setNom] = useState("");
  const [type, setType] = useState<string>("appartement");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [surface, setSurface] = useState("");
  const [capacite, setCapacite] = useState("2");
  const [etage, setEtage] = useState("");
  const [codeAcces, setCodeAcces] = useState("");
  const [instructionsAcces, setInstructionsAcces] = useState("");
  const [proprietaireId, setProprietaireId] = useState("");
  const [airbnbEnabled, setAirbnbEnabled] = useState(false);
  const [airbnbUrl, setAirbnbUrl] = useState("");
  const [bookingEnabled, setBookingEnabled] = useState(false);
  const [bookingUrl, setBookingUrl] = useState("");
  const [vrboEnabled, setVrboEnabled] = useState(false);
  const [vrboUrl, setVrboUrl] = useState("");
  const [directEnabled, setDirectEnabled] = useState(false);
  const [instructionsMenage, setInstructionsMenage] = useState("");
  const [tarifNuit, setTarifNuit] = useState("");
  const [checklist, setChecklist] = useState<string[]>([...DEFAULT_CHECKLIST]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setChecklist(prev => [...prev, newTask.trim()]);
    setNewTask("");
  };
  const removeTask = (idx: number) => setChecklist(prev => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!nom.trim()) { toast.error("Le nom du logement est requis"); return; }
    if (!adresse.trim()) { toast.error("L'adresse est requise"); return; }
    if (!ville.trim()) { toast.error("La ville est requise"); return; }
    if (!proprietaireId) { toast.error("Sélectionnez un propriétaire"); return; }

    const plateformes: ConciergerieBien["plateformes"] = [];
    if (airbnbEnabled) plateformes.push("Airbnb");
    if (bookingEnabled) plateformes.push("Booking");
    if (vrboEnabled) plateformes.push("Vrbo");
    if (directEnabled) plateformes.push("Direct");

    const propNom = PROPRIETAIRES.find(p => p.id === proprietaireId)?.nom || "";

    const logement: ConciergerieBien = {
      id: `bien-${Date.now()}`,
      nom: nom.trim(),
      type: type as ConciergerieBien["type"],
      adresse: `${adresse.trim()}, ${ville.trim()}`,
      ville: ville.trim(),
      proprietaireId,
      proprietaireNom: propNom,
      capacite: parseInt(capacite) || 2,
      surface: surface ? parseInt(surface) : undefined,
      etage: etage || undefined,
      codeAcces: codeAcces || undefined,
      photo: "/placeholder.svg",
      tauxOccupation: 0,
      revenuMensuel: 0,
      commissionConciergerie: 0,
      plateformes,
      statut: "disponible",
      instructionsMenage: instructionsMenage || undefined,
      equipements: [],
      tarifNuit: tarifNuit ? parseInt(tarifNuit) : undefined,
      lienAirbnb: airbnbUrl || undefined,
      lienBooking: bookingUrl || undefined,
      lienVrbo: vrboUrl || undefined,
    };

    onSave(logement);
    toast.success(`Logement "${nom}" créé`);
    onOpenChange(false);
    // Reset form
    setNom(""); setAdresse(""); setVille(""); setSurface(""); setCapacite("2");
    setEtage(""); setCodeAcces(""); setInstructionsAcces(""); setProprietaireId("");
    setAirbnbEnabled(false); setAirbnbUrl(""); setBookingEnabled(false); setBookingUrl("");
    setVrboEnabled(false); setVrboUrl(""); setDirectEnabled(false);
    setInstructionsMenage(""); setTarifNuit(""); setChecklist([...DEFAULT_CHECKLIST]);
  };

  const inputCls = "h-10 text-sm bg-white border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Home className="h-5 w-5 text-green-600" /> Ajouter un logement</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Informations principales */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Informations principales</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Nom du logement *</label>
                <Input value={nom} onChange={e => setNom(e.target.value)} placeholder="Appartement Vue Mer Marseille" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Type de bien *</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Propriétaire *</label>
                <Select value={proprietaireId} onValueChange={setProprietaireId}>
                  <SelectTrigger className={inputCls}><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{PROPRIETAIRES.map(p => <SelectItem key={p.id} value={p.id}>{p.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Adresse *</label>
                <Input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="12 rue de la Roquette" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Ville *</label>
                <Input value={ville} onChange={e => setVille(e.target.value)} placeholder="Paris" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Étage</label>
                <Input value={etage} onChange={e => setEtage(e.target.value)} placeholder="3e" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Surface (m²)</label>
                <Input type="number" value={surface} onChange={e => setSurface(e.target.value)} placeholder="55" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Capacité (voyageurs)</label>
                <Input type="number" value={capacite} onChange={e => setCapacite(e.target.value)} placeholder="4" className={inputCls} />
              </div>
            </div>
          </section>

          {/* Accès et sécurité */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Lock className="h-4 w-4 text-gray-400" /> Accès et sécurité</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Code d'accès / digicode</label>
                <Input value={codeAcces} onChange={e => setCodeAcces(e.target.value)} placeholder="4521B" className={inputCls} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Instructions d'accès</label>
                <Textarea value={instructionsAcces} onChange={e => setInstructionsAcces(e.target.value)} placeholder="Boîte à clés à droite de la porte..." rows={2} />
              </div>
            </div>
          </section>

          {/* Plateformes */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Link2 className="h-4 w-4 text-gray-400" /> Plateformes de réservation</h3>
            <div className="space-y-3">
              {([
                { key: "airbnb", label: "Airbnb", color: "text-rose-600", enabled: airbnbEnabled, setEnabled: setAirbnbEnabled, url: airbnbUrl, setUrl: setAirbnbUrl },
                { key: "booking", label: "Booking", color: "text-blue-600", enabled: bookingEnabled, setEnabled: setBookingEnabled, url: bookingUrl, setUrl: setBookingUrl },
                { key: "vrbo", label: "Vrbo", color: "text-indigo-600", enabled: vrboEnabled, setEnabled: setVrboEnabled, url: vrboUrl, setUrl: setVrboUrl },
              ] as const).map(p => (
                <div key={p.key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white">
                  <Checkbox checked={p.enabled} onCheckedChange={(v) => p.setEnabled(!!v)} />
                  <span className={`text-sm font-medium min-w-[70px] ${p.color}`}>{p.label}</span>
                  {p.enabled && (
                    <Input value={p.url} onChange={e => p.setUrl(e.target.value)} placeholder={`URL annonce ${p.label}...`} className="flex-1 h-8 text-xs" />
                  )}
                  <Button size="sm" variant="ghost" className="text-gray-400 gap-1 text-[10px]" disabled>
                    <RefreshCw className="h-3 w-3" /> Sync <Badge variant="secondary" className="text-[8px]">Bientot</Badge>
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white">
                <Checkbox checked={directEnabled} onCheckedChange={(v) => setDirectEnabled(!!v)} />
                <span className="text-sm font-medium text-gray-600">Réservation directe</span>
              </div>
            </div>
          </section>

          {/* Ménage */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Ménage</h3>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Tarif par nuit (€)</label>
              <Input type="number" value={tarifNuit} onChange={e => setTarifNuit(e.target.value)} placeholder="120" className={`${inputCls} w-32`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Instructions spéciales ménage</label>
              <Textarea value={instructionsMenage} onChange={e => setInstructionsMenage(e.target.value)} placeholder="Attention aux draps blancs..." rows={2} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Check-list ménage</label>
              <div className="space-y-1">
                {checklist.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded bg-gray-50 text-sm">
                    <span className="flex-1 text-gray-700">{task}</span>
                    <button onClick={() => removeTask(idx)} className="text-gray-400 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Nouvelle tâche..." className="flex-1 h-8 text-xs" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTask())} />
                  <Button size="sm" variant="outline" onClick={addTask} className="h-8 gap-1"><Plus className="h-3 w-3" /> Ajouter</Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white gap-1.5"><Plus className="h-4 w-4" /> Enregistrer le logement</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
