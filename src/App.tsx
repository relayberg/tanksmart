import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderProvider } from "@/context/OrderContext";
import Index from "./pages/Index";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import Widerruf from "./pages/Widerruf";
import ProductStep from "./pages/konfigurator/ProductStep";
import ProviderStep from "./pages/konfigurator/ProviderStep";
import DateStep from "./pages/konfigurator/DateStep";
import DeliveryStep from "./pages/konfigurator/DeliveryStep";
import PersonalDataStep from "./pages/konfigurator/PersonalDataStep";
import PaymentStep from "./pages/konfigurator/PaymentStep";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OrderProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/widerruf" element={<Widerruf />} />
            
            {/* Configurator Steps */}
            <Route path="/konfigurator/produkt" element={<ProductStep />} />
            <Route path="/konfigurator/anbieter" element={<ProviderStep />} />
            <Route path="/konfigurator/termin" element={<DateStep />} />
            <Route path="/konfigurator/lieferung" element={<DeliveryStep />} />
            <Route path="/konfigurator/daten" element={<PersonalDataStep />} />
            <Route path="/konfigurator/zahlung" element={<PaymentStep />} />
            
            {/* Success Page */}
            <Route path="/bestellung-erfolgreich" element={<OrderSuccess />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
