"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";

export default function PricingSection() {
  const packages = [
    {
      name: "Pondasi Digital (API)",
      description:
        "Ubah alur data kompleks bisnis Anda menjadi RESTful API dan arsitektur backend berkinerja tinggi.",
      features: [
        "Arsitektur RESTful API (Golang)",
        "Optimasi Basis Data (PostgreSQL)",
        "Keamanan Akses (RBAC & JWT)",
        "Otomatisasi Tugas (Cron Jobs)",
      ],
      isPopular: false,
      color: "group-hover:border-slate-600",
    },
    {
      name: "Inovasi End-to-End",
      description:
        "Wujudkan ide Anda menjadi aplikasi mobile dan sistem web interaktif secara utuh dari nol hingga peluncuran.",
      features: [
        "Semua fitur Pondasi Digital (API)",
        "Aplikasi Mobile Lintas Platform (Flutter)",
        "Web Dashboard Interaktif (Next.js)",
        "Desain UI/UX & Prototipe (Figma)",
      ],
      isPopular: true,
      color: "border-blue-500/50 shadow-[0_0_40px_rgba(37,99,235,0.15)]",
    },
    {
      name: "Enterprise & AI Core",
      description:
        "Ekosistem digital cerdas berskala besar dengan integrasi kecerdasan buatan untuk otomatisasi maksimal.",
      features: [
        "Semua fitur Inovasi End-to-End",
        "Integrasi AI Generatif (LLM SDK)",
        "Sistem Pendukung Keputusan (AHP)",
        "Infrastruktur & Deployment Skala Besar",
      ],
      isPopular: false,
      color: "group-hover:border-slate-600",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 bg-slate-950 relative border-t border-slate-900/50"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Investasi Inovasi
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Pilih Rute Transformasi Anda
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800 backdrop-blur-sm transition-all duration-500 ${pkg.color} ${pkg.isPopular ? "md:-translate-y-4 md:py-12 bg-slate-900/80" : "hover:bg-slate-900/60 hover:-translate-y-2"}`}
            >
              {/* Efek Glow di dalam Card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[50px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-500/25">
                  <Star className="w-3 h-3 fill-white" /> Rekomendasi Utama
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-3">{pkg.name}</h3>
              <p className="text-slate-400 text-sm mb-8 pb-8 border-b border-slate-800/60 leading-relaxed">
                {pkg.description}
              </p>

              <ul className="space-y-4 mb-10 flex-1">
                {pkg.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300 ${pkg.isPopular ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 hover:bg-slate-700 text-white"}`}
              >
                {pkg.isPopular ? <Zap className="w-4 h-4" /> : null}
                Mulai Eksekusi Ide
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
