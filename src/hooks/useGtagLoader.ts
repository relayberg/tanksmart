import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to dynamically load the Google Ads gtag.js script.
 * Fetches the conversion ID from the database and loads the script if active.
 */
export function useGtagLoader() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;

    async function loadGtag() {
      try {
        const { data: integration } = await supabase
          .from("api_integrations")
          .select("config, is_active")
          .eq("provider", "google_ads")
          .single();

        if (!integration?.is_active) {
          return;
        }

        const config = integration.config as { conversion_id?: string };
        const conversionId = config?.conversion_id;

        if (!conversionId) {
          return;
        }

        const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
        if (existingScript) {
          loaded.current = true;
          return;
        }

        // Initialize dataLayer and gtag function before loading script
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(...args: unknown[]) {
          window.dataLayer.push(args);
        };
        window.gtag("js", new Date());

        // Create and load the gtag.js script
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
        
        script.onload = () => {
          if (typeof window.gtag === "function") {
            window.gtag("config", conversionId);
          }
        };

        document.head.appendChild(script);
        loaded.current = true;
      } catch {
        // Silently fail - tracking is non-critical
      }
    }

    loadGtag();
  }, []);
}
