"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/products/ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function PopularProducts() {
  const { products: featuredProducts, loading } = useFeaturedProducts(4);

  if (loading) {
    return (
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-secondary rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-secondary rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-secondary rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          Most Popular
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our customers' favorite pieces, loved for their timeless beauty and
          exceptional quality
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {featuredProducts.map((product, index) => (
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

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link href="/products">
          <Button size="lg" variant="outline" className="group">
            View All Products
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
