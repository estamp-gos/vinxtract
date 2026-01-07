import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "Privacy Policy - VinXtract | Vehicle History Reports",
  description: "Privacy Policy for VinXtract vehicle history reports service. Learn how we collect, use, and protect your personal information.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> November 4, 2025<br/>
            <strong>Last Updated:</strong> November 4, 2025
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                CarCheck (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our vehicle history report services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect the following personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Email address (for report delivery)</li>
                <li>Vehicle Identification Number (VIN) that you submit</li>
                <li>Car model information you provide</li>
                <li>Payment information (processed securely through Paddle)</li>
                <li>IP address and browser information</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website addresses</li>
                <li>Device information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Generate and deliver vehicle history reports</li>
                <li>Process payments and transactions</li>
                <li>Communicate with you about your order</li>
                <li>Improve our services and website functionality</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website and providing services</li>
                <li><strong>Payment Processing:</strong> Payment information is processed by Paddle, our secure payment processor</li>
                <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers and databases</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. VIN numbers and email addresses are typically deleted within 30 days after report delivery, unless you explicitly consent to longer retention for customer service purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your personal information</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 leading-relaxed">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences. Disabling cookies may affect some functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your personal information in accordance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@vinxtract.com<br/>
                  <strong>Website:</strong> <Link href="https://VinXtract.com" className="text-blue-600 hover:text-blue-700">https://VinXtract.com</Link>
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
              <Link href="/privacy" className="hover:text-blue-400 transition-colors font-semibold">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
              <Link href="/refund" className="hover:text-blue-400 transition-colors">Refund Policy</Link>
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
