import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useOrder, OilType, AdditiveType } from "@/context/OrderContext";
import { cn } from "@/lib/utils";
import { Droplet, Sparkles, Leaf, Ban, Snowflake, Shield, Package } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useGclid } from "@/hooks/useGclid";

const oilTypes: { value: OilType; icon: typeof Droplet; title: string; description: string }[] = [
  {
    value: "standard",
    icon: Droplet,
    title: "Heizöl EL Standard",
    description: "Bewährte Qualität für effizientes Heizen",
  },
  {
    value: "premium",
    icon: Sparkles,
    title: "Heizöl EL Premium",
    description: "Schwefelarm, saubere Verbrennung, weniger Wartung",
  },
  {
    value: "bio",
    icon: Leaf,
    title: "Bio-Heizöl",
    description: "Klimaneutral durch CO₂-Kompensation",
  },
];

const quantities = [1000, 1500, 2000, 2500, 3000, 4000, 5000];

const additives: { value: AdditiveType; icon: typeof Ban; title: string; description: string }[] = [
  {
    value: "none",
    icon: Ban,
    title: "Keine Additive",
    description: "Standard-Heizöl ohne Zusätze",
  },
  {
    value: "flow",
    icon: Snowflake,
    title: "Fließverbesserer",
    description: "Verhindert Verstopfungen bei niedrigen Temperaturen",
  },
  {
    value: "tank",
    icon: Shield,
    title: "Tankschutz",
    description: "Schützt vor Korrosion und Ablagerungen",
  },
  {
    value: "combo",
    icon: Package,
    title: "Kombi-Paket",
    description: "Fließverbesserer + Tankschutz",
  },
];

export default function ProductStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { order, updateOrder, setCurrentStep, canProceed } = useOrder();
  
  // Capture GCLID from URL if present
  useGclid();

  // Initialize from URL params
  useEffect(() => {
    const plz = searchParams.get("plz");
    const menge = searchParams.get("menge");
    
    if (plz && plz.length === 5) {
      updateOrder({ postalCode: plz });
    }
    if (menge) {
      const qty = parseInt(menge);
      if (qty >= 500 && qty <= 50000) {
        updateOrder({ quantity: qty });
      }
    }
    setCurrentStep(1);
  }, [searchParams]);

  const handleNext = () => {
    setCurrentStep(2);
    navigate("/konfigurator/anbieter");
  };

  return (
    <>
      <SEO
        title="Heizöl Produkt auswählen - Schritt 1"
        description="Wählen Sie Ihre Heizölsorte und Menge. Standard, Premium oder Bio-Heizöl mit optionalen Additiven bei TankSmart24."
        canonical="https://tanksmart24.de/konfigurator/produkt"
        noindex={true}
      />
      <ConfiguratorLayout
        step={1}
        title="Produkt auswählen"
        subtitle="Wählen Sie Ihre gewünschte Heizölsorte und Menge"
        onNext={handleNext}
        canProceed={canProceed(1)}
        showBack={false}
      >
      <div className="space-y-8">
        {/* Postal Code */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Lieferadresse (PLZ)
          </label>
          <Input
            type="text"
            placeholder="z.B. 80331"
            value={order.postalCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 5);
              updateOrder({ postalCode: value });
            }}
            inputSize="lg"
            className="max-w-xs"
          />
        </div>

        {/* Oil Type */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Heizölsorte
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {oilTypes.map((type) => (
              <Card
                key={type.value}
                variant={order.oilType === type.value ? "glow" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  order.oilType === type.value && "ring-2 ring-primary"
                )}
                onClick={() => updateOrder({ oilType: type.value })}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <type.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Bestellmenge
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {quantities.map((qty) => (
              <button
                key={qty}
                onClick={() => updateOrder({ quantity: qty })}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  order.quantity === qty
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {qty.toLocaleString("de-DE")} L
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">oder</span>
            <Input
              type="number"
              placeholder="Individuelle Menge (500 - 50.000)"
              value={order.quantity}
              onChange={(e) => {
                const value = Math.min(50000, Math.max(0, parseInt(e.target.value) || 0));
                updateOrder({ quantity: value });
              }}
              inputSize="lg"
              className="max-w-xs"
            />
            <span className="text-sm text-muted-foreground">Liter</span>
          </div>
        </div>

        {/* Additives */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Additive (optional)
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {additives.map((additive) => (
              <Card
                key={additive.value}
                variant={order.additive === additive.value ? "glow" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  order.additive === additive.value && "ring-2 ring-primary"
                )}
                onClick={() => updateOrder({ additive: additive.value })}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <additive.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{additive.title}</h3>
                    <p className="text-sm text-muted-foreground">{additive.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ConfiguratorLayout>
    </>
  );
}
