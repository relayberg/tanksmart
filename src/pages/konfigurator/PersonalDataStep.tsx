import { useNavigate } from "react-router-dom";
import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrder, Salutation } from "@/context/OrderContext";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";

const salutations: { value: Salutation; label: string }[] = [
  { value: "herr", label: "Herr" },
  { value: "frau", label: "Frau" },
  { value: "divers", label: "Divers" },
];

export default function PersonalDataStep() {
  const navigate = useNavigate();
  const { order, updateOrder, setCurrentStep, canProceed } = useOrder();

  const handleNext = () => {
    setCurrentStep(6);
    navigate("/konfigurator/zahlung");
  };

  const isValidEmail = order.email.includes("@") && order.email.includes(".");
  const isValidPhone = order.phone.length >= 6;

  return (
    <>
      <SEO
        title="Persönliche Daten - Schritt 5"
        description="Geben Sie Ihre Kontaktdaten für die Heizöl-Bestellung ein. Sicher und vertraulich bei TankSmart24."
        canonical="https://tanksmart24.de/konfigurator/daten"
        noindex={true}
      />
      <ConfiguratorLayout
        step={5}
        title="Persönliche Daten"
        subtitle="Geben Sie Ihre Kontaktdaten für die Bestellung ein"
        onNext={handleNext}
        canProceed={canProceed(5)}
      >
      <div className="space-y-8">
        {/* Personal Data */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Persönliche Daten
          </label>
          
          {/* Salutation */}
          <div className="flex gap-2 mb-4">
            {salutations.map((s) => (
              <button
                key={s.value}
                onClick={() => updateOrder({ salutation: s.value })}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  order.salutation === s.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Vorname *
              </label>
              <Input
                type="text"
                placeholder="Max"
                value={order.firstName}
                onChange={(e) => updateOrder({ firstName: e.target.value })}
                inputSize="lg"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Nachname *
              </label>
              <Input
                type="text"
                placeholder="Mustermann"
                value={order.lastName}
                onChange={(e) => updateOrder({ lastName: e.target.value })}
                inputSize="lg"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Kontaktdaten
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                E-Mail *
              </label>
              <Input
                type="email"
                placeholder="max@beispiel.de"
                value={order.email}
                onChange={(e) => updateOrder({ email: e.target.value })}
                inputSize="lg"
                className={cn(
                  order.email && !isValidEmail && "border-destructive"
                )}
              />
              {order.email && !isValidEmail && (
                <p className="text-sm text-destructive mt-1">
                  Bitte geben Sie eine gültige E-Mail-Adresse ein
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Telefon *
              </label>
              <Input
                type="tel"
                placeholder="+49 123 456789"
                value={order.phone}
                onChange={(e) => updateOrder({ phone: e.target.value })}
                inputSize="lg"
                className={cn(
                  order.phone && !isValidPhone && "border-destructive"
                )}
              />
              {order.phone && !isValidPhone && (
                <p className="text-sm text-destructive mt-1">
                  Bitte geben Sie eine gültige Telefonnummer ein
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Rechnungsadresse
          </label>
          
          <div className="flex items-center gap-3 mb-4">
            <Checkbox
              id="billing-same"
              checked={order.billingAddressSame}
              onCheckedChange={(checked) => 
                updateOrder({ billingAddressSame: checked as boolean })
              }
            />
            <label 
              htmlFor="billing-same" 
              className="text-sm text-foreground cursor-pointer"
            >
              Rechnungsadresse ist identisch mit Lieferadresse
            </label>
          </div>

          {!order.billingAddressSame && (
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  Straße
                </label>
                <Input
                  type="text"
                  placeholder="Musterstraße"
                  value={order.billingStreet}
                  onChange={(e) => updateOrder({ billingStreet: e.target.value })}
                  inputSize="lg"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  Hausnummer
                </label>
                <Input
                  type="text"
                  placeholder="12"
                  value={order.billingHouseNumber}
                  onChange={(e) => updateOrder({ billingHouseNumber: e.target.value })}
                  inputSize="lg"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  Postleitzahl
                </label>
                <Input
                  type="text"
                  placeholder="12345"
                  value={order.billingPostalCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                    updateOrder({ billingPostalCode: value });
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
                  placeholder="Musterstadt"
                  value={order.billingCity}
                  onChange={(e) => updateOrder({ billingCity: e.target.value })}
                  inputSize="lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Anmerkungen (optional)
          </label>
          <Textarea
            placeholder="Weitere Hinweise zu Ihrer Bestellung..."
            value={order.remarks}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                updateOrder({ remarks: e.target.value });
              }
            }}
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {order.remarks.length}/500 Zeichen
          </p>
        </div>
      </div>
    </ConfiguratorLayout>
    </>
  );
}
