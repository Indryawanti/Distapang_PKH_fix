'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabase';

/* ─────────────────────────────────────────────
   THEME TOKENS, TYPE, TEXTURE
   (Ditambahkan Anti-Jitter & Font Smoothing)
───────────────────────────────────────────── */
const BG_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap');

/* ANTI-GETAR (Kunci Scrollbar & Font Smoothing) */
body {
  overflow-y: scroll !important; 
}
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-jakarta, .simantap-theme, .simantap-theme * { font-family: 'Plus Jakarta Sans', sans-serif; }
.font-display { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; letter-spacing: -0.02em; }
.font-data { font-family: 'IBM Plex Mono', monospace; }

/* DARK MODE (DEFAULT) */
.simantap-theme {
  --canvas: #000000;
  --paper: #0C0C10;
  --paper-soft: rgba(255,255,255,0.035);
  --ink: #FFFFFF;
  --ink-soft: #9CA3AF;
  --ink-faint: #6B7280;
  --line: rgba(255,255,255,0.09);
  --line-strong: rgba(255,255,255,0.16);

  --green: #8B5CF6;
  --green-deep: #C4B5FD;
  --green-soft: rgba(139,92,246,0.14);
  --gold: #E4B15C;
  --gold-soft: rgba(228,177,92,0.14);
  --blue: #7DB4E8;
  --blue-soft: rgba(125,180,232,0.14);
  --plum: #F186B4;
  --plum-soft: rgba(241,134,180,0.14);
}

