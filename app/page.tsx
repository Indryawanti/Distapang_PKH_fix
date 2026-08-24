'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowRight,
  Menu,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Building2,
  Users,
  FileCheck2,
  Stethoscope,
  Syringe,
  AlertCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DATA STATISTIK RESMI KEBUMEN (2025)
───────────────────────────────────────────── */
const REKAP_POPULASI_2025 = [
  { komoditas: 'Sapi Potong', total: 64996, icon: '🐄' },
  { komoditas: 'Sapi Perah', total: 0, icon: '🐄' },
  { komoditas: 'Kerbau', total: 170, icon: '🐃' },
  { komoditas: 'Kuda', total: 274, icon: '🐎' },
  { komoditas: 'Kambing', total: 101255, icon: '🐐' },
  { komoditas: 'Domba', total: 25552, icon: '🐑' },
  { komoditas: 'Babi', total: 780, icon: '🐖' },
  { komoditas: 'Ayam Kampung', total: 864412, icon: '🐣' },
  { komoditas: 'Ayam Petelur', total: 73976, icon: '🐓' },
  { komoditas: 'Ayam Broiler', total: 2636000, icon: '🐔' },
  { komoditas: 'Puyuh', total: 70808, icon: '🐦' },
  { komoditas: 'Itik', total: 87200, icon: '🦆' },
  { komoditas: 'Entog', total: 81573, icon: '🦢' },
  { komoditas: 'Angsa', total: 2153, icon: '🪿' },
  { komoditas: 'Merpati', total: 54168, icon: '🕊️' },
  { komoditas: 'Kelinci', total: 3907, icon: '🐇' },
];

const dataDaging = [
  { jenis: 'Sapi Potong', total: 2671799 },
  { jenis: 'Kambing Potong', total: 476066.4 },
  { jenis: 'Ayam Ras Pedaging', total: 11218855 },
  { jenis: 'Domba', total: 35032.42 },
  { jenis: 'Babi', total: 5947.94 },
  { jenis: 'Itik', total: 67869 },
];

const dataTelur = [
  { jenis: 'Ayam Ras Petelur Produktif', total: 641709.53 },
  { jenis: 'Ayam Buras', total: 2389258.2 },
  { jenis: 'Itik', total: 786706.0 },
  { jenis: 'Burung Puyuh', total: 121869 },
  { jenis: 'Entog', total: 687138.55 },
];

const REKAP_SEBARAN_FARM = [
  { komoditas: 'Ayam Broiler', jumlah_farm: 111, total_populasi: '1.435.000 Ekor' },
  { komoditas: 'Ayam Petelur', jumlah_farm: 112, total_populasi: '184.500 Ekor' },
  { komoditas: 'Sapi Potong (KTT Terbina)', jumlah_farm: 3, total_populasi: '116 Ekor' },
  { komoditas: 'Domba & Kambing', jumlah_farm: 5, total_populasi: '445 Ekor' },
  { komoditas: 'Babi (Perorangan)', jumlah_farm: 11, total_populasi: '315 Ekor' },
];

const TOP_KOMODITAS = [...REKAP_POPULASI_2025].filter((d) => d.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);
const TOP_DAGING = [...dataDaging].sort((a, b) => b.total - a.total).slice(0, 5);
const TOP_TELUR = [...dataTelur].sort((a, b) => b.total - a.total).slice(0, 5);

const TOTAL_POPULASI = REKAP_POPULASI_2025.reduce((sum, d) => sum + d.total, 0);
const TOTAL_DAGING = dataDaging.reduce((sum, d) => sum + d.total, 0);
const TOTAL_TELUR = dataTelur.reduce((sum, d) => sum + d.total, 0);
const TOTAL_FARM = REKAP_SEBARAN_FARM.reduce((sum, d) => sum + d.jumlah_farm, 0);

