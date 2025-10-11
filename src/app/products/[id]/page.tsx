import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionalBar } from "@/components/layout/PromotionalBar";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { Breadcrumb } from "@/components/product-detail/Breadcrumb";
import { ImageGallery } from "@/components/product-detail/ImageGallery";
import { ProductInfo } from "@/components/product-detail/ProductInfo";
import { SimilarProducts } from "@/components/product-detail/SimilarProducts";
import storeData from "@/data/products.json";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = storeData.products.find((p) => p.id === id);

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

export async function generateStaticParams() {
  return storeData.products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = storeData.products.find((p) => p.id === id);

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
              images={product.images}
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
