'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx'; // 👈 INI TAMBAHAN IMPORT UNTUK EXCEL

// ─────────────────────────────────────────────
// TIPE DATA
// ─────────────────────────────────────────────
interface Bulanan {
  id: number; no_urut: number; puskeswan: string; target: number; pengambilan: number;
  realisasi: number; kekurangan: number;
  jan: number; feb: number; mar: number; apr: number; mei: number; jun: number;
  jul: number; agu: number; sep: number; okt: number; nov: number; des: number;
}
interface Harian { id: number; puskeswan: string; tanggal: string; jumlah: number; }
interface Droping { id: number; tanggal: string; merk_vaksin: string; jumlah: number; keterangan: string | null; }
interface ApbdTarget {
  id: number; no_urut: number; puskeswan: string;
  target_lsd: number; target_ndai: number; target_rabies: number; target_aphtovaks: number;
  pengambilan_ndai: string | null; pengambilan_aphtovaks: string | null; catatan: string | null;
}

const BULAN_LABEL = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const BULAN_LONG = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const BULAN_KEY: (keyof Bulanan)[] = ['jan','feb','mar','apr','mei','jun','jul','agu','sep','okt','nov','des'];

function daysInMonth(month: number, year = 2026) { return new Date(year, month, 0).getDate(); }
const n = (v: any) => Number(v) || 0; 

const emptyBulananForm = { no_urut: 0, puskeswan: '', target: 0, pengambilan: 0 };
const emptyDropingForm = { tanggal: '', merk_vaksin: '', jumlah: 0, keterangan: '' };

// ─── ICONS ───
const IconRefresh = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>;
const IconClose = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconExcel = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

