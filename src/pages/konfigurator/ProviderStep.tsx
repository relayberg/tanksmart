import { useNavigate } from "react-router-dom";
import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrder, PROVIDERS, calculatePrice } from "@/context/OrderContext";
import { cn } from "@/lib/utils";
import { Star, Clock, Award, Check } from "lucide-react";

export default function ProviderStep() {
  const navigate = useNavigate();
  const { order, updateOrder, setCurrentStep, canProceed } = useOrder();

  // Calculate prices for each provider
  const providersWithPrices = PROVIDERS.map((provider) => {
    const { pricePerLiter, totalPrice } = calculatePrice(
      order.quantity,
      order.oilType,
      provider.priceMultiplier
    );
    return { ...provider, pricePerLiter, totalPrice };
  }).sort((a, b) => a.totalPrice - b.totalPrice);

  const cheapestPrice = providersWithPrices[0]?.totalPrice || 0;

  const handleSelectProvider = (provider: typeof providersWithPrices[0]) => {
    updateOrder({
      provider: {
        id: provider.id,
        name: provider.name,
        fullName: provider.fullName,
        priceMultiplier: provider.priceMultiplier,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        deliveryTime: provider.deliveryTime,
        certifications: provider.certifications,
      },
      pricePerLiter: provider.pricePerLiter,
      totalPrice: provider.totalPrice,
    });
  };

  const handleNext = () => {
    setCurrentStep(3);
    navigate("/konfigurator/termin");
  };

  return (
    <ConfiguratorLayout
      step={2}
      title="Anbieter vergleichen"
      subtitle={`${order.quantity.toLocaleString("de-DE")} Liter ${
        order.oilType === "premium" ? "Premium-" : order.oilType === "bio" ? "Bio-" : ""
      }Heizöl für PLZ ${order.postalCode}`}
      onNext={handleNext}
      canProceed={canProceed(2)}
    >
      <div className="space-y-4">
        {providersWithPrices.map((provider, index) => {
          const isSelected = order.provider?.id === provider.id;
          const isCheapest = index === 0;
          const priceDiff = provider.totalPrice - cheapestPrice;

          return (
            <Card
              key={provider.id}
              variant={isSelected ? "glow" : "default"}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                isSelected && "ring-2 ring-primary",
                isCheapest && !isSelected && "border-success/50"
              )}
              onClick={() => handleSelectProvider(provider)}
            >
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Provider Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Logo placeholder */}
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-bold text-primary">
                        {provider.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{provider.name}</h3>
                          {isCheapest && (
                            <Badge className="bg-success text-success-foreground">
                              Günstigster
                            </Badge>
                          )}
                          {isSelected && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{provider.fullName}</p>
                      </div>
                    </div>

                    {/* Rating & Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-muted-foreground">
                          ({provider.reviewCount.toLocaleString("de-DE")})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {provider.deliveryTime}
                      </div>
                      <div className="flex items-center gap-1">
                        {provider.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right md:min-w-[180px]">
                    <div className="text-sm text-muted-foreground mb-1">
                      {(provider.pricePerLiter * 100).toFixed(2)} ct/Liter
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {provider.totalPrice.toLocaleString("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </div>
                    {priceDiff > 0 && (
                      <div className="text-sm text-muted-foreground">
                        +{priceDiff.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-accent/50 rounded-xl border border-primary/20">
        <p className="text-sm text-foreground">
          <strong>Hinweis:</strong> Alle Preise sind Endpreise inkl. MwSt. und Lieferung. 
          Die Zahlungsabwicklung erfolgt komplett über TankSmart – Sie zahlen nicht direkt an den Lieferanten.
        </p>
      </div>
    </ConfiguratorLayout>
  );
}
