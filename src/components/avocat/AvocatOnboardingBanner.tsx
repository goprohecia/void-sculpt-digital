import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Scale, Users, Receipt, CalendarDays, MessageSquare, BarChart3, FileText, Clock } from "lucide-react";

export function AvocatOnboardingBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent relative">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setVisible(false)}>
        <X className="h-3 w-3" />
      </Button>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Offre recommandée pour un Cabinet d'Avocats</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-primary/20 text-primary border-primary/30">Enterprise 500€/mois</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Users, label: "Clients & Affaires" },
            { icon: Receipt, label: "Honoraires" },
            { icon: FileText, label: "Pièces juridiques" },
            { icon: CalendarDays, label: "Audiences" },
            { icon: Clock, label: "Heures facturables" },
            { icon: MessageSquare, label: "Messagerie sécurisée" },
            { icon: BarChart3, label: "Analyse" },
          ].map((m) => (
            <Badge key={m.label} variant="secondary" className="text-xs gap-1">
              <m.icon className="h-3 w-3" /> {m.label}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic">
          "La signature électronique + confidentialité des échanges + suivi dossier client = valeur perçue très élevée."
        </p>
      </CardContent>
    </Card>
  );
}
