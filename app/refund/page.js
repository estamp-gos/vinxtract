import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "Refund Policy - VinXtract | Vehicle History Reports",
  description: "Refund Policy for VinXtract vehicle history reports. Learn about our no-refund policy for digital vehicle history services.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/car-logo.webp"
                  alt="VinXtract"
                  width={40}
                  height={40}
                  className="mr-3"
                />
                <div className="text-2xl font-bold text-blue-600">VinXtract</div>
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Back to Home</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> November 4, 2025<br/>
            <strong>Last Updated:</strong> November 4, 2025
          </p>

          {/* Important Notice Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-medium text-blue-800">14-Day Refund Policy</h2>
                <div className="mt-2 text-sm text-blue-700">
                  <p><strong>CarCheck offers refunds within 14 days of purchase under specific conditions.</strong> As a digital service provider, we understand that certain circumstances may warrant a refund despite immediate report delivery.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Refund Policy Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                CarCheck provides refunds within <strong>14 days of purchase</strong> under specific circumstances outlined below. While our service provides immediate digital delivery of comprehensive vehicle history information, we recognize that certain situations may warrant a refund.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This policy balances the nature of our digital service delivery with fair customer protection and reasonable business practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 14-Day Refund Window</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Customers have exactly <strong>14 calendar days from the date of purchase</strong> to request a refund under the qualifying conditions listed in this policy.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Refund Period:</strong> 14 calendar days from purchase date</li>
                <li><strong>Request Method:</strong> Email support@vinxtract.com with your request</li>
                <li><strong>Processing Time:</strong> Approved refunds processed within 5-7 business days</li>
                <li><strong>Refund Method:</strong> Original payment method used for purchase</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Qualifying Conditions for Refunds</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Refunds within the 14-day window may be approved for the following situations:
              </p>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Technical Service Failure</h4>
                  <p className="text-gray-700 text-sm">If our system fails to generate or deliver a report due to technical issues on our end.</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Incorrect VIN Processing</h4>
                  <p className="text-gray-700 text-sm">If we process an incorrect VIN due to a system error (not customer input error).</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Duplicate Charges</h4>
                  <p className="text-gray-700 text-sm">If you were charged multiple times for the same report due to payment processing errors.</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Service Unavailable for VIN</h4>
                  <p className="text-gray-700 text-sm">If we cannot provide any meaningful data for a valid VIN due to database limitations.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Non-Qualifying Scenarios</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The following scenarios do <strong>NOT</strong> qualify for refunds, even within the 14-day window:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Input Errors</h4>
                  <p className="text-gray-700 text-sm">If you enter the wrong VIN number, we will still generate a report for the VIN provided.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Limited Historical Data</h4>
                  <p className="text-gray-700 text-sm">Some vehicles may have limited historical data. We deliver all available information regardless of quantity.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Clean History Reports</h4>
                  <p className="text-gray-700 text-sm">A &ldquo;clean&rdquo; report showing no accidents or issues is still valuable and complete information.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Change of Mind</h4>
                  <p className="text-gray-700 text-sm">Changing your mind about purchasing the vehicle after receiving the report does not qualify for a refund.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Dissatisfaction with Content</h4>
                  <p className="text-gray-700 text-sm">Dissatisfaction with the information content when the report contains all available data from our sources.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. What Our Service Includes</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you purchase a CarCheck vehicle history report for $40, you receive:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Comprehensive vehicle history report based on the VIN provided</li>
                <li>Accident and damage history (when available)</li>
                <li>Title information and ownership history</li>
                <li>Mileage verification and odometer readings</li>
                <li>Safety recall information</li>
                <li>Market value analysis</li>
                <li>Service and maintenance records (when available)</li>
                <li>Email delivery within 6-12 hours (usually 1-2 hours)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. How to Request a Refund</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you believe your situation qualifies for a refund under our policy:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Contact us within 14 days:</strong> Email support@vinxtract.com</li>
                <li><strong>Include your order details:</strong> Purchase date, VIN number, and payment information</li>
                <li><strong>Explain the qualifying reason:</strong> Clearly describe why you believe a refund is warranted</li>
                <li><strong>Provide evidence if applicable:</strong> Screenshots of errors or technical issues</li>
                <li><strong>Response time:</strong> We will review and respond within 24-48 hours</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Before You Purchase</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To minimize the need for refunds, please ensure you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Double-check the VIN:</strong> Ensure the VIN is entered correctly</li>
                <li><strong>Verify your email:</strong> Make sure your email address is correct for report delivery</li>
                <li><strong>Understand the service:</strong> We provide historical data available in our databases</li>
                <li><strong>Check your needs:</strong> Consider if you really need the vehicle history report</li>
                <li><strong>Read our Terms:</strong> Review our Terms of Service before purchasing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Customer Support</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our customer support team is available to help with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Refund requests and eligibility determination</li>
                <li>Technical issues with report delivery</li>
                <li>Questions about report content and interpretation</li>
                <li>Assistance with VIN lookup (if you&apos;re having trouble finding it)</li>
                <li>Guidance on understanding your vehicle history report</li>
                <li>General questions about our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Processing and Delivery Issues</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you experience delivery issues before requesting a refund:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Check your spam/junk email folder</li>
                <li>Ensure your email can receive attachments up to 10MB</li>
                <li>Wait up to 12 hours for delivery (most reports arrive within 1-2 hours)</li>
                <li>Contact our support team if you haven&apos;t received your report within 24 hours</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We will work to resolve delivery issues. If we cannot resolve the technical problem, this may qualify for a refund under our technical service failure provision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Legal and Regulatory Compliance</h2>
              <p className="text-gray-700 leading-relaxed">
                Our refund policy complies with applicable consumer protection laws and regulations governing digital services. This policy provides a fair balance between customer rights and business requirements for digital service delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed">
                If you disagree with a refund decision, you may escalate your concern by providing additional documentation. We are committed to fair resolution of all customer concerns within the bounds of this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Policy Updates</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to update this refund policy at any time. Changes will be effective immediately upon posting to our website. Your continued use of our service after policy changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For refund requests or questions about this policy:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@vinxtract.com<br/>
                  <strong>Website:</strong> <Link href="https://VinXtract.com" className="text-blue-600 hover:text-blue-700">https://VinXtract.com</Link><br/>
                  <strong>Response Time:</strong> 24-48 hours
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Acknowledgment</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                <p className="text-blue-800 font-medium">
                  By purchasing a CarCheck vehicle history report, you acknowledge that you have read, understood, and agree to this refund policy. You understand that refunds are available within 14 days under the specific qualifying conditions outlined above.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center">
              <Image
                src="/car-logo.webp"
                alt="VinXtract"
                width={32}
                height={32}
                className="mr-3"
              />
              <div className="text-xl font-bold text-blue-400">VinXtract</div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
              <Link href="/refund" className="hover:text-blue-400 transition-colors font-semibold">Refund Policy</Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400">
            © 2015 CarCheck. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
