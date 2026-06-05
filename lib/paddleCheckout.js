import { DOCUKIT_CHECKOUT_PACKAGE, getDefaultSuccessUrl } from './docukitPayment';

const PADDLE_SCRIPT_SRC = 'https://cdn.paddle.com/paddle/v2/paddle.js';
const PADDLE_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'live_4d8274c2bffeec3a2558df9da5a';
const PADDLE_PRICE_ID =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || 'pri_01krk1kkza3vmnvdbgj69m09c8';

let paddleLoadPromise = null;
let paddleInitialized = false;

function loadPaddleScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Paddle checkout requires a browser environment'));
  }

  if (window.Paddle) {
    return Promise.resolve(window.Paddle);
  }

  if (!paddleLoadPromise) {
    paddleLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${PADDLE_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(window.Paddle));
        existing.addEventListener('error', () => reject(new Error('Failed to load Paddle.js')));
        return;
      }

      const script = document.createElement('script');
      script.src = PADDLE_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(window.Paddle);
      script.onerror = () => reject(new Error('Failed to load Paddle.js'));
      document.head.appendChild(script);
    });
  }

  return paddleLoadPromise;
}

function initializePaddle(Paddle, successUrl) {
  if (paddleInitialized) return;

  Paddle.Environment.set('production');
  Paddle.Initialize({
    token: PADDLE_CLIENT_TOKEN,
    eventCallback(data) {
      if (data.name === 'checkout.completed') {
        window.location.href = successUrl;
      }
    },
  });

  paddleInitialized = true;
}

/**
 * Open Paddle overlay checkout with post-payment redirect to /thankyou.
 * Uses settings.successUrl (Paddle Billing v2) instead of deprecated successCallback.
 */
export async function openVinXtractCheckout(params) {
  const successUrl = params.success_url || getDefaultSuccessUrl();
  const Paddle = await loadPaddleScript();
  initializePaddle(Paddle, successUrl);

  Paddle.Checkout.open({
    settings: {
      displayMode: 'overlay',
      successUrl,
    },
    items: [{ priceId: PADDLE_PRICE_ID, quantity: 1 }],
    customer: {
      email: params.email,
      name: params.name,
    },
    customData: {
      vin: params.vin,
      package: params.package || DOCUKIT_CHECKOUT_PACKAGE,
      vehicle_type: params.vehicle_type || '',
      source: 'vinxtract',
    },
  });
}