const METRIC_CONFIGS = {
  populasi: {
    label: 'Populasi Ternak',
    unit: 'Ekor',
    data: TOP_KOMODITAS,
    max: TOP_KOMODITAS[0]?.total ?? 1,
    getIcon: (r: any) => r.icon,
    getName: (r: any) => r.komoditas,
    barColor: '#38E54D',
  },
  daging: {
    label: 'Produksi Daging',
    unit: 'Kg',
    data: TOP_DAGING,
    max: TOP_DAGING[0]?.total ?? 1,
    getIcon: () => '🥩',
    getName: (r: any) => r.jenis,
    barColor: '#2192FF',
  },
  telur: {
    label: 'Produksi Telur',
    unit: 'Kg',
    data: TOP_TELUR,
    max: TOP_TELUR[0]?.total ?? 1,
    getIcon: () => '🥚',
    getName: (r: any) => r.jenis,
    barColor: '#EAB308',
  },
} as const;

const MODULES = [
  {
    key: 'bitpro',
    label: 'Bitpro',
    caption: 'Perbibitan & Produksi Ternak',
    icon: '🐄',
    accent: '#38E54D',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    key: 'keswan',
    label: 'Keswan',
    caption: 'Kesehatan Hewan & Puskeswan',
    icon: '🩺',
    accent: '#2192FF',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    key: 'kesmavet',
    label: 'Kesmavet',
    caption: 'Kesehatan Masyarakat Veteriner',
    icon: '🔬',
    accent: '#84CC16',
    badge: 'bg-lime-50 text-lime-900 border-lime-200',
  },
] as const;

