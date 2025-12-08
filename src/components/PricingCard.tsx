import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";

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

const tierStyles: Record<Tier, { 
  border: string; 
  glow: string; 
  badge: string; 
  badgeText: string;
  checkColor: string;
  hoverBorder: string;
}> = {
  start: {
    border: "border-white/10",
    glow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    badge: "bg-neon-violet/10 border-neon-violet/30",
    badgeText: "text-neon-violet",
    checkColor: "text-neon-violet",
    hoverBorder: "hover:border-neon-violet/40",
  },
  pro: {
    border: "border-emerald-500/30",
    glow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]",
    badge: "bg-emerald-500/10 border-emerald-500/30",
    badgeText: "text-emerald-400",
    checkColor: "text-emerald-400",
    hoverBorder: "hover:border-emerald-500/50",
  },
  custom: {
    border: "border-violet-500/30",
    glow: "hover:shadow-[0_0_40px_rgba(167,139,250,0.25)]",
    badge: "bg-gradient-to-r from-neon-violet/20 to-violet-500/20 border-violet-500/40",
    badgeText: "text-violet-400",
    checkColor: "text-violet-400",
    hoverBorder: "hover:border-violet-500/60",
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
      className={`relative flex flex-col p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 ${styles.border} ${styles.hoverBorder} ${styles.glow} group`}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-violet/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Tier Badge */}
        <div
          className={`inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${styles.badge} ${styles.badgeText} mb-6`}
        >
          <Sparkles className="h-3 w-3" />
          {tierLabels[tier]}
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-muted-foreground mb-6 group-hover:text-gray-300 transition-colors">{subtitle}</p>

        {/* Price */}
        <div className="mb-8">
          <span className="text-3xl lg:text-4xl font-extrabold text-gradient-neon">{price}</span>
          {price !== "Sur devis" && (
            <span className="text-muted-foreground ml-2">HT</span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${styles.checkColor}`} />
              <span className="text-muted-foreground group-hover:text-gray-300 transition-colors">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Upsell */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-neon-violet/20 transition-colors">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-neon-violet">+ Option:</span> {upsell}
          </p>
        </div>

        {/* CTA Button */}
        <Link
          to={`/contact?subject=${encodeURIComponent(subject)}`}
          className={`w-full py-4 rounded-xl font-semibold text-center transition-all duration-300 inline-flex items-center justify-center gap-2 ${
            tier === "custom"
              ? "btn-gradient text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
              : tier === "pro"
              ? "bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              : "bg-neon-violet text-white hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          } hover:scale-105`}
        >
          Configurer ce pack
        </Link>
      </div>
    </div>
  );
}