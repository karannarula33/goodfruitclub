import { formatPrice } from "../lib/catalog.js";
import { BRAND } from "./theme.js";
import { navigate, getSavedOrders } from "./router.js";

export default function OrdersPage() {
  const orders = getSavedOrders();

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: BRAND.warm, color: BRAND.text, minHeight: "100vh",
      padding: "24px 0 60px",
    }}>
      <div className="container" style={{ maxWidth: 520 }}>
        <button
          onClick={() => navigate("#/")}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            color: BRAND.green, fontSize: 14, fontWeight: 600, fontFamily: "inherit",
            marginBottom: 18,
          }}
        >← Back to shop</button>

        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: BRAND.green, margin: "0 0 18px", fontWeight: 400 }}>
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 16, padding: "28px 20px", textAlign: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
          }}>
            <p style={{ color: BRAND.muted, fontSize: 14, margin: "0 0 16px" }}>
              You haven't placed any orders from this device yet.
            </p>
            <button
              onClick={() => navigate("#/")}
              style={{
                background: BRAND.green, color: "#fff", padding: "11px 24px",
                borderRadius: 10, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
              }}
            >Browse fruits →</button>
          </div>
        ) : (
          orders.map((o) => (
            <button
              key={o.token}
              onClick={() => navigate(`#/order/${o.token}`)}
              style={{
                width: "100%", textAlign: "left", cursor: "pointer",
                background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 12,
                border: "none", fontFamily: "inherit",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.04)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: BRAND.text }}>{o.orderNo}</div>
                <div style={{ fontSize: 12.5, color: BRAND.muted, marginTop: 2 }}>
                  {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: BRAND.green, fontSize: 15 }}>{formatPrice(o.total)}</div>
                <div style={{ fontSize: 12.5, color: BRAND.green, fontWeight: 600, marginTop: 2 }}>Track →</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
