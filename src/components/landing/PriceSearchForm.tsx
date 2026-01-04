import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Shield, Truck, ArrowRight, Loader2 } from "lucide-react";

const quantityOptions = [1000, 2000, 3000, 5000];

export function PriceSearchForm() {
  const navigate = useNavigate();
  const [postalCode, setPostalCode] = useState("");
  const [quantity, setQuantity] = useState(2000);
  const [customQuantity, setCustomQuantity] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handlePostalCodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(cleaned);
    
    if (cleaned.length === 5) {
      setIsValidating(true);
      // Simulate validation - in real app, call PLZ API
      setTimeout(() => {
        setIsValidating(false);
        setIsValid(true);
      }, 500);
    } else {
      setIsValid(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuantity = customQuantity ? parseInt(customQuantity) : quantity;
    navigate(`/konfigurator/produkt?plz=${postalCode}&menge=${finalQuantity}`);
  };

  return (
    <Card variant="elevated" className="bg-card shadow-xl border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Jetzt Anbieter vergleichen</CardTitle>
        <CardDescription>Über 200 geprüfte Lieferanten</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Postal Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Postleitzahl
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="z.B. 80331"
                value={postalCode}
                onChange={(e) => handlePostalCodeChange(e.target.value)}
                inputSize="lg"
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isValidating && <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />}
                {isValid === true && <CheckCircle className="w-5 h-5 text-success" />}
              </div>
            </div>
          </div>

          {/* Quantity Quick Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Liefermenge
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quantityOptions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setQuantity(q);
                    setCustomQuantity("");
                  }}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    quantity === q && !customQuantity
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {q.toLocaleString("de-DE")} L
                </button>
              ))}
            </div>
          </div>

          {/* Custom Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              oder individuelle Menge (500 - 50.000 Liter)
            </label>
            <Input
              type="number"
              placeholder="z.B. 2500"
              value={customQuantity}
              onChange={(e) => setCustomQuantity(e.target.value)}
              min={500}
              max={50000}
              inputSize="lg"
            />
          </div>

          {/* Submit */}
          <Button type="submit" variant="hero" size="xl" className="w-full">
            Preise vergleichen
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-success" />
              Kostenlos
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-success" />
              Unverbindlich
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-success" />
              Schnell
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
