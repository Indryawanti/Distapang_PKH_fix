'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Syringe,
  Package,
} from 'lucide-react';

interface Bulanan {
  id: number;
  no_urut: number;
  puskeswan: string;
  target: number;
  pengambilan: number;
  realisasi: number;
  kekurangan: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  jun: number;
  jul: number;
  agu: number;
  sep: number;
  okt: number;
  nov: number;
  des: number;
}
interface Harian {
  id: number;
  puskeswan: string;
  tanggal: string;
  jumlah: number;
}
interface Droping {
  id: number;
  tanggal: string;
  merk_vaksin: string;
  jumlah: number;
  keterangan: string | null;
}
interface ApbdTarget {
  id: number;
  no_urut: number;
  puskeswan: string;
  target_lsd: number;
  target_ndai: number;
  target_rabies: number;
  target_aphtovaks: number;
  pengambilan_ndai: string | null;
  pengambilan_aphtovaks: string | null;
  catatan: string | null;
}

const BULAN_LABEL = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const BULAN_LONG = [
  '',
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];
const BULAN_KEY: (keyof Bulanan)[] = [
  'jan',
  'feb',
  'mar',
  'apr',
  'mei',
  'jun',
  'jul',
  'agu',
  'sep',
  'okt',
  'nov',
  'des',
];

function daysInMonth(month: number, year = 2026) {
  return new Date(year, month, 0).getDate();
}
const n = (v: any) => Number(v) || 0;

const emptyBulananForm = { no_urut: 0, puskeswan: '', target: 0, pengambilan: 0 };
const emptyDropingForm = { tanggal: '', merk_vaksin: '', jumlah: 0, keterangan: '' };

