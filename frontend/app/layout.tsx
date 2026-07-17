import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "WebifyLab - Hub Inovasi Teknologi & Portofolio",
  description: "Platform CMS Portal Software Agency & Inkubasi Produk SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth scroll-pt-28">
      <body
        className={`${jakartaSans.variable} font-sans antialiased bg-slate-950 overflow-x-hidden`}
      >
        {/* Navbar dan Footer dihapus dari sini agar tidak muncul di halaman Admin */}
        {children}
      </body>
    </html>
  );
}
