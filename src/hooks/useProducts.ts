"use client";

import { useState, useEffect, useMemo } from "react";
import { Product, FilterOptions, SortType } from "@/types";
import {
  filterProducts,
  sortProducts,
  searchProducts,
} from "@/lib/filterProducts";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    priceRange: null,
    availability: "all",
    showDiscounted: false,
    showNew: false,
  });
  const [sortType, setSortType] = useState<SortType>("popularity");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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
    loading,
  };
}

export function useProductById(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  return { product, loading };
}

export function useFeaturedProducts(limit: number = 4) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(`/api/products?featured=true`);
        const data = await res.json();
        if (data.success) {
          const featured = data.products
            .sort(
              (a: Product, b: Product) =>
                (b.popularityScore || 0) - (a.popularityScore || 0)
            )
            .slice(0, limit);
          setProducts(featured);
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, [limit]);

  return { products, loading };
}

export function useSimilarProducts(
  productId: string,
  category: string,
  limit: number = 4
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilar() {
      try {
        const res = await fetch(`/api/products?category=${category}`);
        const data = await res.json();
        if (data.success) {
          const similar = data.products
            .filter((p: Product) => p.id !== productId)
            .sort(
              (a: Product, b: Product) =>
                (b.popularityScore || 0) - (a.popularityScore || 0)
            )
            .slice(0, limit);
          setProducts(similar);
        }
      } catch (error) {
        console.error("Failed to fetch similar products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSimilar();
  }, [productId, category, limit]);

  return { products, loading };
}
