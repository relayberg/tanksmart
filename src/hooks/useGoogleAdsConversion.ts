import { useEffect, useRef } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";

interface ConversionData {
  orderNumber: string;
  totalPrice: number;
}

/**
 * Hook to trigger Google Ads conversion tracking on the success page.
 * Uses the central AppSettingsContext for configuration.
 */
export function useGoogleAdsConversion({ orderNumber, totalPrice }: ConversionData) {
  const { googleAds, isLoading } = useAppSettings();
  const hasFired = useRef(false);

  useEffect(() => {
    if (isLoading || hasFired.current) return;
    if (!googleAds.isActive || !googleAds.conversionId) return;

    if (typeof window.gtag !== "function") return;

    const sendTo = googleAds.conversionLabel
      ? `${googleAds.conversionId}/${googleAds.conversionLabel}`
      : googleAds.conversionId;

    window.gtag("event", "conversion", {
      send_to: sendTo,
      value: totalPrice,
      currency: "EUR",
      transaction_id: orderNumber,
    });

    hasFired.current = true;
  }, [orderNumber, totalPrice, googleAds, isLoading]);
}
