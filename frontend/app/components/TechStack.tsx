"use client";

import { useEffect, useState } from "react";

interface Technology {
  id: number;
  name: string;
  icon_url: string;
}

export default function TechStack() {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/technologies")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTechs(data.data);
        }
      })
      .catch((err) => console.error("Gagal menarik data teknologi:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || techs.length === 0) return null;

  // SOLUSI: Perbanyak duplikasi agar layar terisi penuh tanpa putus.
  // Kita melipatgandakan array asli sebanyak 12 kali menggunakan flatMap.
  // Ini memastikan animasi translateX(-50%) akan selalu menemukan elemen tanpa ada ruang kosong.
  const duplicatedTechs = Array.from({ length: 12 }).flatMap(() => techs);

  return (
    <section className="py-16 border-y border-slate-800/50 bg-slate-950/30 relative">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-[0.2em]">
          Didukung oleh Teknologi Modern
        </h2>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />

        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {duplicatedTechs.map((tech, index) => (
            <div
              // Gunakan kombinasi ID dan indeks panjang untuk mencegah error unik key di React
              key={`${tech.id}-${index}`}
              className="flex items-center gap-3 px-6 py-3 mx-3 bg-slate-900/60 rounded-xl border border-slate-800/80 backdrop-blur-sm transition-colors hover:border-slate-700 hover:bg-slate-800/80 cursor-default"
            >
              {tech.icon_url && (
                <img
                  // DIUBAH: Membaca langsung string icon_url dari database tanpa prefiks lokal server
                  src={tech.icon_url}
                  alt={tech.name}
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    // Fallback pengaman jika URL gambar mati/rusak
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              {/* whitespace-nowrap ditambahkan agar teks tidak patah ke bawah */}
              <span className="text-slate-300 font-medium whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
