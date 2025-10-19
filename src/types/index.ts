export interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
  order?: number;
  isFeatured?: boolean;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  category: string; // Dynamic category slug
  material?: string;
  inStock: boolean;
  quantityInStock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  popularityScore?: number;
  images: (string | ProductImage)[]; // Can be string URLs or image objects
  rating?: number;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface SiteSettings {
  promotionalMessage: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    pinterest?: string;
    twitter?: string;
  };
}

export interface StoreData {
  products: Product[];
  categories: Category[];
  siteSettings: SiteSettings;
}

export interface FilterOptions {
  category: string;
  priceRange: [number, number] | null;
  availability: "all" | "inStock" | "outOfStock";
  showDiscounted: boolean;
  showNew: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export type SortType =
  | "popularity"
  | "price-low-high"
  | "price-high-low"
  | "newest";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}
