import { useState, useEffect, Fragment } from "react";
import {
  FRUITS,
  GIFT_BOXES,
  WA,
  findItem,
  getPricePerUnit,
  getNextNudge,
  formatQty,
  formatPrice,
  formatRate,
  computeOrder,
} from "../lib/catalog.js";
import OrderPage from "./OrderPage.jsx";
import OrdersPage from "./OrdersPage.jsx";
import AdminPage from "./AdminPage.jsx";
import FeedbackPage from "./FeedbackPage.jsx";
import { BRAND } from "./theme.js";
import { useHashRoute, navigate, saveOrder } from "./router.js";
import { payWithRazorpay } from "./payment.js";
import ImageCarousel from "./ImageCarousel.jsx";
import GiftBoxCard from "./GiftBoxCard.jsx";


function buildWhatsAppMessage(cart, details) {
  const lines = cart.map(({ itemName, qty }) => {
    const item = findItem(itemName);
    if (!item) return null;
    const ppu = getPricePerUnit(item, qty);
    const total = Math.round(ppu * qty);
    return `• ${itemName} – ${formatQty(qty, item.unit)} @ ${formatRate(ppu)}/${item.unit} = ₹${total.toLocaleString("en-IN")}`;
  }).filter(Boolean);

  const grandTotal = cart.reduce((sum, { itemName, qty }) => {
    const item = findItem(itemName);
    return item ? sum + getPricePerUnit(item, qty) * qty : sum;
  }, 0);

  return [
    "Hi! I'd like to place an order 🛒",
    "",
    ...lines,
    "",
    `Order Total: ₹${Math.round(grandTotal).toLocaleString("en-IN")}`,
    "",
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Address: ${details.address}`,
    `Payment: ${details.payment === "COD" ? "Cash on Delivery" : "UPI"}`,
  ].join("\n");
}

const WA_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.609l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.191 0-4.215-.7-5.874-1.885l-.343-.254-3.544 1.189 1.189-3.544-.254-.343A9.958 9.958 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
  </svg>
);

function FruitCard({ item, qty, onQtyChange }) {
  const displayRate = qty > 0 ? getPricePerUnit(item, qty) : item.basePrice;
  const total = Math.round(displayRate * qty);
  const nudge = qty > 0 ? getNextNudge(item, qty) : null;

  const stepperBtn = (label, onClick, outline) => (
    <button
      onClick={onClick}
      style={{
        width: 46, height: 46, borderRadius: 10, flexShrink: 0,
        border: outline ? `2px solid ${BRAND.green}` : "none",
        background: outline ? "#fff" : BRAND.green,
        color: outline ? BRAND.green : "#fff",
        fontSize: 26, fontWeight: 400, lineHeight: 1,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >{label}</button>
  );

  return (
    <div style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
      width: "100%",
    }}>
      <ImageCarousel images={item.images} color={item.color} badge={item.badge} />

      <div style={{ padding: "18px 20px 20px" }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.text, margin: "0 0 6px", fontFamily: "'DM Serif Display', serif" }}>{item.name}</h3>
        <p style={{ fontSize: 13.5, color: BRAND.muted, margin: "0 0 14px", lineHeight: 1.5 }}>{item.tagline}</p>

        <div style={{ marginBottom: 14, fontSize: 14 }}>
          {qty > 0 ? (
            <span style={{ color: BRAND.green, fontWeight: 600 }}>
              {formatRate(displayRate)} / {item.unit}
            </span>
          ) : (
            <span style={{ color: BRAND.muted }}>
              from <span style={{ color: BRAND.green, fontWeight: 700 }}>{formatRate(item.basePrice)}</span> / {item.unit}
              {item.tiers.length > 0 && <span style={{ color: BRAND.muted }}> · bulk rates available</span>}
            </span>
          )}
        </div>

        {qty === 0 ? (
          <button
            onClick={() => onQtyChange(item.min)}
            style={{
              width: "100%", padding: "12px", background: BRAND.green, color: "#fff",
              border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}
          >+ Add</button>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {stepperBtn("−", () => onQtyChange(Math.max(0, Math.round((qty - item.step) * 10) / 10)), true)}
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.text, lineHeight: 1.2 }}>
                  {formatQty(qty, item.unit)}
                </div>
                <div style={{ fontSize: 14, color: BRAND.green, fontWeight: 600, marginTop: 2 }}>
                  {formatPrice(total)}
                </div>
              </div>
              {stepperBtn("+", () => onQtyChange(Math.round((qty + item.step) * 10) / 10), false)}
            </div>
            {nudge && (
              <div style={{
                marginTop: 10, padding: "7px 12px", borderRadius: 8,
                background: BRAND.warm, fontSize: 12, color: BRAND.muted, textAlign: "center",
              }}>
                Add {formatQty(nudge.needed, item.unit)} more →{" "}
                <strong style={{ color: BRAND.green }}>{formatRate(nudge.rate)}/{item.unit}</strong>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CartBar({ cart, total, onOpen }) {
  if (cart.length === 0) return null;
  const count = cart.length;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99,
      padding: "12px 20px 16px",
      background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
      borderTop: `1px solid ${BRAND.green}15`,
    }}>
      <button
        onClick={onOpen}
        style={{
          width: "100%", maxWidth: 440, margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          background: BRAND.green, color: "#fff", border: "none",
          padding: "13px 16px", borderRadius: 12, cursor: "pointer",
          boxShadow: `0 4px 16px ${BRAND.green}55`,
        }}
      >
        <span style={{
          background: "rgba(255,255,255,0.2)", borderRadius: 8,
          padding: "3px 10px", fontSize: 13, fontWeight: 700,
        }}>
          {count} item{count !== 1 ? "s" : ""}
        </span>
        <span style={{ fontSize: 15, fontWeight: 600 }}>View Cart</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>{formatPrice(total)} →</span>
      </button>
    </div>
  );
}

function BottomSheet({ open, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, backdropFilter: "blur(2px)" }}
      />
      <div className="sheet-panel" style={{
        zIndex: 201, background: "#fff", overflowY: "auto",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        WebkitOverflowScrolling: "touch",
      }}>
        <div className="sheet-handle">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#ddd" }} />
        </div>
        {children}
      </div>
    </>
  );
}

function CartSheet({ open, onClose, cart, onQtyChange, onCheckout }) {
  const total = cart.reduce((sum, { itemName, qty }) => {
    const item = findItem(itemName);
    return item ? sum + getPricePerUnit(item, qty) * qty : sum;
  }, 0);

  const miniBtn = (label, onClick, outline) => (
    <button
      onClick={onClick}
      style={{
        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
        border: outline ? `1.5px solid ${BRAND.green}` : "none",
        background: outline ? "#fff" : BRAND.green,
        color: outline ? BRAND.green : "#fff",
        fontSize: 20, fontWeight: 400, lineHeight: 1,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >{label}</button>
  );

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div style={{ padding: "12px 20px 40px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: BRAND.green, margin: "0 0 20px" }}>
          Your Cart
        </h2>

        {cart.length === 0 ? (
          <p style={{ color: BRAND.muted, textAlign: "center", padding: "32px 0", fontSize: 15 }}>Your cart is empty</p>
        ) : (
          <>
            {cart.map(({ itemName, qty }) => {
              const item = findItem(itemName);
              if (!item) return null;
              const ppu = getPricePerUnit(item, qty);
              const lineTotal = Math.round(ppu * qty);

              return (
                <div key={itemName} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  paddingBottom: 16, marginBottom: 16,
                  borderBottom: `1px solid ${BRAND.green}12`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: BRAND.text, marginBottom: 2, lineHeight: 1.3 }}>
                      {itemName}
                    </div>
                    <div style={{ fontSize: 12, color: BRAND.muted }}>
                      {formatRate(ppu)}/{item.unit}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {miniBtn("−", () => onQtyChange(item, Math.max(0, Math.round((qty - item.step) * 10) / 10)), true)}
                    <span style={{ minWidth: 54, textAlign: "center", fontSize: 13, fontWeight: 600, color: BRAND.text }}>
                      {formatQty(qty, item.unit)}
                    </span>
                    {miniBtn("+", () => onQtyChange(item, Math.round((qty + item.step) * 10) / 10), false)}
                  </div>
                  <div style={{ minWidth: 52, textAlign: "right", fontWeight: 700, color: BRAND.green, fontSize: 14, flexShrink: 0 }}>
                    {formatPrice(lineTotal)}
                  </div>
                </div>
              );
            })}

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: 4, marginBottom: 20,
              paddingTop: 12, borderTop: `2px solid ${BRAND.green}15`,
            }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: BRAND.text }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: BRAND.green }}>{formatPrice(total)}</span>
            </div>

            <button
              onClick={onCheckout}
              style={{
                width: "100%", padding: "14px", background: BRAND.green, color: "#fff",
                border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer",
              }}
            >
              Proceed to Checkout →
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
}

function CheckoutForm({ open, onClose, cart, onOrderPlaced }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "", payment: "ONLINE" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const cartTotal = computeOrder(cart).total;

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number";
    if (!form.address.trim()) e.address = "Address is required";
    return e;
  }

  function openWhatsApp(order) {
    const base = buildWhatsAppMessage(cart, form);
    const extra = order
      ? `\n\nOrder No: ${order.orderNo}\nTrack: ${window.location.origin}/#/order/${order.token}`
      : "";
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(base + extra)}`, "_blank");
  }

  async function handlePlaceOrder() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (submitting) return;
    setSubmitting(true);

    let order = null;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, ...form }),
      });
      if (res.ok) order = await res.json();
    } catch {
      // Network/server failure — fall through to the WhatsApp-only fallback so
      // ordering never breaks even if the backend is down.
    }

    if (!order) {
      // Couldn't record the order; keep the legacy WhatsApp-only flow.
      setSubmitting(false);
      openWhatsApp(null);
      onOrderPlaced();
      return;
    }

    saveOrder({ token: order.token, orderNo: order.orderNo, total: order.total });

    if (form.payment === "ONLINE") {
      // Open Razorpay. The order is already saved, so regardless of the payment
      // outcome we clear the cart and send the customer to their tracking page
      // (where an unpaid online order can be retried).
      const finish = () => { onOrderPlaced(); navigate(`#/order/${order.token}`); };
      payWithRazorpay(order.token, { onSuccess: finish, onDismiss: finish, onError: finish });
      setSubmitting(false);
    } else {
      // Cash on Delivery — keep the WhatsApp handoff, then go to tracking.
      setSubmitting(false);
      openWhatsApp(order);
      onOrderPlaced();
      navigate(`#/order/${order.token}`);
    }
  }

  const fieldStyle = (key) => ({
    width: "100%", padding: "11px 12px", borderRadius: 10, fontSize: 14,
    fontFamily: "inherit", boxSizing: "border-box", outline: "none",
    border: `1.5px solid ${errors[key] ? "#DC2626" : "#e5e5e5"}`,
  });

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div style={{ padding: "12px 20px 48px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: BRAND.green, margin: "0 0 20px" }}>
          Your Details
        </h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.text, marginBottom: 6 }}>Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            style={fieldStyle("name")}
          />
          {errors.name && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.text, marginBottom: 6 }}>Phone</label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={e => set("phone", e.target.value.replace(/\D/g, ""))}
            style={fieldStyle("phone")}
          />
          {errors.phone && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.phone}</div>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.text, marginBottom: 6 }}>Delivery Address</label>
          <textarea
            placeholder="House no., street, area, Gurgaon"
            value={form.address}
            onChange={e => set("address", e.target.value)}
            rows={2}
            style={{ ...fieldStyle("address"), resize: "none" }}
          />
          {errors.address && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.address}</div>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.text, marginBottom: 6 }}>
            Email <span style={{ fontWeight: 400, color: BRAND.muted }}>(optional — for order confirmation)</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            style={fieldStyle("email")}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.text, marginBottom: 8 }}>Payment Mode</label>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ id: "ONLINE", label: "💳 Pay Online" }, { id: "COD", label: "💵 Cash on Delivery" }].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => set("payment", id)}
                style={{
                  flex: 1, padding: "11px 8px", borderRadius: 10, fontSize: 13.5, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s",
                  border: `2px solid ${form.payment === id ? BRAND.green : "#e5e5e5"}`,
                  background: form.payment === id ? `${BRAND.green}10` : "#fff",
                  color: form.payment === id ? BRAND.green : BRAND.muted,
                }}
              >{label}</button>
            ))}
          </div>
          {form.payment === "ONLINE" && (
            <p style={{ fontSize: 12, color: BRAND.muted, margin: "8px 2px 0" }}>
              Secure UPI, cards & netbanking via Razorpay.
            </p>
          )}
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          style={{
            width: "100%", padding: "14px", background: BRAND.green, color: "#fff",
            border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600,
            cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: `0 4px 16px ${BRAND.green}44`,
          }}
        >
          {form.payment === "COD" && WA_SVG}
          {submitting
            ? "Placing order…"
            : form.payment === "ONLINE"
              ? `Pay ${formatPrice(cartTotal)} securely`
              : "Place Order on WhatsApp"}
        </button>
      </div>
    </BottomSheet>
  );
}

