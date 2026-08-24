'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

// ─────────────────────────────────────────────
// KONSTANTA
// ─────────────────────────────────────────────
const GESTASI_SAPI_HARI = 283;

// ─────────────────────────────────────────────
// TIPE DATA
// ─────────────────────────────────────────────
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
  ownerName: string; // NAMA PETERNAK
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

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
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
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cattleDataUpdated', loadData);
    return () => window.removeEventListener('cattleDataUpdated', loadData);
  }, []);

  // 2. Fungsi Tembak Eksekusi ke MySQL
  const executeApi = async (action: string, payload: any, historyObj?: any) => {
    try {
      await fetch('/api/sapitime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload, history: historyObj })
      });
      loadData(); // Muat ulang tabel
      window.dispatchEvent(new Event('cattleDataUpdated'));
    } catch (e) {
      console.error('Gagal menyimpan data ke database', e);
    }
  };

  /* ─────────────────────────────────────────────
     FUNGSI SIMPAN PKB KE MYSQL
  ───────────────────────────────────────────── */
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
      newCattleStatus: pkbFormData.result === 'Bunting' ? 'Bunting' : 'Estrus'
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

  /* ─────────────────────────────────────────────
     FUNGSI "TIDAK PKB" KE MYSQL
  ───────────────────────────────────────────── */
  const handleSkipPkb = async () => {
    if (!selectedIbForSkip) return;

    const payload = {
      ib_id: selectedIbForSkip.id,
      pkbSkipDate: skipFormData.date,
      pkbSkipReason: skipFormData.reason
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

  /* ─────────────────────────────────────────────
     FUNGSI SIMPAN KELAHIRAN KE MYSQL
  ───────────────────────────────────────────── */
  const handleSaveBirth = async () => {
    if (!selectedIbForBirth) return;

    const payload = {
      ib_id: selectedIbForBirth.id,
      cattle_id: selectedIbForBirth.cattleId,
      birthDate: birthFormData.date,
      calfGender: birthFormData.gender,
      birthNotes: birthFormData.notes
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

  /* ─────────────────────────────────────────────
     EXPORT KE EXCEL
  ───────────────────────────────────────────── */
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
    // min-h-[101vh] ADALAH KUNCI ANTI GETAR!
    <div className="min-h-[101vh] bg-[#f4fcf8] text-gray-800 font-sans pb-20 relative">
      
      <style dangerouslySetInnerHTML={{ __html: `html { overflow-y: scroll !important; scrollbar-gutter: stable; }` }} />

      {/* HEADER NAVIGASI */}
      <div className="bg-white shadow-sm px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <Link href="/bitpro" className="w-full md:w-auto text-center bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm">
          ← Kembali
        </Link>
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center">
          <span className="text-3xl hidden sm:inline-block">🧬</span>
          <h1 className="text-xl md:text-2xl font-black text-emerald-800">
            Database Siklus IB
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button onClick={handleExportExcel} className="w-full sm:w-auto justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2">
            📊 Export Excel
          </button>
          <Link href="/bitpro/sapitime" className="w-full sm:w-auto justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2">
            ➕ Input SapiTime
          </Link>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10 space-y-8">
        {/* KOTAK TABEL UTAMA */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
            <h2 className="text-lg md:text-xl font-bold text-emerald-900">
              Pelacakan Siklus Reproduksi{' '}
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm">
                {filteredIB.length}
              </span>
            </h2>
            <div className="relative w-full md:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">🔍</span>
              <input
                type="text"
                placeholder="Cari sapi, peternak, petugas, wilayah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-emerald-100 rounded-full focus:outline-none focus:border-emerald-400 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-emerald-50 text-emerald-900 border-b-2 border-emerald-200">
                <tr>
                  <th className="px-4 py-4 font-bold">Identitas Peternak & Sapi</th>
                  <th className="px-4 py-4 font-bold">Data IB (Awal)</th>
                  <th className="px-4 py-4 font-bold">Pejantan / Straw</th>
                  <th className="px-4 py-4 font-bold">Status PKB (90 Hari)</th>
                  <th className="px-4 py-4 font-bold">Status Kelahiran</th>
                  <th className="px-4 py-4 font-bold text-center">Tindakan Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIB.map((ib) => {
                  const birthInfo = ib.pkbResult === 'Bunting' && !ib.birthDate ? estimateBirthInfo(ib) : null;

                  return (
                    <tr key={ib.id} className="hover:bg-emerald-50/50 transition-colors">
                      
                      {/* 1. Sapi & Peternak (NAMA PETERNAK MENONJOL) */}
                      <td className="px-4 py-4">
                        <span className="font-extrabold text-gray-900 text-base block mb-0.5 flex items-center gap-1.5">
                           👤 {ib.ownerName || 'Peternak Tidak Diketahui'}
                        </span>
                        <span className="font-semibold text-emerald-700 block text-sm ml-5">
                          Sapi: {ib.cattleName} <span className="font-normal text-xs text-emerald-600/70 ml-1">({ib.cattleId})</span>
                        </span>
                        <span className="block text-xs text-gray-500 mt-1 ml-5">
                          📍 {ib.kecamatan}, {ib.desa}
                        </span>
                      </td>

                      {/* 2. IB */}
                      <td className="px-4 py-4">
                        <span className="font-semibold text-emerald-700">{fmtDate(ib.date)}</span>
                        <span className="block text-xs text-gray-500 mt-1">👨‍⚕️ IB: {ib.inseminatorName}</span>
                      </td>

                      {/* 3. Pejantan */}
                      <td className="px-4 py-4">
                        <span className="font-medium text-gray-800">
                          {ib.bullName} <span className="text-xs text-gray-500">({ib.bullBreed})</span>
                        </span>
                        <span className="block text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">
                          🧬 {ib.strawCode}
                        </span>
                      </td>

                      {/* 4. PKB Status */}
                      <td className="px-4 py-4">
                        {!ib.pkbResult && ib.pkbStatus !== 'Tidak Diperiksa' && (
                          <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg">
                            <span className="block text-xs font-semibold text-amber-700">⏳ Rekomendasi PKB:</span>
                            <span className="block text-sm font-bold text-amber-800">{ib.rekomendasiPkb}</span>
                          </div>
                        )}

                        {!ib.pkbResult && ib.pkbStatus === 'Tidak Diperiksa' && (
                          <div className="bg-gray-100 border border-gray-300 p-2 rounded-lg">
                            <span className="block text-xs font-semibold text-gray-600">🚫 PKB Tidak Dilakukan</span>
                            <span className="block text-xs text-gray-500 mt-1">Tgl: {fmtDate(ib.pkbSkipDate)}</span>
                            {ib.pkbSkipReason && <span className="block text-xs text-gray-500">Alasan: {ib.pkbSkipReason}</span>}
                          </div>
                        )}

                        {ib.pkbResult && (
                          <div className={`p-2 rounded-lg border ${ib.pkbResult === 'Bunting' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <span className={`block font-bold ${ib.pkbResult === 'Bunting' ? 'text-green-700' : 'text-red-700'}`}>
                              {ib.pkbResult === 'Bunting' ? '✅ Bunting' : '❌ Tidak Bunting'}
                            </span>
                            <span className="block text-xs text-gray-600 mt-1">Tgl: {fmtDate(ib.pkbDateActual)}</span>
                            <span className="block text-xs text-gray-500">Oleh: {ib.pkbOfficer}</span>
                          </div>
                        )}
                      </td>

                      {/* 5. Kelahiran Status */}
                      <td className="px-4 py-4">
                        {!ib.pkbResult && <span className="text-xs text-gray-400 italic">Menunggu hasil PKB...</span>}
                        {ib.pkbResult === 'Tidak Bunting' && <span className="text-xs text-red-400 italic">Siklus gagal (Minta kawin)</span>}
                        {ib.pkbResult === 'Bunting' && !ib.birthDate && birthInfo && (
                          <div className={`p-2 rounded-lg border ${birthInfo.isOverdue ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <span className={`block font-bold text-xs ${birthInfo.isOverdue ? 'text-red-700 animate-pulse' : 'text-green-700 animate-pulse'}`}>
                              {birthInfo.isOverdue ? '⚠️ Lewat Perkiraan' : '🤰 Sedang Bunting'}
                            </span>
                            <span className="block text-xs text-gray-700 mt-1">
                              Estimasi Lahir: <b>{birthInfo.estimatedDateLabel}</b>
                            </span>
                            <span className={`block text-xs font-semibold mt-0.5 ${birthInfo.isOverdue ? 'text-red-600' : 'text-emerald-600'}`}>
                              {birthInfo.isOverdue ? `Sudah lewat ${Math.abs(birthInfo.daysRemaining)} hari` : `± ${birthInfo.daysRemaining} hari lagi`}
                            </span>
                          </div>
                        )}
                        {ib.birthDate && (
                          <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                            <span className="block font-bold text-blue-700">🍼 Partus / Lahir</span>
                            <span className="block text-xs text-gray-700 mt-1">Tgl: {fmtDate(ib.birthDate)}</span>
                            <span className="block text-xs font-bold text-blue-600 mt-0.5">Kelamin: {ib.calfGender}</span>
                          </div>
                        )}
                      </td>

                      {/* 6. Action Buttons */}
                      <td className="px-4 py-4 text-center align-middle">
                        <div className="flex flex-col gap-2">
                          {!ib.pkbResult && (
                            <>
                              <button onClick={() => { setSelectedIbForPkb(ib); setShowPkbModal(true); }} className="w-full px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                                🩺 Catat PKB
                              </button>
                              {ib.pkbStatus !== 'Tidak Diperiksa' && (
                                <button onClick={() => { setSelectedIbForSkip(ib); setShowSkipPkbModal(true); }} className="w-full px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                                  🚫 Tidak PKB
                                </button>
                              )}
                            </>
                          )}
                          {ib.pkbResult === 'Bunting' && !ib.birthDate && (
                            <button onClick={() => { setSelectedIbForBirth(ib); setShowBirthModal(true); }} className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                              🍼 Catat Kelahiran
                            </button>
                          )}
                          {ib.pkbResult === 'Tidak Bunting' && <span className="text-xs text-gray-400 font-medium">Siklus Selesai</span>}
                          {ib.birthDate && <span className="text-xs text-emerald-600 font-bold">✔️ Siklus Sukses</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredIB.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      Belum ada data IB di database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            ANALISIS CALVING INTERVAL
        ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
            <h2 className="text-lg md:text-xl font-bold text-emerald-900">📈 Analisis Calving Interval</h2>
            {avgCalvingIntervalDays !== null && (
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-sm">
                Rata-rata: <b className="text-emerald-800">{avgCalvingIntervalDays} hari</b> <span className="text-gray-500">(± {(avgCalvingIntervalDays / 30.44).toFixed(1)} bulan)</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-emerald-50 text-emerald-900 border-b-2 border-emerald-200">
                <tr>
                  <th className="px-4 py-3 font-bold">Identitas Peternak & Sapi</th>
                  <th className="px-4 py-3 font-bold">Kelahiran Ke-</th>
                  <th className="px-4 py-3 font-bold">Kelahiran Sebelumnya</th>
                  <th className="px-4 py-3 font-bold">Kelahiran Sekarang</th>
                  <th className="px-4 py-3 font-bold">Interval</th>
                  <th className="px-4 py-3 font-bold">Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {calvingIntervals.map((row, idx) => (
                  <tr key={`${row.cattleId}-${idx}`} className="hover:bg-emerald-50/50">
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-800 block">👤 {row.ownerName || 'Tanpa Nama'}</span>
                      <span className="text-emerald-700 font-semibold text-xs ml-5">Sapi: {row.cattleName}</span>
                    </td>
                    <td className="px-4 py-3">{row.calvingKe + 1}</td>
                    <td className="px-4 py-3">{row.kelahiranSebelumnya}</td>
                    <td className="px-4 py-3">{row.kelahiranSekarang}</td>
                    <td className="px-4 py-3">{row.intervalHari} hari <span className="text-xs text-gray-500">({row.intervalBulan} bln)</span></td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.kategori === 'Sangat Baik' ? 'bg-green-100 text-green-700' : row.kategori === 'Ideal / Baik' ? 'bg-emerald-100 text-emerald-700' : row.kategori === 'Cukup' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {row.kategori}
                      </span>
                    </td>
                  </tr>
                ))}
                {calvingIntervals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">Belum ada sapi dengan riwayat kelahiran ke-2 atau lebih untuk dihitung intervalnya.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
         MODAL CATAT PKB
      ───────────────────────────────────────────── */}
      {showPkbModal && selectedIbForPkb && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-emerald-800 border-b pb-3">
              🩺 Catat Hasil PKB - Sapi {selectedIbForPkb.cattleName} (Milik: {selectedIbForPkb.ownerName})
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Tanggal Pemeriksaan</label>
                <input type="date" className="w-full border-2 border-emerald-100 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none" value={pkbFormData.date} onChange={(e) => setPkbFormData({ ...pkbFormData, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Nama Petugas PKB</label>
                <input type="text" className="w-full border-2 border-emerald-100 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none" placeholder="Nama petugas pemeriksa" value={pkbFormData.officer} onChange={(e) => setPkbFormData({ ...pkbFormData, officer: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Hasil Pemeriksaan</label>
                <select className="w-full border-2 border-emerald-100 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none font-bold" value={pkbFormData.result} onChange={(e) => setPkbFormData({ ...pkbFormData, result: e.target.value as any })}>
                  <option value="Bunting">✅ Positif Bunting</option>
                  <option value="Tidak Bunting">❌ Kosong / Tidak Bunting</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">*Jika Bunting, status sapi akan otomatis diubah menjadi Bunting dan estimasi tanggal lahir akan dihitung otomatis.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Catatan</label>
                <textarea className="w-full border-2 border-emerald-100 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none" rows={2} placeholder="Catatan medis..." value={pkbFormData.notes} onChange={(e) => setPkbFormData({ ...pkbFormData, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPkbModal(false)} className="flex-1 py-2.5 rounded-lg border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50">Batal</button>
              <button onClick={handleSavePkb} disabled={!pkbFormData.date || !pkbFormData.officer} className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50">Simpan PKB</button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
         MODAL TIDAK PKB
      ───────────────────────────────────────────── */}
      {showSkipPkbModal && selectedIbForSkip && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-700 border-b pb-3">🚫 Tandai PKB Tidak Dilakukan</h3>
            <p className="text-sm text-gray-500 mb-4">Gunakan opsi ini jika pemeriksaan kebuntingan sengaja tidak/belum dilaksanakan untuk sapi ini. Data tetap tercatat dan sapi bisa di-PKB kembali kapan saja.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Tanggal</label>
                <input type="date" className="w-full border-2 border-gray-200 rounded-lg p-2.5 focus:border-gray-500 focus:outline-none" value={skipFormData.date} onChange={(e) => setSkipFormData({ ...skipFormData, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Alasan (opsional)</label>
                <textarea className="w-full border-2 border-gray-200 rounded-lg p-2.5 focus:border-gray-500 focus:outline-none" rows={2} placeholder="Contoh: Sapi sedang tidak berada di kandang" value={skipFormData.reason} onChange={(e) => setSkipFormData({ ...skipFormData, reason: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowSkipPkbModal(false)} className="flex-1 py-2.5 rounded-lg border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50">Batal</button>
              <button onClick={handleSkipPkb} disabled={!skipFormData.date} className="flex-1 py-2.5 rounded-lg bg-gray-500 text-white font-bold hover:bg-gray-600 disabled:opacity-50">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
         MODAL CATAT KELAHIRAN
      ───────────────────────────────────────────── */}
      {showBirthModal && selectedIbForBirth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-blue-800 border-b pb-3">🍼 Catat Kelahiran - Sapi {selectedIbForBirth.cattleName}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Tanggal Lahir</label>
                <input type="date" className="w-full border-2 border-blue-100 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none" value={birthFormData.date} onChange={(e) => setBirthFormData({ ...birthFormData, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Jenis Kelamin Pedet</label>
                <select className="w-full border-2 border-blue-100 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-bold text-blue-900" value={birthFormData.gender} onChange={(e) => setBirthFormData({ ...birthFormData, gender: e.target.value as any })}>
                  <option value="Jantan">🐂 Jantan</option>
                  <option value="Betina">🐄 Betina</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Catatan Kelahiran</label>
                <textarea className="w-full border-2 border-blue-100 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none" rows={2} placeholder="Kondisi pedet, berat lahir, dll..." value={birthFormData.notes} onChange={(e) => setBirthFormData({ ...birthFormData, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowBirthModal(false)} className="flex-1 py-2.5 rounded-lg border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50">Batal</button>
              <button onClick={handleSaveBirth} disabled={!birthFormData.date} className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50">Simpan Kelahiran</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}