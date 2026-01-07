import { useEffect, useRef } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";

interface ConversionData {
  orderNumber: string;
  totalPrice: number;
}

// Storage key for conversion customer data
const CONVERSION_DATA_KEY = "ts24_conversion_data";

interface ConversionCustomerData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  postalCode?: string;
}

/**
 * Save customer data for conversion tracking (call before navigating to success page)
 */
export function saveConversionData(data: ConversionCustomerData) {
  try {
    sessionStorage.setItem(CONVERSION_DATA_KEY, JSON.stringify(data));
    console.log("[Conversion] Customer data saved for Enhanced Conversions");
  } catch (e) {
    console.warn("[Conversion] Failed to save customer data:", e);
  }
}

/**
 * Get and clear conversion customer data
 */
function getAndClearConversionData(): ConversionCustomerData | null {
  try {
    const data = sessionStorage.getItem(CONVERSION_DATA_KEY);
    if (data) {
      sessionStorage.removeItem(CONVERSION_DATA_KEY);
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("[Conversion] Failed to read customer data:", e);
  }
  return null;
}

/**
 * Simple SHA256 hash using Web Crypto API
 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Normalize phone number for hashing (E.164 format)
 */
function normalizePhone(phone: string): string {
  // Remove all non-digit characters except leading +
  let normalized = phone.replace(/[^\d+]/g, "");
  // Ensure German format if no country code
  if (!normalized.startsWith("+") && !normalized.startsWith("00")) {
    // Remove leading 0 and add +49
    normalized = "+49" + normalized.replace(/^0/, "");
  } else if (normalized.startsWith("00")) {
    normalized = "+" + normalized.slice(2);
  }
  return normalized;
}

/**
 * Hook to trigger Google Ads conversion tracking on the success page.
 * Includes retry logic and Enhanced Conversions support.
 */
export function useGoogleAdsConversion({ orderNumber, totalPrice }: ConversionData) {
  const { googleAds, isLoading } = useAppSettings();
  const hasFired = useRef(false);

  useEffect(() => {
    if (isLoading || hasFired.current) return;

    // Validate data before attempting conversion
    if (!orderNumber || orderNumber === "TS-00000000-0000") {
      console.warn("[Conversion] Skipped: Invalid order number");
      return;
    }

    if (totalPrice <= 0) {
      console.warn("[Conversion] Skipped: Invalid total price", totalPrice);
      return;
    }

    if (!googleAds.isActive || !googleAds.conversionId) {
      console.log("[Conversion] Google Ads not active or missing config");
      return;
    }

    const sendTo = googleAds.conversionLabel
      ? `${googleAds.conversionId}/${googleAds.conversionLabel}`
      : googleAds.conversionId;

    // Get customer data for Enhanced Conversions
    const customerData = getAndClearConversionData();

    /**
     * Attempt to fire conversion with retry logic
     */
    const attemptConversion = async (retries = 10, delay = 300) => {
      // Check if gtag is ready
      const gtagReady = typeof window.gtag === "function" && window.__gtagReady === true;

      if (!gtagReady) {
        if (retries > 0) {
          console.log(`[Conversion] Waiting for gtag... (${retries} retries left)`);
          setTimeout(() => attemptConversion(retries - 1, delay), delay);
          return;
        } else {
          console.error("[Conversion] Failed: gtag not available after retries");
          return;
        }
      }

      try {
        // Set Enhanced Conversions user data if available
        if (customerData) {
          const userData: Record<string, unknown> = {};

          if (customerData.email) {
            const normalizedEmail = customerData.email.toLowerCase().trim();
            userData.sha256_email_address = await sha256(normalizedEmail);
          }

          if (customerData.phone) {
            const normalizedPhone = normalizePhone(customerData.phone);
            userData.sha256_phone_number = await sha256(normalizedPhone);
          }

          if (customerData.firstName || customerData.lastName || customerData.city || customerData.postalCode) {
            userData.address = {};
            if (customerData.firstName) {
              (userData.address as Record<string, string>).sha256_first_name = await sha256(
                customerData.firstName.toLowerCase().trim()
              );
            }
            if (customerData.lastName) {
              (userData.address as Record<string, string>).sha256_last_name = await sha256(
                customerData.lastName.toLowerCase().trim()
              );
            }
            if (customerData.city) {
              (userData.address as Record<string, string>).city = customerData.city;
            }
            if (customerData.postalCode) {
              (userData.address as Record<string, string>).postal_code = customerData.postalCode;
            }
            (userData.address as Record<string, string>).country = "DE";
          }

          if (Object.keys(userData).length > 0) {
            window.gtag("set", "user_data", userData);
            console.log("[Conversion] Enhanced Conversions user_data set");
          }
        }

        // Fire the conversion event
        window.gtag("event", "conversion", {
          send_to: sendTo,
          value: totalPrice,
          currency: "EUR",
          transaction_id: orderNumber,
        });

        hasFired.current = true;
        console.log("[Conversion] ✅ Fired successfully:", {
          sendTo,
          value: totalPrice,
          transaction_id: orderNumber,
          hasEnhancedData: !!customerData,
        });
      } catch (error) {
        console.error("[Conversion] Error firing conversion:", error);
      }
    };

    // Start attempting conversion
    attemptConversion();
  }, [orderNumber, totalPrice, googleAds, isLoading]);
}
