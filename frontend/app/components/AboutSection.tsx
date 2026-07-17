"use client";

import { motion } from "framer-motion";
import { Code2, Layers, Cpu, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 bg-slate-950 relative border-t border-slate-900/50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">
            DNA Inovasi
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Mesin Penggerak{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Transformasi Digital.
            </span>
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            Kami lebih dari sekadar <i>software agency</i>. WebifyLab adalah
            inkubator teknologi tempat ide bisnis Anda direkayasa menjadi
            aplikasi, situs web, dan ekosistem digital berskala{" "}
            <i>enterprise</i>. Tanpa kompromi pada performa.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Main Focus (Span 2 Columns) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-8 flex flex-col justify-between group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20 transition-opacity group-hover:opacity-100 opacity-50" />
            <div className="relative z-10 mb-12">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">
                Arsitektur Berkelanjutan
              </h4>
              <p className="text-slate-400 leading-relaxed max-w-md">
                Inovasi tidak boleh terhenti oleh batasan teknis. Penerapan{" "}
                <i>Clean Architecture</i> kami memastikan setiap aplikasi atau{" "}
                <i>website</i> yang dibangun hari ini, siap diekspansi untuk
                jutaan pengguna di masa depan.
              </p>
            </div>
            {/* Dekorasi Visual Kode */}
            <div className="relative z-10 w-full h-24 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-sm text-slate-500 flex items-center overflow-hidden">
              <span className="text-emerald-400">func</span>{" "}
              <span className="text-blue-400 ml-2">NewInnovation</span>(idea
              Concept) Product {"{"} ... {"}"}
            </div>
          </motion.div>

          {/* Card 2: Performance */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-8 flex flex-col group"
          >
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] transition-opacity group-hover:opacity-100 opacity-50" />
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 relative z-10">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3 relative z-10">
              Eksekusi Kinerja Tinggi
            </h4>
            <p className="text-slate-400 leading-relaxed text-sm relative z-10">
              Mengubah gagasan besar menjadi sistem nyata membutuhkan mesin yang
              kuat. Kami mengoptimalkan basis data dan API agar respons aplikasi
              Anda berada di bawah hitungan milidetik.
            </p>
          </motion.div>

          {/* Card 3: UI/UX Mindset */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-8 flex flex-col group"
          >
            <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
              <Code2 className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">
              Fokus Pada Pengguna
            </h4>
            <p className="text-slate-400 leading-relaxed text-sm">
              Sebuah inovasi hanya akan berhasil jika mudah digunakan. Kami
              merancang antarmuka reaktif (UI/UX) yang menghadirkan pengalaman
              super mulus pada setiap sentuhan layar.
            </p>
          </motion.div>

          {/* Card 4: Security (Span 2 Columns) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-8 flex items-center gap-8 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-16 h-16 bg-rose-500/20 border border-rose-500/30 rounded-2xl flex shrink-0 items-center justify-center text-rose-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">
                Keamanan Skala Enterprise
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ide revolusioner Anda berhak mendapatkan perlindungan terbaik.
                Setiap baris kode dilindungi oleh kriptografi modern dan
                otentikasi JWT untuk menjaga kerahasiaan data bisnis Anda.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
