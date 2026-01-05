-- Add new SMS template for appointment confirmation with payment reminder
INSERT INTO sms_templates (template_key, name, content, description, is_active)
VALUES (
  'appointment_confirmation',
  'Terminbestätigung',
  'TankSmart: Ihr Liefertermin ({{order_number}}) am {{delivery_date}} ist bestätigt. Zahlungsanweisung wurde per E-Mail gesendet. Bei Fragen: {{company_phone}}',
  'Bestätigung des Liefertermins mit Hinweis auf Zahlungsanweisung per E-Mail',
  true
);