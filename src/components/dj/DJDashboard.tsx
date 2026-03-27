import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import { SectorStepper } from "@/components/admin/SectorStepper";
import {
  DJ_KPIS, DJ_STEPS, MOCK_DJ_PRESTATIONS,
} from "@/data/mockDJData";
import {
  Music, Euro, CalendarDays, Users, FileText, Plus,
} from "lucide-react";
import { toast } from "sonner";

export function DJDashboard() {
  const [tab, setTab] = useState<"agenda" | "facturation">("agenda");
  const [showDevis, setShowDevis] = useState(false);

  const kpiCards = [
    { title: "À venir", value: DJ_KPIS.prestationsAVenir, icon: CalendarDays, color: "text-blue-400" },
    { title: "Réalisées", value: DJ_KPIS.prestationsRealisees, icon: Music, color: "text-green-400" },
    { title: "CA total", value: `${DJ_KPIS.caTotal.toLocaleString()} €`, icon: Euro, color: "text-amber-400" },
    { title: "Devis en attente", value: DJ_KPIS.devisEnAttente, icon: FileText, color: "text-violet-400" },
  ];

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}><SectorOnboardingBanner /></motion.div>

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" /> Espace Gérant / Artiste
        </h1>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map((k) => (
          <Card key={k.title}>
            <CardContent className="p-4 flex items-center gap-3">
              <k.icon className={`h-5 w-5 ${k.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{k.title}</p>
                <p className="text-lg font-bold">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="flex gap-2">
        <Button size="sm" variant={tab === "agenda" ? "default" : "outline"} onClick={() => setTab("agenda")} className="gap-1">
          <CalendarDays className="h-3.5 w-3.5" /> Agenda
        </Button>
        <Button size="sm" variant={tab === "facturation" ? "default" : "outline"} onClick={() => setTab("facturation")} className="gap-1">
          <Euro className="h-3.5 w-3.5" /> Facturation
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setShowDevis(true)} className="gap-1 ml-auto">
          <Plus className="h-3.5 w-3.5" /> Créer devis
        </Button>
      </motion.div>

      {tab === "agenda" && (
        <motion.div variants={staggerItem} className="space-y-3">
          {MOCK_DJ_PRESTATIONS.sort((a, b) => a.date.localeCompare(b.date)).map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{p.clientNom} — {p.typeAnimation}</p>
                    <p className="text-xs text-muted-foreground">{p.date} · {p.lieu} · {p.duree}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{DJ_STEPS[p.etape] || DJ_STEPS[0]}</Badge>
                </div>
                <SectorStepper currentStep={p.etape} />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" /> {p.artisteAssigne}
                  <span>·</span>
                  <span>{p.options.join(", ")}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {tab === "facturation" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Acomptes & soldes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_DJ_PRESTATIONS.map((p) => (
                <div key={p.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{p.clientNom}</p>
                    <p className="text-xs text-muted-foreground">{p.typeAnimation} · {p.date}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-bold">{p.montant.toLocaleString()} €</p>
                    <p className="text-xs text-muted-foreground">
                      Acompte {p.acompte.toLocaleString()} € {p.acompteRecu ? "✓" : "⏳"} · Solde {p.solde.toLocaleString()} €
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Dialog création devis */}
      <Dialog open={showDevis} onOpenChange={setShowDevis}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Créer un devis événement</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Devis créé (mock)"); setShowDevis(false); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Client</Label><Input placeholder="Nom du client" /></div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Lieu</Label><Input placeholder="Lieu de l'événement" /></div>
              <div className="space-y-2">
                <Label>Type d'animation</Label>
                <Select defaultValue="mariage">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Mariage", "Soirée entreprise", "Anniversaire", "Festival", "Autre"].map((t) => (
                      <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Durée</Label><Input placeholder="ex: 5h (20h-01h)" /></div>
              <div className="space-y-2"><Label>Montant (€)</Label><Input type="number" placeholder="1500" /></div>
            </div>
            <div className="space-y-2">
              <Label>Options</Label>
              <Input placeholder="Sono, éclairage, machine à fumée..." />
            </div>
            <Button type="submit" className="w-full">Créer le devis</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
