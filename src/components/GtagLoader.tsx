import { useGtagLoader } from "@/hooks/useGtagLoader";

/**
 * Component that loads Google Ads gtag.js script dynamically.
 * This component should be placed inside the router context.
 */
export function GtagLoader() {
  useGtagLoader();
  return null;
}
