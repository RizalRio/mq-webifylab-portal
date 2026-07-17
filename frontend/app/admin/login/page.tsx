"use client";

import { useState } from "react";
import { Terminal, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Inisialisasi router Next.js untuk pengalihan halaman
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Sesuaikan URL ini dengan endpoint Login Golang Gin milikmu
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Asumsi backend mengembalikan token di: data.data.token
        const token = data.data.token;

        // Simpan JWT ke dalam Cookies (berlaku 1 hari)
        Cookies.set("admin_token", token, { expires: 1, path: "/" });

        // Redirect ke halaman Dashboard
        router.push("/admin/dashboard");
      } else {
        // Tampilkan pesan error dari backend jika kredensial salah
        setErrorMsg(
          data.message || "Kredensial tidak valid. Silakan coba lagi.",
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(
        "Gagal terhubung ke server. Pastikan backend Golang sedang berjalan.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-6 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-lg shadow-blue-900/20">
              <Terminal className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Webify
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Lab
              </span>
            </span>
          </Link>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Portal Eksekutif
            </h1>
            <p className="text-sm text-slate-400">
              Silakan otentikasi identitas Anda untuk mengakses ruang kendali
              sistem.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center font-medium animate-in fade-in duration-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Akses
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                  placeholder="admin@webifylab.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg shadow-blue-500/20 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Otorisasi Masuk{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
