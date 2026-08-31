import { WA, slugify } from "../lib/catalog.js";
import { BRAND } from "./theme.js";
import ImageCarousel from "./ImageCarousel.jsx";

// Pricing/cart wiring lives on the catalog item (basePrice, unit, step, min)
// even though this card doesn't show a price or an Add-to-Cart control right
// now — that's a deliberate, easily-reversible choice: gift boxes are
// enquiry-only for the moment, routed entirely through WhatsApp.
export default function GiftBoxCard({ item }) {
  const message = `Hi! I'd like to know more about the "${item.name}" gift box.`;
  const href = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
  const productHref = `#/product/${slugify(item.name)}`;

  return (
    <div style={{
      background: "#fff", borderRadius: 18, overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 10px 30px rgba(0,0,0,0.06)",
      width: "100%", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column",
    }}>
      <a href={productHref} style={{ display: "block", color: "inherit", textDecoration: "none" }}>
        <ImageCarousel images={item.images} color={item.color} badge={item.badge || "Gift Box"} aspectRatio="1/1" />
      </a>

      {/* Boxes have wildly different amounts of copy (2-item vs 10-item
          contents lists), so equal card height can't rely on grid row
          stretching alone — that only matches cards within the same row,
          not across rows. The tagline/contents paragraphs below are
          line-clamped to a fixed line count so every card's text block is
          the same height regardless of row position; flex:1 + marginTop:auto
          on the CTA then pins it to the bottom for any remaining slack.
          Line-clamps and padding are kept tight so the photo (now a taller
          1:1 crop above) reads as the dominant part of the card. */}
      <div style={{ padding: "14px 18px 16px", display: "flex", flexDirection: "column", flex: "1 1 auto" }}>
        <a href={productHref} style={{ display: "block", color: "inherit", textDecoration: "none" }}>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: BRAND.text, margin: "0 0 5px", fontFamily: "'DM Serif Display', serif" }}>
            {item.name}
          </h3>
        </a>
        <p style={{
          fontSize: 13, color: BRAND.muted, margin: "0 0 7px", lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {item.tagline}
        </p>
        {item.contents && (
          <p style={{
            fontSize: 12, color: BRAND.muted, margin: "0 0 12px", lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            <strong style={{ color: BRAND.text }}>Contains:</strong> {item.contents}
          </p>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { if (typeof window.gtag === "function") window.gtag("event", "whatsapp_click", { cta_label: "giftbox_card_enquire", item_name: item.name }); }}
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
