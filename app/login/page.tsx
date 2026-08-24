'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../supabase';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Loader2,
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
      setErrorMsg('Login gagal. Periksa kembali email dan kata sandi Anda.');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0118] flex flex-col items-center justify-center px-6 py-16">
      {/* ambient blob orbs — consistent with SiMantap glassmorphism baseline */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />

      {/* radial spotlight glow behind the card, matches reference */}
      <div
        className="pointer-events-none absolute left-1/2 top-[8%] h-[36rem] w-[46rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(168,85,247,0.35) 0%, rgba(124,58,237,0.15) 40%, transparent 70%)',
        }}
      />

      {/* back link */}
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-white"
      >
        ← Kembali
      </Link>

      <div className="relative z-10 flex w-full flex-col items-center">
        {/* eyebrow badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <span className="text-xs text-white/60">
            Portal Internal SiMantap
          </span>
        </div>

        {/* headline, same treatment as reference hero */}
        <h1
          className="mb-3 max-w-lg px-4 text-center text-4xl md:text-5xl font-medium leading-tight"
          style={{
            background:
              'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.03em',
          }}
        >
          Masuk ke SiMantap
        </h1>
        <p className="mb-10 max-w-md px-4 text-center text-sm text-white/50">
          Sistem Informasi Manajemen Ternak Terpadu — Dinas Pertanian dan
          Pangan Kabupaten Kebumen
        </p>

        {/* glass login card */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 md:p-9 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ChatGPT_Image_29_Jun_2026,_19.58.30.png"
              alt="Logo SiMantap"
              className="h-16 w-16 rounded-full border-2 border-white/20 object-cover shadow-md"
            />
          </div>

          {errorMsg && (
            <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-white/50"
            >
              ID Petugas (Email)
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                id="email"
                type="email"
                placeholder="admin@pkh.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-violet-400/60"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-white/50"
              >
                Kata Sandi
              </label>
              <Link
                href="/lupa-sandi"
                className="text-xs font-medium text-violet-300 hover:text-white transition-colors"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-11 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-violet-400/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-white via-white/95 to-white/70 py-4 font-bold text-[#4c1d95] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Masuk Sekarang
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="mt-7 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3">
              <ShieldCheck size={16} className="text-violet-300" />
              <span className="text-center text-[10px] font-medium text-white/50 leading-tight">
                Aman &amp; Terenkripsi
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3">
              <Zap size={16} className="text-violet-300" />
              <span className="text-center text-[10px] font-medium text-white/50 leading-tight">
                Data Real-time
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3">
              <Layers size={16} className="text-violet-300" />
              <span className="text-center text-[10px] font-medium text-white/50 leading-tight">
                3 Modul Terpadu
              </span>
            </div>
          </div>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/30">
          Butuh bantuan akses? Hubungi admin bidang PKH
        </p>
      </div>
    </div>
  );
}