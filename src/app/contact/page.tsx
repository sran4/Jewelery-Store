import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionalBar } from "@/components/layout/PromotionalBar";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with our team. We're here to help with any questions about our jewelry collection.",
};

export default function ContactPage() {
  return (
    <>
      <PromotionalBar />
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Section */}
          <div className="grid md:grid-cols-5 gap-12 max-w-6xl mx-auto">
            <div className="md:col-span-2">
              <ContactInfo />
            </div>
            <div className="md:col-span-3">
              <div className="bg-background border border-border rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-serif font-bold mb-6">
                  Send us a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
