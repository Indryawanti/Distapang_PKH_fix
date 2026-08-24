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
  Loader2,
  AlertCircle,
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
    <div className="relative min-h-screen bg-[#090A0F] text-slate-100 font-sans flex flex-col items-center justify-center px-4 sm:px-6 py-12 selection:bg-azure selection:text-white">
      
      {/* Back button (44px target) */}
      <Link
        href="/"
        className="min-h-touch min-w-touch h-11 px-4 rounded-xl border border-[#262C3D] bg-[#12151E] text-slate-300 text-xs font-semibold absolute left-4 sm:left-8 top-6 z-20 flex items-center gap-2 hover:bg-[#181C28] transition-colors"
      >
        ← Kembali ke Portal Publik
      </Link>

      <div className="relative z-10 flex w-full flex-col items-center max-w-md mx-auto pt-10 sm:pt-0">
        
        {/* Eyebrow badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#262C3D] bg-[#12151E] px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-lime shrink-0" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Portal Internal Dinas
          </span>
        </div>

        {/* Editorial Headline */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-azure/40 p-2 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <img
              src="/logo-simantap.png"
              alt="Logo SiMantap"
              className="w-full h-full object-contain"
              onError={(e: any) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'block';
              }}
            />
            <span className="hidden text-2xl">🏛️</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Masuk SiMantap
          </h1>
          <p className="text-sm text-slate-400 font-normal">
            Bidang Peternakan dan Kesehatan Hewan Kabupaten Kebumen
          </p>
        </div>

        {/* Login Form Box */}
        <form
          onSubmit={handleLogin}
          className="w-full rounded-3xl border border-[#262C3D] bg-[#12151E] p-6 sm:p-8 shadow-2xl space-y-4"
        >
          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-mono font-bold uppercase tracking-wider text-slate-300"
            >
              ID Petugas (Email)
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                id="email"
                type="email"
                placeholder="admin@pkh.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-touch-lg h-12 rounded-xl border border-[#262C3D] bg-[#090A0F] py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-azure transition-colors font-sans"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-mono font-bold uppercase tracking-wider text-slate-300"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-touch-lg h-12 rounded-xl border border-[#262C3D] bg-[#090A0F] py-3.5 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none focus:border-azure transition-colors font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="min-h-touch min-w-touch w-11 h-11 absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-touch-lg h-13 rounded-xl bg-azure text-white font-bold text-base flex items-center justify-center gap-2 mt-6 shadow-[0_8px_20px_rgba(33,146,255,0.3)] hover:bg-azure/90 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="mt-6 pt-5 border-t border-[#262C3D] grid grid-cols-3 gap-2 text-center text-slate-400">
            <div className="p-2 rounded-lg bg-[#181C28] border border-[#262C3D] text-[11px] font-mono">
              🔒 Terenkripsi
            </div>
            <div className="p-2 rounded-lg bg-[#181C28] border border-[#262C3D] text-[11px] font-mono">
              ⚡ Real-time
            </div>
            <div className="p-2 rounded-lg bg-[#181C28] border border-[#262C3D] text-[11px] font-mono">
              🏛️ Resmi PKH
            </div>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Butuh bantuan akses? Hubungi admin teknis bidang PKH.
        </p>

      </div>
    </div>
  );
}