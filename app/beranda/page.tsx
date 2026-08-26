'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck,
  LogOut,
  ArrowRight,
  ArrowUpRight,
  Lock,
  ChevronRight,
  ExternalLink,
  Building,
  Activity,
  Award,
  Calendar,
  Sparkles,
  UserCheck,
  Stethoscope,
  FlaskConical,
  Landmark,
  CheckCircle2,
  Boxes,
  MapPin,
  TrendingUp,
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
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center animate-spin text-blue-600">
            <Activity size={22} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Memuat Dashboard Petugas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-20">
      
      {/* ─────────────────────────────────────────────
          1. TOP APP BAR
      ───────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-105">
                <img
                  src="/logo-simantap.png"
                  alt="Logo SiMantap"
                  className="w-full h-full object-contain"
                  onError={(e: any) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden text-blue-600 items-center justify-center">
                  <Landmark size={20} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-blue-600">
                    SiMantap
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                    Dashboard Petugas
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block leading-none mt-0.5">
                  Dinas Pertanian dan Pangan Kabupaten Kebumen
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold hidden sm:flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Portal Publik</span>
              <ExternalLink size={14} />
            </Link>

            <button
              onClick={handleLogout}
              className="min-h-touch h-10 px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
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
            <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <UserCheck size={26} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Selamat Bertugas
                </h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    hasFullAccess
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  {hasFullAccess ? '★ Administrator Penuh' : 'Petugas Teknis'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                ID Petugas: <span className="text-slate-900 font-bold">{userEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sesi Terenkripsi Aktif</span>
            </div>
          </div>

        </section>

        {/* ─────────────────────────────────────────────
            3. MODULE LAUNCHER CARDS (4 MODUL: BITPRO, KESMAVET, KESWAN, ASET)
        ───────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Pintu Akses Modul
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Pilih Modul Pelayanan & Laporan
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Akses cepat modul Bitpro, Kesmavet, Keswan, dan Manajemen Aset.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* ── MODUL 01: BITPRO (TEMA HIJAU) ── */}
            <Link
              href="/bitpro"
              className="group rounded-3xl border border-emerald-200 bg-white p-6 sm:p-7 flex flex-col justify-between min-h-[360px] transition-all duration-200 hover:border-emerald-500 hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Activity size={24} />
                  </div>
                  <ArrowUpRight size={20} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Bitpro
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Perbibitan & Produksi Ternak
                  </p>
                </div>

                <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 font-sans">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Sensus Populasi 2025/2026
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Produksi Daging & Telur
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Database IB & Calving Interval
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> SapiTime & Sertifikat SKLB
                  </li>
                </ul>
              </div>

              <div className="pt-5 flex items-center justify-between text-emerald-700 font-bold text-xs sm:text-sm">
                <span>Buka Bitpro</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* ── MODUL 02: KESMAVET (TEMA UNGU) ── */}
            {isLoggedIn && !hasFullAccess ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-100/70 p-6 sm:p-7 flex flex-col justify-between min-h-[360px] relative opacity-85">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                      <FlaskConical size={24} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 font-bold flex items-center gap-1">
                      <Lock size={12} /> Terbatas
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Kesmavet
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Kesehatan Masyarakat Veteriner
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 pt-3 border-t border-slate-200">
                    Modul ini membutuhkan hak akses khusus admin bidang kesmavet.
                  </p>
                </div>

                <div className="pt-5 text-xs text-slate-500 flex items-center gap-1.5 font-semibold">
                  <Lock size={14} /> Memerlukan Izin Admin
                </div>
              </div>
            ) : (
              <Link
                href="/kesmavet"
                className="group rounded-3xl border border-purple-200 bg-white p-6 sm:p-7 flex flex-col justify-between min-h-[360px] transition-all duration-200 hover:border-purple-500 hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <FlaskConical size={24} />
                    </div>
                    <ArrowUpRight size={20} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      Kesmavet
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Kesehatan Masyarakat Veteriner
                    </p>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 font-sans">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span> 101 Unit RPH, TPU, dan TPH
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span> Sertifikasi Halal & NKV
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span> Pengawasan Mutu & ASUH
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span> Kapasitas Pemotongan Hewan
                    </li>
                  </ul>
                </div>

                <div className="pt-5 flex items-center justify-between text-purple-700 font-bold text-xs sm:text-sm">
                  <span>Buka Kesmavet</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )}

            {/* ── MODUL 03: KESWAN (TEMA BIRU) ── */}
            {isLoggedIn && !hasFullAccess ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-100/70 p-6 sm:p-7 flex flex-col justify-between min-h-[360px] relative opacity-85">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Stethoscope size={24} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 font-bold flex items-center gap-1">
                      <Lock size={12} /> Terbatas
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Keswan
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Kesehatan Hewan & Puskeswan
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 pt-3 border-t border-slate-200">
                    Modul ini membutuhkan hak akses khusus admin bidang kesehatan hewan.
                  </p>
                </div>

                <div className="pt-5 text-xs text-slate-500 flex items-center gap-1.5 font-semibold">
                  <Lock size={14} /> Memerlukan Izin Admin
                </div>
              </div>
            ) : (
              <Link
                href="/keswan"
                className="group rounded-3xl border border-blue-200 bg-white p-6 sm:p-7 flex flex-col justify-between min-h-[360px] transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Stethoscope size={24} />
                    </div>
                    <ArrowUpRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      Keswan
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Kesehatan Hewan & Puskeswan
                    </p>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 font-sans">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Vaksinasi PMK & LSD
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Kinerja 8 Unit Puskeswan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Pelayanan Pusling Keliling
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Droping Vaksin APBD Jateng
                    </li>
                  </ul>
                </div>

                <div className="pt-5 flex items-center justify-between text-blue-700 font-bold text-xs sm:text-sm">
                  <span>Buka Keswan</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )}

            {/* ── MODUL 04: ASET (TEMA AMBER / EMAS WARM) ── */}
            <Link
              href="/bitpro/monev-ktt"
              className="group rounded-3xl border border-amber-200 bg-white p-6 sm:p-7 flex flex-col justify-between min-h-[360px] transition-all duration-200 hover:border-amber-500 hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Boxes size={24} />
                  </div>
                  <ArrowUpRight size={20} className="text-slate-300 group-hover:text-amber-600 transition-colors" />
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Aset
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Manajemen Aset & Sarpras Ternak
                  </p>
                </div>

                <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 font-sans">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">✓</span> Monitoring Aset Ternak Hibah
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">✓</span> Titik Koordinat GPS Kandang
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">✓</span> Mutasi Populasi & Berita Acara
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">✓</span> Rekapitulasi Excel & Foto Fisik
                  </li>
                </ul>
              </div>

              <div className="pt-5 flex items-center justify-between text-amber-700 font-bold text-xs sm:text-sm">
                <span>Buka Manajemen Aset</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

          </div>
        </section>

      </main>

      {/* ─────────────────────────────────────────────
          4. FOOTER
      ───────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 bg-white">
        &copy; {new Date().getFullYear()} SiMantap — Bidang Peternakan dan Kesehatan Hewan Kabupaten Kebumen
      </footer>

    </div>
  );
}