export default function DataVaksinasiPMKPage() {
  const [activeTab, setActiveTab] = useState<'bulanan' | 'harian' | 'apbd'>('bulanan');
  const [activeMonth, setActiveMonth] = useState<number>(1);

  const [bulanan, setBulanan] = useState<Bulanan[]>([]);
  const [harian, setHarian] = useState<Harian[]>([]);
  const [droping, setDroping] = useState<Droping[]>([]);
  const [apbdTarget, setApbdTarget] = useState<ApbdTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [modalBulanan, setModalBulanan] = useState<{ open: boolean; edit: Bulanan | null }>({
    open: false,
    edit: null,
  });
  const [formBulanan, setFormBulanan] = useState<any>(emptyBulananForm);

  const [modalHarian, setModalHarian] = useState<{
    open: boolean;
    puskeswan: string;
    tanggal: string;
    existingId: number | null;
  }>({
    open: false,
    puskeswan: '',
    tanggal: '',
    existingId: null,
  });
  const [formHarianJumlah, setFormHarianJumlah] = useState<string>('');

  const [modalDroping, setModalDroping] = useState<{ open: boolean; edit: Droping | null }>({
    open: false,
    edit: null,
  });
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

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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

  const handleExportExcel = () => {
    try {
      const wsBulananData = bulanan.map((b) => ({
        'No. Urut': b.no_urut,
        Puskeswan: b.puskeswan,
        Target: b.target,
        Pengambilan: b.pengambilan,
        Realisasi: b.realisasi,
        Kekurangan: b.kekurangan,
        Jan: b.jan || 0,
        Feb: b.feb || 0,
        Mar: b.mar || 0,
        Apr: b.apr || 0,
        Mei: b.mei || 0,
        Jun: b.jun || 0,
        Jul: b.jul || 0,
        Agu: b.agu || 0,
        Sep: b.sep || 0,
        Okt: b.okt || 0,
        Nov: b.nov || 0,
        Des: b.des || 0,
      }));
      const wsBulanan = XLSX.utils.json_to_sheet(wsBulananData);

      const wsHarianData = harian.map((h) => ({
        Puskeswan: h.puskeswan,
        Tanggal: new Date(h.tanggal).toLocaleDateString('id-ID'),
        'Jumlah Dosis': h.jumlah,
      }));
      const wsHarian = XLSX.utils.json_to_sheet(wsHarianData);

      const wsApbdData = apbdTarget.map((a) => ({
        Puskeswan: a.puskeswan,
        'Target LSD': a.target_lsd,
        'Target ND AI': a.target_ndai,
        'Target Rabies': a.target_rabies,
        'Target Aphtovaks': a.target_aphtovaks,
      }));
      const wsApbd = XLSX.utils.json_to_sheet(wsApbdData);

      const wsDropingData = droping.map((d) => ({
        'Tanggal Droping': new Date(d.tanggal).toLocaleDateString('id-ID'),
        'Merk Vaksin': d.merk_vaksin,
        'Jumlah (Dosis)': d.jumlah,
        Keterangan: d.keterangan || '-',
      }));
      const wsDroping = XLSX.utils.json_to_sheet(wsDropingData);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsBulanan, 'Rekap Bulanan');
      XLSX.utils.book_append_sheet(wb, wsHarian, 'Data Harian');
      XLSX.utils.book_append_sheet(wb, wsApbd, 'Target APBD');
      XLSX.utils.book_append_sheet(wb, wsDroping, 'Log Droping');

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Data_Vaksinasi_PMK_${dateStr}.xlsx`);
      showToast('success', 'File Excel berhasil diunduh!');
    } catch {
      showToast('error', 'Gagal mengekspor file Excel.');
    }
  };

  const openEditBulanan = (row: Bulanan) => {
    setFormBulanan({
      no_urut: row.no_urut,
      puskeswan: row.puskeswan,
      target: row.target,
      pengambilan: row.pengambilan,
    });
    setModalBulanan({ open: true, edit: row });
  };

  const submitBulanan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formBulanan.puskeswan.trim()) {
      showToast('error', 'Nama Puskeswan wajib diisi.');
      return;
    }
    try {
      const isEdit = !!modalBulanan.edit;
      const url = isEdit
        ? `/api/vaksinasi-pmk/bulanan/${modalBulanan.edit!.id}`
        : '/api/vaksinasi-pmk/bulanan';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formBulanan),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      setModalBulanan({ open: false, edit: null });
      fetchAll();
    } catch (e: any) {
      showToast('error', e.message);
    }
  };

  const deleteBulanan = async (row: Bulanan) => {
    if (!confirm(`Hapus Puskeswan "${row.puskeswan}"? Seluruh data harian miliknya juga akan terhapus.`)) return;
    try {
      const res = await fetch(`/api/vaksinasi-pmk/bulanan/${row.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      fetchAll();
    } catch (e: any) {
      showToast('error', e.message);
    }
  };

  const openCellHarian = (puskeswan: string, tanggal: string) => {
    const existing = harianMap[puskeswan]?.[tanggal];
    setFormHarianJumlah(existing ? String(existing.jumlah) : '');
    setModalHarian({ open: true, puskeswan, tanggal, existingId: existing?.id ?? null });
  };

  const submitHarian = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/vaksinasi-pmk/harian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puskeswan: modalHarian.puskeswan,
          tanggal: modalHarian.tanggal,
          jumlah: Number(formHarianJumlah) || 0,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      setModalHarian({ open: false, puskeswan: '', tanggal: '', existingId: null });
      fetchAll();
    } catch (e: any) {
      showToast('error', e.message);
    }
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
    } catch (e: any) {
      showToast('error', e.message);
    }
  };

  const openAddDroping = () => {
    setFormDroping(emptyDropingForm);
    setModalDroping({ open: true, edit: null });
  };

  const openEditDroping = (row: Droping) => {
    setFormDroping({
      tanggal: row.tanggal?.slice(0, 10) || '',
      merk_vaksin: row.merk_vaksin,
      jumlah: row.jumlah,
      keterangan: row.keterangan || '',
    });
    setModalDroping({ open: true, edit: row });
  };

  const submitDroping = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formDroping.tanggal || !formDroping.merk_vaksin.trim()) {
      showToast('error', 'Tanggal dan Merk Vaksin wajib diisi.');
      return;
    }
    try {
      const isEdit = !!modalDroping.edit;
      const url = isEdit
        ? `/api/vaksinasi-pmk/apbd-droping/${modalDroping.edit!.id}`
        : '/api/vaksinasi-pmk/apbd-droping';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDroping),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      setModalDroping({ open: false, edit: null });
      fetchAll();
    } catch (e: any) {
      showToast('error', e.message);
    }
  };

  const deleteDroping = async (row: Droping) => {
    if (!confirm(`Hapus log droping "${row.merk_vaksin}"?`)) return;
    try {
      const res = await fetch(`/api/vaksinasi-pmk/apbd-droping/${row.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('success', json.message);
      fetchAll();
    } catch (e: any) {
      showToast('error', e.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-azure selection:text-white pb-20">
      
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── TOP HEADER ── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/keswan"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Kembali ke Keswan"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Link href="/keswan" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  Keswan
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-azure">Vaksinasi PMK</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Rekapitulasi & Pemantauan Vaksinasi PMK
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="min-h-touch h-10 px-3.5 sm:px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
            <button
              onClick={fetchAll}
              className="min-h-touch h-10 px-3.5 sm:px-4 rounded-xl bg-azure text-white text-xs font-bold flex items-center gap-1.5 hover:bg-azure/90 transition-all shadow-sm"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Muat Ulang</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-px">
          {[
            { key: 'bulanan', label: 'Rekapitulasi Bulanan' },
            { key: 'harian', label: 'Matriks Input Harian' },
            { key: 'apbd', label: 'Alokasi APBD & Log Droping' },
          ].map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`min-h-touch h-11 px-4 sm:px-5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition-all ${
                  active
                    ? 'bg-white border-slate-200 text-azure border-b-white translate-y-px shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-900 bg-slate-100/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: BULANAN ── */}
        {activeTab === 'bulanan' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Target Kabupaten
                </p>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">
                  {totalBulanan.target.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Dosis</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Pengambilan Vaksin
                </p>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-azure">
                  {totalBulanan.pengambilan.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Dosis</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Total Realisasi
                </p>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-vitality">
                  {totalBulanan.realisasi.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Dosis</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Sisa Kekurangan
                </p>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-rose-600">
                  {totalBulanan.kekurangan.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Dosis</span>
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Capaian Vaksinasi Per Puskeswan (Akumulasi Bulanan 2026)
                  </h3>
                  <p className="text-xs text-slate-500">Data otomatis teragregasi dari pencatatan harian</p>
                </div>
                <button
                  onClick={() => {
                    setFormBulanan(emptyBulananForm);
                    setModalBulanan({ open: true, edit: null });
                  }}
                  className="min-h-touch h-8 px-3 rounded-lg bg-azure text-white text-xs font-bold hover:bg-azure/90 flex items-center gap-1 shadow-sm"
                >
                  <Plus size={14} />
                  <span>Tambah Puskeswan</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">PUSKESWAN</th>
                      <th className="p-3.5 text-right font-mono">TARGET</th>
                      <th className="p-3.5 text-right font-mono">AMBIL</th>
                      <th className="p-3.5 text-right font-mono text-emerald-700">REALISASI</th>
                      <th className="p-3.5 text-right font-mono text-rose-600">KURANG</th>
                      {BULAN_LABEL.slice(1).map((b) => (
                        <th key={b} className="p-3 text-right font-mono">{b}</th>
                      ))}
                      <th className="p-3.5 text-center w-20">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {bulanan.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-100">
                          {row.puskeswan}
                        </td>
                        <td className="p-3.5 text-right font-mono">{row.target.toLocaleString('id-ID')}</td>
                        <td className="p-3.5 text-right font-mono">{row.pengambilan}</td>
                        <td className="p-3.5 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">
                          {row.realisasi.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-rose-600 bg-rose-50/30">
                          {row.kekurangan.toLocaleString('id-ID')}
                        </td>
                        {BULAN_KEY.map((k) => {
                          const val = n(row[k]);
                          return (
                            <td key={k} className={`p-3 text-right font-mono ${val > 0 ? 'text-azure font-bold' : 'text-slate-400'}`}>
                              {val ? val.toLocaleString('id-ID') : '-'}
                            </td>
                          );
                        })}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditBulanan(row)}
                              className="min-h-touch h-7 w-7 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => deleteBulanan(row)}
                              className="min-h-touch h-7 w-7 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center justify-center"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {bulanan.length > 0 && (
                    <tfoot>
                      <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                        <td className="p-3.5 sticky left-0 bg-slate-100 z-10 border-r border-slate-300 font-mono uppercase">
                          TOTAL KABUPATEN
                        </td>
                        <td className="p-3.5 text-right font-mono">{totalBulanan.target.toLocaleString('id-ID')}</td>
                        <td className="p-3.5 text-right font-mono">{totalBulanan.pengambilan.toLocaleString('id-ID')}</td>
                        <td className="p-3.5 text-right font-mono text-emerald-700 font-black">{totalBulanan.realisasi.toLocaleString('id-ID')}</td>
                        <td className="p-3.5 text-right font-mono text-rose-600 font-black">{totalBulanan.kekurangan.toLocaleString('id-ID')}</td>
                        {BULAN_KEY.map((k) => {
                          const sum = bulanan.reduce((s, r) => s + n(r[k]), 0);
                          return (
                            <td key={k} className="p-3 text-right font-mono font-bold text-azure">
                              {sum ? sum.toLocaleString('id-ID') : '-'}
                            </td>
                          );
                        })}
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: HARIAN ── */}
        {activeTab === 'harian' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Month Filter Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
              {BULAN_LABEL.slice(1).map((label, idx) => {
                const isSelected = activeMonth === idx + 1;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveMonth(idx + 1)}
                    className={`min-h-touch h-9 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-azure text-white border-azure shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {label} 2026
                  </button>
                );
              })}
            </div>

            {/* Matrix Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Matriks Log Harian — Bulan {BULAN_LONG[activeMonth]} 2026
                  </h3>
                  <p className="text-xs text-slate-500">
                    Klik kotak tanggal untuk mencatat atau mengubah jumlah dosis vaksinasi
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">PUSKESWAN</th>
                      <th className="p-3.5 text-right font-mono">TARGET</th>
                      <th className="p-3.5 text-right font-mono">AMBIL</th>
                      <th className="p-3.5 text-right font-mono text-emerald-700">REALISASI</th>
                      {Array.from({ length: daysInMonth(activeMonth) }, (_, i) => i + 1).map((d) => (
                        <th key={d} className="p-2 text-center font-mono w-9 min-w-[36px]">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {bulanan.map((row) => {
                      const days = Array.from({ length: daysInMonth(activeMonth) }, (_, i) => i + 1);
                      const realisasiBulanIni = Object.entries(harianMap[row.puskeswan] || {})
                        .filter(([tgl]) => tgl.startsWith(`2026-${String(activeMonth).padStart(2, '0')}`))
                        .reduce((sum, [, v]) => sum + v.jumlah, 0);

                      return (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-100">
                            {row.puskeswan}
                          </td>
                          <td className="p-3.5 text-right font-mono">{row.target.toLocaleString('id-ID')}</td>
                          <td className="p-3.5 text-right font-mono">{row.pengambilan}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">
                            {realisasiBulanIni.toLocaleString('id-ID')}
                          </td>
                          {days.map((d) => {
                            const dateStr = `2026-${String(activeMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const val = harianMap[row.puskeswan]?.[dateStr]?.jumlah;
                            return (
                              <td
                                key={d}
                                onClick={() => openCellHarian(row.puskeswan, dateStr)}
                                className={`p-1 text-center font-mono cursor-pointer transition-colors ${
                                  val ? 'bg-azure/10 text-azure font-bold hover:bg-azure/20' : 'text-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                {val ?? '-'}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 3: APBD & DROPING ── */}
        {activeTab === 'apbd' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
            
            {/* Alokasi Target APBD */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="font-bold text-sm text-slate-900">
                    Target Alokasi Vaksin APBD Jateng 2026
                  </h3>
                  <p className="text-xs text-slate-500">Distribusi dosis per puskeswan</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">PUSKESWAN</th>
                        <th className="p-3.5 text-right font-mono">LSD</th>
                        <th className="p-3.5 text-right font-mono">ND AI</th>
                        <th className="p-3.5 text-right font-mono">RABIES</th>
                        <th className="p-3.5 text-right font-mono">APHTOVAX</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {apbdTarget.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{row.puskeswan}</td>
                          <td className="p-3.5 text-right font-mono">{row.target_lsd}</td>
                          <td className="p-3.5 text-right font-mono">{row.target_ndai}</td>
                          <td className="p-3.5 text-right font-mono">{row.target_rabies}</td>
                          <td className="p-3.5 text-right font-mono">{row.target_aphtovaks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Riwayat Droping */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Log Pengiriman & Droping Vaksin
                    </h3>
                    <p className="text-xs text-slate-500">Pencatatan batch vaksin masuk dari Dinas Provinsi</p>
                  </div>
                  <button
                    onClick={openAddDroping}
                    className="min-h-touch h-8 px-3 rounded-lg bg-azure text-white text-xs font-bold hover:bg-azure/90 flex items-center gap-1 shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Catat Droping</span>
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {droping.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 hover:bg-white transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{d.merk_vaksin}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(d.tanggal).toLocaleDateString('id-ID')} · {d.keterangan || '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-azure text-sm bg-azure/10 px-2.5 py-1 rounded-lg">
                          {d.jumlah} Dosis
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditDroping(d)}
                            className="min-h-touch h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => deleteDroping(d)}
                            className="min-h-touch h-7 w-7 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center justify-center"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ── MODAL HARIAN ── */}
      {modalHarian.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl space-y-4">
            <div className="text-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">{modalHarian.puskeswan}</h3>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                {new Date(modalHarian.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <form onSubmit={submitHarian} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase mb-1 text-center">
                  Jumlah Dosis
                </label>
                <input
                  type="number"
                  autoFocus
                  value={formHarianJumlah}
                  onChange={(e) => setFormHarianJumlah(e.target.value)}
                  className="w-full text-center text-3xl font-mono font-bold text-slate-900 py-2.5 rounded-xl border border-slate-300 focus:border-azure outline-none"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalHarian({ open: false, puskeswan: '', tanggal: '', existingId: null })}
                  className="min-h-touch h-10 flex-1 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                {modalHarian.existingId && (
                  <button
                    type="button"
                    onClick={deleteHarian}
                    className="min-h-touch h-10 px-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-bold"
                  >
                    Hapus
                  </button>
                )}
                <button
                  type="submit"
                  className="min-h-touch h-10 flex-1 rounded-xl bg-azure text-white text-xs font-bold shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL BULANAN ── */}
      {modalBulanan.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {modalBulanan.edit ? 'Edit Puskeswan' : 'Tambah Puskeswan'}
              </h3>
              <button onClick={() => setModalBulanan({ open: false, edit: null })}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submitBulanan} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nama Puskeswan *</label>
                <input
                  type="text"
                  required
                  value={formBulanan.puskeswan}
                  onChange={(e) => setFormBulanan({ ...formBulanan, puskeswan: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Target</label>
                  <input
                    type="number"
                    value={formBulanan.target}
                    onChange={(e) => setFormBulanan({ ...formBulanan, target: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Pengambilan</label>
                  <input
                    type="number"
                    value={formBulanan.pengambilan}
                    onChange={(e) => setFormBulanan({ ...formBulanan, pengambilan: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalBulanan({ open: false, edit: null })}
                  className="h-10 px-4 rounded-xl border bg-slate-100 text-xs font-bold"
                >
                  Batal
                </button>
                <button type="submit" className="h-10 px-5 rounded-xl bg-azure text-white text-xs font-bold">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL DROPING ── */}
      {modalDroping.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {modalDroping.edit ? 'Edit Log Droping' : 'Catat Droping Vaksin'}
              </h3>
              <button onClick={() => setModalDroping({ open: false, edit: null })}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submitDroping} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Tanggal *</label>
                <input
                  type="date"
                  required
                  value={formDroping.tanggal}
                  onChange={(e) => setFormDroping({ ...formDroping, tanggal: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Merk Vaksin *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Aftogen Oleo / Bovamune"
                  value={formDroping.merk_vaksin}
                  onChange={(e) => setFormDroping({ ...formDroping, merk_vaksin: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Jumlah (Dosis)</label>
                <input
                  type="number"
                  value={formDroping.jumlah}
                  onChange={(e) => setFormDroping({ ...formDroping, jumlah: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Keterangan</label>
                <input
                  type="text"
                  placeholder="BOP / Hibah APBD"
                  value={formDroping.keterangan}
                  onChange={(e) => setFormDroping({ ...formDroping, keterangan: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border bg-slate-50 text-sm outline-none"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalDroping({ open: false, edit: null })}
                  className="h-10 px-4 rounded-xl border bg-slate-100 text-xs font-bold"
                >
                  Batal
                </button>
                <button type="submit" className="h-10 px-5 rounded-xl bg-azure text-white text-xs font-bold">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}