import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionalBar } from "@/components/layout/PromotionalBar";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryCards } from "@/components/home/CategoryCards";
import { PopularProducts } from "@/components/home/PopularProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <PromotionalBar />
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <CategoryCards />
        <PopularProducts />
        <WhyChooseUs />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
