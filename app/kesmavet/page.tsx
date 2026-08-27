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
    router.push('/login');
  };

  const menus = [
    {
      title: 'Nomor Kontrol Veteriner (NKV)',
      desc: 'Pendataan unit usaha pemotongan hewan yang telah memiliki sertifikat NKV dari Kementerian Pertanian RI',
      icon: ShieldCheck,
      path: '/kesmavet/rph-tph-tpu',
      badge: 'Sertifikasi NKV',
    },
    {
      title: 'Pelaku Usaha Pemotongan Hewan (RPH, TPH, TPU)',
      desc: 'Database 101 unit usaha pemotongan ternak ruminansia & unggas, izin operasional, sertifikasi Halal, dan status NKV',
      icon: Building2,
      path: '/kesmavet/rph-tph-tpu',
      badge: 'Database RPH & TPU',
    },
    {
      title: 'Pakan Ternak',
      desc: 'Data produsen dan distributor pakan ternak lokal, pabrik pakan, dan pendataan ketersediaan bahan pakan strategis',
      icon: Store,
      path: '/kesmavet/rph-tph-tpu',
      badge: 'Ketersediaan Pakan',
    },
    {
      title: 'Pasar Hewan',
      desc: 'Pendataan dan pengawasan pasar hewan aktif, transaksi jual-beli ternak, monitoring harga, dan lalu lintas pasar',
      icon: CheckCircle2,
      path: '/kesmavet/rph-tph-tpu',
      badge: 'Pasar & Transaksi',
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
      
      {/* ── TOP APP BAR (Tema Ungu - Lega & Bernapas) ── */}
      <header className="border-b border-purple-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/beranda"
              className="min-h-touch min-w-touch w-11 h-11 rounded-2xl border border-purple-200 bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-800 transition-colors shrink-0"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Link href="/beranda" className="text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors truncate">
                  SiMantap
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-purple-700 whitespace-nowrap">Bidang Kesmavet</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
                Kesehatan Masyarakat Veteriner
              </h1>
            </div>
          </div>

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
        
        {/* Module Header Banner (Tema Ungu) */}
        <section className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-700 to-violet-800 text-white p-8 sm:p-10 lg:p-12 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
              <FlaskConical size={32} />
            </div>
            <div className="space-y-2">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  Bidang Kesmavet
                </h2>
              </div>
              <p className="text-sm sm:text-base text-purple-50 max-w-2xl leading-relaxed text-justify">
                Pengawasan keamanan pangan asal hewan (ASUH: Aman, Sehat, Utuh, Halal), sertifikasi Nomor Kontrol Veteriner (NKV), pengawasan RPH/TPH/TPU, dan pengujian mutu laboratorium.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm text-purple-100">
              <span className="font-bold text-white block text-sm sm:text-base">{menus.length} Layanan Data</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {menus.map((menu) => {
              const IconComp = menu.icon;
              return (
                <Link
                  key={menu.title}
                  href={menu.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 flex flex-col justify-between min-h-[160px] shadow-xs hover:border-purple-500 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComp size={24} />
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        {menu.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                        {menu.title}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-purple-700 group-hover:text-purple-800">
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