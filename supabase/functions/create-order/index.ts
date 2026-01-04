import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TS-${year}${month}${day}-${random}`;
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

    const orderData = await req.json();

    console.log('Creating order:', JSON.stringify(orderData, null, 2));

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Map salutation
    const salutationMap: Record<string, string> = {
      'herr': 'Herr',
      'frau': 'Frau',
      'divers': 'Divers',
    };

    // Prepare order record
    const order = {
      order_number: orderNumber,
      status: 'pending',
      oil_type: orderData.oilType || 'standard',
      quantity: orderData.quantity || 2000,
      additive: orderData.additive || 'none',
      price_per_liter: orderData.pricePerLiter || 0.85,
      total_price: orderData.totalPrice || 0,
      provider_name: orderData.providerName || '',
      provider_id: orderData.providerId || '',
      delivery_date: orderData.deliveryDate || null,
      time_slot: orderData.timeSlot || 'flexible',
      customer_salutation: salutationMap[orderData.salutation] || 'Herr',
      customer_first_name: orderData.firstName || '',
      customer_last_name: orderData.lastName || '',
      customer_email: orderData.email || '',
      customer_phone: orderData.phone || null,
      street: orderData.street || '',
      house_number: orderData.houseNumber || '',
      postal_code: orderData.postalCode || '',
      city: orderData.city || '',
      delivery_notes: orderData.deliveryNotes || null,
      hose_length: orderData.hoseLength || 'standard',
      truck_accessible: orderData.truckAccessible !== false,
      payment_method: 'invoice',
      gclid: orderData.gclid || null,
    };

    // Insert order
    const { data: createdOrder, error: insertError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting order:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created successfully:', createdOrder.order_number);

    // Check if auto order confirmation is enabled
    const { data: autoConfirmSetting } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'auto_order_confirmation')
      .single();

    if (autoConfirmSetting?.value === 'true') {
      // Send confirmation email via send-email function
      try {
        const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            orderId: createdOrder.id,
            templateKey: 'order_confirmation',
          }),
        });

        if (!response.ok) {
          console.error('Failed to send confirmation email');
        } else {
          console.log('Confirmation email sent');
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderNumber: createdOrder.order_number,
        orderId: createdOrder.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Create order error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
