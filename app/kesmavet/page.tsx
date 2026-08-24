'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building,
  Wheat,
  Store,
} from 'lucide-react';

export default function KesmavetPage() {
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
    router.push('/');
  };

  const menus = [
    {
      title: 'Pelaku Usaha RPH, TPH, TPU',
      desc: 'Database 100+ unit usaha pemotongan ternak, izin operasional, dan sertifikat halal',
      icon: '🏠',
      path: '/kesmavet/rph-tph-tpu',
      badge: 'Unit Usaha',
    },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-lime/30 border border-lime/50 flex items-center justify-center animate-spin">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600" />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Memeriksa Hak Akses Kesmavet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-azure selection:text-white">
      
      {/* ── TOP APP BAR ── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/beranda"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Link href="/beranda" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  SiMantap
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-azure">Kesmavet</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Kesehatan Masyarakat Veteriner
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="min-h-touch h-10 px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Module Header Banner */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-lime/15 border border-lime/30 text-emerald-800 text-3xl flex items-center justify-center shrink-0">
              🔬
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Bidang Kesmavet
                </h2>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-lime/20 text-emerald-800 border border-lime/40">
                  Modul Aktif
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Pengawasan keamanan pangan asal hewan (ASUH: Aman, Sehat, Utuh, Halal), sertifikasi Nomor Kontrol Veteriner (NKV), pengawasan RPH/TPH/TPU, dan pengujian mutu laboratorium.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono">
              <span className="font-bold text-slate-900 block text-sm">{menus.length} Sub-Modul</span>
              Tersinkronisasi
            </div>
          </div>
        </section>

        {/* Module Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs font-mono text-slate-500">
              Daftar Sub-Pelayanan Kesmavet
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {menus.map((menu) => (
              <Link
                key={menu.title}
                href={menu.path}
                className="group rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between min-h-[200px] shadow-sm hover:border-azure hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{menu.icon}</span>
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {menu.badge}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-azure transition-colors mb-1.5">
                    {menu.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {menu.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-azure group-hover:text-azure/90">
                  <span>Buka Layanan</span>
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}