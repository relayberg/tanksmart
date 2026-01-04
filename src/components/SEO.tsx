import { Helmet } from "react-helmet-async";

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

// Organization JSON-LD - consistent on all pages (no cloaking risk)
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "S-Tank GmbH",
  alternateName: "TankSmart24",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+49-800-123456789",
    contactType: "customer service",
    availableLanguage: "German",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Musterstraße 123",
    addressLocality: "Musterstadt",
    postalCode: "12345",
    addressCountry: "DE",
  },
};

// WebSite JSON-LD
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "TankSmart24.de",
  description: "Heizöl Preisvergleich - Vergleichen Sie Anbieter und sparen Sie bei Ihrer Heizölbestellung.",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
};

export const SEO = ({
  title,
  description,
  canonical,
  noindex = false,
  type = "website",
  image = DEFAULT_IMAGE,
}: SEOProps) => {
  const fullTitle = title.includes("TankSmart24")
    ? title
    : `${title} | TankSmart24.de`;
  const canonicalUrl = canonical || BASE_URL;

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
