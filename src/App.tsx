import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { OrderProvider } from "@/context/OrderContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AppSettingsProvider } from "@/context/AppSettingsContext";
import { GtagLoader } from "@/components/GtagLoader";
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

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminEmailSettings from "./pages/admin/settings/AdminEmailSettings";
import AdminEmailTemplates from "./pages/admin/settings/AdminEmailTemplates";
import AdminSmsTemplates from "./pages/admin/settings/AdminSmsTemplates";
import AdminApiSettings from "./pages/admin/settings/AdminApiSettings";
import AdminPriceSettings from "./pages/admin/settings/AdminPriceSettings";
import AdminBankSettings from "./pages/admin/settings/AdminBankSettings";
import AdminLegalSettings from "./pages/admin/settings/AdminLegalSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppSettingsProvider>
        <OrderProvider>
          <AdminAuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <GtagLoader />
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
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
                <Route path="/admin/settings/email" element={<AdminEmailSettings />} />
                <Route path="/admin/settings/templates" element={<AdminEmailTemplates />} />
                <Route path="/admin/settings/sms-templates" element={<AdminSmsTemplates />} />
                <Route path="/admin/settings/api" element={<AdminApiSettings />} />
                <Route path="/admin/settings/prices" element={<AdminPriceSettings />} />
                <Route path="/admin/settings/bank" element={<AdminBankSettings />} />
                <Route path="/admin/settings/legal" element={<AdminLegalSettings />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdminAuthProvider>
        </OrderProvider>
      </AppSettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
