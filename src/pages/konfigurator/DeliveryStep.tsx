import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useOrder, HoseLength } from "@/context/OrderContext";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { StreetAutocomplete } from "@/components/ui/street-autocomplete";
import { cn } from "@/lib/utils";
import { AlertCircle, Ruler, Loader2, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const {
    localities,
    streets,
    isLoadingLocalities,
    isLoadingStreets,
    localityError,
    localityValid,
    fetchLocalitiesByPostalCode,
    fetchStreets,
    clearStreets,
    resetLocalities,
  } = useAddressAutocomplete();

  const [streetInput, setStreetInput] = useState(order.street);
  const [cityReadonly, setCityReadonly] = useState(false);

  // Handle PLZ change
  useEffect(() => {
    const plz = order.postalCode;

    if (plz.length === 5) {
      fetchLocalitiesByPostalCode(plz).then(({ localities: locs }) => {
        if (locs.length === 1) {
          // Auto-fill city and make readonly
          updateOrder({ city: locs[0].name });
          setCityReadonly(true);
        } else if (locs.length > 1) {
          // Multiple localities - let user choose
          setCityReadonly(false);
          if (!order.city) {
            updateOrder({ city: locs[0].name });
          }
        } else {
          setCityReadonly(false);
        }
      });
    } else {
      resetLocalities();
      setCityReadonly(false);
    }
  }, [order.postalCode]);

  // Handle street input change
  const handleStreetInputChange = (value: string) => {
    setStreetInput(value);
    updateOrder({ street: value });

    if (value.length >= 2 && order.postalCode.length === 5) {
      fetchStreets(value, order.postalCode);
    } else {
      clearStreets();
    }
  };

  // Handle street selection
  const handleStreetSelect = (street: { name: string; postalCode: string; locality: string }) => {
    setStreetInput(street.name);
    updateOrder({ street: street.name });
    clearStreets();
  };

  const handleNext = () => {
    setCurrentStep(5);
    navigate("/konfigurator/daten");
  };

  return (
    <>
      <SEO
        title="Lieferdetails angeben - Schritt 4"
        description="Geben Sie Ihre Lieferadresse und Zufahrtsinformationen für die Heizöl-Lieferung an. Schnell und einfach bei TankSmart24."
        canonical="https://tanksmart24.de/konfigurator/lieferung"
        noindex={true}
      />
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
            {/* PLZ */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Postleitzahl
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={order.postalCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                    updateOrder({ postalCode: value });
                  }}
                  inputSize="lg"
                  className={cn(
                    localityError && "border-destructive",
                    localityValid && "border-success"
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isLoadingLocalities && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {!isLoadingLocalities && localityValid && (
                    <Check className="h-4 w-4 text-success" />
                  )}
                </div>
              </div>
              {localityError && (
                <p className="text-sm text-destructive mt-1">{localityError}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Ort
              </label>
              {localities.length > 1 && !cityReadonly ? (
                <Select
                  value={order.city}
                  onValueChange={(value) => updateOrder({ city: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Ort wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {localities.map((loc, index) => (
                      <SelectItem key={`${loc.name}-${index}`} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type="text"
                  placeholder="z.B. München"
                  value={order.city}
                  onChange={(e) => updateOrder({ city: e.target.value })}
                  inputSize="lg"
                  readOnly={cityReadonly}
                  className={cn(cityReadonly && "bg-muted")}
                />
              )}
            </div>

            {/* Street with Autocomplete */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Straße
              </label>
              <StreetAutocomplete
                value={streetInput}
                onChange={handleStreetInputChange}
                onSelect={handleStreetSelect}
                streets={streets}
                isLoading={isLoadingStreets}
                disabled={order.postalCode.length !== 5}
                placeholder={
                  order.postalCode.length !== 5
                    ? "Bitte zuerst PLZ eingeben"
                    : "Straße eingeben..."
                }
              />
            </div>

            {/* House Number */}
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
    </>
  );
}
