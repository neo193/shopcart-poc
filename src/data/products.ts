import { MORE_PRODUCTS } from "./moreProducts";

export interface ColorVariant {
  name: string;
  hex: string;
  secondaryHex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  monthlyPrice?: number;
  description: string;
  shortDesc: string;
  rating: number;
  reviews: number;
  /** ISO date the product was listed; drives "What's New". */
  addedAt: string;
  /** Used when visualType is "emoji" (placeholder art until real photos). */
  emoji?: string;
  category: string;
  headphoneType?: "Over-Ear" | "In-Ear" | "On-Ear";
  material?: string;
  offer?: string;
  stockLeft?: number;
  visualType:
    | "earbuds-case"
    | "over-ear"
    | "neckband"
    | "gaming-headset"
    | "laptop"
    | "smart-speaker"
    | "laptop-sleeve"
    | "emoji";
  defaultColor: string;
  colors: ColorVariant[];
  specs: {
    general: Record<string, string>;
    details: Record<string, string>;
  };
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  itemsAvailable: number;
  bgGradient: string;
  accentColor: string;
  visual: "furniture" | "handbag" | "books" | "tech" | "sneakers" | "travel" | "headphone" | "laptop";
}

export const POPULAR_CATEGORIES: CategoryItem[] = [
  {
    id: "furniture",
    name: "Furniture",
    slug: "furniture",
    itemsAvailable: 240,
    bgGradient: "from-emerald-900 to-teal-700",
    accentColor: "#003D29",
    visual: "furniture",
  },
  {
    id: "headphone",
    name: "Headphone",
    slug: "headphones",
    itemsAvailable: 240,
    bgGradient: "from-rose-900 to-pink-700",
    accentColor: "#9D174D",
    visual: "headphone",
  },
  {
    id: "shoe",
    name: "Shoe",
    slug: "sneakers",
    itemsAvailable: 240,
    bgGradient: "from-amber-800 to-orange-600",
    accentColor: "#B45309",
    visual: "sneakers",
  },
  {
    id: "bag",
    name: "Bag",
    slug: "hand-bag",
    itemsAvailable: 240,
    bgGradient: "from-stone-800 to-stone-600",
    accentColor: "#44403C",
    visual: "handbag",
  },
  {
    id: "laptop",
    name: "Laptop",
    slug: "tech",
    itemsAvailable: 240,
    bgGradient: "from-slate-800 to-slate-600",
    accentColor: "#334155",
    visual: "laptop",
  },
  {
    id: "book",
    name: "Book",
    slug: "books",
    itemsAvailable: 240,
    bgGradient: "from-red-900 to-rose-700",
    accentColor: "#991B1B",
    visual: "books",
  },
];

export const TOP_CATEGORIES: CategoryItem[] = [
  {
    id: "furniture",
    name: "Furniture",
    slug: "furniture",
    itemsAvailable: 240,
    bgGradient: "from-[#1A4D3E] to-[#3B7A68]",
    accentColor: "#1A4D3E",
    visual: "furniture",
  },
  {
    id: "handbag",
    name: "Hand Bag",
    slug: "hand-bag",
    itemsAvailable: 185,
    bgGradient: "from-[#9F6B43] to-[#C89B73]",
    accentColor: "#9F6B43",
    visual: "handbag",
  },
  {
    id: "books",
    name: "Books",
    slug: "books",
    itemsAvailable: 312,
    bgGradient: "from-[#8F1D2C] to-[#C44555]",
    accentColor: "#8F1D2C",
    visual: "books",
  },
  {
    id: "tech",
    name: "Tech",
    slug: "tech",
    itemsAvailable: 420,
    bgGradient: "from-[#1B3A2F] to-[#2F614E]",
    accentColor: "#1B3A2F",
    visual: "tech",
  },
  {
    id: "sneakers",
    name: "Sneakers",
    slug: "sneakers",
    itemsAvailable: 196,
    bgGradient: "from-[#7C4D3A] to-[#B07A62]",
    accentColor: "#7C4D3A",
    visual: "sneakers",
  },
  {
    id: "travel",
    name: "Travel",
    slug: "travel",
    itemsAvailable: 148,
    bgGradient: "from-[#A6634B] to-[#D4927A]",
    accentColor: "#A6634B",
    visual: "travel",
  },
];

