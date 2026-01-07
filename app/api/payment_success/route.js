import { Paddle, Environment, EventName } from '@paddle/paddle-node-sdk';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import PaymentSuccessEmailTemplate from '@/app/components/PaymentSuccessEmailTemplate';

const paddle = new Paddle(process.env.PADDLE_API_KEY, {
  environment: Environment.production, // or Environment.sandbox if testing
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // Get raw body and signature
    const body = await request.text();
    const signature = request.headers.get('paddle-signature') || '';
    const secretKey = process.env.PADDLE_SECRET_KEY || '';

    if (!signature || !body) {
      console.error('Missing signature or body:', { signature: !!signature, body: !!body });
      return new Response(JSON.stringify({ message: 'Signature or body missing' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!secretKey) {
      console.error('Missing PADDLE_SECRET_KEY environment variable');
      return new Response(JSON.stringify({ message: 'Server configuration error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify webhook signature
    let eventData;
    try {
      eventData = await paddle.webhooks.unmarshal(
        body,
        secretKey,
        signature
      );
    } catch (verificationError) {
      console.error('Webhook verification failed:', verificationError);
      console.log('Attempting to process webhook without verification (DEV MODE)...');
      
      // Parse the body as JSON for development/testing
      try {
        eventData = JSON.parse(body);
      } catch (parseError) {
        console.error('Failed to parse webhook body:', parseError);
        return new Response(JSON.stringify({ message: 'Invalid webhook signature and unable to parse body' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Send payment success email to customer for specific events
    if ([EventName.TransactionPaid, EventName.TransactionCompleted].includes(eventData.eventType || eventData.event_type)) {
      const customerId = eventData.data?.customer_id;
      const transactionId = eventData.data?.id;
      const productName = eventData.data?.items?.[0]?.price?.name || "Vehicle History Report";
      const amount = eventData.data?.items?.[0]?.price?.unit_price?.amount || 0;
      const currency = eventData.data?.items?.[0]?.price?.unit_price?.currency_code || 'USD';
      const name = eventData.data?.payments?.[0]?.method_details?.card?.cardholder_name || 'Valued Customer';
      
      // Get custom data (VIN, email, tier info, etc.)
      const customData = eventData.data?.custom_data || {};
      const vinNumber = customData.vin || 'N/A';
      const tierName = customData.tierName || 'Standard';
      const tierPrice = customData.tierPrice || 50;
      const customerEmailFromCustomData = customData.email;

      if (customerId) {
        try {
          // Fetch customer details using Paddle API
          const customer = await paddle.customers.get(customerId);
          const customerEmail = customerEmailFromCustomData || customer.email;
          const customerName = customData.name || customer.name || 'Valued Customer';

          if (customerEmail) {
            console.log('Sending payment notification to admins for customer:', customerEmail);
            
            // Send email using nodemailer with Gmail
            try {
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { 
                  user: process.env.EMAIL_USER, 
                  pass: process.env.EMAIL_PASS 
                },
              });

              await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: 'car.check.store@gmail.com',
                subject: 'New Payment Received - Vehicle Report Request',
                html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #16a34a;">Payment Successful! 🎉</h2>
                    <p>Hello Admin,</p>
                    <p>A new payment has been received for a vehicle history report.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
                      <h3 style="color: #333; margin-top: 0;">Payment Details:</h3>
                      <p><strong>Transaction ID:</strong> ${transactionId}</p>
                      <p><strong>Product:</strong> ${productName}</p>
                      <p><strong>Amount:</strong> ${currency} ${(amount / 100).toFixed(2)}</p>
                      <p><strong>Report Tier:</strong> ${tierName} ($${tierPrice})</p>
                      <p><strong>Customer Email:</strong> ${customerEmail}</p>
                      <p><strong>Customer Name:</strong> ${customerName}</p>
                      <p><strong>VIN:</strong> ${vinNumber}</p>
                    </div>

                    <p style="color: #d97706; font-weight: bold;">⚠️ Action Required: Please prepare and send the ${tierName} vehicle history report to the customer.</p>
                    
                    <p>Best regards,<br/>VinXtract System</p>
                  </div>
                `,
              });

              console.log('Payment success email sent successfully via Gmail');
            } catch (emailError) {
              console.error('Gmail email sending failed:', emailError);
            }
          }
        } catch (customerFetchError) {
          console.error('Failed to fetch customer details:', customerFetchError);
          // Try sending email with custom data anyway
          if (customerEmailFromCustomData) {
            try {
              console.log('Sending payment notification to admins (fallback) for customer:', customerEmailFromCustomData);
              
              // Send email using nodemailer with Gmail
              const transporter = nodemailer.createTransporter({
                service: 'gmail',
                auth: { 
                  user: process.env.EMAIL_USER, 
                  pass: process.env.EMAIL_PASS 
                },
              });

              await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: 'car.check.store@gmail.com',
                subject: 'New Payment Received - Vehicle Report Request',
                html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #16a34a;">Payment Successful! 🎉</h2>
                    <p>Hello Admin,</p>
                    <p>A new payment has been received for a vehicle history report.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
                      <h3 style="color: #333; margin-top: 0;">Payment Details:</h3>
                      <p><strong>Transaction ID:</strong> ${transactionId}</p>
                      <p><strong>Product:</strong> ${productName}</p>
                      <p><strong>Amount:</strong> ${currency} ${(amount / 100).toFixed(2)}</p>
                      <p><strong>Report Tier:</strong> ${tierName} ($${tierPrice})</p>
                      <p><strong>Customer Email:</strong> ${customerEmailFromCustomData}</p>
                      <p><strong>Customer Name:</strong> ${customData.name || 'Valued Customer'}</p>
                      <p><strong>VIN:</strong> ${vinNumber}</p>
                    </div>

                    <p style="color: #d97706; font-weight: bold;">⚠️ Action Required: Please prepare and send the ${tierName} vehicle history report to the customer.</p>
                    
                    <p>Best regards,<br/>VinXtract System</p>
                  </div>
                `,
              });

              console.log('Payment success email sent successfully via Gmail (fallback)');
            } catch (fallbackError) {
              console.error('Failed to send fallback email:', fallbackError);
            }
          }
        }
      }
    }

    // Prepare email content
    let subject = `Paddle Event: ${eventData.eventType}`;
    let plain = `Event: ${eventData.eventType}\nData: ${JSON.stringify(eventData.data, null, 2)}`;
    let html = `
      <h3>Transaction Event</h3>
      <p><b>Event Type:</b> ${eventData.eventType}</p>
      <p><b>Event ID:</b> ${eventData.eventId || 'N/A'}</p>
      <p><b>Occurred At:</b> ${eventData.occurredAt || 'N/A'}</p>
      ${eventData.data.items && eventData.data.items.length > 0 ? `
      <p><b>Product:</b> ${eventData.data.items[0].price.name || "Unknown Product"}</p>
      <p><b>Amount:</b> $${((eventData.data.items[0].price.unit_price?.amount || 0) / 100).toFixed(2)} ${eventData.data.items[0].price.unit_price?.currency_code || 'USD'}</p>
      <p><b>Customer ID:</b> ${eventData.data.customer_id || 'N/A'}</p>
      <p><b>Transaction ID:</b> ${eventData.data.id || 'N/A'}</p>
      <p><b>Status:</b> ${eventData.data.status || 'N/A'}</p>
      <p><b>Status:</b> vinxtract Testing purposes </p>
      <p><b>Name:</b> ${eventData.data.payments?.[0]?.method_details?.card?.cardholder_name || 'N/A'}</p>
      ` : '<p><b>No items found in transaction</b></p>'}
      
    `;
    // <pre>${JSON.stringify(eventData.data, null, 2)}</pre>

    // Customize email based on event type
    switch (eventData.eventType) {
      case EventName.TransactionCreated:
        subject = `New Transaction Created: ${eventData.data.id}`;
        break;
      case EventName.TransactionPaid:
        subject = `Transaction Paid: ${eventData.data.id}`;
        break;
      case EventName.TransactionCompleted:
        subject = `Completed ---- ${eventData.data.id}`;
        break;
      case EventName.SubscriptionActivated:
        subject = `Subscription Activated: ${eventData.data.id}`;
        break;
      case EventName.SubscriptionCanceled:
        subject = `Subscription Canceled: ${eventData.data.id}`;
        break;
      default:
        break;
    }

    // Send Email
    try {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: { 
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS 
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'car.check.store@gmail.com',
        subject,
        text: plain,
        html,
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the webhook if email fails
    }

    return new Response(JSON.stringify({ 
      ok: true, 
      event: eventData.eventType,
      id: eventData.eventId 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ 
      message: 'Webhook processing failed', 
      error: error.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, paddle-signature',
    },
  });
}