import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  MOCK_SPORT_MEMBRES, MOCK_SPORT_SEANCES_COACH, MOCK_SPORT_COACHS,
} from "@/data/mockSportData";
import {
  Dumbbell, Users, CalendarDays, AlertTriangle, ClipboardCheck, Clock,
} from "lucide-react";
import { toast } from "sonner";

export function SportCoachView() {
  const [showBilan, setShowBilan] = useState(false);
  const [bilanMembre, setBilanMembre] = useState<string | null>(null);
  const [bilanForm, setBilanForm] = useState({ poids: "", tourBras: "", tourTaille: "", tourCuisses: "", notes: "" });

  // Simulate current coach = sc1
  const mesMembres = MOCK_SPORT_MEMBRES.filter((m) => m.coachId === "sc1");
  const alertes = mesMembres.filter((m) => {
    if (!m.derniereSeance) return true;
    const diff = (new Date("2026-03-10").getTime() - new Date(m.derniereSeance).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 14;
  });

  const handleBilan = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bilan enregistré (mock)");
    setShowBilan(false);
    setBilanForm({ poids: "", tourBras: "", tourTaille: "", tourCuisses: "", notes: "" });
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" /> Espace Coach
        </h1>
        <p className="text-muted-foreground text-sm">
          {mesMembres.length} membres assignés · {MOCK_SPORT_SEANCES_COACH.length} séances cette semaine
        </p>
      </motion.div>

      {alertes.length > 0 && (
        <motion.div variants={staggerItem}>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 space-y-1">
              <p className="text-sm font-medium flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" /> Membres sans séance depuis &gt; 2 semaines
              </p>
              {alertes.map((a) => (
                <p key={a.id} className="text-xs text-muted-foreground ml-6">
                  • {a.nom} — dernière séance : {a.derniereSeance || "aucune"}
                </p>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Mes membres */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Mes membres</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {mesMembres.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">{m.nom}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.objectifs.join(", ")} · Dernière séance : {m.derniereSeance || "—"}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setBilanMembre(m.nom); setShowBilan(true); }} className="gap-1">
                  <ClipboardCheck className="h-3.5 w-3.5" /> Bilan
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Planning séances perso */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Planning séances perso</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Membre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_SPORT_SEANCES_COACH.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-sm">{s.date}</TableCell>
                    <TableCell className="text-sm">{s.heure}</TableCell>
                    <TableCell className="font-medium text-sm">{s.membreNom}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{s.type}</Badge></TableCell>
                    <TableCell className="text-sm">{s.duree} min</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{s.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog bilan */}
      <Dialog open={showBilan} onOpenChange={setShowBilan}>
        <DialogContent>
          <DialogHeader><DialogTitle>Saisie bilan — {bilanMembre}</DialogTitle></DialogHeader>
          <form onSubmit={handleBilan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Poids (kg)</Label><Input type="number" step="0.1" value={bilanForm.poids} onChange={(e) => setBilanForm((f) => ({ ...f, poids: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Tour de bras (cm)</Label><Input type="number" value={bilanForm.tourBras} onChange={(e) => setBilanForm((f) => ({ ...f, tourBras: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Tour de taille (cm)</Label><Input type="number" value={bilanForm.tourTaille} onChange={(e) => setBilanForm((f) => ({ ...f, tourTaille: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Tour de cuisses (cm)</Label><Input type="number" value={bilanForm.tourCuisses} onChange={(e) => setBilanForm((f) => ({ ...f, tourCuisses: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Notes / Objectifs atteints</Label><Input value={bilanForm.notes} onChange={(e) => setBilanForm((f) => ({ ...f, notes: e.target.value }))} /></div>
            <Button type="submit" className="w-full">Enregistrer le bilan</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
