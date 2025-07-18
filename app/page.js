import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const LandingPage = () => {
  const { scrollY } = useScroll();

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerVariants = {
    visible: { transition: { staggerChildren: 0.2 } },
  };

  // Parallax effect for background elements
  const yBackground = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBackground }}
      >
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </motion.div>

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-24 bg-blue-50 relative z-10">
        <motion.div
          className="container mx-auto px-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-10"
            variants={staggerVariants}
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={cardVariants}
              >
                <div className="text-5xl font-bold text-blue-600 mb-3">{stat.value}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10">
        <motion.div
          className="container mx-auto px-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            variants={sectionVariants}
          >
            Everything You Need to Manage Your Finances
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={staggerVariants}
          >
            {featuresData.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="group"
                  variants={cardVariants}
                >
                  <Card className="p-6 bg-white hover:bg-blue-50 transition-colors duration-300 rounded-xl shadow-lg hover:shadow-xl">
                    <CardContent className="space-y-6 pt-6">
                      <Icon className="h-12 w-12 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-blue-50 relative z-10">
        <motion.div
          className="container mx-auto px-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-extrabold text-center mb-20 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            variants={sectionVariants}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerVariants}
          >
            {howItWorksData.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  variants={cardVariants}
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 transform group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative z-10">
        <motion.div
          className="container mx-auto px-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-extrabold text-center mb-20 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            variants={sectionVariants}
          >
            What Our Users Say
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={staggerVariants}
          >
            {testimonialsData.map((testimonial, index) => (
              <motion.div
                key={index}
                className="group"
                variants={cardVariants}
              >
                <Card className="p-6 bg-white hover:bg-gray-50 transition-colors duration-300 rounded-xl shadow-lg hover:shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-6">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full border-2 border-blue-100"
                      />
                      <div className="ml-6">
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative z-10">
        <motion.div
          className="container mx-auto px-4 text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-extrabold text-white mb-6"
            variants={sectionVariants}
          >
            Ready to Take Control of Your Finances?
          </motion.h2>
          <motion.p
            className="text-blue-100 mb-10 max-w-3xl mx-auto text-lg"
            variants={sectionVariants}
          >
            Join thousands of users who are already managing their finances smarter with FinEase.
          </motion.p>
          <motion.div variants={sectionVariants}>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
              >
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;