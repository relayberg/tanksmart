import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Impressum = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl">
          <h1 className="text-display-sm text-foreground mb-8">Impressum</h1>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
              <p className="text-muted-foreground">
                TankSmart GmbH<br />
                Musterstraße 123<br />
                12345 Musterstadt<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Vertreten durch</h2>
              <p className="text-muted-foreground">
                Geschäftsführer: Max Mustermann
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
              <p className="text-muted-foreground">
                Telefon: 0800 123 456 789 (kostenlos)<br />
                E-Mail: info@tanksmart.de<br />
                Website: www.tanksmart.de
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Registereintrag</h2>
              <p className="text-muted-foreground">
                Eintragung im Handelsregister<br />
                Registergericht: Amtsgericht Musterstadt<br />
                Registernummer: HRB 12345
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Umsatzsteuer-ID</h2>
              <p className="text-muted-foreground">
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
                DE 123456789
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p className="text-muted-foreground">
                Max Mustermann<br />
                Musterstraße 123<br />
                12345 Musterstadt
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Impressum;
