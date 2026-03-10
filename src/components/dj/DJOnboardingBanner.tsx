import { Card, CardContent } from "@/components/ui/card";
import { Music, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function DJOnboardingBanner() {
  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Music className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Offre recommandée : Business — 250 € / mois</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Contrat signé + fiche événement en espace client = zéro malentendu le jour J.
          </p>
        </div>
        <Button size="sm" variant="default" asChild className="gap-1 flex-shrink-0">
          <Link to="/admin/parametres"><span>Souscrire</span><ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </CardContent>
    </Card>
  );
}
