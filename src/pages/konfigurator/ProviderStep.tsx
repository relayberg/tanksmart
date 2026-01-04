import { useNavigate } from "react-router-dom";
import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder, PROVIDERS } from "@/context/OrderContext";
import { useMarketPrice, calculatePriceWithMarket } from "@/hooks/useMarketPrice";
import { cn } from "@/lib/utils";
import { Star, Clock, Award, Check, ArrowRight, Loader2 } from "lucide-react";

// Provider logos
import hoyerLogo from "@/assets/providers/hoyer.png";
import teamLogo from "@/assets/providers/team.svg";
import mobeneLogo from "@/assets/providers/mobene.png";
import nordoelLogo from "@/assets/providers/nordoel.webp";
import baywaLogo from "@/assets/providers/baywa.jpg";
import essoLogo from "@/assets/providers/esso.png";

const providerLogos: Record<string, string> = {
  hoyer: hoyerLogo,
  "team-energie": teamLogo,
  mobene: mobeneLogo,
  nordoel: nordoelLogo,
  baywa: baywaLogo,
  esso: essoLogo,
};

export default function ProviderStep() {
  const navigate = useNavigate();
  const { order, updateOrder, setCurrentStep } = useOrder();
  const { marketPrice, isLoading } = useMarketPrice();

  // Calculate prices for each provider using market price from database
  const providersWithPrices = PROVIDERS.map((provider) => {
    const { pricePerLiter, totalPrice } = calculatePriceWithMarket(
      order.quantity,
      order.oilType,
      provider.priceMultiplier,
      marketPrice
    );
    return { ...provider, pricePerLiter, totalPrice };
  }).sort((a, b) => a.totalPrice - b.totalPrice);

  const cheapestPrice = providersWithPrices[0]?.totalPrice || 0;

  if (isLoading) {
    return (
      <ConfiguratorLayout
        step={2}
        title="Anbieter vergleichen"
        subtitle="Preise werden geladen..."
        canProceed={false}
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ConfiguratorLayout>
    );
  }

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
    
    // Navigate directly to next step
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
      canProceed={false}
    >
      <div className="space-y-3">
        {providersWithPrices.map((provider, index) => {
          const isSelected = order.provider?.id === provider.id;
          const isCheapest = index === 0;
          const priceDiff = provider.totalPrice - cheapestPrice;
          const pricePer100L = provider.pricePerLiter * 100; // Price per 100 liters

          return (
            <Card
              key={provider.id}
              className={cn(
                "cursor-pointer transition-all duration-200 border-2 hover:border-primary/50 hover:shadow-lg group",
                isSelected && "border-primary bg-primary/5 shadow-lg",
                isCheapest && !isSelected && "border-success/50 bg-success/5"
              )}
              onClick={() => handleSelectProvider(provider)}
            >
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col gap-4">
                  {/* Top row: Logo, Name, Badges */}
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Provider Logo */}
                    <div className="w-16 h-12 md:w-20 md:h-14 rounded-lg bg-white border border-border/50 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      <img
                        src={providerLogos[provider.id]}
                        alt={`${provider.name} Logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-base md:text-lg">{provider.name}</h3>
                        {isCheapest && (
                          <Badge className="bg-success text-success-foreground text-xs">
                            Günstigster
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{provider.fullName}</p>
                    </div>

                    {/* Select indicator/button for desktop */}
                    <div className="hidden md:flex items-center gap-2">
                      {isSelected ? (
                        <div className="flex items-center gap-2 text-primary">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">Ausgewählt</span>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Auswählen
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Middle row: Rating & Delivery info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm border-y border-border/50 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-muted-foreground">
                        ({provider.reviewCount.toLocaleString("de-DE")} Bewertungen)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {provider.deliveryTime}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {provider.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Bottom row: Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Preis pro 100 Liter: </span>
                      <span className="font-medium text-foreground">
                        {pricePer100L.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-bold text-foreground">
                        {provider.totalPrice.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </div>
                      {priceDiff > 0 && (
                        <div className="text-xs text-muted-foreground">
                          +{priceDiff.toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          })} zum günstigsten
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile select button */}
                  <div className="md:hidden">
                    {isSelected ? (
                      <div className="flex items-center justify-center gap-2 text-primary py-2 bg-primary/10 rounded-lg">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Ausgewählt</span>
                      </div>
                    ) : (
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                        variant="outline"
                      >
                        Auswählen & Weiter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
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
          Die Zahlungsabwicklung erfolgt komplett über TankSmart24.de – Sie zahlen nicht direkt an den Lieferanten.
        </p>
      </div>
    </ConfiguratorLayout>
  );
}
