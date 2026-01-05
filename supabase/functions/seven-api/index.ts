import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SEVEN_API_BASE = 'https://gateway.seven.io/api';

function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let normalized = phone.replace(/[^\d+]/g, '');
  
  // Convert German format to international
  if (normalized.startsWith('0')) {
    normalized = '+49' + normalized.substring(1);
  } else if (!normalized.startsWith('+')) {
    normalized = '+49' + normalized;
  }
  
  return normalized;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE');
}

function formatTimeSlot(slot: string | null): string {
  const slots: Record<string, string> = {
    'morning': 'Vormittag',
    'afternoon': 'Nachmittag',
    'flexible': 'Flexibel',
  };
  return slots[slot || ''] || slot || '';
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
  return result;
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

    const { action, orderId, phone, templateKey, messageId } = await req.json();

    console.log(`Seven API action: ${action}`);

    // Get Seven API configuration
    const { data: apiConfig, error: configError } = await supabase
      .from('api_integrations')
      .select('config, is_active')
      .eq('provider', 'seven')
      .single();

    if (configError || !apiConfig?.is_active) {
      return new Response(
        JSON.stringify({ error: 'Seven API not configured or inactive' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = apiConfig.config as { api_key: string; sender_id: string };
    
    if (!config.api_key) {
      return new Response(
        JSON.stringify({ error: 'Seven API key not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'balance': {
        const response = await fetch(`${SEVEN_API_BASE}/balance`, {
          headers: { 'X-Api-Key': config.api_key },
        });
        
        const balance = await response.text();
        
        return new Response(
          JSON.stringify({ balance: parseFloat(balance) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'hlr': {
        const normalizedPhone = normalizePhoneNumber(phone);
        
        const response = await fetch(`${SEVEN_API_BASE}/lookup/hlr?number=${encodeURIComponent(normalizedPhone)}`, {
          headers: { 'X-Api-Key': config.api_key },
        });
        
        const result = await response.json();
        
        const hlrStatus = {
          valid: result.status === true || result.status === 'valid',
          reachable: result.status_message?.toLowerCase().includes('reachable') || result.ported === false,
          carrier: result.current_carrier?.name || result.original_carrier?.name || 'Unknown',
          network_type: result.current_carrier?.network_type || 'unknown',
          country: result.country_code || result.country_name || '',
          international_format: result.international_format || normalizedPhone,
          raw_response: result,
        };

        // Update order if orderId provided
        if (orderId) {
          await supabase
            .from('orders')
            .update({
              hlr_status: hlrStatus,
              phone_verified: hlrStatus.valid,
              phone_validated_at: new Date().toISOString(),
            })
            .eq('id', orderId);
        }

        return new Response(
          JSON.stringify({ success: true, hlr: hlrStatus }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'cnam': {
        const normalizedPhone = normalizePhoneNumber(phone);
        
        const response = await fetch(`${SEVEN_API_BASE}/lookup/cnam?number=${encodeURIComponent(normalizedPhone)}`, {
          headers: { 'X-Api-Key': config.api_key },
        });
        
        const result = await response.json();
        
        const cnamStatus = {
          name: result.name || null,
          number: result.number || normalizedPhone,
          success: !!result.name,
          raw_response: result,
        };

        // Update order if orderId provided
        if (orderId) {
          await supabase
            .from('orders')
            .update({ cnam_status: cnamStatus })
            .eq('id', orderId);
        }

        return new Response(
          JSON.stringify({ success: true, cnam: cnamStatus }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'sms': {
        // Get order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError || !order) {
          return new Response(
            JSON.stringify({ error: 'Order not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const phoneNumber = phone || order.customer_phone;
        if (!phoneNumber) {
          return new Response(
            JSON.stringify({ error: 'No phone number available' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get SMS template
        const { data: template, error: templateError } = await supabase
          .from('sms_templates')
          .select('*')
          .eq('template_key', templateKey)
          .eq('is_active', true)
          .single();

        if (templateError || !template) {
          return new Response(
            JSON.stringify({ error: 'SMS template not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get company settings for placeholders
        const { data: appSettings } = await supabase
          .from('app_settings')
          .select('key, value')
          .in('key', ['company_phone', 'company_name', 'company_email']);

        const settingsData: Record<string, string> = {};
        appSettings?.forEach(s => { settingsData[s.key] = s.value; });

        // Calculate deposit amount
        const totalPrice = Number(order.total_price);
        const depositAmount = Math.round(totalPrice * 0.5 * 100) / 100;

        // Prepare placeholder data
        const placeholderData: Record<string, string> = {
          order_number: order.order_number,
          customer_name: `${order.customer_first_name} ${order.customer_last_name}`,
          delivery_date: formatDate(order.delivery_date),
          time_slot: formatTimeSlot(order.time_slot),
          total_price: formatPrice(totalPrice),
          deposit_amount: formatPrice(depositAmount),
          quantity: String(order.quantity),
          company_phone: settingsData.company_phone || '',
          company_name: settingsData.company_name || 'Die Heizer GmbH',
          company_email: settingsData.company_email || '',
        };

        const smsText = replacePlaceholders(template.content, placeholderData);
        const normalizedPhone = normalizePhoneNumber(phoneNumber);

        // Send SMS
        const response = await fetch(`${SEVEN_API_BASE}/sms`, {
          method: 'POST',
          headers: {
            'X-Api-Key': config.api_key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: normalizedPhone,
            text: smsText,
            from: config.sender_id || 'TankSmart',
          }),
        });

        const result = await response.json();

        // Log communication
        await supabase
          .from('order_communications')
          .insert({
            order_id: orderId,
            type: 'sms',
            template_key: templateKey,
            recipient: normalizedPhone,
            content: smsText,
            status: result.success === '100' ? 'transmitted' : 'notdelivered',
            metadata: {
              seven_message_id: result.messages?.[0]?.id,
              raw_response: result,
            },
          });

        return new Response(
          JSON.stringify({
            success: result.success === '100',
            messageId: result.messages?.[0]?.id,
            result,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'sms_status': {
        if (!messageId) {
          return new Response(
            JSON.stringify({ error: 'Message ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Checking SMS status for messageId: ${messageId}`);

        const response = await fetch(`${SEVEN_API_BASE}/status?msg_id=${messageId}`, {
          headers: { 'X-Api-Key': config.api_key },
        });

        const result = await response.text();
        const trimmedResult = result.trim().toUpperCase();
        
        console.log(`Seven API status response: "${result}" -> trimmed: "${trimmedResult}"`);

        // Map Seven.io status to our status
        const statusMap: Record<string, string> = {
          'DELIVERED': 'delivered',
          'NOTDELIVERED': 'notdelivered',
          'TRANSMITTED': 'transmitted',
          'ACCEPTED': 'transmitted',
          'BUFFERED': 'transmitted',
          'EXPIRED': 'notdelivered',
          'FAILED': 'notdelivered',
          'REJECTED': 'notdelivered',
          'UNKNOWN': 'sent',
        };

        const mappedStatus = statusMap[trimmedResult] || 'sent';
        console.log(`Mapped status: ${mappedStatus}`);

        // Update communication status if found
        if (orderId) {
          // Find the communication by order_id and messageId in metadata
          const { data: comms, error: findError } = await supabase
            .from('order_communications')
            .select('id, metadata')
            .eq('order_id', orderId)
            .eq('type', 'sms');

          if (findError) {
            console.error('Error finding communications:', findError);
          } else {
            // Find the one with matching seven_message_id
            const matchingComm = comms?.find((c) => {
              const meta = c.metadata as { seven_message_id?: string } | null;
              return meta?.seven_message_id === messageId;
            });

            if (matchingComm) {
              console.log(`Updating communication ${matchingComm.id} to status: ${mappedStatus}`);
              const { error: updateError } = await supabase
                .from('order_communications')
                .update({ status: mappedStatus })
                .eq('id', matchingComm.id);

              if (updateError) {
                console.error('Error updating communication status:', updateError);
              } else {
                console.log('Communication status updated successfully');
              }
            } else {
              console.log('No matching communication found for messageId:', messageId);
            }
          }
        }

        return new Response(
          JSON.stringify({ status: trimmedResult, mappedStatus }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: unknown) {
    console.error('Seven API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
