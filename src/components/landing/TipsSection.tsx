import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sun, Gauge, Package, Settings, Sparkles, TrendingUp } from "lucide-react";

const tips = [
  {
    icon: Sun,
    title: "Im Sommer bestellen",
    description: "Die Heizölpreise sind in den Sommermonaten oft 5-15% günstiger als während der Heizsaison im Winter.",
  },
  {
    icon: Gauge,
    title: "Tankfüllstand beobachten",
    description: "Bestellen Sie bei etwa 25% Restfüllstand. So haben Sie genug Spielraum für den optimalen Bestellzeitpunkt.",
  },
  {
    icon: Package,
    title: "Mengenrabatte nutzen",
    description: "Ab 3.000 Litern profitieren Sie von deutlichen Mengenrabatten. Größere Bestellungen lohnen sich.",
  },
  {
    icon: Settings,
    title: "Heizung optimieren",
    description: "Regelmäßige Wartung und optimale Einstellung Ihrer Heizung können den Verbrauch um bis zu 15% senken.",
  },
  {
    icon: Sparkles,
    title: "Premium-Heizöl erwägen",
    description: "Schwefelarmes Premium-Heizöl verbrennt sauberer, schont die Heizung und kann langfristig Wartungskosten sparen.",
  },
  {
    icon: TrendingUp,
    title: "Marktpreise verfolgen",
    description: "Heizölpreise schwanken täglich. Ein regelmäßiger Preisvergleich hilft, den besten Zeitpunkt zu finden.",
  },
];

export function TipsSection() {
  return (
    <section id="spartipps" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-display-sm text-foreground mb-4">
            6 Spartipps für günstiges Heizöl
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mit diesen Tipps können Sie bei Ihrer nächsten Bestellung noch mehr sparen.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="outline" className="h-full group hover:border-primary/30">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    <tip.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {tip.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
