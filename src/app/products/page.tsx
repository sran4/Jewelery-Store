"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionalBar } from "@/components/layout/PromotionalBar";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { useProducts } from "@/hooks/useProducts";
import { useState, useEffect, Suspense } from "react";
import { Product } from "@/types";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProductsContent() {
  const {
    products,
    filters,
    setFilters,
    sortType,
    setSortType,
    searchQuery,
    setSearchQuery,
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && category !== filters.category) {
      setFilters({ ...filters, category });
    }
  }, [searchParams]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <PromotionalBar />
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Our Collection
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our exquisite selection of fine jewelry
            </p>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>

              <ProductSort
                sortType={sortType}
                onSortChange={setSortType}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultCount={products.length}
              />

              <ProductGrid products={products} onQuickView={handleQuickView} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-background z-50 overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-2xl"
                >
                  ×
                </button>
              </div>
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      <Footer />
      <FloatingButtons />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
