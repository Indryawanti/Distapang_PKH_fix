'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  LogOut,
  ChevronRight,
  Database,
  Smartphone,
  Award,
  Activity,
  TrendingUp,
  Calendar,
  BarChart3,
  Building2,
  FolderKanban,
  Syringe,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function BitproPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const cekAkses = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.push('/login');
      else setIsAuthorized(true);
    };
    cekAkses();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const menus = [
    {
      title: 'Database KTT',
      desc: 'Manajemen data master Kelompok Tani Ternak binaan seluruh kecamatan di Kabupaten Kebumen',
      icon: FolderKanban,
      path: '/bitpro/database-ktt',
      badge: 'Master Data',
    },
    {
      title: 'SapiTime Smart App',
      desc: 'Aplikasi cerdas kalender reproduksi sapi, siklus estrus 21 hari, dan direktori indukan produktif',
      icon: Smartphone,
      path: '/bitpro/sapitime',
      badge: 'Smart App',
    },
    {
      title: 'Sertifikat SKLB',
      desc: 'Penerbitan dan rekapitulasi Surat Keterangan Layak Bibit ternak sapi Tim Barat & Tim Timur Kebumen',
      icon: Award,
      path: '/bitpro/sklb',
      badge: 'Sertifikasi Bibit',
    },
    {
      title: 'Database Inseminasi Buatan (IB)',
      desc: 'Pencatatan siklus IB, pemeriksaan kebuntingan (PKB), evaluasi kelahiran, dan Calving Interval',
      icon: Syringe,
      path: '/bitpro/database-ib',
      badge: 'Pelayanan IB',
    },
    {
      title: 'Monev KTT',
      desc: 'Monitoring dan evaluasi perkembangan ternak KTT: populasi, pendataan lapangan, dan berita acara kegiatan',
      icon: Calendar,
      path: '/bitpro/monev-ktt',
      badge: 'Monitoring KTT',
    },
    {
      title: 'Kegiatan KTT',
      desc: 'Rekap kegiatan pembinaan, pelatihan, dan pendampingan teknis Kelompok Tani Ternak per kecamatan',
      icon: CheckCircle2,
      path: '/bitpro/monev-ktt',
      badge: 'Pembinaan KTT',
    },
    {
      title: 'Populasi & Produksi',
      desc: 'Statistik sensus populasi 16 komoditas ternak serta laporan tonase produksi daging dan telur',
      icon: BarChart3,
      path: '/bitpro/populasi-dan-produksi',
      badge: 'Statistik 2025/2026',
    },
    {
      title: 'Database Sebaran Farm',
      desc: 'Pendataan 240+ unit peternakan mandiri & kemitraan unggas broiler, petelur, dan ruminansia',
      icon: Building2,
      path: '/bitpro/data-farm',
      badge: 'Sebaran Farm',
    },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-emerald-50/50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center animate-spin text-emerald-600">
            <Activity size={22} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Memeriksa Hak Akses Bitpro...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white pb-20">
      
      {/* ── TOP APP BAR (Tema Hijau - Lega & Bernapas) ── */}
      <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between gap-3">
          
          {/* Breadcrumb & Identity */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/beranda"
              className="min-h-touch min-w-touch w-11 h-11 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-800 transition-colors shrink-0"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Link href="/beranda" className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors truncate">
                  SiMantap
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">Bidang Bitpro</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
                Perbibitan &amp; Produksi Ternak
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLogout}
              title="Keluar"
              aria-label="Keluar"
              className="min-h-touch min-w-touch h-11 w-11 sm:w-auto sm:px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs sm:text-sm font-bold flex items-center justify-center sm:gap-2 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
        
        {/* Module Header Banner (Tema Hijau) */}
        <section className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-10 lg:p-12 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
              <Activity size={32} />
            </div>
            <div className="space-y-2">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  Bidang Bitpro
                </h2>
              </div>
              <p className="text-sm sm:text-base text-emerald-50 max-w-2xl leading-relaxed text-justify">
                Pusat data perbibitan, sensus populasi ternak, evaluasi inseminasi buatan, sertifikasi bibit unggul, dan rekapitulasi produksi daging/telur Kabupaten Kebumen.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm text-emerald-100">
              <span className="font-bold text-white block text-sm sm:text-base">{menus.length} Layanan Data</span>
              Tersinkronisasi Realtime
            </div>
          </div>
        </section>

        {/* Module Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Menu & Pelayanan Data Bitpro
            </h3>
            <span className="text-xs text-slate-500 font-medium">Pilih menu untuk membuka tabel atau formulir</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {menus.map((menu) => {
              const IconComp = menu.icon;
              return (
                <Link
                  key={menu.title}
                  href={menu.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between min-h-[210px] shadow-xs hover:border-emerald-500 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComp size={22} />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                        {menu.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {menu.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-3">
                        {menu.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                    <span>Buka Layanan</span>
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>

    </div>
  );
}
