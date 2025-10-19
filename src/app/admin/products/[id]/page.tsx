"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Star,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  category: string;
  material?: string;
  inStock: boolean;
  quantityInStock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  popularityScore?: number;
  rating?: number;
  images: Array<{
    url: string;
    publicId?: string;
    alt?: string;
    order?: number;
    isFeatured?: boolean;
  }>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductViewPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/admin/login";
    },
  });

  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
      } else {
        toast.error("Failed to fetch product");
        router.push("/admin/products");
      }
    } catch (error) {
      toast.error("An error occurred");
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product deleted successfully!");
        router.push("/admin/products");
      } else {
        toast.error(data.error || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Product not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                SKU: {product.sku}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/products/${productId}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2 flex-wrap">
          {product.inStock ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              In Stock ({product.quantityInStock})
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          )}
          {product.isNew && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              New
            </span>
          )}
          {product.isFeatured && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Featured
            </span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              {product.discount}% OFF
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Product Images
              </h2>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square border border-border rounded-lg overflow-hidden bg-secondary"
                    >
                      <Image
                        src={typeof image === "string" ? image : image.url}
                        alt={
                          typeof image === "object" && image.alt
                            ? image.alt
                            : product.title
                        }
                        fill
                        className="object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No images available
                </p>
              )}
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Details */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">{product.category}</p>
                </div>
                {product.material && (
                  <div>
                    <p className="text-sm text-muted-foreground">Material</p>
                    <p className="font-medium">{product.material}</p>
                  </div>
                )}
                {product.rating && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <p className="font-medium">{product.rating} / 5</p>
                    </div>
                  </div>
                )}
                {product.popularityScore !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Popularity Score
                    </p>
                    <p className="font-medium">
                      {product.popularityScore} / 100
                    </p>
                  </div>
                )}
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-foreground rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Regular Price</p>
                  <p className="text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                {product.discountPrice && product.discountPrice > 0 && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Discount Price
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        ${product.discountPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">You Save</p>
                      <p className="text-lg font-semibold text-orange-600">
                        ${(product.price - product.discountPrice).toFixed(2)} (
                        {product.discount}%)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Inventory
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Stock Status</p>
                  <p
                    className={`font-semibold ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-semibold">
                    {product.quantityInStock} units
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Metadata
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(product.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">
                    {new Date(product.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product ID</p>
                  <p className="text-xs font-mono bg-secondary px-2 py-1 rounded">
                    {product.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
