import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionalBar } from "@/components/layout/PromotionalBar";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { SocialMediaIcons } from "@/components/common/SocialMediaIcons";
import { Award, Heart, Shield, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about our story, values, and commitment to providing exquisite jewelry pieces.",
};

const values = [
  {
    icon: Sparkles,
    title: "Craftsmanship",
    description:
      "Every piece is meticulously crafted by master artisans with decades of experience.",
  },
  {
    icon: Shield,
    title: "Authenticity",
    description:
      "We guarantee the authenticity of every piece with certified documentation.",
  },
  {
    icon: Heart,
    title: "Customer Care",
    description:
      "Your satisfaction is our priority. We're here to help you find the perfect piece.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We maintain the highest standards in quality, design, and customer service.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PromotionalBar />
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Crafting timeless beauty and elegance since our inception
            </p>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-lg leading-relaxed mb-6">
                Welcome to Shergill Official, where passion meets craftsmanship.
                Our journey began with a simple belief: that jewelry is more
                than just an accessory—it's a reflection of your unique story,
                your milestones, and your most precious moments.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                For years, we've been dedicated to sourcing the finest materials
                and working with master artisans who share our commitment to
                excellence. Each piece in our collection is carefully selected
                or crafted to meet the highest standards of quality and beauty.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Our collection features stunning rings, elegant necklaces,
                sophisticated bracelets, and exquisite earrings—each designed to
                celebrate life's special moments. Whether you're looking for the
                perfect engagement ring, a meaningful gift, or a piece to treat
                yourself, we're here to help you find something truly
                extraordinary.
              </p>
              <p className="text-lg leading-relaxed">
                We believe that luxury should be accessible, and that every
                customer deserves an exceptional shopping experience. That's why
                we combine traditional craftsmanship with modern convenience,
                bringing you the finest jewelry with unparalleled service.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mission Section */}
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To provide our customers with exceptional jewelry pieces that
              celebrate life's most beautiful moments, while maintaining the
              highest standards of quality, authenticity, and customer service.
              We strive to make luxury accessible and to build lasting
              relationships with every customer who walks through our
              doors—virtual or otherwise.
            </p>
          </div>

          {/* Social Media Section */}
          <div className="mt-20 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Connect With Us
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Follow us on social media to stay updated with our latest
              collections, exclusive offers, and jewelry inspiration.
            </p>
            <div className="flex justify-center">
              <SocialMediaIcons size="lg" showTitle={false} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
