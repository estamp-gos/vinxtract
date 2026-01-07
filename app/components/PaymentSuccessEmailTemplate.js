import * as React from 'react';

export default function PaymentSuccessEmailTemplate({ customerEmail, customerName, transactionId, productName, amount, currency, vinNumber, tierName, tierPrice }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', color: '#333' }}>
      <h2 style={{ color: '#16a34a' }}>Payment Successful! 🎉</h2>
      <p>
        Hello {customerName},
      </p>
      <p>
        Thank you for your payment! We have successfully received your payment for the <strong>{productName}</strong> ({tierName} Report).
      </p>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '16px', 
        borderRadius: '8px', 
        margin: '20px 0',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ color: '#333', marginTop: '0' }}>Payment Details:</h3>
        <p><strong>Transaction ID:</strong> {transactionId}</p>
        <p><strong>Product:</strong> {productName} - {tierName} Report</p>
        <p><strong>Amount:</strong> {currency} {amount}</p>
        <p><strong>Report Tier:</strong> {tierName} (${tierPrice})</p>
        <p><strong>Email:</strong> {customerEmail}</p>
        {vinNumber && vinNumber !== 'N/A' && <p><strong>VIN:</strong> {vinNumber}</p>}
      </div>

      <h3 style={{ color: '#333' }}>What happens next?</h3>
      <ul style={{ lineHeight: '1.6' }}>
        <li>Your {tierName} vehicle history report is now being prepared with priority</li>
        <li>You will receive your detailed report within the next <strong>12 hours</strong></li>
        <li>The report will be sent to this email address: <strong>{customerEmail}</strong></li>
        <li>If you don&apos;t receive it within 12 hours, please check your spam folder</li>
      </ul>

      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '16px', 
        borderRadius: '8px', 
        margin: '20px 0',
        border: '1px solid #16a34a'
      }}>
        <p style={{ margin: '0', fontWeight: 'bold', color: '#16a34a' }}>
          ✅ Your payment for the {tierName} report has been processed successfully and your report is being prepared!
        </p>
      </div>

      <p>
        If you have any questions or need assistance, please don&apos;t hesitate to contact us at 
        <a href="mailto:support@vinxtract.com" style={{ color: '#16a34a' }}> car.check.store@gmail.com</a>
      </p>

      <p>Thank you for choosing CarCheck!</p>
      
      <p>Best regards,<br/>The CarCheck Team</p>
    </div>
  );
}
