'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../supabase'; // Pastikan path ini benar
import AuroraBackground from '@/components/ui/animated-background';

/* ─────────────────────────────────────────────
   INTRO ANIMATION STYLES
───────────────────────────────────────────── */
const INTRO_STYLES = `
@keyframes logo3dFlip {
  0%   { transform: perspective(700px) rotateY(-120deg) scale(0.3); opacity: 0; }
  35%  { transform: perspective(700px) rotateY(18deg)  scale(1.08); opacity: 1; }
  60%  { transform: perspective(700px) rotateY(-8deg)  scale(0.97); opacity: 1; }
  80%  { transform: perspective(700px) rotateY(4deg)   scale(1.02); opacity: 1; }
  100% { transform: perspective(700px) rotateY(0deg)   scale(1);    opacity: 1; }
}
@keyframes logoPop {
  0%   { transform: perspective(700px) scale(1)   translateZ(0px);   opacity: 1; }
  50%  { transform: perspective(700px) scale(2.4) translateZ(80px);  opacity: 0.85; }
  100% { transform: perspective(700px) scale(5)   translateZ(200px); opacity: 0; }
}
@keyframes overlayFadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes contentReveal {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes introGlowPulse {
  0%, 100% { transform: scale(1);    opacity: 0.55; }
  50%       { transform: scale(1.12); opacity: 0.85; }
}
@keyframes floatUp {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 0.8; }
  50%  { opacity: 0.5; }
  100% { transform: translateY(-120vh) translateX(30px); opacity: 0; }
}
@keyframes cardFloat {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@media (max-width: 768px) {
  .noise-overlay {
    display: none !important;
  }
  .particle:nth-child(n + 10) {
    display: none !important;
  }
  .particle {
    box-shadow: none !important;
  }
}
@media (max-width: 768px) and (prefers-reduced-motion: reduce) {
  .particle {
    animation: none !important;
  }
}
`;

