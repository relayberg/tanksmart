import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 bg-hero relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-glow opacity-30" />
      
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-display-sm md:text-display text-primary-foreground mb-6">
            Bereit zum Sparen?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/70 mb-10">
            Starten Sie jetzt Ihren kostenlosen Preisvergleich und sparen Sie bis zu 30% 
            bei Ihrer nächsten Heizölbestellung.
          </p>

          <Button asChild variant="hero" size="xl">
            <Link to="/konfigurator/produkt">
              Jetzt vergleichen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>

          <p className="text-sm text-primary-foreground/50 mt-6">
            Kostenlos • Unverbindlich • Keine Anmeldung nötig
          </p>
        </motion.div>
      </div>
    </section>
  );
}
