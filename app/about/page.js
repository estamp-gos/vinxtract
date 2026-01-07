import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "About VinXtract - Professional Vehicle History Reports | Company Information",
  description: "Learn about CarCheck, the leading provider of comprehensive vehicle history reports. Trusted since 2015 with comprehensive data coverage worldwide.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function About() {
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
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</Link>
              <Link href="/about" className="text-blue-600 font-semibold">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About VinXtract
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Leading provider of comprehensive vehicle history reports since 2015. Trusted by car buyers, sellers, and dealers worldwide.
          </p>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Company</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>CarCheck</strong> is a professional vehicle history report service that has been serving customers worldwide since 2015. We specialize in providing comprehensive vehicle analysis and detailed automotive reports to help consumers make informed vehicle purchasing decisions.
                </p>
                <p>
                  Our mission is to provide accurate, reliable, and comprehensive vehicle history information through advanced data analysis and professional reporting. We believe that every car buyer deserves access to complete vehicle history information to make confident purchasing decisions.
                </p>
                <p>
                  CarCheck operates as a professional business providing digital vehicle history report services. We are committed to transparency, data accuracy, and customer satisfaction in all our business operations.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Company Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company Name:</span>
                  <span className="font-semibold text-gray-900">CarCheck</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Type:</span>
                  <span className="font-semibold text-gray-900">Professional Service</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Founded:</span>
                  <span className="font-semibold text-gray-900">2015</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry:</span>
                  <span className="font-semibold text-gray-900">Automotive Data Services</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold text-gray-900">Vehicle History Reports</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Website:</span>
                  <span className="font-semibold text-blue-600">vinxtract.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Service */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VinXtract provides professional vehicle history report services to help customers make informed car buying decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vehicle History Analysis</h3>
              <p className="text-gray-600">Comprehensive analysis of vehicle history data including accidents, title information, and ownership records.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional VIN Checks</h3>
              <p className="text-gray-600">Detailed VIN number verification and comprehensive vehicle identification analysis.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Reporting</h3>
              <p className="text-gray-600">Professional PDF reports with comprehensive vehicle information delivered via email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VinXtract
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to providing the most comprehensive and accurate vehicle history information available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Trusted Since 2015",
                description: "Nearly a decade of reliable vehicle history reporting service",
                icon: "🏆"
              },
              {
                title: "Comprehensive Sources",
                description: "Access to comprehensive automotive databases worldwide",
                icon: "🌐"
              },
              {
                title: "Professional Reports",
                description: "Detailed PDF reports with expert analysis and recommendations",
                icon: "📄"
              },
              {
                title: "Fast Delivery",
                description: "Reports typically delivered within 1-2 hours via email",
                icon: "⚡"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Information */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional Vehicle History Services
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            CarCheck operates as a professional business providing vehicle history report services to customers worldwide.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-white mb-2">Service Type</h4>
                <p className="text-blue-100">Digital vehicle history reports and VIN analysis services</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Pricing</h4>
                <p className="text-blue-100">$40 per comprehensive vehicle history report</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Delivery Method</h4>
                <p className="text-blue-100">Professional PDF reports delivered via email</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Delivery Time</h4>
                <p className="text-blue-100">6-12 hours maximum (typically 1-2 hours)</p>
              </div>
            </div>
          </div>

          <Link 
            href="/"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-block"
          >
            Get Your Vehicle Report
          </Link>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact VinXtract</h2>
            <p className="text-xl text-gray-600">Get in touch with our customer support team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Support</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-gray-900">Email Support</div>
                  <div className="text-gray-600">support@vinxtract.com</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Response Time</div>
                  <div className="text-gray-600">24-48 hours</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Availability</div>
                  <div className="text-gray-600">7 days a week</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-gray-900">Company</div>
                  <div className="text-gray-600">CarCheck</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Website</div>
                  <div className="text-gray-600">vinxtract.com</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Service</div>
                  <div className="text-gray-600">Professional Vehicle History Reports</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
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