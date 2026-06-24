import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { PROOF_EMAIL_TO, MAX_PROOF_FILE_BYTES } from '@/lib/paymentConfig';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
]);

export async function POST(request) {
  try {
    const formData = await request.formData();

    const proof = formData.get('proof');
    const email = String(formData.get('email') || '').trim();
    const vin = String(formData.get('vin') || '').trim();
    const carModel = String(formData.get('carModel') || '').trim();
    const year = String(formData.get('year') || '').trim();
    const amount = String(formData.get('amount') || '').trim();
    const notes = String(formData.get('notes') || '').trim();

    if (!email || !vin) {
      return NextResponse.json(
        { success: false, message: 'Email and REG number are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!proof || typeof proof === 'string') {
      return NextResponse.json(
        { success: false, message: 'Payment proof file is required.' },
        { status: 400 }
      );
    }

    if (proof.size > MAX_PROOF_FILE_BYTES) {
      return NextResponse.json(
        { success: false, message: 'File is too large. Maximum size is 4MB.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(proof.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Upload an image or PDF.' },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { success: false, message: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const formattedDate = new Date().toLocaleString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const fileBuffer = Buffer.from(await proof.arrayBuffer());

    const adminInfo = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: [PROOF_EMAIL_TO],
      subject: `Payment Proof - ${vin} (${carModel || 'Vehicle'}) - £${amount || '52.99'}`,
      text: `
Payment Proof Submitted

REG: ${vin}
Car Model: ${carModel || 'N/A'}
Year: ${year || 'N/A'}
Customer Email: ${email}
Amount Paid: £${amount || '52.99'}
Submitted: ${formattedDate}
Notes: ${notes || 'None'}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Payment Proof Submitted</h2>
          <p><strong>REG:</strong> ${vin}</p>
          <p><strong>Car Model:</strong> ${carModel || 'N/A'}</p>
          <p><strong>Year:</strong> ${year || 'N/A'}</p>
          <p><strong>Customer Email:</strong> ${email}</p>
          <p><strong>Amount Paid:</strong> £${amount || '52.99'}</p>
          <p><strong>Submitted:</strong> ${formattedDate}</p>
          <p><strong>Notes:</strong> ${notes || 'None'}</p>
        </div>
      `,
      attachments: [
        {
          filename: proof.name || 'payment-proof',
          content: fileBuffer,
          contentType: proof.type,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Payment proof submitted successfully.',
      adminMessageId: adminInfo.messageId,
    });
  } catch (error) {
    console.error('upload-proof error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit payment proof. Please try again.' },
      { status: 500 }
    );
  }
}
