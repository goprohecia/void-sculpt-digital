import { Link } from "react-router-dom";
import { Check } from "lucide-react";

type Tier = "start" | "pro" | "custom";

interface PricingCardProps {
  tier: Tier;
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  upsell: string;
  subject: string;
}

const tierStyles: Record<Tier, { border: string; glow: string; badge: string; badgeText: string }> = {
  start: {
    border: "border-tier-start/30 hover:border-tier-start/70",
    glow: "hover:shadow-[0_0_30px_hsl(var(--tier-start)/0.15)]",
    badge: "bg-tier-start/10 border-tier-start/30",
    badgeText: "text-tier-start",
  },
  pro: {
    border: "border-tier-pro/30 hover:border-tier-pro/70",
    glow: "hover:shadow-[0_0_30px_hsl(var(--tier-pro)/0.3)]",
    badge: "bg-tier-pro/10 border-tier-pro/30",
    badgeText: "text-tier-pro",
  },
  custom: {
    border: "border-tier-custom/30 hover:border-tier-custom/70",
    glow: "hover:shadow-[0_0_30px_hsl(var(--tier-custom)/0.3)]",
    badge: "bg-tier-custom/10 border-tier-custom/30",
    badgeText: "text-tier-custom",
  },
};

const tierLabels: Record<Tier, string> = {
  start: "START",
  pro: "PRO",
  custom: "SUR-MESURE",
};

export function PricingCard({
  tier,
  title,
  subtitle,
  price,
  features,
  upsell,
  subject,
}: PricingCardProps) {
  const styles = tierStyles[tier];

  return (
    <div
      className={`relative flex flex-col p-8 rounded-2xl bg-card/50 backdrop-blur-sm border-2 transition-all duration-500 ${styles.border} ${styles.glow} group`}
    >
      {/* Tier Badge */}
      <div
        className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${styles.badge} ${styles.badgeText} mb-6`}
      >
        {tierLabels[tier]}
      </div>

      {/* Title & Subtitle */}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{subtitle}</p>

      {/* Price */}
      <div className="mb-8">
        <span className="text-3xl lg:text-4xl font-extrabold">{price}</span>
        {price !== "Sur devis" && (
          <span className="text-muted-foreground ml-2">HT</span>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${styles.badgeText}`} />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Upsell */}
      <div className="mb-6 p-4 rounded-lg bg-secondary/50 border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">+ Option:</span> {upsell}
        </p>
      </div>

      {/* CTA Button */}
      <Link
        to={`/contact?subject=${encodeURIComponent(subject)}`}
        className={`w-full py-4 rounded-xl font-semibold text-center transition-all duration-300 ${
          tier === "custom"
            ? "bg-gradient-to-r from-tier-custom via-neon-red to-tier-pro text-background hover:opacity-90"
            : tier === "pro"
            ? "bg-tier-pro text-background hover:opacity-90"
            : "bg-foreground text-background hover:opacity-90"
        }`}
      >
        Configurer ce pack
      </Link>
    </div>
  );
}
