"use client";

import { useEffect, useState } from "react";
import { Box, Sparkles, ArrowRight, Loader2, ImageIcon } from "lucide-react";

interface MediaAsset {
  id: number;
  file_url: string;
}

interface SaaSProduct {
  id: number;
  name: string;
  tagline: string;
  description: string;
  subdomain_url: string;
  media_assets: MediaAsset[];
}

export default function SaaSShowcase() {
  const [saasProducts, setSaasProducts] = useState<SaaSProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const stylePalettes = [
    {
      color: "from-blue-600 to-indigo-500",
      glow: "group-hover:shadow-blue-500/10",
    },
    {
      color: "from-emerald-600 to-teal-500",
      glow: "group-hover:shadow-emerald-500/10",
    },
    {
      color: "from-purple-600 to-pink-500",
      glow: "group-hover:shadow-purple-500/10",
    },
    {
      color: "from-amber-500 to-orange-500",
      glow: "group-hover:shadow-amber-500/10",
    },
  ];

  useEffect(() => {
    const fetchSaaS = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/saas?page=1&limit=4&_t=${timestamp}`,
        );
        const jsonRes = await res.json();

        if (res.ok && jsonRes.status === "success") {
          setSaasProducts(jsonRes.data?.data || []);
        }
      } catch (error) {
        console.error("Gagal menarik data SaaS:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaaS();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 bg-slate-950 flex justify-center items-center border-t border-slate-900/50 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </section>
    );
  }

  if (saasProducts.length === 0) return null;

  return (
    <section
      id="saas"
      className="py-24 bg-slate-950 relative border-t border-slate-900/50"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold text-purple-500 uppercase tracking-widest mb-3">
            Inkubator Inovasi
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Ekosistem Produk SaaS Kami
          </h3>
          <p className="text-slate-400 text-base max-w-xl mx-auto mt-4">
            Inovasi tidak pernah berhenti. Selain mewujudkan visi klien,
            WebifyLab secara aktif merancang dan meluncurkan platform SaaS
            mandiri untuk memecahkan berbagai tantangan spesifik industri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {saasProducts.map((product, index) => {
            const style = stylePalettes[index % stylePalettes.length];

            const coverUrl =
              product.media_assets?.length > 0
                ? `${process.env.NEXT_PUBLIC_API_URL}${product.media_assets[product.media_assets.length - 1].file_url}`
                : null;

            return (
              <div
                key={product.id}
                className={`group relative p-[1px] rounded-3xl bg-slate-800/60 hover:bg-gradient-to-br transition-all duration-500 ${style.glow}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                />

                <div className="relative bg-slate-950 p-8 rounded-[23px] h-full flex flex-col justify-between z-10">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform duration-300">
                        <Box className="w-6 h-6" />
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-purple-950/40 text-purple-400 rounded-full border border-purple-900/40">
                        <Sparkles className="w-3 h-3 animate-pulse" />{" "}
                        {product.tagline}
                      </span>
                    </div>

                    <h4 className="text-2xl font-bold text-white mb-4 tracking-tight">
                      {product.name}
                    </h4>

                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 border border-slate-800/50 bg-slate-900 shrink-0">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        </div>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {product.description}
                    </p>
                  </div>

                  {product.subdomain_url && (
                    <a
                      href={product.subdomain_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white group/btn w-fit mt-auto relative z-20"
                    >
                      Jelajahi Solusi Ini
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
