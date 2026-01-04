import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ConversionData {
  orderNumber: string;
  totalPrice: number;
}

/**
 * Hook to trigger Google Ads conversion tracking on the success page.
 * Fetches the conversion IDs from the database and fires the gtag event.
 */
export function useGoogleAdsConversion({ orderNumber, totalPrice }: ConversionData) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    
    async function fireConversion() {
      try {
        const { data: integration } = await supabase
          .from("api_integrations")
          .select("config, is_active")
          .eq("provider", "google_ads")
          .single();

        if (!integration?.is_active) {
          return;
        }

        const config = integration.config as { conversion_id?: string; conversion_label?: string };
        const conversionId = config?.conversion_id;
        const conversionLabel = config?.conversion_label;

        if (!conversionId) {
          return;
        }

        if (typeof window.gtag !== "function") {
          return;
        }

        const sendTo = conversionLabel 
          ? `${conversionId}/${conversionLabel}`
          : conversionId;

        window.gtag("event", "conversion", {
          send_to: sendTo,
          value: totalPrice,
          currency: "EUR",
          transaction_id: orderNumber,
        });

        hasFired.current = true;
      } catch {
        // Silently fail - tracking is non-critical
      }
    }

    fireConversion();
  }, [orderNumber, totalPrice]);
}
