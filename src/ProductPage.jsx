import { useState } from "react";
import {
  WA,
  findItemBySlug,
  isGiftBox,
  getPricePerUnit,
  formatQty,
  formatPrice,
  formatRate,
} from "../lib/catalog.js";
import { BRAND } from "./theme.js";
import { navigate, addToCart } from "./router.js";
import ImageCarousel from "./ImageCarousel.jsx";

export default function ProductPage({ slug }) {
  const item = findItemBySlug(slug);
  const [qty, setQty] = useState(item?.min || 1);
  const [added, setAdded] = useState(false);

  const wrap = {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: BRAND.warm, color: BRAND.text, minHeight: "100vh",
    padding: "24px 0 60px",
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

  if (!item) {
    return (
      <div style={wrap}><div className="container" style={{ maxWidth: 480 }}>
        {backLink}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "22px 20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
        }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: BRAND.green, margin: "0 0 8px" }}>
            Product not found
          </h2>
          <p style={{ color: BRAND.muted, fontSize: 14 }}>This link doesn't match anything in our menu right now.</p>
        </div>
      </div></div>
    );
  }

  const giftBox = isGiftBox(item);
  const rate = getPricePerUnit(item, qty);
  const total = Math.round(rate * qty);

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

  function handleAdd() {
    addToCart(item, qty);
    setAdded(true);
  }

  const enquireHref = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'd like to know more about the "${item.name}" gift box.`)}`;

  return (
    <div style={wrap}>
      <div className="container" style={{ maxWidth: 480 }}>
        {backLink}

        <div style={{
          background: "#fff", borderRadius: 16, overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
        }}>
          <ImageCarousel images={item.images} color={item.color} badge={item.badge} />

          <div style={{ padding: "20px 22px 24px" }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400,
              color: BRAND.text, margin: "0 0 8px",
            }}>{item.name}</h1>
            <p style={{ fontSize: 14.5, color: BRAND.muted, margin: "0 0 16px", lineHeight: 1.55 }}>
              {item.tagline}
            </p>

            <div style={{ marginBottom: 18, fontSize: 15 }}>
              {giftBox ? (
                item.basePrice == null ? (
                  <span style={{ color: BRAND.muted }}>Price shared on enquiry</span>
                ) : (
                  <span style={{ color: BRAND.muted }}>
                    from <span style={{ color: BRAND.green, fontWeight: 700 }}>{formatRate(item.basePrice)}</span> / {item.unit}
                  </span>
                )
              ) : (
                <span style={{ color: BRAND.green, fontWeight: 600 }}>
                  {formatRate(rate)} / {item.unit}
                </span>
              )}
            </div>

            {giftBox ? (
              <a
                href={enquireHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (typeof window.gtag === "function") window.gtag("event", "whatsapp_click", { cta_label: "product_page_enquire", item_name: item.name });
                  if (typeof window.fbq === "function") window.fbq("track", "Contact");
                }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: "13px", background: BRAND.green, color: "#fff",
                  border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600,
                  textDecoration: "none", boxSizing: "border-box",
                }}
              >Enquire on WhatsApp →</a>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  {stepperBtn("−", () => setQty(q => Math.max(item.min, Math.round((q - item.step) * 10) / 10)), true)}
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.text, lineHeight: 1.2 }}>
                      {formatQty(qty, item.unit)}
                    </div>
                    <div style={{ fontSize: 14, color: BRAND.green, fontWeight: 600, marginTop: 2 }}>
                      {formatPrice(total)}
                    </div>
                  </div>
                  {stepperBtn("+", () => setQty(q => Math.round((q + item.step) * 10) / 10), false)}
                </div>

                <button
                  onClick={handleAdd}
                  style={{
                    width: "100%", padding: "13px", background: BRAND.green, color: "#fff",
                    border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer",
                  }}
                >{added ? "Added ✓" : "Add to Cart"}</button>

                {added && (
                  <button
                    onClick={() => navigate("#/")}
                    style={{
                      width: "100%", marginTop: 10, padding: "13px", background: "none",
                      border: `2px solid ${BRAND.green}`, color: BRAND.green,
                      borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer",
                    }}
                  >View Cart →</button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
