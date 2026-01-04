import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Mail, CreditCard, Truck, Home, Info } from "lucide-react";
import { SEO } from "@/components/SEO";

const steps = [
  {
    icon: Clock,
    title: "Innerhalb von 24 Stunden",
    description: "Verfügbarkeitsprüfung",
  },
  {
    icon: Mail,
    title: "Per E-Mail",
    description: "Terminbestätigung & Zahlungsanweisung",
  },
  {
    icon: CreditCard,
    title: "Vor der Lieferung",
    description: "Anzahlung überweisen",
  },
  {
    icon: Truck,
    title: "Zum vereinbarten Termin",
    description: "Lieferung & Restzahlung",
  },
];

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("bestellnummer") || "TS-00000000-0000";

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Bestellung erfolgreich"
        description="Ihre Heizölbestellung bei TankSmart24 war erfolgreich. Sie erhalten in Kürze eine Bestellbestätigung per E-Mail."
        canonical="https://tanksmart24.de/bestellung-erfolgreich"
        noindex={true}
      />
      <Header />
      <main className="flex-1 pt-24 pb-16 bg-background">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            {/* Success Icon */}
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vielen Dank für Ihre Bestellung!
            </h1>

            {/* Order Number */}
            <div className="inline-block bg-muted rounded-xl px-6 py-4 mb-4">
              <p className="text-sm text-muted-foreground mb-1">Ihre Bestellnummer</p>
              <p className="text-2xl font-bold text-foreground font-mono">{orderNumber}</p>
            </div>

            <p className="text-muted-foreground">
              Sie erhalten in Kürze eine Bestellbestätigung per E-Mail.
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              So geht es weiter
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {steps.map((step, index) => (
                <Card key={index} variant="outline">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-accent/50 border-primary/20">
              <CardContent className="p-6 flex gap-4">
                <Info className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Alles aus einer Hand</h3>
                  <p className="text-sm text-muted-foreground">
                    Die komplette Zahlungsabwicklung erfolgt über TankSmart24.de – Sie zahlen nicht 
                    direkt an den Lieferanten. Bei Fragen sind wir Ihr einziger Ansprechpartner.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back to Home */}
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                <Home className="w-4 h-4" />
                Zurück zur Startseite
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
