import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionalBar } from "@/components/layout/PromotionalBar";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using our website and services.",
};

export default function TermsPage() {
  return (
    <>
      <PromotionalBar />
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground">
                  By accessing and using this website, you accept and agree to
                  be bound by the terms and provisions of this agreement. If you
                  do not agree to these terms, please do not use this website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  2. Use of Website
                </h2>
                <p className="text-muted-foreground mb-4">
                  You agree to use this website only for lawful purposes and in
                  a way that does not infringe the rights of, restrict, or
                  inhibit anyone else's use and enjoyment of the website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  3. Product Information
                </h2>
                <p className="text-muted-foreground">
                  We strive to provide accurate product information. However, we
                  do not warrant that product descriptions, pricing, or other
                  content is accurate, complete, reliable, current, or
                  error-free.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  4. Intellectual Property
                </h2>
                <p className="text-muted-foreground">
                  All content on this website, including text, graphics, logos,
                  images, and software, is the property of LuxeJewels or its
                  content suppliers and is protected by intellectual property
                  laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  5. Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  To the fullest extent permitted by law, LuxeJewels shall not
                  be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of
                  or inability to use the website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  6. Product Authenticity
                </h2>
                <p className="text-muted-foreground">
                  All jewelry pieces sold through our website come with a
                  certificate of authenticity. We guarantee that all products
                  are genuine and meet the specifications described.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. User Conduct</h2>
                <p className="text-muted-foreground mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Use the website for any unlawful purpose</li>
                  <li>
                    Attempt to gain unauthorized access to any portion of the
                    website
                  </li>
                  <li>Interfere with or disrupt the website or servers</li>
                  <li>Transmit any viruses, malware, or harmful code</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  8. Links to Third-Party Sites
                </h2>
                <p className="text-muted-foreground">
                  Our website may contain links to third-party websites. We are
                  not responsible for the content or privacy practices of these
                  external sites.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  9. Modifications to Terms
                </h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Your
                  continued use of the website following any changes indicates
                  your acceptance of the new terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  10. Governing Law
                </h2>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance
                  with the laws of the jurisdiction in which our business
                  operates.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  11. Contact Information
                </h2>
                <p className="text-muted-foreground">
                  If you have any questions about these terms, please contact us
                  at:
                </p>
                <p className="text-muted-foreground mt-4">
                  Email: contact@luxuryjewelry.com
                  <br />
                  Phone: +1-234-567-8900
                  <br />
                  Address: 123 Luxury Street, New York, NY 10001
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
