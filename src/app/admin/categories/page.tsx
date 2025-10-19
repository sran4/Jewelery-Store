"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface Category {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/admin/login";
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Upload image to Cloudinary via backend (no preset needed)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;

        // Use our backend upload endpoint (bypasses auth check for now)
        const uploadRes = await fetch("/api/upload/public", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64,
            folder: "categories",
          }),
        });

        const uploadData = await uploadRes.json();

        console.log('Upload response:', uploadData);

        if (uploadData.success && uploadData.url) {
          setFormData({ ...formData, image: uploadData.url });
          toast.success("Image uploaded successfully!");
        } else {
          const errorMsg = uploadData.error || "Unknown error";
          console.error('Upload failed:', errorMsg);
          toast.error(`Upload failed: ${errorMsg}`);
        }
        setUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
        setUploading(false);
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload image");
      setUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    toast.success("Image removed");
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?admin=true");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : "/api/categories";

      const method = editingCategory ? "PUT" : "POST";

      // Ensure slug is generated if not provided
      const submitData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          editingCategory
            ? "Category updated successfully"
            : "Category created successfully"
        );
        setShowAddForm(false);
        setEditingCategory(null);
        setFormData({
          name: "",
          slug: "",
          image: "",
          description: "",
          isActive: true,
        });
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to save category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image || "",
      description: category.description || "",
      isActive: category.isActive,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      image: "",
      description: "",
      isActive: true,
    });
  };

  if (status === "loading") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage product categories</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        {showAddForm && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: editingCategory
                        ? formData.slug
                        : generateSlug(name),
                    });
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  required
                  placeholder="category-slug"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL-friendly version of the name (auto-generated)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Image
                </label>

                {formData.image ? (
                  <div className="space-y-2">
                    <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden bg-secondary">
                      <Image
                        src={formData.image}
                        alt="Category preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Remove Image
                      </Button>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={uploading}
                          className="flex items-center gap-2"
                          onClick={(e) => {
                            e.preventDefault();
                            (
                              e.currentTarget
                                .previousElementSibling as HTMLInputElement
                            )?.click();
                          }}
                        >
                          <Upload className="w-4 h-4" />
                          {uploading ? "Uploading..." : "Change Image"}
                        </Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary hover:bg-secondary/50 transition-all">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                          {uploading ? "Uploading..." : "Click to upload image"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WebP up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  Optional: Upload a category image or leave empty
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md bg-background h-20"
                  placeholder="Optional: Describe this category"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingCategory ? "Update" : "Create"} Category
                </Button>
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No categories yet</p>
              <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Slug</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-border hover:bg-secondary/50"
                    >
                      <td className="px-4 py-3">
                        {category.image ? (
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-secondary">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{category.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-sm bg-secondary px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-muted-foreground max-w-xs truncate">
                          {category.description || "No description"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            category.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-muted-foreground">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(category._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

