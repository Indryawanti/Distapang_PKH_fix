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
    router.push('/login');
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
      
      {/* ── TOP APP BAR ── */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between gap-3">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link href="/" className="flex items-center gap-3 group min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-105">
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
                  <Landmark size={22} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-2xl font-bold tracking-tight text-blue-600">
                    SiMantap
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 whitespace-nowrap">
                    Dashboard
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block leading-none mt-1 truncate">
                  Dinas Pertanian dan Pangan Kabupaten Kebumen
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              title="Portal Publik"
              aria-label="Portal Publik"
              className="min-h-touch min-w-touch h-11 w-11 sm:w-auto sm:px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center sm:gap-2 transition-colors shadow-xs"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Portal Publik</span>
            </Link>

            <button
              onClick={handleLogout}
              title="Keluar"
              aria-label="Keluar"
              className="min-h-touch min-w-touch h-11 w-11 sm:w-auto sm:px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs sm:text-sm font-bold flex items-center justify-center sm:gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
        
        {/* Officer Status Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 lg:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xs">
          
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <UserCheck size={30} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                  Selamat Bertugas
                </h2>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
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

        {/* ── MODULE LAUNCHER CARDS ── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Pintu Akses Modul
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Pilih Modul Pelayanan &amp; Laporan
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Akses cepat modul Bitpro, Keswan, Kesmavet, dan Manajemen Aset.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* ── MODUL 01: BITPRO (TEMA HIJAU) ── */}
            <Link
              href="/bitpro"
              className="group rounded-3xl border border-emerald-200 bg-white p-5 sm:p-6 flex flex-col justify-between min-h-[430px] transition-all duration-200 hover:border-emerald-500 hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
            >
              <div className="space-y-3.5">
                {/* Visual Cover Banner */}
                <div className="w-full h-36 rounded-2xl overflow-hidden border border-emerald-100 bg-emerald-50 relative group-hover:scale-[1.02] transition-transform">
                  <img
                    src="/images/modules/bitpro.jpg"
                    alt="Ilustrasi Bitpro"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Activity size={20} />
                  </div>
                  <ArrowUpRight size={20} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Bitpro
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Perbibitan &amp; Produksi Ternak
                  </p>
                </div>

                <ul className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100 font-sans">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Database KTT &amp; Monev KTT
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Populasi &amp; Produksi Ternak
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> SapiTime &amp; Sertifikat SKLB
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Database IB &amp; Data Farm
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex items-center justify-between text-emerald-700 font-bold text-xs sm:text-sm">
                <span>Buka Bitpro</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* ── MODUL 02: KESWAN (TEMA BIRU) ── */}
            {isLoggedIn && !hasFullAccess ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-100/70 p-5 sm:p-6 flex flex-col justify-between min-h-[430px] relative opacity-85">
                <div className="space-y-3.5">
                  <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-200 grayscale relative">
                    <img
                      src="/images/modules/keswan.jpg"
                      alt="Ilustrasi Keswan"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Stethoscope size={20} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 font-bold flex items-center gap-1">
                      <Lock size={12} /> Terbatas
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Keswan</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Kesehatan Hewan &amp; Puskeswan</p>
                  </div>
                  <p className="text-xs text-slate-500 pt-3 border-t border-slate-200">
                    Modul ini membutuhkan hak akses khusus admin bidang kesehatan hewan.
                  </p>
                </div>
                <div className="pt-4 text-xs text-slate-500 flex items-center gap-1.5 font-semibold">
                  <Lock size={14} /> Memerlukan Izin Admin
                </div>
              </div>
            ) : (
              <Link
                href="/keswan"
                className="group rounded-3xl border border-blue-200 bg-white p-5 sm:p-6 flex flex-col justify-between min-h-[430px] transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
              >
                <div className="space-y-3.5">
                  {/* Visual Cover Banner */}
                  <div className="w-full h-36 rounded-2xl overflow-hidden border border-blue-100 bg-blue-50 relative group-hover:scale-[1.02] transition-transform">
                    <img
                      src="/images/modules/keswan.jpg"
                      alt="Ilustrasi Keswan"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Stethoscope size={20} />
                    </div>
                    <ArrowUpRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      Keswan
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Kesehatan Hewan &amp; Puskeswan
                    </p>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100 font-sans">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Data Vaksinasi PMK &amp; LSD
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Lalu Lintas Ternak
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Laporan Penyakit Ternak
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Kinerja 8 Unit Puskeswan
                    </li>
                  </ul>
                </div>

                <div className="pt-4 flex items-center justify-between text-blue-700 font-bold text-xs sm:text-sm">
                  <span>Buka Keswan</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )}

            {/* ── MODUL 03: KESMAVET (TEMA UNGU) ── */}
            {isLoggedIn && !hasFullAccess ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-100/70 p-5 sm:p-6 flex flex-col justify-between min-h-[430px] relative opacity-85">
                <div className="space-y-3.5">
                  <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-200 grayscale relative">
                    <img
                      src="/images/modules/kesmavet.jpg"
                      alt="Ilustrasi Kesmavet"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                      <FlaskConical size={20} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 font-bold flex items-center gap-1">
                      <Lock size={12} /> Terbatas
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Kesmavet</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Kesehatan Masyarakat Veteriner</p>
                  </div>
                  <p className="text-xs text-slate-500 pt-3 border-t border-slate-200">
                    Modul ini membutuhkan hak akses khusus admin bidang kesmavet.
                  </p>
                </div>
                <div className="pt-4 text-xs text-slate-500 flex items-center gap-1.5 font-semibold">
                  <Lock size={14} /> Memerlukan Izin Admin
                </div>
              </div>
            ) : (
              <Link
                href="/kesmavet"
                className="group rounded-3xl border border-purple-200 bg-white p-5 sm:p-6 flex flex-col justify-between min-h-[430px] transition-all duration-200 hover:border-purple-500 hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
              >
                <div className="space-y-3.5">
                  {/* Visual Cover Banner */}
                  <div className="w-full h-36 rounded-2xl overflow-hidden border border-purple-100 bg-purple-50 relative group-hover:scale-[1.02] transition-transform">
                    <img
                      src="/images/modules/kesmavet.jpg"
                      alt="Ilustrasi Kesmavet"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <FlaskConical size={20} />
                    </div>
                    <ArrowUpRight size={20} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      Kesmavet
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Kesehatan Masyarakat Veteriner
                    </p>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100 font-sans">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span> Nomor Kontrol Veteriner (NKV)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span> Data RPH, TPH &amp; TPU
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span> Pakan Ternak &amp; Pasar Hewan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span> Sertifikasi Halal &amp; ASUH
                    </li>
                  </ul>
                </div>

                <div className="pt-4 flex items-center justify-between text-purple-700 font-bold text-xs sm:text-sm">
                  <span>Buka Kesmavet</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )}

            {/* ── MODUL 04: ASET (TEMA AMBER) ── */}
            <Link
              href="/aset"
              className="group rounded-3xl border border-amber-200 bg-white p-5 sm:p-6 flex flex-col justify-between min-h-[430px] transition-all duration-200 hover:border-amber-500 hover:shadow-md hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
            >
              <div className="space-y-3.5">
                {/* Visual Cover Banner */}
                <div className="w-full h-36 rounded-2xl overflow-hidden border border-amber-100 bg-amber-50 relative group-hover:scale-[1.02] transition-transform">
                  <img
                    src="/images/modules/aset.jpg"
                    alt="Ilustrasi Aset Sarpras"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Boxes size={20} />
                  </div>
                  <ArrowUpRight size={20} className="text-slate-300 group-hover:text-amber-600 transition-colors" />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Aset
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Manajemen Aset &amp; Sarpras
                  </p>
                </div>

                <ul className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100 font-sans">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">✓</span> Inventaris Sarpras &amp; Hibah
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">✓</span> Titik Koordinat GPS Kandang
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">✓</span> Berita Acara &amp; Mutasi Aset
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">✓</span> Katalog Sarana Prasarana
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex items-center justify-between text-amber-700 font-bold text-xs sm:text-sm">
                <span>Buka Aset</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 bg-white">
        &copy; {new Date().getFullYear()} SiMantap — Bidang Peternakan dan Kesehatan Hewan Kabupaten Kebumen
      </footer>

    </div>
  );
}