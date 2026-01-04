import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Logo />
        
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

      </div>
    </header>
  );
}