/* ─────────────────────────────────────────────
   FLOATING PARTICLE
───────────────────────────────────────────── */
function Particle({ delay, left, size, duration }: { delay: number; left: string; size: number; duration: number }) {
  return (
    <div
      className="particle absolute rounded-full bg-white pointer-events-none"
      style={{
        left,
        bottom: '-10%',
        width: size,
        height: size,
        boxShadow: '0 0 8px 2px rgba(255,255,255,0.6)',
        animation: `floatUp ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   3D TILT MODULE CARD
───────────────────────────────────────────── */
function ModuleCard({ href, image, title, glow, locked = false }: any) {
  const cardRef = useRef<HTMLAnchorElement | HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (locked) return;

    // Throttle pakai requestAnimationFrame supaya tidak update state
    // puluhan kali per detik (inilah penyebab efek "getar")
    if (rafId.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafId.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      rafId.current = null;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const dx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      // Sensitivitas diperkecil (14 -> 8) + di-clamp biar tidak ekstrem
      const clampedX = Math.max(-1, Math.min(1, dx));
      const clampedY = Math.max(-1, Math.min(1, dy));
      setTilt({ x: -clampedY * 8, y: clampedX * 8 });
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const cardStyle: React.CSSProperties = {
    transform: hovered && !locked
        ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-14px) scale(1.06)`
        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
    transition: hovered && !locked
        ? 'transform 0.18s ease-out, filter 0.3s ease' // dulu 0.1s → sedikit lebih smooth
        : 'transform 0.5s cubic-bezier(0.23,1,0.32,1), filter 0.5s ease',
    filter: hovered && !locked
        ? `drop-shadow(0 40px 45px ${glow}) drop-shadow(0 0 25px ${glow})`
        : `drop-shadow(0 18px 24px ${glow.replace('0.55', '0.25')})`,
    // animasi float otomatis DIMATIKAN saat hover, supaya tidak bentrok
    // dengan transform tilt (ini sumber "getar" kedua)
    animation: !hovered ? 'cardFloat 6s ease-in-out infinite' : 'none',
    willChange: 'transform',
  };

  const CardContent = (
    <>
      <img
        src={image}
        alt={title}
        className="w-full h-auto select-none pointer-events-none drop-shadow-2xl"
        draggable={false}
      />
      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[2rem] bg-black/60 backdrop-blur-sm">
          <span className="text-4xl">🔒</span>
          <span className="bg-red-500/90 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
            Akses Ditolak
          </span>
        </div>
      )}
    </>
  );

  if (locked) {
    return (
      <div
        ref={cardRef as any}
        style={cardStyle}
        className="relative w-full max-w-[320px] mx-auto cursor-not-allowed"
        onClick={() => alert('Akses Ditolak: Modul ini bukan kewenangan Anda.')}
      >
        {CardContent}
      </div>
    );
  }

  return (
    <Link
      ref={cardRef as any}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => { setHovered(true); setTilt({ x: 10, y: 0 }); }}
      onTouchEnd={() => { setTimeout(() => { setHovered(false); setTilt({ x: 0, y: 0 }); }, 200); }}
      style={cardStyle}
      className="relative w-full max-w-[320px] mx-auto block cursor-pointer"
    >
      {CardContent}
    </Link>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [introPhase, setIntroPhase] = useState<'flip' | 'pop' | 'done'>('flip');

  /* Auth & Hak Akses Supabase BERDASARKAN EMAIL */
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session && session.user?.email) {
        const email = session.user.email;
        setUserEmail(email);
        if (email.toLowerCase().includes('admin')) {
          setHasFullAccess(true);
        } else {
          setHasFullAccess(false);
        }
      }
    };
    checkSession();
  }, []);

  /* Intro sequence */
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase('pop'), 1500);
    const t2 = setTimeout(() => setIntroPhase('done'), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const particles = useRef(
    Array.from({ length: 26 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 12,
    }))
  ).current;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INTRO_STYLES }} />

      {/* ── INTRO OVERLAY ── */}
      {introPhase !== 'done' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#130126]"
          style={introPhase === 'pop' ? { animation: 'overlayFadeOut 0.55s ease 0.45s forwards' } : {}}
        >
          <div
            className="absolute w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(79,70,229,0.2) 60%, transparent 100%)',
              animation: 'introGlowPulse 1.6s ease-in-out infinite',
            }}
          />
          <img
            src="/ChatGPT_Image_29_Jun_2026,_19.58.30.png"
            alt="Logo SiMantap"
            className="relative w-52 h-52 rounded-full border-4 border-white/80 shadow-2xl object-cover bg-white"
            style={{
              animation: introPhase === 'flip'
                  ? 'logo3dFlip 1.4s cubic-bezier(0.23,1,0.32,1) forwards'
                  : 'logoPop 0.55s cubic-bezier(0.55,0,1,0.45) forwards',
            }}
          />
        </div>
      )}

      {/* ── MAIN CONTENT DENGAN AURORA BACKGROUND ── */}
      <AuroraBackground
        className={introPhase === 'done' ? 'animate-[contentReveal_0.6s_ease_forwards]' : 'opacity-0 pointer-events-none'}
      >
        {/* ── PARTIKEL MENGAMBANG ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          {particles.map((p, i) => (
            <Particle key={i} left={p.left} size={p.size} duration={p.duration} delay={p.delay} />
          ))}
        </div>

        {/* ── NOISE OVERLAY ── */}
        <div
          className="noise-overlay pointer-events-none absolute inset-0 z-0"
          style={{ backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)' }}
        >
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.038,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'repeat',
              backgroundSize: '180px 180px',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 pt-14 pb-24 md:px-12">
          <div className="relative mb-10 mt-2">
            <div className="absolute -inset-10 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute -inset-5 rounded-full bg-gradient-to-tr from-fuchsia-400/50 via-purple-300/40 to-sky-400/40 blur-2xl" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent blur-sm" />
            <img
              src="/ChatGPT_Image_29_Jun_2026,_19.58.30.png"
              alt="Logo SiMantap"
              className="relative w-44 h-44 md:w-56 md:h-56 rounded-full border-[3px] border-white/70 shadow-2xl object-cover bg-white animate-float"
            />
          </div>

          <div className="text-center mb-12 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight text-white">
              Sistem Informasi Manajemen
              <br />
              <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-300 bg-clip-text text-transparent">
                Peternakan Terpadu
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-medium">
              Bidang Peternakan dan Kesehatan Hewan
            </p>
          </div>

          <div className="mb-16 flex flex-col items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="bg-white/10 px-6 py-2 rounded-full border border-white/20 text-sm font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-2">
                  👤 {userEmail}
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-[10px] uppercase ${
                      hasFullAccess
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                    }`}
                  >
                    {hasFullAccess ? 'Admin' : 'Petugas'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="group bg-red-500/70 backdrop-blur-md text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-red-900/40 border border-red-400/30 flex items-center gap-3"
                >
                  <span className="transition-transform group-hover:-translate-x-1">🚪</span> KELUAR (LOGOUT)
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="group bg-white text-[#3b0764] px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-black/40 border border-white/80 flex items-center gap-3"
              >
                <span className="transition-transform group-hover:rotate-12">🔐</span> LOGIN PETUGAS
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl items-center">
            <ModuleCard
              href="/bitpro"
              image="/card-bitpro.png"
              title="Bitpro - Perbibitan & Produksi"
              glow="rgba(16, 185, 129, 0.55)"
              locked={false}
            />
            <ModuleCard
              href="/keswan"
              image="/card-keswan.png"
              title="Keswan - Kesehatan Hewan"
              glow="rgba(59, 130, 246, 0.55)"
              locked={isLoggedIn && !hasFullAccess}
            />
            <ModuleCard
              href="/kesmavet"
              image="/card-kesmavet.png"
              title="Kesmavet - Kesehatan Masyarakat Veteriner"
              glow="rgba(139, 92, 246, 0.55)"
              locked={isLoggedIn && !hasFullAccess}
            />
          </div>

          <p className="text-center text-white/40 text-sm mt-20 font-medium">
            &copy; {new Date().getFullYear()} SiMantap — Sistem Informasi Manajemen Peternakan Terpadu
          </p>
        </div>
      </AuroraBackground>
    </>
  );
}