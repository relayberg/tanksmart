import { useNavigate } from "react-router-dom";
import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useOrder, HoseLength } from "@/context/OrderContext";
import { cn } from "@/lib/utils";
import { Truck, AlertCircle, Ruler } from "lucide-react";

const hoseLengths: { value: HoseLength; title: string; description: string }[] = [
  {
    value: "standard",
    title: "Standard (bis 40m)",
    description: "Ausreichend für die meisten Häuser",
  },
  {
    value: "extended",
    title: "Überlänge (über 40m)",
    description: "Bei größerer Entfernung zum Tank",
  },
];

export default function DeliveryStep() {
  const navigate = useNavigate();
  const { order, updateOrder, setCurrentStep, canProceed } = useOrder();

  const handleNext = () => {
    setCurrentStep(5);
    navigate("/konfigurator/daten");
  };

  return (
    <ConfiguratorLayout
      step={4}
      title="Lieferdetails"
      subtitle="Geben Sie die genaue Lieferadresse und Zufahrtsinformationen an"
      onNext={handleNext}
      canProceed={canProceed(4)}
    >
      <div className="space-y-8">
        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Lieferadresse
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Postleitzahl
              </label>
              <Input
                type="text"
                value={order.postalCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                  updateOrder({ postalCode: value });
                }}
                inputSize="lg"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Ort
              </label>
              <Input
                type="text"
                placeholder="z.B. München"
                value={order.city}
                onChange={(e) => updateOrder({ city: e.target.value })}
                inputSize="lg"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Straße
              </label>
              <Input
                type="text"
                placeholder="z.B. Musterstraße"
                value={order.street}
                onChange={(e) => updateOrder({ street: e.target.value })}
                inputSize="lg"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Hausnummer
              </label>
              <Input
                type="text"
                placeholder="z.B. 12a"
                value={order.houseNumber}
                onChange={(e) => updateOrder({ houseNumber: e.target.value })}
                inputSize="lg"
              />
            </div>
          </div>
        </div>

        {/* Truck Access */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Ist die Zufahrt für einen LKW geeignet?
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => updateOrder({ truckAccessible: true })}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-medium transition-all",
                order.truckAccessible
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Ja
            </button>
            <button
              onClick={() => updateOrder({ truckAccessible: false })}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-medium transition-all",
                !order.truckAccessible
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Nein
            </button>
          </div>

          {!order.truckAccessible && (
            <div className="mt-3 p-4 bg-warning/10 border border-warning/30 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Bei eingeschränkter Zufahrt wird ein kleinerer Tankwagen eingesetzt. 
                Dies kann zu einem Aufpreis führen.
              </p>
            </div>
          )}
        </div>

        {/* Hose Length */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Schlauchlänge
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {hoseLengths.map((hose) => (
              <Card
                key={hose.value}
                variant={order.hoseLength === hose.value ? "glow" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  order.hoseLength === hose.value && "ring-2 ring-primary"
                )}
                onClick={() => updateOrder({ hoseLength: hose.value })}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground">{hose.title}</h3>
                  <p className="text-sm text-muted-foreground">{hose.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Delivery Notes */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Hinweise zur Lieferung (optional)
          </label>
          <Textarea
            placeholder="z.B. Klingel defekt, bitte anrufen • Einfahrt rechts neben dem Haus"
            value={order.deliveryNotes}
            onChange={(e) => updateOrder({ deliveryNotes: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
