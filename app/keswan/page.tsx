'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';

/* ─────────────────────────────────────────────
   KOMPONEN KARTU 3D LIQUID GLASS (BIRU KESWAN)
───────────────────────────────────────────── */
function KeswanCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // Efek kemiringan 3D sinematik
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -8;
    const tiltY = ((x - centerX) / centerX) * 8;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const glowColor = 'rgba(96, 165, 250, 0.5)';

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setTilt({ x: 0, y: 0 });
        setHovered(false);
      }}
      style={{
        transform: hovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale(1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        transition: hovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: hovered
          ? `0 25px 50px -12px ${glowColor}, 0 0 0 1px rgba(255,255,255,0.3)`
          : '0 10px 30px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.15)',
      }}
      className="relative group flex flex-col p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/10 overflow-hidden cursor-pointer"
    >
      {/* Garis cahaya sorot di atas (Highlight) */}
      <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Cahaya gradient internal saat di-hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(96, 165, 250, 0.2), transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center h-full">
        {/* Kontainer Ikon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner transition-transform duration-500 group-hover:scale-110 border bg-blue-400/20 border-blue-400/30 text-blue-200">
          {icon}
        </div>

        <h3 className="text-xl font-black text-white mb-2 tracking-tight transition-colors duration-300 group-hover:text-blue-200">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-sky-50/70 font-medium leading-relaxed max-w-[200px]">
          {desc}
        </p>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   HALAMAN UTAMA KESWAN
───────────────────────────────────────────── */
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
    router.push('/');
  };

  const menus = [
    {
      title: 'Data Vaksinasi',
      desc: 'Pencatatan Vaksinasi Ternak',
      icon: '💉',
      path: '/keswan/data-vaksinasi',
    },
    {
      title: 'Lalu Lintas Ternak',
      desc: 'Pemantauan Ternak',
      icon: '🚚',
      path: '/keswan/lalu-lintas-hewan-ternak',
    },
    {
      title: 'Laporan Penyakit',
      desc: 'Data Sebaran Penyakit Hewan',
      icon: '🦠',
      path: '/keswan/laporan-penyakit',
    },
    {
      title: 'Puskeswan',
      desc: 'Pusat Kesehatan Hewan',
      icon: '🏥',
      path: '/keswan/puskeswan',
    },
  ];

  if (!isAuthorized)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c314c] text-sky-300 font-bold tracking-widest uppercase">
        Memeriksa Akses...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F4C81] via-[#0C3B68] to-[#082A4E] relative overflow-hidden flex flex-col items-center pt-8 px-6 pb-24 font-sans">
      
      {/* ── Background Ambient Glow ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[0%] left-[10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[120px]" />
      </div>

      {/* ── Navigasi Atas ── */}
      <div className="relative z-10 w-full max-w-4xl flex justify-between items-center mb-16">
        <Link
          href="/beranda"
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-2xl font-bold text-white transition-all border border-white/20 shadow-sm text-sm"
        >
          ← Kembali ke Beranda
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-200 backdrop-blur-md px-6 py-2.5 rounded-2xl font-bold transition-all border border-red-500/30 shadow-sm text-sm flex items-center gap-2"
        >
          Keluar Sistem 🚪
        </button>
      </div>

      {/* ── Header Judul ── */}
      <div className="relative z-10 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-md">
          Modul Keswan
        </h1>
        <p className="text-sky-200 text-sm md:text-base font-bold tracking-widest uppercase drop-shadow-sm">
          Sistem Manajemen Kesehatan Hewan
        </p>
      </div>

      {/* ── Grid Kartu Menu (2x2) ── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        {menus.map((menu, index) => (
          <KeswanCard
            key={index}
            href={menu.path}
            title={menu.title}
            desc={menu.desc}
            icon={menu.icon}
          />
        ))}
      </div>
    </div>
  );
}