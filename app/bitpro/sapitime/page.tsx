'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Plus,
  Calendar,
  Clock,
  Activity,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Syringe,
  X,
  History,
  Tag,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

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
  id: number;
  date: string;
  time: string;
  kecamatan: string;
  desa: string;
  inseminatorName: string;
  strawCode: string;
  bullName: string;
  bullBreed: string;
  rekomendasiPkb: string;
  notes: string;
  pkbSkipDate?: string;
  pkbDateActual?: string;
  birthDate?: string;
};

type Cattle = {
  id: string;
  name: string;
  ownerName: string;
  breed: string;
  birthDate: string;
  kecamatan: string;
  desa: string;
  status: string;
  lastEstrus: string;
  pregnancyDate?: string;
  pregnancyNotes?: string;
  notes: string;
  cycleLength?: number;
  ibDate?: string;
  inseminations: Insemination[];
  createdAt?: string;
  updatedAt?: string;
};

export default function SapiTimePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'database' | 'calendar' | 'history'>('home');
  const [cattleList, setCattleList] = useState<Cattle[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCattle, setEditingCattle] = useState<Cattle | null>(null);
  const [formData, setFormData] = useState<any>({
    status: 'Estrus',
    cycleLength: 21,
    kecamatan: '',
    desa: '',
    ownerName: '',
  });

  const [showIBModal, setShowIBModal] = useState(false);
  const [selectedCattleForIB, setSelectedCattleForIB] = useState<Cattle | null>(null);
  const [ibFormData, setIbFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sapitime');
      const json = await res.json();
      if (json.success) {
        setCattleList(json.cattle || []);
        setHistoryList(json.history || []);
      }
    } catch {
      console.error('Gagal mengambil data SapiTime');
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('cattleDataUpdated', fetchData);
    return () => {
      window.removeEventListener('cattleDataUpdated', fetchData);
    };
  }, []);

  const executeApi = async (action: string, payload: any, historyObj?: any) => {
    try {
      await fetch('/api/sapitime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload, history: historyObj }),
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
      return {
        ...c,
        daysUntil,
        eventType: 'birth',
        badgeColor: daysUntil <= 7 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (c.lastEstrus && c.status !== 'Bunting') {
      const lastEstrus = new Date(c.lastEstrus);
      const cycle = c.cycleLength || 21;
      const nextEstrus = new Date(lastEstrus);
      nextEstrus.setDate(lastEstrus.getDate() + cycle);
      const daysUntil = Math.ceil((nextEstrus.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return {
        ...c,
        daysUntil,
        cycleLength: cycle,
        eventType: 'estrus',
        badgeColor: daysUntil <= 2 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
    return { ...c, eventType: 'safe', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const handleAddCattle = async () => {
    const newId = `ST${String(cattleList.length + 1).padStart(3, '0')}`;
    const newCattle = { ...formData, id: newId };
    const historyObj = {
      type: 'cattle_added',
      cattle: formData.name,
      cattleId: newId,
      description: `Sapi baru ditambahkan milik ${formData.ownerName}`,
      icon: '➕',
    };

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
    const historyObj = {
      type: 'cattle_updated',
      cattle: formData.name,
      cattleId: editingCattle?.id,
      description: `Data sapi diperbarui`,
      icon: '✏️',
    };

    setCattleList(cattleList.map((c) => (c.id === editingCattle?.id ? updatedCattle : c)));
    setShowEditModal(false);
    setEditingCattle(null);
    setFormData({ status: 'Estrus', cycleLength: 21, kecamatan: '', desa: '', ownerName: '' });
    await executeApi('update_cattle', updatedCattle, historyObj);
  };

  const handleDeleteCattle = async (id: string) => {
    if (confirm('Yakin ingin menghapus data sapi ini?')) {
      setCattleList(cattleList.filter((c) => c.id !== id));
      const historyObj = {
        type: 'cattle_deleted',
        cattle: id,
        cattleId: id,
        description: `Sapi dihapus dari sistem`,
        icon: '🗑️',
      };
      await executeApi('delete_cattle', { id }, historyObj);
    }
  };

  const handleAddInsemination = async () => {
    const pkbDate = new Date(ibFormData.date);
    pkbDate.setDate(pkbDate.getDate() + 90);
    const rekomendasiPkb = pkbDate.toLocaleDateString('id-ID');

    const newIB = { id: Date.now(), cattle_id: selectedCattleForIB?.id, ...ibFormData, rekomendasiPkb };
    const historyObj = {
      type: 'insemination_added',
      cattle: selectedCattleForIB?.name,
      cattleId: selectedCattleForIB?.id,
      description: `Inseminasi Buatan (${newIB.kecamatan}, ${newIB.desa}). PKB: ${rekomendasiPkb}`,
      icon: '💉',
    };

    fetch('https://empty-yak-8.hooks.n8n.cloud/webhook/8b511961-05c4-4392-b818-07c89ccff71d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        statusOperasi: 'BARU',
        idSapi: selectedCattleForIB?.id,
        namaSapi: selectedCattleForIB?.name,
        tanggalIB: newIB.date,
        waktu: newIB.time,
        kecamatan: newIB.kecamatan,
        desa: newIB.desa,
        inseminator: newIB.inseminatorName,
        kodeStraw: newIB.strawCode,
        namaPejantan: newIB.bullName,
        rasPejantan: newIB.bullBreed,
        rekomendasiPkb: newIB.rekomendasiPkb,
        catatan: newIB.notes,
        idInseminasi: newIB.id,
      }),
    }).catch(console.warn);

    setCattleList(
      cattleList.map((c) =>
        c.id === selectedCattleForIB?.id
          ? { ...c, ibDate: newIB.date, inseminations: [...(c.inseminations || []), newIB] }
          : c
      )
    );
    setShowIBModal(false);
    setIbFormData({});
    setSelectedCattleForIB(null);
    await executeApi('add_ib', newIB, historyObj);

    if (window.confirm('Data IB berhasil dicatat! Buka halaman Database IB sekarang?')) {
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
          events.push({ day: eDate.getDate(), type: 'estrus', name: c.name, id: c.id, desc: 'Estrus Tercatat' });
        }
        const nextE = new Date(eDate);
        nextE.setDate(nextE.getDate() + (c.cycleLength || 21));
        if (nextE.getFullYear() === year && nextE.getMonth() === month && c.status !== 'Bunting') {
          events.push({ day: nextE.getDate(), type: 'next_estrus', name: c.name, id: c.id, desc: 'Perkiraan Estrus' });
        }
      }
      if (c.inseminations) {
        c.inseminations.forEach((ib) => {
          const ibDate = new Date(ib.date);
          if (ibDate.getFullYear() === year && ibDate.getMonth() === month) {
            events.push({ day: ibDate.getDate(), type: 'ib', name: c.name, id: c.id, desc: `IB: ${ib.inseminatorName}` });
          }
          const pkbDate = new Date(ibDate);
          pkbDate.setDate(pkbDate.getDate() + 90);
          if (pkbDate.getFullYear() === year && pkbDate.getMonth() === month) {
            events.push({ day: pkbDate.getDate(), type: 'pkb', name: c.name, id: c.id, desc: 'Jadwal PKB' });
          }
        });
      }
      if (c.status === 'Bunting' && c.pregnancyDate) {
        const bDate = new Date(c.pregnancyDate);
        bDate.setDate(bDate.getDate() + 285);
        if (bDate.getFullYear() === year && bDate.getMonth() === month) {
          events.push({ day: bDate.getDate(), type: 'birth', name: c.name, id: c.id, desc: 'Estimasi Kelahiran' });
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

  const filteredCattle = cattleList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.kecamatan || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white pb-20">
      
      {/* ── TOP HEADER (Lega & Bernapas) ── */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/bitpro"
              className="min-h-touch min-w-touch w-11 h-11 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-800 transition-colors shrink-0"
              aria-label="Kembali ke Bitpro"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Link href="/bitpro" className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors truncate">
                  Bitpro
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">SapiTime</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
                Smart Monitoring Reproduksi Sapi
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              title="Tambah Sapi"
              aria-label="Tambah Sapi"
              className="min-h-touch min-w-touch h-11 w-11 sm:w-auto sm:px-5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center sm:gap-2 hover:bg-emerald-700 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Tambah Sapi</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { key: 'home', label: 'Ringkasan Siklus' },
            { key: 'database', label: `Database Indukan (${cattleList.length})` },
            { key: 'calendar', label: 'Kalender Reproduksi' },
            { key: 'history', label: 'Log Riwayat Aktivitas' },
          ].map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`min-h-touch h-11 px-4 sm:px-5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-white border-slate-200 text-emerald-600 border-b-white translate-y-px shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-900 bg-slate-100/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: SUMMARY / HOME ── */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Quick KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Total Indukan
                </p>
                <p className="font-sans text-2xl sm:text-3xl font-bold text-slate-900">
                  {cattleList.length} <span className="text-xs font-normal text-slate-500">Ekor</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Sedang Bunting
                </p>
                <p className="font-sans text-2xl sm:text-3xl font-bold text-vitality">
                  {cattleList.filter((c) => c.status === 'Bunting').length} <span className="text-xs font-normal text-slate-500">Ekor</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Status Estrus / Birahi
                </p>
                <p className="font-sans text-2xl sm:text-3xl font-bold text-amber-600">
                  {cattleList.filter((c) => c.status === 'Estrus').length} <span className="text-xs font-normal text-slate-500">Ekor</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Siklus Aman
                </p>
                <p className="font-sans text-2xl sm:text-3xl font-bold text-emerald-600">
                  {cattleList.filter((c) => c.status !== 'Bunting' && c.status !== 'Estrus').length} <span className="text-xs font-normal text-slate-500">Ekor</span>
                </p>
              </div>
            </div>

            {/* List of Active Status Cards */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                Peringatan Siklus Reproduksi Aktif
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cattleList.map((c) => {
                  const statusData = getCattleStatusData(c);
                  return (
                    <div
                      key={c.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between min-h-[180px] space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-sans text-xs text-slate-400 font-bold">{c.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusData.badgeColor}`}>
                            {c.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-base mb-0.5">{c.name}</h4>
                        <p className="text-xs text-slate-600">
                          Peternak: <span className="font-semibold text-slate-900">{c.ownerName || '-'}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          📍 {c.kecamatan || '-'}, {c.desa || '-'} · {c.breed || 'Sapi'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedCattleForIB(c);
                            setShowIBModal(true);
                          }}
                          className="min-h-touch h-8 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-600/90 flex items-center gap-1"
                        >
                          <Syringe size={13} />
                          <span>Catat IB</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditCattle(c)}
                            className="min-h-touch h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center"
                            aria-label="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteCattle(c.id)}
                            className="min-h-touch h-8 w-8 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                            aria-label="Hapus"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: DATABASE INDUKAN ── */}
        {activeTab === 'database' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari sapi, peternak, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full min-h-touch h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 w-16">ID</th>
                      <th className="p-4">NAMA SAPI & PETERNAK</th>
                      <th className="p-4">RAS / UMUR</th>
                      <th className="p-4">LOKASI DESA/KEC</th>
                      <th className="p-4">STATUS REPRODUKSI</th>
                      <th className="p-4 text-center w-28">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {filteredCattle.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-sans font-bold text-xs text-slate-400">{c.id}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block text-sm">{c.name}</span>
                          <span className="text-xs text-slate-500">Peternak: {c.ownerName || '-'}</span>
                        </td>
                        <td className="p-4 text-xs">
                          <span className="font-medium text-slate-800 block">{c.breed || '-'}</span>
                          <span className="text-slate-400">{calculateAge(c.birthDate)}</span>
                        </td>
                        <td className="p-4 text-xs text-slate-600">
                          {c.desa || '-'}, {c.kecamatan || '-'}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedCattleForIB(c);
                                setShowIBModal(true);
                              }}
                              className="min-h-touch h-8 px-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                            >
                              + IB
                            </button>
                            <button
                              onClick={() => handleEditCattle(c)}
                              className="min-h-touch h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteCattle(c.id)}
                              className="min-h-touch h-8 w-8 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center justify-center"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: KALENDER REPRODUKSI ── */}
        {activeTab === 'calendar' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Kalender Siklus — {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="min-h-touch h-9 w-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="min-h-touch h-9 w-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                <div key={d} className="font-bold font-sans text-slate-500 py-1">{d}</div>
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const events = getCalendarEvents()[day] || [];
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[70px] p-1.5 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                      events.length > 0
                        ? 'border-emerald-600/40 bg-emerald-600/5 hover:bg-emerald-600/10'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-sans font-bold text-slate-700 text-xs">{day}</span>
                    {events.length > 0 && (
                      <div className="space-y-0.5">
                        {events.slice(0, 2).map((ev, idx) => (
                          <div key={idx} className="px-1 py-0.5 rounded bg-emerald-600 text-white text-[10px] truncate font-medium">
                            {ev.name}: {ev.desc}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: LOG RIWAYAT ── */}
        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-200">
              Log Riwayat Aktivitas & Perubahan
            </h3>

            <div className="divide-y divide-slate-100">
              {historyList.map((item, i) => (
                <div key={i} className="py-3 flex items-start gap-3 text-xs">
                  <span className="text-lg">{item.icon || '📌'}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{item.description}</p>
                    <span className="text-slate-400 font-sans text-[11px]">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString('id-ID') : '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ── MODAL TAMBAH SAPI ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Tambah Indukan Sapi Baru</h3>
              <button onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nama Sapi *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Nama Peternak *</label>
                <input
                  type="text"
                  required
                  value={formData.ownerName || ''}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={formData.kecamatan || ''}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Desa</label>
                  <input
                    type="text"
                    value={formData.desa || ''}
                    onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="h-10 px-4 rounded-xl border bg-slate-100 text-xs font-bold">Batal</button>
              <button onClick={handleAddCattle} className="h-10 px-5 rounded-xl bg-emerald-600 text-white text-xs font-bold">Simpan Sapi</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CATAT IB ── */}
      {showIBModal && selectedCattleForIB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Catat Inseminasi Buatan (IB)</h3>
              <button onClick={() => setShowIBModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border text-xs">
                Sapi: <span className="font-bold">{selectedCattleForIB.name}</span> ({selectedCattleForIB.id}) · Peternak: {selectedCattleForIB.ownerName}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tanggal IB</label>
                  <input
                    type="date"
                    value={ibFormData.date || ''}
                    onChange={(e) => setIbFormData({ ...ibFormData, date: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nama Inseminator</label>
                  <input
                    type="text"
                    value={ibFormData.inseminatorName || ''}
                    onChange={(e) => setIbFormData({ ...ibFormData, inseminatorName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Kode Straw</label>
                  <input
                    type="text"
                    placeholder="Contoh: LM-1049"
                    value={ibFormData.strawCode || ''}
                    onChange={(e) => setIbFormData({ ...ibFormData, strawCode: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nama Pejantan</label>
                  <input
                    type="text"
                    placeholder="Nama pejantan straw"
                    value={ibFormData.bullName || ''}
                    onChange={(e) => setIbFormData({ ...ibFormData, bullName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setShowIBModal(false)} className="h-10 px-4 rounded-xl border bg-slate-100 text-xs font-bold">Batal</button>
              <button onClick={handleAddInsemination} className="h-10 px-5 rounded-xl bg-emerald-600 text-white text-xs font-bold">Simpan & Kirim IB</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}