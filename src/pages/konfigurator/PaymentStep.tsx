import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrder } from "@/context/OrderContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Droplet, User, MapPin, Calendar, CreditCard, Loader2 } from "lucide-react";

export default function PaymentStep() {
  const navigate = useNavigate();
  const { order, updateOrder, canProceed, resetOrder } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deposit = order.totalPrice / 2;
  const remaining = order.totalPrice / 2;

  const oilTypeLabels = {
    standard: "Heizöl EL Standard",
    premium: "Heizöl EL Premium",
    bio: "Bio-Heizöl",
  };

  const additiveLabels = {
    none: "Keine",
    flow: "Fließverbesserer",
    tank: "Tankschutz",
    combo: "Kombi-Paket",
  };

  const timeSlotLabels = {
    morning: "Vormittag (8:00 - 12:00)",
    afternoon: "Nachmittag (12:00 - 17:00)",
    flexible: "Flexibel (Ganztägig)",
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // Call the create-order edge function
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          oilType: order.oilType,
          quantity: order.quantity,
          additive: order.additive,
          pricePerLiter: order.pricePerLiter,
          totalPrice: order.totalPrice,
          providerName: order.provider?.name || '',
          providerId: order.provider?.id || '',
          deliveryDate: order.deliveryDate ? format(order.deliveryDate, 'yyyy-MM-dd') : null,
          timeSlot: order.timeSlot,
          salutation: order.salutation,
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email,
          phone: order.phone,
          street: order.street,
          houseNumber: order.houseNumber,
          postalCode: order.postalCode,
          city: order.city,
          deliveryNotes: order.deliveryNotes,
          hoseLength: order.hoseLength,
          truckAccessible: order.truckAccessible,
        },
      });

      if (error) {
        console.error('Order creation error:', error);
        throw new Error(error.message || 'Bestellung konnte nicht erstellt werden');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Unbekannter Fehler');
      }

      // Reset order state
      resetOrder();

      // Navigate to success page
      navigate(`/bestellung-erfolgreich?bestellnummer=${data.orderNumber}`);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Fehler bei der Bestellung",
        description: error instanceof Error ? error.message : "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfiguratorLayout
      step={6}
      title="Bestellung abschließen"
      subtitle="Überprüfen Sie Ihre Bestellung und schließen Sie den Kauf ab"
      onNext={handleSubmit}
      nextLabel={isSubmitting ? "Wird verarbeitet..." : "Jetzt kostenpflichtig bestellen"}
      canProceed={canProceed(6) && !isSubmitting}
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-primary" />
              Produktdetails
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Heizölsorte:</span>
              <p className="font-medium">{oilTypeLabels[order.oilType]}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Menge:</span>
              <p className="font-medium">{order.quantity.toLocaleString("de-DE")} Liter</p>
            </div>
            <div>
              <span className="text-muted-foreground">Additive:</span>
              <p className="font-medium">{additiveLabels[order.additive]}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Anbieter:</span>
              <p className="font-medium">{order.provider?.name}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="w-5 h-5 text-primary" />
                Lieferadresse
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">
                {order.street} {order.houseNumber}
              </p>
              <p className="text-muted-foreground">
                {order.postalCode} {order.city}
              </p>
            </CardContent>
          </Card>

          {/* Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-5 h-5 text-primary" />
                Liefertermin
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {order.deliveryDate && (
                <p className="font-medium">
                  {format(order.deliveryDate, "EEEE, d. MMMM yyyy", { locale: de })}
                </p>
              )}
              <p className="text-muted-foreground">
                {timeSlotLabels[order.timeSlot]}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-5 h-5 text-primary" />
              Kontaktdaten
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <p className="font-medium">
                {order.salutation === "herr" ? "Herr" : order.salutation === "frau" ? "Frau" : ""}{" "}
                {order.firstName} {order.lastName}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">E-Mail:</span>
              <p className="font-medium">{order.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Telefon:</span>
              <p className="font-medium">{order.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Zahlungsablauf
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold">Nach Terminbestätigung - Anzahlung: 50%</p>
                <p className="text-sm opacity-80">
                  {deposit.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                </p>
                <p className="text-sm opacity-70 mt-1">
                  Nach Terminbestätigung erhalten Sie eine E-Mail mit den Zahlungsdaten. 
                  Die Anzahlung sichert Ihren Liefertermin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold">Nach erfolgreicher Lieferung - Restbetrag: 50%</p>
                <p className="text-sm opacity-80">
                  {remaining.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                </p>
                <p className="text-sm opacity-70 mt-1">
                  Den Restbetrag überweisen Sie bequem innerhalb von 7 Tagen nach Lieferung.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Price */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 text-center">
          <p className="text-muted-foreground mb-1">Gesamtbetrag inkl. MwSt.</p>
          <p className="text-4xl font-bold text-foreground">
            {order.totalPrice.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {(order.pricePerLiter * 100).toFixed(2)} ct/Liter × {order.quantity.toLocaleString("de-DE")} Liter
          </p>
        </div>

        {/* Legal Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={order.acceptedTerms}
              onCheckedChange={(checked) => updateOrder({ acceptedTerms: checked as boolean })}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
              Ich habe die{" "}
              <Link to="/agb" className="text-primary hover:underline" target="_blank">
                Allgemeinen Geschäftsbedingungen
              </Link>{" "}
              gelesen und akzeptiere diese. *
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="privacy"
              checked={order.acceptedPrivacy}
              onCheckedChange={(checked) => updateOrder({ acceptedPrivacy: checked as boolean })}
              className="mt-1"
            />
            <label htmlFor="privacy" className="text-sm text-foreground cursor-pointer">
              Ich habe die{" "}
              <Link to="/datenschutz" className="text-primary hover:underline" target="_blank">
                Datenschutzerklärung
              </Link>{" "}
              gelesen und akzeptiere diese. *
            </label>
          </div>
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
