"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const imageRef = useRef(null);
  const sectionRef = useRef(null);

  // Parallax effect for image
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants for text and button
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Smarter Spending <br /> Starts with Intelligence
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          Transform your finances with AI-driven insights that empower you to track spending, optimize savings, and achieve smarter growth.
        </motion.p>

        <motion.div
          className="flex justify-center"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-10 py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-lg"
            >
              Get Started Now
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="hero-image-wrapper mt-12 md:mt-16"
          style={{ y }}
        >
          <div ref={imageRef} className="hero-image relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl transition-opacity duration-300 group-hover:opacity-80"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.8 }}
            />
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-xl shadow-2xl border-2 border-gray-200 mx-auto transform transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;