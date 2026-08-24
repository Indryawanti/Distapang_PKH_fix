'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  ArrowLeft,
  Search,
  Download,
  Plus,
  Activity,
  Calendar,
  Clock,
  Baby,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react';

// ─────────────────────────────────────────────
// KONSTANTA & TIPE
// ─────────────────────────────────────────────
const GESTASI_SAPI_HARI = 283;

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

  pkbStatus?: 'Sudah Diperiksa' | 'Tidak Diperiksa';
  pkbSkipDate?: string;
  pkbSkipReason?: string;

  pkbDateActual?: string;
  pkbResult?: 'Bunting' | 'Tidak Bunting';
  pkbOfficer?: string;
  pkbNotes?: string;

  birthDate?: string;
  calfGender?: 'Jantan' | 'Betina';
  birthNotes?: string;
};

type IBRecord = Insemination & {
  cattleName: string;
  ownerName: string;
  cattleId: string;
};

type CalvingIntervalRow = {
  cattleId: string;
  cattleName: string;
  ownerName: string;
  calvingKe: number;
  kelahiranSebelumnya: string;
  kelahiranSekarang: string;
  intervalHari: number;
  intervalBulan: number;
  kategori: string;
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('id-ID') : '-';

function estimateBirthInfo(ib: IBRecord) {
  const estDate = new Date(ib.date);
  estDate.setDate(estDate.getDate() + GESTASI_SAPI_HARI);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const estDay = new Date(estDate);
  estDay.setHours(0, 0, 0, 0);
  const daysRemaining = Math.round((estDay.getTime() - today.getTime()) / 86400000);

  return {
    estimatedDate: estDate,
    estimatedDateLabel: estDate.toLocaleDateString('id-ID'),
    daysRemaining,
    isOverdue: daysRemaining < 0,
  };
}

function kategoriCalvingInterval(hari: number): string {
  if (hari <= 365) return 'Sangat Baik';
  if (hari <= 425) return 'Ideal / Baik';
  if (hari <= 450) return 'Cukup';
  return 'Perlu Perhatian';
}

function calculateCalvingIntervals(list: IBRecord[]): CalvingIntervalRow[] {
  const byCattle: Record<string, { cattleName: string; ownerName: string; births: Date[] }> = {};
  list.forEach((ib) => {
    if (ib.birthDate) {
      if (!byCattle[ib.cattleId]) {
        byCattle[ib.cattleId] = { cattleName: ib.cattleName, ownerName: ib.ownerName, births: [] };
      }
      byCattle[ib.cattleId].births.push(new Date(ib.birthDate));
    }
  });

  const rows: CalvingIntervalRow[] = [];
  Object.entries(byCattle).forEach(([cattleId, data]) => {
    const sorted = [...data.births].sort((a, b) => a.getTime() - b.getTime());
    for (let i = 1; i < sorted.length; i++) {
      const intervalHari = Math.round((sorted[i].getTime() - sorted[i - 1].getTime()) / 86400000);
      rows.push({
        cattleId,
        cattleName: data.cattleName,
        ownerName: data.ownerName,
        calvingKe: i,
        kelahiranSebelumnya: sorted[i - 1].toLocaleDateString('id-ID'),
        kelahiranSekarang: sorted[i].toLocaleDateString('id-ID'),
        intervalHari,
        intervalBulan: +(intervalHari / 30.44).toFixed(1),
        kategori: kategoriCalvingInterval(intervalHari),
      });
    }
  });
  return rows;
}

export default function DatabaseIBPage() {
  const [ibList, setIbList] = useState<IBRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [showPkbModal, setShowPkbModal] = useState(false);
  const [selectedIbForPkb, setSelectedIbForPkb] = useState<IBRecord | null>(null);
  const [pkbFormData, setPkbFormData] = useState({ date: '', result: 'Bunting', officer: '', notes: '' });

  const [showSkipPkbModal, setShowSkipPkbModal] = useState(false);
  const [selectedIbForSkip, setSelectedIbForSkip] = useState<IBRecord | null>(null);
  const [skipFormData, setSkipFormData] = useState({ date: '', reason: '' });

  const [showBirthModal, setShowBirthModal] = useState(false);
  const [selectedIbForBirth, setSelectedIbForBirth] = useState<IBRecord | null>(null);
  const [birthFormData, setBirthFormData] = useState({ date: '', gender: 'Jantan', notes: '' });

  // 1. Tarik Data dari MySQL (API)
  const loadData = async () => {
    try {
      const res = await fetch('/api/sapitime');
      const json = await res.json();
      if (json.success) {
        const allIBs: IBRecord[] = [];
        json.cattle.forEach((cattle: any) => {
          if (cattle.inseminations && cattle.inseminations.length > 0) {
            cattle.inseminations.forEach((ib: any) => {
              allIBs.push({
                ...ib,
                cattleName: cattle.name,
                ownerName: cattle.ownerName || '',
                cattleId: cattle.id,
              });
            });
          }
        });
        allIBs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setIbList(allIBs);
      }
    } catch (e) {
      console.error('Gagal mengambil data IB dari database', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cattleDataUpdated', loadData);
    return () => window.removeEventListener('cattleDataUpdated', loadData);
  }, []);

  const executeApi = async (action: string, payload: any, historyObj?: any) => {
    try {
      await fetch('/api/sapitime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload, history: historyObj }),
      });
      loadData();
      window.dispatchEvent(new Event('cattleDataUpdated'));
    } catch (e) {
      console.error('Gagal menyimpan data ke database', e);
    }
  };

  const handleSavePkb = async () => {
    if (!selectedIbForPkb) return;

    const payload = {
      ib_id: selectedIbForPkb.id,
      cattle_id: selectedIbForPkb.cattleId,
      pkbDateActual: pkbFormData.date,
      pkbResult: pkbFormData.result,
      pkbOfficer: pkbFormData.officer,
      pkbNotes: pkbFormData.notes,
      pregnancyDate: pkbFormData.result === 'Bunting' ? selectedIbForPkb.date : null,
      newCattleStatus: pkbFormData.result === 'Bunting' ? 'Bunting' : 'Estrus',
    };

    const historyObj = {
      type: 'pkb_recorded',
      cattle: selectedIbForPkb.cattleName,
      cattleId: selectedIbForPkb.cattleId,
      description: `PKB Dicatat: Hasil ${pkbFormData.result} (Oleh: ${pkbFormData.officer})`,
      icon: pkbFormData.result === 'Bunting' ? '🤰' : '❌',
    };

    await executeApi('record_pkb', payload, historyObj);
    setShowPkbModal(false);
    setPkbFormData({ date: '', result: 'Bunting', officer: '', notes: '' });
    setSelectedIbForPkb(null);
  };

  const handleSkipPkb = async () => {
    if (!selectedIbForSkip) return;

    const payload = {
      ib_id: selectedIbForSkip.id,
      pkbSkipDate: skipFormData.date,
      pkbSkipReason: skipFormData.reason,
    };

    const historyObj = {
      type: 'pkb_skipped',
      cattle: selectedIbForSkip.cattleName,
      cattleId: selectedIbForSkip.cattleId,
      description: `PKB Tidak Dilakukan${skipFormData.reason ? ` (Alasan: ${skipFormData.reason})` : ''}`,
      icon: '🚫',
    };

    await executeApi('skip_pkb', payload, historyObj);
    setShowSkipPkbModal(false);
    setSkipFormData({ date: '', reason: '' });
    setSelectedIbForSkip(null);
  };

  const handleSaveBirth = async () => {
    if (!selectedIbForBirth) return;

    const payload = {
      ib_id: selectedIbForBirth.id,
      cattle_id: selectedIbForBirth.cattleId,
      birthDate: birthFormData.date,
      calfGender: birthFormData.gender,
      birthNotes: birthFormData.notes,
    };

    const historyObj = {
      type: 'birth_recorded',
      cattle: selectedIbForBirth.cattleName,
      cattleId: selectedIbForBirth.cattleId,
      description: `Kelahiran Pedet ${birthFormData.gender} sukses!`,
      icon: '🍼',
    };

    await executeApi('record_birth', payload, historyObj);
    setShowBirthModal(false);
    setBirthFormData({ date: '', gender: 'Jantan', notes: '' });
    setSelectedIbForBirth(null);
  };

  const calvingIntervals = useMemo(() => calculateCalvingIntervals(ibList), [ibList]);

  const avgCalvingIntervalDays = useMemo(() => {
    if (calvingIntervals.length === 0) return null;
    const total = calvingIntervals.reduce((sum, r) => sum + r.intervalHari, 0);
    return Math.round(total / calvingIntervals.length);
  }, [calvingIntervals]);

  const handleExportExcel = () => {
    const dataSheet = ibList.map((ib) => {
      const birthInfo = ib.pkbResult === 'Bunting' && !ib.birthDate ? estimateBirthInfo(ib) : null;
      return {
        'Nama Peternak': ib.ownerName || '-',
        'Nama Sapi': ib.cattleName,
        'ID Sapi': ib.cattleId,
        Kecamatan: ib.kecamatan,
        Desa: ib.desa,
        'Tanggal IB': fmtDate(ib.date),
        'Jam IB': ib.time,
        'Nama Inseminator': ib.inseminatorName,
        'Kode Straw': ib.strawCode,
        'Nama Pejantan': ib.bullName,
        'Ras Pejantan': ib.bullBreed,
        'Rekomendasi PKB': ib.rekomendasiPkb,
        'Status PKB': ib.pkbResult ? 'Sudah Diperiksa' : ib.pkbStatus === 'Tidak Diperiksa' ? 'Tidak Diperiksa' : 'Menunggu',
        'Tanggal PKB Aktual': fmtDate(ib.pkbDateActual),
        'Hasil PKB': ib.pkbResult || '-',
        'Petugas PKB': ib.pkbOfficer || '-',
        'Catatan PKB': ib.pkbNotes || '-',
        'Tanggal PKB Dilewati': fmtDate(ib.pkbSkipDate),
        'Alasan PKB Dilewati': ib.pkbSkipReason || '-',
        'Estimasi Tanggal Lahir': birthInfo ? birthInfo.estimatedDateLabel : '-',
        'Estimasi Sisa Hari': birthInfo ? birthInfo.daysRemaining : '-',
        'Tanggal Lahir Aktual': fmtDate(ib.birthDate),
        'Jenis Kelamin Pedet': ib.calfGender || '-',
        'Catatan Kelahiran': ib.birthNotes || '-',
        'Catatan IB': ib.notes || '-',
      };
    });

    const calvingSheet = calvingIntervals.map((row) => ({
      'Nama Peternak': row.ownerName || '-',
      'Nama Sapi': row.cattleName,
      'ID Sapi': row.cattleId,
      'Kelahiran Ke-': row.calvingKe + 1,
      'Kelahiran Sebelumnya': row.kelahiranSebelumnya,
      'Kelahiran Sekarang': row.kelahiranSekarang,
      'Interval (Hari)': row.intervalHari,
      'Interval (Bulan)': row.intervalBulan,
      Kategori: row.kategori,
    }));

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(dataSheet);
    XLSX.utils.book_append_sheet(wb, ws1, 'Data Siklus IB');

    if (calvingSheet.length > 0) {
      const ws2 = XLSX.utils.json_to_sheet(calvingSheet);
      XLSX.utils.book_append_sheet(wb, ws2, 'Calving Interval');
    }

    const todayLabel = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Data_Siklus_IB_${todayLabel}.xlsx`);
  };

  const filteredIB = ibList.filter(
    (ib) =>
      ib.cattleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ib.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      ib.inseminatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ib.kecamatan && ib.kecamatan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ib.strawCode && ib.strawCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-azure selection:text-white pb-20">
      
      {/* ── TOP HEADER ── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/bitpro"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Kembali ke Bitpro"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Link href="/bitpro" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  Bitpro
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-azure">Database IB</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Pencatatan Inseminasi Buatan & Reproduksi
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleExportExcel}
              className="min-h-touch h-10 px-3.5 sm:px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export Excel</span>
            </button>

            <Link
              href="/bitpro/sapitime"
              className="min-h-touch h-10 px-4 rounded-xl bg-azure text-white text-xs font-bold flex items-center gap-1.5 hover:bg-azure/90 active:scale-95 transition-all shadow-sm"
            >
              <Plus size={16} />
              <span>Input SapiTime</span>
            </Link>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total Riwayat IB
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">
              {ibList.length} <span className="text-xs font-normal text-slate-500">Siklus</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Status Kebuntingan
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-vitality">
              {ibList.filter((d) => d.pkbResult === 'Bunting').length} <span className="text-xs font-normal text-slate-500">Bunting</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Pedet Lahir
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-azure">
              {ibList.filter((d) => d.birthDate).length} <span className="text-xs font-normal text-slate-500">Ekor</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Rata-rata Calving Interval
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-amber-600">
              {avgCalvingIntervalDays ? `${avgCalvingIntervalDays} Hari` : '-'}
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          
          {/* Table Header Bar */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>Data Pelacakan Siklus Reproduksi</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                  {filteredIB.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan riwayat kawin suntik, jadwal PKB, estimasi kelahiran, dan data pedet
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari sapi, peternak, petugas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-touch h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-azure transition-colors"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Identitas Peternak & Sapi</th>
                  <th className="p-4">Data IB (Awal)</th>
                  <th className="p-4">Pejantan / Straw</th>
                  <th className="p-4">Status PKB (90 Hari)</th>
                  <th className="p-4">Status Kelahiran</th>
                  <th className="p-4 text-center">Tindakan Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredIB.length > 0 ? (
                  filteredIB.map((ib) => {
                    const birthInfo = ib.pkbResult === 'Bunting' && !ib.birthDate ? estimateBirthInfo(ib) : null;

                    return (
                      <tr key={ib.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* 1. Sapi & Peternak */}
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block text-sm">
                            {ib.ownerName || 'Peternak Tidak Diketahui'}
                          </span>
                          <span className="text-xs text-azure font-medium block mt-0.5">
                            Sapi: {ib.cattleName} <span className="font-mono text-slate-400">({ib.cattleId})</span>
                          </span>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            📍 {ib.kecamatan || '-'}, {ib.desa || '-'}
                          </span>
                        </td>

                        {/* 2. IB Info */}
                        <td className="p-4">
                          <span className="font-mono font-semibold text-slate-900 block text-xs">
                            {fmtDate(ib.date)}
                          </span>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            Petugas: {ib.inseminatorName || '-'}
                          </span>
                        </td>

                        {/* 3. Pejantan */}
                        <td className="p-4">
                          <span className="font-semibold text-slate-800 block text-xs">
                            {ib.bullName || '-'} <span className="text-slate-500 font-normal">({ib.bullBreed || '-'})</span>
                          </span>
                          <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block mt-1">
                            🧬 {ib.strawCode || '-'}
                          </span>
                        </td>

                        {/* 4. PKB Status */}
                        <td className="p-4">
                          {!ib.pkbResult && ib.pkbStatus !== 'Tidak Diperiksa' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 inline-block">
                              ⏳ Menunggu PKB
                            </span>
                          )}
                          {ib.pkbResult === 'Bunting' && (
                            <div>
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                                ✓ Positif Bunting
                              </span>
                              <span className="block text-xs text-slate-500 mt-1 font-mono">
                                Tgl: {fmtDate(ib.pkbDateActual)}
                              </span>
                            </div>
                          )}
                          {ib.pkbResult === 'Tidak Bunting' && (
                            <div>
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 inline-block">
                                ✕ Tidak Bunting
                              </span>
                              <span className="block text-xs text-slate-500 mt-1 font-mono">
                                Tgl: {fmtDate(ib.pkbDateActual)}
                              </span>
                            </div>
                          )}
                          {ib.pkbStatus === 'Tidak Diperiksa' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 inline-block">
                              Dilewati ({ib.pkbSkipReason || '-'})
                            </span>
                          )}
                        </td>

                        {/* 5. Status Kelahiran */}
                        <td className="p-4">
                          {ib.birthDate ? (
                            <div>
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-azure border border-blue-200 inline-block">
                                🍼 Lahir: Pedet {ib.calfGender}
                              </span>
                              <span className="block text-xs text-slate-500 mt-1 font-mono">
                                Tgl: {fmtDate(ib.birthDate)}
                              </span>
                            </div>
                          ) : birthInfo ? (
                            <div>
                              <span className="text-xs text-slate-600 block">
                                Estimasi: <span className="font-mono font-bold text-slate-900">{birthInfo.estimatedDateLabel}</span>
                              </span>
                              <span className={`text-[11px] font-mono font-semibold ${birthInfo.isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                                {birthInfo.isOverdue ? `Lewat ${Math.abs(birthInfo.daysRemaining)} hari` : `${birthInfo.daysRemaining} hari lagi`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>

                        {/* 6. Aksi Petugas */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {!ib.pkbResult && ib.pkbStatus !== 'Tidak Diperiksa' && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedIbForPkb(ib);
                                    setPkbFormData({ date: '', result: 'Bunting', officer: '', notes: '' });
                                    setShowPkbModal(true);
                                  }}
                                  className="min-h-touch h-8 px-2.5 rounded-lg bg-azure text-white text-xs font-bold hover:bg-azure/90 transition-colors"
                                >
                                  Catat PKB
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedIbForSkip(ib);
                                    setSkipFormData({ date: '', reason: '' });
                                    setShowSkipPkbModal(true);
                                  }}
                                  className="min-h-touch h-8 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
                                >
                                  Lewati
                                </button>
                              </>
                            )}

                            {ib.pkbResult === 'Bunting' && !ib.birthDate && (
                              <button
                                onClick={() => {
                                  setSelectedIbForBirth(ib);
                                  setBirthFormData({ date: '', gender: 'Jantan', notes: '' });
                                  setShowBirthModal(true);
                                }}
                                className="min-h-touch h-8 px-2.5 rounded-lg bg-vitality text-white text-xs font-bold hover:bg-vitality/90 transition-colors"
                              >
                                Catat Lahir
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-medium text-sm">
                      {isLoading ? 'Memuat data reproduksi...' : 'Belum ada data siklus IB yang tercatat.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* ── MODAL CATAT PKB ── */}
      {showPkbModal && selectedIbForPkb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Pencatatan Hasil PKB (Pemeriksaan Kebuntingan)
              </h3>
              <button onClick={() => setShowPkbModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">Sapi: {selectedIbForPkb.cattleName} ({selectedIbForPkb.cattleId})</p>
              <p className="text-slate-600">Peternak: {selectedIbForPkb.ownerName} · Tgl IB: {fmtDate(selectedIbForPkb.date)}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Tanggal Pemeriksaan PKB
                </label>
                <input
                  type="date"
                  value={pkbFormData.date}
                  onChange={(e) => setPkbFormData({ ...pkbFormData, date: e.target.value })}
                  className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Hasil Diagnosa PKB
                </label>
                <select
                  value={pkbFormData.result}
                  onChange={(e) => setPkbFormData({ ...pkbFormData, result: e.target.value as any })}
                  className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
                >
                  <option value="Bunting">Positif Bunting 🤰</option>
                  <option value="Tidak Bunting">Tidak Bunting / Kosong ❌</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Petugas Pemeriksa
                </label>
                <input
                  type="text"
                  placeholder="Nama petugas medis / pemeriksa"
                  value={pkbFormData.officer}
                  onChange={(e) => setPkbFormData({ ...pkbFormData, officer: e.target.value })}
                  className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Catatan kondisi rahim / saran penanganan"
                  value={pkbFormData.notes}
                  onChange={(e) => setPkbFormData({ ...pkbFormData, notes: e.target.value })}
                  className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPkbModal(false)}
                className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSavePkb}
                className="min-h-touch h-10 px-5 rounded-xl bg-azure text-white text-xs font-bold shadow-sm hover:bg-azure/90"
              >
                Simpan Hasil PKB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CATAT LAHIR ── */}
      {showBirthModal && selectedIbForBirth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Pencatatan Kelahiran Pedet Baru
              </h3>
              <button onClick={() => setShowBirthModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">Indukan: {selectedIbForBirth.cattleName} ({selectedIbForBirth.cattleId})</p>
              <p className="text-slate-600">Pejantan Straw: {selectedIbForBirth.bullName} ({selectedIbForBirth.strawCode})</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Tanggal Kelahiran
                </label>
                <input
                  type="date"
                  value={birthFormData.date}
                  onChange={(e) => setBirthFormData({ ...birthFormData, date: e.target.value })}
                  className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Jenis Kelamin Pedet
                </label>
                <select
                  value={birthFormData.gender}
                  onChange={(e) => setBirthFormData({ ...birthFormData, gender: e.target.value as any })}
                  className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
                >
                  <option value="Jantan">Pedet Jantan 🐂</option>
                  <option value="Betina">Pedet Betina 🐄</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Catatan Kondisi Pedet
                </label>
                <input
                  type="text"
                  placeholder="Kondisi sehat, bobot perkiraan, dll"
                  value={birthFormData.notes}
                  onChange={(e) => setBirthFormData({ ...birthFormData, notes: e.target.value })}
                  className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBirthModal(false)}
                className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveBirth}
                className="min-h-touch h-10 px-5 rounded-xl bg-vitality text-white text-xs font-bold shadow-sm hover:bg-vitality/90"
              >
                Simpan Kelahiran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL LEWATI PKB ── */}
      {showSkipPkbModal && selectedIbForSkip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Lewati Jadwal PKB
              </h3>
              <button onClick={() => setShowSkipPkbModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={skipFormData.date}
                  onChange={(e) => setSkipFormData({ ...skipFormData, date: e.target.value })}
                  className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Alasan Tidak Dilakukan PKB
                </label>
                <input
                  type="text"
                  placeholder="Sapi dijual, birahi kembali, peternak pindah, dll"
                  value={skipFormData.reason}
                  onChange={(e) => setSkipFormData({ ...skipFormData, reason: e.target.value })}
                  className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSkipPkbModal(false)}
                className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSkipPkb}
                className="min-h-touch h-10 px-5 rounded-xl bg-slate-800 text-white text-xs font-bold shadow-sm hover:bg-slate-900"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}