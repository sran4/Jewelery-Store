"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { Eye, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="product-card group bg-background rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          {/* Image */}
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.isNew && <Badge variant="success">New</Badge>}
            {hasDiscount && (
              <Badge variant="danger">-{product.discount}%</Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          {/* Quick View Button */}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5" />
            </button>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          )}
        </div>

        {product.material && (
          <p className="text-xs text-muted-foreground mt-2">
            {product.material}
          </p>
        )}
      </div>
    </motion.div>
  );
}
