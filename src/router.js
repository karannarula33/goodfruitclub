import { useState, useEffect } from "react";

// Minimal hash-based router. Hash routing keeps everything working on the plain
// static SPA host — no server rewrites needed for deep links like
// #/order/<token>, and links stay shareable.
export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export function navigate(to) {
  if (window.location.hash === to) {
    // Force a re-read even if the hash is unchanged.
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = to;
  }
  window.scrollTo(0, 0);
}

const SAVED_KEY = "gfc-orders";

// Track the customer's own orders locally so they get a "My Orders" list
// without needing accounts.
export function getSavedOrders() {
  try {
    const arr = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveOrder({ token, orderNo, total }) {
  const existing = getSavedOrders().filter((o) => o.token !== token);
  const next = [{ token, orderNo, total, createdAt: Date.now() }, ...existing].slice(0, 50);
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
}
