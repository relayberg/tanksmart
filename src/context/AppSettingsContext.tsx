import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AppSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  [key: string]: string;
}

interface GoogleAdsConfig {
  conversionId?: string;
  conversionLabel?: string;
  isActive: boolean;
}

interface AppSettingsContextType {
  settings: AppSettings;
  googleAds: GoogleAdsConfig;
  isLoading: boolean;
}

const defaultSettings: AppSettings = {
  companyName: "Die Heizer GmbH",
  companyEmail: "info@tanksmart24.de",
  companyPhone: "",
};

const defaultGoogleAds: GoogleAdsConfig = {
  isActive: false,
};

const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: defaultSettings,
  googleAds: defaultGoogleAds,
  isLoading: true,
});

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [googleAds, setGoogleAds] = useState<GoogleAdsConfig>(defaultGoogleAds);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAllSettings() {
      try {
        // Fetch app_settings and api_integrations in parallel
        const [settingsResult, googleAdsResult] = await Promise.all([
          supabase.from("app_settings").select("key, value"),
          supabase
            .from("api_integrations")
            .select("config, is_active")
            .eq("provider", "google_ads")
            .maybeSingle(),
        ]);

        // Process app_settings
        if (settingsResult.data) {
          const settingsMap: AppSettings = { ...defaultSettings };
          settingsResult.data.forEach((item) => {
            if (item.key === "company_name") settingsMap.companyName = item.value;
            if (item.key === "company_email") settingsMap.companyEmail = item.value;
            if (item.key === "company_phone") settingsMap.companyPhone = item.value;
            // Store all other settings with their original key
            settingsMap[item.key] = item.value;
          });
          setSettings(settingsMap);
        }

        // Process Google Ads config
        if (googleAdsResult.data?.is_active) {
          const config = googleAdsResult.data.config as { conversion_id?: string; conversion_label?: string };
          setGoogleAds({
            conversionId: config?.conversion_id,
            conversionLabel: config?.conversion_label,
            isActive: true,
          });
        }
      } catch (error) {
        console.error("Error fetching app settings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllSettings();
  }, []);

  return (
    <AppSettingsContext.Provider value={{ settings, googleAds, isLoading }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }
  return context;
}
