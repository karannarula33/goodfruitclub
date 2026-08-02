import { useState, useEffect } from "react";
import { formatPrice, formatQty } from "../lib/catalog.js";
import { BRAND, FULFILMENT_STEPS, STATUS_LABEL } from "./theme.js";
import { navigate } from "./router.js";

function StatusTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div style={{
        padding: "14px 16px", borderRadius: 12, background: "#FEF2F2",
        color: "#B91C1C", fontSize: 14, fontWeight: 600, textAlign: "center",
      }}>
        This order was cancelled. Please reach us on WhatsApp if this looks wrong.
      </div>
    );
  }

  const currentIndex = FULFILMENT_STEPS.findIndex((s) => s.id === status);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {FULFILMENT_STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step.id} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
                background: done ? BRAND.green : "#EDEDE6",
                color: done ? "#fff" : BRAND.muted,
                boxShadow: isCurrent ? `0 0 0 4px ${BRAND.green}22` : "none",
                transition: "all 0.2s",
              }}>
                {done ? step.icon : "•"}
              </div>
              {i < FULFILMENT_STEPS.length - 1 && (
                <div style={{
                  width: 2, height: 26,
                  background: i < currentIndex ? BRAND.green : "#EDEDE6",
                }} />
              )}
            </div>
            <div style={{ paddingTop: 6, paddingBottom: 14 }}>
              <div style={{
                fontSize: 14.5, fontWeight: isCurrent ? 700 : 600,
                color: done ? BRAND.text : BRAND.muted,
              }}>
                {step.label}
              </div>
              {isCurrent && (
                <div style={{ fontSize: 12.5, color: BRAND.green, fontWeight: 600, marginTop: 2 }}>
                  In progress
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderPage({ token }) {
  const [state, setState] = useState({ status: "loading", order: null, error: "" });

  useEffect(() => {
    let alive = true;
    setState({ status: "loading", order: null, error: "" });
    fetch(`/api/order?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!alive) return;
        if (res.status === 404) {
          setState({ status: "notfound", order: null, error: "" });
          return;
        }
        if (!res.ok) throw new Error("Failed");
        const order = await res.json();
        if (alive) setState({ status: "ok", order, error: "" });
      })
      .catch(() => {
        if (alive) setState({ status: "error", order: null, error: "Could not load this order." });
      });
    return () => { alive = false; };
  }, [token]);

  const wrap = {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: BRAND.warm, color: BRAND.text, minHeight: "100vh",
    padding: "24px 0 60px",
  };

  const card = {
    background: "#fff", borderRadius: 16, padding: "22px 20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
    marginBottom: 16,
  };

  const backLink = (
    <button
      onClick={() => navigate("#/")}
      style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        color: BRAND.green, fontSize: 14, fontWeight: 600, fontFamily: "inherit",
        marginBottom: 18,
      }}
    >← Back to shop</button>
  );

  if (state.status === "loading") {
    return <div style={wrap}><div className="container">{backLink}<p style={{ color: BRAND.muted }}>Loading your order…</p></div></div>;
  }

  if (state.status === "notfound") {
    return (
      <div style={wrap}><div className="container">
        {backLink}
        <div style={card}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: BRAND.green, margin: "0 0 8px" }}>Order not found</h2>
          <p style={{ color: BRAND.muted, fontSize: 14 }}>This tracking link doesn't match any order. Double-check the link or reach us on WhatsApp.</p>
        </div>
      </div></div>
    );
  }

  if (state.status === "error") {
    return (
      <div style={wrap}><div className="container">
        {backLink}
        <div style={card}><p style={{ color: "#B91C1C", fontSize: 14 }}>{state.error}</p></div>
      </div></div>
    );
  }

  const o = state.order;

  return (
    <div style={wrap}>
      <div className="container" style={{ maxWidth: 520 }}>
        {backLink}

        <div style={card}>
          <div style={{ fontSize: 13, color: BRAND.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Order {o.orderNo}
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: BRAND.green, margin: "6px 0 4px", fontWeight: 400 }}>
            {o.fulfilmentStatus === "delivered" ? "Delivered 🎉" : "Thanks — we've got your order!"}
          </h1>
          <p style={{ color: BRAND.muted, fontSize: 14, margin: 0 }}>
            Current status: <strong style={{ color: BRAND.green }}>{STATUS_LABEL[o.fulfilmentStatus] || o.fulfilmentStatus}</strong>
          </p>
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: BRAND.text, margin: "0 0 16px" }}>Progress</h3>
          <StatusTimeline status={o.fulfilmentStatus} />
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: BRAND.text, margin: "0 0 14px" }}>Items</h3>
          {o.items.map((l, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              paddingBottom: 10, marginBottom: 10,
              borderBottom: i < o.items.length - 1 ? `1px solid ${BRAND.green}12` : "none",
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{l.itemName}</div>
                <div style={{ fontSize: 12, color: BRAND.muted }}>{formatQty(l.qty, l.unit)}</div>
              </div>
              <div style={{ fontWeight: 700, color: BRAND.green, fontSize: 14 }}>{formatPrice(l.lineTotal)}</div>
            </div>
          ))}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 6, paddingTop: 12, borderTop: `2px solid ${BRAND.green}15`,
          }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: BRAND.green }}>{formatPrice(o.total)}</span>
          </div>
          <div style={{ fontSize: 12.5, color: BRAND.muted, marginTop: 8 }}>
            Payment: {o.paymentMode === "COD" ? "Cash on Delivery" : "UPI"}
            {o.paymentStatus === "paid" ? " · Paid" : ""}
          </div>
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: BRAND.text, margin: "0 0 10px" }}>Delivery to</h3>
          <p style={{ fontSize: 14, color: BRAND.text, margin: "0 0 2px", fontWeight: 600 }}>{o.name}</p>
          <p style={{ fontSize: 13.5, color: BRAND.muted, margin: "0 0 2px" }}>{o.phone}</p>
          <p style={{ fontSize: 13.5, color: BRAND.muted, margin: 0 }}>{o.address}</p>
        </div>

        <p style={{ textAlign: "center", fontSize: 12.5, color: BRAND.muted, marginTop: 20 }}>
          Bookmark this page to check your order status anytime.
        </p>
      </div>
    </div>
  );
}
