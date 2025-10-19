"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          // Filter out "all" category if it exists
          const filtered = data.categories.filter(
            (cat: Category) => cat.slug !== "all"
          );
          setCategories(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 container mx-auto px-4">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-secondary rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          Shop by Category
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our carefully curated collections of fine jewelry
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={itemVariants}>
            <Link
              href={`/products?category=${category.slug}`}
              className="category-card block relative h-80 rounded-2xl overflow-hidden group"
            >
              <Image
                src={
                  category.image ||
                  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
                }
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <h3 className="text-2xl font-serif font-bold mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
