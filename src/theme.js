export const BRAND = {
  green: "#1B4332",
  greenLight: "#2D6A4F",
  greenDark: "#0F2A1D",
  cream: "#FFFFFF",
  warm: "#F5F0E6",
  text: "#1a1a1a",
  muted: "#6b6b5e",
};

// Ordered fulfilment steps shown on the tracking timeline. "cancelled" is a
// terminal off-track state handled separately.
export const FULFILMENT_STEPS = [
  { id: "received", label: "Order received", icon: "📝" },
  { id: "sourcing", label: "Sourcing fresh", icon: "🌅" },
  { id: "out_for_delivery", label: "Out for delivery", icon: "🚚" },
  { id: "delivered", label: "Delivered", icon: "🚪" },
];

export const PAYMENT_LABEL = {
  COD: "Cash on Delivery",
  ONLINE: "Online (Razorpay)",
  UPI: "UPI",
};

export const STATUS_LABEL = {
  received: "Order received",
  sourcing: "Sourcing fresh",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
