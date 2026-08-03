import { WA, formatPrice, formatQty } from "../lib/catalog.js";
import { BRAND } from "./theme.js";
import ImageCarousel from "./ImageCarousel.jsx";

export default function GiftBoxCard({ item, qty, onQtyChange }) {
  const total = Math.round(item.basePrice * qty);
  const bulkMessage = `Hi! I'd like to ask about bulk pricing for the "${item.name}" gift box.`;
  const bulkHref = `https://wa.me/${WA}?text=${encodeURIComponent(bulkMessage)}`;

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
      background: "#fff", borderRadius: 18, overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 10px 30px rgba(0,0,0,0.06)",
      marginBottom: 24, width: "100%",
    }}>
      <ImageCarousel images={item.images} color={item.color} badge={item.badge || "Gift Box"} />

      <div style={{ padding: "20px 22px 22px" }}>
        <h3 style={{ fontSize: 21, fontWeight: 700, color: BRAND.text, margin: "0 0 8px", fontFamily: "'DM Serif Display', serif" }}>
          {item.name}
        </h3>
        <p style={{ fontSize: 13.5, color: BRAND.muted, margin: "0 0 14px", lineHeight: 1.55 }}>
          <strong style={{ color: BRAND.text }}>Contains:</strong> {item.tagline}
        </p>

        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: BRAND.green }}>{formatPrice(item.basePrice)}</span>
          <span style={{ fontSize: 13, color: BRAND.muted }}> / box</span>
        </div>

        {qty === 0 ? (
          <button
            onClick={() => onQtyChange(item.min)}
            style={{
              width: "100%", padding: "13px", background: BRAND.green, color: "#fff",
              border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}
          >+ Add to Cart</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            {stepperBtn("−", () => onQtyChange(Math.max(0, qty - item.step)), true)}
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.text, lineHeight: 1.2 }}>
                {formatQty(qty, item.unit)}
              </div>
              <div style={{ fontSize: 14, color: BRAND.green, fontWeight: 600, marginTop: 2 }}>
                {formatPrice(total)}
              </div>
            </div>
            {stepperBtn("+", () => onQtyChange(qty + item.step), false)}
          </div>
        )}

        <a
          href={bulkHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block", textAlign: "center", marginTop: 12,
            padding: "11px", borderRadius: 10, fontSize: 13.5, fontWeight: 600,
            border: `2px solid ${BRAND.green}`, color: BRAND.green, textDecoration: "none",
          }}
        >
          Bulk orders? WhatsApp us →
        </a>
      </div>
    </div>
  );
}
