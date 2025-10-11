"use client";

import { useSimilarProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { motion } from "framer-motion";

interface SimilarProductsProps {
  productId: string;
  category: string;
}

export function SimilarProducts({ productId, category }: SimilarProductsProps) {
  const similarProducts = useSimilarProducts(productId, category, 4);

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center"
      >
        You May Also Like
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
