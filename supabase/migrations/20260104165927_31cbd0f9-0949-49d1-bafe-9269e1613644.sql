UPDATE email_templates SET
  html_content = '<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #16a34a; padding: 24px 32px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">Liefertermin bestätigt</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 4px 0 0 0; font-size: 14px;">Bestellung Nr. {{order_number}}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="color: #1f2937; font-size: 15px; margin: 0 0 20px 0;">Sehr geehrte(r) {{customer_name}},</p>
              
              <p style="color: #4b5563; font-size: 15px; margin: 0 0 24px 0;">wir freuen uns, Ihnen mitteilen zu können, dass Ihr Liefertermin bei unserem Partner {{provider_name}} erfolgreich reserviert wurde.</p>
              
              <!-- Delivery Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #f9fafb; padding: 12px 20px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #111827; font-size: 14px; font-weight: 600;">Liefertermin</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                      <tr>
                        <td style="padding: 4px 0; color: #6b7280; width: 120px;">Datum:</td>
                        <td style="padding: 4px 0; color: #111827; font-weight: 600;">{{delivery_date}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #6b7280;">Zeitfenster:</td>
                        <td style="padding: 4px 0; color: #111827;">{{time_slot}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #6b7280;">Lieferant:</td>
                        <td style="padding: 4px 0; color: #111827;">{{provider_name}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #6b7280;">Adresse:</td>
                        <td style="padding: 4px 0; color: #111827;">{{address}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Payment Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #fbbf24; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #fef3c7; padding: 12px 20px; border-bottom: 1px solid #fcd34d;">
                    <span style="color: #92400e; font-size: 14px; font-weight: 600;">Zahlungsinformation</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="color: #78350f; font-size: 14px; margin: 0 0 16px 0;">Bitte überweisen Sie die Anzahlung (50%) bis spätestens <strong>{{payment_due_date}}</strong>.</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border-radius: 4px; margin-bottom: 16px;">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <span style="color: #92400e; font-size: 13px; display: block; margin-bottom: 4px;">Anzahlung</span>
                          <span style="color: #78350f; font-size: 24px; font-weight: 700;">{{deposit_amount}} €</span>
                        </td>
                      </tr>
                    </table>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 4px;">
                      <tr>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #6b7280; width: 120px;">Empfänger:</td>
                              <td style="color: #111827; font-weight: 500;">{{bank_recipient}}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #6b7280; width: 120px;">IBAN:</td>
                              <td style="color: #111827; font-family: ''Courier New'', monospace; font-weight: 700;">{{bank_iban}}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #6b7280; width: 120px;">BIC:</td>
                              <td style="color: #111827; font-family: ''Courier New'', monospace; font-weight: 700;">{{bank_bic}}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 16px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #6b7280; width: 120px;">Verwendungszweck:&nbsp;</td>
                              <td style="color: #111827; font-weight: 500;">{{order_number}}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Order Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
                      <tr>
                        <td style="color: #6b7280; padding: 4px 0;">Produkt:</td>
                        <td style="color: #111827; text-align: right; padding: 4px 0;">{{oil_type}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 4px 0;">Menge:</td>
                        <td style="color: #111827; text-align: right; padding: 4px 0;">{{quantity}} Liter</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 4px 0;">Gesamtbetrag:</td>
                        <td style="color: #111827; text-align: right; padding: 4px 0; font-weight: 600;">{{total_price}} €</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 4px 0;">Anzahlung (50%):</td>
                        <td style="color: #16a34a; text-align: right; padding: 4px 0; font-weight: 600;">{{deposit_amount}} €</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 4px 0;">Restbetrag bei Lieferung:</td>
                        <td style="color: #111827; text-align: right; padding: 4px 0;">{{remaining_amount}} €</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; font-size: 14px; margin: 0;">Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 4px 0; font-weight: 600;">S-Tank GmbH</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">Untere Hauptstr. 7, 85250 Altomünster</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0 0;">Tel: +49 30 57654569 | info@tanksmart.de</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>'
WHERE template_key = 'appointment_payment';