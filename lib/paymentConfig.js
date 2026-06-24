/** Bank transfer payment configuration (temporary Paddle bypass) */

export const CARD_PRICE_GBP = 59.99;
export const BANK_PRICE_GBP = 52.99;
export const BANK_DISCOUNT_GBP = 7;

export const WISE_BANK_URL = 'https://wise.com/pay/r/3z3m7dxtCGb6A6g';

export const PROOF_EMAIL_TO = 'rmoto7817@gmail.com';
export const SUPPORT_EMAIL = 'car.check.store@gmail.com';

export const UPLOAD_PROOF_PATH = '/upload-proof';

export const MAX_PROOF_FILE_BYTES = 4 * 1024 * 1024; // 4MB Vercel limit

/** @param {number} amount */
export function formatGbpPrice(amount) {
  const value = Number(amount);
  const formatted = Number.isInteger(value)
    ? value.toLocaleString('en-GB')
    : value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `£${formatted}`;
}

export function buildUploadProofUrl() {
  return UPLOAD_PROOF_PATH;
}
