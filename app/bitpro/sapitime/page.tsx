'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   NATIVE SVGs
───────────────────────────────────────────── */
const HomeIcon = () => (<svg className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const DatabaseIcon = () => (<svg className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>);
const CalendarIcon = () => (<svg className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const HistoryIcon = () => (<svg className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);
const PlusIcon = () => (<svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const SearchIcon = () => (<svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const EditIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 mr-1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const TrashIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);
const SyringeIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 mr-1.5"><path d="M6 18L18 6M6 6l12 12"></path></svg>);
const ChevronLeftIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className="w-[18px] h-[18px]"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRightIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className="w-[18px] h-[18px]"><polyline points="9 18 15 12 9 6"></polyline></svg>);
const InfoIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-1.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>);
const TagIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.82z"></path><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"></circle></svg>);
const PersonIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-1.5 shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');
  
  .font-display { font-family: 'Poppins', sans-serif; letter-spacing: -0.01em; }
  .font-body { font-family: 'Inter', sans-serif; }
  .font-tag { font-family: 'JetBrains Mono', monospace; }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const paperCard = 'bg-white border border-[#E4E1D3] rounded-2xl shadow-[0_1px_2px_rgba(24,36,32,0.04),0_10px_28px_-16px_rgba(24,36,32,0.16)]';
const boardCard = 'bg-[#1F4A36] border border-[#153627] rounded-2xl shadow-[0_24px_60px_-28px_rgba(10,20,15,0.55)]';
const inputBase = 'w-full p-3 border border-[#DFDACA] rounded-xl bg-[#FBFAF5] focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/30 focus:border-[#2F6B4F] text-sm text-[#182420] font-medium placeholder:text-[#182420]/40 transition-colors font-body';
const modalWrapper = 'bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 font-body';
const sectionLabel = 'text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-[#182420]/50 font-body';

function calculateAge(birthDate: string) {
  if (!birthDate) return '-';
  const birth = new Date(birthDate);
  const today = new Date();
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  return `${years} thn ${months} bln`;
}

type Insemination = {
  id: number; date: string; time: string; kecamatan: string; desa: string;
  inseminatorName: string; strawCode: string; bullName: string; bullBreed: string;
  rekomendasiPkb: string; notes: string; pkbSkipDate?: string; pkbDateActual?: string; birthDate?: string;
};
type Cattle = {
  id: string; name: string; ownerName: string; breed: string; birthDate: string;
  kecamatan: string; desa: string; status: string; lastEstrus: string;
  pregnancyDate?: string; pregnancyNotes?: string; notes: string; cycleLength?: number;
  ibDate?: string; inseminations: Insemination[]; createdAt?: string; updatedAt?: string;
};

