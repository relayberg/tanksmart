import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [companyName, setCompanyName] = useState<string>("S-Tank GmbH");

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "legal_company_name")
          .maybeSingle();

        if (!error && data?.value) {
          setCompanyName(data.value);
        }
      } catch (err) {
        console.error("Error fetching company name:", err);
      }
    };

    fetchCompanyName();
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Deutschlands führendes Heizöl-Preisvergleichsportal. Sparen Sie bis zu 30% 
              bei Ihrer nächsten Heizölbestellung.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-semibold mb-4">Schnellzugriff</div>
            <ul className="space-y-3">
              <li>
                <Link to="/konfigurator/produkt" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Preisvergleich starten
                </Link>
              </li>
              <li>
                <a href="#spartipps" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Spartipps
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Häufige Fragen
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="font-semibold mb-4">Rechtliches</div>
            <ul className="space-y-3">
              <li>
                <Link to="/impressum" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/agb" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link to="/widerruf" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-semibold mb-4">Kontakt</div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                info@tanksmart24.de
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-foreground/70 text-center md:text-left">
            © {currentYear} {companyName}. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            <span className="text-xs text-secondary-foreground/60">SSL-verschlüsselt</span>
            <span className="text-xs text-secondary-foreground/60">Käuferschutz</span>
            <span className="text-xs text-secondary-foreground/60">Geprüfte Qualität</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
