import EmailTemplate from '../../components/Email_Template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { vin, email, carModel } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'support@vinxtract.com',
      to: [email],
      subject: 'Payment Completion mail - IGNORE THIS IF YOU HAVE ALREADY PAID FOR THE REPORT',
      react: EmailTemplate({ vin, email, carModel }),
    });

    if (error) {
      console.error('Error sending reminder mail:', error);
      return Response.json({ error: 'Failed to send reminder mail' }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Reminder mail sent successfully',
      data 
    }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json({ 
      error: 'An unexpected error occurred while sending reminder mail' 
    }, { status: 500 });
  }
}