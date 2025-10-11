import { Badge } from "@/components/ui/Badge";
import { Product } from "@/types";

interface ProductBadgeProps {
  product: Product;
}

export function ProductBadge({ product }: ProductBadgeProps) {
  return (
    <div className="flex gap-2">
      {product.isNew && <Badge variant="success">New</Badge>}
      {product.discountPrice && (
        <Badge variant="danger">-{product.discount}% OFF</Badge>
      )}
      {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
      {product.isFeatured && <Badge variant="primary">Featured</Badge>}
    </div>
  );
}
