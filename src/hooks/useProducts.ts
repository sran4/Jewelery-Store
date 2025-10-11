"use client";

import { useState, useEffect, useMemo } from "react";
import { Product, FilterOptions, SortType } from "@/types";
import {
  filterProducts,
  sortProducts,
  searchProducts,
} from "@/lib/filterProducts";
import storeData from "@/data/products.json";

export function useProducts() {
  const [products] = useState<Product[]>(storeData.products as Product[]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    priceRange: null,
    availability: "all",
    showDiscounted: false,
    showNew: false,
  });
  const [sortType, setSortType] = useState<SortType>("popularity");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Apply search
    if (searchQuery) {
      result = searchProducts(result, searchQuery);
    }

    // Apply filters
    result = filterProducts(result, filters);

    // Apply sorting
    result = sortProducts(result, sortType);

    return result;
  }, [products, filters, sortType, searchQuery]);

  return {
    products: filteredAndSortedProducts,
    allProducts: products,
    filters,
    setFilters,
    sortType,
    setSortType,
    searchQuery,
    setSearchQuery,
  };
}

export function useProductById(id: string) {
  const product = storeData.products.find((p) => p.id === id) as Product | undefined;
  return product || null;
}

export function useFeaturedProducts(limit: number = 4) {
  const featured = (storeData.products as Product[])
    .filter((p) => p.isFeatured)
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, limit);

  return featured;
}

export function useSimilarProducts(
  productId: string,
  category: string,
  limit: number = 4
) {
  const similar = (storeData.products as Product[])
    .filter((p) => p.id !== productId && p.category === category)
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, limit);

  return similar;
}
