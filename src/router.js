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

const CART_KEY = "gfc-cart";

// Read the same cart the storefront persists to localStorage, so a product
// page can add an item and hand off to "#/" with the cart already updated.
export function getCart() {
  try {
    const arr = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addToCart(item, qty) {
  let q = Math.round(qty * 10) / 10;
  if (q > 0 && q < item.min) q = item.min;
  if (q <= 0) return;
  const cart = getCart();
  const existing = cart.find((c) => c.itemName === item.name);
  const next = existing
    ? cart.map((c) => (c.itemName === item.name ? { ...c, qty: q } : c))
    : [...cart, { itemName: item.name, qty: q }];
  localStorage.setItem(CART_KEY, JSON.stringify(next));
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