export default function LandingPage() {
  const router = useRouter();

  // State Auth Modal & Navigation
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dashboard state
  const [activeModule, setActiveModule] = useState<'bitpro' | 'keswan' | 'kesmavet'>('bitpro');
  const [detailView, setDetailView] = useState<string | null>(null);
  const [subTabProd, setSubTabProd] = useState<'populasi' | 'daging' | 'telur'>('populasi');
  const [rankedMetric, setRankedMetric] = useState<keyof typeof METRIC_CONFIGS>('populasi');

  // Form login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.push('/beranda');
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Akses ditolak. Periksa kembali ID Petugas atau kata sandi Anda.');
      setIsLoading(false);
    } else {
      router.push('/beranda');
    }
  };

  const activeMod = MODULES.find((m) => m.key === activeModule)!;
  const cfg = METRIC_CONFIGS[rankedMetric];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-azure selection:text-white">
      
      {/* ─────────────────────────────────────────────
          1. TOP NAVIGATION (Clean SaaS Header)
      ───────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shadow-xs shrink-0">
              <img
                src="/logo-simantap.png"
                alt="Logo SiMantap"
                className="w-full h-full object-contain"
                onError={(e: any) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden text-lg">🏛️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-azure">
                  SiMantap
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 uppercase tracking-wider">
                  Kebumen
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block leading-none mt-0.5">
                Sistem Informasi Manajemen Peternakan Terpadu
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#ringkasan" className="hover:text-azure transition-colors">
              Ringkasan Wilayah
            </a>
            <a href="#modul" className="hover:text-azure transition-colors">
              Modul Data
            </a>
            <a href="#bantuan" className="hover:text-azure transition-colors">
              Bantuan Akses
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="min-h-touch h-11 px-5 rounded-xl bg-azure text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs hover:bg-azure/90 active:scale-[0.98] transition-all"
            >
              <span>Masuk Petugas</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setShowLoginModal(true)}
              className="min-h-touch h-10 px-3.5 rounded-xl bg-azure text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <span>Masuk</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka Menu"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-6 py-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <a
              href="#ringkasan"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-azure"
            >
              📊 Ringkasan Wilayah
            </a>
            <a
              href="#modul"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-azure"
            >
              🗂️ Modul Data
            </a>
            <a
              href="#bantuan"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-azure"
            >
              ℹ️ Bantuan Akses
            </a>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────
          2. HERO SECTION (Editorial & Clean)
      ───────────────────────────────────────────── */}
      <section id="ringkasan" className="pt-28 pb-12 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Kicker Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-vitality animate-pulse shrink-0" />
            <span>Portal Resmi Bidang Peternakan & Kesehatan Hewan Kebumen</span>
          </div>
        </div>

        {/* Editorial Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.18] mb-5">
            Satu Ekosistem untuk Data <br className="hidden sm:inline" />
            <span className="text-azure">Peternakan Kebumen</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto font-normal text-slate-600">
            Sistem Informasi Manajemen Terpadu yang mengintegrasikan data Perbibitan & Produksi (Bitpro), Kesehatan Hewan (Keswan), dan Kesehatan Masyarakat Veteriner (Kesmavet) secara akurat, transparan, dan terbuka.
          </p>
        </div>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full sm:w-auto min-h-touch h-12 px-7 rounded-xl bg-azure text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs hover:bg-azure/90 active:scale-[0.98] transition-all"
          >
            <span>Masuk ke Dashboard Dinas</span>
            <ArrowRight size={16} />
          </button>
          
          <a
            href="#modul"
            className="w-full sm:w-auto min-h-touch h-12 px-6 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <span>Eksplorasi Data Publik</span>
            <ChevronRight size={16} />
          </a>
        </div>

        {/* ─────────────────────────────────────────────
            3. ASYMMETRIC BENTO KPI CARDS
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          
          {/* Stat 1: Total Ternak */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🐾</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800">
                TAHUN 2025
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total Populasi Ternak
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-vitality tracking-tight">
              {TOTAL_POPULASI.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">Ekor di seluruh Kebumen</p>
          </div>

          {/* Stat 2: Produksi Daging */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🥩</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md border border-blue-200 bg-blue-50 text-blue-800">
                PRODUKSI
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Produksi Daging
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-azure tracking-tight">
              {Math.round(TOTAL_DAGING).toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">Kilogram / tahun</p>
          </div>

          {/* Stat 3: Produksi Telur */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🥚</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md border border-amber-200 bg-amber-50 text-amber-900">
                UNGGAS
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Produksi Telur
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight">
              {Math.round(TOTAL_TELUR).toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">Kilogram / tahun</p>
          </div>

          {/* Stat 4: Sebaran Farm */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🏡</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md border border-lime-200 bg-lime-50 text-lime-900">
                TERVERIFIKASI
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Sebaran Data Farm
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-lime tracking-tight">
              {TOTAL_FARM} Unit
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">Peternakan terdata</p>
          </div>

        </div>

      </section>

      {/* ─────────────────────────────────────────────
          4. MODUL EXPLORER PANEL
      ───────────────────────────────────────────── */}
      <section id="modul" className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-azure mb-1 block">
              Eksplorasi Data Terpadu
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900">
              Modul Pelayanan & Laporan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Pilih modul untuk melihat rekapitulasi data publik atau klik kartu di bawah untuk rincian data.
          </p>
        </div>

        {/* Tab Buttons (Touch Target >= 48px) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
          {MODULES.map((mod) => {
            const isActive = activeModule === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => {
                  setActiveModule(mod.key as any);
                  setDetailView(null);
                }}
                className={`min-h-touch-lg h-14 sm:h-16 px-3 sm:px-6 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-white border-azure text-slate-900 shadow-sm ring-2 ring-azure/20'
                    : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <span className="text-2xl sm:text-3xl shrink-0">{mod.icon}</span>
                <div className="min-w-0 flex-1 hidden sm:block">
                  <p className="font-bold text-sm leading-tight truncate">{mod.label}</p>
                  <p className="text-xs truncate text-slate-500">{mod.caption}</p>
                </div>
                <div className="sm:hidden text-center w-full">
                  <p className="font-bold text-xs truncate">{mod.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Panel Box */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeMod.accent }} />
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900">
                {activeMod.label} — {activeMod.caption}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                Pratinjau Publik
              </span>
            </div>
          </div>

          {/* Conditional Content: Detail View vs Dashboard Summary */}
          {detailView ? (
            /* DETAIL TABLE VIEW */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    {detailView === 'populasi' && '📊 Data Lengkap Sensus Populasi & Produksi Ternak'}
                    {detailView === 'farm' && '🏡 Sebaran Data Farm Peternakan Kebumen'}
                    {detailView === 'ktt' && '👥 Database Kelompok Tani Ternak (KTT)'}
                    {detailView === 'sklb' && '📄 Surat Keterangan Layak Bibit (SKLB)'}
                    {detailView === 'keswan_info' && '🩺 Informasi Puskeswan & Vaksinasi'}
                    {detailView === 'kesmavet_info' && '🔬 Data Usaha & Sertifikasi Halal'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tersinkronisasi dengan basis data Dinas Pertanian dan Pangan Kebumen
                  </p>
                </div>

                <button
                  onClick={() => setDetailView(null)}
                  className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2 self-start sm:self-auto transition-colors"
                >
                  ← Kembali ke Ringkasan
                </button>
              </div>

              {/* Subtabs for Populasi */}
              {detailView === 'populasi' && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { key: 'populasi', label: 'Populasi Ternak' },
                    { key: 'daging', label: 'Produksi Daging' },
                    { key: 'telur', label: 'Produksi Telur' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSubTabProd(tab.key as any)}
                      className={`min-h-touch h-9 px-3.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                        subTabProd === tab.key
                          ? 'bg-azure text-white border-azure shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Table Container */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                {detailView === 'populasi' && subTabProd === 'populasi' && (
                  <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 w-14 text-center">NO</th>
                        <th className="p-3.5">KOMODITAS TERNAK</th>
                        <th className="p-3.5 text-right font-mono">TOTAL POPULASI (2025)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {REKAP_POPULASI_2025.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 text-center font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-3.5 font-bold flex items-center gap-2">
                            <span>{row.icon}</span>
                            <span>{row.komoditas}</span>
                          </td>
                          <td className="p-3.5 text-right font-mono font-bold text-vitality">
                            {row.total.toLocaleString('id-ID')} Ekor
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {detailView === 'populasi' && subTabProd === 'daging' && (
                  <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 w-14 text-center">NO</th>
                        <th className="p-3.5">JENIS TERNAK POTONG</th>
                        <th className="p-3.5 text-right font-mono">TOTAL PRODUKSI DAGING (2025)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {dataDaging.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 text-center font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-3.5 font-bold">🥩 {row.jenis}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-azure">
                            {row.total.toLocaleString('id-ID')} Kg
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {detailView === 'populasi' && subTabProd === 'telur' && (
                  <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 w-14 text-center">NO</th>
                        <th className="p-3.5">KOMODITAS UNGGAS PETELUR</th>
                        <th className="p-3.5 text-right font-mono">TOTAL PRODUKSI TELUR (2025)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {dataTelur.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 text-center font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-3.5 font-bold">🥚 {row.jenis}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-amber-600">
                            {row.total.toLocaleString('id-ID')} Kg
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {detailView === 'farm' && (
                  <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 w-14 text-center">NO</th>
                        <th className="p-3.5">KOMODITAS FARM</th>
                        <th className="p-3.5 text-center font-mono">JUMLAH FARM</th>
                        <th className="p-3.5 text-right font-mono">TOTAL KAPASITAS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {REKAP_SEBARAN_FARM.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 text-center font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-3.5 font-bold">{row.komoditas}</td>
                          <td className="p-3.5 text-center font-mono font-bold text-slate-900">{row.jumlah_farm} Unit</td>
                          <td className="p-3.5 text-right font-mono font-bold text-lime">
                            {row.total_populasi}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {(detailView === 'ktt' || detailView === 'sklb' || detailView === 'keswan_info' || detailView === 'kesmavet_info') && (
                  <div className="py-12 px-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-azure/10 border border-azure/30 text-azure flex items-center justify-center mx-auto text-xl">
                      🔒
                    </div>
                    <h5 className="font-bold text-base text-slate-900">
                      Akses Khusus Petugas Terdaftar
                    </h5>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Detail mutasi ternak, rekonsiliasi bantuan, dan data internal dinas dapat diakses melalui portal internal.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="min-h-touch h-10 px-5 rounded-xl bg-azure text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs"
                      >
                        Masuk untuk Akses Lengkap
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* DEFAULT DASHBOARD PREVIEW */
            <div className="space-y-8">
              
              {/* Bitpro View */}
              {activeModule === 'bitpro' && (
                <>
                  {/* Ranked Bar Widget */}
                  <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h4 className="font-editorial text-lg sm:text-xl font-bold text-slate-900">
                          Peringkat 5 Tertinggi — {cfg.label}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Rekapitulasi resmi tingkat Kabupaten Kebumen (2025)
                        </p>
                      </div>

                      {/* Metric Toggle */}
                      <div className="flex gap-1 p-1 rounded-xl bg-slate-200/70 border border-slate-200">
                        {(Object.keys(METRIC_CONFIGS) as (keyof typeof METRIC_CONFIGS)[]).map((key) => (
                          <button
                            key={key}
                            onClick={() => setRankedMetric(key)}
                            className={`min-h-touch h-8 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-colors ${
                              rankedMetric === key
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {METRIC_CONFIGS[key].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3.5">
                      {cfg.data.map((row: any, i: number) => {
                        const name = cfg.getName(row);
                        const icon = cfg.getIcon(row);
                        const percent = Math.round((row.total / cfg.max) * 100);

                        return (
                          <div key={name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 w-48 shrink-0">
                              <span className={`w-5 h-5 rounded-md font-mono text-xs font-bold flex items-center justify-center ${i === 0 ? 'bg-azure text-white' : 'bg-slate-200 text-slate-700'}`}>
                                {i + 1}
                              </span>
                              <span className="text-xs sm:text-sm font-bold truncate text-slate-900">
                                {icon} {name}
                              </span>
                            </div>

                            <div className="flex-1 h-3 rounded-full bg-slate-200/80 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${percent}%`,
                                  backgroundColor: cfg.barColor,
                                }}
                              />
                            </div>

                            <span className="font-mono text-xs sm:text-sm font-bold text-right w-36 shrink-0 text-slate-900">
                              {Math.round(row.total).toLocaleString('id-ID')} {cfg.unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Asymmetric Clickable Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <button
                      onClick={() => setDetailView('populasi')}
                      className="p-5 rounded-2xl border border-slate-200 bg-white text-left flex flex-col justify-between min-h-[130px] transition-all hover:border-azure hover:shadow-sm active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">📊</span>
                        <ChevronRight size={18} className="text-azure" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 mb-0.5">Populasi & Produksi</p>
                        <p className="text-xs text-slate-500">
                          Tabel sensus 16 komoditas ternak
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDetailView('farm')}
                      className="p-5 rounded-2xl border border-slate-200 bg-white text-left flex flex-col justify-between min-h-[130px] transition-all hover:border-vitality hover:shadow-sm active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🏡</span>
                        <ChevronRight size={18} className="text-vitality" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 mb-0.5">Sebaran Data Farm</p>
                        <p className="text-xs text-slate-500">
                          242 unit kandang unggas & ruminansia
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDetailView('ktt')}
                      className="p-5 rounded-2xl border border-slate-200 bg-white text-left flex flex-col justify-between min-h-[130px] transition-all hover:border-lime hover:shadow-sm active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">👥</span>
                        <ChevronRight size={18} className="text-lime" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 mb-0.5">Database KTT</p>
                        <p className="text-xs text-slate-500">
                          Kelompok Tani Ternak binaan
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDetailView('sklb')}
                      className="p-5 rounded-2xl border border-slate-200 bg-white text-left flex flex-col justify-between min-h-[130px] transition-all hover:border-amber-400 hover:shadow-sm active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">📄</span>
                        <ChevronRight size={18} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 mb-0.5">Sertifikat SKLB</p>
                        <p className="text-xs text-slate-500">
                          Surat Kelayakan Bibit Ternak
                        </p>
                      </div>
                    </button>

                  </div>
                </>
              )}

              {/* Keswan View */}
              {activeModule === 'keswan' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-3xl mb-3 block">🩺</span>
                    <h4 className="font-bold text-base text-slate-900 mb-1">Puskeswan Aktif</h4>
                    <p className="text-xs text-slate-600 mb-4">
                      Pelayanan rawat, pasif, pusling, dan konsultasi kesehatan ternak di seluruh kecamatan.
                    </p>
                    <button
                      onClick={() => setDetailView('keswan_info')}
                      className="text-xs font-mono font-bold text-azure hover:underline flex items-center gap-1"
                    >
                      LIHAT LAYANAN →
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-3xl mb-3 block">💉</span>
                    <h4 className="font-bold text-base text-slate-900 mb-1">Vaksinasi PMK & LSD</h4>
                    <p className="text-xs text-slate-600 mb-4">
                      Monitoring capaian vaksinasi berkala dan penanganan penyakit menular ternak.
                    </p>
                    <button
                      onClick={() => setDetailView('keswan_info')}
                      className="text-xs font-mono font-bold text-azure hover:underline flex items-center gap-1"
                    >
                      LIHAT CAPAIAN →
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-3xl mb-3 block">🚑</span>
                    <h4 className="font-bold text-base text-slate-900 mb-1">Tanggap Darurat Medis</h4>
                    <p className="text-xs text-slate-600 mb-4">
                      Sistem respon cepat laporan wabah dan pengobatan hewan ternak masyarakat.
                    </p>
                    <button
                      onClick={() => setDetailView('keswan_info')}
                      className="text-xs font-mono font-bold text-azure hover:underline flex items-center gap-1"
                    >
                      KONTAK PETUGAS →
                    </button>
                  </div>
                </div>
              )}

              {/* Kesmavet View */}
              {activeModule === 'kesmavet' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-3xl mb-3 block">🥩</span>
                    <h4 className="font-bold text-base text-slate-900 mb-1">RPH & TPH Terbina</h4>
                    <p className="text-xs text-slate-600 mb-4">
                      Rumah Potong Hewan dan Tempat Pemotongan Hewan resmi berstandar sanitasi.
                    </p>
                    <button
                      onClick={() => setDetailView('kesmavet_info')}
                      className="text-xs font-mono font-bold text-lime hover:underline flex items-center gap-1"
                    >
                      LIHAT DATA UNIT →
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-3xl mb-3 block">✅</span>
                    <h4 className="font-bold text-base text-slate-900 mb-1">Sertifikasi Halal & NKV</h4>
                    <p className="text-xs text-slate-600 mb-4">
                      Verifikasi Nomor Kontrol Veteriner dan jaminan kehalalan produk asal hewan.
                    </p>
                    <button
                      onClick={() => setDetailView('kesmavet_info')}
                      className="text-xs font-mono font-bold text-lime hover:underline flex items-center gap-1"
                    >
                      STATUS SERTIFIKAT →
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-3xl mb-3 block">🔬</span>
                    <h4 className="font-bold text-base text-slate-900 mb-1">Pengujian Lab Higiene</h4>
                    <p className="text-xs text-slate-600 mb-4">
                      Pemeriksaan laboratorium mutu produk asal hewan yang aman, sehat, utuh, dan halal (ASUH).
                    </p>
                    <button
                      onClick={() => setDetailView('kesmavet_info')}
                      className="text-xs font-mono font-bold text-lime hover:underline flex items-center gap-1"
                    >
                      INFO UJI LAB →
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </section>

      {/* ─────────────────────────────────────────────
          5. MODAL LOGIN PETUGAS (48px Inputs)
      ───────────────────────────────────────────── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 text-slate-900">
            
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              aria-label="Tutup jendela login"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 absolute top-5 right-5 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-6 text-left">
              <div className="w-12 h-12 rounded-2xl bg-azure/10 border border-azure/30 flex items-center justify-center text-azure mb-3">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-editorial text-2xl font-bold tracking-tight text-slate-900">
                Masuk Sistem SiMantap
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan ID Petugas resmi Dinas Pertanian dan Pangan
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  ID Petugas (Email Dinas)
                </label>
                <input
                  type="email"
                  required
                  placeholder="petugas@pkh.kebumenkab.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-touch h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-sans outline-none focus:border-azure focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full min-h-touch h-11 pl-3.5 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-sm font-sans outline-none focus:border-azure focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                    className="min-h-touch min-w-touch w-10 h-10 absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-touch h-12 rounded-xl bg-azure text-white font-bold text-sm flex items-center justify-center gap-2 mt-5 shadow-xs hover:bg-azure/90 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <span>Memverifikasi Akun...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard Petugas</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500">
              Butuh bantuan atau lupa kredensial? Hubungi Administrator Teknis Bidang PKH.
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          6. FOOTER (Clean & Crisp)
      ───────────────────────────────────────────── */}
      <footer id="bantuan" className="border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-600 bg-white">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="font-editorial text-lg font-bold text-azure">SiMantap</span>
            <span>—</span>
            <span>Dinas Pertanian dan Pangan Kabupaten Kebumen</span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Bidang Peternakan dan Kesehatan Hewan · Jl. Tentara Pelajar No. 25, Kebumen, Jawa Tengah.
          </p>
          <p className="text-xs font-mono text-slate-400 pt-1">
            &copy; {new Date().getFullYear()} Pemerintah Kabupaten Kebumen. Seluruh Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>

    </div>
  );
}