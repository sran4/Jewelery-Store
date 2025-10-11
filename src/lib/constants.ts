import { SortOption } from "@/types";

export const SORT_OPTIONS: SortOption[] = [
  { value: "popularity", label: "Most Popular" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export const PRICE_RANGES = [
  { label: "All Prices", value: null },
  { label: "Under $500", value: [0, 500] },
  { label: "$500 - $1000", value: [500, 1000] },
  { label: "$1000 - $2000", value: [1000, 2000] },
  { label: "$2000 - $3000", value: [2000, 3000] },
  { label: "Over $3000", value: [3000, Infinity] },
];

export const INQUIRY_TYPES = [
  "General Inquiry",
  "Product Question",
  "Custom Order",
  "Repair Service",
  "Return/Exchange",
  "Other",
];

export const SITE_NAME = "Luxury Jewelry";
export const SITE_DESCRIPTION =
  "Discover exquisite jewelry pieces including rings, necklaces, bracelets, and earrings. Shop our curated collection of fine jewelry.";
export const SITE_URL = "https://luxuryjewelry.com";

export const DEFAULT_OG_IMAGE = "/images/og-image.jpg";
