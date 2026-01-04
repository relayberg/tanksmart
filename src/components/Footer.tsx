import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo className="brightness-0 invert" />
            <p className="text-sm text-secondary-foreground/70 leading-relaxed">
              Deutschlands führendes Heizöl-Preisvergleichsportal. Sparen Sie bis zu 30% 
              bei Ihrer nächsten Heizölbestellung.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Schnellzugriff</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/konfigurator/produkt" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Preisvergleich starten
                </Link>
              </li>
              <li>
                <a href="#spartipps" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Spartipps
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Häufige Fragen
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/impressum" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/agb" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link to="/widerruf" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/70">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                0800 123 456 789
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/70">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                info@tanksmart24.de
              </li>
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>
                  S-Tank GmbH<br />
                  Musterstraße 123<br />
                  12345 Musterstadt
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-foreground/50 text-center md:text-left">
            © {currentYear} S-Tank GmbH. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            <span className="text-xs text-secondary-foreground/40">SSL-verschlüsselt</span>
            <span className="text-xs text-secondary-foreground/40">Käuferschutz</span>
            <span className="text-xs text-secondary-foreground/40">Geprüfte Qualität</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
