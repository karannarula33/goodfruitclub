// Shared product catalog + pricing logic.
// Imported by BOTH the React app (browser) and the API functions (Node),
// so order totals are computed from one authoritative source.

export const WA = "919911777333";

export const FRUITS = [
  { category: "Mangoes", items: [
    {
      name: "Pusa Arunima Mango",
      tagline: "Red-blushed and fibre-free — a rich, honey-sweet hybrid mango bred for flavour",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 650,
      tiers: [],
      images: ["/fruits/arunima.JPG"], color: "#F59E0B",
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
      basePrice: 360,
      tiers: [{ minQty: 5, pricePerUnit: 320 }],
      images: ["/fruits/mandarin.jpg"], color: "#EA580C",
    },
    {
      name: "Premium Mausmi",
      tagline: "Sweet lime at its best — thin-skinned, juicy, and mellow with almost no tang",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 150,
      tiers: [],
      images: ["/fruits/mausmi.jpg"], color: "#65A30D",
    },
  ]},
  { category: "Apples & Pears", items: [
    {
      name: "New Zealand Queen Apple",
      tagline: "Imported, firm, and genuinely sweet — the kind that actually crunches",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 460,
      tiers: [{ minQty: 5, pricePerUnit: 440 }],
      badge: "Premium", images: ["/fruits/apple.jpg"], color: "#DC2626",
    },
    {
      name: "Bartlett Pear",
      tagline: "Smooth, grain-free white flesh — perfectly ripe, not rock-hard",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 340,
      tiers: [],
      images: ["/fruits/pear.jpg"], color: "#84CC16",
    },
  ]},
  { category: "Seasonal Favourites", items: [
    {
      name: "Afghan Cherry",
      tagline: "Plump, dark, and intensely sweet — Afghan cherries are in a league of their own",
      unit: "box", step: 1, min: 1,
      basePrice: 750,
      tiers: [],
      badge: "New", images: ["/fruits/afghancherry.jpg"], color: "#BE123C",
    },
    {
      name: "Kashmir Plums",
      tagline: "Mountain-grown and deep red — jammy inside, sweet with a pleasant tartness",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 390,
      tiers: [],
      images: ["/fruits/kashmirplums.jpg"], color: "#9333EA",
    },
    {
      name: "Black Amber Plum",
      tagline: "Deep purple-black skin, firm and sweet-tart — a striking summer plum",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 350,
      tiers: [],
      images: ["/fruits/blackamberplums.jpg"], color: "#581C87",
    },
    {
      name: "Donut Peach",
      tagline: "Flat and saucer-shaped, with a honeyed, low-acid bite and barely a pit (9-10 pc/box)",
      unit: "box", step: 1, min: 1,
      basePrice: 550,
      tiers: [],
      images: ["/fruits/donutpeach.JPG"], color: "#FB7185",
    },
  ]},
  { category: "Exotics & Everyday", items: [
    {
      name: "Mangosteen",
      tagline: "Deep purple rind, snow-white segments — delicately sweet-tart and juicy",
      unit: "kg", step: 0.5, min: 0.5,
      basePrice: 1100,
      tiers: [{ minQty: 1, pricePerUnit: 990 }],
      images: ["/fruits/mangosteen.JPG"], color: "#6D28D9",
    },
    {
      name: "Red Banana",
      tagline: "Sweet, creamy, and firm — richer than the everyday yellow banana (4-5 pc/kg)",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 280,
      tiers: [],
      images: ["/fruits/redbanana.JPG"], color: "#DC2626",
    },
    {
      name: "Elaichi Banana",
      tagline: "Small, fragrant, and intensely sweet — the cardamom banana (12-13 pcs/kg)",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 300,
      tiers: [],
      images: ["/fruits/elaichibanana.JPG"], color: "#CA8A04",
    },
    {
      name: "Rani Pineapple",
      tagline: "Golden, sweet, and intensely aromatic — the classic Rani variety (1-1.5kg each)",
      unit: "pc", step: 1, min: 1,
      basePrice: 230,
      tiers: [],
      images: ["/fruits/pineapple.jpg"], color: "#D97706",
    },
    {
      name: "Hass Avocado",
      tagline: "Creamy, ripe, ready to eat — for toast, salads, or just with salt and lime",
      unit: "pc", step: 1, min: 2,
      basePrice: 170,
      tiers: [],
      images: ["/fruits/avocado.jpg"], color: "#166534",
    },
    {
      name: "White Dragon Fruit",
      tagline: "Mild, refreshing, with a subtle kiwi-like sweetness",
      unit: "pc", step: 1, min: 2,
      basePrice: 130,
      tiers: [],
      images: ["/fruits/dragonfruit.jpg"], color: "#DB2777",
    },
    {
      name: "Red Dragon Fruit",
      tagline: "Vivid crimson flesh, sweeter and juicier than the white variety",
      unit: "pc", step: 1, min: 2,
      basePrice: 150,
      tiers: [],
      images: ["/fruits/Reddragonfruit.jpg"], color: "#BE185D",
    },
    {
      name: "Zespri Golden Kiwi",
      tagline: "Sweet, tropical, and smooth — golden flesh with a hint of mango",
      unit: "box", step: 1, min: 1,
      basePrice: 480,
      tiers: [],
      images: ["/fruits/goldenkiwi.jpg"], color: "#EAB308",
    },
    {
      name: "Zespri Green Kiwi",
      tagline: "Tangy-sweet and juicy — slice in half and scoop with a spoon",
      unit: "box", step: 1, min: 1,
      basePrice: 430,
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
      unit: "kg", step: 0.5, min: 0.5,
      basePrice: 580,
      tiers: [{ minQty: 1, pricePerUnit: 540 }, { minQty: 2, pricePerUnit: 500 }],
      images: ["/fruits/redglobegrapes.jpg"], color: "#BE123C",
    },
    {
      name: "Muscat Grapes",
      tagline: "The aromatic classic — exceptionally sweet with a firm, seedless bite and absolutely zero tartness (500g box)",
      unit: "box", step: 1, min: 1,
      basePrice: 480,
      tiers: [{ minQty: 2, pricePerUnit: 450 }],
      badge: "Pre-Order", images: ["/fruits/muscatgrapes.jpg"], color: "#4D7C0F",
    },
    {
      name: "Moon Drops Grapes",
      tagline: "Elongated, seedless, and crisp — a strikingly sweet grape with a satisfying crunch",
      unit: "kg", step: 0.5, min: 0.5,
      basePrice: 800,
      tiers: [{ minQty: 1, pricePerUnit: 700 }],
      images: ["/fruits/moondrops.jpg"], color: "#7C2D92",
    },
    {
      name: "Anaar (Pomegranate)",
      tagline: "Deep red, juicy arils bursting with sweet-tart flavour",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 380,
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
    {
      name: "Longan",
      tagline: "Small, translucent, and floral-sweet — the 'dragon eye' fruit, a close cousin of lychee",
      unit: "kg", step: 0.5, min: 0.5,
      basePrice: 1000,
      tiers: [{ minQty: 1, pricePerUnit: 950 }],
      images: ["/fruits/longan.JPG"], color: "#92400E",
    },
  ]},
  { category: "Daily Staples", items: [
    {
      name: "Daily Staples Box",
      tagline: "A handpicked mix of everyday fruit staples — fresh, simple, and ready for the week.",
      unit: "box", step: 1, min: 1,
      basePrice: 650,
      tiers: [],
      images: ["/fruits/mixbox1.jpg"], color: "#0D9488",
    },
    {
      name: "Rockit Apple",
      tagline: "Snack-sized, crisp New Zealand apples in their signature tube — grab one and go",
      unit: "tube", step: 1, min: 1,
      basePrice: 550,
      tiers: [],
      badge: "New", images: ["/fruits/rockitapple.jpg"], color: "#BE123C",
    },
    {
      name: "Mini Guava",
      tagline: "Small, firm, and fragrant — the sweet everyday guava (4-5 pc/kg)",
      unit: "kg", step: 0.5, min: 1,
      basePrice: 260,
      tiers: [],
      images: ["/fruits/miniguava.jpg"], color: "#65A30D",
    },
  ]},
];

// Curated gift boxes — displayed in their own highlighted section, but priced
// and ordered through the same cart/checkout path as regular items (findItem
// below searches this list too). "tagline" is the marketing blurb; "contents"
// is the itemized subline shown under it.
export const GIFT_BOXES = [
  {
    name: "🧺 The Grand Harvest Box",
    tagline: "Ten handpicked fruits from around the world — mango, dragon fruit, mangosteen, golden kiwi and more — a grand gesture for the festive season.",
    contents: "2 Chausa Mango, 2 Banarsi Langda Mango, 1 White Dragon Fruit, 4 Mandarin Orange, 2 New Zealand Queen Apple, 2 Bartlett Pear, 2 Zespri Golden Kiwi, 2 Anaar, 2 Mangosteen, 1 Box Jumbo Blueberry",
    unit: "box", step: 1, min: 1,
    basePrice: 3490,
    tiers: [],
    images: [
      "/gift-boxes/mango-and-exotics/1.jpg",
      "/gift-boxes/mango-and-exotics/2.jpg",
      "/gift-boxes/mango-and-exotics/3.jpg",
    ],
    color: "#F59E0B",
  },
  {
    name: "🥭 The Mango Legacy Box",
    tagline: "The last of this season's Chausa and Banarsi Langda mangoes at their sweetest peak — one final mango celebration before the season ends.",
    contents: "3 Chausa Mango, 6 Banarsi Langda Mango",
    unit: "box", step: 1, min: 1,
    basePrice: 1990,
    tiers: [],
    images: [
      "/gift-boxes/mango-box/1.jpg",
      "/gift-boxes/mango-box/2.jpg",
      "/gift-boxes/mango-box/3.jpg",
      "/gift-boxes/mango-box/4.jpg",
      "/gift-boxes/mango-box/5.jpg",
    ],
    color: "#CA8A04",
  },
  {
    name: "🍊 The Radiance Box",
    tagline: "A bright, wholesome mix of apples, avocados, oranges, malta and pomegranate — everyday freshness, festively packed.",
    contents: "5 New Zealand Queen Apple, 3 Hass Avocado, 6 Mandarin Orange, 5 Malta, 4 Anaar",
    unit: "box", step: 1, min: 1,
    basePrice: 3490,
    tiers: [],
    images: [
      "/gift-boxes/everyday-exotics/1.jpg",
      "/gift-boxes/everyday-exotics/2.jpg",
      "/gift-boxes/everyday-exotics/3.jpg",
      "/gift-boxes/everyday-exotics/4.jpg",
    ],
    color: "#F97316",
  },
  {
    name: "💎 The Jewel Box",
    tagline: "A jewel-toned selection of imported cherries, Afghan apricots, plums, jamun and blueberries — small in size, luxurious in every bite.",
    contents: "300g Afghan Khurmani, 300g Imported Cherry, 400g Plums, 400g Jamun, 1 Box Jumbo Blueberry, 500g Red Globe Grapes",
    unit: "box", step: 1, min: 1,
    basePrice: 3490,
    tiers: [],
    images: [
      "/gift-boxes/box-in-a-box/1.jpg",
      "/gift-boxes/box-in-a-box/2.jpg",
      "/gift-boxes/box-in-a-box/3.jpg",
      "/gift-boxes/box-in-a-box/4.jpg",
    ],
    color: "#9333EA",
  },
];

export function findItem(name) {
  for (const cat of FRUITS) {
    for (const item of cat.items) {
      if (item.name === name) return item;
    }
  }
  for (const box of GIFT_BOXES) {
    if (box.name === name) return box;
  }
  return null;
}

// Slugs are derived from the name rather than stored, so there's one source
// of truth for a product's identity. Strips emoji/punctuation used in gift
// box names (e.g. "🧺 The Grand Harvest Box" -> "the-grand-harvest-box").
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function findItemBySlug(slug) {
  for (const cat of FRUITS) {
    for (const item of cat.items) {
      if (slugify(item.name) === slug) return item;
    }
  }
  for (const box of GIFT_BOXES) {
    if (slugify(box.name) === slug) return box;
  }
  return null;
}

export function isGiftBox(item) {
  return GIFT_BOXES.some((box) => box.name === item.name);
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
  if (unit === "kg" && qty < 1) return `${Math.round(qty * 1000)}g`;
  return `${qty} ${unit}`;
}

// The "from" price shown on a card before any quantity is picked. Usually
// this is just basePrice/unit, but items whose minimum purchase is less than
// one full unit (e.g. Mangosteen sold from 500g) need the actual minimum-
// purchase price and a matching label — showing the raw per-kg rate would
// overstate the real entry price.
export function getMinPurchasePrice(item) {
  // Only items whose minimum purchase is a fraction of the priced unit (e.g.
  // Mangosteen sold from 500g at a per-kg rate) need the price rescaled —
  // for everything else basePrice already is the price for item.min.
  if (item.min >= 1) return { price: item.basePrice, label: item.unit };
  return { price: item.basePrice * item.min, label: formatQty(item.min, item.unit) };
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
