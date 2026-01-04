// Google Analytics gtag.js type definitions

interface GtagConversionParams {
  send_to: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
}

interface GtagConfigParams {
  page_path?: string;
  page_title?: string;
  [key: string]: unknown;
}

interface GtagEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
}

interface GtagUserData {
  sha256_email_address?: string;
  sha256_phone_number?: string;
  address?: {
    sha256_first_name?: string;
    sha256_last_name?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

declare function gtag(
  command: "js",
  date: Date
): void;

declare function gtag(
  command: "config",
  targetId: string,
  params?: GtagConfigParams
): void;

declare function gtag(
  command: "event",
  eventName: string,
  params?: GtagEventParams | GtagConversionParams
): void;

declare function gtag(
  command: "set",
  key: "user_data",
  value: GtagUserData
): void;

declare function gtag(
  command: "set",
  params: Record<string, unknown>
): void;

interface Window {
  dataLayer: unknown[];
  gtag: typeof gtag;
}
