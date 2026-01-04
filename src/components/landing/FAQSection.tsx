import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Wie funktioniert der Heizöl-Preisvergleich?",
    answer: "Geben Sie einfach Ihre Postleitzahl und die gewünschte Liefermenge ein. Wir zeigen Ihnen sofort die aktuellen Preise aller verfügbaren Anbieter in Ihrer Region. Sie wählen das beste Angebot aus und können direkt online bestellen.",
  },
  {
    question: "Ist die Nutzung von TankSmart kostenlos?",
    answer: "Ja, die Nutzung unseres Preisvergleichs ist für Sie komplett kostenlos und unverbindlich. Sie zahlen nur den Preis für das bestellte Heizöl – ohne versteckte Gebühren.",
  },
  {
    question: "Wann ist der beste Zeitpunkt zum Heizöl-Kauf?",
    answer: "Generell sind die Preise in den Sommermonaten (Mai bis September) oft 5-15% günstiger als im Winter. Allerdings schwanken die Preise auch kurzfristig stark. Unser Tipp: Beobachten Sie den Markt regelmäßig und bestellen Sie, wenn Ihr Tank noch etwa 25% gefüllt ist.",
  },
  {
    question: "Wie schnell wird das Heizöl geliefert?",
    answer: "Die Lieferzeit beträgt in der Regel 2-5 Werktage nach Terminbestätigung. Bei dringendem Bedarf bieten viele Anbieter auch Expresslieferung an. Den genauen Liefertermin stimmen wir mit Ihnen ab.",
  },
  {
    question: "Welche Zahlungsmethoden werden akzeptiert?",
    answer: "Die Zahlung erfolgt bequem per Banküberweisung. Nach Terminbestätigung überweisen Sie 50% Anzahlung, die restlichen 50% nach erfolgreicher Lieferung. So ist Ihr Kauf abgesichert.",
  },
  {
    question: "Was ist der Unterschied zwischen Standard- und Premium-Heizöl?",
    answer: "Premium-Heizöl ist schwefelarm und enthält spezielle Additive. Es verbrennt sauberer, hinterlässt weniger Rückstände und schont so Ihre Heizungsanlage. Langfristig können Sie damit Wartungskosten sparen.",
  },
  {
    question: "Gibt es eine Mindestbestellmenge?",
    answer: "Die Mindestbestellmenge liegt je nach Anbieter bei 500 bis 1.000 Litern. Bei kleineren Mengen fallen oft höhere Lieferkosten an. Ab 3.000 Litern profitieren Sie von attraktiven Mengenrabatten.",
  },
  {
    question: "Sind die angezeigten Preise Endpreise?",
    answer: "Ja, alle angezeigten Preise sind Bruttopreise inklusive Mehrwertsteuer und Lieferung zu Ihnen nach Hause. Es kommen keine versteckten Kosten hinzu.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-display-sm text-foreground mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hier finden Sie Antworten auf die wichtigsten Fragen rund um den Heizölkauf.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border shadow-sm px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
