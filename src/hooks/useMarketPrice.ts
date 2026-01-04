import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_MARKET_PRICE = 0.89;

export function useMarketPrice() {
  const [marketPrice, setMarketPrice] = useState<number>(DEFAULT_MARKET_PRICE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketPrice = async () => {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "market_price")
          .single();

        if (error) {
          console.error("Error fetching market price:", error);
          // Use default price if not found
          return;
        }

        if (data?.value) {
          const price = parseFloat(data.value);
          if (!isNaN(price) && price > 0) {
            setMarketPrice(price);
          }
        }
      } catch (err) {
        console.error("Error fetching market price:", err);
        setError("Fehler beim Laden des Marktpreises");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketPrice();
  }, []);

  return { marketPrice, isLoading, error };
}

export function calculatePriceWithMarket(
  quantity: number,
  oilType: "standard" | "premium" | "bio",
  providerMultiplier: number,
  marketPrice: number
): { pricePerLiter: number; totalPrice: number } {
  let basePrice = marketPrice;

  // Oil type adjustments
  if (oilType === "premium") basePrice += 0.02;
  if (oilType === "bio") basePrice += 0.04;

  // Volume discounts
  if (quantity >= 5000) basePrice -= 0.02;
  else if (quantity >= 3000) basePrice -= 0.01;

  // Provider multiplier
  const pricePerLiter = Math.round(basePrice * providerMultiplier * 1000) / 1000;
  const totalPrice = Math.round(pricePerLiter * quantity * 100) / 100;

  return { pricePerLiter, totalPrice };
}
