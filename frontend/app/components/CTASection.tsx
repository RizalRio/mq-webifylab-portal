"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 bg-slate-950 relative px-6 border-t border-slate-900/50">
      <div className="max-w-6xl mx-auto p-12 md:p-20 bg-slate-900/40 border border-slate-800 rounded-[3rem] text-center relative overflow-hidden group">
        {/* Latar Belakang & Efek Interaktif */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5 mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-1000" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" /> Eksekusi Ide Anda
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight max-w-3xl leading-tight">
            Berhenti Berencana. <br className="hidden md:block" /> Mari Bangun
            Inovasi Anda.
          </h2>

          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Jangan biarkan ide revolusioner Anda hanya tertahan di atas kertas.
            Jadwalkan sesi konsultasi teknis gratis, dan mari rancang peta jalan
            untuk mewujudkannya menjadi produk digital yang nyata.
          </p>

          <Link
            href="#contact"
            className="group/btn inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Mulai Diskusi Proyek
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
