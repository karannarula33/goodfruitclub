import { useState, useEffect, useCallback } from "react";
import { formatPrice, formatQty } from "../lib/catalog.js";
import { BRAND, STATUS_LABEL, PAYMENT_LABEL } from "./theme.js";
import { navigate } from "./router.js";

const SECRET_KEY = "gfc-admin-secret";

export default function AdminPage() {
  const [secret, setSecret] = useState(() => localStorage.getItem(SECRET_KEY) || "");
  const [input, setInput] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("idle"); // idle | loading | ok | unauthorized | error
  const [busyToken, setBusyToken] = useState(null);

  const load = useCallback(async (sec) => {
    if (!sec) return;
    setState("loading");
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-secret": sec } });
      if (res.status === 401) { setState("unauthorized"); return; }
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setStatuses(data.statuses || []);
      setOrders(data.orders || []);
      setState("ok");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => { if (secret) load(secret); }, [secret, load]);

  function submitSecret() {
    localStorage.setItem(SECRET_KEY, input);
    setSecret(input);
  }

  function logout() {
    localStorage.removeItem(SECRET_KEY);
    setSecret("");
    setOrders([]);
    setState("idle");
  }

  async function setStatus(token, status) {
    setBusyToken(token);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ token, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.token === token ? updated : o)));
      }
    } finally {
      setBusyToken(null);
    }
  }

  const wrap = {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: BRAND.warm, color: BRAND.text, minHeight: "100vh",
    padding: "24px 0 60px",
  };

  const field = {
    width: "100%", padding: "11px 12px", borderRadius: 10, fontSize: 14,
    fontFamily: "inherit", boxSizing: "border-box", outline: "none",
    border: "1.5px solid #e5e5e5", marginBottom: 12,
  };

  if (!secret || state === "unauthorized") {
    return (
      <div style={wrap}><div className="container" style={{ maxWidth: 420 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: BRAND.green, margin: "0 0 16px", fontWeight: 400 }}>
          Admin
        </h1>
        {state === "unauthorized" && (
          <p style={{ color: "#B91C1C", fontSize: 13, marginBottom: 10 }}>That secret was rejected. Try again.</p>
        )}
        <input
          type="password" placeholder="Admin secret" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSecret()}
          style={field}
        />
        <button
          onClick={submitSecret}
          style={{
            width: "100%", padding: "12px", background: BRAND.green, color: "#fff",
            border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer",
          }}
        >Unlock</button>
      </div></div>
    );
  }

  return (
    <div style={wrap}>
      <div className="container" style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: BRAND.green, margin: 0, fontWeight: 400 }}>
            Orders
          </h1>
          <div style={{ display: "flex", gap: 14 }}>
            <button onClick={() => load(secret)} style={{ background: "none", border: "none", color: BRAND.green, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Refresh</button>
            <button onClick={logout} style={{ background: "none", border: "none", color: BRAND.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Lock</button>
          </div>
        </div>

        {state === "loading" && <p style={{ color: BRAND.muted }}>Loading…</p>}
        {state === "error" && <p style={{ color: "#B91C1C" }}>Failed to load orders.</p>}
        {state === "ok" && orders.length === 0 && <p style={{ color: BRAND.muted }}>No orders yet.</p>}

        {orders.map((o) => (
          <div key={o.token} style={{
            background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{o.orderNo}</span>
              <span style={{ fontWeight: 700, color: BRAND.green }}>{formatPrice(o.total)}</span>
            </div>
            <div style={{ fontSize: 13, color: BRAND.text, marginBottom: 2 }}>
              {o.name} · {o.phone}
            </div>
            <div style={{ fontSize: 12.5, marginBottom: 6 }}>
              <span style={{ color: BRAND.muted }}>{PAYMENT_LABEL[o.paymentMode] || o.paymentMode} · </span>
              <span style={{
                fontWeight: 700,
                color: o.paymentStatus === "paid" ? BRAND.green : (o.paymentMode === "ONLINE" ? "#B91C1C" : BRAND.muted),
              }}>
                {o.paymentStatus === "paid" ? "PAID" : (o.paymentMode === "ONLINE" ? "UNPAID" : "on delivery")}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: BRAND.muted, marginBottom: 8 }}>{o.address}</div>
            <div style={{ fontSize: 12.5, color: BRAND.muted, marginBottom: 10 }}>
              {o.items.map((l) => `${l.itemName} (${formatQty(l.qty, l.unit)})`).join(", ")}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {statuses.map((s) => {
                const active = o.fulfilmentStatus === s;
                return (
                  <button
                    key={s}
                    disabled={busyToken === o.token}
                    onClick={() => setStatus(o.token, s)}
                    style={{
                      padding: "6px 11px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      cursor: busyToken === o.token ? "default" : "pointer", fontFamily: "inherit",
                      border: `1.5px solid ${active ? BRAND.green : "#e5e5e5"}`,
                      background: active ? BRAND.green : "#fff",
                      color: active ? "#fff" : BRAND.muted,
                    }}
                  >{STATUS_LABEL[s] || s}</button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("#/")}
          style={{ background: "none", border: "none", color: BRAND.green, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}
        >← Back to shop</button>
      </div>
    </div>
  );
}
