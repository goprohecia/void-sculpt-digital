import { motion } from "framer-motion";
import { Layers, Puzzle, Paintbrush, Headphones } from "lucide-react";
import { ScrollReveal } from "@/components/animations";

const proofItems = [
  { icon: Layers, label: "Multi-sectoriel" },
  { icon: Puzzle, label: "Modulaire" },
  { icon: Paintbrush, label: "White Label" },
  { icon: Headphones, label: "Support réactif" },
];

export function ProofStrip() {
  return (
    <section className="py-8 md:py-12 relative border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#22c55e]/5 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal variant="fadeIn">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 lg:gap-16">
            {proofItems.map((item, index) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-3 text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="p-2 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <item.icon className="h-4 w-4 text-[#22c55e]" />
                </div>
                <span className="text-sm md:text-base font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
