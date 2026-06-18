import { useState, useEffect } from "react";

/*
  GOOD FRUIT CLUB — goodfruit.club
  
  TO USE YOUR OWN PHOTOS:
  1. Put photos in public/fruits/ (e.g. public/fruits/kesar.jpg)
  2. Reference as: img: "/fruits/kesar.jpg"
  
  Check exact filenames: open terminal → ls public/fruits/
  Filenames are CASE SENSITIVE: "Kesar.JPG" ≠ "kesar.jpg"
*/

const BRAND = {
  green: "#1B4332",
  greenLight: "#2D6A4F",
  greenDark: "#0F2A1D",
  cream: "#FFFFFF",
  warm: "#F5F0E6",
  text: "#1a1a1a",
  muted: "#6b6b5e",
};

const FRUITS = [
  { category: "Mangoes", items: [
    { name: "Malihabadi Dasheri Mango", tagline: "Malihabadi Dasheri at peak ripeness — sun-kissed golden, buttery soft, unmistakable sweet nectar.", prices: { "1 kg": 280, "5 kg": 1350, "Peti (10kg)": 2650 }, badge: "Best Seller", img: "/fruits/dasheri.jpg", color: "#F59E0B" },
    { name: "Safeda Mango", tagline: "Light, refreshing, with just the right tang. Great on its own or for aamras", prices: { "1 kg": 160, "2.5 kg": 310, "5 kg": 670 }, img: "/fruits/safeda.jpg", color: "#EAB308" },
  ]},
  { category: "Citrus", items: [
    { name: "Malta Orange", tagline: "Juice-heavy, fragrant, and full — not the dry kind you get at stores", prices: { "1 kg": 270, "2.5 kg": 600, "5 kg": 1155 }, img: "/fruits/malta.jpg", color: "#F97316" },
    { name: "Mandarin Orange", tagline: "Easy to peel, naturally sweet, almost zero acidity", prices: { "1 kg": 300, "2.5 kg": 700, "5 kg": 1300 }, img: "/fruits/mandarin.jpg", color: "#EA580C" },
  ]},
  { category: "Apples & Pears", items: [
    { name: "New Zealand Apple", tagline: "Imported, firm, and genuinely sweet — the kind that actually crunches", prices: { "1 kg": 440, "2.5 kg": 1025, "5 kg": 2000 }, badge: "Premium", img: "/fruits/apple.jpg", color: "#DC2626" },
    { name: "Pear", tagline: "Smooth, grain-free white flesh — perfectly ripe, not rock-hard", prices: { "1 kg": 340, "2.5 kg": 795, "5 kg": 1490 }, img: "/fruits/pear.jpg", color: "#84CC16" },
  ]},
  { category: "Seasonal Favourites", items: [
    { name: "Premium Lychee", tagline: "Fat, juicy, rose-scented — the kind that reminds you of summers at nani's house", prices: { "1 kg": 380}, badge: "Limited Season", img: "/fruits/litchi.jpg", color: "#E11D48" },
    { name: "Shimla Cherry", tagline: "Hand-picked Himalayan cherries — juicy, firm, deeply sweet", prices: { "1 box (700-750gm)": 850, "2 boxes (1400-1500gm)": 1600 }, badge: "New", img: "/fruits/cherry.jpg", color: "#BE123C" },
    { name: "Jamun", tagline: "Sweet-tart bite that just means summer. Plump, deep purple (400gm box)", prices: { "1 box": 350, "3 boxes": 990}, img: "/fruits/jamun.jpg", color: "#7C3AED" },
    { name: "Indian Plum", tagline: "Tart, crunchy, and deeply refreshing", prices: { "1 kg": 535}, img: "/fruits/plum.jpg", color: "#9333EA" },
  ]},
  { category: "Exotics & Everyday", items: [
    { name: "Hass Avocado", tagline: "Creamy, ripe, ready to eat — for toast, salads, or just with salt and lime", prices: { "1 pc": 160, "2 pc": 300, "4 pc": 590 }, img: "/fruits/avocado.jpg", color: "#166534" },
    { name: "Dragon Fruit", tagline: "Mild, refreshing, with a subtle kiwi-like sweetness", prices: { "1 pc": 85, "2 pc": 165, "4 pc": 320 }, img: "/fruits/dragonfruit.jpg", color: "#DB2777" },
    { name: "Golden Kiwi", tagline: "Sweet, tropical, and smooth — golden flesh with a hint of mango", prices: { "1 Box (4Pc)": 550 }, img: "/fruits/goldenkiwi.jpg", color: "#EAB308" },
    { name: "Green Kiwi", tagline: "Tangy-sweet and juicy — slice in half and scoop with a spoon", prices: { "1 Box (4Pc)": 500 }, img: "/fruits/greenkiwi.jpg", color: "#65A30D" },
    { name: "Papaya", tagline: "Sweet, soft, custard-like — picked at the right ripeness", prices: { "1 kg": 100, "2.5 kg": 240, "5 kg": 470 }, img: "/fruits/papaya.jpg", color: "#EA580C" },
    { name: "Madhu Kharbuja", tagline: "Sweet, aromatic summer melon — best served chilled", prices: { "1 pc": 130, "2 pc": 250 }, img: "/fruits/kharbuja.jpg", color: "#CA8A04" },
  ]},
];

