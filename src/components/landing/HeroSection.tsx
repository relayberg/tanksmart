import { motion } from "framer-motion";
import { PriceSearchForm } from "./PriceSearchForm";
import { Badge } from "@/components/ui/badge";
import { Shield, Star, Truck, TrendingDown } from "lucide-react";

const badges = [
  { icon: TrendingDown, text: "Bis zu 30% sparen" },
  { icon: Shield, text: "Geprüfte Anbieter" },
  { icon: Truck, text: "Schnelle Lieferung" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-hero overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-glow opacity-50" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container relative pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                ))}
              </div>
              <span className="text-sm font-medium text-primary-foreground">
                4.8 von 12.000+ Bewertungen
              </span>
            </motion.div>

            <h1 className="text-display-sm md:text-display lg:text-display-lg text-primary-foreground mb-6">
              Finde den besten{" "}
              <span className="text-gradient-warm">Heizölpreis</span>{" "}
              in deiner Region
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Vergleiche Preise von über 200 geprüften Anbietern in Deutschland. 
              Transparent, schnell und kostenlos.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                  >
                    <badge.icon className="w-4 h-4 mr-2" />
                    {badge.text}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* Trust stats mobile */}
            <div className="flex justify-center lg:hidden gap-8 text-primary-foreground/70 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">200+</div>
                <div>Anbieter</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">1.2 Mio</div>
                <div>Kunden</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">30%</div>
                <div>Ersparnis</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pl-8"
          >
            <PriceSearchForm />
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120V60C240 20 480 0 720 0C960 0 1200 20 1440 60V120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