export default function DataVaksinasiPMKPage() {
  const [activeTab, setActiveTab] = useState<'harian' | 'bulanan' | 'apbd'>('bulanan');
  const [activeMonth, setActiveMonth] = useState<number>(1);

  const [bulanan, setBulanan] = useState<Bulanan[]>([]);
  const [harian, setHarian] = useState<Harian[]>([]);
  const [droping, setDroping] = useState<Droping[]>([]);
  const [apbdTarget, setApbdTarget] = useState<ApbdTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [modalBulanan, setModalBulanan] = useState<{ open: boolean; edit: Bulanan | null }>({ open: false, edit: null });
  const [formBulanan, setFormBulanan] = useState<any>(emptyBulananForm);

  const [modalHarian, setModalHarian] = useState<{ open: boolean; puskeswan: string; tanggal: string; existingId: number | null }>({
    open: false, puskeswan: '', tanggal: '', existingId: null,
  });
  const [formHarianJumlah, setFormHarianJumlah] = useState<string>('');

  const [modalDroping, setModalDroping] = useState<{ open: boolean; edit: Droping | null }>({ open: false, edit: null });
  const [formDroping, setFormDroping] = useState<any>(emptyDropingForm);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [rB, rH, rD, rT] = await Promise.all([
        fetch('/api/vaksinasi-pmk/bulanan').then((r) => r.json()),
        fetch('/api/vaksinasi-pmk/harian').then((r) => r.json()),
        fetch('/api/vaksinasi-pmk/apbd-droping').then((r) => r.json()),
        fetch('/api/vaksinasi-pmk/apbd-target').then((r) => r.json()),
      ]);
      if (rB.success) setBulanan(rB.data);
      if (rH.success) setHarian(rH.data);
      if (rD.success) setDroping(rD.data);
      if (rT.success) setApbdTarget(rT.data);
    } catch (e: any) {
      showToast('error', 'Gagal memuat data: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── PERBAIKAN BUG TIMEZONE DI SINI ───
  const harianMap = useMemo(() => {
    const map: Record<string, Record<string, { id: number; jumlah: number }>> = {};
    for (const h of harian) {
      if (!map[h.puskeswan]) map[h.puskeswan] = {};
      
      const dateObj = new Date(h.tanggal);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const fixDateStr = `${yyyy}-${mm}-${dd}`;

      map[h.puskeswan][fixDateStr] = { id: h.id, jumlah: n(h.jumlah) };
    }
    return map;
  }, [harian]);

  const totalBulanan = bulanan.reduce(
    (acc, r) => ({
      target: acc.target + n(r.target),
      pengambilan: acc.pengambilan + n(r.pengambilan),
      realisasi: acc.realisasi + n(r.realisasi),
      kekurangan: acc.kekurangan + n(r.kekurangan),
    }),
    { target: 0, pengambilan: 0, realisasi: 0, kekurangan: 0 }
  );

  // ─── FUNGSI EXPORT EXCEL ───
  const handleExportExcel = () => {
    try {
      // 1. Data Sheet Rekap Bulanan
      const wsBulananData = bulanan.map(b => ({
        "No. Urut": b.no_urut,
        "Puskeswan": b.puskeswan,
        "Target": b.target,
        "Pengambilan": b.pengambilan,
        "Realisasi": b.realisasi,
        "Kekurangan": b.kekurangan,
        "Jan": b.jan || 0, "Feb": b.feb || 0, "Mar": b.mar || 0, "Apr": b.apr || 0,
        "Mei": b.mei || 0, "Jun": b.jun || 0, "Jul": b.jul || 0, "Agu": b.agu || 0,
        "Sep": b.sep || 0, "Okt": b.okt || 0, "Nov": b.nov || 0, "Des": b.des || 0
      }));
      const wsBulanan = XLSX.utils.json_to_sheet(wsBulananData);

      // 2. Data Sheet Harian
      const wsHarianData = harian.map(h => ({
        "Puskeswan": h.puskeswan,
        "Tanggal": new Date(h.tanggal).toLocaleDateString('id-ID'),
        "Jumlah Dosis": h.jumlah
      }));
      const wsHarian = XLSX.utils.json_to_sheet(wsHarianData);

      // 3. Data Sheet Target APBD
      const wsApbdData = apbdTarget.map(a => ({
        "Puskeswan": a.puskeswan,
        "Target LSD": a.target_lsd,
        "Target ND AI": a.target_ndai,
        "Target Rabies": a.target_rabies,
        "Target Aphtovaks": a.target_aphtovaks
      }));
      const wsApbd = XLSX.utils.json_to_sheet(wsApbdData);

      // 4. Data Sheet Log Droping
      const wsDropingData = droping.map(d => ({
        "Tanggal Droping": new Date(d.tanggal).toLocaleDateString('id-ID'),
        "Merk Vaksin": d.merk_vaksin,
        "Jumlah (Dosis)": d.jumlah,
        "Keterangan": d.keterangan || '-'
      }));
      const wsDroping = XLSX.utils.json_to_sheet(wsDropingData);

      // Buat Workbook Baru & Masukkan Sheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsBulanan, "Rekap Bulanan");
      XLSX.utils.book_append_sheet(wb, wsHarian, "Data Harian");
      XLSX.utils.book_append_sheet(wb, wsApbd, "Target APBD");
      XLSX.utils.book_append_sheet(wb, wsDroping, "Log Droping");

      // Simpan File
      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Data_Vaksinasi_PMK_${dateStr}.xlsx`);
      showToast('success', 'File Excel berhasil diunduh!');
    } catch (error) {
      console.error("Gagal export Excel:", error);
      showToast('error', 'Gagal mengekspor file Excel.');
    }
  };

  // ─── CRUD BULANAN ───
  const openEditBulanan = (row: Bulanan) => {
    setFormBulanan({ no_urut: row.no_urut, puskeswan: row.puskeswan, target: row.target, pengambilan: row.pengambilan });
    setModalBulanan({ open: true, edit: row });
  };
  const submitBulanan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formBulanan.puskeswan.trim()) { showToast('error', 'Nama Puskeswan wajib diisi.'); return; }
    try {
      const isEdit = !!modalBulanan.edit;
      const url = isEdit ? `/api/vaksinasi-pmk/bulanan/${modalBulanan.edit!.id}` : '/api/vaksinasi-pmk/bulanan';
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formBulanan) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      setModalBulanan({ open: false, edit: null });
      fetchAll();
    } catch (e: any) { showToast('error', e.message); }
  };
  const deleteBulanan = async (row: Bulanan) => {
    if (!confirm(`Hapus Puskeswan "${row.puskeswan}"? Seluruh data harian miliknya juga akan terhapus.`)) return;
    try {
      const res = await fetch(`/api/vaksinasi-pmk/bulanan/${row.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      fetchAll();
    } catch (e: any) { showToast('error', e.message); }
  };

  // ─── CRUD HARIAN ───
  const openCellHarian = (puskeswan: string, tanggal: string) => {
    const existing = harianMap[puskeswan]?.[tanggal];
    setFormHarianJumlah(existing ? String(existing.jumlah) : '');
    setModalHarian({ open: true, puskeswan, tanggal, existingId: existing?.id ?? null });
  };
  const submitHarian = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/vaksinasi-pmk/harian', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puskeswan: modalHarian.puskeswan, tanggal: modalHarian.tanggal, jumlah: Number(formHarianJumlah) || 0 }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      setModalHarian({ open: false, puskeswan: '', tanggal: '', existingId: null });
      fetchAll();
    } catch (e: any) { showToast('error', e.message); }
  };
  const deleteHarian = async () => {
    if (!modalHarian.existingId) return;
    try {
      const res = await fetch(`/api/vaksinasi-pmk/harian/${modalHarian.existingId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      setModalHarian({ open: false, puskeswan: '', tanggal: '', existingId: null });
      fetchAll();
    } catch (e: any) { showToast('error', e.message); }
  };

  // ─── CRUD DROPING APBD ───
  const openAddDroping = () => { setFormDroping(emptyDropingForm); setModalDroping({ open: true, edit: null }); };
  const openEditDroping = (row: Droping) => {
    setFormDroping({ tanggal: row.tanggal?.slice(0, 10) || '', merk_vaksin: row.merk_vaksin, jumlah: row.jumlah, keterangan: row.keterangan || '' });
    setModalDroping({ open: true, edit: row });
  };
  const submitDroping = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formDroping.tanggal || !formDroping.merk_vaksin.trim()) { showToast('error', 'Tanggal dan Merk Vaksin wajib diisi.'); return; }
    try {
      const isEdit = !!modalDroping.edit;
      const url = isEdit ? `/api/vaksinasi-pmk/apbd-droping/${modalDroping.edit!.id}` : '/api/vaksinasi-pmk/apbd-droping';
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formDroping) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      setModalDroping({ open: false, edit: null });
      fetchAll();
    } catch (e: any) { showToast('error', e.message); }
  };
  const deleteDroping = async (row: Droping) => {
    if (!confirm(`Hapus log droping "${row.merk_vaksin}"?`)) return;
    try {
      const res = await fetch(`/api/vaksinasi-pmk/apbd-droping/${row.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      fetchAll();
    } catch (e: any) { showToast('error', e.message); }
  };

  // =========================================================================
  // TAB 1: HARIAN
  // =========================================================================
  const renderTabHarian = () => {
    const nDays = daysInMonth(activeMonth);
    const days = Array.from({ length: nDays }, (_, i) => i + 1);

    const dailyTotalPerDay = (day: number) => {
      const dateStr = `2026-${String(activeMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return bulanan.reduce((sum, b) => sum + (harianMap[b.puskeswan]?.[dateStr]?.jumlah || 0), 0);
    };
    const realisasiBulanIni = (puskeswan: string) => {
      const entries = harianMap[puskeswan] || {};
      return Object.entries(entries)
        .filter(([tgl]) => tgl.startsWith(`2026-${String(activeMonth).padStart(2, '0')}`))
        .reduce((sum, [, v]) => sum + v.jumlah, 0);
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* NAVIGASI BULAN (DI TENGAH) */}
        <div className="flex justify-center w-full">
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar w-full max-w-5xl justify-center">
            {BULAN_LABEL.slice(1).map((label, idx) => (
              <button key={label} onClick={() => setActiveMonth(idx + 1)}
                className={`px-5 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all shadow-sm border ${
                  activeMonth === idx + 1 
                  ? 'bg-slate-800 text-white border-slate-800 shadow-slate-800/30' 
                  : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50 hover:text-slate-800'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* TABEL DATA HARIAN */}
        <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-300 px-6 py-8 text-center flex flex-col items-center relative">
            <h2 className="font-black text-slate-800 text-2xl md:text-3xl tracking-tight">INPUT HARIAN — {BULAN_LONG[activeMonth].toUpperCase()} 2026</h2>
            <p className="text-sm font-medium text-slate-500 mt-2">Klik sel angka biru / titik abu-abu di dalam tabel untuk mengelola jumlah dosis.</p>
            
            <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-300 mt-6 shadow-sm">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-400 block"></span> Terisi</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300 block"></span> Kosong</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="text-left text-xs whitespace-nowrap border-collapse w-full">
              <thead>
                <tr className="bg-[#1e293b] text-white">
                  <th className="px-5 py-4 sticky left-0 bg-[#1e293b] z-20 min-w-[150px] font-black uppercase tracking-widest shadow-[2px_0_5px_rgba(0,0,0,0.15)] border-r border-slate-700">Puskeswan</th>
                  <th className="px-4 py-4 text-center font-black uppercase tracking-widest border-r border-slate-700">Target</th>
                  <th className="px-4 py-4 text-center font-black uppercase tracking-widest border-r border-slate-700">Ambil</th>
                  <th className="px-4 py-4 text-center font-black uppercase tracking-widest text-emerald-400 border-r border-slate-700">Realisasi</th>
                  {days.map((d) => (
                    <th key={d} className="px-2 py-4 text-center border-r border-slate-700 min-w-[44px] font-bold text-slate-300">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bulanan.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-blue-50/40 transition-colors border-b border-slate-300 last:border-b-0 group">
                    <td className="px-5 py-3 font-bold text-slate-800 sticky left-0 z-10 bg-white group-hover:bg-blue-50 shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r border-slate-300">{row.puskeswan}</td>
                    <td className="px-4 py-3 text-center text-slate-700 font-semibold border-r border-slate-300">{row.target.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-center text-slate-600 border-r border-slate-300">{row.pengambilan}</td>
                    <td className="px-4 py-3 text-center font-black text-emerald-600 bg-emerald-50/50 border-r border-slate-300">{realisasiBulanIni(row.puskeswan).toLocaleString('id-ID')}</td>
                    {days.map((d) => {
                      const dateStr = `2026-${String(activeMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                      const val = harianMap[row.puskeswan]?.[dateStr]?.jumlah;
                      return (
                        <td key={d} onClick={() => openCellHarian(row.puskeswan, dateStr)}
                          className={`p-1.5 text-center border-r border-slate-300 cursor-pointer transition-all ${
                            val ? 'bg-blue-50/70' : 'hover:bg-slate-100'
                          }`}>
                          <div className={`w-full h-full flex items-center justify-center py-2 rounded font-bold text-[13px] transition-colors ${
                            val ? 'text-blue-800 bg-blue-200/50 hover:bg-blue-300/60' : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50'
                          }`}>
                            {val ?? '-'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {bulanan.length > 0 && (
                  <tr className="bg-slate-100 text-slate-800 font-black border-t-2 border-slate-400">
                    <td className="px-5 py-4 sticky left-0 bg-slate-100 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.1)] border-r border-slate-300">TOTAL KABUPATEN</td>
                    <td className="px-4 py-4 text-center text-slate-800 border-r border-slate-300">{totalBulanan.target.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-4 text-center text-slate-700 border-r border-slate-300">{totalBulanan.pengambilan.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-4 text-center text-emerald-600 border-r border-slate-300 text-sm">{bulanan.reduce((s, b) => s + realisasiBulanIni(b.puskeswan), 0).toLocaleString('id-ID')}</td>
                    {days.map((d) => {
                      const daily = dailyTotalPerDay(d);
                      return <td key={d} className={`px-2 py-4 text-center border-r border-slate-300 ${daily > 0 ? 'text-blue-700' : 'text-slate-500'}`}>{daily || '-'}</td>;
                    })}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // TAB 2: REKAP BULANAN
  // =========================================================================
  const renderTabBulanan = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm text-center">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Total Target</p>
          <p className="text-3xl font-black text-slate-800">{totalBulanan.target.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm text-center border-b-4 border-b-blue-600">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Pengambilan</p>
          <p className="text-3xl font-black text-blue-700">{totalBulanan.pengambilan.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm text-center border-b-4 border-b-emerald-500">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Total Realisasi</p>
          <p className="text-3xl font-black text-emerald-600">{totalBulanan.realisasi.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm text-center border-b-4 border-b-rose-500">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Kekurangan</p>
          <p className="text-3xl font-black text-rose-600">{totalBulanan.kekurangan.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-300 px-6 py-8 flex flex-col items-center justify-center relative">
          <h2 className="font-black text-slate-800 text-2xl md:text-3xl tracking-tight">CAPAIAN BULANAN TAHUN 2026</h2>
          <p className="text-sm font-medium text-slate-500 mt-2">Data diakumulasi otomatis dari form Input Harian per Puskeswan.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead className="bg-[#1e293b] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4 sticky left-0 bg-[#1e293b] z-20 border-r border-slate-700 shadow-[2px_0_5px_rgba(0,0,0,0.15)]">Puskeswan</th>
                <th className="px-4 py-4 text-center border-r border-slate-700">Target</th>
                <th className="px-4 py-4 text-center border-r border-slate-700">Ambil</th>
                <th className="px-4 py-4 text-center text-emerald-400 border-r border-slate-700">Realisasi</th>
                <th className="px-4 py-4 text-center text-rose-400 border-r border-slate-700">Kurang</th>
                {BULAN_LABEL.slice(1).map((b) => <th key={b} className="px-3 py-4 text-center border-r border-slate-700">{b}</th>)}
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && <tr><td colSpan={18} className="px-6 py-12 text-center text-slate-500 font-medium">Memuat data dari server...</td></tr>}
              {!loading && bulanan.length === 0 && <tr><td colSpan={18} className="px-6 py-12 text-center text-slate-500 font-medium">Belum ada data. Silakan tambah Puskeswan.</td></tr>}
              {bulanan.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-3 font-bold text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 shadow-[2px_0_5px_rgba(0,0,0,0.02)] border-r border-slate-300">{row.puskeswan}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700 border-r border-slate-300">{row.target.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-center text-slate-600 border-r border-slate-300">{row.pengambilan}</td>
                  <td className="px-4 py-3 text-center font-black text-emerald-700 bg-emerald-50/50 border-r border-slate-300">{row.realisasi.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-center font-bold text-rose-600 bg-rose-50/50 border-r border-slate-300">{row.kekurangan.toLocaleString('id-ID')}</td>
                  {BULAN_KEY.map((k) => {
                    const val = n(row[k]);
                    return (
                      <td key={k} className={`px-3 py-3 text-center border-r border-slate-300 text-xs font-bold ${val > 0 ? 'text-blue-800 bg-blue-50/50' : 'text-slate-400'}`}>
                        {val ? val.toLocaleString('id-ID') : '-'}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEditBulanan(row)} className="text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 font-bold px-3 py-1 rounded text-xs transition-colors">Edit</button>
                      <button onClick={() => deleteBulanan(row)} className="text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-bold px-3 py-1 rounded text-xs transition-colors">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {bulanan.length > 0 && (
                <tr className="bg-slate-100 text-slate-800 font-black border-t-2 border-slate-400">
                  <td className="px-5 py-4 sticky left-0 bg-slate-100 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.1)] border-r border-slate-300">TOTAL KABUPATEN</td>
                  <td className="px-4 py-4 text-center border-r border-slate-300">{totalBulanan.target.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-4 text-center border-r border-slate-300">{totalBulanan.pengambilan.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-4 text-center text-emerald-600 border-r border-slate-300">{totalBulanan.realisasi.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-4 text-center text-rose-600 border-r border-slate-300">{totalBulanan.kekurangan.toLocaleString('id-ID')}</td>
                  {BULAN_KEY.map((k) => {
                    const sum = bulanan.reduce((s, r) => s + n(r[k]), 0);
                    return <td key={k} className={`px-3 py-4 text-center border-r border-slate-300 ${sum > 0 ? 'text-blue-700' : 'text-slate-500'}`}>{sum ? sum.toLocaleString('id-ID') : '-'}</td>;
                  })}
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // TAB 3: APBD JATENG
  // =========================================================================
  const renderTabAPBD = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-300 px-6 py-8 flex flex-col items-center">
          <h2 className="font-black text-slate-800 tracking-tight text-2xl md:text-3xl text-center">DROPING VAKSIN LSD & APBD PROVINSI</h2>
          <p className="text-sm font-medium text-slate-500 mt-2 text-center">Dinas Pertanian & Peternakan Prov. Jateng Tahun 2026</p>
        </div>

        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b-2 border-slate-200 pb-2 inline-block">Alokasi Per Puskeswan</h3>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                <thead className="bg-[#1e293b] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3 border-r border-slate-700">Puskeswan</th>
                    <th className="px-4 py-3 text-center border-r border-slate-700">LSD</th>
                    <th className="px-4 py-3 text-center border-r border-slate-700">ND AI</th>
                    <th className="px-4 py-3 text-center border-r border-slate-700">Rabies</th>
                    <th className="px-4 py-3 text-center">Aphtovaks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {apbdTarget.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-300">{row.puskeswan}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700 border-r border-slate-300">{row.target_lsd}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700 border-r border-slate-300">{row.target_ndai}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700 border-r border-slate-300">{row.target_rabies}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700">{row.target_aphtovaks}</td>
                    </tr>
                  ))}
                  {apbdTarget.length > 0 && (
                    <tr className="bg-slate-100 font-black text-slate-800 border-t-2 border-slate-400">
                      <td className="px-5 py-3 text-right border-r border-slate-300">TOTAL</td>
                      <td className="px-4 py-3 text-center text-blue-700 border-r border-slate-300">{apbdTarget.reduce((a, r) => a + n(r.target_lsd), 0)}</td>
                      <td className="px-4 py-3 text-center text-emerald-700 border-r border-slate-300">{apbdTarget.reduce((a, r) => a + n(r.target_ndai), 0)}</td>
                      <td className="px-4 py-3 text-center text-rose-700 border-r border-slate-300">{apbdTarget.reduce((a, r) => a + n(r.target_rabies), 0)}</td>
                      <td className="px-4 py-3 text-center text-amber-700">{apbdTarget.reduce((a, r) => a + n(r.target_aphtovaks), 0)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Log Droping Vaksin</h3>
              <button onClick={openAddDroping} className="bg-[#1e293b] hover:bg-slate-900 text-white font-bold px-4 py-1.5 rounded text-xs shadow transition-all">
                + Catat Droping
              </button>
            </div>
            
            <div className="bg-white border border-slate-300 rounded-lg p-2 space-y-2">
              {droping.length === 0 && <p className="text-sm text-slate-500 text-center py-8 font-medium">Belum ada riwayat droping vaksin.</p>}
              {droping.map((row) => (
                <div key={row.id} className="flex justify-between items-center p-4 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded transition-all group">
                  <div>
                    <span className="font-black text-slate-800 text-sm block mb-1">{row.merk_vaksin}</span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                      <span className="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded uppercase">{new Date(row.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {row.keterangan && <span>• {row.keterangan}</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded border border-blue-200">
                      {row.jumlah} <span className="text-[10px] text-blue-600 font-bold uppercase ml-1">Dosis</span>
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditDroping(row)} className="text-blue-700 hover:text-blue-900 p-1"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                      <button onClick={() => deleteDroping(row)} className="text-rose-600 hover:text-rose-800 p-1"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[101vh] bg-slate-100 font-sans pb-24 relative">
      <style dangerouslySetInnerHTML={{ __html: `html { overflow-y: scroll !important; }` }} />

      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3.5 rounded-xl shadow-xl font-bold text-sm text-white flex items-center gap-3 animate-in slide-in-from-top-4 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.msg}
        </div>
      )}

      {/* HEADER NAVIGASI - GRADASI BIRU DONGKER ALA KESWAN */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row items-center justify-between shadow-lg border-b border-sky-500/30 sticky top-0 z-40">
        <div className="w-full relative flex flex-col md:flex-row items-center justify-center">
          
          <div className="md:absolute left-0 mb-4 md:mb-0 w-full md:w-auto flex justify-start">
            <Link href="/keswan" className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Kembali
            </Link>
          </div>
          
          <div className="text-center px-4">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">REKAPITULASI VAKSINASI PMK</h1>
            <p className="text-sky-200 text-sm font-bold mt-1">Sistem Manajemen Kesehatan Hewan • Terhubung MySQL</p>
          </div>

          <div className="md:absolute right-0 mt-4 md:mt-0 w-full md:w-auto flex justify-end gap-3">
            {/* 👈 INI DIA TOMBOL EXPORT EXCEL-NYA */}
            <button onClick={handleExportExcel} className="bg-emerald-600 border border-emerald-500 text-white hover:bg-emerald-500 font-bold px-4 py-2.5 rounded-lg shadow-sm text-sm flex items-center gap-2 transition-all active:scale-95">
              <IconExcel /> Export Excel
            </button>
            <button onClick={fetchAll} className="bg-sky-600 border border-sky-500 text-white hover:bg-sky-500 font-bold px-4 py-2.5 rounded-lg shadow-sm text-sm flex items-center gap-2 transition-all active:scale-95">
              <IconRefresh /> Muat Ulang
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-[1600px] mx-auto pt-10 px-4 md:px-8">
        
        {/* TABS (DI TENGAH) */}
        <div className="flex justify-center w-full mb-10">
          <div className="inline-flex bg-white p-1.5 rounded-lg border border-slate-300 shadow-sm overflow-x-auto hide-scrollbar">
            <button onClick={() => setActiveTab('harian')} className={`px-8 py-2.5 rounded-md font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'harian' ? 'bg-[#1e293b] text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>Harian</button>
            <button onClick={() => setActiveTab('bulanan')} className={`px-8 py-2.5 rounded-md font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'bulanan' ? 'bg-[#1e293b] text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>Rekap Bulanan</button>
            <button onClick={() => setActiveTab('apbd')} className={`px-8 py-2.5 rounded-md font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'apbd' ? 'bg-[#1e293b] text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>Vaksin APBD Jateng</button>
          </div>
        </div>

        {activeTab === 'harian' && renderTabHarian()}
        {activeTab === 'bulanan' && renderTabBulanan()}
        {activeTab === 'apbd' && renderTabAPBD()}
      </div>

      {/* ─────────────────────────────────────────────
          MODALS
      ───────────────────────────────────────────── */}
      
      {modalBulanan.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-black text-lg text-slate-800">EDIT PUSKESWAN</h3>
              <button onClick={() => setModalBulanan({ open: false, edit: null })} className="text-slate-400 hover:text-slate-600"><IconClose /></button>
            </div>
            <form onSubmit={submitBulanan} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Nama Puskeswan</label>
                  <input type="text" autoFocus value={formBulanan.puskeswan} onChange={(e) => setFormBulanan({ ...formBulanan, puskeswan: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Target (Dosis)</label>
                    <input type="number" value={formBulanan.target} onChange={(e) => setFormBulanan({ ...formBulanan, target: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Pengambilan</label>
                    <input type="number" value={formBulanan.pengambilan} onChange={(e) => setFormBulanan({ ...formBulanan, pengambilan: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8 pt-5 border-t border-slate-200">
                <button type="button" onClick={() => setModalBulanan({ open: false, edit: null })} className="flex-1 py-2.5 rounded-lg border border-slate-300 font-bold text-slate-600 text-sm hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#1e293b] hover:bg-slate-900 font-bold text-white text-sm transition-colors shadow-md">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalHarian.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-300">
            <form onSubmit={submitHarian} className="p-6">
              <div className="text-center mb-6 border-b border-slate-200 pb-4">
                <h3 className="font-black text-2xl text-slate-800 mb-1 uppercase">{modalHarian.puskeswan}</h3>
                <p className="text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 inline-block px-3 py-1 rounded">
                  {new Date(modalHarian.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="mb-6">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block text-center">Input Jumlah Dosis</label>
                <input type="number" autoFocus value={formHarianJumlah} onChange={(e) => setFormHarianJumlah(e.target.value)}
                  className="w-full text-center text-4xl font-black text-slate-800 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 outline-none transition-all placeholder:text-slate-200" placeholder="0" />
                <p className="text-xs text-center text-slate-500 font-medium mt-3">Tekan <kbd className="bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded font-bold text-slate-600 shadow-sm">Enter</kbd> untuk menyimpan.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setModalHarian({ open: false, puskeswan: '', tanggal: '', existingId: null })} className="py-2.5 px-4 rounded-lg border border-slate-300 font-bold text-slate-600 text-sm hover:bg-slate-50">Batal</button>
                {modalHarian.existingId && <button type="button" onClick={deleteHarian} className="py-2.5 px-4 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 font-bold text-rose-600 text-sm">Hapus</button>}
                <button type="submit" className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm shadow-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalDroping.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-black text-lg text-slate-800">{modalDroping.edit ? 'EDIT LOG DROPING' : 'CATAT DROPING VAKSIN'}</h3>
              <button onClick={() => setModalDroping({ open: false, edit: null })} className="text-slate-400 hover:text-slate-600"><IconClose /></button>
            </div>
            <form onSubmit={submitDroping} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Tanggal</label>
                  <input type="date" value={formDroping.tanggal} onChange={(e) => setFormDroping({ ...formDroping, tanggal: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Merk Vaksin</label>
                  <input type="text" autoFocus value={formDroping.merk_vaksin} onChange={(e) => setFormDroping({ ...formDroping, merk_vaksin: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Contoh: Bovamune LSD" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Jumlah (Dosis)</label>
                    <input type="number" value={formDroping.jumlah} onChange={(e) => setFormDroping({ ...formDroping, jumlah: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Keterangan</label>
                    <input type="text" value={formDroping.keterangan} onChange={(e) => setFormDroping({ ...formDroping, keterangan: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Contoh: BOP" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8 pt-5 border-t border-slate-200">
                <button type="button" onClick={() => setModalDroping({ open: false, edit: null })} className="flex-1 py-2.5 rounded-lg border border-slate-300 font-bold text-slate-600 text-sm hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#1e293b] hover:bg-slate-900 font-bold text-white text-sm transition-colors shadow-md">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}