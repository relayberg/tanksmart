-- Update the order confirmation template with professional design
UPDATE email_templates 
SET html_content = '<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f4f4f5; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">✓ Bestellung eingegangen</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Vielen Dank für Ihr Vertrauen!</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0;">Sehr geehrte(r) {{customer_name}},</p>
              
              <p style="color: #374151; font-size: 16px; margin: 0 0 32px 0;">wir haben Ihre Bestellung erhalten und werden diese schnellstmöglich bearbeiten. Sie erhalten in Kürze eine separate E-Mail mit Ihrem bestätigten Liefertermin und den Zahlungsinformationen.</p>
              
              <!-- Order Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #111827; font-size: 18px; margin: 0 0 16px 0; font-weight: 600;">📦 Ihre Bestellung</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Bestellnummer</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{{order_number}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Produkt</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">{{product}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Menge</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">{{quantity}} Liter</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Lieferadresse</td>
                        <td style="padding: 12px 0; color: #111827; font-size: 14px; text-align: right;">{{address}}</td>
                      </tr>
                    </table>
                    
                    <!-- Total Price -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; background-color: #ffffff; border-radius: 6px; padding: 16px;">
                      <tr>
                        <td style="color: #111827; font-size: 18px; font-weight: 700;">Gesamtbetrag</td>
                        <td style="color: #16a34a; font-size: 24px; font-weight: 700; text-align: right;">{{total_price}} €</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Next Steps -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">📋 Nächste Schritte</h3>
                <p style="color: #1e3a5f; font-size: 14px; margin: 0;">Wir prüfen die Verfügbarkeit und senden Ihnen innerhalb von 24 Stunden eine Terminbestätigung mit allen Zahlungsdetails.</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Mit freundlichen Grüßen,</p>
              <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">Ihr TankSmart24 Team</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0 0;">TankSmart24 GmbH • Musterstraße 123 • 12345 Musterstadt</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
subject = 'Bestellung {{order_number}} erfolgreich eingegangen - TankSmart24'
WHERE template_key = 'order_confirmation';

