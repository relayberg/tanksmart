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
        // Fetch Google Ads configuration from database
        const { data: integration } = await supabase
          .from("api_integrations")
          .select("config, is_active")
          .eq("provider", "google_ads")
          .single();

        if (!integration?.is_active) {
          console.log("Google Ads tracking is not active, skipping gtag.js load");
          return;
        }

        const config = integration.config as { conversion_id?: string };
        const conversionId = config?.conversion_id;

        if (!conversionId) {
          console.log("Google Ads conversion ID not configured, skipping gtag.js load");
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
        if (existingScript) {
          console.log("gtag.js already loaded");
          loaded.current = true;
          return;
        }

        // Create and load the gtag.js script
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
        
        script.onload = () => {
          // Configure gtag with the conversion ID
          if (typeof window.gtag === "function") {
            window.gtag("config", conversionId);
            console.log("gtag.js loaded and configured with:", conversionId);
          }
        };

        document.head.appendChild(script);
        loaded.current = true;
      } catch (error) {
        console.error("Error loading gtag.js:", error);
      }
    }

    loadGtag();
  }, []);
}
