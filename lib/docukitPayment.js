/** DocuKit × VinXtract payment integration (Paddle via payments.docukit.site) */

export const DOCUKIT_PAYMENT_URL = 'https://payments.docukit.site/vinxtract.php';

export const DOCUKIT_PACKAGES = {
  basic: { USD: 29, EUR: 23 },
  premium: { USD: 59, EUR: 47 },
  ultimate: { USD: 89, EUR: 24.99 },
};

/** Redirect after successful payment on DocuKit / Paddle */
export const DOCUKIT_SUCCESS_URL = 'https://www.vinxtract.com/thankyou';

/** All checkouts use the ultimate package per product requirements */
export const DOCUKIT_CHECKOUT_PACKAGE = 'ultimate';

/** @param {string} [pkg] @param {string} [currency] USD | EUR */
export function getPackagePrice(pkg = DOCUKIT_CHECKOUT_PACKAGE, currency = 'EUR') {
  const code = (currency || 'EUR').toUpperCase();
  const priceKey = code === 'EUR' ? 'EUR' : 'USD';
  return DOCUKIT_PACKAGES[pkg]?.[priceKey] ?? DOCUKIT_PACKAGES.ultimate[priceKey];
}

/**
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.vin
 * @param {string} [params.phone]
 * @param {string} [params.vehicle_type]
 * @param {string} [params.currency] - USD, EUR (default USD)
 * @param {string} [params.success_url]
 * @param {string} [params.package]
 * @param {number} [params.amount]
 */
export function buildDocuKitPaymentUrl(params) {
  const pkg = params.package || DOCUKIT_CHECKOUT_PACKAGE;
  const currency = (params.currency || 'USD').toUpperCase();
  const priceKey = currency === 'EUR' ? 'EUR' : 'USD';
  const amount =
    params.amount ??
    DOCUKIT_PACKAGES[pkg]?.[priceKey] ??
    DOCUKIT_PACKAGES.ultimate[priceKey];

  const query = new URLSearchParams({
    name: params.name,
    email: params.email,
    vin: params.vin,
    package: pkg,
    amount: String(amount),
    currency,
  });

  if (params.phone) query.set('phone', params.phone);
  if (params.vehicle_type) query.set('vehicle_type', params.vehicle_type);
  query.set('success_url', params.success_url || DOCUKIT_SUCCESS_URL);

  return `${DOCUKIT_PAYMENT_URL}?${query.toString()}`;
}

export function getDefaultSuccessUrl() {
  if (typeof window !== 'undefined' && !window.location.hostname.includes('vinxtract.com')) {
    return `${window.location.origin}/thankyou`;
  }
  return DOCUKIT_SUCCESS_URL;
}

export function deriveCustomerName({ name, email, carModel }) {
  if (name?.trim()) return name.trim();
  if (carModel?.trim()) return carModel.trim();
  if (email?.includes('@')) return email.split('@')[0];
  return 'VinXtract Customer';
}
