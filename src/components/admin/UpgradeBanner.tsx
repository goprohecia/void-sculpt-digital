import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { SubscriptionPlan } from "@/hooks/use-subscription";

const planLabels: Record<SubscriptionPlan, string> = {
  starter: "Starter",
  business: "Business",
  enterprise: "Enterprise",
};

interface UpgradeBannerProps {
  currentPlan: SubscriptionPlan;
  requiredPlan: SubscriptionPlan;
  feature: string;
  className?: string;
}

export function UpgradeBanner({ currentPlan, requiredPlan, feature, className = "" }: UpgradeBannerProps) {
  return (
    <div className={`rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3 ${className}`}>
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {feature} — disponible à partir du plan {planLabels[requiredPlan]}
        </p>
        <p className="text-xs text-muted-foreground">
          Vous êtes actuellement en plan {planLabels[currentPlan]}.
        </p>
      </div>
      <Link
        to="/contact?subject=Upgrade%20abonnement%20MBA"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0"
      >
        Passer au plan supérieur
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
