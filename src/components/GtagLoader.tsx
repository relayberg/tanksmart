import { useEffect, useRef } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";

/**
 * Component that loads Google Ads gtag.js script dynamically.
 * Uses the central AppSettingsContext for configuration.
 * Sets window.__gtagReady = true when script is fully loaded.
 */
export function GtagLoader() {
  const { googleAds, isLoading } = useAppSettings();
  const loaded = useRef(false);

  useEffect(() => {
    if (isLoading || loaded.current) return;
    if (!googleAds.isActive || !googleAds.conversionId) {
      console.log("[GtagLoader] Google Ads tracking not active or missing conversionId");
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
    if (existingScript) {
      console.log("[GtagLoader] Script already exists, marking as ready");
      window.__gtagReady = true;
      loaded.current = true;
      return;
    }

    // Initialize dataLayer and gtag function before loading script
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());

    // Create and load the gtag.js script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAds.conversionId}`;

    script.onload = () => {
      if (typeof window.gtag === "function") {
        window.gtag("config", googleAds.conversionId);
        window.__gtagReady = true;
        console.log("[GtagLoader] Google Ads tracking initialized:", googleAds.conversionId);
      }
    };

    script.onerror = () => {
      console.error("[GtagLoader] Failed to load gtag.js script");
    };

    document.head.appendChild(script);
    loaded.current = true;
  }, [googleAds, isLoading]);

  return null;
}
