'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Landmark,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg('Login gagal. Periksa kembali ID Petugas atau kata sandi Anda.');
    } else {
      router.push('/beranda');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* Top Bar Navigation (Lega) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex items-center justify-between">
        <Link
          href="/"
          className="min-h-touch h-11 px-4 sm:px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Portal Publik</span>
        </Link>
      </header>

      {/* Main Login Card Area */}
      <main className="w-full max-w-md mx-auto px-4 py-6 sm:py-10">
        
        {/* Brand & Identity */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-2 mx-auto flex items-center justify-center shadow-xs">
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
              <Landmark size={24} />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Masuk SiMantap
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
            Sistem Informasi Peternakan & Kesehatan Hewan Dinas Pertanian dan Pangan Kebumen
          </p>
        </div>

        {/* Form Box */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Autentikasi Petugas Dinas
              </h2>
              <p className="text-xs text-slate-500">
                Akses aman terenkripsi untuk petugas terdaftar
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Field Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                ID Petugas
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="petugas@pkh.kebumenkab.go.id"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-touch-lg h-12 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Field Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-touch-lg h-12 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="min-h-touch min-w-touch w-11 h-11 absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-touch-lg h-12 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 mt-6 shadow-xs hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard Petugas</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 leading-relaxed">
            Butuh bantuan akses atau lupa kata sandi? Hubungi Administrator Teknis Bidang PKH Distapang Kebumen.
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Pemerintah Kabupaten Kebumen. Seluruh Hak Cipta Dilindungi.
      </footer>

    </div>
  );
}