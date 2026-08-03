import { useState, useRef } from "react";
import { BRAND } from "./theme.js";

export default function ImageCarousel({ images, color, badge }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setCurrent(c => Math.min(c + 1, images.length - 1));
      else setCurrent(c => Math.max(c - 1, 0));
    }
    touchStartX.current = null;
  }

  return (
    <div
      style={{
        width: "100%", aspectRatio: "4/3", position: "relative",
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        overflow: "hidden",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%", objectFit: "cover",
            transform: `translateX(${(i - current) * 100}%)`,
            transition: "transform 0.3s ease",
            willChange: "transform",
          }}
          loading="lazy"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ))}

      {badge && (
        <span style={{
          position: "absolute", top: 14, left: 14, zIndex: 1,
          background: badge === "Best Seller" ? "#F59E0B" : badge === "Premium" ? BRAND.green : badge === "Limited Season" ? "#DC2626" : "#2563EB",
          color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 12px",
          borderRadius: 20, letterSpacing: 0.4, textTransform: "uppercase",
        }}>{badge}</span>
      )}

      {images.length > 1 && (
        <div style={{
          position: "absolute", bottom: 10, left: 0, right: 0, zIndex: 1,
          display: "flex", justifyContent: "center", gap: 5,
        }}>
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                height: 6, borderRadius: 3,
                width: i === current ? 18 : 6,
                background: i === current ? "#fff" : "rgba(255,255,255,0.5)",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
