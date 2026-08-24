'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronRight, BarChart3, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

export default function PopulasiDanProduksiPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-azure selection:text-white pb-20">
      
      {/* ── TOP HEADER ── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/bitpro"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Kembali ke Bitpro"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Link href="/bitpro" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  Bitpro
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-azure">Populasi & Produksi</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Statistik Populasi dan Produksi Peternakan
              </h1>
            </div>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Pilih Kategori & Periode Laporan
          </h2>
          <p className="text-sm text-slate-600">
            Akses sensus rekapitulasi populasi 16 komoditas ternak atau laporan tonase produksi daging dan telur Kabupaten Kebumen.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SECTION 1: POPULASI */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-2xl">
                  🐄
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sensus Populasi
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Populasi Ternak Kabupaten
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Rangkuman jumlah ternak ruminansia besar, kecil, unggas, dan aneka ternak per desa dan kecamatan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/bitpro/populasi-dan-produksi/2025"
                className="group p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-azure hover:shadow-sm transition-all text-left flex flex-col justify-between min-h-[96px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">Tahun 2025</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-azure transition-colors" />
                </div>
                <span className="font-bold text-sm text-slate-900 group-hover:text-azure transition-colors">
                  Data Populasi 2025 →
                </span>
              </Link>

              <Link
                href="/bitpro/populasi-dan-produksi/2026"
                className="group p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-azure hover:shadow-sm transition-all text-left flex flex-col justify-between min-h-[96px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Tahun 2026 (Live)</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-azure transition-colors" />
                </div>
                <span className="font-bold text-sm text-slate-900 group-hover:text-azure transition-colors">
                  Data Populasi 2026 →
                </span>
              </Link>
            </div>
          </div>

          {/* SECTION 2: PRODUKSI */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-2xl">
                  📈
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Produksi Ternak
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Produksi Daging & Telur
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Rekapitulasi tonase produksi daging siap potong dan komoditas telur konsumsi per triwulan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/bitpro/populasi-dan-produksi/produksi-2025"
                className="group p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-azure hover:shadow-sm transition-all text-left flex flex-col justify-between min-h-[96px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">Tahun 2025</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-azure transition-colors" />
                </div>
                <span className="font-bold text-sm text-slate-900 group-hover:text-azure transition-colors">
                  Data Produksi 2025 →
                </span>
              </Link>

              <Link
                href="/bitpro/populasi-dan-produksi/produksi-2026"
                className="group p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-azure hover:shadow-sm transition-all text-left flex flex-col justify-between min-h-[96px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-azure uppercase">Tahun 2026 (Live)</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-azure transition-colors" />
                </div>
                <span className="font-bold text-sm text-slate-900 group-hover:text-azure transition-colors">
                  Data Produksi 2026 →
                </span>
              </Link>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
