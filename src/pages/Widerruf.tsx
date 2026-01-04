import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Widerruf = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl px-4">
          <h1 className="text-display-sm text-foreground mb-8">Widerrufsbelehrung</h1>
          
          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">Widerrufsrecht</h2>
              <p className="text-muted-foreground">
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen 
                Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag 
                des Vertragsabschlusses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Ausübung des Widerrufsrechts</h2>
              <p className="text-muted-foreground">
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (TankSmart24 GmbH, 
                Musterstraße 123, 12345 Musterstadt, Telefon: 0800 123 456 789, 
                E-Mail: widerruf@tanksmart24.de) mittels einer eindeutigen Erklärung 
                (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren 
                Entschluss, diesen Vertrag zu widerrufen, informieren.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Folgen des Widerrufs</h2>
              <p className="text-muted-foreground">
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, 
                die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen 
                vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über 
                Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
              </p>
            </section>

            <section className="bg-accent/50 border border-primary/20 rounded-xl p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Wichtiger Hinweis</h2>
              <p className="text-foreground/80">
                <strong>Das Widerrufsrecht erlischt bei der Lieferung von Heizöl</strong>, 
                sobald die Ware in Ihren Tank eingefüllt wurde. Heizöl ist eine Ware, die 
                nach der Lieferung aufgrund ihrer Beschaffenheit untrennbar mit anderen 
                Gütern vermischt wird. Nach § 312g Abs. 2 Nr. 4 BGB besteht in diesem Fall 
                kein Widerrufsrecht.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Muster-Widerrufsformular</h2>
              <p className="text-muted-foreground mb-4">
                Wenn Sie den Vertrag widerrufen wollen, können Sie das folgende Formular 
                verwenden (nicht vorgeschrieben):
              </p>
              <div className="bg-muted/50 rounded-lg p-4 md:p-6 text-sm text-muted-foreground">
                An TankSmart24 GmbH, Musterstraße 123, 12345 Musterstadt:<br /><br />
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen 
                Vertrag über den Kauf der folgenden Waren (*)/ die Erbringung der 
                folgenden Dienstleistung (*):<br /><br />
                Bestellt am (*) / erhalten am (*):<br />
                Name des/der Verbraucher(s):<br />
                Anschrift des/der Verbraucher(s):<br />
                Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):<br />
                Datum:<br /><br />
                (*) Unzutreffendes streichen.
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Widerruf;
