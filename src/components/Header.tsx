import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Startseite
          </Link>
          <Link 
            to="/konfigurator/produkt" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Preisvergleich
          </Link>
          <a 
            href="#vorteile" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Vorteile
          </a>
          <a 
            href="#faq" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-background border-b border-border/50">
          <div className="container py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Startseite
            </Link>
            <Link 
              to="/konfigurator/produkt" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preisvergleich
            </Link>
            <a 
              href="#vorteile" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vorteile
            </a>
            <a 
              href="#faq" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
