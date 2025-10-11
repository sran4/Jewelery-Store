import { Product, FilterOptions, SortType } from "@/types";

export function filterProducts(
  products: Product[],
  filters: FilterOptions
): Product[] {
  let filtered = [...products];

  // Filter by category
  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter(
      (product) => product.category === filters.category
    );
  }

  // Filter by price range
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter((product) => {
      const price = product.discountPrice || product.price;
      return price >= min && price <= max;
    });
  }

  // Filter by availability
  if (filters.availability !== "all") {
    if (filters.availability === "inStock") {
      filtered = filtered.filter((product) => product.inStock);
    } else if (filters.availability === "outOfStock") {
      filtered = filtered.filter((product) => !product.inStock);
    }
  }

  // Filter by discounted items
  if (filters.showDiscounted) {
    filtered = filtered.filter((product) => product.discountPrice);
  }

  // Filter by new items
  if (filters.showNew) {
    filtered = filtered.filter((product) => product.isNew);
  }

  return filtered;
}

export function sortProducts(
  products: Product[],
  sortType: SortType
): Product[] {
  const sorted = [...products];

  switch (sortType) {
    case "popularity":
      return sorted.sort(
        (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)
      );
    case "price-low-high":
      return sorted.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceA - priceB;
      });
    case "price-high-low":
      return sorted.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceB - priceA;
      });
    case "newest":
      return sorted.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });
    default:
      return sorted;
  }
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
