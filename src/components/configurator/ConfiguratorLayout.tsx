import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/OrderContext";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { number: 1, title: "Produkt", path: "/konfigurator/produkt" },
  { number: 2, title: "Anbieter", path: "/konfigurator/anbieter" },
  { number: 3, title: "Termin", path: "/konfigurator/termin" },
  { number: 4, title: "Lieferung", path: "/konfigurator/lieferung" },
  { number: 5, title: "Daten", path: "/konfigurator/daten" },
  { number: 6, title: "Zahlung", path: "/konfigurator/zahlung" },
];

interface ConfiguratorLayoutProps {
  children: ReactNode;
  step: number;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  nextLabel?: string;
  canProceed?: boolean;
  showBack?: boolean;
}

export function ConfiguratorLayout({
  children,
  step,
  title,
  subtitle,
  onNext,
  nextLabel = "Weiter",
  canProceed = true,
  showBack = true,
}: ConfiguratorLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentStep } = useOrder();

  const handleBack = () => {
    const prevStep = steps.find((s) => s.number === step - 1);
    if (prevStep) {
      setCurrentStep(step - 1);
      navigate(prevStep.path);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>Kostenlose Beratung:</span>
            <a href="tel:0800123456789" className="font-semibold text-primary">
              0800 123 456 789
            </a>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-card border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((s, index) => {
              const isActive = s.number === step;
              const isCompleted = s.number < step;
              const isClickable = s.number < step;

              return (
                <div key={s.number} className="flex items-center">
                  {/* Step indicator */}
                  <button
                    onClick={() => isClickable && navigate(s.path)}
                    disabled={!isClickable}
                    className={cn(
                      "flex flex-col items-center gap-1.5 transition-colors",
                      isClickable && "cursor-pointer hover:opacity-80",
                      !isClickable && !isActive && "cursor-default opacity-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                        isActive && "bg-primary text-primary-foreground shadow-glow-sm",
                        isCompleted && "bg-success text-success-foreground",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : s.number}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium hidden sm:block",
                        isActive && "text-primary",
                        isCompleted && "text-success",
                        !isActive && !isCompleted && "text-muted-foreground"
                      )}
                    >
                      {s.title}
                    </span>
                  </button>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-8 md:w-16 h-0.5 mx-2",
                        s.number < step ? "bg-success" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          <div className="mb-8">{children}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            {showBack && step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4" />
                Zurück
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant="hero"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed}
            >
              {nextLabel}
              {step < 6 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
