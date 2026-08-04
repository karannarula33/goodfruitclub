// Shared product catalog + pricing logic.
// Imported by BOTH the React app (browser) and the API functions (Node),
// so order totals are computed from one authoritative source.

export const WA = "919911777333";

export const FRUITS = [
  { category: "Mangoes", items: [
    {
      name: "Chausa Mango",
      tagline: "Thin-skinned, silky smooth, and intensely sweet — one of the finest mangoes of the season",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 295,
      tiers: [{ minQty: 10, pricePerUnit: 290 }],
      images: ["/fruits/chausa.jpg"], color: "#F59E0B",
    },
    {
      name: "Banarsi Langda",
      tagline: "The Banarsi classic — tangy-sweet with a distinctive green skin even at full ripeness",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 250,
      tiers: [{ minQty: 10, pricePerUnit: 235 }],
      images: ["/fruits/langda.jpg"], color: "#84CC16",
    },
  ]},
  { category: "Citrus", items: [
    {
      name: "Malta Orange",
      tagline: "Juice-heavy, fragrant, and full — not the dry kind you get at stores",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 280,
      tiers: [{ minQty: 2.5, pricePerUnit: 264 }],
      images: ["/fruits/malta.jpg"], color: "#F97316",
    },
    {
      name: "Mandarin Orange",
      tagline: "Easy to peel, naturally sweet, almost zero acidity",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 300,
      tiers: [{ minQty: 5, pricePerUnit: 280 }],
      images: ["/fruits/mandarin.jpg"], color: "#EA580C",
    },
  ]},
  { category: "Apples & Pears", items: [
    {
      name: "New Zealand Apple",
      tagline: "Imported, firm, and genuinely sweet — the kind that actually crunches",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 460,
      tiers: [{ minQty: 5, pricePerUnit: 440 }],
      badge: "Premium", images: ["/fruits/apple.jpg"], color: "#DC2626",
    },
    {
      name: "Pear",
      tagline: "Smooth, grain-free white flesh — perfectly ripe, not rock-hard",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 370,
      tiers: [],
      images: ["/fruits/pear.jpg"], color: "#84CC16",
    },
  ]},
  { category: "Seasonal Favourites", items: [
    {
      name: "Turkish Cherry",
      tagline: "Plump, deep-red Turkish cherries — firm-fleshed and richly sweet (600-650g box)",
      unit: "box", step: 1, min: 1,
      basePrice: 850,
      tiers: [],
      images: ["/fruits/turkishcherry.jpg"], color: "#BE123C",
    },
    {
      name: "Jamun",
      tagline: "Sweet-tart bite that just means summer. Plump, deep purple (400gm box)",
      unit: "box", step: 1, min: 1,
      basePrice: 350,
      tiers: [{ minQty: 3, pricePerUnit: 330 }],
      images: ["/fruits/jamun.jpg"], color: "#7C3AED",
    },
    {
      name: "Kashmir Plums",
      tagline: "Mountain-grown and deep red — jammy inside, sweet with a pleasant tartness",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 390,
      tiers: [],
      images: ["/fruits/kashmirplums.jpg"], color: "#9333EA",
    },
  ]},
  { category: "Exotics & Everyday", items: [
    {
      name: "Hass Avocado",
      tagline: "Creamy, ripe, ready to eat — for toast, salads, or just with salt and lime",
      unit: "pc", step: 1, min: 2,
      basePrice: 160,
      tiers: [],
      images: ["/fruits/avocado.jpg"], color: "#166534",
    },
    {
      name: "Dragon Fruit",
      tagline: "Mild, refreshing, with a subtle kiwi-like sweetness",
      unit: "pc", step: 1, min: 2,
      basePrice: 120,
      tiers: [],
      images: ["/fruits/dragonfruit.jpg"], color: "#DB2777",
    },
    {
      name: "Red Dragon Fruit",
      tagline: "Vivid crimson flesh, sweeter and juicier than the white variety",
      unit: "pc", step: 1, min: 2,
      basePrice: 130,
      tiers: [],
      images: ["/fruits/Reddragonfruit.jpg"], color: "#BE185D",
    },
    {
      name: "Golden Kiwi",
      tagline: "Sweet, tropical, and smooth — golden flesh with a hint of mango",
      unit: "box", step: 1, min: 1,
      basePrice: 500,
      tiers: [],
      images: ["/fruits/goldenkiwi.jpg"], color: "#EAB308",
    },
    {
      name: "Green Kiwi",
      tagline: "Tangy-sweet and juicy — slice in half and scoop with a spoon",
      unit: "box", step: 1, min: 1,
      basePrice: 480,
      tiers: [],
      images: ["/fruits/greenkiwi.jpg"], color: "#65A30D",
    },
    {
      name: "Papaya",
      tagline: "Sweet, soft, custard-like — picked at the right ripeness",
      unit: "kg", step: 1, min: 1,
      basePrice: 150,
      tiers: [],
      images: ["/fruits/papaya.jpg"], color: "#EA580C",
    },
    {
      name: "Red Globe Grapes",
      tagline: "Large, firm, and deeply sweet — the real thing, not the watery supermarket kind",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 520,
      tiers: [{ minQty: 2, pricePerUnit: 500 }],
      images: ["/fruits/redglobegrapes.jpg"], color: "#BE123C",
    },
    {
      name: "Muscat Grapes",
      tagline: "The aromatic classic — exceptionally sweet with a firm, seedless bite and absolutely zero tartness (500g box)",
      unit: "box", step: 1, min: 1,
      basePrice: 480,
      tiers: [],
      badge: "Pre-Order", images: ["/fruits/muscatgrapes.jpg"], color: "#4D7C0F",
    },
    {
      name: "Anaar (Pomegranate)",
      tagline: "Deep red, juicy arils bursting with sweet-tart flavour",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 450,
      tiers: [],
      images: ["/fruits/anaar1.JPG"], color: "#BE123C",
    },
    {
      name: "Sharda (Sunmelon)",
      tagline: "Golden-skinned muskmelon — fragrant, juicy, and honey-sweet",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 190,
      tiers: [],
      images: ["/fruits/sunmelon.JPG"], color: "#EAB308",
    },
    {
      name: "Jumbo Blueberry",
      tagline: "Extra-large, plump blueberries — bursting with flavour (125g box)",
      unit: "box", step: 1, min: 1,
      basePrice: 330,
      tiers: [],
      images: ["/fruits/jumboblueberry.JPG"], color: "#3730A3",
    },
  ]},
];