export const AIRPODS_COLORS: ColorVariant[] = [
  { name: "Pink", hex: "#E6877F", secondaryHex: "#F5C6C2" },
  { name: "Space Gray", hex: "#3A3B3D", secondaryHex: "#6E7073" },
  { name: "Sage Green", hex: "#9CB39E", secondaryHex: "#CEDBD0" },
  { name: "Silver", hex: "#D9DCE0", secondaryHex: "#F1F3F5" },
  { name: "Sky Blue", hex: "#7695B5", secondaryHex: "#B7CCE0" },
];

export const HEADPHONES_PRODUCTS: Product[] = [
  {
    id: "wireless-earbuds-ipx8",
    slug: "wireless-earbuds-ipx8",
    name: "Wireless Earbuds, IPX8",
    brand: "SoundCore",
    price: 2999,
    shortDesc: "Organic Cotton, fairtrade certified",
    description:
      "Waterproof IPX8 wireless earbuds engineered with deep bass drivers, 32-hour charging case, and crystal-clear call microphones.",
    rating: 4.6,
    reviews: 1284,
    addedAt: "2026-10-02",
    category: "Headphones",
    headphoneType: "In-Ear",
    material: "Matte Polymer",
    offer: "20% Off",
    stockLeft: 18,
    visualType: "earbuds-case",
    defaultColor: "#1F2937",
    colors: [
      { name: "Midnight Black", hex: "#1F2937", secondaryHex: "#4B5563" },
      { name: "Pearl White", hex: "#E5E7EB", secondaryHex: "#F9FAFB" },
    ],
    specs: {
      general: {
        Brand: "SoundCore",
        Model: "IPX8 True Wireless Earbuds",
        Price: "₹2,999",
        "Release Date": "January 2024",
        "Model Number": "SC-IPX8-BLK",
        "Headphone Type": "In-Ear",
        Connectivity: "Bluetooth 5.3",
      },
      details: {
        Microphone: "Yes (Dual ENC)",
        "Driver Type": "Dynamic",
        "Driver Size (mm)": "11",
        "Number of Drivers": "2",
        "Water Resistant": "Yes (IPX8)",
        "Weight (g)": "52 gm",
        "Battery Life (Hrs)": "32",
      },
    },
  },
  {
    id: "airpods-max",
    slug: "airpods-max",
    name: "Airpods- Max",
    brand: "Apple",
    price: 59900,
    monthlyPrice: 9984,
    shortDesc: "A perfect balance of high-fidelity audio",
    description:
      "A perfect balance of exhilarating high-fidelity audio and the effortless magic of AirPods.",
    rating: 4.8,
    reviews: 3920,
    addedAt: "2026-03-14",
    category: "Headphones",
    headphoneType: "Over-Ear",
    material: "Anodized Aluminum",
    offer: "Special Financing",
    stockLeft: 12,
    visualType: "over-ear",
    defaultColor: "#E6877F",
    colors: AIRPODS_COLORS,
    specs: {
      general: {
        Brand: "Apple",
        Model: "AirPods Max Wireless Headphones",
        Price: "₹59,900",
        "Release Date": "December 2020",
        "Model Number": "AirPods Max",
        "Headphone Type": "Over-Ear",
        Connectivity: "Wireless",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "Dynamic",
        "Driver Size (mm)": "40",
        "Number of Drivers": "1",
        "Water Resistant": "No",
        "Weight (g)": "385 gm",
        "Battery Life (Hrs)": "20",
      },
    },
  },
  {
    id: "bose-bt-earphones",
    slug: "bose-bt-earphones",
    name: "Bose BT Earphones",
    brand: "Bose",
    price: 24900,
    shortDesc: "Table with air purifier, stained veneer/black",
    description:
      "Signature Bose active noise cancellation with plush memory-foam ear cushions and multi-device Bluetooth pairing.",
    rating: 4.7,
    reviews: 2110,
    addedAt: "2026-06-20",
    category: "Headphones",
    headphoneType: "Over-Ear",
    material: "Protein Leather",
    offer: "Free Shipping",
    stockLeft: 9,
    visualType: "over-ear",
    defaultColor: "#26282B",
    colors: [
      { name: "Triple Black", hex: "#26282B", secondaryHex: "#52555A" },
      { name: "Soapstone", hex: "#D1D5DB", secondaryHex: "#F3F4F6" },
    ],
    specs: {
      general: {
        Brand: "Bose",
        Model: "Bose QuietComfort BT",
        Price: "₹24,900",
        "Release Date": "March 2024",
        "Model Number": "QC-BT-289",
        "Headphone Type": "Over-Ear",
        Connectivity: "Wireless",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "TriPort Acoustic",
        "Driver Size (mm)": "40",
        "Number of Drivers": "2",
        "Water Resistant": "No",
        "Weight (g)": "240 gm",
        "Battery Life (Hrs)": "24",
      },
    },
  },
  {
    id: "vivefox-headphones",
    slug: "vivefox-headphones",
    name: "VIVEFOX Headphones",
    brand: "VIVEFOX",
    price: 1499,
    shortDesc: "Wired Stereo Headsets With Mic",
    description:
      "Lightweight foldable stereo headphones with inline HD microphone and tangle-free braided 3.5mm audio cable.",
    rating: 4.1,
    reviews: 312,
    addedAt: "2026-09-11",
    category: "Headphones",
    headphoneType: "On-Ear",
    material: "ABS Plastic",
    offer: "50% Off",
    stockLeft: 34,
    visualType: "over-ear",
    defaultColor: "#DC2626",
    colors: [
      { name: "Crimson Red", hex: "#DC2626", secondaryHex: "#FCA5A5" },
      { name: "Cobalt Blue", hex: "#2563EB", secondaryHex: "#93C5FD" },
    ],
    specs: {
      general: {
        Brand: "VIVEFOX",
        Model: "VIVEFOX Wired Stereo",
        Price: "₹1,499",
        "Release Date": "June 2023",
        "Model Number": "VF-ST-01",
        "Headphone Type": "On-Ear",
        Connectivity: "Wired 3.5mm",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "Neodymium",
        "Driver Size (mm)": "40",
        "Number of Drivers": "2",
        "Water Resistant": "No",
        "Weight (g)": "190 gm",
        "Battery Life (Hrs)": "N/A (Wired)",
      },
    },
  },
  {
    id: "jbl-tune-600btnc",
    slug: "jbl-tune-600btnc",
    name: "JBL TUNE 600BTNC",
    brand: "JBL",
    price: 4999,
    shortDesc: "Premium Bone Conduction Open Ear Bluetooth",
    description:
      "JBL Pure Bass Sound with Active Noise Cancellation in a compact, flat-folding on-ear silhouette.",
    rating: 4.5,
    reviews: 1870,
    addedAt: "2026-04-02",
    category: "Headphones",
    headphoneType: "On-Ear",
    material: "Matte Polymer",
    offer: "30% Off",
    stockLeft: 14,
    visualType: "over-ear",
    defaultColor: "#1F2937",
    colors: [
      { name: "Matte Black", hex: "#1F2937", secondaryHex: "#4B5563" },
      { name: "Ocean Blue", hex: "#1D4ED8", secondaryHex: "#60A5FA" },
    ],
    specs: {
      general: {
        Brand: "JBL",
        Model: "TUNE 600BTNC",
        Price: "₹4,999",
        "Release Date": "September 2023",
        "Model Number": "JBLT600BTNC",
        "Headphone Type": "On-Ear",
        Connectivity: "Wireless",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "Dynamic",
        "Driver Size (mm)": "32",
        "Number of Drivers": "2",
        "Water Resistant": "No",
        "Weight (g)": "173 gm",
        "Battery Life (Hrs)": "12",
      },
    },
  },
  {
    id: "trury-bluetooth",
    slug: "trury-bluetooth",
    name: "TRURY Bluetooth",
    brand: "TRURY",
    price: 3499,
    shortDesc: "USB-C to USB-C 3.2, 5ft",
    description:
      "Transparent cyber-chassis wireless earbuds with low-latency gaming mode and RGB battery indicator.",
    rating: 3.9,
    reviews: 204,
    addedAt: "2026-11-10",
    category: "Headphones",
    headphoneType: "In-Ear",
    material: "Polycarbonate",
    offer: "New Arrival",
    stockLeft: 11,
    visualType: "earbuds-case",
    defaultColor: "#0F172A",
    colors: [
      { name: "Obsidian Neon", hex: "#0F172A", secondaryHex: "#38BDF8" },
    ],
    specs: {
      general: {
        Brand: "TRURY",
        Model: "TRURY Cyber TWS",
        Price: "₹3,499",
        "Release Date": "February 2024",
        "Model Number": "TR-CYB-169",
        "Headphone Type": "In-Ear",
        Connectivity: "Bluetooth 5.3",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "Planar",
        "Driver Size (mm)": "12",
        "Number of Drivers": "2",
        "Water Resistant": "Yes (IPX5)",
        "Weight (g)": "58 gm",
        "Battery Life (Hrs)": "28",
      },
    },
  },
  {
    id: "monster-mnflex",
    slug: "monster-mnflex",
    name: "Monster MNFLEX",
    brand: "Monster",
    price: 5999,
    shortDesc: "Flex Active Noise Cancelling Bluetooth",
    description:
      "Flexible ergonomic neckband earphones built for athletes with magnetic earbuds and rapid 10-minute charge.",
    rating: 4.3,
    reviews: 688,
    addedAt: "2026-07-18",
    category: "Headphones",
    headphoneType: "In-Ear",
    material: "Silicone & Alloy",
    offer: "Free Shipping",
    stockLeft: 7,
    visualType: "neckband",
    defaultColor: "#27272A",
    colors: [
      { name: "Graphite", hex: "#27272A", secondaryHex: "#71717A" },
    ],
    specs: {
      general: {
        Brand: "Monster",
        Model: "MNFLEX ANC",
        Price: "₹5,999",
        "Release Date": "November 2023",
        "Model Number": "MN-FLX-199",
        "Headphone Type": "In-Ear",
        Connectivity: "Wireless",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "Dynamic",
        "Driver Size (mm)": "10",
        "Number of Drivers": "2",
        "Water Resistant": "Yes (IPX6)",
        "Weight (g)": "38 gm",
        "Battery Life (Hrs)": "18",
      },
    },
  },
  {
    id: "mpow-ch6",
    slug: "mpow-ch6",
    name: "Mpow CH6",
    brand: "Mpow",
    price: 2499,
    shortDesc: "Kids Headphones",
    description:
      "Studio-grade acoustic isolation headphones in vibrant sky blue with ultra-soft memory-protein earpads.",
    rating: 4.4,
    reviews: 951,
    addedAt: "2026-02-27",
    category: "Headphones",
    headphoneType: "Over-Ear",
    material: "Soft-Touch Matte",
    offer: "20% Off",
    stockLeft: 15,
    visualType: "over-ear",
    defaultColor: "#38BDF8",
    colors: [
      { name: "Sky Cyan", hex: "#38BDF8", secondaryHex: "#BAE6FD" },
      { name: "Mint", hex: "#34D399", secondaryHex: "#A7F3D0" },
    ],
    specs: {
      general: {
        Brand: "Mpow",
        Model: "Mpow CH6 Studio",
        Price: "₹2,499",
        "Release Date": "April 2024",
        "Model Number": "MP-CH6",
        "Headphone Type": "Over-Ear",
        Connectivity: "Wireless / Wired",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "Dynamic",
        "Driver Size (mm)": "40",
        "Number of Drivers": "2",
        "Water Resistant": "No",
        "Weight (g)": "210 gm",
        "Battery Life (Hrs)": "30",
      },
    },
  },
  {
    id: "taotronics-earbuds",
    slug: "taotronics-earbuds",
    name: "TaoTronics Earbuds",
    brand: "TaoTronics",
    price: 2999,
    shortDesc: "Organic Cotton, fairtrade certified",
    description:
      "Compact stem-style wireless earbuds with single-step pairing and balanced acoustic tuning.",
    rating: 4.2,
    reviews: 1433,
    addedAt: "2026-08-05",
    category: "Headphones",
    headphoneType: "In-Ear",
    material: "Matte Polymer",
    offer: "50% Off",
    stockLeft: 25,
    visualType: "earbuds-case",
    defaultColor: "#111827",
    colors: [{ name: "Jet Black", hex: "#111827", secondaryHex: "#374151" }],
    specs: {
      general: {
        Brand: "TaoTronics",
        Model: "SoundLiberty 79",
        Price: "₹2,999",
        "Release Date": "August 2023",
        "Model Number": "TT-BH079",
        "Headphone Type": "In-Ear",
        Connectivity: "Wireless",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "PEEK + PU",
        "Driver Size (mm)": "6",
        "Number of Drivers": "2",
        "Water Resistant": "Yes (IPX7)",
        "Weight (g)": "45 gm",
        "Battery Life (Hrs)": "28",
      },
    },
  },
  {
    id: "soundpeats-aptx",
    slug: "soundpeats-aptx",
    name: "SoundPEATS APTX",
    brand: "SoundPEATS",
    price: 3999,
    shortDesc: "IPX8 Water Cancelling Bluetooth Headphones",
    description:
      "Qualcomm aptX Adaptive wireless earbuds inside a brushed gunmetal charging case.",
    rating: 4.6,
    reviews: 742,
    addedAt: "2026-05-29",
    category: "Headphones",
    headphoneType: "In-Ear",
    material: "Brushed Aluminum",
    offer: "Free Shipping",
    stockLeft: 10,
    visualType: "earbuds-case",
    defaultColor: "#475569",
    colors: [{ name: "Gunmetal", hex: "#475569", secondaryHex: "#94A3B8" }],
    specs: {
      general: {
        Brand: "SoundPEATS",
        Model: "Sonic Pro aptX",
        Price: "₹3,999",
        "Release Date": "January 2024",
        "Model Number": "SP-APTX-169",
        "Headphone Type": "In-Ear",
        Connectivity: "Bluetooth 5.2",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "Balanced Armature",
        "Driver Size (mm)": "10",
        "Number of Drivers": "4",
        "Water Resistant": "Yes (IPX8)",
        "Weight (g)": "54 gm",
        "Battery Life (Hrs)": "35",
      },
    },
  },
  {
    id: "beats-solo3",
    slug: "beats-solo3",
    name: "Beats Solo3",
    brand: "Beats",
    price: 15900,
    shortDesc: "Beats Solo3 Wireless Headphones - Rose Gold",
    description:
      "Apple W1 chip powered wireless on-ear headphones with up to 40 hours of battery life and Fast Fuel charging.",
    rating: 4.7,
    reviews: 5120,
    addedAt: "2026-01-15",
    category: "Headphones",
    headphoneType: "On-Ear",
    material: "Brushed Alloy",
    offer: "20% Off",
    stockLeft: 8,
    visualType: "over-ear",
    defaultColor: "#E8B4B8",
    colors: [
      { name: "Rose Gold", hex: "#E8B4B8", secondaryHex: "#F7DCDE" },
      { name: "Matte Black", hex: "#1F2937", secondaryHex: "#4B5563" },
    ],
    specs: {
      general: {
        Brand: "Beats",
        Model: "Beats Solo3 Wireless",
        Price: "₹15,900",
        "Release Date": "May 2023",
        "Model Number": "MX442LL/A",
        "Headphone Type": "On-Ear",
        Connectivity: "Wireless",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "Dynamic",
        "Driver Size (mm)": "40",
        "Number of Drivers": "2",
        "Water Resistant": "No",
        "Weight (g)": "215 gm",
        "Battery Life (Hrs)": "40",
      },
    },
  },
  {
    id: "joly-comb-bluetooth",
    slug: "joly-comb-bluetooth",
    name: "Joly Comb Bluetooth",
    brand: "Joly Comb",
    price: 1999,
    shortDesc: "Headphones with RGB Light Earcup",
    description:
      "Dual-mode wireless studio headphones with subtle ambient earcup illumination and ultra-low latency.",
    rating: 4.0,
    reviews: 389,
    addedAt: "2026-11-02",
    category: "Headphones",
    headphoneType: "Over-Ear",
    material: "Protein Leather",
    offer: "New Arrival",
    stockLeft: 6,
    visualType: "over-ear",
    defaultColor: "#334155",
    colors: [{ name: "Slate Blue", hex: "#334155", secondaryHex: "#64748B" }],
    specs: {
      general: {
        Brand: "Joly Comb",
        Model: "JC Pro RGB",
        Price: "₹1,999",
        "Release Date": "July 2024",
        "Model Number": "JC-RGB-569",
        "Headphone Type": "Over-Ear",
        Connectivity: "Wireless",
      },
      details: {
        Microphone: "Yes",
        "Driver Type": "Dynamic",
        "Driver Size (mm)": "50",
        "Number of Drivers": "2",
        "Water Resistant": "No",
        "Weight (g)": "295 gm",
        "Battery Life (Hrs)": "26",
      },
    },
  },
];

