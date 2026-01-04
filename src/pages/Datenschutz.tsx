import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Datenschutz = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl px-4">
          <h1 className="text-display-sm text-foreground mb-8">Datenschutzerklärung</h1>
          
          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-lg font-medium mb-2">Allgemeine Hinweise</h3>
              <p className="text-muted-foreground">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Verantwortliche Stelle</h2>
              <p className="text-muted-foreground">
                TankSmart24 GmbH<br />
                Musterstraße 123<br />
                12345 Musterstadt<br /><br />
                Telefon: 0800 123 456 789<br />
                E-Mail: datenschutz@tanksmart24.de
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Datenerfassung auf dieser Website</h2>
              <h3 className="text-lg font-medium mb-2">Cookies</h3>
              <p className="text-muted-foreground">
                Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser 
                auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, 
                effektiver und sicherer zu machen.
              </p>
              
              <h3 className="text-lg font-medium mb-2 mt-4">Server-Log-Dateien</h3>
              <p className="text-muted-foreground">
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
                Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Bestellabwicklung</h2>
              <p className="text-muted-foreground">
                Zur Abwicklung Ihrer Bestellung erheben wir folgende Daten: Name, Anschrift, 
                E-Mail-Adresse, Telefonnummer und Zahlungsinformationen. Diese Daten werden 
                ausschließlich zur Durchführung des Vertrages verwendet und nach Ablauf der 
                gesetzlichen Aufbewahrungsfristen gelöscht.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Ihre Rechte</h2>
              <p className="text-muted-foreground">
                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten 
                personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der 
                Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. SSL-Verschlüsselung</h2>
              <p className="text-muted-foreground">
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung 
                vertraulicher Inhalte eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung 
                erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" 
                wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Datenschutz;
