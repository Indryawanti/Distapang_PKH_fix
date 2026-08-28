'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { ArrowLeft, RefreshCw, Download, Check, AlertCircle, Info } from 'lucide-react';

const dataAwal = [
  { id: 1, bulan: 'JANUARI', no: 1, puskeswan: 'MIRIT', bef: 2, cacingan: 70, scabies: 0, orf: 0, pmk_diag: 0, lsd_diag: 5, aktif: 127, semi_aktif: 5, pasif: 0, pusling: 127, ib: 160, pkb: 12, pmk_vaks: 0, lsd_vaks: 0, retribusi: 1750000 },
  { id: 2, bulan: 'JANUARI', no: 2, puskeswan: 'KLIRONG', bef: 10, cacingan: 60, scabies: 7, orf: 0, pmk_diag: 5, lsd_diag: 3, aktif: 125, semi_aktif: 6, pasif: 4, pusling: 125, ib: 94, pkb: 25, pmk_vaks: 25, lsd_vaks: 0, retribusi: 2500000 },
  { id: 3, bulan: 'JANUARI', no: 3, puskeswan: 'GOMBONG', bef: 0, cacingan: 16, scabies: 5, orf: 0, pmk_diag: 3, lsd_diag: 0, aktif: 140, semi_aktif: 43, pasif: 22, pusling: 30, ib: 196, pkb: 31, pmk_vaks: 75, lsd_vaks: 0, retribusi: 3970000 },
  { id: 4, bulan: 'JANUARI', no: 4, puskeswan: 'BUAYAN', bef: 5, cacingan: 16, scabies: 2, orf: 0, pmk_diag: 0, lsd_diag: 0, aktif: 51, semi_aktif: 3, pasif: 0, pusling: 51, ib: 198, pkb: 23, pmk_vaks: 51, lsd_vaks: 0, retribusi: 670000 },
  { id: 5, bulan: 'JANUARI', no: 5, puskeswan: 'ALIAN', bef: 1, cacingan: 25, scabies: 5, orf: 0, pmk_diag: 1, lsd_diag: 4, aktif: 48, semi_aktif: 5, pasif: 7, pusling: 64, ib: 15, pkb: 2, pmk_vaks: 0, lsd_vaks: 0, retribusi: 0 },
  { id: 6, bulan: 'JANUARI', no: 6, puskeswan: 'PREMBUN', bef: 3, cacingan: 70, scabies: 2, orf: 0, pmk_diag: 0, lsd_diag: 3, aktif: 70, semi_aktif: 18, pasif: 4, pusling: 70, ib: 0, pkb: 0, pmk_vaks: 0, lsd_vaks: 0, retribusi: 1360000 },
  { id: 7, bulan: 'JANUARI', no: 7, puskeswan: 'KEBUMEN', bef: 10, cacingan: 77, scabies: 2, orf: 0, pmk_diag: 0, lsd_diag: 10, aktif: 77, semi_aktif: 20, pasif: 3, pusling: 51, ib: 47, pkb: 47, pmk_vaks: 71, lsd_vaks: 60, retribusi: 1600000 },
  { id: 8, bulan: 'JANUARI', no: 8, puskeswan: 'KARANGANYAR', bef: 8, cacingan: 16, scabies: 9, orf: 7, pmk_diag: 4, lsd_diag: 2, aktif: 38, semi_aktif: 5, pasif: 0, pusling: 38, ib: 72, pkb: 26, pmk_vaks: 30, lsd_vaks: 0, retribusi: 565000 },
];

