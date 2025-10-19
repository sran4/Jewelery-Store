"use client";

import { Shield, Truck, Award, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    description:
      "Every piece comes with a certificate of authenticity and lifetime warranty.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Crafted with the finest materials and attention to detail by master artisans.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description:
      "Complimentary insured shipping on all orders with secure packaging.",
  },
  {
    icon: HeartHandshake,
    title: "Expert Support",
    description:
      "Our jewelry experts are here to help you find the perfect piece.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience premium jewelry shopping with confidence and peace of
            mind
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
