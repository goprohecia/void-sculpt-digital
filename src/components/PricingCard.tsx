import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Hover3DCard, RippleButton } from "@/components/animations";
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
  rippleColor: string;
}> = {
  start: {
    border: "border-white/10",
    glow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    badge: "bg-neon-violet/10 border-neon-violet/30",
    badgeText: "text-neon-violet",
    checkColor: "text-neon-violet",
    hoverBorder: "hover:border-neon-violet/40",
    rippleColor: "rgba(139, 92, 246, 0.3)"
  },
  pro: {
    border: "border-emerald-500/30",
    glow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]",
    badge: "bg-emerald-500/10 border-emerald-500/30",
    badgeText: "text-emerald-400",
    checkColor: "text-emerald-400",
    hoverBorder: "hover:border-emerald-500/50",
    rippleColor: "rgba(16, 185, 129, 0.3)"
  },
  custom: {
    border: "border-violet-500/30",
    glow: "hover:shadow-[0_0_40px_rgba(167,139,250,0.25)]",
    badge: "bg-gradient-to-r from-neon-violet/20 to-violet-500/20 border-violet-500/40",
    badgeText: "text-violet-400",
    checkColor: "text-violet-400",
    hoverBorder: "hover:border-violet-500/60",
    rippleColor: "rgba(167, 139, 250, 0.3)"
  }
};
const tierLabels: Record<Tier, string> = {
  start: "START",
  pro: "PRO",
  custom: "SUR-MESURE"
};
export function PricingCard({
  tier,
  title,
  subtitle,
  price,
  features,
  upsell,
  subject,
  index = 0
}: PricingCardProps & {
  index?: number;
}) {
  const styles = tierStyles[tier];
  return <Hover3DCard className="h-full rounded-2xl" rotateStrength={6} glareEnabled={true}>
      <div className={`relative flex flex-col h-full p-8 glass-card transition-all duration-500 ${styles.border} ${styles.hoverBorder} ${styles.glow} group`}>
        {/* Background gradient on hover */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-neon-violet/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Tier Badge */}
          <motion.div className={`inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${styles.badge} ${styles.badgeText} mb-6`} whileHover={{
          scale: 1.05
        }} transition={{
          duration: 0.2
        }}>
            
            {tierLabels[tier]}
          </motion.div>

          {/* Title & Subtitle */}
          <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">{title}</h3>
          <p className="text-muted-foreground mb-6 group-hover:text-gray-300 transition-colors">{subtitle}</p>

          {/* Price */}
          <div className="mb-8">
            <span className="text-3xl lg:text-4xl font-extrabold text-gradient-neon">{price}</span>
            {price !== "Sur devis" && price !== "Sur demande" && <span className="text-muted-foreground ml-2">HT</span>}
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, idx) => <motion.li key={idx} className="flex items-start gap-3" initial={{
            opacity: 0,
            x: -10
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: idx * 0.05
          }} viewport={{
            once: true
          }}>
                <motion.div whileHover={{
              scale: 1.2,
              rotate: 10
            }} transition={{
              duration: 0.2
            }}>
                  <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${styles.checkColor}`} />
                </motion.div>
                <span className="text-muted-foreground group-hover:text-gray-300 transition-colors">{feature}</span>
              </motion.li>)}
          </ul>

          {/* Upsell */}
          <motion.div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-neon-violet/20 transition-colors" whileHover={{
          scale: 1.02
        }} transition={{
          duration: 0.2
        }}>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-neon-violet">+ Option:</span> {upsell}
            </p>
          </motion.div>

          {/* CTA Button */}
          <Link to={`/contact?subject=${encodeURIComponent(subject)}`}>
            <RippleButton className={`w-full py-4 rounded-xl font-semibold text-center transition-all duration-300 inline-flex items-center justify-center gap-2 ${tier === "custom" ? "btn-gradient text-white" : tier === "pro" ? "bg-emerald-500 text-white hover:bg-emerald-400" : "bg-neon-violet text-white hover:bg-violet-500"}`} rippleColor={styles.rippleColor}>
              Configurer ce pack
            </RippleButton>
          </Link>
        </div>
      </div>
    </Hover3DCard>;
}