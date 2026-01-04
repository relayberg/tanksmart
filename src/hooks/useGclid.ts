import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useOrder } from "@/context/OrderContext";

const GCLID_STORAGE_KEY = "ts24_gclid";

/**
 * Hook to capture and persist Google Click ID (gclid) from URL parameters.
 * The gclid is stored in sessionStorage and synced to OrderContext.
 */
export function useGclid() {
  const [searchParams] = useSearchParams();
  const { order, updateOrder } = useOrder();

  useEffect(() => {
    // Check URL for gclid parameter
    const gclidFromUrl = searchParams.get("gclid");
    
    if (gclidFromUrl) {
      // Store in sessionStorage for persistence across page navigations
      sessionStorage.setItem(GCLID_STORAGE_KEY, gclidFromUrl);
      updateOrder({ gclid: gclidFromUrl });
    } else {
      // Try to retrieve from sessionStorage if not in URL
      const storedGclid = sessionStorage.getItem(GCLID_STORAGE_KEY);
      if (storedGclid && !order.gclid) {
        updateOrder({ gclid: storedGclid });
      }
    }
  }, [searchParams, order.gclid, updateOrder]);

  return order.gclid;
}

/**
 * Get the stored gclid without using the hook (for use in non-component contexts)
 */
export function getStoredGclid(): string | null {
  return sessionStorage.getItem(GCLID_STORAGE_KEY);
}
