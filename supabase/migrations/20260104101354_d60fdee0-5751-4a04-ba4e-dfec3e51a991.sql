-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Table: admin_users
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE CHECK (char_length(username) >= 3),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: user_roles (for admin role management)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (admin_user_id, role)
);

-- Table: orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'scheduled', 'delivered', 'cancelled')),
  oil_type TEXT NOT NULL CHECK (oil_type IN ('standard', 'premium', 'bio')),
  quantity INTEGER NOT NULL CHECK (quantity >= 500 AND quantity <= 50000),
  additive TEXT DEFAULT 'none',
  price_per_liter NUMERIC(10, 4) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  provider_name TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  delivery_date DATE,
  time_slot TEXT CHECK (time_slot IN ('morning', 'afternoon', 'flexible')),
  customer_salutation TEXT CHECK (customer_salutation IN ('Herr', 'Frau', 'Divers')),
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  street TEXT NOT NULL,
  house_number TEXT NOT NULL,
  postal_code TEXT NOT NULL CHECK (char_length(postal_code) = 5),
  city TEXT NOT NULL,
  delivery_notes TEXT,
  hose_length TEXT DEFAULT 'standard' CHECK (hose_length IN ('standard', 'extended')),
  truck_accessible BOOLEAN DEFAULT true,
  unloading_points INTEGER DEFAULT 1,
  payment_method TEXT DEFAULT 'invoice',
  gclid TEXT,
  hlr_status JSONB,
  cnam_status JSONB,
  phone_verified BOOLEAN DEFAULT false,
  phone_validated_at TIMESTAMP WITH TIME ZONE,
  payment_received_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: order_communications
