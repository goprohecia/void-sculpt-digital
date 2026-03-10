import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Calculator, Users, Receipt, CalendarDays, FileText, Clock, BarChart3, Upload } from "lucide-react";

export function ComptableOnboardingBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent relative">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setVisible(false)}>
        <X className="h-3 w-3" />
      </Button>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Offre recommandée pour un Cabinet d'Expert-Comptable</span>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30">Enterprise 500€/mois</Badge>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Users, label: "Portefeuille clients" },
            { icon: Receipt, label: "Honoraires" },
            { icon: FileText, label: "Pièces & Déclarations" },
            { icon: CalendarDays, label: "Échéancier fiscal" },
            { icon: Upload, label: "Dépôt documents" },
            { icon: Clock, label: "Heures facturables" },
            { icon: BarChart3, label: "Analyse" },
          ].map((m) => (
            <Badge key={m.label} variant="secondary" className="text-xs gap-1">
              <m.icon className="h-3 w-3" /> {m.label}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic">
          "L'espace client avec dépôt de documents + signature électronique transforme la relation cabinet-client."
        </p>
      </CardContent>
    </Card>
  );
}
