"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderGit2 as Github,
  ExternalLink,
  Loader2,
  ImageIcon,
} from "lucide-react";

interface Technology {
  id: number;
  name: string;
}

interface MediaAsset {
  id: number;
  file_url: string;
}

interface Portfolio {
  id: number;
  title: string;
  description: string;
  client_name: string | null;
  project_url: string | null;
  technologies: Technology[];
  media_assets: MediaAsset[];
}

export default function PortfolioShowcase() {
  const [projects, setProjects] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/portfolios?page=1&limit=6&_t=${timestamp}`,
        );
        const jsonRes = await res.json();

        if (res.ok && jsonRes.status === "success") {
          setProjects(jsonRes.data?.data || []);
        }
      } catch (error) {
        console.error("Gagal menarik data portofolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 bg-slate-950 flex justify-center items-center border-t border-slate-900/50 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section
      id="portfolio"
      className="py-24 bg-slate-950 relative border-t border-slate-900/50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Jejak Inovasi
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Dari Konsep Menjadi <br /> Realitas Digital.
          </h3>
          <p className="text-slate-400 mt-4 max-w-xl leading-relaxed">
            Kumpulan mahakarya rekayasa kami. Bukti nyata bagaimana kami
            mengubah ide-ide ambisius menjadi ekosistem aplikasi dan website
            berskala enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const isFeatured = index % 3 === 0;

            const coverUrl =
              project.media_assets?.length > 0
                ? `http://localhost:8000${project.media_assets[project.media_assets.length - 1].file_url}`
                : null;

            return (
              <motion.div
                key={project.id}
                whileHover={{ y: -6 }}
                className={`group relative rounded-3xl overflow-hidden bg-slate-900/40 border border-slate-800 p-6 flex flex-col justify-between ${
                  isFeatured
                    ? "md:col-span-2 min-h-[450px]"
                    : "col-span-1 min-h-[450px]"
                }`}
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex flex-col h-full z-10 relative">
                  <div
                    className={`relative w-full rounded-2xl overflow-hidden mb-6 border border-slate-800/60 bg-slate-950 shrink-0 ${isFeatured ? "h-64" : "h-48"}`}
                  >
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-medium">
                          Tanpa Sampul
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-blue-400 rounded-full border border-slate-700/50 uppercase tracking-wider truncate max-w-[150px]">
                      {project.client_name || "Internal Project"}
                    </span>
                    <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <h4
                    className={`font-bold text-white tracking-tight mb-3 group-hover:text-blue-400 transition-colors ${isFeatured ? "text-2xl md:text-3xl" : "text-xl"}`}
                  >
                    {project.title}
                  </h4>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/60 mt-auto">
                    {project.technologies?.map((tech) => (
                      <span
                        key={tech.id}
                        className="text-xs font-medium px-2.5 py-1 bg-slate-950 text-slate-400 rounded-md border border-slate-900"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