/* ─────────────────────────────────────────────
   KOMPONEN UTAMA (SapiTime)
───────────────────────────────────────────── */
export default function SapiTimePage() {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState('home');
  const [cattleList, setCattleList] = useState<Cattle[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCattle, setEditingCattle] = useState<Cattle | null>(null);
  const [formData, setFormData] = useState<any>({ status: 'Estrus', cycleLength: 21, kecamatan: '', desa: '', ownerName: '' });
  
  const [showIBModal, setShowIBModal] = useState(false);
  const [selectedCattleForIB, setSelectedCattleForIB] = useState<Cattle | null>(null);
  const [ibFormData, setIbFormData] = useState<any>({});
  const [showEstrusModal, setShowEstrusModal] = useState(false);

  // 1. Tarik Data dari MySQL API
  const fetchData = async () => {
    try {
      const res = await fetch('/api/sapitime');
      const json = await res.json();
      if (json.success) {
        setCattleList(json.cattle);
        setHistoryList(json.history);
      }
    } catch (e) {
      console.error("Gagal load data MySQL");
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('cattleDataUpdated', fetchData);
    
    // ─── KUNCI SAKTI ANTI-GETAR VIA JAVASCRIPT ───
    document.documentElement.style.overflowY = 'scroll';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';

    return () => {
      window.removeEventListener('cattleDataUpdated', fetchData);
    };
  }, []);

  // 2. Fungsi Eksekusi API ke MySQL
  const executeApi = async (action: string, payload: any, historyObj?: any) => {
    try {
      await fetch('/api/sapitime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload, history: historyObj })
      });
      fetchData(); 
      window.dispatchEvent(new Event('cattleDataUpdated'));
    } catch (e) {
      console.error(e);
    }
  };

  const getCattleStatusData = (c: Cattle) => {
    const today = new Date();
    if (c.status === 'Bunting' && c.pregnancyDate) {
      const pregStart = new Date(c.pregnancyDate);
      const birthDate = new Date(pregStart);
      birthDate.setDate(pregStart.getDate() + 285);
      const daysUntil = Math.ceil((birthDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return { ...c, daysUntil, eventType: 'birth', colorHex: daysUntil <= 7 ? '#EF4444' : '#10B981', bgHex: daysUntil <= 7 ? '#FEE2E2' : '#D1FAE5' };
    }
    if (c.lastEstrus && c.status !== 'Bunting') {
      const lastEstrus = new Date(c.lastEstrus);
      const cycle = c.cycleLength || 21;
      const nextEstrus = new Date(lastEstrus);
      nextEstrus.setDate(lastEstrus.getDate() + cycle);
      const daysUntil = Math.ceil((nextEstrus.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return { ...c, daysUntil, cycleLength: cycle, eventType: 'estrus', colorHex: daysUntil <= 2 ? '#EF4444' : '#F59E0B', bgHex: daysUntil <= 2 ? '#FEE2E2' : '#FEF3C7' };
    }
    return { ...c, eventType: 'safe', colorHex: '#6B7280', bgHex: '#F3F4F6' };
  };

  // --- CRUD KE MYSQL ---
  const handleAddCattle = async () => {
    const newId = `ST${String(cattleList.length + 1).padStart(3, '0')}`;
    const newCattle = { ...formData, id: newId };
    const historyObj = { type: 'cattle_added', cattle: formData.name, cattleId: newId, description: `Sapi baru ditambahkan milik ${formData.ownerName}`, icon: '➕' };
    
    setCattleList([...cattleList, { ...newCattle, inseminations: [] }]); 
    setShowAddModal(false);
    setFormData({ status: 'Estrus', cycleLength: 21, kecamatan: '', desa: '', ownerName: '' });
    await executeApi('add_cattle', newCattle, historyObj);
  };

  const handleEditCattle = (cattle: Cattle) => {
    setEditingCattle(cattle);
    setFormData({ ...cattle });
    setShowEditModal(true);
  };

  const handleUpdateCattle = async () => {
    const updatedCattle = { ...editingCattle, ...formData };
    const historyObj = { type: 'cattle_updated', cattle: formData.name, cattleId: editingCattle?.id, description: `Data sapi diperbarui`, icon: '✏️' };
    
    setCattleList(cattleList.map((c) => c.id === editingCattle?.id ? updatedCattle : c));
    setShowEditModal(false);
    setEditingCattle(null);
    setFormData({ status: 'Estrus', cycleLength: 21, kecamatan: '', desa: '', ownerName: '' });
    await executeApi('update_cattle', updatedCattle, historyObj);
  };

  const handleDeleteCattle = async (id: string) => {
    if (confirm('Yakin hapus sapi ini? Semua riwayat IB juga akan terhapus!')) {
      setCattleList(cattleList.filter((c) => c.id !== id));
      const historyObj = { type: 'cattle_deleted', cattle: id, cattleId: id, description: `Sapi dihapus dari sistem`, icon: '🗑️' };
      await executeApi('delete_cattle', { id }, historyObj);
    }
  };

  const handleAddInsemination = async () => {
    const pkbDate = new Date(ibFormData.date);
    pkbDate.setDate(pkbDate.getDate() + 90);
    const rekomendasiPkb = pkbDate.toLocaleDateString('id-ID');

    const newIB = { id: Date.now(), cattle_id: selectedCattleForIB?.id, ...ibFormData, rekomendasiPkb };
    const historyObj = { type: 'insemination_added', cattle: selectedCattleForIB?.name, cattleId: selectedCattleForIB?.id, description: `Inseminasi Buatan (${newIB.kecamatan}, ${newIB.desa}). PKB: ${rekomendasiPkb}`, icon: '💉' };

    fetch('https://empty-yak-8.hooks.n8n.cloud/webhook/8b511961-05c4-4392-b818-07c89ccff71d', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statusOperasi: 'BARU', idSapi: selectedCattleForIB?.id, namaSapi: selectedCattleForIB?.name, tanggalIB: newIB.date, waktu: newIB.time, kecamatan: newIB.kecamatan, desa: newIB.desa, inseminator: newIB.inseminatorName, kodeStraw: newIB.strawCode, namaPejantan: newIB.bullName, rasPejantan: newIB.bullBreed, rekomendasiPkb: newIB.rekomendasiPkb, catatan: newIB.notes, idInseminasi: newIB.id }),
    }).catch(console.warn);

    setCattleList(cattleList.map((c) => c.id === selectedCattleForIB?.id ? { ...c, ibDate: newIB.date, inseminations: [...(c.inseminations || []), newIB] } : c));
    setShowIBModal(false);
    setIbFormData({});
    setSelectedCattleForIB(null);
    await executeApi('add_ib', newIB, historyObj);

    if (window.confirm('Data IB berhasil dicatat ke Database MySQL! Ingin langsung membuka Database IB sekarang?')) {
      router.push('/bitpro/database-ib');
    }
  };

  const getCalendarEvents = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    let events: any[] = [];

    cattleList.forEach((c) => {
      if (c.lastEstrus) {
        const eDate = new Date(c.lastEstrus);
        if (eDate.getFullYear() === year && eDate.getMonth() === month) {
          events.push({ day: eDate.getDate(), type: 'estrus', name: c.name, id: c.id, colorHex: '#FCA5A5', desc: 'Estrus Tercatat' });
        }
        const nextE = new Date(eDate);
        nextE.setDate(nextE.getDate() + (c.cycleLength || 21));
        if (nextE.getFullYear() === year && nextE.getMonth() === month && c.status !== 'Bunting') {
          events.push({ day: nextE.getDate(), type: 'next_estrus', name: c.name, id: c.id, colorHex: '#FDBA74', desc: 'Perkiraan Estrus' });
        }
      }
      if (c.inseminations) {
        c.inseminations.forEach((ib) => {
          const ibDate = new Date(ib.date);
          if (ibDate.getFullYear() === year && ibDate.getMonth() === month) {
            events.push({ day: ibDate.getDate(), type: 'ib', name: c.name, id: c.id, colorHex: '#FCD34D', desc: `IB oleh ${ib.inseminatorName}` });
          }
          const pkbDate = new Date(ibDate);
          pkbDate.setDate(pkbDate.getDate() + 90);
          if (pkbDate.getFullYear() === year && pkbDate.getMonth() === month) {
            events.push({ day: pkbDate.getDate(), type: 'pkb', name: c.name, id: c.id, colorHex: '#93C5FD', desc: 'Jadwal PKB (90 Hari)' });
          }
        });
      }
      if (c.status === 'Bunting' && c.pregnancyDate) {
        const bDate = new Date(c.pregnancyDate);
        bDate.setDate(bDate.getDate() + 285);
        if (bDate.getFullYear() === year && bDate.getMonth() === month) {
          events.push({ day: bDate.getDate(), type: 'birth', name: c.name, id: c.id, colorHex: '#F9A8D4', desc: 'Estimasi Kelahiran' });
        }
      }
    });

    const groupedEvents: { [key: number]: any[] } = {};
    events.forEach((e) => {
      if (!groupedEvents[e.day]) groupedEvents[e.day] = [];
      groupedEvents[e.day].push(e);
    });
    return groupedEvents;
  };

  /* ─────────────────────────────────────────────
     RENDER HOME (DASHBOARD TABEL)
  ───────────────────────────────────────────── */
  const renderHome = () => {
    const sortedCattle = [...cattleList].map(getCattleStatusData).sort((a: any, b: any) => {
      const aDays = a.daysUntil ?? 999;
      const bDays = b.daysUntil ?? 999;
      return aDays - bDays;
    });

    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in">
        <div className="bg-white border border-[#E4E1D3] rounded-2xl shadow-sm overflow-hidden font-body">
          <div className="bg-[#1F4A36] px-6 py-4 flex justify-between items-center">
            <h2 className="font-display text-lg font-bold text-white tracking-wide">Monitoring Status Ternak</h2>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">Total: {cattleList.length} Ekor</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F5F4EE] border-b border-[#E4E1D3] text-[#182420]/60 text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4 w-16">No</th>
                  <th className="px-6 py-4">Data Peternak & Sapi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Sisa Waktu</th>
                  <th className="px-6 py-4 w-[25%]">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E1D3]">
                {sortedCattle.length > 0 ? (
                  sortedCattle.map((cattleData: any, idx: number) => {
                    let progressVal = 0;
                    if (cattleData.eventType === 'birth') progressVal = Math.min(100, ((285 - Math.max(0, cattleData.daysUntil)) / 285) * 100);
                    else if (cattleData.eventType === 'estrus') progressVal = Math.min(100, (((cattleData.cycleLength || 21) - Math.max(0, cattleData.daysUntil)) / (cattleData.cycleLength || 21)) * 100);
                    else progressVal = 100;

                    return (
                      <tr key={cattleData.id} className="hover:bg-[#FBFAF5] transition-colors group">
                        <td className="px-6 py-4 font-tag text-[#2F6B4F] font-semibold text-xs">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-display font-bold text-base text-[#182420] flex items-center gap-2">
                              <PersonIcon /> {cattleData.ownerName || 'Peternak Tidak Diketahui'}
                            </span>
                            <span className="font-medium text-[#182420]/60 text-xs mt-0.5 ml-6">
                              Sapi: <strong className="text-[#2F6B4F]">{cattleData.name}</strong> • ID: {cattleData.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cattleData.status === 'Bunting' ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>{cattleData.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-xs`} style={{ backgroundColor: cattleData.bgHex, color: cattleData.colorHex }}>
                              {cattleData.eventType === 'birth' || cattleData.eventType === 'estrus' ? `${cattleData.daysUntil} Hari Lagi` : 'Aman'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-[#E4E1D3] rounded-full h-2.5 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressVal}%`, backgroundColor: cattleData.colorHex }}></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#182420]/50 font-medium">Belum ada data sapi di Database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* INFO STATS BAWAH */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className={`${paperCard} p-6 text-center`}><p className={sectionLabel}>Siklus Estrus Rata-rata</p><p className="font-display text-4xl font-extrabold text-[#182420] mt-2.5">21 <span className="text-base font-medium text-[#182420]/50 font-body">Hari</span></p></div>
          <div className={`${paperCard} p-6 text-center`}><p className={sectionLabel}>Lama Estrus Rata-rata</p><p className="font-display text-4xl font-extrabold text-[#182420] mt-2.5">18 <span className="text-base font-medium text-[#182420]/50 font-body">Jam</span></p></div>
          <div className={`${paperCard} p-6 text-center`}><p className={sectionLabel}>Masa Kebuntingan Normal</p><p className="font-display text-4xl font-extrabold text-[#182420] mt-2.5">285 <span className="text-base font-medium text-[#182420]/50 font-body">Hari</span></p></div>
        </div>
      </div>
    );
  };

  const renderDatabase = () => (
    <div className="animate-in fade-in space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
        <div className="relative w-full sm:w-1/2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#182420]/40"><SearchIcon /></span>
          <input type="text" placeholder="Cari nama peternak atau sapi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E4E1D3] rounded-2xl text-[#182420] placeholder:text-[#182420]/40 focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/30 font-body shadow-sm" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button onClick={() => router.push('/bitpro/database-ib')} className="w-full sm:w-auto bg-white border border-[#C4872B]/30 hover:border-[#C4872B] text-[#C4872B] font-bold px-6 py-3.5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 font-body"><SyringeIcon /> Database IB ↗</button>
          <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto bg-[#2F6B4F] hover:bg-[#255A41] text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 font-body"><PlusIcon /> Tambah Sapi Baru</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {cattleList
          .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || (c.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase()))
          .map((cattle) => (
            <div key={cattle.id} className={`${paperCard} p-6 hover:border-[#2F6B4F]/40 transition-all flex flex-col justify-between font-body`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0 pr-3">
                    <h3 className="font-display text-xl font-extrabold text-[#182420] truncate flex items-center gap-1.5"><PersonIcon /> {cattle.ownerName || 'Tanpa Nama'}</h3>
                    <p className="font-bold text-[13px] text-[#2F6B4F] mt-1.5 truncate">Sapi: {cattle.name}</p>
                    <p className="font-tag text-[10px] text-[#182420]/50 mt-1 tracking-wider truncate">{cattle.id} • {cattle.kecamatan || '-'}, {cattle.desa || '-'}</p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cattle.status === 'Bunting' ? 'bg-[#2F6B4F]/10 text-[#2F6B4F] border border-[#2F6B4F]/20' : 'bg-[#B4573F]/10 text-[#B4573F] border border-[#B4573F]/20'}`}>{cattle.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-[#182420] mb-6 bg-[#F5F4EE] p-4 rounded-2xl border border-[#E4E1D3]">
                  <div><span className="text-[#182420]/40 block text-[10px] uppercase font-bold tracking-wider mb-1">Ras</span> <span className="font-semibold">{cattle.breed}</span></div>
                  <div><span className="text-[#182420]/40 block text-[10px] uppercase font-bold tracking-wider mb-1">Umur</span> <span className="font-semibold">{calculateAge(cattle.birthDate)}</span></div>
                  <div><span className="text-[#182420]/40 block text-[10px] uppercase font-bold tracking-wider mb-1">Estrus Terakhir</span> <span className="font-semibold">{cattle.lastEstrus ? new Date(cattle.lastEstrus).toLocaleDateString('id-ID') : '-'}</span></div>
                  <div><span className="text-[#182420]/40 block text-[10px] uppercase font-bold tracking-wider mb-1">Total IB</span> <span className="font-semibold">{cattle.inseminations?.length || 0} Kali</span></div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button onClick={() => handleEditCattle(cattle)} className="flex-1 py-2.5 bg-[#4F6E93]/10 text-[#4F6E93] rounded-xl border border-[#4F6E93]/20 font-bold hover:bg-[#4F6E93]/20 transition flex items-center justify-center text-sm"><EditIcon /> Edit</button>
                <button onClick={() => { setSelectedCattleForIB(cattle); setIbFormData({ ...ibFormData, kecamatan: cattle.kecamatan, desa: cattle.desa }); setShowIBModal(true); }} className="flex-1 py-2.5 bg-[#C4872B]/10 text-[#C4872B] rounded-xl border border-[#C4872B]/20 font-bold hover:bg-[#C4872B]/20 transition flex items-center justify-center text-sm"><SyringeIcon /> Catat IB</button>
                <button onClick={() => handleDeleteCattle(cattle.id)} className="px-4 py-2.5 bg-[#B4573F]/10 text-[#B4573F] rounded-xl border border-[#B4573F]/20 hover:bg-[#B4573F]/20 transition flex items-center justify-center"><TrashIcon /></button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthEvents = getCalendarEvents();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const allIBs = cattleList.flatMap((c) => (c.inseminations || []).map((ib) => ({ ...ib, cattle: c }))).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="animate-in fade-in space-y-6 md:space-y-8 font-body">
        <div className="flex justify-end">
          <button onClick={() => setShowEstrusModal(true)} className="flex items-center gap-2 px-5 py-2.5 border border-[#B4573F]/40 bg-white text-[#B4573F] rounded-xl font-bold hover:bg-[#B4573F]/10 transition-colors text-sm shadow-sm"><InfoIcon /> Cek Tanda Estrus</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className={`${paperCard} p-6 border-t-4 border-t-[#C4872B]`}>
            <h3 className="text-[#182420] font-display font-extrabold text-lg mb-4 flex items-center gap-2"><span className="text-xl">📊</span> Riwayat Inseminasi Buatan</h3>
            <div className="space-y-3">
              {allIBs.slice(0, 2).map((ib, i) => {
                const diffDays = Math.floor((new Date().getTime() - new Date(ib.date).getTime()) / (1000 * 3600 * 24));
                return (
                  <div key={i} className="flex justify-between items-center bg-[#F5F4EE] p-3 rounded-xl border border-[#E4E1D3]">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C4872B] shrink-0"></div>
                      <div>
                        <p className="font-bold text-[#182420]">{ib.cattle.name}</p>
                        <p className="font-tag text-[11px] font-semibold text-[#C4872B]">ID: {ib.cattle.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#182420] text-sm">{new Date(ib.date).toLocaleDateString('id-ID')}</p>
                      <p className="text-[11px] font-bold text-[#C4872B]/80">{diffDays === 0 ? 'Hari ini' : `${diffDays} hari lalu`}</p>
                    </div>
                  </div>
                );
              })}
              {allIBs.length === 0 && <p className="text-sm text-[#182420]/40 italic text-center py-4">Belum ada riwayat IB</p>}
            </div>
          </div>

          <div className={`${paperCard} p-6 border-t-4 border-t-[#4F6E93]`}>
            <h3 className="text-[#182420] font-display font-extrabold text-lg mb-4 flex items-center gap-2"><span className="text-xl">📌</span> Jadwal PKB</h3>
            <div className="space-y-3">
              {allIBs.slice(0, 2).map((ib, i) => {
                const pkbDate = new Date(ib.date);
                pkbDate.setDate(pkbDate.getDate() + 90);
                const diffDays = Math.ceil((pkbDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                return (
                  <div key={i} className="flex justify-between items-center bg-[#F5F4EE] p-3 rounded-xl border border-[#E4E1D3]">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4F6E93] shrink-0"></div>
                      <div>
                        <p className="font-bold text-[#182420]">{ib.cattle.name}</p>
                        <p className="text-[11px] font-semibold text-[#4F6E93]">IB: {new Date(ib.date).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#182420] text-sm">{pkbDate.toLocaleDateString('id-ID')}</p>
                      <p className={`text-[11px] font-bold ${diffDays < 0 ? 'text-[#B4573F]' : 'text-[#4F6E93]/80'}`}>{diffDays < 0 ? `Terlewat ${Math.abs(diffDays)} hari` : `${diffDays} hari lagi`}</p>
                    </div>
                  </div>
                );
              })}
              {allIBs.length === 0 && <p className="text-sm text-[#182420]/40 italic text-center py-4">Belum ada jadwal PKB</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className={`${boardCard} p-6 md:p-8 lg:col-span-2 relative`}>
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                <p className="text-emerald-200/50 text-[10px] font-bold uppercase tracking-[0.14em] mb-1">Papan Kandang</p>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">{monthNames[currentDate.getMonth()]} <span className="font-tag font-normal text-emerald-200/70 text-xl md:text-2xl">{currentDate.getFullYear()}</span></h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1))); setSelectedDay(null); }} className="p-2 md:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-emerald-100 transition-colors border border-white/10"><ChevronLeftIcon /></button>
                <button onClick={() => { setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1))); setSelectedDay(null); }} className="p-2 md:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-emerald-100 transition-colors border border-white/10"><ChevronRightIcon /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-3 text-center text-emerald-200/60 font-bold text-[10px] md:text-xs uppercase tracking-wider mb-4">
              <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {Array.from({ length: firstDay }).map((_, i) => (<div key={`empty-${i}`} className="h-12 md:h-16 rounded-xl bg-transparent"></div>))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDay === day;
                const dayEvents = monthEvents[day] || [];
                return (
                  <div key={day} onClick={() => setSelectedDay(isSelected ? null : day)} className={`h-12 md:h-16 flex flex-col items-center justify-start pt-1.5 md:pt-2.5 rounded-xl relative cursor-pointer transition-all duration-150 border ${isSelected ? 'bg-white text-[#1F4A36] border-white scale-[1.04] shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white border-white/10'}`}>
                    <span className="font-tag font-semibold text-sm md:text-base">{day}</span>
                    <div className="flex gap-0.5 md:gap-1 absolute bottom-1.5 md:bottom-2.5">
                      {dayEvents.slice(0, 3).map((e, idx) => (<div key={idx} className="w-1.5 h-1.5 md:w-[7px] md:h-[7px] rounded-full" style={{ backgroundColor: e.colorHex }}></div>))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 md:mt-10 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-emerald-100">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#FCA5A5' }}></div> Estrus</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#FCD34D' }}></div> IB</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#93C5FD' }}></div> Jadwal PKB</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#F9A8D4' }}></div> Perkiraan Lahir</div>
            </div>
          </div>

          <div className={`${boardCard} p-6 md:p-8 flex flex-col max-h-[600px]`}>
            <h3 className="font-display text-lg md:text-xl font-extrabold text-white mb-5 md:mb-6 border-b border-white/10 pb-4">{selectedDay ? `Aktivitas Tgl ${selectedDay}` : 'Aktivitas Bulan Ini'}</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 hide-scrollbar">
              {Object.keys(monthEvents).length === 0 ? (
                <p className="text-emerald-100/60 text-center font-medium mt-10 text-sm">Tidak ada jadwal tercatat bulan ini.</p>
              ) : (
                Object.keys(monthEvents).sort((a, b) => Number(a) - Number(b)).filter((day) => selectedDay ? Number(day) === selectedDay : true).map((day) =>
                  monthEvents[Number(day)].map((e, idx) => (
                    <div key={`${day}-${idx}`} className="flex gap-3 md:gap-4 items-center bg-white/10 p-3 md:p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors text-white">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 flex items-center justify-center font-tag font-bold text-base md:text-lg text-white shrink-0">{day}</div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 mb-0.5"><div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.colorHex }}></div><span className="font-bold text-white text-sm md:text-base truncate">{e.name}</span></div>
                        <span className="text-[10px] md:text-xs text-emerald-100/90 font-medium ml-4 truncate">{e.desc}</span>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className={`${paperCard} p-6 md:p-8 animate-in fade-in font-body`}>
      <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#182420] mb-6 md:mb-8 border-b border-[#E4E1D3] pb-4">Riwayat Aktivitas Sistem</h2>
      <div className="space-y-3.5">
        {historyList.map((item, idx) => (
          <div key={idx} className="flex gap-4 md:gap-5 items-start p-4 md:p-5 bg-[#F5F4EE] rounded-2xl border border-[#E4E1D3] hover:border-[#2F6B4F]/30 transition">
            <div className="text-xl md:text-2xl p-3 md:p-3.5 bg-white rounded-xl border border-[#E4E1D3] shrink-0">{item.icon}</div>
            <div className="min-w-0">
              <h4 className="font-bold text-base md:text-lg text-[#182420] mb-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="truncate font-display">{item.cattle}</span>
                <span className="text-[10px] md:text-xs font-medium text-[#182420]/50 font-body">
                  {new Date(item.date).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </h4>
              <p className="text-xs md:text-sm text-[#182420]/70">{item.description}</p>
            </div>
          </div>
        ))}
        {historyList.length === 0 && <p className="text-center text-[#182420]/40 py-10 text-sm">Belum ada aktivitas.</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-[101vh] overflow-x-hidden font-body text-[#182420] bg-[#F5F4EE] pb-24 relative">
      <style dangerouslySetInnerHTML={{ __html: fontImport }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-6 md:pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4 md:gap-6 pb-6 md:pb-8 w-full border-b border-[#E4E1D3]">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <Link href="/bitpro" className="bg-white hover:bg-[#E4E1D3] px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-bold transition-all border border-[#E4E1D3] shadow-sm text-[#182420] text-sm shrink-0">← Kembali</Link>
            <div className="min-w-0 flex items-center gap-3">
              <div className="hidden sm:flex w-11 h-11 rounded-xl bg-[#2F6B4F] text-white items-center justify-center shrink-0"><TagIcon /></div>
              <div>
                <h1 className="font-display text-2xl md:text-4xl font-black text-[#182420] tracking-tight truncate">SapiTime</h1>
                <p className="text-[#2F6B4F] text-[10px] md:text-sm font-semibold mt-0.5 uppercase tracking-wide truncate">Smart Monitoring Reproduksi Ternak</p>
              </div>
            </div>
          </div>

          <div className="flex w-full md:w-auto overflow-x-auto hide-scrollbar bg-white p-1.5 rounded-2xl border border-[#E4E1D3] shadow-sm">
            <button onClick={() => setActiveTab('home')} className={`flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all ${activeTab === 'home' ? 'bg-[#2F6B4F] text-white' : 'text-[#182420]/60 hover:bg-[#F5F4EE] hover:text-[#182420]'}`}><HomeIcon /> Beranda</button>
            <button onClick={() => setActiveTab('database')} className={`flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all ${activeTab === 'database' ? 'bg-[#2F6B4F] text-white' : 'text-[#182420]/60 hover:bg-[#F5F4EE] hover:text-[#182420]'}`}><DatabaseIcon /> Data Sapi</button>
            <button onClick={() => setActiveTab('calendar')} className={`flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all ${activeTab === 'calendar' ? 'bg-[#2F6B4F] text-white' : 'text-[#182420]/60 hover:bg-[#F5F4EE] hover:text-[#182420]'}`}><CalendarIcon /> Kalender</button>
            <button onClick={() => setActiveTab('history')} className={`flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all ${activeTab === 'history' ? 'bg-[#2F6B4F] text-white' : 'text-[#182420]/60 hover:bg-[#F5F4EE] hover:text-[#182420]'}`}><HistoryIcon /> Riwayat</button>
          </div>
        </div>

        {activeTab === 'home' && renderHome()}
        {activeTab === 'database' && renderDatabase()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'history' && renderHistory()}
      </div>

      {/* Modal Tanda Estrus */}
      {showEstrusModal && (
        <div className="fixed inset-0 bg-[#182420]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto font-body">
            <button onClick={() => setShowEstrusModal(false)} className="absolute top-4 right-5 text-[#182420]/40 hover:text-[#182420] text-3xl font-light">&times;</button>
            <h3 className="font-display text-xl md:text-2xl font-extrabold text-[#B4573F] mb-6 flex items-center gap-2 md:gap-3">💓 Cek Tanda Estrus</h3>
            <div className="space-y-4">
              <div className="bg-[#B4573F]/10 p-4 rounded-2xl border border-[#B4573F]/20">
                <h4 className="font-bold text-[#8A3E2C] mb-2">Tanda Utama (Pasti)</h4>
                <ul className="list-disc pl-5 text-sm text-[#8A3E2C] font-medium space-y-1"><li>Diam saat dinaiki oleh sapi lain.</li></ul>
              </div>
              <div className="bg-[#F5F4EE] p-4 rounded-2xl border border-[#E4E1D3]">
                <h4 className="font-bold text-[#182420] mb-2">Tanda Pendukung (3A)</h4>
                <ul className="list-disc pl-5 text-sm text-[#182420]/80 font-medium space-y-1">
                  <li><strong>Abuh:</strong> Vulva terlihat bengkak.</li>
                  <li><strong>Abang:</strong> Bagian dalam vulva berwarna kemerahan.</li>
                  <li><strong>Anget:</strong> Suhu tubuh sedikit meningkat/hangat.</li>
                  <li>Keluar lendir bening transparan dari vulva.</li>
                  <li>Sapi terlihat gelisah, sering melenguh, dan nafsu makan turun.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Sapi */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-[#182420]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={modalWrapper}>
            <div className="flex justify-between items-center mb-6 border-b border-[#E4E1D3] pb-4">
              <h3 className="font-display text-xl md:text-2xl font-extrabold text-[#182420]">{showEditModal ? '✏️ Edit Data Sapi' : '➕ Tambah Sapi Baru'}</h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-[#182420]/40 hover:text-[#182420] text-3xl leading-none">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Nama Sapi</label>
                <input type="text" className={inputBase} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama sapi" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Nama Peternak</label>
                <input type="text" className={inputBase} value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} placeholder="Nama pemilik" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Kecamatan</label>
                <input type="text" className={inputBase} value={formData.kecamatan} onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })} placeholder="Kecamatan" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Desa</label>
                <input type="text" className={inputBase} value={formData.desa} onChange={(e) => setFormData({ ...formData, desa: e.target.value })} placeholder="Desa" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Ras</label>
                <input type="text" className={inputBase} value={formData.breed} onChange={(e) => setFormData({ ...formData, breed: e.target.value })} placeholder="Simental / Brahman dll" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Tanggal Lahir</label>
                <input type="date" className={inputBase} value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Status</label>
                <select className={inputBase} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Estrus">Estrus</option>
                  <option value="Bunting">Bunting</option>
                  <option value="Laktasi">Laktasi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Estrus Terakhir</label>
                <input type="date" className={inputBase} value={formData.lastEstrus} onChange={(e) => setFormData({ ...formData, lastEstrus: e.target.value })} />
              </div>

              {formData.status === 'Bunting' && (
                <div className="col-span-2 bg-[#2F6B4F]/10 p-4 rounded-xl border border-[#2F6B4F]/20">
                  <label className="block text-sm font-bold mb-1.5 text-[#255A41]">📅 Tanggal Mulai Bunting</label>
                  <input type="date" className={inputBase} value={formData.pregnancyDate} onChange={(e) => setFormData({ ...formData, pregnancyDate: e.target.value })} />
                </div>
              )}
            </div>

            <div className="flex gap-3 md:gap-4 mt-8 pt-5 border-t border-[#E4E1D3]">
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="flex-1 py-2.5 md:py-3 rounded-xl border border-[#DFDACA] text-[#182420]/60 hover:bg-[#F5F4EE] font-bold transition-colors">Batal</button>
              <button onClick={showEditModal ? handleUpdateCattle : handleAddCattle} className="flex-1 py-2.5 md:py-3 rounded-xl bg-[#2F6B4F] hover:bg-[#255A41] text-white font-bold transition-colors shadow-md disabled:opacity-40" disabled={!formData.name || !formData.kecamatan || !formData.desa}>Simpan Data</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Catat IB */}
      {showIBModal && selectedCattleForIB && (
        <div className="fixed inset-0 bg-[#182420]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={modalWrapper}>
            <div className="flex justify-between items-center mb-6 border-b border-[#E4E1D3] pb-4">
              <h3 className="font-display text-xl md:text-2xl font-extrabold text-[#C4872B]">💉 Catat IB - {selectedCattleForIB.name}</h3>
              <button onClick={() => setShowIBModal(false)} className="text-[#182420]/40 hover:text-[#182420] text-3xl leading-none">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-5">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Tanggal IB</label>
                <input type="date" className={inputBase} value={ibFormData.date} onChange={(e) => setIbFormData({ ...ibFormData, date: e.target.value })} />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Waktu</label>
                <input type="time" className={inputBase} value={ibFormData.time} onChange={(e) => setIbFormData({ ...ibFormData, time: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Kecamatan</label>
                <input type="text" className={inputBase} value={ibFormData.kecamatan} onChange={(e) => setIbFormData({ ...ibFormData, kecamatan: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Desa</label>
                <input type="text" className={inputBase} value={ibFormData.desa} onChange={(e) => setIbFormData({ ...ibFormData, desa: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Nama Inseminator</label>
                <input type="text" className={inputBase} value={ibFormData.inseminatorName} onChange={(e) => setIbFormData({ ...ibFormData, inseminatorName: e.target.value })} placeholder="Nama Petugas" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Kode Straw</label>
                <input type="text" className={inputBase} value={ibFormData.strawCode} onChange={(e) => setIbFormData({ ...ibFormData, strawCode: e.target.value })} placeholder="Kode sperma beku" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Nama Pejantan</label>
                <input type="text" className={inputBase} value={ibFormData.bullName} onChange={(e) => setIbFormData({ ...ibFormData, bullName: e.target.value })} placeholder="Nama Pejantan" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs md:text-sm font-bold mb-1.5 text-[#182420]/80">Ras Pejantan</label>
                <input type="text" className={inputBase} value={ibFormData.bullBreed} onChange={(e) => setIbFormData({ ...ibFormData, bullBreed: e.target.value })} placeholder="Contoh: Limousin" />
              </div>

              {ibFormData.date && (
                <div className="col-span-2 bg-[#C4872B]/10 p-4 rounded-xl border border-[#C4872B]/20">
                  <label className="block text-sm font-bold mb-1.5 text-[#8A5F1E]">📌 Rekomendasi PKB (90 Hari setelah IB)</label>
                  <input type="text" readOnly className={`${inputBase} bg-[#C4872B]/10 text-[#8A5F1E] border-[#C4872B]/30 cursor-not-allowed`} value={new Date(new Date(ibFormData.date).setDate(new Date(ibFormData.date).getDate() + 90)).toLocaleDateString('id-ID')} />
                </div>
              )}
            </div>

            <div className="flex gap-3 md:gap-4 mt-8 pt-5 border-t border-[#E4E1D3]">
              <button onClick={() => setShowIBModal(false)} className="flex-1 py-2.5 md:py-3 rounded-xl border border-[#DFDACA] text-[#182420]/60 hover:bg-[#F5F4EE] font-bold transition-colors">Batal</button>
              <button onClick={handleAddInsemination} className="flex-1 py-2.5 md:py-3 rounded-xl bg-[#C4872B] hover:bg-[#AD7523] text-white font-bold shadow-md disabled:opacity-40 transition-colors" disabled={!ibFormData.date || !ibFormData.inseminatorName}>🚀 Simpan & Kirim Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}