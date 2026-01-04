import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users, Building2, TrendingDown, Star } from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: "200+",
    label: "Geprüfte Anbieter",
    description: "Bundesweit verfügbar",
  },
  {
    icon: Users,
    value: "1.2 Mio",
    label: "Zufriedene Kunden",
    description: "Vertrauen uns",
  },
  {
    icon: TrendingDown,
    value: "30%",
    label: "Durchschnittliche Ersparnis",
    description: "Im Vergleich zum Markt",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Kundenbewertung",
    description: "Aus 12.000+ Bewertungen",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="stats" className="h-full">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
