'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BANK_PRICE_GBP,
  WISE_BANK_URL,
  SUPPORT_EMAIL,
  formatGbpPrice,
  MAX_PROOF_FILE_BYTES,
} from '@/lib/paymentConfig'

export default function UploadProof() {
  const [order, setOrder] = useState(null)
  const [notes, setNotes] = useState('')
  const [proofFile, setProofFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vinReport')
      if (raw) {
        setOrder(JSON.parse(raw))
      }
    } catch {
      setOrder(null)
    }
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setError('')
    if (!file) {
      setProofFile(null)
      return
    }
    if (file.size > MAX_PROOF_FILE_BYTES) {
      setError('File is too large. Maximum size is 4MB.')
      setProofFile(null)
      e.target.value = ''
      return
    }
    const allowed = file.type.startsWith('image/') || file.type === 'application/pdf'
    if (!allowed) {
      setError('Please upload an image (PNG, JPG, etc.) or PDF.')
      setProofFile(null)
      e.target.value = ''
      return
    }
    setProofFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!order?.email || !order?.vin) {
      setError('Order details are missing. Please return to the homepage and start again.')
      return
    }
    if (!proofFile) {
      setError('Please upload your payment screenshot.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('proof', proofFile)
      formData.append('email', order.email)
      formData.append('vin', order.vin)
      formData.append('carModel', order.carModel || '')
      formData.append('year', order.year || '')
      formData.append('amount', String(order.amountPaid ?? BANK_PRICE_GBP))
      formData.append('notes', notes.trim())

      const res = await fetch('/api/upload-proof', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Upload failed. Please try again.')
      }

      setShowThankYou(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const amountPaid = order?.amountPaid ?? BANK_PRICE_GBP

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Payment Proof</h1>
          <p className="text-gray-600 text-sm mb-6">
            Complete your {formatGbpPrice(amountPaid)} bank transfer on Wise, then upload your payment screenshot below.
          </p>

          <a
            href={WISE_BANK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-6 text-blue-600 hover:text-blue-700 text-sm font-semibold underline"
          >
            Open Wise payment page
          </a>

          {order ? (
            <div className="mb-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
              <p><span className="font-semibold">REG:</span> {order.vin}</p>
              <p><span className="font-semibold">Email:</span> {order.email}</p>
              {order.carModel ? (
                <p><span className="font-semibold">Car Model:</span> {order.carModel}</p>
              ) : null}
              {order.year ? (
                <p><span className="font-semibold">Year:</span> {order.year}</p>
              ) : null}
              <p><span className="font-semibold">Amount:</span> {formatGbpPrice(amountPaid)}</p>
              <p><span className="font-semibold">Payment method:</span> Bank transfer</p>
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              Order details not found. You can still upload proof if you completed payment — enter details manually below.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!order && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">REG Number</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    onChange={(e) => setOrder((prev) => ({ ...(prev || {}), vin: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    onChange={(e) => setOrder((prev) => ({ ...(prev || {}), email: e.target.value }))}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment screenshot (image or PDF, max 4MB)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                required
                onChange={handleFileChange}
                className="w-full text-sm text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Any extra details about your payment..."
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Payment Proof'}
            </button>
          </form>
        </div>
      </main>

      {showThankYou && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="thankyou-proof-title"
        >
          <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 text-2xl leading-none text-gray-500 hover:text-gray-700"
              onClick={() => setShowThankYou(false)}
            >
              &times;
            </button>

            <h2 id="thankyou-proof-title" className="text-xl font-bold text-gray-900 pr-8">
              Thank You!
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              You will receive your report in 15–20 minutes after payment confirmation. For further chat support and inquiry, kindly contact:{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 font-semibold hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>

            <button
              type="button"
              onClick={() => setShowThankYou(false)}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-center text-base font-semibold text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
