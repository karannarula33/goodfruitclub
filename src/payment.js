// Razorpay Checkout helper. Loads checkout.js on demand, asks our server to
// create a Razorpay order for a given GFC order token, opens the modal, and
// verifies the result server-side. Reused by checkout and the tracking page.

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise = null;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = CHECKOUT_SRC;
    s.onload = () => resolve();
    s.onerror = () => { scriptPromise = null; reject(new Error("Failed to load Razorpay")); };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

// Runs the full online-payment flow for an existing order.
// Calls onSuccess() after the payment is verified paid, onDismiss() if the user
// closes the modal without paying, onError(message) on failure.
export async function payWithRazorpay(token, { onSuccess, onDismiss, onError } = {}) {
  try {
    await loadCheckout();

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Could not start payment");
    }
    const p = await res.json();

    const rzp = new window.Razorpay({
      key: p.keyId,
      amount: p.amount,
      currency: p.currency,
      order_id: p.rzpOrderId,
      name: "Good Fruit Club",
      description: `Order ${p.orderNo}`,
      prefill: { name: p.name, email: p.email, contact: p.phone },
      theme: { color: "#1B4332" },
      handler: async (resp) => {
        try {
          const vr = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            }),
          });
          if (!vr.ok) throw new Error("Verification failed");
          onSuccess?.();
        } catch (err) {
          onError?.(err.message || "Payment could not be verified");
        }
      },
      modal: { ondismiss: () => onDismiss?.() },
    });

    rzp.on("payment.failed", (resp) => {
      onError?.(resp?.error?.description || "Payment failed");
    });

    rzp.open();
  } catch (err) {
    onError?.(err.message || "Something went wrong");
  }
}
