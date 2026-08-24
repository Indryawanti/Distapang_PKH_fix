'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

// ─── ICON BANTUAN ───
const IconExcel = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const IconClose = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function UnifiedSKLBPage() {
  const [activeTab, setActiveTab] = useState<'rekap' | 'detail'>('rekap');

  // ─── STATE REKAPITULASI ───
  const [dataRekap, setDataRekap] = useState<any[]>([]);
  const [isSyncingRekap, setIsSyncingRekap] = useState(false);
  
  // State Modal CRUD Rekap
  const [modalRekap, setModalRekap] = useState<{ open: boolean, mode: 'tambah' | 'edit', data: any }>({ open: false, mode: 'tambah', data: null });

  // ─── STATE MASTER DETAIL SAPI ───
  const [dataDetail, setDataDetail] = useState<any[]>([]);
  const [isSyncingDetail, setIsSyncingDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDesa, setFilterDesa] = useState("Semua");

  // State Modal CRUD Detail
  const [modalDetail, setModalDetail] = useState<{ open: boolean, mode: 'tambah' | 'edit', data: any }>({ open: false, mode: 'tambah', data: null });

  // ==========================================================================
  // FUNGSI TARIK DATA (API)
  // ==========================================================================
  const handleSyncRekap = async () => {
    setIsSyncingRekap(true);
    try {
      const res = await fetch('/api/sync-sklb-summary', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setDataRekap(result.data);
        alert("Sukses menyedot data rekap!");
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (err) {
      alert("Gagal terhubung ke API Rekap.");
    } finally {
      setIsSyncingRekap(false);
    }
  };

  const handleSyncDetail = async () => {
    setIsSyncingDetail(true);
    try {
      const res = await fetch('/api/sync-sklb-detail', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setDataDetail(result.data);
        alert(result.message);
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (err) {
      alert("Gagal terhubung ke API Detail.");
    } finally {
      setIsSyncingDetail(false);
    }
  };

  // ==========================================================================
  // FUNGSI EXPORT EXCEL
  // ==========================================================================
  const handleExportExcel = () => {
    try {
      const wsRekap = XLSX.utils.json_to_sheet(dataRekap.map(d => ({
        "No": d.no_urut, "Tanggal": d.tanggal, "Desa": d.desa, "Kecamatan": d.kecamatan,
        "Target": d.target, "Capaian": d.capaian, "Selisih": d.selisih, "Grup Tabel": d.grup
      })));

      const wsDetail = XLSX.utils.json_to_sheet(dataDetail.map(d => ({
        "Desa": d.desa_lokasi, "Pemilik": d.nama_pemilik, "Dusun": d.dusun, "RT": d.rt, "RW": d.rw,
        "Nama Sapi": d.nama_sapi, "Kelamin": d.jenis_kelamin, "Umur (Bulan)": d.umur_bulan,
        "Tinggi Pundak": d.tinggi_pundak, "Panjang Badan": d.panjang_badan, "Lingkar Dada": d.lingkar_dada, "Berat Badan": d.berat_badan
      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsRekap, "Rekapitulasi SKLB");
      XLSX.utils.book_append_sheet(wb, wsDetail, "Master Detail Sapi");

      XLSX.writeFile(wb, `Data_SKLB_2026_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      alert("Gagal mengekspor file Excel.");
    }
  };

  // ==========================================================================
  // FUNGSI CRUD REKAPITULASI
  // ==========================================================================
  const handleSaveRekap = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = modalRekap.data;
    if (modalRekap.mode === 'tambah') {
      const newId = dataRekap.length ? Math.max(...dataRekap.map(d => d.id || 0)) + 1 : 1;
      setDataRekap([...dataRekap, { ...formData, id: newId, selisih: Number(formData.capaian) - Number(formData.target) }]);
    } else {
      setDataRekap(dataRekap.map(d => d.id === formData.id ? { ...formData, selisih: Number(formData.capaian) - Number(formData.target) } : d));
    }
    setModalRekap({ open: false, mode: 'tambah', data: null });
  };

  const handleDeleteRekap = (id: number) => {
    if (confirm("Hapus data rekap ini?")) {
      setDataRekap(dataRekap.filter(d => d.id !== id));
    }
  };

  // ==========================================================================
  // FUNGSI CRUD DETAIL SAPI
  // ==========================================================================
  const handleSaveDetail = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = modalDetail.data;
    if (modalDetail.mode === 'tambah') {
      const newId = dataDetail.length ? Math.max(...dataDetail.map(d => d.id || 0)) + 1 : 1;
      setDataDetail([{ ...formData, id: newId }, ...dataDetail]);
    } else {
      setDataDetail(dataDetail.map(d => d.id === formData.id ? formData : d));
    }
    setModalDetail({ open: false, mode: 'tambah', data: null });
  };

  const handleDeleteDetail = (id: number) => {
    if (confirm("Hapus data sapi ini?")) {
      setDataDetail(dataDetail.filter(d => d.id !== id));
    }
  };

  // ==========================================================================
  // PENGOLAHAN DATA VIEW (KEMBALI KE VERSI ASLI MAS REZA)
  // ==========================================================================
  const tabelKiri = dataRekap.filter(d => d.grup === "Tabel Kiri").sort((a, b) => a.no_urut - b.no_urut);
  const tabelKanan = dataRekap.filter(d => d.grup === "Tabel Kanan").sort((a, b) => a.no_urut - b.no_urut);
  const sum = (data: any[], key: string) => data.reduce((acc, row) => acc + (row[key] || 0), 0);

  const daftarDesa = useMemo(() => {
    const unik = Array.from(new Set(dataDetail.map(d => d.desa_lokasi)));
    return ["Semua", ...unik];
  }, [dataDetail]);

  const filteredData = useMemo(() => {
    return dataDetail.filter(item => {
      const matchDesa = filterDesa === "Semua" || item.desa_lokasi === filterDesa;
      
      // Dikembalikan ke aslinya 100%
      const matchSearch = 
        item.nama_pemilik?.toLowerCase().includes(search.toLowerCase()) || 
        item.nama_sapi?.toLowerCase().includes(search.toLowerCase());
        
      return matchDesa && matchSearch;
    });
  }, [dataDetail, filterDesa, search]);


  // ==========================================================================
  // KOMPONEN RENDER TABEL REKAP
  // ==========================================================================
  const TabelRekapCapaian = ({ data, judul, grup }: { data: any[], judul: string, grup: string }) => (
    <div className="w-full bg-white border-2 border-emerald-900 overflow-hidden shadow-lg rounded-t-xl relative">
      <div className="bg-emerald-800 text-white font-black py-3 px-4 flex justify-between items-center tracking-wide border-b-2 border-emerald-900">
        <span className="uppercase text-sm">{judul}</span>
        <button 
          onClick={() => setModalRekap({ open: true, mode: 'tambah', data: { grup, no_urut: data.length + 1 }})}
          className="bg-amber-400 hover:bg-amber-500 text-emerald-900 text-xs px-3 py-1.5 rounded-lg font-bold transition-colors shadow-sm"
        >
          + Tambah
        </button>
      </div>
      <div className="overflow-auto max-h-[60vh] relative">
        <table className="w-full text-center text-xs md:text-sm border-collapse text-black">
          <thead className="font-bold sticky top-0 z-10 outline outline-2 outline-emerald-900 bg-slate-100 uppercase">
            <tr>
              <th className="p-2 border border-emerald-900">NO</th>
              <th className="p-2 border border-emerald-900">TANGGAL</th>
              <th className="p-2 border border-emerald-900 w-32">DESA</th>
              <th className="p-2 border border-emerald-900 w-32">KECAMATAN</th>
              <th className="p-2 border border-emerald-900">TARGET</th>
              <th className="p-2 border border-emerald-900">CAPAIAN</th>
              <th className="p-2 border border-emerald-900">SELISIH</th>
              <th className="p-2 border border-emerald-900 bg-slate-200">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-slate-400 font-bold italic">Klik tombol "Tarik Data" atau "+ Tambah".</td></tr>
            ) : (
              data.map((row) => (
                <tr key={row.id || row.no_urut} className="border-b border-emerald-900 hover:bg-emerald-50">
                  <td className="p-2 border border-emerald-900">{row.no_urut}</td>
                  <td className="p-2 border border-emerald-900">{row.tanggal}</td>
                  <td className="p-2 border border-emerald-900 font-medium text-left px-3">{row.desa}</td>
                  <td className="p-2 border border-emerald-900 text-left px-3">{row.kecamatan}</td>
                  <td className="p-2 border border-emerald-900 font-bold">{row.target}</td>
                  <td className="p-2 border border-emerald-900 font-black bg-amber-400 text-emerald-950 text-base">{row.capaian}</td>
                  <td className="p-2 border border-emerald-900 font-bold">{row.selisih}</td>
                  <td className="p-2 border border-emerald-900 bg-slate-50 w-24">
                    <div className="flex gap-1 justify-center">
                      <button onClick={() => setModalRekap({ open: true, mode: 'edit', data: row })} className="bg-sky-100 text-sky-700 hover:bg-sky-200 px-2 py-1 rounded text-[10px] font-bold">Edit</button>
                      <button onClick={() => handleDeleteRekap(row.id)} className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-2 py-1 rounded text-[10px] font-bold">Del</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {data.length > 0 && (
              <tr className="bg-emerald-100 font-black text-emerald-900">
                <td colSpan={4} className="p-3 border border-emerald-900 text-right pr-4 uppercase">Total Keseluruhan</td>
                <td className="p-3 border border-emerald-900 text-base">{sum(data, 'target')}</td>
                <td className="p-3 border border-emerald-900 text-base text-emerald-700">{sum(data, 'capaian')}</td>
                <td className="p-3 border border-emerald-900 text-base text-rose-700">{sum(data, 'selisih')}</td>
                <td className="border border-emerald-900"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 relative">
      
      {/* ─── HEADER TEMA HIJAU BITPRO ─── */}
      <div className="bg-emerald-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-lg border-b-4 border-amber-400 gap-4 sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-sm">DASHBOARD SKLB 2026</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/bitpro" className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-lg transition-colors border border-white/20 text-sm">
            ← Kembali
          </Link>

          <button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 text-white font-bold px-4 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2 text-sm">
            <IconExcel /> Export Excel
          </button>
          
          {activeTab === 'rekap' ? (
            <button onClick={handleSyncRekap} disabled={isSyncingRekap} className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black px-5 py-2.5 rounded-lg shadow-md transition-all disabled:opacity-50 text-sm">
              {isSyncingRekap ? "Menyedot Rekap..." : "🔄 Tarik Data Rekap"}
            </button>
          ) : (
            <button onClick={handleSyncDetail} disabled={isSyncingDetail} className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black px-5 py-2.5 rounded-lg shadow-md transition-all disabled:opacity-50 text-sm">
              {isSyncingDetail ? "Menyedot 29 Desa..." : "🔄 Tarik Data Detail Sapi"}
            </button>
          )}
        </div>
      </div>

      {/* ─── MENU TAB NAVIGASI HIJAU ─── */}
      <div className="w-full max-w-[1600px] mx-auto px-4 mt-6">
        <div className="flex border-b-2 border-emerald-800 gap-2">
          <button 
            onClick={() => setActiveTab('rekap')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wide rounded-t-xl transition-colors ${activeTab === 'rekap' ? 'bg-emerald-800 text-white border-b-4 border-amber-400 shadow-md' : 'bg-white text-emerald-800 border border-slate-300 hover:bg-slate-100'}`}
          >
            📊 Rekapitulasi SKLB
          </button>
          <button 
            onClick={() => setActiveTab('detail')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wide rounded-t-xl transition-colors ${activeTab === 'detail' ? 'bg-emerald-800 text-white border-b-4 border-amber-400 shadow-md' : 'bg-white text-emerald-800 border border-slate-300 hover:bg-slate-100'}`}
          >
            🐄 Master Detail Sapi
          </button>
        </div>
      </div>

      {/* ─── KONTEN HALAMAN ─── */}
      <div className="p-4 md:px-6 md:py-8 w-full max-w-[1600px] mx-auto">
        
        {/* TAB REKAPITULASI */}
        {activeTab === 'rekap' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start animate-in fade-in duration-300">
            <TabelRekapCapaian data={tabelKiri} judul="CAPAIAN SKLB 2026 TIM TIMUR" grup="Tabel Kiri" />
            <TabelRekapCapaian data={tabelKanan} judul="CAPAIAN SKLB 2026 TIM BARAT" grup="Tabel Kanan" />
          </div>
        )}

        {/* TAB MASTER DETAIL SAPI */}
        {activeTab === 'detail' && (
          <div className="animate-in fade-in duration-300">
            
            {/* PENCARIAN & FILTER DESA */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-end gap-4">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                <div className="w-full md:w-96">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Cari Pemilik / Sapi</label>
                  <input 
                    type="text" 
                    placeholder="Ketik nama untuk mencari..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="w-full md:w-64">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Filter Desa</label>
                  <select 
                    value={filterDesa}
                    onChange={(e) => setFilterDesa(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-emerald-900 font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none cursor-pointer"
                  >
                    {daftarDesa.map(desa => (
                      <option key={desa} value={desa} className="font-medium">
                        {desa === "Semua" ? "Semua Desa" : desa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                onClick={() => setModalDetail({ open: true, mode: 'tambah', data: {} })}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-lg shadow-md transition-all w-full md:w-auto text-sm"
              >
                + Tambah Data Sapi
              </button>
            </div>

            {/* TABEL MASTER DETAIL */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-slate-900 overflow-hidden">
              <div className="overflow-auto max-h-[65vh] relative">
                <table className="w-full text-center text-[12px] border-collapse min-w-max text-black">
                  <thead className="bg-emerald-800 text-white font-bold sticky top-0 z-10 outline outline-2 outline-emerald-900 uppercase tracking-wider">
                    <tr>
                      <th className="p-3 border border-emerald-900">Desa</th>
                      <th className="p-3 border border-emerald-900">Pemilik</th>
                      <th className="p-3 border border-emerald-900">Dusun (RT/RW)</th>
                      <th className="p-3 border border-emerald-900">Nama Sapi</th>
                      <th className="p-3 border border-emerald-900">Kelamin</th>
                      <th className="p-3 border border-emerald-900" title="Umur (Bulan)">Umur</th>
                      <th className="p-3 border border-emerald-900 bg-emerald-700">TP (cm)</th>
                      <th className="p-3 border border-emerald-900 bg-emerald-700">PB (cm)</th>
                      <th className="p-3 border border-emerald-900 bg-emerald-700">LD (cm)</th>
                      <th className="p-3 border border-emerald-900 bg-amber-500 text-emerald-950">BB (kg)</th>
                      <th className="p-3 border border-emerald-900 bg-slate-800">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-12 text-slate-500 font-bold italic text-sm">
                          Data masih kosong. Silakan klik tombol "Tarik Data Detail Sapi" di atas.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row) => (
                        <tr key={row.id} className="border-b border-slate-900 hover:bg-emerald-50 transition-colors">
                          <td className="p-2 border border-emerald-900 font-bold text-emerald-800">{row.desa_lokasi}</td>
                          <td className="p-2 border border-emerald-900 text-left px-3 font-semibold">{row.nama_pemilik}</td>
                          <td className="p-2 border border-emerald-900 text-left px-3">{row.dusun} ({row.rt}/{row.rw})</td>
                          <td className="p-2 border border-emerald-900 font-bold text-teal-700">{row.nama_sapi || '-'}</td>
                          
                          {/* DIKEMBALIKAN KE KODINGAN ASLI MAS REZA */}
                          <td className="p-2 border border-emerald-900">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${row.jenis_kelamin === 'JANTAN' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                              {row.jenis_kelamin}
                            </span>
                          </td>
                          
                          <td className="p-2 border border-emerald-900 font-mono">{row.umur_bulan || '-'}</td>
                          <td className="p-2 border border-emerald-900 font-mono text-emerald-900 font-bold">{row.tinggi_pundak || '-'}</td>
                          <td className="p-2 border border-emerald-900 font-mono text-emerald-900 font-bold">{row.panjang_badan || '-'}</td>
                          <td className="p-2 border border-emerald-900 font-mono text-emerald-900 font-bold">{row.lingkar_dada || '-'}</td>
                          <td className="p-2 border border-emerald-900 font-mono font-black text-amber-800 bg-amber-50">{row.berat_badan || '-'}</td>
                          <td className="p-2 border border-emerald-900 bg-slate-50">
                            <div className="flex gap-1 justify-center">
                              <button onClick={() => setModalDetail({ open: true, mode: 'edit', data: row })} className="bg-sky-100 text-sky-700 hover:bg-sky-200 px-2 py-1.5 rounded text-[10px] font-bold transition-colors">Edit</button>
                              <button onClick={() => handleDeleteDetail(row.id)} className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-2 py-1.5 rounded text-[10px] font-bold transition-colors">Del</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ==========================================================================
          MODALS AREA
      ========================================================================== */}
      
      {/* MODAL REKAPITULASI */}
      {modalRekap.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="bg-emerald-800 px-6 py-4 border-b border-emerald-900 flex justify-between items-center text-white">
              <h3 className="font-black text-lg">{modalRekap.mode === 'tambah' ? 'TAMBAH DATA REKAP' : 'EDIT DATA REKAP'}</h3>
              <button onClick={() => setModalRekap({ open: false, mode: 'tambah', data: null })} className="text-emerald-200 hover:text-white"><IconClose /></button>
            </div>
            <form onSubmit={handleSaveRekap} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">No Urut</label>
                    <input type="number" required value={modalRekap.data?.no_urut || ''} onChange={(e) => setModalRekap({...modalRekap, data: {...modalRekap.data, no_urut: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Tanggal</label>
                    <input type="date" required value={modalRekap.data?.tanggal || ''} onChange={(e) => setModalRekap({...modalRekap, data: {...modalRekap.data, tanggal: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Desa</label>
                    <input type="text" required value={modalRekap.data?.desa || ''} onChange={(e) => setModalRekap({...modalRekap, data: {...modalRekap.data, desa: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Kecamatan</label>
                    <input type="text" required value={modalRekap.data?.kecamatan || ''} onChange={(e) => setModalRekap({...modalRekap, data: {...modalRekap.data, kecamatan: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Target</label>
                    <input type="number" required value={modalRekap.data?.target || ''} onChange={(e) => setModalRekap({...modalRekap, data: {...modalRekap.data, target: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Capaian</label>
                    <input type="number" required value={modalRekap.data?.capaian || ''} onChange={(e) => setModalRekap({...modalRekap, data: {...modalRekap.data, capaian: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Grup Tabel</label>
                  <select required value={modalRekap.data?.grup || ''} onChange={(e) => setModalRekap({...modalRekap, data: {...modalRekap.data, grup: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold">
                    <option value="">Pilih Grup...</option>
                    <option value="Tabel Kiri">Tabel Kiri (Tim Timur)</option>
                    <option value="Tabel Kanan">Tabel Kanan (Tim Barat)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8 pt-5 border-t border-slate-200">
                <button type="button" onClick={() => setModalRekap({ open: false, mode: 'tambah', data: null })} className="flex-1 py-2.5 rounded-lg border border-slate-300 font-bold text-slate-600 text-sm hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 font-bold text-white text-sm transition-colors shadow-md">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MASTER DETAIL SAPI */}
      {modalDetail.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="bg-emerald-800 px-6 py-4 border-b border-emerald-900 flex justify-between items-center text-white">
              <h3 className="font-black text-lg">{modalDetail.mode === 'tambah' ? 'TAMBAH DATA SAPI' : 'EDIT DATA SAPI'}</h3>
              <button onClick={() => setModalDetail({ open: false, mode: 'tambah', data: null })} className="text-emerald-200 hover:text-white"><IconClose /></button>
            </div>
            <form onSubmit={handleSaveDetail} className="p-6 max-h-[75vh] overflow-y-auto">
              
              <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Informasi Pemilik & Lokasi</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Nama Pemilik</label>
                  <input type="text" required value={modalDetail.data?.nama_pemilik || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, nama_pemilik: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Desa</label>
                  <input type="text" required value={modalDetail.data?.desa_lokasi || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, desa_lokasi: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Dusun</label>
                  <input type="text" value={modalDetail.data?.dusun || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, dusun: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">RT</label>
                    <input type="text" value={modalDetail.data?.rt || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, rt: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">RW</label>
                    <input type="text" value={modalDetail.data?.rw || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, rw: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Informasi Sapi</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Nama Sapi</label>
                  <input type="text" value={modalDetail.data?.nama_sapi || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, nama_sapi: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Jenis Kelamin</label>
                  <select required value={modalDetail.data?.jenis_kelamin || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, jenis_kelamin: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold">
                    <option value="">Pilih...</option>
                    <option value="JANTAN">Jantan</option>
                    <option value="BETINA">Betina</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block">Umur (Bulan)</label>
                  <input type="number" value={modalDetail.data?.umur_bulan || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, umur_bulan: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block" title="Tinggi Pundak">TP (cm)</label>
                  <input type="number" step="0.1" value={modalDetail.data?.tinggi_pundak || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, tinggi_pundak: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-emerald-50 text-emerald-900 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block" title="Panjang Badan">PB (cm)</label>
                  <input type="number" step="0.1" value={modalDetail.data?.panjang_badan || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, panjang_badan: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-emerald-50 text-emerald-900 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1.5 block" title="Lingkar Dada">LD (cm)</label>
                  <input type="number" step="0.1" value={modalDetail.data?.lingkar_dada || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, lingkar_dada: e.target.value}})} className="w-full px-3 py-2 border rounded-lg bg-emerald-50 text-emerald-900 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-amber-600 uppercase mb-1.5 block" title="Berat Badan">Berat (kg)</label>
                  <input type="number" step="0.1" value={modalDetail.data?.berat_badan || ''} onChange={(e) => setModalDetail({...modalDetail, data: {...modalDetail.data, berat_badan: e.target.value}})} className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-amber-50 text-amber-900 text-sm font-bold" />
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-5 border-t border-slate-200">
                <button type="button" onClick={() => setModalDetail({ open: false, mode: 'tambah', data: null })} className="flex-1 py-3 rounded-lg border border-slate-300 font-bold text-slate-600 text-sm hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 font-bold text-white text-sm transition-colors shadow-md">Simpan Data Sapi</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}