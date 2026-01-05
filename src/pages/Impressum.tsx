import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface LegalSettings {
  company_name: string;
  company_address: string;
  company_postal_code: string;
  company_city: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  company_ceo: string;
  company_registry: string;
  company_registry_number: string;
  company_vat_id: string;
}

const settingKeys = [
  'company_name',
  'company_address',
  'company_postal_code',
  'company_city',
  'company_phone',
  'company_email',
  'company_website',
  'company_ceo',
  'company_registry',
  'company_registry_number',
  'company_vat_id',
];

const Impressum = () => {
  const [settings, setSettings] = useState<LegalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', settingKeys);

      if (error) throw error;

      const newSettings: Record<string, string> = {};
      data?.forEach((item) => {
        newSettings[item.key] = item.value;
      });

      setSettings(newSettings as unknown as LegalSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Impressum"
        description="Impressum - Hier finden Sie alle Angaben gemäß § 5 TMG, Kontaktdaten und rechtliche Informationen."
        canonical="https://tanksmart24.de/impressum"
      />
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl px-4">
          <h1 className="text-display-sm text-foreground mb-8">Impressum</h1>
          
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="prose prose-slate max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
                <p className="text-muted-foreground">
                  {settings?.company_name || '[Firmenname nicht hinterlegt]'}<br />
                  {settings?.company_address || '[Adresse nicht hinterlegt]'}<br />
                  {settings?.company_postal_code || '[PLZ]'} {settings?.company_city || '[Stadt]'}<br />
                  Deutschland
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Vertreten durch</h2>
                <p className="text-muted-foreground">
                  Geschäftsführer: {settings?.company_ceo || '[Geschäftsführer nicht hinterlegt]'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
                <p className="text-muted-foreground">
                  Telefon: {settings?.company_phone || '[Telefon nicht hinterlegt]'}<br />
                  E-Mail: {settings?.company_email || '[E-Mail nicht hinterlegt]'}<br />
                  Website: {settings?.company_website || '[Website nicht hinterlegt]'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Registereintrag</h2>
                <p className="text-muted-foreground">
                  Eintragung im Handelsregister<br />
                  Registergericht: {settings?.company_registry || '[Registergericht nicht hinterlegt]'}<br />
                  Registernummer: {settings?.company_registry_number || '[Registernummer nicht hinterlegt]'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Umsatzsteuer-ID</h2>
                <p className="text-muted-foreground">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
                  {settings?.company_vat_id || '[USt-IdNr. nicht hinterlegt]'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                <p className="text-muted-foreground">
                  {settings?.company_ceo || '[Verantwortlicher nicht hinterlegt]'}<br />
                  {settings?.company_address || '[Adresse nicht hinterlegt]'}<br />
                  {settings?.company_postal_code || '[PLZ]'} {settings?.company_city || '[Stadt]'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Streitschlichtung</h2>
                <p className="text-muted-foreground">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                  <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
                <p className="text-muted-foreground mt-2">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Impressum;
