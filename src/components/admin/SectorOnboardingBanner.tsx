// [MBA] Composant générique remplaçant les 23 banners spécifiques par secteur
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoPlan, SECTORS, DEFAULT_SECTOR_RECOMMENDATIONS } from "@/contexts/DemoPlanContext";
import { GENERIC_MODULE_LABELS } from "@/data/sectorModules";

export function SectorOnboardingBanner() {
  const { demoSector, getModuleLabel } = useDemoPlan();

  if (!demoSector) return null;

  const sectorInfo = SECTORS.find((s) => s.key === demoSector);
  const recommendations = DEFAULT_SECTOR_RECOMMENDATIONS[demoSector] || [];
  const moduleLabels = recommendations
    .slice(0, 6)
    .map((key) => getModuleLabel(key))
    .join(", ");

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">
          Offre Business 250€/mois — recommandée pour {sectorInfo?.label || demoSector}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Modules : Clients & Dossiers, {moduleLabels}
        </p>
      </div>
      <Link
        to={`/contact?subject=Upgrade%20Business%20${encodeURIComponent(sectorInfo?.label || demoSector)}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline shrink-0"
      >
        Découvrir <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
