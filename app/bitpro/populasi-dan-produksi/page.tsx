'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

/* ─────────────────────────────────────────────
   KOMPONEN TOMBOL 3D (REUSABLE)
───────────────────────────────────────────── */
function YearCard({
  href,
  title,
  theme,
}: {
  href: string;
  title: string;
  theme: 'emerald' | 'blue';
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setTilt({ x: -dy * 15, y: dx * 15 });
  };

  const themeClasses =
    theme === 'emerald'
      ? 'bg-emerald-800/40 border-emerald-500/30 hover:bg-emerald-600/60 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
      : 'bg-blue-900/40 border-blue-500/30 hover:bg-blue-600/60 hover:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]';

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setTilt({ x: 0, y: 0 });
        setHovered(false);
      }}
      style={{
        transform: hovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-5px) scale(1.03)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        transition: hovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
      }}
      className={`relative group flex items-center justify-center p-6 rounded-2xl font-black text-xl text-white backdrop-blur-md border ${themeClasses}`}
    >
      <span className="drop-shadow-md">{title}</span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   HALAMAN UTAMA POPULASI & PRODUKSI
───────────────────────────────────────────── */
export default function PopulasiDanProduksi() {
  return (
    <div className="relative min-h-screen flex flex-col items-center pt-10 px-6 pb-16 font-sans text-gray-100 overflow-hidden bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#022c22]">
      {/* LATAR BELAKANG ESTETIK (Orbs) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* NAVIGASI ATAS */}
      <div className="relative z-10 w-full max-w-4xl flex justify-start mb-12">
        <Link
          href="/bitpro"
          className="bg-emerald-900/60 hover:bg-emerald-800 backdrop-blur-md px-6 py-2.5 rounded-full font-bold transition-all border border-emerald-500/30 shadow-md text-white flex items-center gap-2"
        >
          ← Kembali ke Modul Bitpro
        </Link>
      </div>

      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-xl tracking-tight">
          Pilih Kategori & Tahun Data
        </h1>
        <p className="text-emerald-200/70 mt-3 font-medium">
          Sistem Rekapitulasi Populasi dan Produksi Peternakan
        </p>
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-10">
        {/* =========================================
            BAGIAN ATAS: POPULASI TERNAK
        ========================================= */}
        <div className="bg-[#0b1c17]/60 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl border border-emerald-500/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />

          <div className="text-center mb-8">
            <span className="text-5xl block mb-4 drop-shadow-lg group-hover:scale-110 transition-transform">
              🐄
            </span>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
              Populasi Ternak
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <YearCard
              href="/bitpro/populasi-dan-produksi/2025"
              title="DATA POPULASI 2025"
              theme="emerald"
            />
            <YearCard
              href="/bitpro/populasi-dan-produksi/2026"
              title="DATA POPULASI 2026"
              theme="emerald"
            />
          </div>
        </div>

        {/* =========================================
            BAGIAN BAWAH: PRODUKSI TERNAK
        ========================================= */}
        <div className="bg-[#081824]/60 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl border border-blue-500/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />

          <div className="text-center mb-8">
            <span className="text-5xl block mb-4 drop-shadow-lg group-hover:scale-110 transition-transform">
              📈
            </span>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
              Produksi Ternak
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <YearCard
              href="/bitpro/populasi-dan-produksi/produksi-2025"
              title="DATA PRODUKSI 2025"
              theme="blue"
            />
            <YearCard
              href="/bitpro/populasi-dan-produksi/produksi-2026"
              title="DATA PRODUKSI 2026"
              theme="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
