import { useState, useRef } from "react";
import { BRAND } from "./theme.js";

// Every source image also has -sm.webp (~600w) and .webp (~1200w) variants
// generated alongside it (same basename, case-insensitive extension swap).
function webpSrcSet(src) {
  const base = src.replace(/\.(jpe?g|png)$/i, "");
  return `${base}-sm.webp 600w, ${base}.webp 1200w`;
}

export default function ImageCarousel({ images, color, badge }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);
  const hasMultiple = images.length > 1;

  function goTo(i) {
    setCurrent(Math.max(0, Math.min(i, images.length - 1)));
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goTo(current + 1);
      else goTo(current - 1);
    }
    touchStartX.current = null;
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowRight") goTo(current + 1);
    else if (e.key === "ArrowLeft") goTo(current - 1);
  }

  return (
    <div
      className="carousel-container"
      tabIndex={hasMultiple ? 0 : undefined}
      onKeyDown={hasMultiple ? handleKeyDown : undefined}
      style={{
        width: "100%", aspectRatio: "4/3", position: "relative",
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        overflow: "hidden", outline: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((src, i) => (
        <picture
          key={i}
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            display: "block",
            transform: `translateX(${(i - current) * 100}%)`,
            transition: "transform 0.3s ease",
            willChange: "transform",
          }}
        >
          <source
            type="image/webp"
            srcSet={webpSrcSet(src)}
            sizes="(min-width: 768px) 400px, 100vw"
          />
          <img
            src={src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </picture>
      ))}

      {badge && (
        <span style={{
          position: "absolute", top: 14, left: 14, zIndex: 1,
          background: badge === "Best Seller" ? "#F59E0B" : badge === "Premium" ? BRAND.green : badge === "Limited Season" ? "#DC2626" : "#2563EB",
          color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 12px",
          borderRadius: 20, letterSpacing: 0.4, textTransform: "uppercase",
        }}>{badge}</span>
      )}

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
            disabled={current === 0}
            className="carousel-arrow carousel-arrow-left"
          >‹</button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
            disabled={current === images.length - 1}
            className="carousel-arrow carousel-arrow-right"
          >›</button>
        </>
      )}

      {hasMultiple && (
        <div style={{
          position: "absolute", bottom: 10, left: 0, right: 0, zIndex: 1,
          display: "flex", justifyContent: "center", gap: 5,
        }}>
          {images.map((_, i) => (
            <div
              key={i}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); goTo(i); }}
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