export default function LaporanPuskeswanPage() {
  const [dataLaporan, setDataLaporan] = useState<any[]>(dataAwal);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // State untuk Inline Editing
  const [editingCell, setEditingCell] = useState<{ bulan: string; puskeswan: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Muat data dari database web saat halaman pertama kali dibuka
  const loadDataFromDB = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/puskeswan');
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setDataLaporan(result.data);
      }
    } catch {
      console.warn('Gagal memuat dari database, menggunakan data default');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataFromDB();
  }, []);

  // Auto fokus dan seleksi teks saat sel diedit
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const sum = (rows: any[], key: string) => rows.reduce((acc, row) => acc + (Number(row[key]) || 0), 0);
  const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(Number(val) || 0);

  // Mulai proses edit saat sel diklik
  const handleStartEdit = (bulan: string, puskeswan: string, field: string, currentValue: any) => {
    setEditingCell({ bulan, puskeswan, field });
    setEditValue(String(currentValue ?? 0));
  };

  // Simpan nilai perubahan sel ke State & Database
  const handleSaveEdit = async () => {
    if (!editingCell) return;

    const { bulan, puskeswan, field } = editingCell;
    const numValue = Number(editValue) || 0;

    // 1. Optimistic Update (Tampilan langsung berubah seketika tanpa jeda)
    setDataLaporan((prev) =>
      prev.map((row) => {
        if (row.bulan === bulan && row.puskeswan === puskeswan) {
          return { ...row, [field]: numValue };
        }
        return row;
      })
    );

    setEditingCell(null);

    // 2. Kirim update ke API Database
    try {
      const res = await fetch('/api/puskeswan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulan, puskeswan, field, value: numValue }),
      });
      const resData = await res.json();
      if (!resData.success) {
        showToast('error', resData.error || 'Gagal menyimpan perubahan ke database.');
      } else {
        showToast('success', `Tersimpan: ${puskeswan} - ${field.toUpperCase()} (${numValue.toLocaleString('id-ID')})`);
      }
    } catch {
      showToast('success', 'Perubahan disimpan di sesi web.');
    }
  };

  // Batalkan edit saat tombol Escape ditekan
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync-puskeswan', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        showToast('success', result.message);
        setDataLaporan(result.data);
      } else {
        showToast('error', 'Gagal: ' + result.error);
      }
    } catch {
      showToast('error', 'Terjadi kesalahan jaringan saat sinkronisasi.');
    } finally {
      setIsSyncing(false);
    }
  };

  const groupedData = dataLaporan.reduce((acc, row) => {
    if (!acc[row.bulan]) acc[row.bulan] = [];
    acc[row.bulan].push(row);
    return acc;
  }, {} as Record<string, any[]>);

  const totalRetribusi = sum(dataLaporan, 'retribusi');
  const totalLayanan = sum(dataLaporan, 'aktif') + sum(dataLaporan, 'semi_aktif') + sum(dataLaporan, 'pasif');

  const handleExportExcel = () => {
    if (!dataLaporan || dataLaporan.length === 0) return alert('Belum ada data laporan untuk diekspor!');
    const rows = dataLaporan.map((row) => ({
      Bulan: row.bulan,
      No: row.no_urut || row.no,
      Puskeswan: row.puskeswan,
      'BEF (Demam 3 Hari)': row.bef,
      Cacingan: row.cacingan,
      Scabies: row.scabies,
      ORF: row.orf,
      'PMK (Kasus)': row.pmk_diag,
      'LSD (Kasus)': row.lsd_diag,
      'Pelayanan Aktif': row.aktif,
      'Pelayanan Semi Aktif': row.semi_aktif,
      'Pelayanan Pasif': row.pasif,
      Pusling: row.pusling,
      'Inseminasi Buatan': row.ib,
      'Pemeriksaan Kebuntingan': row.pkb,
      'Vaksinasi PMK': row.pmk_vaks,
      'Vaksinasi LSD': row.lsd_vaks,
      'Retribusi (Rp)': row.retribusi,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan_Puskeswan');
    XLSX.writeFile(wb, `Rekap_Kinerja_Puskeswan_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Helper render sel yang bisa diklik untuk edit
  const renderEditableCell = (row: any, field: string, isCurrency = false, extraClass = '') => {
    const isEditing =
      editingCell?.bulan === row.bulan &&
      editingCell?.puskeswan === row.puskeswan &&
      editingCell?.field === field;

    const value = row[field] ?? 0;

    if (isEditing) {
      return (
        <td className={`p-1 border-r border-blue-400 bg-blue-50/90 font-sans ${extraClass}`}>
          <input
            ref={inputRef}
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="w-full text-center py-1 px-1.5 text-xs font-bold font-sans bg-white border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-900 shadow-sm"
          />
        </td>
      );
    }

    return (
      <td
        onClick={() => handleStartEdit(row.bulan, row.puskeswan, field, value)}
        title="Klik untuk mengubah angka"
        className={`p-3 border-r border-slate-100 font-sans cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors group select-none ${
          isCurrency ? 'text-right font-medium text-slate-900' : 'text-center'
        } ${extraClass}`}
      >
        <span className="group-hover:underline decoration-blue-400 underline-offset-2">
          {isCurrency ? `Rp ${formatRp(value)}` : (value ?? 0)}
        </span>
      </td>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── TOP HEADER ── */}
      <header className="border-b border-blue-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/keswan"
              className="min-h-touch min-w-touch w-11 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-xs shrink-0"
              aria-label="Kembali ke Keswan"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Link href="/keswan" className="text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors truncate">
                  Keswan
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-blue-700 whitespace-nowrap">Puskeswan</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
                Rekapitulasi Kinerja Bulanan Puskeswan 2026
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportExcel}
              title="Export Excel"
              aria-label="Export Excel"
              className="min-h-touch min-w-touch h-11 w-11 sm:w-auto sm:px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center sm:gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Download size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Export Excel</span>
            </button>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              title="Tarik Data Live Sheets"
              aria-label="Tarik Data Live Sheets"
              className="min-h-touch min-w-touch h-11 w-11 sm:w-auto sm:px-5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center sm:gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw size={15} strokeWidth={2.5} className={isSyncing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{isSyncing ? 'Menyinkronkan...' : 'Tarik Data Live Sheets'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        
        {/* Banner Info Inline Edit */}
        <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs sm:text-sm">
          <Info size={18} className="text-blue-600 shrink-0" />
          <p>
            <strong>Mode Click-to-Edit Aktif:</strong> Klik langsung pada angka tabel mana saja untuk mengubah nilainya. Tekan <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded font-mono text-xs font-bold text-blue-700">Enter</kbd> atau klik di luar sel untuk menyimpan otomatis.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Puskeswan Terpantau
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-slate-900">
              8 <span className="text-xs font-normal text-slate-500">Unit Wilayah</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total Pelayanan
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-blue-600">
              {totalLayanan.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Kasus</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Vaksinasi Terlaksana
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-emerald-600">
              {(sum(dataLaporan, 'pmk_vaks') + sum(dataLaporan, 'lsd_vaks')).toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Dosis</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Penerimaan Retribusi
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-slate-900">
              Rp {formatRp(totalRetribusi)}
            </p>
          </div>
        </div>

        {/* Master Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-slate-900">
                Tabel Rekapitulasi Pelayanan, Diagnosa, &amp; Retribusi Puskeswan
              </h2>
              <p className="text-xs text-slate-500">Klik sel angka untuk mengedit langsung di tempat</p>
            </div>
            <span className="font-sans text-xs text-slate-500">Tahun Anggaran 2026</span>
          </div>

          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-xs text-center whitespace-nowrap border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider sticky top-0 z-20 border-b border-slate-200 shadow-sm">
                <tr>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 w-24 bg-slate-100">BULAN</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 w-12 bg-slate-100">NO</th>
                  <th rowSpan={2} className="p-3 text-left border-r border-slate-200 bg-slate-100">PUSKESWAN</th>
                  <th colSpan={6} className="p-2 border-r border-slate-200 bg-slate-200/70 text-slate-800">
                    DIAGNOSA PENYAKIT
                  </th>
                  <th colSpan={3} className="p-2 border-r border-slate-200 bg-blue-50 text-blue-900">
                    SISTEM PELAYANAN
                  </th>
                  <th colSpan={3} className="p-2 border-r border-slate-200 bg-indigo-50 text-indigo-900">
                    PELAYANAN (EKOR)
                  </th>
                  <th colSpan={2} className="p-2 border-r border-slate-200 bg-emerald-50 text-emerald-900">
                    VAKSINASI
                  </th>
                  <th rowSpan={2} className="p-3 text-right font-sans bg-slate-200/70">RETRIBUSI</th>
                </tr>
                <tr className="border-t border-slate-200 bg-slate-50 text-[11px]">
                  <th className="p-2 border-r border-slate-200 font-sans">BEF</th>
                  <th className="p-2 border-r border-slate-200 font-sans">CACING</th>
                  <th className="p-2 border-r border-slate-200 font-sans">SCABIES</th>
                  <th className="p-2 border-r border-slate-200 font-sans">ORF</th>
                  <th className="p-2 border-r border-slate-200 font-sans">PMK</th>
                  <th className="p-2 border-r border-slate-200 font-sans">LSD</th>

                  <th className="p-2 border-r border-slate-200 font-sans">AKTIF</th>
                  <th className="p-2 border-r border-slate-200 font-sans">SEMI</th>
                  <th className="p-2 border-r border-slate-200 font-sans">PASIF</th>

                  <th className="p-2 border-r border-slate-200 font-sans">PUSLING</th>
                  <th className="p-2 border-r border-slate-200 font-sans">IB</th>
                  <th className="p-2 border-r border-slate-200 font-sans">PKB</th>

                  <th className="p-2 border-r border-slate-200 font-sans">PMK</th>
                  <th className="p-2 border-r border-slate-200 font-sans">LSD</th>
                </tr>
              </thead>

              {(Object.entries(groupedData) as [string, any[]][]).map(([bulan, rows]) => (
                <tbody key={bulan} className="divide-y divide-slate-100 text-slate-800">
                  {rows.map((row, idx) => (
                    <tr key={`${row.bulan}-${row.puskeswan}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                      {idx === 0 && (
                        <td
                          rowSpan={rows.length + 1}
                          className="p-3 border-r border-slate-200 font-sans font-bold text-blue-600 uppercase bg-slate-50/50 align-middle"
                        >
                          {bulan}
                        </td>
                      )}
                      <td className="p-3 border-r border-slate-100 font-sans text-slate-400">{row.no_urut || row.no || idx + 1}</td>
                      <td className="p-3 text-left font-bold text-slate-900 border-r border-slate-100">
                        {row.puskeswan}
                      </td>

                      {/* Diagnosa */}
                      {renderEditableCell(row, 'bef')}
                      {renderEditableCell(row, 'cacingan')}
                      {renderEditableCell(row, 'scabies')}
                      {renderEditableCell(row, 'orf')}
                      {renderEditableCell(row, 'pmk_diag')}
                      {renderEditableCell(row, 'lsd_diag')}

                      {/* Sistem Pelayanan */}
                      {renderEditableCell(row, 'aktif')}
                      {renderEditableCell(row, 'semi_aktif')}
                      {renderEditableCell(row, 'pasif')}

                      {/* Pelayanan Ekor */}
                      {renderEditableCell(row, 'pusling')}
                      {renderEditableCell(row, 'ib')}
                      {renderEditableCell(row, 'pkb')}

                      {/* Vaksinasi */}
                      {renderEditableCell(row, 'pmk_vaks')}
                      {renderEditableCell(row, 'lsd_vaks')}

                      {/* Retribusi */}
                      {renderEditableCell(row, 'retribusi', true)}
                    </tr>
                  ))}

                  {/* Subtotal Row */}
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={2} className="p-3 text-center border-r border-slate-200 font-sans uppercase">
                      JUMLAH {bulan}
                    </td>
                    <td className="p-3 border-r border-slate-200 font-sans">{sum(rows, 'bef')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans">{sum(rows, 'cacingan')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans">{sum(rows, 'scabies')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans">{sum(rows, 'orf')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans">{sum(rows, 'pmk_diag')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans">{sum(rows, 'lsd_diag')}</td>

                    <td className="p-3 border-r border-slate-200 font-sans text-blue-600">{sum(rows, 'aktif')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans text-blue-600">{sum(rows, 'semi_aktif')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans text-blue-600">{sum(rows, 'pasif')}</td>

                    <td className="p-3 border-r border-slate-200 font-sans">{sum(rows, 'pusling')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans">{sum(rows, 'ib')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans">{sum(rows, 'pkb')}</td>

                    <td className="p-3 border-r border-slate-200 font-sans text-emerald-700">{sum(rows, 'pmk_vaks')}</td>
                    <td className="p-3 border-r border-slate-200 font-sans text-emerald-700">{sum(rows, 'lsd_vaks')}</td>

                    <td className="p-3 text-right font-sans font-bold text-slate-900">
                      Rp {formatRp(sum(rows, 'retribusi'))}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>

      </main>

    </div>
  );
}