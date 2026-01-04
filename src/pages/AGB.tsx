import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AGB = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl">
          <h1 className="text-display-sm text-foreground mb-8">Allgemeine Geschäftsbedingungen</h1>
          
          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">§ 1 Geltungsbereich</h2>
              <p className="text-muted-foreground">
                Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die über die 
                Plattform TankSmart zwischen der TankSmart GmbH und dem Kunden geschlossen werden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">§ 2 Vertragsschluss</h2>
              <p className="text-muted-foreground">
                Die Darstellung der Produkte auf unserer Website stellt kein rechtlich bindendes 
                Angebot, sondern einen unverbindlichen Online-Katalog dar. Durch Anklicken des 
                Buttons "Jetzt kostenpflichtig bestellen" geben Sie eine verbindliche Bestellung ab.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">§ 3 Preise und Zahlung</h2>
              <p className="text-muted-foreground">
                Alle angegebenen Preise sind Endpreise inklusive der gesetzlichen Mehrwertsteuer 
                und Lieferkosten.<br /><br />
                <strong>Zahlungsbedingungen:</strong><br />
                - 50% Anzahlung nach Terminbestätigung per Banküberweisung<br />
                - 50% Restzahlung innerhalb von 7 Tagen nach erfolgreicher Lieferung
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">§ 4 Lieferung</h2>
              <p className="text-muted-foreground">
                Die Lieferung erfolgt innerhalb Deutschlands an die vom Kunden angegebene 
                Lieferadresse. Die Lieferzeit beträgt in der Regel 2-5 Werktage nach 
                Terminbestätigung und Zahlungseingang der Anzahlung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">§ 5 Eigentumsvorbehalt</h2>
              <p className="text-muted-foreground">
                Die gelieferte Ware bleibt bis zur vollständigen Bezahlung Eigentum der 
                TankSmart GmbH.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">§ 6 Gewährleistung</h2>
              <p className="text-muted-foreground">
                Es gelten die gesetzlichen Gewährleistungsrechte. Die Gewährleistungsfrist 
                beträgt 2 Jahre ab Lieferung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">§ 7 Schlussbestimmungen</h2>
              <p className="text-muted-foreground">
                Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit 
                gesetzlich zulässig, der Sitz der TankSmart GmbH.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AGB;
