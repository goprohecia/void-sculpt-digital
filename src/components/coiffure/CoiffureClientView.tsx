import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CoiffureStepper } from "./CoiffureStepper";
import {
  MOCK_COIFFURE_PRATICIENS,
  MOCK_COIFFURE_PRESTATIONS,
  MOCK_COIFFURE_CRENEAUX,
  MOCK_COIFFURE_RDV,
  COIFFURE_STEPS,
  type CoiffureRDV,
} from "@/data/mockCoiffureData";
import { CalendarDays, Scissors, CreditCard, Clock, Bell } from "lucide-react";
import { toast } from "sonner";

export function CoiffureClientView() {
  const [myRdvs, setMyRdvs] = useState<CoiffureRDV[]>(
    MOCK_COIFFURE_RDV.filter((r) => r.clientId === "cl-1")
  );
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPraticien, setSelectedPraticien] = useState("");
  const [selectedPrestation, setSelectedPrestation] = useState("");
  const [selectedCreneau, setSelectedCreneau] = useState("");

  // Rappel J-1 simulé
  useEffect(() => {
    const tomorrow = myRdvs.find((r) => r.date === "2026-03-11" && r.etape < 4);
    if (tomorrow) {
      const timer = setTimeout(() => {
        toast("📅 Rappel RDV demain", {
          description: `${tomorrow.prestationNom} avec ${tomorrow.praticienNom} à ${tomorrow.heure}`,
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const filteredCreneaux = MOCK_COIFFURE_CRENEAUX.filter((c) => {
    if (selectedPraticien && c.praticienId !== selectedPraticien) return false;
    return true;
  });

  const bookRdv = () => {
    if (!selectedCreneau || !selectedPrestation) return;
    const creneau = MOCK_COIFFURE_CRENEAUX.find((c) => `${c.date}-${c.heure}-${c.praticienId}` === selectedCreneau);
    const prestation = MOCK_COIFFURE_PRESTATIONS.find((p) => p.id === selectedPrestation);
    if (!creneau || !prestation) return;

    const newRdv: CoiffureRDV = {
      id: `rdv-new-${Date.now()}`,
      clientNom: "Sophie Laurent",
      clientId: "cl-1",
      praticienId: creneau.praticienId,
      praticienNom: creneau.praticienNom,
      prestationNom: prestation.nom,
      duree: prestation.duree,
      prix: prestation.prix,
      date: creneau.date,
      heure: creneau.heure,
      etape: 0,
      acomptePaye: false,
      montantAcompte: 0,
    };
    setMyRdvs((prev) => [...prev, newRdv]);
    toast.success("Rendez-vous réservé !");
    setShowBooking(false);
    setSelectedCreneau("");
    setSelectedPrestation("");
    setSelectedPraticien("");
  };

  const payAcompte = (id: string) => {
    setMyRdvs((prev) => prev.map((r) =>
      r.id === id ? { ...r, acomptePaye: true, montantAcompte: Math.round(r.prix * 0.3), etape: Math.max(r.etape, 1) } : r
    ));
    toast.success("Acompte payé (simulation)");
  };

  const aVenir = myRdvs.filter((r) => r.etape < 4).sort((a, b) => `${a.date}${a.heure}`.localeCompare(`${b.date}${b.heure}`));
  const passees = myRdvs.filter((r) => r.etape >= 4).sort((a, b) => `${b.date}${b.heure}`.localeCompare(`${a.date}${a.heure}`));

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" /> Mes rendez-vous
          </h1>
          <p className="text-muted-foreground text-sm">Réservation et suivi de vos prestations</p>
        </div>
        <Button onClick={() => setShowBooking(!showBooking)}>
          <CalendarDays className="h-4 w-4 mr-1" /> Réserver
        </Button>
      </motion.div>

      {/* Réservation en ligne */}
      {showBooking && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nouvelle réservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Praticien (optionnel)</label>
                  <Select value={selectedPraticien} onValueChange={setSelectedPraticien}>
                    <SelectTrigger><SelectValue placeholder="Tous les praticiens" /></SelectTrigger>
                    <SelectContent>
                      {MOCK_COIFFURE_PRATICIENS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom} — {p.specialite}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Prestation</label>
                  <Select value={selectedPrestation} onValueChange={setSelectedPrestation}>
                    <SelectTrigger><SelectValue placeholder="Choisir une prestation" /></SelectTrigger>
                    <SelectContent>
                      {MOCK_COIFFURE_PRESTATIONS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.nom} — {p.duree}min · {p.prix}€</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Créneau</label>
                  <Select value={selectedCreneau} onValueChange={setSelectedCreneau}>
                    <SelectTrigger><SelectValue placeholder="Choisir un créneau" /></SelectTrigger>
                    <SelectContent>
                      {filteredCreneaux.map((c) => (
                        <SelectItem key={`${c.date}-${c.heure}-${c.praticienId}`} value={`${c.date}-${c.heure}-${c.praticienId}`}>
                          {c.date} à {c.heure} — {c.praticienNom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={bookRdv} disabled={!selectedCreneau || !selectedPrestation}>
                Confirmer la réservation
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* À venir */}
      <motion.div variants={staggerItem}>
        <h2 className="text-sm font-semibold mb-3">À venir ({aVenir.length})</h2>
        <div className="space-y-3">
          {aVenir.map((rdv) => (
            <Card key={rdv.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{rdv.prestationNom}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {rdv.date} à {rdv.heure} · {rdv.duree}min · {rdv.praticienNom}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">{rdv.prix} €</Badge>
                </div>
                <CoiffureStepper currentStep={rdv.etape} />
                {!rdv.acomptePaye && rdv.etape < 1 && (
                  <Button size="sm" variant="outline" onClick={() => payAcompte(rdv.id)}>
                    <CreditCard className="h-3 w-3 mr-1" /> Payer l'acompte ({Math.round(rdv.prix * 0.3)} €)
                  </Button>
                )}
                {rdv.acomptePaye && (
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <CreditCard className="h-2.5 w-2.5" /> Acompte de {rdv.montantAcompte}€ payé
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
          {aVenir.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun rendez-vous à venir.</p>
          )}
        </div>
      </motion.div>

      {/* Passées */}
      <motion.div variants={staggerItem}>
        <h2 className="text-sm font-semibold mb-3">Passées ({passees.length})</h2>
        <div className="space-y-2">
          {passees.map((rdv) => (
            <div key={rdv.id} className="glass-card p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{rdv.prestationNom}</p>
                <p className="text-xs text-muted-foreground">{rdv.date} · {rdv.praticienNom}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{rdv.prix} €</Badge>
                <Badge variant="outline" className="text-[10px]">{COIFFURE_STEPS[rdv.etape]}</Badge>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
