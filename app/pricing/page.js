'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Pricing() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState('sedan');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vin: ''
  });
  const [loading, setLoading] = useState(false);

  // Pricing Tiers Configuration - Vehicle Types
  const PRICING_TIERS = {
    hatchback: {
      name: 'Hatchback',
      price: 30,
      priceId: 'pri_01k8bkwee1djsx23kqk4c3qjgb',
      description: 'Compact & Efficient',
      features: ['Basic accident history', 'Ownership records', 'Mileage check']
    },
    sedan: {
      name: 'Sedan',
      price: 50,
      priceId: 'pri_01k8bm1n7k6kdkb62d0e5r1nha',
      description: 'Classic & Comfortable',
      features: ['Full accident history', 'Complete ownership records', 'Mileage verification', 'Title information', 'Safety recalls']
    },
    suv: {
      name: '4X4 / SUV',
      price: 70,
      priceId: 'pri_01k8bm2ygfy97ehkedx0361ynh',
      description: 'Rugged & Powerful',
      features: ['Full accident history', 'Complete ownership records', 'Mileage verification', 'Title information', 'Safety recalls', 'Market value analysis', 'Detailed damage assessment']
    }
  }

  // Paddle Configuration
  const CONFIG = {
    clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    priceId: PRICING_TIERS[selectedTier].priceId
  };

  // Modal styles
  const modalStyles = {
    overlay: {
      display: 'flex',
      position: 'fixed',
      zIndex: 1000,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modal: {
      backgroundColor: 'white',
      width: '90%',
      maxWidth: '500px',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 5px 30px rgba(0, 0, 0, 0.15)',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      right: '20px',
      top: '15px',
      fontSize: '24px',
      cursor: 'pointer'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px'
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    loadingSpinner: {
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '50%',
      borderTop: '4px solid #2563eb',
      width: '30px',
      height: '30px',
      animation: 'spin 1s linear infinite',
      margin: '10px auto'
    }
  };

  // Initialize Paddle
  useEffect(() => {
    let isMounted = true;

    const initializePaddle = () => {
      if (window.Paddle && isMounted) {
        try {
          window.Paddle.Environment.set("production");
          window.Paddle.Setup({
            token: CONFIG.clientToken,
            eventCallback: function (event) {
              if (event.name === "checkout.completed") {
                setShowModal(false);
                alert("Payment successful! You will receive your report shortly.");
              }
            }
          });
        } catch (error) {
          console.error("Paddle initialization error:", error);
        }
      }
    };

    // Load Paddle script if not already loaded
    if (!window.Paddle) {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.onload = initializePaddle;
      script.onerror = () => {
        console.error("Failed to load Paddle script");
      };
      document.head.appendChild(script);
    } else {
      initializePaddle();
    }

    return () => {
      isMounted = false;
    };
  }, [CONFIG.clientToken]);

  // Open modal
  const openModal = () => {
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', vin: '' });
    setLoading(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Send email notification
  const sendMail = async (data) => {
    try {
      const response = await fetch('https://restless-haze-c6a3.mohamedalzafar.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.text();
      if (response.ok) {
        // Submitted successfully
      } else {
        // Error occurred
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Open Paddle checkout
  const openPaddleCheckout = (customerName, customerEmail, customerVin) => {
    try {

      window.Paddle.Checkout.open({
        items: [{
          priceId: CONFIG.priceId,
          quantity: 1
        }],
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en",
        },
        customData: {
          "name": customerName,
          "email": customerEmail,
          "vin": customerVin,
          "tier": selectedTier,
          "tierName": PRICING_TIERS[selectedTier].name,
          "tierPrice": PRICING_TIERS[selectedTier].price
        }
      });

      setLoading(false);

    } catch (error) {
      console.error("Paddle checkout error:", error.message);
      alert("There was an error opening the checkout. Please try again.");
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      name: formData.name,
      email: formData.email,
      vin: formData.vin
    };

    sendMail(submitData);
    openPaddleCheckout(formData.name, formData.email, formData.vin);
  };
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
              <Link href="/pricing" className="text-blue-600 font-semibold">Pricing</Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            VinXtract Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transparent, affordable pricing for comprehensive vehicle history reports. No hidden fees, no subscriptions - just one fair price per report.
          </p>
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Report Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the level of detail you need for your vehicle history report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {Object.entries(PRICING_TIERS).map(([key, tier]) => (
              <div
                key={key}
                onClick={() => setSelectedTier(key)}
                className={`rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                  selectedTier === key
                    ? 'ring-2 ring-blue-600 bg-blue-50 scale-105'
                    : 'bg-white hover:shadow-xl'
                }`}
              >
                {key === 'premium' && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2">
                    <span className="font-semibold text-sm">MOST POPULAR</span>
                  </div>
                )}
                
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-5xl font-bold text-blue-600">${tier.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm">One-time payment</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTier(key);
                      openModal();
                    }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mb-6 ${
                      selectedTier === key
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get {tier.name} Report
                  </button>

                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Includes:</p>
                    <ul className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              How They Compare
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Hatchback</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Sedan</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">4X4 / SUV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-900">Accident History</td>
                    <td className="text-center py-3 px-4">Basic</td>
                    <td className="text-center py-3 px-4">✓ Full</td>
                    <td className="text-center py-3 px-4">✓ Full</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-900">Ownership Records</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓ Complete</td>
                    <td className="text-center py-3 px-4">✓ Complete</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-900">Mileage Verification</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-900">Title Information</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-900">Safety Recalls</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-900">Market Value Analysis</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-900">Detailed Damage Assessment</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What is Included in Every Report
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              For $40, you get a comprehensive vehicle history analysis with data from multiple trusted sources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Accident & Damage History",
                description: "Complete record of reported accidents, collisions, and damage incidents",
                icon: "🚗"
              },
              {
                title: "Title Information",
                description: "Title history, liens, salvage records, and ownership transfers",
                icon: "📋"
              },
              {
                title: "Mileage Verification",
                description: "Odometer readings and mileage rollback detection",
                icon: "📊"
              },
              {
                title: "Safety Recalls",
                description: "Open and resolved safety recalls and manufacturer notices",
                icon: "🛡️"
              },
              {
                title: "Market Value Analysis",
                description: "Current market value, depreciation analysis, and price recommendations",
                icon: "💰"
              },
              {
                title: "Service Records",
                description: "Maintenance history and service intervals (when available)",
                icon: "🔧"
              },
              {
                title: "Flood & Natural Disaster",
                description: "Water damage, hurricane, tornado, and other natural disaster records",
                icon: "🌪️"
              },
              {
                title: "Theft Records",
                description: "Stolen vehicle reports and recovery information",
                icon: "🚨"
              },
              {
                title: "Vehicle Specifications",
                description: "Detailed specs, equipment, features, and manufacturer information",
                icon: "⚙️"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fast & Reliable Delivery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your comprehensive vehicle history report delivered directly to your email.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Processing</h3>
              <p className="text-gray-600">Your request is processed immediately after payment confirmation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Delivery</h3>
              <p className="text-gray-600">Detailed PDF report sent to your email within 6-12 hours (usually 1-2 hours)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">All transactions secured with SSL encryption and privacy protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Secure Payment Options</h2>
          <p className="text-xl text-gray-600 mb-12">We accept all major payment methods through our secure payment processor, Paddle.</p>
          
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              <div className="text-center">
                <div className="text-3xl mb-2">💳</div>
                <p className="text-sm text-gray-600">Credit Cards</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <p className="text-sm text-gray-600">Debit Cards</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏦</div>
                <p className="text-sm text-gray-600">Bank Transfer</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="text-sm text-gray-600">Digital Wallets</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            All payments are processed securely by Paddle, our trusted payment partner. Your payment information is encrypted and never stored on our servers.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing FAQ</h2>
            <p className="text-xl text-gray-600">Common questions about our pricing and service.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What's the difference between the three tiers?",
                answer: "Hatchback ($30) includes essential information like accident history, ownership records, and mileage checks. Sedan ($50) adds complete title information and safety recalls. 4X4 / SUV ($70) includes everything plus market value analysis and detailed damage assessment."
              },
              {
                question: "Which tier should I choose?",
                answer: "Choose Hatchback if you just need essential information. Choose Sedan for a complete overview (most popular). Choose 4X4 / SUV if you're considering a purchase and want comprehensive analysis including market value and detailed damage assessment."
              },
              {
                question: "Are there any hidden fees or recurring charges?",
                answer: "No. All pricing is one-time per report. There are no hidden fees, monthly subscriptions, or recurring charges. You pay once and receive your complete vehicle history report."
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer: "No. VinXtract is a digital service with instant delivery. All sales are final and non-refundable. Please ensure you enter the correct VIN before purchasing."
              },
              {
                question: "How does your pricing compare to competitors?",
                answer: "Our pricing is competitive with other major vehicle history providers. We offer three flexible options to meet different needs, from budget-conscious buyers to those who want the most comprehensive analysis."
              },
              {
                question: "Do you offer discounts for multiple reports?",
                answer: "Currently, each report is priced individually. We may offer promotional pricing from time to time, but each VIN requires a separate report purchase."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Your Vehicle History Report?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust VinXtract for their vehicle history needs.
          </p>
          
          <div className="mb-8">
            <button 
              onClick={openModal}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-block"
            >
              Get Started - From ${PRICING_TIERS.hatchback.price}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="font-semibold text-white">Three pricing options</div>
              <div className="text-blue-100">$30 - $70 per report</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-white">Fast delivery: 6-12 hours</div>
              <div className="text-blue-100">Usually within 1-2 hours</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-white">Comprehensive data</div>
              <div className="text-blue-100">Multiple trusted sources</div>
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

      {/* Checkout Modal */}
      {showModal && (
        <div 
          style={modalStyles.overlay}
          onClick={closeModal}
        >
          <div 
            style={modalStyles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <span 
              style={modalStyles.closeButton}
              onClick={closeModal}
            >
              &times;
            </span>
            
            <h3 style={{ marginBottom: '20px', color: '#2563eb' }}>
              Enter Your Details
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={modalStyles.input}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={modalStyles.input}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Vehicle VIN Number
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  required
                  style={modalStyles.input}
                  placeholder="Enter VIN number"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...modalStyles.submitButton,
                  display: loading ? 'none' : 'block'
                }}
              >
                Proceed to Payment
              </button>

              {loading && (
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <div style={modalStyles.loadingSpinner}></div>
                  <p>Loading...</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}