/* LIGHT MODE */
.simantap-theme.light-mode {
  --canvas: #F8FAFC;
  --paper: #FFFFFF;
  --paper-soft: #F1F5F9;
  --ink: #0F172A;
  --ink-soft: #475569;
  --ink-faint: #94A3B8;
  --line: #E2E8F0;
  --line-strong: #CBD5E1;

  --green: #7C3AED;
  --green-deep: #5B21B6;
  --green-soft: #EDE9FE;
  --gold: #D97706;
  --gold-soft: #FEF3C7;
  --blue: #2563EB;
  --blue-soft: #DBEAFE;
  --plum: #DB2777;
  --plum-soft: #FCE7F3;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes tabSettle { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0px); } }
@keyframes barGrow { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
@keyframes modalFadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(12px); } }
@keyframes modalSlideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--line-strong); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--ink-faint); }
`;

/* ─────────────────────────────────────────────
   DATA SOURCE DATA LENGKAP KEBUMEN (2025)
───────────────────────────────────────────── */
const REKAP_POPULASI_2025 = [
  { komoditas: 'Sapi Potong', total: 64996, icon: '🐄' },
  { komoditas: 'Sapi Perah', total: 0, icon: '🐄' },
  { komoditas: 'Kerbau', total: 170, icon: '🐃' },
  { komoditas: 'Kuda', total: 274, icon: '🐎' },
  { komoditas: 'Kambing', total: 101255, icon: '🐐' },
  { komoditas: 'Domba', total: 25552, icon: '🐑' },
  { komoditas: 'Babi', total: 780, icon: '🐖' },
  { komoditas: 'Ayam Kampung', total: 864412, icon: '🐣' },
  { komoditas: 'Ayam Petelur', total: 73976, icon: '🐓' },
  { komoditas: 'Ayam Broiler', total: 2636000, icon: '🐔' },
  { komoditas: 'Puyuh', total: 70808, icon: '🐦' },
  { komoditas: 'Itik', total: 87200, icon: '🦆' },
  { komoditas: 'Entog', total: 81573, icon: '🦢' },
  { komoditas: 'Angsa', total: 2153, icon: '🪿' },
  { komoditas: 'Merpati', total: 54168, icon: '🕊️' },
  { komoditas: 'Kelinci', total: 3907, icon: '🐇' },
];

const dataDaging = [
  { jenis: 'Sapi Potong', total: 2671799 },
  { jenis: 'Kambing Potong', total: 476066.4 },
  { jenis: 'Ayam Ras Pedaging', total: 11218855 },
  { jenis: 'Domba', total: 35032.42 },
  { jenis: 'Babi', total: 5947.94 },
  { jenis: 'Itik', total: 67869 },
];

const dataTelur = [
  { jenis: 'Ayam Ras Petelur Produktif', total: 641709.53 },
  { jenis: 'Ayam Buras', total: 2389258.2 },
  { jenis: 'Itik', total: 786706.0 },
  { jenis: 'Burung Puyuh', total: 121869 },
  { jenis: 'Entog', total: 687138.55 },
];

const REKAP_SEBARAN_FARM = [
  { komoditas: 'Ayam Broiler', jumlah_farm: 111, total_populasi: '1.435.000 Ekor' },
  { komoditas: 'Ayam Petelur', jumlah_farm: 112, total_populasi: '184.500 Ekor' },
  { komoditas: 'Sapi Potong (KTT Terbina)', jumlah_farm: 3, total_populasi: '116 Ekor' },
  { komoditas: 'Domba & Kambing', jumlah_farm: 5, total_populasi: '445 Ekor' },
  { komoditas: 'Babi (Perorangan)', jumlah_farm: 11, total_populasi: '315 Ekor' },
];

const TOP_KOMODITAS = [...REKAP_POPULASI_2025].filter((d) => d.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);
const TOP_DAGING = [...dataDaging].sort((a, b) => b.total - a.total).slice(0, 5);
const TOP_TELUR = [...dataTelur].sort((a, b) => b.total - a.total).slice(0, 5);

const TOTAL_POPULASI = REKAP_POPULASI_2025.reduce((sum, d) => sum + d.total, 0);
const TOTAL_DAGING = dataDaging.reduce((sum, d) => sum + d.total, 0);
const TOTAL_TELUR = dataTelur.reduce((sum, d) => sum + d.total, 0);
const TOTAL_FARM = REKAP_SEBARAN_FARM.reduce((sum, d) => sum + d.jumlah_farm, 0);

const METRIC_CONFIGS = {
  populasi: { label: 'Populasi Ternak', unit: 'Ekor', data: TOP_KOMODITAS, max: TOP_KOMODITAS[0]?.total ?? 1, getIcon: (r: any) => r.icon, getName: (r: any) => r.komoditas },
  daging: { label: 'Produksi Daging', unit: 'Kg', data: TOP_DAGING, max: TOP_DAGING[0]?.total ?? 1, getIcon: () => '🥩', getName: (r: any) => r.jenis },
  telur: { label: 'Produksi Telur', unit: 'Kg', data: TOP_TELUR, max: TOP_TELUR[0]?.total ?? 1, getIcon: () => '🥚', getName: (r: any) => r.jenis },
} as const;

const MODULES = [
  { key: 'bitpro', label: 'Bitpro', caption: 'Perbibitan & Produksi', icon: '/card-bitpro.png', fallback: '🐄', accent: 'var(--green)', accentSoft: 'var(--green-soft)' },
  { key: 'keswan', label: 'Keswan', caption: 'Kesehatan Hewan', icon: '/card-keswan.png', fallback: '🩺', accent: 'var(--blue)', accentSoft: 'var(--blue-soft)' },
  { key: 'kesmavet', label: 'Kesmavet', caption: 'Kesehatan Masyarakat Veteriner', icon: '/card-kesmavet.png', fallback: '🔬', accent: 'var(--plum)', accentSoft: 'var(--plum-soft)' },
] as const;

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const ArrowRight = ({ className = '', size = 16 }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
const MenuIcon = ({ className = '', size = 22 }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);
const XIcon = ({ className = '', size = 22 }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" /><circle cx="12" cy="12" r="3" /></svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a13.6 13.6 0 0 1-2.94 3.68M6.1 6.1C3.4 7.9 1 12 1 12s4 7 11 7a9.4 9.4 0 0 0 4.24-1M14.12 14.12a3 3 0 1 1-4.24-4.24" /><path d="M1 1l22 22" /></svg>
  );

/* ─────────────────────────────────────────────
   NAVIGATION — Diubah menerima prop onLoginClick + THEME
───────────────────────────────────────────── */
const Navigation = ({ onLoginClick, theme, toggleTheme }: { onLoginClick: () => void, theme: string, toggleTheme: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = [
    { href: '#ringkasan', label: 'Ringkasan' },
    { href: '#modul', label: 'Modul Data' },
    { href: '#bantuan', label: 'Bantuan' },
  ];

  return (
    <header className="fixed top-0 w-full z-40 border-b backdrop-blur-md" style={{ borderColor: 'var(--line)', background: 'var(--paper-soft)' }}>
      <nav className="max-w-6xl mx-auto px-5 md:px-6 py-4">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-[0_0_15px_rgba(139,92,246,0.3)] overflow-hidden">
              <img 
                src="/logo-simantap.png" 
                alt="Logo SiMantap" 
                className="w-full h-full object-contain"
                onError={(e: any) => { 
                  e.currentTarget.style.display = 'none'; 
                  e.currentTarget.nextSibling.style.display = 'flex'; 
                }} 
              />
              <span className="hidden items-center justify-center text-sm">🔏</span>
            </div>
            <span className="text-lg md:text-xl font-bold tracking-wide" style={{ color: 'var(--ink)' }}>
              SiMantap
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm transition-colors hover:opacity-100" style={{ color: 'var(--ink-soft)' }}>{l.label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#bantuan" className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium transition-colors hover:bg-black/5" style={{ color: 'var(--ink)' }}>
              Bantuan Akses
            </a>
            
            {/* TOMBOL GANTI TEMA TERANG / GELAP */}
            <button 
              onClick={toggleTheme} 
              className="w-10 h-10 flex items-center justify-center rounded-lg border transition-colors hover:bg-black/5 text-lg" 
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* active:scale-[0.98] agar kliknya lebih lembut dan tidak bergetar berlebihan */}
            <button
              onClick={onLoginClick}
              className="inline-flex items-center justify-center h-10 px-5 rounded-md text-sm font-semibold transition-transform duration-200 active:scale-[0.98] hover:brightness-110"
              style={{ background: 'var(--green)', color: '#fff' }}
            >
              Masuk
            </button>
          </div>

          <button type="button" className="md:hidden" style={{ color: 'var(--ink)' }} onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Buka menu">
            {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t backdrop-blur-md" style={{ borderColor: 'var(--line)', background: 'var(--paper)', animation: 'slideDown 0.3s ease-out' }}>
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm py-1 transition-colors hover:opacity-100" style={{ color: 'var(--ink-soft)' }} onClick={() => setMobileMenuOpen(false)}>{l.label}</a>
            ))}
            
            <button onClick={toggleTheme} className="text-left text-sm py-1 font-semibold flex items-center gap-2" style={{ color: 'var(--ink)' }}>
              {theme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
            </button>

            <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
              <button
                onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                className="text-center py-2.5 rounded-md text-sm font-semibold w-full"
                style={{ background: 'var(--green)', color: '#fff' }}
              >
                Masuk Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

/* ─────────────────────────────────────────────
   FOLDER-TAB & KPI WIDGETS
───────────────────────────────────────────── */
const ModuleTab = ({ mod, active, onClick, index }: any) => (
  // Dibuang hover:-translate-y-0.5 untuk mencegah subpixel jitter
  <button onClick={onClick} style={{ animation: `tabSettle 0.4s ease ${index * 0.06}s both` }} className={`group relative flex-1 min-w-0 text-left rounded-t-2xl transition-all duration-200 ${active ? 'z-10' : 'hover:brightness-110'}`}>
    <div className="h-1.5 w-full rounded-t-full transition-opacity" style={{ background: mod.accent, opacity: active ? 1 : 0.25 }} />
    <div className={`flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start text-center sm:text-left gap-1.5 sm:gap-4 px-2 py-3 sm:px-5 sm:py-5 border border-b-0 rounded-t-2xl transition-colors ${active ? 'shadow-[0_-6px_16px_-10px_rgba(0,0,0,0.5)]' : ''}`} style={{ background: active ? 'var(--paper)' : 'var(--paper-soft)', borderColor: active ? 'var(--line-strong)' : 'var(--line)' }}>
      <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-base sm:text-2xl border" style={{ background: mod.accentSoft, borderColor: mod.accent + '33' }}>
        <img src={mod.icon} alt={mod.label} draggable={false} className="w-full h-full object-cover select-none pointer-events-none" onError={(e: any) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} />
        <span className="hidden">{mod.fallback}</span>
      </div>
      <div className="min-w-0 w-full">
        <p className="font-display font-semibold text-[11px] leading-tight sm:text-lg truncate" style={{ color: active ? 'var(--ink)' : 'var(--ink-soft)' }}>{mod.label}</p>
        <p className="hidden sm:block text-xs font-medium truncate" style={{ color: 'var(--ink-faint)' }}>{mod.caption}</p>
      </div>
    </div>
  </button>
);

const StatWidget = ({ icon, title, value, accent, accentSoft, onClick }: any) => {
  const isPlaceholder = value === 'Coming soon';
  return (
    // Dibuang hover:-translate-y-0.5 untuk mencegah jitter
    <button onClick={onClick} className="w-full text-left p-4 rounded-xl border flex items-center gap-3.5 transition-all hover:shadow-md hover:brightness-110 active:scale-[0.99] cursor-pointer" style={{ background: 'var(--paper-soft)', borderColor: 'var(--line)', borderLeftWidth: '3px', borderLeftColor: accent }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: accentSoft }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5 leading-snug" style={{ color: 'var(--ink-faint)' }}>{title}</p>
        <p className={`font-data font-bold leading-tight ${isPlaceholder ? 'italic text-xs opacity-60' : 'text-base truncate'}`} style={{ color: isPlaceholder ? 'var(--ink-soft)' : 'var(--ink)' }}>{value}</p>
      </div>
      <svg className="shrink-0" viewBox="0 0 24 24" width="16" height="16" stroke="var(--ink-faint)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>
  );
};

const RingkasanQuickStats = () => {
  const stats = [
    { label: 'Total Ternak', value: TOTAL_POPULASI.toLocaleString('id-ID'), unit: 'Ekor', icon: '🐾', accent: 'var(--green)', soft: 'var(--green-soft)' },
    { label: 'Produksi Daging', value: Math.round(TOTAL_DAGING).toLocaleString('id-ID'), unit: 'Kg', icon: '🥩', accent: 'var(--gold)', soft: 'var(--gold-soft)' },
    { label: 'Produksi Telur', value: Math.round(TOTAL_TELUR).toLocaleString('id-ID'), unit: 'Kg', icon: '🥚', accent: 'var(--blue)', soft: 'var(--blue-soft)' },
    { label: 'Sebaran Farm', value: TOTAL_FARM.toLocaleString('id-ID'), unit: 'Unit', icon: '🏡', accent: 'var(--plum)', soft: 'var(--plum-soft)' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border p-3" style={{ background: 'var(--paper-soft)', borderColor: 'var(--line)' }}>
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm mb-2" style={{ background: s.soft }}>{s.icon}</div>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5 truncate" style={{ color: 'var(--ink-faint)' }}>{s.label}</p>
          <p className="font-data font-bold text-sm truncate" style={{ color: s.accent }}>{s.value} <span className="text-[10px] font-semibold" style={{ color: 'var(--ink-faint)' }}>{s.unit}</span></p>
        </div>
      ))}
    </div>
  );
};

const RankedBarWidget = () => {
  const [metric, setMetric] = useState<keyof typeof METRIC_CONFIGS>('populasi');
  const cfg = METRIC_CONFIGS[metric];

  return (
    <div className="rounded-xl border p-4 md:p-5 mb-4" style={{ background: 'var(--paper-soft)', borderColor: 'var(--line)' }}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="font-display font-semibold text-sm" style={{ color: 'var(--ink)' }}>Peringkat {cfg.label} Tertinggi</p>
        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border" style={{ color: 'var(--ink-faint)', borderColor: 'var(--line-strong)' }}>Data 2025</span>
      </div>

      <div className="flex gap-1.5 mb-4">
        {(Object.keys(METRIC_CONFIGS) as (keyof typeof METRIC_CONFIGS)[]).map((key) => (
          <button
            key={key}
            onClick={() => setMetric(key)}
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors"
            style={
              metric === key
                ? { background: 'var(--green-soft)', color: 'var(--green-deep)', borderColor: 'var(--green)' }
                : { background: 'transparent', color: 'var(--ink-faint)', borderColor: 'var(--line-strong)' }
            }
          >
            {METRIC_CONFIGS[key].label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {cfg.data.map((row: any, i: number) => (
          <div key={cfg.getName(row)} className="flex items-center gap-3">
            <span
              className="w-5 h-5 shrink-0 rounded-md flex items-center justify-center text-[9px] font-data font-bold"
              style={i === 0 ? { background: 'var(--green-soft)', color: 'var(--green-deep)' } : { background: 'var(--line)', color: 'var(--ink-faint)' }}
            >
              {i + 1}
            </span>
            <span className="text-xs w-24 md:w-28 shrink-0 font-semibold truncate" style={{ color: 'var(--ink-soft)' }}>
              {cfg.getIcon(row)} {cfg.getName(row)}
            </span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--green-soft)' }}>
              <div
                className="h-full rounded-full origin-left transform-gpu"
                style={{
                  width: `${(row.total / cfg.max) * 100}%`,
                  background: i === 0 ? 'var(--green)' : 'var(--gold)',
                  animation: `barGrow 0.7s ease ${i * 0.08}s both`,
                }}
              />
            </div>
            <span className="font-data text-[11px] font-bold w-24 text-right shrink-0" style={{ color: 'var(--ink)' }}>
              {Math.round(row.total).toLocaleString('id-ID')} {cfg.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   INTERFACES LOGIN CONTROLLER
───────────────────────────────────────────── */
export default function LoginWithDashboard() {
  const router = useRouter();

  // STATE THEME & MODAL
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [activeModule, setActiveModule] = useState<'bitpro' | 'keswan' | 'kesmavet'>('bitpro');
  const [detailView, setDetailView] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<'2025' | '2026'>('2025');
  const [subTabProd, setSubTabProd] = useState<'populasi' | 'daging' | 'telur'>('populasi');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [statsKesmavet, setStatsKesmavet] = useState({
    total: 0,
    rpu: 0,
    tpu: 0,
    halal: 0,
  });

  useEffect(() => {
    const cekSesi = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.push('/beranda');
    };
    cekSesi();

    const savedRph = localStorage.getItem('data_rph_tph_tpu_v1');
    if (savedRph) {
      const parsedRph = JSON.parse(savedRph);
      setStatsKesmavet({
        total: parsedRph.length,
        rpu: parsedRph.filter((d: any) => (d.jenis_unit_usaha || '').includes('RPU')).length,
        tpu: parsedRph.filter(
          (d: any) => (d.jenis_unit_usaha || '').includes('TPU') || (d.jenis_unit_usaha || '').includes('TPH')
        ).length,
        halal: parsedRph.filter(
          (d: any) =>
            (d.sertifikat_halal || '').toLowerCase().includes('sudah') ||
            (d.sertifikat_halal || '').toLowerCase().includes('ada') ||
            (d.sertifikat_halal || '').toLowerCase().includes('halal')
        ).length,
      });
    }
  }, [router]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Akses ditolak. ID Petugas atau kata sandi tidak sesuai.');
      setIsLoading(false);
    } else {
      router.push('/beranda');
    }
  };

  const activeMod = MODULES.find((m) => m.key === activeModule)!;

  /* --- MODAL LOGIN POP-UP --- */
  const renderLoginModal = () => (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      style={{ animation: 'modalFadeIn 0.3s ease-out forwards' }}
    >
      <div
        className="w-full max-w-md mx-auto p-6 md:p-8 rounded-2xl border relative shadow-2xl transform-gpu"
        style={{ 
          background: 'var(--paper)', 
          borderColor: 'var(--line-strong)', 
          animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' 
        }}
      >
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-white/10"
          style={{ color: 'var(--ink-soft)' }}
          aria-label="Tutup popup"
        >
          <XIcon size={20} />
        </button>

        <div className="mb-6 text-center flex flex-col items-center w-full">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden mb-3 border bg-white shadow-lg shadow-purple-900/20">
            <img src="/logo-simantap.png" alt="Logo SiMantap" className="w-full h-full object-contain p-1" onError={(e: any) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} />
            <span className="hidden items-center justify-center w-full h-full text-xl">🔏</span>
          </div>
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--ink)' }}>Masuk Sistem</h2>
          <p className="text-xs font-medium mt-1" style={{ color: 'var(--ink-soft)' }}>Gunakan Kredensial Dinas Anda</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-xs font-bold text-center w-full border" style={{ background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.3)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <div>
            <label className="block text-xs font-bold mb-1.5 ml-1 text-left" style={{ color: 'var(--ink-soft)' }}>ID Petugas (Email)</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all font-data text-sm"
              style={{ background: 'var(--paper-soft)', borderColor: 'var(--line-strong)', color: 'var(--ink)' }}
              placeholder="admin@pkh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 ml-1 text-left" style={{ color: 'var(--ink-soft)' }}>Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-3 pr-10 rounded-xl border focus:outline-none focus:ring-2 transition-all font-data text-sm"
                style={{ background: 'var(--paper-soft)', borderColor: 'var(--line-strong)', color: 'var(--ink)' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 transition-colors"
                style={{ color: 'var(--ink-faint)' }}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <button type="button" className="text-xs font-bold hover:underline" style={{ color: 'var(--green-deep)' }}>Lupa kata sandi?</button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-bold text-sm rounded-xl transition-all active:scale-[0.98] hover:brightness-110"
            style={{ background: 'var(--green)', color: '#fff', boxShadow: '0 10px 24px -8px rgba(139,92,246,0.5)' }}
          >
            {isLoading ? 'Memverifikasi…' : 'Masuk Sekarang →'}
          </button>
        </form>

        <div className="w-full mt-6 grid grid-cols-3 gap-2">
          {[
            { icon: '🔒', label: 'Aman & Terenkripsi' },
            { icon: '🔄', label: 'Data Real-time' },
            { icon: '🧩', label: '3 Modul Terpadu' },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center text-center gap-1 rounded-lg border p-2" style={{ borderColor: 'var(--line)', background: 'var(--paper-soft)' }}>
              <span className="text-sm">{f.icon}</span>
              <span className="text-[8px] font-bold leading-tight" style={{ color: 'var(--ink-soft)' }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* --- RENDER TABEL DETAIL AWAM (READ ONLY) --- */
  const renderDetailView = () => {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 transform-gpu">
        <div className="sticky top-0 backdrop-blur-sm z-20 pb-4 mb-4 border-b" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)' }}>
          <div className="flex flex-row items-center justify-between gap-3 mb-4 w-full">
            <h5 className="font-display font-bold text-sm md:text-lg flex items-center gap-2" style={{ color: 'var(--ink)' }}>
              <span className="w-1.5 h-5 rounded-full" style={{ background: activeMod.accent }}></span>
              {detailView === 'populasi' && 'Populasi & Produksi Ternak'}
              {detailView === 'farm' && 'Sebaran Data Farm Per Komoditas'}
              {detailView === 'ktt' && 'Database Kelompok Tani Ternak (KTT)'}
              {detailView === 'sklb' && 'Penerbitan Sertifikat SKLB'}
              {detailView === 'keswan_empty' && 'Informasi Publik Keswan'}
              {detailView === 'kesmavet_empty' && 'Informasi Publik Kesmavet'}
            </h5>
            <button
              onClick={() => setDetailView(null)}
              className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all border shrink-0 flex items-center justify-center hover:bg-black/5"
              style={{ borderColor: 'var(--line-strong)', color: 'var(--ink-soft)', background: 'var(--paper-soft)' }}
            >
              ← Kembali
            </button>
          </div>

          {detailView === 'populasi' && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest mr-2" style={{ color: 'var(--ink-faint)' }}>
                Pilih Tahun:
              </span>
              {(['2025', '2026'] as const).map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className="px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-colors border"
                  style={
                    selectedYear === y
                      ? { background: 'var(--green)', color: '#fff', borderColor: 'var(--green)' }
                      : { background: 'transparent', color: 'var(--ink-faint)', borderColor: 'var(--line-strong)' }
                  }
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {detailView === 'populasi' && selectedYear === '2025' && (
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 pt-3 transform-gpu">
              {(
                [
                  ['populasi', 'Data Populasi', 'var(--green)', 'var(--green-soft)'],
                  ['daging', 'Produksi Daging', 'var(--gold)', 'var(--gold-soft)'],
                  ['telur', 'Produksi Telur', 'var(--blue)', 'var(--blue-soft)'],
                ] as const
              ).map(([key, lbl, accent, soft]) => (
                <button
                  key={key}
                  onClick={() => setSubTabProd(key)}
                  className="px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border shrink-0 transition-colors"
                  style={
                    subTabProd === key
                      ? { background: soft, color: accent, borderColor: accent }
                      : { background: 'transparent', borderColor: 'var(--line)', color: 'var(--ink-faint)' }
                  }
                >
                  {lbl}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar flex-1 max-h-[280px] pr-2 transform-gpu">
          {selectedYear === '2026' && detailView === 'populasi' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-2xl h-full" style={{ borderColor: 'var(--line-strong)' }}>
              <span className="text-3xl mb-2 opacity-40">📂</span>
              <p className="font-bold text-sm" style={{ color: 'var(--ink-faint)' }}>
                Data Sensus/Rekap Tahun 2026 Belum Diinput
              </p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden w-full" style={{ borderColor: 'var(--line)' }}>
              {detailView === 'populasi' && subTabProd === 'populasi' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                    <thead style={{ background: 'var(--green-soft)', color: 'var(--ink)' }} className="border-b">
                      <tr>
                        <th className="p-3 w-12 text-center">NO</th>
                        <th className="p-3">KOMODITAS TERNAK</th>
                        <th className="p-3 text-right">TOTAL POPULASI KABUPATEN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium" style={{ borderColor: 'var(--line)' }}>
                      {REKAP_POPULASI_2025.map((row, i) => (
                        <tr key={i} style={{ background: 'var(--paper)' }}>
                          <td className="p-3 text-center" style={{ color: 'var(--ink-faint)' }}>{i + 1}</td>
                          <td className="p-3 font-bold" style={{ color: 'var(--green)' }}>
                            {row.icon} {row.komoditas}
                          </td>
                          <td className="p-3 text-right font-data font-bold" style={{ color: 'var(--ink)' }}>
                            {row.total.toLocaleString('id-ID')} Ekor
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailView === 'populasi' && subTabProd === 'daging' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                    <thead style={{ background: 'var(--gold-soft)', color: 'var(--ink)' }}>
                      <tr>
                        <th className="p-3">KOMODITAS TERNAK</th>
                        <th className="p-3 text-right">TOTAL REKAP PRODUKSI DAGING (2025)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium" style={{ borderColor: 'var(--line)' }}>
                      {dataDaging.map((row, i) => (
                        <tr key={i} style={{ background: 'var(--paper)' }}>
                          <td className="p-3 font-bold" style={{ color: 'var(--gold)' }}>🥩 {row.jenis}</td>
                          <td className="p-3 text-right font-data font-bold" style={{ color: 'var(--ink)' }}>
                            {row.total.toLocaleString('id-ID')} KG
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailView === 'populasi' && subTabProd === 'telur' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                    <thead style={{ background: 'var(--blue-soft)', color: 'var(--ink)' }}>
                      <tr>
                        <th className="p-3">JENIS UNGGAS PRODUKTIF</th>
                        <th className="p-3 text-right">TOTAL REKAP PRODUKSI TELUR (2025)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium" style={{ borderColor: 'var(--line)' }}>
                      {dataTelur.map((row, i) => (
                        <tr key={i} style={{ background: 'var(--paper)' }}>
                          <td className="p-3 font-bold" style={{ color: 'var(--blue)' }}>🥚 {row.jenis}</td>
                          <td className="p-3 text-right font-data font-bold" style={{ color: 'var(--ink)' }}>
                            {row.total.toLocaleString('id-ID')} KG
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailView === 'farm' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                    <thead style={{ background: 'var(--gold-soft)', color: 'var(--ink)' }}>
                      <tr>
                        <th className="p-3 w-12 text-center">NO</th>
                        <th className="p-3">KOMODITAS FARM</th>
                        <th className="p-3 text-center">JUMLAH FARM</th>
                        <th className="p-3 text-right">TOTAL KANDUNGAN / POPULASI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium" style={{ borderColor: 'var(--line)' }}>
                      {REKAP_SEBARAN_FARM.map((row, i) => (
                        <tr key={i} style={{ background: 'var(--paper)' }}>
                          <td className="p-3 text-center" style={{ color: 'var(--ink-faint)' }}>{i + 1}</td>
                          <td className="p-3 font-bold" style={{ color: 'var(--gold)' }}>{row.komoditas}</td>
                          <td className="p-3 text-center font-data font-bold" style={{ color: 'var(--ink)' }}>
                            {row.jumlah_farm} Unit
                          </td>
                          <td className="p-3 text-right font-data font-bold" style={{ color: 'var(--green)' }}>
                            {row.total_populasi}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailView === 'ktt' && (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-2xl h-full" style={{ borderColor: 'var(--line-strong)' }}>
                  <span className="text-4xl mb-3 opacity-40">📂</span>
                  <p className="font-bold text-sm" style={{ color: 'var(--ink-faint)' }}>
                    Data Kelompok Tani Ternak (KTT) belum diinput.
                    <br />
                    Silakan hubungi tim Bitpro.
                  </p>
                </div>
              )}

              {detailView === 'sklb' && (
                <div className="p-12 text-center italic text-sm border-2 border-dashed rounded-2xl" style={{ color: 'var(--ink-faint)', borderColor: 'var(--line-strong)' }}>
                  <span className="text-4xl block mb-3 opacity-50">🔒</span>
                  Basis data registrasi Surat Keterangan Layak Bibit (SKLB) sedang sinkronisasi internal.
                </div>
              )}

              {detailView === 'keswan_empty' && (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-2xl h-full" style={{ borderColor: 'var(--line-strong)' }}>
                  <span className="text-4xl mb-3 opacity-40">🩺</span>
                  <p className="font-bold text-sm" style={{ color: 'var(--ink-faint)' }}>
                    Data Kesehatan Hewan belum diinput secara lengkap.
                    <br />
                    Silakan hubungi tim Keswan.
                  </p>
                </div>
              )}

              {detailView === 'kesmavet_empty' && (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-2xl h-full" style={{ borderColor: 'var(--line-strong)' }}>
                  <span className="text-4xl mb-3 opacity-40">🔬</span>
                  <p className="font-bold text-sm" style={{ color: 'var(--ink-faint)' }}>
                    Data Kesehatan Masyarakat Veteriner belum diinput secara lengkap.
                    <br />
                    Silakan hubungi tim Kesmavet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BG_STYLES }} />

      {/* WRAPPER UTAMA (Theme Terang/Gelap) */}
      <main className={`simantap-theme min-h-screen transition-colors duration-300 ${theme === 'light' ? 'light-mode' : ''}`} style={{ background: 'var(--canvas)', color: 'var(--ink)' }}>
        
        <Navigation onLoginClick={() => setShowLoginModal(true)} theme={theme} toggleTheme={toggleTheme} />

        {/* ============================================================
            HERO — badge, headline gradient, CTA
        ============================================================ */}
        <section
          id="ringkasan"
          className="relative flex flex-col items-center justify-start px-6 pt-32 pb-16 md:pt-40 md:pb-20 scroll-mt-16"
          style={{ animation: 'fadeIn 0.6s ease-out' }}
        >
          <aside
            className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm max-w-full"
            style={{ borderColor: 'var(--line-strong)', background: 'var(--paper-soft)' }}
          >
            <span className="text-xs text-center whitespace-nowrap" style={{ color: 'var(--ink-soft)' }}>
              Portal Resmi Bidang Peternakan dan Kesehatan Hewan, Dinas Pertanian dan Pangan
            </span>
            <a
              href="#modul"
              className="flex items-center gap-1 text-xs transition-all active:scale-95 whitespace-nowrap"
              style={{ color: 'var(--ink-soft)' }}
              aria-label="Lihat modul data"
            >
              Lihat modul
              <ArrowRight size={12} />
            </a>
          </aside>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-3xl px-6 leading-tight mb-6 tracking-tight" style={{ color: 'var(--ink)' }}>
            Satu Sistem untuk <br /> Data Peternakan Kebumen
          </h1>

          <p className="text-sm md:text-base font-medium text-center max-w-2xl px-6 mb-3" style={{ color: 'var(--ink-soft)' }}>
            Sistem Informasi Manajemen Peternakan Terpadu merangkum Perbibitan dan Produksi Peternakan, Kesehatan Hewan, dan Kesehatan Masyarakat Veteriner. <br className="hidden md:block" />
          </p>

          <div className="flex items-center gap-4 relative z-10 mb-16 mt-7">
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg text-base font-bold transition-transform duration-200 active:scale-[0.98]"
              style={{ background: 'var(--green)', color: '#ffffff' }}
              aria-label="Masuk ke sistem"
            >
              Masuk Sekarang
            </button>
          </div>

          {/* ==========================================================
              DASHBOARD MELAYANG
          ========================================================== */}
          <div id="modul" className="w-full max-w-5xl relative pb-8 scroll-mt-24">
            <div
              className="absolute left-1/2 w-[90%] pointer-events-none z-0"
              style={{ top: '-14%', transform: 'translateX(-50%)' }}
              aria-hidden="true"
            >
              <div
                className="w-full h-[26rem] rounded-full"
                style={{
                  background: 'radial-gradient(ellipse, var(--green-soft) 0%, var(--gold-soft) 45%, transparent 72%)',
                  filter: 'blur(60px)',
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="flex w-full gap-1 sm:gap-1.5 mb-0">
                {MODULES.map((mod, i) => (
                  <ModuleTab
                    key={mod.key}
                    mod={mod}
                    index={i}
                    active={activeModule === mod.key}
                    onClick={() => {
                      setActiveModule(mod.key);
                      setDetailView(null);
                    }}
                  />
                ))}
              </div>

              <div
                className="border p-5 md:p-8 rounded-b-2xl rounded-tr-2xl min-h-[380px] w-full relative shadow-2xl transform-gpu"
                style={{ borderColor: 'var(--line-strong)', background: 'var(--paper)' }}
              >
                {/* Bar mockup browser tipis */}
                <div className="flex items-center gap-1.5 mb-5 pb-4 border-b" style={{ borderColor: 'var(--line)' }} aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--line-strong)' }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--line-strong)' }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--line-strong)' }} />
                  <span className="ml-3 text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>
                    Live Preview · {activeMod.label}
                  </span>
                  <span
                    className="ml-auto text-[9px] font-bold px-2 py-1 rounded-full border uppercase tracking-widest"
                    style={{ color: 'var(--ink-faint)', borderColor: 'var(--line-strong)' }}
                  >
                    Read Only
                  </span>
                </div>

                {detailView ? (
                  renderDetailView()
                ) : (
                  <>
                    {activeModule === 'bitpro' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col transform-gpu">
                        <h5 className="font-display font-bold text-base md:text-lg flex items-center gap-2 mb-5" style={{ color: 'var(--ink)' }}>
                          <span className="w-1.5 h-5 rounded-full" style={{ background: 'var(--green)' }}></span>
                          Ringkasan Data Publik — Bitpro
                        </h5>

                        <RingkasanQuickStats />
                        <RankedBarWidget />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <StatWidget onClick={() => setDetailView('populasi')} icon="📊" title="Populasi & Produksi" value="Data Laporan" accent="var(--green)" accentSoft="var(--green-soft)" />
                          <StatWidget onClick={() => setDetailView('farm')} icon="🏡" title="Sebaran Data Farm" value="242 Unit" accent="var(--gold)" accentSoft="var(--gold-soft)" />
                          <StatWidget onClick={() => setDetailView('ktt')} icon="👥" title="Database KTT" value="Belum Diinput" accent="var(--plum)" accentSoft="var(--plum-soft)" />
                          <StatWidget onClick={() => setDetailView('sklb')} icon="📄" title="Sertifikat SKLB" value="Berkas" accent="var(--blue)" accentSoft="var(--blue-soft)" />
                        </div>
                      </div>
                    )}

                    {activeModule === 'keswan' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 transform-gpu">
                        <h5 className="font-display font-bold text-base md:text-lg flex items-center gap-2 mb-5" style={{ color: 'var(--ink)' }}>
                          <span className="w-1.5 h-5 rounded-full" style={{ background: 'var(--blue)' }}></span>
                          Ringkasan Data Publik — Keswan
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          <StatWidget onClick={() => setDetailView('keswan_empty')} icon="🩺" title="Puskeswan" value="Coming soon" accent="var(--blue)" accentSoft="var(--blue-soft)" />
                          <StatWidget onClick={() => setDetailView('keswan_empty')} icon="💉" title="Log Vaksinasi" value="Coming soon" accent="var(--green)" accentSoft="var(--green-soft)" />
                          <StatWidget onClick={() => setDetailView('keswan_empty')} icon="🚑" title="Kasus Medis" value="Coming soon" accent="var(--plum)" accentSoft="var(--plum-soft)" />
                        </div>
                      </div>
                    )}

                    {activeModule === 'kesmavet' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 transform-gpu">
                        <h5 className="font-display font-bold text-base md:text-lg flex items-center gap-2 mb-5" style={{ color: 'var(--ink)' }}>
                          <span className="w-1.5 h-5 rounded-full" style={{ background: 'var(--plum)' }}></span>
                          Ringkasan Data Publik — Kesmavet
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          <StatWidget onClick={() => setDetailView('kesmavet_empty')} icon="🏢" title="Total Unit Usaha" value="Coming soon" accent="var(--plum)" accentSoft="var(--plum-soft)" />
                          <StatWidget onClick={() => setDetailView('kesmavet_empty')} icon="🏭" title="Rumah Potong RPU" value="Coming soon" accent="var(--gold)" accentSoft="var(--gold-soft)" />
                          <StatWidget onClick={() => setDetailView('kesmavet_empty')} icon="✅" title="Sertifikasi Halal" value="Coming soon" accent="var(--green)" accentSoft="var(--green-soft)" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {showLoginModal && renderLoginModal()}

        <footer id="bantuan" className="border-t px-6 py-10 text-center scroll-mt-16" style={{ borderColor: 'var(--line)', background: 'var(--paper-soft)' }}>
          <p className="text-xs font-bold mb-1" style={{ color: 'var(--ink-soft)' }}>
            Butuh bantuan akses? Hubungi admin bidang PKH
          </p>
          <p className="text-[10px] font-medium leading-relaxed max-w-[280px] mx-auto mt-2" style={{ color: 'var(--ink-faint)' }}>
            &copy; {new Date().getFullYear()} Bidang Peternakan dan Kesehatan Hewan,
            <br />
            Dinas Pertanian dan Pangan Kabupaten Kebumen
          </p>
        </footer>
      </main>
    </>
  );
}