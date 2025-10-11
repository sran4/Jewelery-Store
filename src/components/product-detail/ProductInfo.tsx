"use client";

import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Star, Package, Shield, Truck, Heart } from "lucide-react";
import { ShareButtons } from "./ShareButtons";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        {product.isNew && <Badge variant="success">New</Badge>}
        {hasDiscount && <Badge variant="danger">-{product.discount}%</Badge>}
        {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
        {product.isFeatured && <Badge variant="primary">Featured</Badge>}
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-serif font-bold">
        {product.title}
      </h1>

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating!)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} out of 5
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-bold text-primary">
          {formatPrice(displayPrice)}
        </span>
        {hasDiscount && (
          <span className="text-2xl text-muted-foreground line-through">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-lg text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      {/* Product Details */}
      <div className="space-y-3 p-6 bg-secondary/30 rounded-xl">
        {product.material && (
          <div className="flex justify-between">
            <span className="font-medium">Material:</span>
            <span className="text-muted-foreground">{product.material}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-medium">SKU:</span>
          <span className="text-muted-foreground">{product.sku}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Availability:</span>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span
              className={product.inStock ? "text-green-600" : "text-red-600"}
            >
              {product.inStock
                ? `${product.quantityInStock} in stock`
                : "Out of stock"}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Category:</span>
          <span className="text-muted-foreground capitalize">
            {product.category}
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <Button size="lg" disabled={!product.inStock} className="flex-1">
          {product.inStock ? "Contact to Purchase" : "Out of Stock"}
        </Button>
        <Button size="lg" variant="outline" className="aspect-square p-0">
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Share */}
      <ShareButtons product={product} />

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Authentic</p>
            <p className="text-xs text-muted-foreground">Certified</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Free Shipping</p>
            <p className="text-xs text-muted-foreground">Insured</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Gift Packaging</p>
            <p className="text-xs text-muted-foreground">Complimentary</p>
          </div>
        </div>
      </div>
    </div>
  );
}
