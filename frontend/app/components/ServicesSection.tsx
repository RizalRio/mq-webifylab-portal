"use client";

import { Server, Smartphone, PenTool, GitMerge } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      title: "Fondasi Sistem & API",
      description:
        "Jantung dari setiap aplikasi web dan mobile. Kami merancang arsitektur backend RESTful berkecepatan tinggi dengan Golang untuk menopang aliran data bisnis Anda tanpa henti.",
      icon: <Server className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-400",
      shadow: "group-hover:shadow-blue-500/20",
    },
    {
      title: "Aplikasi Mobile & Lintas Platform",
      description:
        "Bawa inovasi Anda langsung ke genggaman pengguna. Menggunakan ekosistem Flutter, kami menciptakan aplikasi mobile yang indah, cepat, dan bekerja sempurna di semua perangkat.",
      icon: <Smartphone className="w-8 h-8" />,
      color: "from-purple-500 to-pink-400",
      shadow: "group-hover:shadow-purple-500/20",
    },
    {
      title: "Desain Pengalaman & Prototipe",
      description:
        "Fase krusial sebelum baris kode ditulis. Mulai dari pemetaan arsitektur sistem (ERD) hingga merancang prototipe visual UI/UX yang memastikan produk Anda mencintai penggunanya.",
      icon: <PenTool className="w-8 h-8" />,
      color: "from-rose-500 to-orange-400",
      shadow: "group-hover:shadow-rose-500/20",
    },
    {
      title: "Inovasi AI & Sistem Cerdas",
      description:
        "Naikkan level perangkat lunak Anda. Kami mengintegrasikan kecerdasan buatan generatif (LLM) dan algoritma analitik (AHP) untuk menciptakan dasbor cerdas yang mampu berpikir otomatis.",
      icon: <GitMerge className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-400",
      shadow: "group-hover:shadow-emerald-500/20",
    },
  ];

  return (
    <section id="services" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">
              Katalisator Inovasi
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Merancang, Membangun, <br /> & Meluncurkan.
            </h3>
          </div>
          <p className="text-slate-400 max-w-md md:text-right">
            Dari sekadar konsep menjadi produk nyata. Kami menyediakan
            infrastruktur pengembangan <i>end-to-end</i> untuk mewujudkan
            inovasi digital perusahaan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative h-full p-[1px] rounded-3xl overflow-hidden bg-slate-800/50 hover:bg-gradient-to-br transition-all duration-500 ${service.shadow}`}
            >
              {/* Animated Gradient Border Layer */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Inner Card Content */}
              <div className="relative h-full bg-slate-950 p-8 rounded-[23px] flex flex-col transition-transform duration-500">
                <div className="mb-8">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-300 group-hover:scale-110 group-hover:text-white transition-all duration-500`}
                  >
                    {service.icon}
                  </div>
                </div>

                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-slate-400 transition-all duration-300">
                  {service.title}
                </h4>

                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {service.description}
                </p>

                {/* Subtle Arrow pointing top-right on hover */}
                <div className="mt-auto pt-8 flex justify-end overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