CREATE TABLE public.order_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  template_key TEXT,
  recipient TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'notdelivered', 'transmitted')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Table: email_templates
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: sms_templates
CREATE TABLE public.sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: app_settings (Key-Value Store)
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: smtp_settings
CREATE TABLE public.smtp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host TEXT NOT NULL,
  port INTEGER NOT NULL DEFAULT 587,
  username TEXT NOT NULL,
  password_encrypted TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL,
  encryption TEXT DEFAULT 'tls' CHECK (encryption IN ('tls', 'ssl')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: api_integrations
CREATE TABLE public.api_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL UNIQUE CHECK (provider IN ('seven', 'google_ads')),
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integrations ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE admin_user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies

-- admin_users: Public insert for registration, public select for auth
CREATE POLICY "Allow public insert for registration" ON public.admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select for auth" ON public.admin_users FOR SELECT USING (true);

-- user_roles: Public insert for admin creation, select for auth
CREATE POLICY "Allow public insert for role assignment" ON public.user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select for auth" ON public.user_roles FOR SELECT USING (true);

-- orders: Public insert for customer orders, all ops for service role
CREATE POLICY "Allow public insert for orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select for orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public update for orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for orders" ON public.orders FOR DELETE USING (true);

-- order_communications
CREATE POLICY "Allow all on order_communications" ON public.order_communications FOR ALL USING (true);

-- email_templates
CREATE POLICY "Allow all on email_templates" ON public.email_templates FOR ALL USING (true);

-- sms_templates
CREATE POLICY "Allow all on sms_templates" ON public.sms_templates FOR ALL USING (true);

-- app_settings: Public select, all for authenticated
CREATE POLICY "Allow public select on app_settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on app_settings" ON public.app_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on app_settings" ON public.app_settings FOR UPDATE USING (true);

-- smtp_settings
CREATE POLICY "Allow all on smtp_settings" ON public.smtp_settings FOR ALL USING (true);

-- api_integrations
CREATE POLICY "Allow all on api_integrations" ON public.api_integrations FOR ALL USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sms_templates_updated_at BEFORE UPDATE ON public.sms_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_smtp_settings_updated_at BEFORE UPDATE ON public.smtp_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_integrations_updated_at BEFORE UPDATE ON public.api_integrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default app_settings
INSERT INTO public.app_settings (key, value) VALUES
  ('admin_registration_enabled', 'true'),
  ('market_price', '0.85'),
  ('auto_order_confirmation', 'false'),
  ('bank_recipient', 'TankSmart GmbH'),
  ('bank_iban', 'DE00 0000 0000 0000 0000 00'),
  ('bank_bic', 'COBADEFFXXX'),
  ('company_name', 'TankSmart GmbH'),
  ('company_address', 'Musterstraße 123'),
  ('company_postal_code', '12345'),
  ('company_city', 'Berlin'),
  ('company_phone', '+49 30 123456789'),
  ('company_email', 'info@tanksmart.de'),
  ('company_website', 'https://tanksmart.de'),
  ('company_ceo', 'Max Mustermann'),
  ('company_registry', 'Amtsgericht Berlin Charlottenburg'),
  ('company_registry_number', 'HRB 123456'),
  ('company_vat_id', 'DE123456789');

-- Insert default email templates
INSERT INTO public.email_templates (template_key, name, subject, html_content, description) VALUES
  ('order_confirmation', 'Bestellbestätigung', 'Ihre Bestellung {{order_number}} bei TankSmart', '<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #16a34a;">Vielen Dank für Ihre Bestellung!</h1><p>Sehr geehrte(r) {{customer_name}},</p><p>vielen Dank für Ihre Bestellung bei TankSmart. Wir haben Ihre Bestellung erhalten und werden diese schnellstmöglich bearbeiten.</p><h2>Bestelldetails</h2><table style="width: 100%; border-collapse: collapse;"><tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Bestellnummer:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{order_number}}</td></tr><tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Produkt:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{product}}</td></tr><tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Menge:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{quantity}} Liter</td></tr><tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Gesamtpreis:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{total_price}} €</td></tr></table><p>Wir werden uns in Kürze bei Ihnen melden, um den Liefertermin zu bestätigen.</p><p>Mit freundlichen Grüßen,<br>Ihr TankSmart Team</p></div></body></html>', 'Wird automatisch nach Bestelleingang gesendet'),
  ('appointment_payment', 'Terminbestätigung & Zahlungsanweisung', 'Liefertermin bestätigt - Zahlungsanweisung für {{order_number}}', '<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #16a34a;">Ihr Liefertermin steht fest!</h1><p>Sehr geehrte(r) {{customer_name}},</p><p>wir freuen uns, Ihnen mitteilen zu können, dass Ihr Liefertermin bestätigt wurde.</p><h2>Lieferdetails</h2><table style="width: 100%; border-collapse: collapse;"><tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Liefertermin:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{delivery_date}}</td></tr><tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Zeitfenster:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{time_slot}}</td></tr><tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Lieferadresse:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{address}}</td></tr></table><h2>Zahlungsanweisung</h2><p>Bitte überweisen Sie die <strong>Anzahlung von 50%</strong> bis zum <strong>{{payment_due_date}}</strong>:</p><table style="width: 100%; border-collapse: collapse; background: #f9f9f9; padding: 15px;"><tr><td style="padding: 8px;"><strong>Betrag:</strong></td><td style="padding: 8px;">{{deposit_amount}} €</td></tr><tr><td style="padding: 8px;"><strong>Empfänger:</strong></td><td style="padding: 8px;">{{bank_recipient}}</td></tr><tr><td style="padding: 8px;"><strong>IBAN:</strong></td><td style="padding: 8px;">{{bank_iban}}</td></tr><tr><td style="padding: 8px;"><strong>BIC:</strong></td><td style="padding: 8px;">{{bank_bic}}</td></tr><tr><td style="padding: 8px;"><strong>Verwendungszweck:</strong></td><td style="padding: 8px;">{{order_number}}</td></tr></table><p>Der Restbetrag von <strong>{{remaining_amount}} €</strong> ist nach erfolgreicher Lieferung fällig.</p><p>Mit freundlichen Grüßen,<br>Ihr TankSmart Team</p></div></body></html>', 'Wird nach Terminbestätigung mit Zahlungsanweisung gesendet'),
  ('payment_received', 'Zahlungseingang bestätigt', 'Zahlungseingang für {{order_number}} bestätigt', '<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #16a34a;">Zahlung erhalten!</h1><p>Sehr geehrte(r) {{customer_name}},</p><p>vielen Dank! Wir haben Ihre Anzahlung für die Bestellung {{order_number}} erhalten.</p><p>Ihr Liefertermin am <strong>{{delivery_date}}</strong> ist damit bestätigt.</p><p>Mit freundlichen Grüßen,<br>Ihr TankSmart Team</p></div></body></html>', 'Bestätigung des Zahlungseingangs'),
  ('delivery_scheduled', 'Liefertermin bestätigt', 'Ihr Liefertermin für {{order_number}}', '<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #16a34a;">Liefertermin bestätigt</h1><p>Sehr geehrte(r) {{customer_name}},</p><p>Ihr Heizöl wird am <strong>{{delivery_date}}</strong> ({{time_slot}}) geliefert.</p><p>Der Fahrer meldet sich ca. 30-60 Minuten vor Ankunft telefonisch bei Ihnen.</p><p>Mit freundlichen Grüßen,<br>Ihr TankSmart Team</p></div></body></html>', 'Erinnerung an den Liefertermin'),
  ('delivery_completed', 'Lieferung abgeschlossen', 'Ihre Heizöl-Lieferung wurde abgeschlossen - {{order_number}}', '<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #16a34a;">Lieferung erfolgreich!</h1><p>Sehr geehrte(r) {{customer_name}},</p><p>Ihre Heizöl-Lieferung wurde erfolgreich abgeschlossen. Wir hoffen, Sie sind zufrieden mit unserem Service.</p><p>Vielen Dank, dass Sie TankSmart gewählt haben!</p><p>Mit freundlichen Grüßen,<br>Ihr TankSmart Team</p></div></body></html>', 'Wird nach erfolgreicher Lieferung gesendet');

-- Insert default SMS templates
INSERT INTO public.sms_templates (template_key, name, content, description) VALUES
  ('delivery_reminder', 'Liefererinnerung', 'TankSmart: Ihre Heizöl-Lieferung ({{order_number}}) erfolgt am {{delivery_date}}. Der Fahrer meldet sich vorher.', 'Erinnerung am Tag vor der Lieferung'),
  ('delivery_today', 'Lieferung heute', 'TankSmart: Ihr Heizöl wird heute geliefert! Bestellung {{order_number}}, {{quantity}}L. Fahrer meldet sich 30-60 Min. vorher.', 'Information am Liefertag'),
  ('payment_reminder', 'Zahlungserinnerung', 'TankSmart: Bitte überweisen Sie {{deposit_amount}}€ für Bestellung {{order_number}} bis {{payment_due_date}}. Danke!', 'Zahlungserinnerung');

-- Insert default API integrations
INSERT INTO public.api_integrations (provider, config, is_active) VALUES
  ('seven', '{"api_key": "", "sender_id": "TankSmart"}', false),
  ('google_ads', '{"conversion_id": "", "conversion_label": ""}', false);