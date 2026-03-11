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
    <div className={`rounded-xl border border-[#16a34a]/30 bg-[#f0fdf4] p-5 flex items-center gap-4 shadow-sm ${className}`}>
      <div className="h-11 w-11 rounded-full bg-[#16a34a]/15 flex items-center justify-center shrink-0">
        <Sparkles className="h-5 w-5 text-[#16a34a]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          {feature} — disponible à partir du plan {planLabels[requiredPlan]}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          Vous êtes actuellement en plan {planLabels[currentPlan]}.
        </p>
      </div>
      <Link
        to="/contact?subject=Upgrade%20abonnement%20MBA"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16a34a] hover:text-[#15803d] hover:underline shrink-0 whitespace-nowrap"
      >
        Passer au plan supérieur
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
