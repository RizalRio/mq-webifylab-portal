"use client";

import { Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Andi Wijaya",
      role: "CEO Maju Jaya",
      text: "Arsitektur backend yang dibangun sangat solid. Request dari ribuan user tertangani tanpa lag sedikitpun.",
    },
    {
      name: "Siti Nurhaliza",
      role: "Product Manager",
      text: "Proses delivery aplikasi Flutter-nya sangat mulus, animasi UI terasa sangat native dan state management-nya rapi.",
    },
    {
      name: "Budi Santoso",
      role: "Direktur Operasional",
      text: "Sistem Pendukung Keputusan yang dibuat benar-benar mengubah cara kami menganalisis data perusahaan. Sangat akurat!",
    },
    {
      name: "Reza Rahadian",
      role: "CTO TechNova",
      text: "Kualitas kode yang dihasilkan WebifyLab sungguh di luar ekspektasi. Sangat clean dan mudah di-maintain oleh tim internal kami.",
    },
    {
      name: "Diana Putri",
      role: "Founder EduSaaS",
      text: "Inkubasi SaaS kami berjalan lancar. Proses dari tahap desain Figma hingga deployment ke production sangat profesional.",
    },
  ];

  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-900/50 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Bukti Kualitas
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Kepercayaan Klien Kami
          </h3>
        </div>

        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          <div className="flex -ml-6">
            {testimonials.map((testi, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6 min-w-0"
              >
                <div className="h-full group relative p-8 bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-sm flex flex-col justify-between hover:bg-slate-900/80 transition-colors duration-500 overflow-hidden">
                  {/* Subtle Top-Right Glow on Hover */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <Quote className="w-8 h-8 text-slate-700 group-hover:text-blue-500/50 transition-colors duration-500 mb-6" />
                    <p className="text-slate-300 italic mb-10 leading-relaxed text-sm md:text-base">
                      "{testi.text}"
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center gap-4 border-t border-slate-800/60 pt-6">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                      {testi.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {testi.name}
                      </h4>
                      <p className="text-xs text-slate-500 tracking-wider">
                        {testi.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
