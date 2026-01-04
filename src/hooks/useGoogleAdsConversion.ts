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
        // Fetch Google Ads configuration from database
        const { data: integration } = await supabase
          .from("api_integrations")
          .select("config, is_active")
          .eq("provider", "google_ads")
          .single();

        if (!integration?.is_active) {
          console.log("Google Ads tracking is not active");
          return;
        }

        const config = integration.config as { conversion_id?: string; conversion_label?: string };
        const conversionId = config?.conversion_id;
        const conversionLabel = config?.conversion_label;

        if (!conversionId) {
          console.log("Google Ads conversion ID not configured");
          return;
        }

        // Check if gtag is available
        if (typeof window.gtag !== "function") {
          console.warn("gtag is not loaded");
          return;
        }

        // Build the send_to parameter
        const sendTo = conversionLabel 
          ? `${conversionId}/${conversionLabel}`
          : conversionId;

        // Fire the conversion event
        window.gtag("event", "conversion", {
          send_to: sendTo,
          value: totalPrice,
          currency: "EUR",
          transaction_id: orderNumber,
        });

        console.log("Google Ads conversion fired:", { sendTo, totalPrice, orderNumber });
        hasFired.current = true;
      } catch (error) {
        console.error("Error firing Google Ads conversion:", error);
      }
    }

    fireConversion();
  }, [orderNumber, totalPrice]);
}
