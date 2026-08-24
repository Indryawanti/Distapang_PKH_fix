'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck,
  LogOut,
  ArrowRight,
  Lock,
  ChevronRight,
  ExternalLink,
  Building,
  Activity,
  Award,
  Calendar,
  Sparkles,
  UserCheck,
} from 'lucide-react';

export default function BerandaPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/');
          return;
        }

        setIsLoggedIn(true);
        const email = session.user?.email || '';
        setUserEmail(email);

        if (email.toLowerCase().includes('admin')) {
          setHasFullAccess(true);
        } else {
          setHasFullAccess(false);
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-azure/10 border border-azure/30 flex items-center justify-center animate-spin">
            <span className="w-4 h-4 rounded-full bg-azure" />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Memuat Dashboard Petugas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-azure selection:text-white pb-20">
      
      {/* ─────────────────────────────────────────────
          1. TOP APP BAR (Crisp SaaS Header)
      ───────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-105">
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
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border border-azure/30 bg-azure/10 text-azure uppercase tracking-wider">
                    Dashboard Petugas
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block leading-none mt-0.5">
                  Dinas Pertanian dan Pangan Kabupaten Kebumen
                </p>
              </div>
            </Link>
          </div>

          {/* Officer Navigation Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="min-h-touch h-10 px-3.5 sm:px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold hidden sm:flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Portal Publik</span>
              <ExternalLink size={14} />
            </Link>

            <button
              onClick={handleLogout}
              className="min-h-touch h-10 px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
            >
              <LogOut size={15} />
              <span>Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────
          2. OFFICER PROFILE & TELEMETRY BANNER
      ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Officer Status Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-azure/10 border-2 border-azure/30 flex items-center justify-center text-azure text-2xl shrink-0">
              👤
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Selamat Bertugas
                </h2>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                    hasFullAccess
                      ? 'bg-lime-50 text-lime-900 border-lime-300'
                      : 'bg-azure/10 text-azure border-azure/30'
                  }`}
                >
                  {hasFullAccess ? '★ Administrator Penuh' : 'Petugas Teknis'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-600">
                ID Petugas: <span className="text-slate-900 font-bold">{userEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-vitality animate-pulse" />
              <span>Sesi Terenkripsi Aktif</span>
            </div>
          </div>

        </section>

        {/* ─────────────────────────────────────────────
            3. MODULE LAUNCHER CARDS
        ───────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-azure block mb-1">
                Pintu Akses Modul
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900">
                Pilih Modul Pelayanan & Laporan
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Klik pada kartu modul untuk mulai mengelola data dan laporan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ── BITPRO CARD ── */}
            <Link
              href="/bitpro"
              className="group rounded-3xl border border-slate-200 bg-white p-7 flex flex-col justify-between min-h-[340px] transition-all duration-200 hover:border-vitality hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl">
                    🐄
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 font-bold uppercase">
                    Modul 01
                  </span>
                </div>

                <div>
                  <h4 className="font-editorial text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Bitpro
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Perbibitan & Produksi Ternak
                  </p>
                </div>

                <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 font-sans">
                  <li className="flex items-center gap-2">
                    <span className="text-vitality font-bold">✓</span> Sensus Populasi Ternak 2025/2026
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-vitality font-bold">✓</span> Rekapitulasi Produksi Daging & Telur
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-vitality font-bold">✓</span> Database Farm & KTT Binaan
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-vitality font-bold">✓</span> SapiTime & Pengukuran SKLB
                  </li>
                </ul>
              </div>

              <div className="pt-6 flex items-center justify-between text-emerald-700 font-bold text-xs sm:text-sm">
                <span>Masuk ke Modul Bitpro</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* ── KESWAN CARD ── */}
            {isLoggedIn && !hasFullAccess ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-100/70 p-7 flex flex-col justify-between min-h-[340px] relative opacity-85">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-3xl">
                      🩺
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 font-bold uppercase flex items-center gap-1">
                      <Lock size={12} /> Terbatas
                    </span>
                  </div>

                  <div>
                    <h4 className="font-editorial text-2xl font-bold text-slate-900">
                      Keswan
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Kesehatan Hewan & Puskeswan
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 pt-3 border-t border-slate-200">
                    Modul ini membutuhkan hak akses khusus admin bidang kesehatan hewan.
                  </p>
                </div>

                <div className="pt-6 text-xs font-mono text-slate-500 flex items-center gap-1.5">
                  <Lock size={14} /> Memerlukan Izin Admin
                </div>
              </div>
            ) : (
              <Link
                href="/keswan"
                className="group rounded-3xl border border-slate-200 bg-white p-7 flex flex-col justify-between min-h-[340px] transition-all duration-200 hover:border-azure hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-3xl">
                      🩺
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-800 font-bold uppercase">
                      Modul 02
                    </span>
                  </div>

                  <div>
                    <h4 className="font-editorial text-2xl font-bold text-slate-900 group-hover:text-azure transition-colors">
                      Keswan
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Kesehatan Hewan & Puskeswan
                    </p>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 font-sans">
                    <li className="flex items-center gap-2">
                      <span className="text-azure font-bold">✓</span> Rekapitulasi Vaksinasi PMK Harian/Bulan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-azure font-bold">✓</span> Laporan Kinerja Bulanan 8 Puskeswan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-azure font-bold">✓</span> Alokasi Droping Vaksin APBD Jateng
                    </li>
                  </ul>
                </div>

                <div className="pt-6 flex items-center justify-between text-azure font-bold text-xs sm:text-sm">
                  <span>Masuk ke Modul Keswan</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )}

            {/* ── KESMAVET CARD ── */}
            {isLoggedIn && !hasFullAccess ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-100/70 p-7 flex flex-col justify-between min-h-[340px] relative opacity-85">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-lime-50 border border-lime-200 flex items-center justify-center text-3xl">
                      🔬
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 font-bold uppercase flex items-center gap-1">
                      <Lock size={12} /> Terbatas
                    </span>
                  </div>

                  <div>
                    <h4 className="font-editorial text-2xl font-bold text-slate-900">
                      Kesmavet
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Kesehatan Masyarakat Veteriner
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 pt-3 border-t border-slate-200">
                    Modul ini membutuhkan hak akses khusus admin bidang kesmavet.
                  </p>
                </div>

                <div className="pt-6 text-xs font-mono text-slate-500 flex items-center gap-1.5">
                  <Lock size={14} /> Memerlukan Izin Admin
                </div>
              </div>
            ) : (
              <Link
                href="/kesmavet"
                className="group rounded-3xl border border-slate-200 bg-white p-7 flex flex-col justify-between min-h-[340px] transition-all duration-200 hover:border-lime hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-lime-50 border border-lime-200 flex items-center justify-center text-3xl">
                      🔬
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full border border-lime-200 bg-lime-50 text-lime-900 font-bold uppercase">
                      Modul 03
                    </span>
                  </div>

                  <div>
                    <h4 className="font-editorial text-2xl font-bold text-slate-900 group-hover:text-lime-700 transition-colors">
                      Kesmavet
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Kesehatan Masyarakat Veteriner
                    </p>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 font-sans">
                    <li className="flex items-center gap-2">
                      <span className="text-lime-600 font-bold">✓</span> Database 101 Unit RPH, TPU, dan TPH
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-lime-600 font-bold">✓</span> Sertifikasi Halal & Nomor Kontrol (NKV)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-lime-600 font-bold">✓</span> Rekapitulasi Kapasitas Pemotongan Hewan
                    </li>
                  </ul>
                </div>

                <div className="pt-6 flex items-center justify-between text-lime-700 font-bold text-xs sm:text-sm">
                  <span>Masuk ke Modul Kesmavet</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )}

          </div>
        </section>

      </main>

      {/* ─────────────────────────────────────────────
          4. SIMPLE FOOTER
      ───────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs font-mono text-slate-500 bg-white">
        &copy; {new Date().getFullYear()} SiMantap — Bidang Peternakan dan Kesehatan Hewan Kabupaten Kebumen
      </footer>

    </div>
  );
}