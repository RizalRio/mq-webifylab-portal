"use client";

import { useState, useEffect } from "react";
import { Menu, X, Terminal, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "#home" },
    { name: "Layanan", href: "#services" },
    { name: "Portofolio", href: "#portfolio" },
    { name: "SaaS", href: "#saas" },
    { name: "Harga", href: "#pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-950/70 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl shadow-blue-900/10"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Premium */}
        <Link href="#home" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
            <Terminal className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Webify
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Lab
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors relative group py-2"
            >
              {link.name}
              {/* Animasi Garis Bawah */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
            </a>
          ))}
        </div>

        {/* CTA & Admin Portal (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="http://localhost:3000/admin/login"
            className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            Portal Admin
          </a>
          <a
            href="#contact"
            className="group flex items-center gap-2 text-sm font-bold px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          >
            Mulai Diskusi{" "}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 md:hidden text-slate-300 hover:text-white bg-slate-900/50 border border-slate-800 rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown (Glassmorphism) */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col gap-4 md:hidden shadow-2xl origin-top animate-in fade-in zoom-in-95 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-300 hover:text-white transition-colors py-2 px-4 hover:bg-slate-800/50 rounded-xl"
            >
              {link.name}
            </a>
          ))}
          <div className="h-px bg-white/5 my-2" />
          <div className="flex flex-col gap-3">
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-sm font-bold px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white text-center shadow-lg shadow-blue-500/25"
            >
              Mulai Diskusi <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="http://localhost:3000/admin/login"
              className="flex items-center justify-center text-xs font-bold px-4 py-4 bg-slate-950 border border-white/5 rounded-xl text-slate-400 text-center uppercase tracking-wider"
            >
              Masuk Portal Admin
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