function Storefront() {
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gfc-cart") || "[]"); }
    catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    localStorage.setItem("gfc-cart", JSON.stringify(cart));
  }, [cart]);

  function getQty(itemName) {
    return cart.find(c => c.itemName === itemName)?.qty || 0;
  }

  function setQty(item, qty) {
    let q = Math.round(qty * 10) / 10;
    // A decrement step doesn't always land exactly on the item's minimum
    // (e.g. min 2pc stepping by 1, or min 1kg stepping by 0.5kg) — treat
    // anything that would dip below the minimum as "remove", not as a
    // below-minimum quantity in the cart.
    if (q > 0 && q < item.min) q = 0;
    setCart(prev => {
      if (q <= 0) return prev.filter(c => c.itemName !== item.name);
      const exists = prev.find(c => c.itemName === item.name);
      if (exists) return prev.map(c => c.itemName === item.name ? { ...c, qty: q } : c);
      return [...prev, { itemName: item.name, qty: q }];
    });
  }

  const cartTotal = cart.reduce((sum, { itemName, qty }) => {
    const item = findItem(itemName);
    return item ? sum + getPricePerUnit(item, qty) * qty : sum;
  }, 0);

  function handleOrderPlaced() {
    setCart([]);
    setCheckoutOpen(false);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: BRAND.cream, color: BRAND.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, padding: "10px 0",
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${BRAND.green}15` : "none",
        transition: "all 0.3s",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src="/logo.svg" alt="Good Fruit Club" style={{ height: 40, width: "auto" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => navigate("#/orders")}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: BRAND.green, fontSize: 13, fontWeight: 600, textDecoration: "none",
                fontFamily: "inherit",
              }}
            >My Orders</button>
            <button
              onClick={() => navigate("#/feedback")}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: BRAND.green, fontSize: 13, fontWeight: 600, textDecoration: "none",
                fontFamily: "inherit",
              }}
            >Feedback</button>
            {cart.length > 0 && (
              <button
                onClick={() => setCartOpen(true)}
                style={{
                  background: BRAND.green, color: "#fff", padding: "8px 14px",
                  borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                🛒 {cart.length}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="container" style={{ paddingTop: 32, paddingBottom: 40 }}>
        <div className="hero-content">
          <img src="/logo.svg" alt="Good Fruit Club" />
          <div className="hero-text">
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(34px, 9vw, 48px)", fontWeight: 400,
              color: BRAND.green, margin: "0 0 16px", lineHeight: 1.1,
            }}>
              Fresh finds,<br />delivered home
            </h1>
            <p className="hero-blurb" style={{ fontSize: 16, color: BRAND.muted, lineHeight: 1.65 }}>
              Premium fruits, sourced fresh and delivered to your doorstep. Hand-picked with care, packed by our family, brought to yours.
            </p>
            <div className="hero-cta" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="#menu" style={{
                background: BRAND.green, color: "#fff", padding: "13px 28px",
                borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none",
              }}>Today's Menu ↓</a>
              {GIFT_BOXES.length > 0 && (
                <a href="#gift-boxes" style={{
                  background: "transparent", color: BRAND.green, padding: "13px 28px",
                  borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none",
                  border: `2px solid ${BRAND.green}`,
                }}>🎁 Gift Boxes</a>
              )}
              <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! Tell me more about Good Fruit Club")}`} target="_blank" rel="noopener noreferrer" style={{
                background: "transparent", color: BRAND.green, padding: "13px 28px",
                borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none",
                border: `2px solid ${BRAND.green}`,
              }}>WhatsApp Us</a>
            </div>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section className="container" style={{ paddingBottom: 40 }}>
        <div className="how-grid" style={{
          background: BRAND.green, borderRadius: 16, padding: "24px 20px",
          display: "grid", gap: 16,
        }}>
          {[
            { icon: "🛒", text: "Browse & add to cart" },
            { icon: "📝", text: "Checkout with your details" },
            { icon: "🌅", text: "We source fresh next morning" },
            { icon: "🚪", text: "Delivered to your door" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 500, opacity: 0.9, lineHeight: 1.35 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gift Boxes */}
      {GIFT_BOXES.length > 0 && (
        <section id="gift-boxes" style={{ background: BRAND.warm, padding: "36px 0 40px" }}>
          <div className="container">
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: BRAND.green, margin: "0 0 4px" }}>
              🎁 Gift Boxes
            </h2>
            <p style={{ color: BRAND.muted, fontSize: 14, margin: "0 0 20px" }}>
              Thoughtfully curated, hand-packed — perfect for gifting.
            </p>
            <div className="giftbox-grid">
              {GIFT_BOXES.map((box) => (
                <GiftBoxCard key={box.name} item={box} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fruit Menu */}
      <section id="menu" className="container" style={{ paddingBottom: 40 }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: BRAND.green, margin: "0 0 4px" }}>Today's Fruits</h2>
        <p style={{ color: BRAND.muted, fontSize: 14, margin: "0 0 8px" }}>
          Before 10 AM → same day &nbsp;·&nbsp; After 10 AM → tomorrow morning
        </p>

        <div className="fruit-grid">
          {FRUITS.map((cat, ci) => (
            <Fragment key={ci}>
              <h3 className="category-heading">{cat.category}</h3>
              {cat.items.map((item, ii) => (
                <FruitCard
                  key={ii}
                  item={item}
                  qty={getQty(item.name)}
                  onQtyChange={(qty) => setQty(item, qty)}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="container" style={{ paddingBottom: 40 }}>
        <div style={{ background: BRAND.green, borderRadius: 16, padding: "32px 24px", color: "#fff", maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, margin: "0 0 14px", fontWeight: 400 }}>Our Story</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, margin: "0 0 12px", opacity: 0.9 }}>
            For over 30 years, our family has had a knack for finding the best fruits — knowing exactly what to pick, where to look, and what's truly worth bringing home.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, margin: "0 0 12px", opacity: 0.9 }}>
            What started as finding the best for our own kitchen and sharing with friends and family has now become Good Fruit Club — a small, home-grown fruit service right here in Gurgaon.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, margin: 0, opacity: 0.9 }}>
            We source fresh every morning, pack everything by hand with care, and deliver to your doorstep. No warehouse, no middlemen — just a family sharing what we've always known how to find.
          </p>
        </div>
      </section>

      {/* Feedback CTA */}
      <section id="feedback" className="container" style={{ paddingBottom: 40 }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "24px 20px", textAlign: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
          maxWidth: 480, margin: "0 auto",
        }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: BRAND.green, margin: "0 0 8px", fontWeight: 400 }}>
            Share Your Feedback
          </h2>
          <p style={{ color: BRAND.muted, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
            Tell us how your order went — good or bad, we read every word.
          </p>
          <button
            onClick={() => navigate("#/feedback")}
            style={{
              background: BRAND.green, color: "#fff", padding: "12px 28px",
              borderRadius: 10, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
            }}
          >Share Feedback</button>
        </div>
      </section>

      {/* Cart Bar */}
      <CartBar cart={cart} total={cartTotal} onOpen={() => setCartOpen(true)} />

      {/* Cart Sheet */}
      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onQtyChange={(item, qty) => setQty(item, qty)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />

      {/* Checkout */}
      <CheckoutForm
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Footer */}
      <footer style={{
        background: BRAND.greenDark,
        padding: `36px 20px ${cart.length > 0 ? "110px" : "60px"}`,
        textAlign: "center",
      }}>
        <img src="/logo-white.svg" alt="Good Fruit Club" style={{ height: 140, width: "auto", marginBottom: 10 }} />
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "0 0 16px" }}>
          Fresh finds, delivered home · Gurgaon
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "0 0 6px" }}>
          WhatsApp: 9911777333
        </p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 20 }}>
          © 2026 Good Fruit Club · goodfruit.club
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const hash = useHashRoute();
  const route = hash.replace(/^#/, "");

  const orderMatch = route.match(/^\/order\/(.+)$/);
  if (orderMatch) return <OrderPage token={decodeURIComponent(orderMatch[1])} />;
  if (route === "/orders") return <OrdersPage />;
  if (route === "/feedback") return <FeedbackPage />;
  if (route === "/admin") return <AdminPage />;
  return <Storefront />;
}