const COMBOS = [];

const WA = "919911777333";
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

function FruitCard({ item }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
      marginBottom: 20, maxWidth: 420, width: "100%",
    }}>
      <div style={{
        width: "100%", aspectRatio: "4/3", position: "relative",
        background: `linear-gradient(135deg, ${item.color}22, ${item.color}44)`,
        overflow: "hidden",
      }}>
        <img
          src={item.img}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {item.badge && (
          <span style={{
            position: "absolute", top: 14, left: 14,
            background: item.badge === "Best Seller" ? "#F59E0B" : item.badge === "Premium" ? BRAND.green : item.badge === "Limited Season" ? "#DC2626" : "#2563EB",
            color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 12px",
            borderRadius: 20, letterSpacing: 0.4, textTransform: "uppercase",
          }}>{item.badge}</span>
        )}
      </div>
      <div style={{ padding: "18px 20px 20px" }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.text, margin: "0 0 6px", fontFamily: "'DM Serif Display', serif" }}>{item.name}</h3>
        <p style={{ fontSize: 13.5, color: BRAND.muted, margin: "0 0 16px", lineHeight: 1.5 }}>{item.tagline}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {Object.entries(item.prices).map(([size, price]) => (
            <div key={size} style={{
              background: BRAND.warm, borderRadius: 8, padding: "7px 14px", fontSize: 14,
            }}>
              <span style={{ color: BRAND.muted, fontWeight: 400 }}>{size} </span>
              <span style={{ color: BRAND.green, fontWeight: 700 }}>₹{price.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => window.open(wa(`Hi! I'd like to order ${item.name}`), "_blank")}
          style={{
            width: "100%", padding: "12px", background: BRAND.green, color: "#fff",
            border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = BRAND.greenLight}
          onMouseLeave={e => e.currentTarget.style.background = BRAND.green}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.609l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.191 0-4.215-.7-5.874-1.885l-.343-.254-3.544 1.189 1.189-3.544-.254-.343A9.958 9.958 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
          Order on WhatsApp
        </button>
      </div>
    </div>
  );
}

export default function GoodFruitClub() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: BRAND.cream, color: BRAND.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Sticky Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, padding: "10px 0",
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${BRAND.green}15` : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src="/logo.svg" alt="Good Fruit Club" style={{ height: 40, width: "auto" }} />
          <a href={wa("Hi! I'd like to place an order")} target="_blank" rel="noopener noreferrer"
            style={{
              background: BRAND.green, color: "#fff", padding: "8px 16px",
              borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>Order</a>
        </div>
      </nav>

      {/* Hero with large logo */}
      <header style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px 40px", textAlign: "center" }}>
        <img src="/logo.svg" alt="Good Fruit Club" style={{
          height: 250, width: "auto", marginBottom: 24,
        }} />
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(34px, 9vw, 48px)", fontWeight: 400,
          color: BRAND.green, margin: "0 0 16px", lineHeight: 1.1,
        }}>
          Fresh finds,<br />delivered home
        </h1>
        <p style={{
          fontSize: 16, color: BRAND.muted, maxWidth: 360, margin: "0 auto 28px", lineHeight: 1.65,
        }}>
          Premium fruits, sourced fresh and delivered to your doorstep. Hand-picked with care, packed by our family, brought to yours.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#menu" style={{
            background: BRAND.green, color: "#fff", padding: "13px 28px",
            borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none",
          }}>Today's Menu ↓</a>
          <a href={wa("Hi! Tell me more about Good Fruit Club")} target="_blank" rel="noopener noreferrer" style={{
            background: "transparent", color: BRAND.green, padding: "13px 28px",
            borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none",
            border: `2px solid ${BRAND.green}`,
          }}>WhatsApp Us</a>
        </div>
      </header>

      {/* How it works */}
      <section style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{
          background: BRAND.green, borderRadius: 16, padding: "24px 20px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
        }}>
          {[
            { icon: "📋", text: "Pick your fruits" },
            { icon: "💬", text: "Message us on WhatsApp" },
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

      {/* Fruit Menu */}
      <section id="menu" style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: BRAND.green, margin: "0 0 4px" }}>Today's Fruits</h2>
        <p style={{ color: BRAND.muted, fontSize: 14, margin: "0 0 8px" }}>
          Before 10 AM → same day &nbsp;·&nbsp; After 10 AM → tomorrow morning
        </p>

        {FRUITS.map((cat, ci) => (
          <div key={ci} style={{ marginTop: 28 }}>
            <h3 style={{
              fontSize: 15, fontWeight: 700, color: BRAND.green,
              textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 14px",
              paddingBottom: 8, borderBottom: `2px solid ${BRAND.green}18`,
            }}>{cat.category}</h3>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {cat.items.map((item, ii) => <FruitCard key={ii} item={item} />)}
            </div>
          </div>
        ))}
      </section>

      {/* Ready Boxes — hidden for now
      <section style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: BRAND.green, margin: "0 0 4px" }}>Ready Boxes</h2>
        <p style={{ color: BRAND.muted, fontSize: 14, margin: "0 0 16px" }}>Can't decide? Grab a curated box.</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {COMBOS.map((c, i) => (
            <div key={i}
              onClick={() => window.open(wa(`Hi! I'd like the ${c.name} (₹${c.price})`), "_blank")}
              style={{
                width: "100%", maxWidth: 420, borderRadius: 16, overflow: "hidden",
                background: "#fff", cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ width: "100%", height: 180, overflow: "hidden" }}>
                <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" onError={(e) => { e.target.style.display = "none"; }} />
              </div>
              <div style={{ padding: "16px 20px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: BRAND.text, fontFamily: "'DM Serif Display', serif" }}>{c.name}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: BRAND.green }}>₹{c.price}</span>
                </div>
                <p style={{ fontSize: 13, color: BRAND.muted, margin: "0 0 14px", lineHeight: 1.4 }}>{c.items}</p>
                <div style={{
                  width: "100%", padding: "10px", background: BRAND.green, color: "#fff",
                  borderRadius: 10, fontSize: 14, fontWeight: 600, textAlign: "center",
                }}>Order this Box →</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* Our Story */}
      <section style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{
          background: BRAND.green, borderRadius: 16, padding: "32px 24px",
          color: "#fff",
        }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, margin: "0 0 14px", fontWeight: 400 }}>Our Story</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, margin: "0 0 12px", opacity: 0.9 }}>
            For over 20 years, our family has had a knack for finding the best fruits — knowing exactly what to pick, where to look, and what's truly worth bringing home.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, margin: "0 0 12px", opacity: 0.9 }}>
            What started as finding the best for our own kitchen and sharing with friends and family has now become Good Fruit Club — a small, home-grown fruit service right here in Gurgaon.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, margin: 0, opacity: 0.9 }}>
            We source fresh every morning, pack everything by hand with care, and deliver to your doorstep. No warehouse, no middlemen — just a family sharing what we've always known how to find.
          </p>
        </div>
      </section>

      {/* Sticky bottom CTA */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
        borderTop: `1px solid ${BRAND.green}15`, padding: "12px 20px",
        display: "flex", justifyContent: "center",
      }}>
        <a href={wa("Hi! I'd like to place an order")} target="_blank" rel="noopener noreferrer"
          style={{
            background: BRAND.green, color: "#fff", padding: "13px 32px",
            borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 8, maxWidth: 440, width: "100%",
            justifyContent: "center", boxShadow: `0 4px 16px ${BRAND.green}55`,
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.609l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.191 0-4.215-.7-5.874-1.885l-.343-.254-3.544 1.189 1.189-3.544-.254-.343A9.958 9.958 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
          Order on WhatsApp
        </a>
      </div>

      {/* Footer */}
      <footer style={{
        background: BRAND.greenDark, padding: "36px 20px 100px", textAlign: "center",
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
