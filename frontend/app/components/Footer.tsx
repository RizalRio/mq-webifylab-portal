"use client";

import { Terminal, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa6";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Premium Deep Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-blue-600/5 rounded-t-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Kolom 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="#home" className="flex items-center gap-3 group w-fit">
              <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl group-hover:border-blue-500/50 transition-all duration-300">
                <Terminal className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Webify
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Lab
                </span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Mengubah setiap gagasan menjadi aplikasi, website, dan inovasi
              nyata. Kami adalah mitra strategis Anda dalam merakit ekosistem
              digital skala enterprise yang tangguh di belakang layar dan
              memukau di genggaman.
            </p>

            {/* Interactive Social Icons */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="https://github.com/RizalRio"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900/50 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 group"
              >
                <FaGithub className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="https://www.linkedin.com/in/rizal-rio-andrian-b32929207"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900/50 border border-white/5 rounded-2xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 group"
              >
                <FaLinkedin className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="https://instagram.com/rzlrndrn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900/50 border border-white/5 rounded-2xl text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all duration-300 group"
              >
                <FaInstagram className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Layanan Teknis */}
          <div className="lg:col-span-3 lg:col-start-6">
            <h4 className="text-white font-bold mb-6 tracking-wide">
              Spesialisasi
            </h4>
            <ul className="space-y-4">
              {[
                "Backend & API (Golang)",
                "Mobile Ecosystem (Flutter)",
                "UI/UX & System Design",
                "Decision Support (AI/DSS)",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#services"
                    className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-500" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak Strategis */}
          <div className="lg:col-span-3 lg:col-start-10 space-y-6">
            <h4 className="text-white font-bold mb-6 tracking-wide">
              Jalur Eksekutif
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="p-2.5 bg-slate-900/50 border border-white/5 rounded-xl text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Email Resmi
                  </span>
                  <a
                    href="mailto:hello@webifylab.com"
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    hello@webifylab.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="p-2.5 bg-slate-900/50 border border-white/5 rounded-xl text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Telepon / WhatsApp
                  </span>
                  <a
                    href="https://wa.me/6289654404563"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="p-2.5 bg-slate-900/50 border border-white/5 rounded-xl text-rose-400 group-hover:bg-rose-500/10 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Basis Operasional
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    Jakarta Selatan, ID
                    <br />
                    Tech District 12040
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium text-slate-500">
            &copy; {currentYear} WebifyLab. Engineered for Innovation.
          </p>
          <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
