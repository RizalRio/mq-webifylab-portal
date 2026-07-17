"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("http://localhost:8000/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sender_phone:
            formData.sender_phone === "" ? null : formData.sender_phone,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setStatus("success");
        setFormData({
          sender_name: "",
          sender_email: "",
          sender_phone: "",
          subject: "",
          message: "",
        });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Gagal mengirim pesan.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Koneksi server terputus.");
    }
  };

  return (
    <section
      id="contact"
      className="py-24 bg-slate-950 relative border-t border-slate-900/50"
    >
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Inisiasi Kolaborasi
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Mari Wujudkan Ide Anda
          </h3>
          <p className="text-slate-400">
            Ceritakan visi digital Anda. Tim insinyur kami siap membedah,
            merancang, dan membalas rencana eksekusi ide Anda dalam waktu kurang
            dari 24 jam.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 md:p-12 backdrop-blur-sm relative overflow-hidden shadow-2xl">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

          {status === "success" && (
            <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold">Transmisi Berhasil</h4>
                <p className="text-sm text-emerald-500/80 mt-1">
                  Visi Anda telah masuk ke dalam sistem kami. Tim kami akan
                  segera menghubungi Anda.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold">Transmisi Gagal</h4>
                <p className="text-sm text-rose-500/80 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 text-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  name="sender_email"
                  value={formData.sender_email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 text-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="sender_phone"
                  value={formData.sender_phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 text-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                  placeholder="+62 812..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Fokus Inovasi <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 text-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                  placeholder="Aplikasi Mobile / Sistem SaaS / Web App"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Detail Visi & Kebutuhan <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 text-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-y placeholder:text-slate-700"
                placeholder="Ceritakan masalah yang ingin Anda pecahkan atau inovasi yang ingin Anda bangun..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed ml-auto shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Mulai Kolaborasi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
