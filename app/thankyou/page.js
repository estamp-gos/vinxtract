'use client'
import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useVehicle } from '@/lib/vehicleContext'

export default function ThankYou() {
  const {
    registration,
    year,
    vehicleModel,
    enrichment,
    hydrateFromStorage,
  } = useVehicle()

  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  useEffect(() => {
    if (
      registration.trim().length > 0 &&
      year.trim().length > 0 &&
      vehicleModel.trim().length > 0
    ) {
      setShowDownloadModal(true)
    }
  }, [registration, year, vehicleModel])

  const downloadReport = useCallback(async () => {
    setDownloading(true)
    try {
      let vehicleEnrichment = enrichment

      // If enrichment data is missing, fetch it from Groq API first
      if (!vehicleEnrichment || Object.keys(vehicleEnrichment).length === 0) {
        console.log('Enrichment missing, fetching from Groq API...')
        const lookupRes = await fetch('/api/lookup-vehicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registration: registration.trim(),
            year: year.trim(),
            vehicleModel: vehicleModel.trim(),
          }),
        })

        if (lookupRes.ok) {
          const lookupData = await lookupRes.json()
          if (lookupData.success && lookupData.data) {
            vehicleEnrichment = lookupData.data
            console.log('Enrichment data fetched successfully:', vehicleEnrichment)
          }
        } else {
          console.warn('Failed to fetch enrichment data, proceeding with N/A values')
        }
      }

      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration,
          year,
          vehicleModel,
          enrichment: vehicleEnrichment ?? undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Could not generate PDF')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeReg =
        String(registration || 'vehicle')
          .replace(/[^\w\d-]+/gi, '')
          .slice(0, 32) || 'vehicle'
      a.download = `VinXtract-Report-${safeReg}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Download failed')
    } finally {
      setDownloading(false)
    }
  }, [registration, year, vehicleModel, enrichment])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/car-logo.webp"
                alt="VinXtractStore"
                width={40}
                height={40}
                className="mr-3"
              />
              <div className="text-2xl font-bold text-blue-600">VinXtractStore</div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Thank You!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Your VinXtractStore VIN report request has been successfully submitted and payment has been processed. Your comprehensive vehicle history report will be delivered soon. For any query feel free to message us on support@vinxtract.com
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">What happens next?</h2>

            <div className="space-y-6">
              <div className="flex items-start text-left">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Processing Your Request</h3>
                  <p className="text-gray-600">Our VinXtractStore system is now processing your VIN and gathering data from comprehensive databases worldwide.</p>
                </div>
              </div>

              <div className="flex items-start text-left">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Report Generation</h3>
                  <p className="text-gray-600">Your comprehensive vehicle history report will be generated within the next 6-12 hours.</p>
                </div>
              </div>

              <div className="flex items-start text-left">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Delivery</h3>
                  <p className="text-gray-600">Your detailed report will be sent directly to your email address in PDF format.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Important Notes</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• This is a digital service and purchases are non-refundable</li>
                  <li>• Check your email inbox (including spam folder) for your report</li>
                  <li>• Reports are typically delivered within 1-2 hours</li>
                  <li>• Contact support if you don&apos;t receive your report within 12 hours</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={downloadReport}
              disabled={downloading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              {downloading ? 'Generating PDF…' : 'Download Report (PDF)'}
            </button>

            <Link
              href="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Back to Home
            </Link>

            <button
              type="button"
              onClick={() => { window.location.href = 'mailto:support@vinxtract.com' }}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold"
            >
              Contact Support
            </button>
          </div>
        </div>
      </main>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Need Help?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm">support@vinxtract.com</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600 text-sm">Within 12-24 hours</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Available</h3>
              <p className="text-gray-600 text-sm">Round-the-clock support</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center">
              <Image
                src="/car-logo.webp"
                alt="VinXtractStore"
                width={32}
                height={32}
                className="mr-3"
              />
              <div className="text-2xl font-bold text-blue-400">VinXtractStore</div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Refund Policy</a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400">
            © 2015 VinXtractStore. All rights reserved. | Vehicle History Reports & VIN Checks
          </div>
        </div>
      </footer>

      {showDownloadModal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="thankyou-download-title"
        >
          <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 text-2xl leading-none text-gray-500 hover:text-gray-700"
              onClick={() => setShowDownloadModal(false)}
            >
              &times;
            </button>

            <h2 id="thankyou-download-title" className="text-xl font-bold text-gray-900 pr-8">
              Your report PDF is ready
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Generate and download your VinXtract vehicle report using the details you submitted before checkout. Email delivery remains available if you prefer a copy from support.
            </p>

            {registration ? (
              <p className="mt-4 rounded-lg bg-gray-50 p-3 text-left text-sm text-gray-700">
                <span className="font-semibold">REG:</span> {registration}
                {year ? (
                  <>
                    {' '}
                    · <span className="font-semibold">Year:</span> {year}
                  </>
                ) : null}
              </p>
            ) : null}

            <button
              type="button"
              onClick={downloadReport}
              disabled={downloading}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-center text-base font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {downloading ? 'Generating PDF…' : 'Download Your Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
