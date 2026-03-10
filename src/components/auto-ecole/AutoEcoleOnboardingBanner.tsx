import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Car, Users, Receipt, CalendarDays, MessageSquare, BarChart3, Package } from "lucide-react";

export function AutoEcoleOnboardingBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent relative">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setVisible(false)}>
        <X className="h-3 w-3" />
      </Button>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Offre recommandée pour une Auto-École</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-primary/20 text-primary border-primary/30">Business 250€/mois</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Users, label: "Clients & Dossiers" },
            { icon: Receipt, label: "Facturation" },
            { icon: CalendarDays, label: "Planning conduite" },
            { icon: Package, label: "Véhicules" },
            { icon: MessageSquare, label: "Messagerie" },
            { icon: BarChart3, label: "Analyse" },
          ].map((m) => (
            <Badge key={m.label} variant="secondary" className="text-xs gap-1">
              <m.icon className="h-3 w-3" /> {m.label}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic">
          "Le suivi d'heures en espace élève + calendrier moniteurs = gain de temps massif pour le secrétariat."
        </p>
      </CardContent>
    </Card>
  );
}
