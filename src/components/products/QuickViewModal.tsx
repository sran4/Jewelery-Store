"use client";

import { Product } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Star, Package } from "lucide-react";
import { useState } from "react";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-secondary/30">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-primary"
                    : "border-transparent hover:border-secondary"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex gap-2 mb-3">
            {product.isNew && <Badge variant="success">New</Badge>}
            {hasDiscount && (
              <Badge variant="danger">-{product.discount}%</Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          <h2 className="text-3xl font-serif font-bold mb-4">
            {product.title}
          </h2>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center gap-2 mb-4">
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
                ({product.rating})
              </span>
            </div>
          )}

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="space-y-3 mb-6">
            {product.material && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Material:</span>
                <span className="text-sm text-muted-foreground">
                  {product.material}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">SKU:</span>
              <span className="text-sm text-muted-foreground">
                {product.sku}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="text-sm">
                {product.inStock
                  ? `${product.quantityInStock} in stock`
                  : "Out of stock"}
              </span>
            </div>
          </div>

          <Link href={`/products/${product.id}`} onClick={onClose}>
            <Button className="w-full" size="lg">
              View Full Details
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
