import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Lock, Truck } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Geprüfte Qualität",
    description: "Alle Anbieter werden von uns sorgfältig geprüft und müssen strenge Qualitätskriterien erfüllen. Nur die Besten kommen in unseren Vergleich.",
  },
  {
    icon: Lock,
    title: "Sichere Bestellung",
    description: "SSL-verschlüsselte Datenübertragung und Käuferschutz für jede Bestellung. Ihre Daten sind bei uns sicher.",
  },
  {
    icon: Truck,
    title: "Schnelle Lieferung",
    description: "In der Regel erhalten Sie Ihr Heizöl innerhalb von 2-5 Werktagen. Expressoption bei den meisten Anbietern verfügbar.",
  },
];

export function FeaturesSection() {
  return (
    <section id="vorteile" className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-display-sm text-foreground mb-4">
            Warum TankSmart24.de?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Wir machen den Heizölkauf einfach, sicher und günstig.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card variant="feature" className="h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-warm flex items-center justify-center mb-4 shadow-glow-sm">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
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
