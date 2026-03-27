// [MBA] Module Logements interactif — modal ajout réservation + blocage de dates
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CalendarDays, Ban, Plus } from "lucide-react";
import { toast } from "sonner";
import type { ConciergerieReservation } from "@/data/mockConciergerieData";

// [MBA] Module Logements interactif — modal double : réservation ou blocage
type ModalMode = "reservation" | "block";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logementId: string;
  logementNom: string;
  defaultDate?: string;
  onAddReservation: (resa: ConciergerieReservation) => void;
  onBlockDates?: (block: { dateDebut: string; dateFin: string; motif: string }) => void;
}

export function ReservationFormModal({ open, onOpenChange, logementId, logementNom, defaultDate, onAddReservation, onBlockDates }: Props) {
  const [mode, setMode] = useState<ModalMode>("reservation");
  // Réservation
  const [voyageur, setVoyageur] = useState("");
  const [dateArrivee, setDateArrivee] = useState(defaultDate || "");
  const [dateDepart, setDateDepart] = useState("");
  const [nbVoyageurs, setNbVoyageurs] = useState("2");
  const [plateforme, setPlateforme] = useState<string>("Airbnb");
  const [montant, setMontant] = useState("");
  // Blocage
  const [blockDebut, setBlockDebut] = useState(defaultDate || "");
  const [blockFin, setBlockFin] = useState("");
  const [blockMotif, setBlockMotif] = useState("usage_personnel");

  const inputCls = "h-10 text-sm bg-white border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20";

  const handleAddReservation = () => {
    if (!voyageur.trim()) { toast.error("Le nom du voyageur est requis"); return; }
    if (!dateArrivee || !dateDepart) { toast.error("Les dates sont requises"); return; }
    if (dateDepart <= dateArrivee) { toast.error("La date de départ doit être après l'arrivée"); return; }

    const resa: ConciergerieReservation = {
      id: `resa-${Date.now()}`,
      bienId: logementId,
      bienNom: logementNom,
      voyageurNom: voyageur.trim(),
      dateArrivee,
      dateDepart,
      etape: 0,
      agentId: "",
      agentNom: "",
      proprietaireId: "",
      montantSejour: parseInt(montant) || 0,
      plateforme: plateforme as ConciergerieReservation["plateforme"],
    };

    onAddReservation(resa);
    toast.success(`Réservation ajoutée pour ${voyageur}`);
    onOpenChange(false);
    setVoyageur(""); setDateArrivee(""); setDateDepart(""); setMontant("");
  };

  const handleBlockDates = () => {
    if (!blockDebut || !blockFin) { toast.error("Les dates sont requises"); return; }
    if (blockFin <= blockDebut) { toast.error("La date de fin doit être après le début"); return; }
    onBlockDates?.({ dateDebut: blockDebut, dateFin: blockFin, motif: blockMotif });
    toast.success("Dates bloquées");
    onOpenChange(false);
    setBlockDebut(""); setBlockFin("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "reservation" ? <CalendarDays className="h-5 w-5 text-green-600" /> : <Ban className="h-5 w-5 text-red-500" />}
            {mode === "reservation" ? "Ajouter une réservation" : "Bloquer des dates"}
          </DialogTitle>
        </DialogHeader>

        {/* [MBA] Module Logements interactif — switch mode */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          <button onClick={() => setMode("reservation")} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "reservation" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            Réservation
          </button>
          <button onClick={() => setMode("block")} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "block" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            Bloquer dates
          </button>
        </div>

        <p className="text-xs text-gray-500">Logement : <strong className="text-gray-700">{logementNom}</strong></p>

        {mode === "reservation" ? (
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Nom du voyageur *</label>
              <Input value={voyageur} onChange={e => setVoyageur(e.target.value)} placeholder="John Smith" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Check-in *</label>
                <Input type="date" value={dateArrivee} onChange={e => setDateArrivee(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Check-out *</label>
                <Input type="date" value={dateDepart} onChange={e => setDateDepart(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Voyageurs</label>
                <Input type="number" value={nbVoyageurs} onChange={e => setNbVoyageurs(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Plateforme</label>
                <Select value={plateforme} onValueChange={setPlateforme}>
                  <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Airbnb">Airbnb</SelectItem>
                    <SelectItem value="Booking">Booking</SelectItem>
                    <SelectItem value="Vrbo">Vrbo</SelectItem>
                    <SelectItem value="Direct">Réservation directe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Montant total (€)</label>
              <Input type="number" value={montant} onChange={e => setMontant(e.target.value)} placeholder="480" className={inputCls} />
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Date début *</label>
                <Input type="date" value={blockDebut} onChange={e => setBlockDebut(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Date fin *</label>
                <Input type="date" value={blockFin} onChange={e => setBlockFin(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Motif</label>
              <Select value={blockMotif} onValueChange={setBlockMotif}>
                <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="usage_personnel">Usage personnel</SelectItem>
                  <SelectItem value="travaux">Travaux</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center gap-2">
              <Ban className="h-3.5 w-3.5 shrink-0" />
              Non synchronisé — les plateformes ne seront pas mises à jour automatiquement
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          {mode === "reservation" ? (
            <Button onClick={handleAddReservation} className="bg-green-600 hover:bg-green-700 text-white gap-1.5"><Plus className="h-4 w-4" /> Ajouter</Button>
          ) : (
            <Button onClick={handleBlockDates} className="bg-red-600 hover:bg-red-700 text-white gap-1.5"><Ban className="h-4 w-4" /> Bloquer</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
