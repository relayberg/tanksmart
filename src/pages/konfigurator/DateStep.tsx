import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, isWeekend, isBefore, startOfDay, getDay } from "date-fns";
import { de } from "date-fns/locale";
import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useOrder, TimeSlot } from "@/context/OrderContext";
import { cn } from "@/lib/utils";
import { Sun, Sunset, Clock, Info } from "lucide-react";

// German public holidays (fixed dates, some vary by year)
const getGermanHolidays = (year: number): Date[] => {
  const holidays: Date[] = [
    new Date(year, 0, 1),   // Neujahr
    new Date(year, 4, 1),   // Tag der Arbeit
    new Date(year, 9, 3),   // Tag der Deutschen Einheit
    new Date(year, 11, 25), // 1. Weihnachtsfeiertag
    new Date(year, 11, 26), // 2. Weihnachtsfeiertag
  ];

  // Easter-based holidays (simplified calculation)
  const easterSunday = getEasterSunday(year);
  holidays.push(addDays(easterSunday, -2));  // Karfreitag
  holidays.push(addDays(easterSunday, 1));   // Ostermontag
  holidays.push(addDays(easterSunday, 39));  // Christi Himmelfahrt
  holidays.push(addDays(easterSunday, 50));  // Pfingstmontag

  return holidays;
};

// Calculate Easter Sunday (Gaussian algorithm)
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

const timeSlots: { value: TimeSlot; icon: typeof Sun; title: string; description: string }[] = [
  {
    value: "morning",
    icon: Sun,
    title: "Vormittag",
    description: "8:00 - 12:00 Uhr",
  },
  {
    value: "afternoon",
    icon: Sunset,
    title: "Nachmittag",
    description: "12:00 - 17:00 Uhr",
  },
  {
    value: "flexible",
    icon: Clock,
    title: "Flexibel",
    description: "Ganztägig verfügbar",
  },
];

export default function DateStep() {
  const navigate = useNavigate();
  const { order, updateOrder, setCurrentStep, canProceed } = useOrder();

  // Calculate minimum date (5 business days from today)
  const minDate = useMemo(() => {
    let date = startOfDay(new Date());
    let businessDays = 0;
    
    while (businessDays < 5) {
      date = addDays(date, 1);
      const dayOfWeek = getDay(date);
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
    }
    
    return date;
  }, []);

  // Get holidays for current and next year
  const holidays = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [...getGermanHolidays(currentYear), ...getGermanHolidays(currentYear + 1)];
  }, []);

  // Check if date is disabled
  const isDateDisabled = (date: Date): boolean => {
    const today = startOfDay(new Date());
    
    // Before minimum date
    if (isBefore(date, minDate)) return true;
    
    // Weekend
    if (isWeekend(date)) return true;
    
    // Holiday
    if (holidays.some((h) => 
      h.getDate() === date.getDate() && 
      h.getMonth() === date.getMonth() && 
      h.getFullYear() === date.getFullYear()
    )) return true;
    
    return false;
  };

  const handleNext = () => {
    setCurrentStep(4);
    navigate("/konfigurator/lieferung");
  };

  return (
    <ConfiguratorLayout
      step={3}
      title="Wunschtermin wählen"
      subtitle="Wählen Sie Ihren bevorzugten Liefertermin"
      onNext={handleNext}
      canProceed={canProceed(3)}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Lieferdatum
          </label>
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={order.deliveryDate || undefined}
              onSelect={(date) => updateOrder({ deliveryDate: date || null })}
              disabled={isDateDisabled}
              locale={de}
              className="pointer-events-auto"
              fromDate={minDate}
            />
          </Card>
          
          {order.deliveryDate && (
            <p className="mt-3 text-sm text-foreground">
              Gewähltes Datum:{" "}
              <strong>{format(order.deliveryDate, "EEEE, d. MMMM yyyy", { locale: de })}</strong>
            </p>
          )}
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Zeitrahmen
          </label>
          <div className="space-y-3">
            {timeSlots.map((slot) => (
              <Card
                key={slot.value}
                variant={order.timeSlot === slot.value ? "glow" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  order.timeSlot === slot.value && "ring-2 ring-primary"
                )}
                onClick={() => updateOrder({ timeSlot: slot.value })}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <slot.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{slot.title}</h3>
                    <p className="text-sm text-muted-foreground">{slot.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info box */}
          <div className="mt-6 p-4 bg-accent/50 rounded-xl border border-primary/20 flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Der Lieferant meldet sich am Liefertag telefonisch bei Ihnen, um die genaue 
              Ankunftszeit (ca. 30-60 Min. vorher) abzustimmen.
            </p>
          </div>
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
