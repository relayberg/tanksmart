import { Helmet } from "react-helmet-async";
import { useAppSettings } from "@/context/AppSettingsContext";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  type?: "website" | "article";
  image?: string;
}

const BASE_URL = "https://tanksmart24.de";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO = ({
  title,
  description,
  canonical,
  noindex = false,
  type = "website",
  image = DEFAULT_IMAGE,
}: SEOProps) => {
  const { settings } = useAppSettings();
  
  const fullTitle = title.includes("TankSmart24")
    ? title
    : `${title} | TankSmart24.de`;
  const canonicalUrl = canonical || BASE_URL;

  // Organization JSON-LD - dynamically generated from app_settings
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName || "Die Heizer GmbH",
    alternateName: "TankSmart24",
    url: settings.companyWebsite || BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    ...(settings.companyPhone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: settings.companyPhone,
        contactType: "customer service",
        availableLanguage: "German",
      },
    }),
    ...(settings.companyAddress && {
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.companyAddress,
        addressLocality: settings.companyCity,
        postalCode: settings.companyPostalCode,
        addressCountry: "DE",
      },
    }),
    ...(settings.companyEmail && { email: settings.companyEmail }),
  };

  // WebSite JSON-LD
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: BASE_URL,
    name: "TankSmart24.de",
    description: "Heizöl Preisvergleich - Vergleichen Sie Anbieter und sparen Sie bei Ihrer Heizölbestellung.",
    publisher: {
      "@type": "Organization",
      name: settings.companyName || "Die Heizer GmbH",
    },
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="TankSmart24.de" />
      <meta property="og:locale" content="de_DE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