-- Update the appointment & payment template with professional design
UPDATE email_templates 
SET html_content = '<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f4f4f5; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">📅 Termin bestätigt!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Ihre Heizöl-Lieferung ist geplant</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0;">Sehr geehrte(r) {{customer_name}},</p>
              
              <p style="color: #374151; font-size: 16px; margin: 0 0 32px 0;">großartige Neuigkeiten! Wir konnten Ihren Wunschtermin bei unserem Partner <strong>{{provider_name}}</strong> sichern. Nachfolgend finden Sie alle Details zu Ihrer Lieferung und die Zahlungsinformationen.</p>
              
              <!-- Delivery Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px; border: 2px solid #16a34a; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #15803d; font-size: 18px; margin: 0 0 16px 0; font-weight: 600;">🚛 Liefertermin</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #166534; font-size: 14px;">Datum</td>
                        <td style="padding: 8px 0; color: #15803d; font-size: 18px; font-weight: 700; text-align: right;">{{delivery_date}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #166534; font-size: 14px;">Zeitfenster</td>
                        <td style="padding: 8px 0; color: #15803d; font-size: 16px; font-weight: 600; text-align: right;">{{time_slot}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #166534; font-size: 14px;">Lieferadresse</td>
                        <td style="padding: 8px 0; color: #166534; font-size: 14px; text-align: right;">{{address}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #166534; font-size: 14px;">Lieferant</td>
                        <td style="padding: 8px 0; color: #166534; font-size: 14px; text-align: right;">{{provider_name}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Payment Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 8px; border: 2px solid #f59e0b; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #b45309; font-size: 18px; margin: 0 0 8px 0; font-weight: 600;">💳 Zahlungsanweisung</h2>
                    <p style="color: #92400e; font-size: 14px; margin: 0 0 20px 0;">Bitte überweisen Sie die <strong>Anzahlung (50%)</strong> bis spätestens <strong>{{payment_due_date}}</strong></p>
                    
                    <!-- Amount to pay -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; margin-bottom: 20px; border: 1px solid #fcd34d;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <p style="color: #92400e; font-size: 14px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">Anzahlung</p>
                          <p style="color: #b45309; font-size: 36px; font-weight: 700; margin: 0;">{{deposit_amount}} €</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Bank Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #fcd34d;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="color: #92400e; font-size: 12px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Bankverbindung</p>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; color: #78716c; font-size: 13px; width: 140px;">Empfänger</td>
                              <td style="padding: 8px 0; color: #1c1917; font-size: 14px; font-weight: 600;">{{bank_recipient}}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #78716c; font-size: 13px; border-top: 1px solid #f5f5f4;">IBAN</td>
                              <td style="padding: 8px 0; color: #1c1917; font-size: 14px; font-weight: 600; font-family: ''Courier New'', monospace; letter-spacing: 1px; border-top: 1px solid #f5f5f4;">{{bank_iban}}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #78716c; font-size: 13px; border-top: 1px solid #f5f5f4;">BIC</td>
                              <td style="padding: 8px 0; color: #1c1917; font-size: 14px; font-weight: 600; font-family: ''Courier New'', monospace; border-top: 1px solid #f5f5f4;">{{bank_bic}}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #78716c; font-size: 13px; border-top: 1px solid #f5f5f4;">Verwendungszweck</td>
                              <td style="padding: 8px 0; color: #b45309; font-size: 14px; font-weight: 700; font-family: ''Courier New'', monospace; border-top: 1px solid #f5f5f4;">{{order_number}}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Order Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #111827; font-size: 18px; margin: 0 0 16px 0; font-weight: 600;">📦 Bestellübersicht</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Bestellnummer</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{{order_number}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Produkt</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">{{product}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Menge</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">{{quantity}} Liter</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Preis pro Liter</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">{{price_per_liter}} €</td>
                      </tr>
                      <tr>
                        <td style="padding: 14px 0; color: #111827; font-size: 16px; font-weight: 700;">Gesamtbetrag</td>
                        <td style="padding: 14px 0; color: #16a34a; font-size: 20px; font-weight: 700; text-align: right;">{{total_price}} €</td>
                      </tr>
                    </table>
                    
                    <!-- Payment Split -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                      <tr>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #6b7280; font-size: 14px;">50% Anzahlung (vor Lieferung)</td>
                              <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{{deposit_amount}} €</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 16px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #6b7280; font-size: 14px;">50% Restzahlung (nach Lieferung)</td>
                              <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{{remaining_amount}} €</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; font-size: 15px; margin: 0 0 8px 0; font-weight: 600;">ℹ️ Wichtige Hinweise</h3>
                <ul style="color: #1e3a5f; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Bitte geben Sie unbedingt die <strong>Bestellnummer {{order_number}}</strong> als Verwendungszweck an</li>
                  <li style="margin-bottom: 8px;">Der Fahrer meldet sich am Liefertag ca. 30-60 Minuten vorher telefonisch bei Ihnen</li>
                  <li>Die Restzahlung von {{remaining_amount}} € ist innerhalb von 7 Tagen nach Lieferung fällig</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Mit freundlichen Grüßen,</p>
              <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">Ihr TankSmart24 Team</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0 0;">Bei Fragen erreichen Sie uns unter info@tanksmart24.de</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0 0;">TankSmart24 GmbH • Musterstraße 123 • 12345 Musterstadt</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
subject = 'Termin bestätigt + Zahlungsanweisung - Bestellung {{order_number}}'
WHERE template_key = 'appointment_payment';

-- Update the payment received template with professional design
UPDATE email_templates 
SET html_content = '<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f4f4f5; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">✓ Zahlung erhalten!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Ihre Lieferung ist gesichert</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0;">Sehr geehrte(r) {{customer_name}},</p>
              
              <p style="color: #374151; font-size: 16px; margin: 0 0 32px 0;">vielen Dank! Wir haben Ihre Anzahlung für die Bestellung <strong>{{order_number}}</strong> erhalten. Ihr Liefertermin ist damit verbindlich bestätigt.</p>
              
              <!-- Confirmed Delivery -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px; border: 2px solid #16a34a; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="color: #166534; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Bestätigter Liefertermin</p>
                    <p style="color: #15803d; font-size: 24px; font-weight: 700; margin: 0;">{{delivery_date}}</p>
                    <p style="color: #166534; font-size: 16px; margin: 8px 0 0 0;">{{time_slot}}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; font-size: 15px; margin: 0 0 8px 0; font-weight: 600;">📞 Am Liefertag</h3>
                <p style="color: #1e3a5f; font-size: 14px; margin: 0;">Der Fahrer wird sich ca. 30-60 Minuten vor Ankunft telefonisch bei Ihnen melden. Bitte stellen Sie sicher, dass jemand vor Ort ist und der Tankzugang frei ist.</p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0 0;">Die Restzahlung von <strong>{{remaining_amount}} €</strong> ist innerhalb von 7 Tagen nach erfolgreicher Lieferung fällig.</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Mit freundlichen Grüßen,</p>
              <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">Ihr TankSmart24 Team</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0 0;">TankSmart24 GmbH • Musterstraße 123 • 12345 Musterstadt</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
subject = 'Zahlung erhalten - Lieferung {{order_number}} bestätigt'
WHERE template_key = 'payment_received';

-- Update delivery reminder template with professional design
UPDATE email_templates 
SET html_content = '<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f4f4f5; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🚛 Morgen ist es soweit!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Ihre Heizöl-Lieferung steht an</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0;">Sehr geehrte(r) {{customer_name}},</p>
              
              <p style="color: #374151; font-size: 16px; margin: 0 0 32px 0;">wir möchten Sie daran erinnern, dass Ihre Heizöl-Lieferung <strong>morgen</strong> erfolgt. Bitte stellen Sie sicher, dass der Tankzugang frei zugänglich ist.</p>
              
              <!-- Delivery Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; border: 2px solid #3b82f6; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="color: #1e40af; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Liefertermin</p>
                    <p style="color: #1d4ed8; font-size: 24px; font-weight: 700; margin: 0;">{{delivery_date}}</p>
                    <p style="color: #1e40af; font-size: 16px; margin: 8px 0 0 0;">{{time_slot}}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Checklist -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
                <h3 style="color: #111827; font-size: 15px; margin: 0 0 16px 0; font-weight: 600;">✅ Checkliste für morgen</h3>
                <ul style="color: #4b5563; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Tankdeckel ist zugänglich und entriegelt</li>
                  <li style="margin-bottom: 8px;">Einfahrt/Zufahrt ist für den LKW frei</li>
                  <li style="margin-bottom: 8px;">Jemand ist während des Zeitfensters erreichbar</li>
                  <li>Telefon ist griffbereit (Fahrer ruft 30-60 Min. vorher an)</li>
                </ul>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0 0;"><strong>Bestellnummer:</strong> {{order_number}}<br><strong>Menge:</strong> {{quantity}} Liter</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Mit freundlichen Grüßen,</p>
              <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">Ihr TankSmart24 Team</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0 0;">TankSmart24 GmbH • Musterstraße 123 • 12345 Musterstadt</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
subject = 'Erinnerung: Ihre Heizöl-Lieferung morgen - {{order_number}}'
WHERE template_key = 'delivery_reminder';