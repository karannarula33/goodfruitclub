import { WA } from "../lib/catalog.js";
import { BRAND } from "./theme.js";
import ImageCarousel from "./ImageCarousel.jsx";

// Pricing/cart wiring lives on the catalog item (basePrice, unit, step, min)
// even though this card doesn't show a price or an Add-to-Cart control right
// now — that's a deliberate, easily-reversible choice: gift boxes are
// enquiry-only for the moment, routed entirely through WhatsApp.
export default function GiftBoxCard({ item }) {
  const message = `Hi! I'd like to know more about the "${item.name}" gift box.`;
  const href = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;

  return (
    <div style={{
      background: "#fff", borderRadius: 18, overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 10px 30px rgba(0,0,0,0.06)",
      width: "100%", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column",
    }}>
      <ImageCarousel images={item.images} color={item.color} badge={item.badge || "Gift Box"} />

      {/* flex:1 so this fills any leftover height once the grid row stretches
          the card to match its tallest sibling; marginTop:"auto" on the CTA
          below then pins it to the bottom regardless of text length. */}
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: "1 1 auto" }}>
        <h3 style={{ fontSize: 21, fontWeight: 700, color: BRAND.text, margin: "0 0 8px", fontFamily: "'DM Serif Display', serif" }}>
          {item.name}
        </h3>
        <p style={{ fontSize: 13.5, color: BRAND.muted, margin: "0 0 10px", lineHeight: 1.55 }}>
          {item.tagline}
        </p>
        {item.contents && (
          <p style={{ fontSize: 12.5, color: BRAND.muted, margin: "0 0 18px", lineHeight: 1.55 }}>
            <strong style={{ color: BRAND.text }}>Contains:</strong> {item.contents}
          </p>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "13px", background: BRAND.green, color: "#fff",
            border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600,
            textDecoration: "none", boxSizing: "border-box", marginTop: "auto",
          }}
        >
          Enquire on WhatsApp →
        </a>
      </div>
    </div>
  );
}
