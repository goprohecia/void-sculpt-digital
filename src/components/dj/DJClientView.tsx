import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DJStepper } from "./DJStepper";
import { MOCK_DJ_PRESTATIONS } from "@/data/mockDJData";
import {
  Music, MapPin, CalendarDays, Clock, Users, FileSignature, Euro, CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export function DJClientView() {
  // Simulate client = Sophie & Julien (dj1)
  const presta = MOCK_DJ_PRESTATIONS.find((p) => p.id === "dj1")!;
  const [devisSigned, setDevisSigned] = useState(false);

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" /> Mon événement
        </h1>
        <p className="text-muted-foreground text-sm">{presta.typeAnimation} · {presta.clientNom}</p>
      </motion.div>

      {/* Fiche événement */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base">Détails de l'événement</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><p className="text-sm font-medium">{presta.date}</p><p className="text-xs text-muted-foreground">{presta.duree}</p></div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><p className="text-sm font-medium">{presta.lieu}</p><p className="text-xs text-muted-foreground">{presta.adresse}</p></div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><p className="text-sm font-medium">{presta.artisteAssigne}</p><p className="text-xs text-muted-foreground">Artiste / Animateur</p></div>
              </div>
              <div className="flex items-start gap-2">
                <Music className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><p className="text-sm font-medium">{presta.options.join(", ")}</p><p className="text-xs text-muted-foreground">Options incluses</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stepper */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base">Avancement</CardTitle></CardHeader>
          <CardContent><DJStepper currentStep={presta.etape} /></CardContent>
        </Card>
      </motion.div>

      {/* Devis signable */}
      <motion.div variants={staggerItem}>
        <Card className={devisSigned ? "border-green-500/30" : "border-amber-500/30"}>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileSignature className="h-4 w-4" /> Devis</CardTitle></CardHeader>
          <CardContent>
            {devisSigned ? (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Devis signé le {new Date().toLocaleDateString("fr-FR")}</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded border">
                  <p className="text-sm font-medium">{presta.typeAnimation} — {presta.lieu}</p>
                  <p className="text-xs text-muted-foreground">{presta.date} · {presta.duree}</p>
                  <p className="text-xs text-muted-foreground mt-1">Options : {presta.options.join(", ")}</p>
                  <p className="text-lg font-bold mt-2">{presta.montant.toLocaleString()} €</p>
                </div>
                <Button onClick={() => { setDevisSigned(true); toast.success("Devis signé ✓"); }} className="gap-1">
                  <FileSignature className="h-4 w-4" /> Signer le devis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Statut financier */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Euro className="h-4 w-4" /> Paiement</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded border">
              <span className="text-sm">Acompte (50%)</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{presta.acompte.toLocaleString()} €</span>
                <Badge variant={presta.acompteRecu ? "default" : "secondary"} className="text-xs">
                  {presta.acompteRecu ? "Reçu ✓" : "En attente"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded border">
              <span className="text-sm">Solde</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{presta.solde.toLocaleString()} €</span>
                <Badge variant={presta.etape >= 6 ? "default" : "outline"} className="text-xs">
                  {presta.etape >= 6 ? "Réglé" : "Après prestation"}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t text-sm font-bold">
              <span>Total</span>
              <span>{presta.montant.toLocaleString()} €</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline déroulé */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Déroulé de la soirée</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-0">
              {presta.deroulement.map((d, i) => (
                <div key={i} className="flex gap-3 pb-3 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    {i < presta.deroulement.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{d.heure}</p>
                    <p className="text-xs text-muted-foreground">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
