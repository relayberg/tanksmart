import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTimeSlot(slot: string | null): string {
  const slots: Record<string, string> = {
    'morning': 'Vormittag (8:00 - 12:00 Uhr)',
    'afternoon': 'Nachmittag (12:00 - 17:00 Uhr)',
    'flexible': 'Flexibel (ganztägig)',
  };
  return slots[slot || ''] || slot || '';
}

function formatOilType(type: string): string {
  const types: Record<string, string> = {
    'standard': 'Heizöl EL Standard',
    'premium': 'Heizöl EL Premium',
    'bio': 'Bio-Heizöl',
  };
  return types[type] || type;
}

function formatPrice(price: number): string {
  return price.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function replacePlaceholders(template: string, data: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value || '');
  }
  // Remove trailing spaces that cause =20 encoding issues
  return result.split('\n').map(line => line.trimEnd()).join('\n');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const {
      orderId,
      templateKey,
      customSubject,
      customContent,
      deliveryDateOverride,
      paymentDueDateOverride,
    } = await req.json();

    console.log(`Sending email for order ${orderId} with template ${templateKey}`);

    // Get SMTP settings
    const { data: smtpSettings, error: smtpError } = await supabase
      .from('smtp_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (smtpError || !smtpSettings) {
      console.error('No active SMTP settings found');
      return new Response(
        JSON.stringify({ error: 'SMTP not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error('Template not found:', templateError);
      return new Response(
        JSON.stringify({ error: 'Email template not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get bank and company settings
    const { data: appSettings } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', ['bank_recipient', 'bank_iban', 'bank_bic', 'company_name', 'company_email', 'company_phone', 'company_address', 'company_city', 'company_ceo', 'company_register', 'company_tax_id']);

    const settingsData: Record<string, string> = {};
    appSettings?.forEach(s => { settingsData[s.key] = s.value; });

    // Calculate payment amounts
    const totalPrice = Number(order.total_price);
    const depositAmount = Math.round(totalPrice * 0.5 * 100) / 100;
    const remainingAmount = Math.round((totalPrice - depositAmount) * 100) / 100;

    // Calculate payment due date (2 days before delivery, or use override)
    let paymentDueDate = paymentDueDateOverride;
    if (!paymentDueDate && (deliveryDateOverride || order.delivery_date)) {
      const deliveryDate = new Date(deliveryDateOverride || order.delivery_date);
      deliveryDate.setDate(deliveryDate.getDate() - 2);
      paymentDueDate = deliveryDate.toISOString().split('T')[0];
    }

    // Prepare placeholder data
    const placeholderData: Record<string, string> = {
      order_number: order.order_number,
      order_date: formatDate(order.created_at),
      customer_name: `${order.customer_salutation} ${order.customer_first_name} ${order.customer_last_name}`,
      customer_first_name: order.customer_first_name,
      customer_last_name: order.customer_last_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone || '',
      oil_type: formatOilType(order.oil_type),
      product: formatOilType(order.oil_type),
      quantity: String(order.quantity),
      price_per_liter: formatPrice(Number(order.price_per_liter)),
      total_price: formatPrice(totalPrice),
      deposit_amount: formatPrice(depositAmount),
      remaining_amount: formatPrice(remainingAmount),
      payment_due_date: formatDate(paymentDueDate),
      address: `${order.street} ${order.house_number}, ${order.postal_code} ${order.city}`,
      street: order.street,
      house_number: order.house_number,
      postal_code: order.postal_code,
      city: order.city,
      delivery_date: formatDate(deliveryDateOverride || order.delivery_date),
      time_slot: formatTimeSlot(order.time_slot),
      provider_name: order.provider_name,
      bank_recipient: settingsData.bank_recipient || '',
      bank_iban: settingsData.bank_iban || '',
      bank_bic: settingsData.bank_bic || '',
      company_name: settingsData.company_name || 'Die Heizer GmbH',
      company_email: settingsData.company_email || 'info@tanksmart24.de',
      company_phone: settingsData.company_phone || '',
      company_address: settingsData.company_address || '',
      company_city: settingsData.company_city || '',
      company_ceo: settingsData.company_ceo || '',
      company_register: settingsData.company_register || '',
      company_tax_id: settingsData.company_tax_id || '',
    };

    // Replace placeholders in template
    const subject = replacePlaceholders(customSubject || template.subject, placeholderData);
    const htmlContent = replacePlaceholders(customContent || template.html_content, placeholderData);

    // Create plain text version
    const textContent = htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Send email via SMTP
    const client = new SMTPClient({
      connection: {
        hostname: smtpSettings.host,
        port: smtpSettings.port,
        tls: smtpSettings.encryption === 'ssl',
        auth: {
          username: smtpSettings.username,
          password: smtpSettings.password_encrypted,
        },
      },
    });

    try {
      await client.send({
        from: `${smtpSettings.from_name} <${smtpSettings.from_email}>`,
        to: order.customer_email,
        subject: subject,
        content: textContent,
        html: htmlContent,
      });

      await client.close();

      console.log(`Email sent successfully to ${order.customer_email}`);

      // Log communication
      await supabase
        .from('order_communications')
        .insert({
          order_id: orderId,
          type: 'email',
          template_key: templateKey,
          recipient: order.customer_email,
          subject: subject,
          content: htmlContent,
          status: 'sent',
        });

      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (sendError: unknown) {
      console.error('Error sending email:', sendError);
      await client.close();
      const sendErrorMessage = sendError instanceof Error ? sendError.message : 'Unknown error';

      // Log failed communication
      await supabase
        .from('order_communications')
        .insert({
          order_id: orderId,
          type: 'email',
          template_key: templateKey,
          recipient: order.customer_email,
          subject: subject,
          content: htmlContent,
          status: 'notdelivered',
          metadata: { error: sendErrorMessage },
        });

      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: sendErrorMessage }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: unknown) {
    console.error('Send email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
