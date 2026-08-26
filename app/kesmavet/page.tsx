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
  Building2,
  FlaskConical,
  CheckCircle2,
  Store,
  Sparkles,
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
      title: 'Pelaku Usaha RPH, TPH, & TPU',
      desc: 'Database 101 unit usaha pemotongan ternak ruminansia & unggas, izin operasional, sertifikasi Halal, dan status NKV',
      icon: Building2,
      path: '/kesmavet/rph-tph-tpu',
      badge: 'Database RPH & TPU',
    },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-purple-50/50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center animate-spin text-purple-600">
            <FlaskConical size={22} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-800">
            Memeriksa Hak Akses Kesmavet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50/30 text-slate-900 font-sans selection:bg-purple-600 selection:text-white pb-20">
      
      {/* ── TOP APP BAR (Tema Ungu) ── */}
      <header className="border-b border-purple-100 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/beranda"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-800 transition-colors"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Link href="/beranda" className="text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors">
                  SiMantap
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-purple-700">Bidang Kesmavet</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Kesehatan Masyarakat Veteriner
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="min-h-touch h-10 px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Module Header Banner (Tema Ungu) */}
        <section className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-700 to-violet-800 text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
              <FlaskConical size={28} />
            </div>
            <div className="space-y-1">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Bidang Kesmavet
                </h2>
              </div>
              <p className="text-sm text-purple-50 max-w-2xl leading-relaxed">
                Pengawasan keamanan pangan asal hewan (ASUH: Aman, Sehat, Utuh, Halal), sertifikasi Nomor Kontrol Veteriner (NKV), pengawasan RPH/TPH/TPU, dan pengujian mutu laboratorium.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-purple-100">
              <span className="font-bold text-white block text-sm">{menus.length} Layanan Data</span>
              Tersinkronisasi Realtime
            </div>
          </div>
        </section>

        {/* Module Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              Menu & Pelayanan Data Kesmavet
            </h3>
            <span className="text-xs text-slate-500 font-medium">Pilih menu untuk melihat database</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {menus.map((menu) => {
              const IconComp = menu.icon;
              return (
                <Link
                  key={menu.title}
                  href={menu.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 flex flex-col justify-between min-h-[220px] shadow-xs hover:border-purple-500 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComp size={24} />
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        {menu.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {menu.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        {menu.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-purple-700 group-hover:text-purple-800">
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