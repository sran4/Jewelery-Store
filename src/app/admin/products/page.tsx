"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2, Eye, Package, ExternalLink } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProductsListPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/admin/login";
    },
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const toggleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your jewelry catalog</p>
          </div>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm mb-2">
              {selectedProducts.length} product(s) selected
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Bulk Delete
              </Button>
              <Button size="sm" variant="outline">
                Apply Discount
              </Button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-background border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No products yet</p>
              <Link href="/admin/products/new">
                <Button className="mt-4">Add Your First Product</Button>
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={product.images[0]?.url || "/placeholder.png"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sku}
                      </p>
                    </td>
                    <td className="px-4 py-3 capitalize">{product.category}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">
                        {formatPrice(product.discountPrice || product.price)}
                      </p>
                      {product.discountPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.inStock
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {product.inStock
                          ? `${product.quantityInStock} in stock`
                          : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <button
                            className="p-2 hover:bg-secondary rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/products/${product.id}`} target="_blank">
                          <button
                            className="p-2 hover:bg-secondary rounded-lg"
                            title="View on Site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <button
                            className="p-2 hover:bg-secondary rounded-lg"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
