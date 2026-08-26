'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  LogOut,
  ChevronRight,
  Syringe,
  Building2,
  Stethoscope,
  Activity,
  ShieldCheck,
  Package,
  HeartPulse,
} from 'lucide-react';

export default function KeswanPage() {
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
      title: 'Rekapitulasi Data Vaksinasi',
      desc: 'Pencatatan target & realisasi vaksinasi PMK, LSD, log harian dosis, dan alokasi droping vaksin APBD',
      icon: Syringe,
      path: '/keswan/data-vaksinasi',
      badge: 'Vaksinasi PMK & LSD',
    },
    {
      title: 'Kinerja Pelayanan Puskeswan',
      desc: 'Rekapitulasi diagnosa penyakit, pelayanan medis aktif/pasif, pusling keliling, dan penerimaan retribusi 8 Puskeswan',
      icon: Building2,
      path: '/keswan/puskeswan',
      badge: 'Klinik & Pusling',
    },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-blue-50/50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center animate-spin text-blue-600">
            <HeartPulse size={22} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">
            Memeriksa Hak Akses Keswan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50/30 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-20">
      
      {/* ── TOP APP BAR (Tema Biru - Lega & Bernapas) ── */}
      <header className="border-b border-blue-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between">
          
          <div className="flex items-center gap-3.5">
            <Link
              href="/beranda"
              className="min-h-touch min-w-touch w-11 h-11 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-800 transition-colors"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Link href="/beranda" className="text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors">
                  SiMantap
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-blue-700">Bidang Keswan</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                Kesehatan Hewan & Puskeswan
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="min-h-touch h-11 px-4 sm:px-5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
        
        {/* Module Header Banner (Tema Biru) */}
        <section className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 sm:p-10 lg:p-12 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
              <Stethoscope size={32} />
            </div>
            <div className="space-y-2">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  Bidang Keswan
                </h2>
              </div>
              <p className="text-sm sm:text-base text-blue-50 max-w-2xl leading-relaxed">
                Pusat data monitoring vaksinasi penyakit menular ternak strategis (PMK & LSD), pelayanan medis di 8 Puskeswan, rekapitulasi log dosis harian, dan pencegahan wabah.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm text-blue-100">
              <span className="font-bold text-white block text-sm sm:text-base">{menus.length} Layanan Data</span>
              Tersinkronisasi Realtime
            </div>
          </div>
        </section>

        {/* Module Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Menu & Pelayanan Data Keswan
            </h3>
            <span className="text-xs text-slate-500 font-medium">Pilih menu untuk melihat rekapitulasi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {menus.map((menu) => {
              const IconComp = menu.icon;
              return (
                <Link
                  key={menu.title}
                  href={menu.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 flex flex-col justify-between min-h-[220px] shadow-xs hover:border-blue-500 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComp size={24} />
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                        {menu.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {menu.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        {menu.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-blue-700 group-hover:text-blue-800">
                    <span>Buka Layanan</span>
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
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