export function findItem(name) {
  for (const cat of FRUITS) {
    for (const item of cat.items) {
      if (item.name === name) return item;
    }
  }
  return null;
}

export function getPricePerUnit(item, qty) {
  let rate = item.basePrice;
  for (const tier of item.tiers) {
    if (qty >= tier.minQty) rate = tier.pricePerUnit;
  }
  return rate;
}

export function getNextNudge(item, qty) {
  const currentRate = getPricePerUnit(item, qty);
  for (const tier of item.tiers) {
    if (qty < tier.minQty && tier.pricePerUnit < currentRate) {
      return {
        needed: Math.round((tier.minQty - qty) * 10) / 10,
        rate: tier.pricePerUnit,
      };
    }
  }
  return null;
}

export function formatQty(qty, unit) {
  if (unit === "box") return `${qty} ${qty === 1 ? "box" : "boxes"}`;
  return `${qty} ${unit}`;
}

export function formatPrice(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatRate(ppu) {
  return Number.isInteger(ppu) ? `₹${ppu}` : `₹${ppu.toFixed(1)}`;
}

// Authoritative order computation. Takes a raw cart [{ itemName, qty }] and
// returns validated line items + totals. Unknown items and non-positive
// quantities are dropped. Used by the server so client-sent prices are never
// trusted; also reused by the client to keep one code path.
export function computeOrder(cart) {
  const lines = [];
  for (const entry of Array.isArray(cart) ? cart : []) {
    const item = findItem(entry?.itemName);
    const qty = Number(entry?.qty);
    if (!item || !Number.isFinite(qty) || qty <= 0) continue;
    const pricePerUnit = getPricePerUnit(item, qty);
    const lineTotal = Math.round(pricePerUnit * qty);
    lines.push({
      itemName: item.name,
      qty,
      unit: item.unit,
      pricePerUnit,
      lineTotal,
    });
  }
  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  return { lines, total };
}
