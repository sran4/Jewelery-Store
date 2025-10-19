import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionalBar } from "@/components/layout/PromotionalBar";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { Breadcrumb } from "@/components/product-detail/Breadcrumb";
import { ImageGallery } from "@/components/product-detail/ImageGallery";
import { ProductInfo } from "@/components/product-detail/ProductInfo";
import { SimilarProducts } from "@/components/product-detail/SimilarProducts";
import { getAllImageUrls } from "@/lib/imageUtils";
import { Product } from "@/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    // Direct database access on server-side (no HTTP fetch needed)
    const connectDB = (await import("@/lib/db/mongodb")).default;
    const Product = (await import("@/lib/models/Product")).default;
    
    await connectDB();
    const product = await Product.findOne({ id }).lean();
    
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.images[0]],
      type: "website",
    },
  };
}

// Static generation disabled - products are dynamic
// export async function generateStaticParams() {
//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//     const res = await fetch(`${baseUrl}/api/products`);
//     const data = await res.json();
//     if (data.success) {
//       return data.products.map((product: Product) => ({
//         id: product.id,
//       }));
//     }
//   } catch (error) {
//     console.error("Failed to generate static params:", error);
//   }
//   return [];
// }

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    {
      label:
        product.category.charAt(0).toUpperCase() + product.category.slice(1),
      href: `/products?category=${product.category}`,
    },
    { label: product.title, href: `/products/${product.id}` },
  ];

  return (
    <>
      <PromotionalBar />
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <ImageGallery
              images={getAllImageUrls(product.images as any)}
              productTitle={product.title}
            />
            <ProductInfo product={product} />
          </div>

          <SimilarProducts productId={product.id} category={product.category} />
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
