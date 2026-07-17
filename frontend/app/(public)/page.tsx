"use client";

import { motion } from "framer-motion";
import { Rocket, Code2, MonitorSmartphone, ArrowRight } from "lucide-react";
import Link from "next/link";

// Import semua komponen
import TechStack from "../components/TechStack";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import PortfolioShowcase from "../components/PortfolioShowcase";
import SaaSShowcase from "../components/SaaSShowcase";
import TestimonialSection from "../components/TestimonialSection";
import PricingSection from "../components/PricingSection";
import CTASection from "../components/CTASection";
import ContactSection from "../components/ContactSection";

export default function Home() {
  const scrollVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative pt-24 md:pt-32">
      {/* 1. HERO SECTION */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-center min-h-[75vh] px-4 w-full"
      >
        {/* Efek Glow */}
        <div className="absolute top-10 left-10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-10 right-10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none translate-x-1/2 translate-y-1/2" />

        <motion.div
          className="z-10 text-center flex flex-col items-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-md text-sm font-medium text-blue-400 shadow-sm">
              <Rocket className="w-4 h-4" />
              <span>Wujudkan Visi Digital Anda</span>
            </span>
          </motion.div>

          {/* Headline Utama */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-[1.1]"
          >
            Mengubah Setiap Ide Menjadi <br className="hidden md:block" />{" "}
            Aplikasi, Website & Inovasi.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Apapun skala dan kerumitan bisnis Anda, WebifyLab hadir untuk
            menerjemahkannya ke dalam wujud perangkat lunak berkinerja tinggi.
            Kami tidak sekadar merangkai kode, kami melahirkan inovasi nyata.
          </motion.p>

          {/* Tombol Aksi (CTA) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link href="#contact" className="w-full sm:w-auto">
              <button className="w-full group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
                <Rocket className="w-5 h-5" /> Mulai Inovasi Anda
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="#portfolio" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-all">
                <Code2 className="w-5 h-5 text-slate-300" /> Jelajahi Karya Kami
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Otoritas Teknologi */}
      <TechStack />

      {/* 3. Proposisi Nilai */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariant}
      >
        <AboutSection />
      </motion.div>

      {/* 4. Keahlian & Fitur */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariant}
      >
        <ServicesSection />
      </motion.div>

      {/* 5. Bukti Hasil 1: Portofolio Klien (Pindah ke atas) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariant}
      >
        <PortfolioShowcase />
      </motion.div>

      {/* 6. Bukti Hasil 2: Etalase SaaS (Pindah ke atas) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariant}
      >
        <SaaSShowcase />
      </motion.div>

      {/* 7. Validasi: Testimoni */}
      <TestimonialSection />

      {/* 8. Penawaran Harga: Pricing (Turun ke bawah setelah bukti) */}
      <PricingSection />

      {/* 9. Dorongan Akhir: CTA */}
      <CTASection />

      {/* 10. Konversi: Form Kontak */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariant}
      >
        <ContactSection />
      </motion.div>
    </main>
  );
}
