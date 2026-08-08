import { useEffect } from "react";

export default function BottomSheet({ open, onClose, children }) {
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
