// payment.js – Mobile Money integration for ITI KAMO PWA
// -----------------------------------------------------------
// This module abstracts the payment flow using Mobile Money (M-Pesa / Orange Money).
// It can be imported in the main PWA entry point (main.js) and called from UI buttons.
// The implementation uses a simple server‑less endpoint (via Vercel) that forwards
// the request to the official Mobile Money API. In a production environment you
// would replace `PAYMENT_GATEWAY_URL` with your actual gateway.

const PAYMENT_GATEWAY_URL = "https://api.agentcy-enterprise.com/mobile‑money";

/**
 * Initiates a payment request.
 * @param {string} amount - Amount to be paid (numeric string, e.g. "15000").
 * @param {string} phone - Customer phone number in international format
 *                         (e.g. "+243812345678").
 * @param {string} description - Short description of the transaction.
 * @returns {Promise<object>} Resolves with {status, transactionId, message}.
 */
export async function initiatePayment(amount, phone, description) {
  try {
    const payload = {
      amount,
      phone,
      description,
      // You may add additional fields required by your gateway here.
    };

    const response = await fetch(PAYMENT_GATEWAY_URL + "/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If you use an API token, include it here.
        // "Authorization": `Bearer ${process.env.PAYMENT_API_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Payment init failed: ${response.status} – ${err}`);
    }

    const data = await response.json();
    // Expected response: { transactionId, status, message }
    return data;
  } catch (error) {
    console.error("[PAYMENT] initiatePayment error:", error);
    return { status: "FAILED", transactionId: null, message: error.message };
  }
}

/**
 * Checks the status of a previously created transaction.
 * @param {string} transactionId - The ID returned by `initiatePayment`.
 * @returns {Promise<object>} Resolves with {status, amount, phone, message}.
 */
export async function checkPaymentStatus(transactionId) {
  try {
    const response = await fetch(`${PAYMENT_GATEWAY_URL}/status/${transactionId}`);
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Status check failed: ${response.status} – ${err}`);
    }
    return await response.json();
  } catch (error) {
    console.error("[PAYMENT] checkPaymentStatus error:", error);
    return { status: "UNKNOWN", message: error.message };
  }
}

/**
 * Helper used by UI components to perform a full flow (initiate → wait → confirm).
 * It shows toast notifications using the existing `showToast` utility (if present).
 */
export async function processPayment(amount, phone, description) {
  const init = await initiatePayment(amount, phone, description);
  if (init.status !== "PENDING" && init.status !== "SUCCESS") {
    // Immediate failure
    if (typeof showToast === "function") {
      showToast(`❌ Paiement échoué : ${init.message}`, "error");
    }
    return init;
  }

  // Polling until final status (max 30 s)
  const pollInterval = 3000; // 3 s
  const maxAttempts = 10;
  let attempts = 0;
  let finalStatus = init;

  while (attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, pollInterval));
    const status = await checkPaymentStatus(init.transactionId);
    if (status.status === "SUCCESS" || status.status === "FAILED") {
      finalStatus = status;
      break;
    }
    attempts++;
  }

  if (typeof showToast === "function") {
    const icon = finalStatus.status === "SUCCESS" ? "✅" : "⚠️";
    showToast(`${icon} Paiement ${finalStatus.status.toLowerCase()}: ${finalStatus.message}`);
  }
  return finalStatus;
}

// Export a simple object for compatibility with older import styles
export const payment = { initiatePayment, checkPaymentStatus, processPayment };