export const WEEKLY_POPULAR_PRODUCTS: Product[] = [
  {
    id: "gaming-headphone",
    slug: "gaming-headphone",
    name: "Gaming Headphone",
    brand: "Razer",
    price: 12999,
    shortDesc: "Table with air purifier, stained veneer/black",
    description:
      "7.1 surround sound gaming headset with breathable cooling-gel ear cushions and detachable cardioid mic.",
    rating: 4.5,
    reviews: 2675,
    addedAt: "2026-10-21",
    category: "Tech",
    headphoneType: "Over-Ear",
    visualType: "gaming-headset",
    defaultColor: "#22C55E",
    colors: [
      { name: "Neon Green", hex: "#22C55E", secondaryHex: "#1F2937" },
    ],
    specs: {
      general: {
        Brand: "Razer",
        Model: "Kraken Pro Wireless",
        Price: "₹12,999",
        "Release Date": "March 2024",
        "Model Number": "RZ-KP-239",
        "Headphone Type": "Over-Ear",
        Connectivity: "2.4GHz / Bluetooth",
      },
      details: {
        Microphone: "Detachable Boom",
        "Driver Type": "TriForce Titanium",
        "Driver Size (mm)": "50",
        "Number of Drivers": "2",
        "Water Resistant": "No",
        "Weight (g)": "320 gm",
        "Battery Life (Hrs)": "44",
      },
    },
  },
  {
    id: "macbook-pro-13",
    slug: "macbook-pro-13",
    name: 'Macbook pro 13"',
    brand: "Apple",
    price: 99900,
    shortDesc: "256, 8 core GPU, 8 GB",
    description:
      "Sleek 13-inch Retina laptop powered by next-gen silicon, all-day battery life, and studio-quality mics.",
    rating: 4.9,
    reviews: 6410,
    addedAt: "2026-03-30",
    category: "Tech",
    visualType: "laptop",
    defaultColor: "#CBD5E1",
    colors: [{ name: "Silver", hex: "#CBD5E1", secondaryHex: "#94A3B8" }],
    specs: {
      general: {
        Brand: "Apple",
        Model: 'MacBook Pro 13"',
        Price: "₹99,900",
        "Release Date": "June 2023",
        "Model Number": "MNEH3LL/A",
        Category: "Laptop",
        Connectivity: "Wi-Fi 6 / Thunderbolt",
      },
      details: {
        Processor: "8-Core CPU / 8-Core GPU",
        Memory: "8 GB Unified",
        Storage: "256 GB SSD",
        Display: '13.3" Retina',
        Weight: "1.4 kg",
        "Battery Life (Hrs)": "20",
      },
    },
  },
  {
    id: "homepod-mini",
    slug: "homepod-mini",
    name: "HomePod mini",
    brand: "Apple",
    price: 9900,
    shortDesc: "5 Colors Available",
    description:
      "Room-filling 360-degree computational audio in a compact woven-mesh smart speaker.",
    rating: 4.8,
    reviews: 8230,
    addedAt: "2026-09-25",
    category: "Tech",
    visualType: "smart-speaker",
    defaultColor: "#F97316",
    colors: [
      { name: "Orange", hex: "#F97316", secondaryHex: "#FDBA74" },
      { name: "White", hex: "#E5E7EB", secondaryHex: "#F9FAFB" },
      { name: "Space Gray", hex: "#374151", secondaryHex: "#6B7280" },
    ],
    specs: {
      general: {
        Brand: "Apple",
        Model: "HomePod mini",
        Price: "₹9,900",
        "Release Date": "November 2021",
        "Model Number": "MJ2D3LL/A",
        Category: "Smart Speaker",
        Connectivity: "Wi-Fi / Thread",
      },
      details: {
        Audio: "360-Degree Full-Range Driver",
        Microphones: "4 Far-Field Mics",
        Diameter: "97.9 mm",
        "Weight (g)": "345 gm",
      },
    },
  },
  {
    id: "laptop-sleeve-macbook",
    slug: "laptop-sleeve-macbook",
    name: "Laptop sleeve MacBook",
    brand: "Native Union",
    price: 1499,
    shortDesc: "Organic Cotton, fairtrade certified",
    description:
      "Minimalist quilted sleeve crafted from organic cotton canvas with soft microfiber lining and magnetic closure.",
    rating: 4.4,
    reviews: 1120,
    addedAt: "2026-06-08",
    category: "Tech",
    visualType: "laptop-sleeve",
    defaultColor: "#D4A373",
    colors: [{ name: "Kraft Tan", hex: "#D4A373", secondaryHex: "#FAEDCD" }],
    specs: {
      general: {
        Brand: "Native Union",
        Model: "Stow Sleeve 13-14",
        Price: "₹1,499",
        "Release Date": "April 2024",
        "Model Number": "NU-SLV-59",
        Category: "Accessories",
        Compatibility: '13" - 14" Laptops',
      },
      details: {
        Material: "Organic Cotton Canvas",
        Closure: "Magnetic Flap",
        "Water Resistant": "Yes",
        "Weight (g)": "220 gm",
      },
    },
  },
];

export const ALL_PRODUCTS: Product[] = [
  ...HEADPHONES_PRODUCTS,
  ...WEEKLY_POPULAR_PRODUCTS,
  ...MORE_PRODUCTS,
];

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}
