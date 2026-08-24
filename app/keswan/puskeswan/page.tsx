'use client';

import { useState } from 'react';
import Link from 'next/link';

// Data Awal untuk simulasi agar layar tidak kosong
const dataAwal = [
  { bulan: "JANUARI", no: 1, puskeswan: "MIRIT", bef: 2, cacingan: 70, scabies: 0, orf: 0, pmk_diag: 0, lsd_diag: 5, aktif: 127, semi_aktif: 5, pasif: 0, pusling: 127, ib: 160, pkb: 12, pmk_vaks: 0, lsd_vaks: 0, retribusi: 1750000 },
  { bulan: "JANUARI", no: 2, puskeswan: "KLIRONG", bef: 10, cacingan: 60, scabies: 7, orf: 0, pmk_diag: 5, lsd_diag: 3, aktif: 125, semi_aktif: 6, pasif: 4, pusling: 125, ib: 94, pkb: 25, pmk_vaks: 25, lsd_vaks: 0, retribusi: 2500000 },
  { bulan: "JANUARI", no: 3, puskeswan: "GOMBONG", bef: 0, cacingan: 16, scabies: 5, orf: 0, pmk_diag: 3, lsd_diag: 0, aktif: 140, semi_aktif: 43, pasif: 22, pusling: 30, ib: 196, pkb: 31, pmk_vaks: 75, lsd_vaks: 0, retribusi: 3970000 },
  { bulan: "JANUARI", no: 4, puskeswan: "BUAYAN", bef: 5, cacingan: 16, scabies: 2, orf: 0, pmk_diag: 0, lsd_diag: 0, aktif: 51, semi_aktif: 3, pasif: 0, pusling: 51, ib: 198, pkb: 23, pmk_vaks: 51, lsd_vaks: 0, retribusi: 670000 },
  { bulan: "JANUARI", no: 5, puskeswan: "ALIAN", bef: 1, cacingan: 25, scabies: 5, orf: 0, pmk_diag: 1, lsd_diag: 4, aktif: 48, semi_aktif: 5, pasif: 7, pusling: 64, ib: 15, pkb: 2, pmk_vaks: 0, lsd_vaks: 0, retribusi: 0 },
  { bulan: "JANUARI", no: 6, puskeswan: "PREMBUN", bef: 3, cacingan: 70, scabies: 2, orf: 0, pmk_diag: 0, lsd_diag: 3, aktif: 70, semi_aktif: 18, pasif: 4, pusling: 70, ib: 0, pkb: 0, pmk_vaks: 0, lsd_vaks: 0, retribusi: 1360000 },
  { bulan: "JANUARI", no: 7, puskeswan: "KEBUMEN", bef: 10, cacingan: 77, scabies: 2, orf: 0, pmk_diag: 0, lsd_diag: 10, aktif: 77, semi_aktif: 20, pasif: 3, pusling: 51, ib: 47, pkb: 47, pmk_vaks: 71, lsd_vaks: 60, retribusi: 1600000 },
  { bulan: "JANUARI", no: 8, puskeswan: "KARANGANYAR", bef: 8, cacingan: 16, scabies: 9, orf: 7, pmk_diag: 4, lsd_diag: 2, aktif: 38, semi_aktif: 5, pasif: 0, pusling: 38, ib: 72, pkb: 26, pmk_vaks: 30, lsd_vaks: 0, retribusi: 565000 },
];

export default function LaporanPuskeswanPage() {
  const [dataLaporan, setDataLaporan] = useState<any[]>(dataAwal);
  const [isSyncing, setIsSyncing] = useState(false);

  // Rumus hitung cepat
  const sum = (rows: any[], key: string) => rows.reduce((acc, row) => acc + (row[key] || 0), 0);
  const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val);

  // Fungsi Tarik Data dari API
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync-puskeswan', { method: 'POST' });
      const result = await res.json();
      
      if (result.success) {
        alert(result.message);
        setDataLaporan(result.data); // Data langsung tampil di tabel bawah!
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Mengelompokkan data berdasarkan Bulan (Biar bisa di-looping seperti Excel)
  const groupedData = dataLaporan.reduce((acc, row) => {
    if (!acc[row.bulan]) acc[row.bulan] = [];
    acc[row.bulan].push(row);
    return acc;
  }, {} as Record<string, typeof dataAwal>);

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* KEPALA HALAMAN (HEADER) */}
      <div className="bg-[#0F4C81] p-5 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Rekapitulasi Puskeswan</h1>
          <p className="text-sky-200 text-sm font-medium">Terkoneksi langsung dengan Google Sheets</p>
        </div>
        <div className="flex gap-3">
          <Link href="/keswan" className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-lg transition-colors border border-white/30">
            ← Kembali
          </Link>
          <button 
            onClick={handleSync} 
            disabled={isSyncing} 
            className="bg-amber-400 hover:bg-amber-500 text-[#0F4C81] font-bold px-5 py-2 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSyncing ? "Menyedot Data..." : "🔄 Tarik Data Live Sheets"}
          </button>
        </div>
      </div>

      {/* WADAH UTAMA */}
      <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto">
        <div className="bg-white p-4 shadow-xl rounded-xl border border-slate-200">
          
          {/* JUDUL LAPORAN */}
          <div className="text-center pb-6 pt-2">
            <h1 className="text-xl font-bold tracking-wide text-black uppercase">LAPORAN BULANAN PUSKESWAN</h1>
            <h2 className="text-xl font-bold tracking-wide text-black uppercase">TAHUN 2026</h2>
          </div>

          {/* KOTAK TABEL YANG BISA DI-SCROLL DENGAN HEADER MENEMPEL */}
          <div className="overflow-auto max-h-[70vh] border-2 border-slate-900 shadow-inner rounded-sm relative">
            <table className="w-full text-center text-[11px] sm:text-[12px] border-collapse text-black min-w-max">
              
              {/* ─── KEPALA TABEL (THEAD) - SEKARANG MENEMPEL (STICKY) ─── */}
              {/* Tambahan class: sticky, top-0, z-30 */}
              <thead className="bg-[#E2E8F0] font-bold sticky top-0 z-30 shadow-[0_2px_4px_rgba(0,0,0,0.1)] outline outline-2 outline-slate-900">
                <tr>
                  <th rowSpan={3} className="border border-slate-900 px-2 uppercase tracking-wide bg-[#E2E8F0]">Bulan</th>
                  <th rowSpan={3} className="border border-slate-900 px-2 w-10 bg-[#E2E8F0]">NO</th>
                  <th rowSpan={3} className="border border-slate-900 px-3 text-left bg-[#E2E8F0]">PUSKESWAN</th>
                  <th colSpan={15} className="border border-slate-900 px-2 py-1 uppercase tracking-wide bg-[#E2E8F0]">JENIS LAPORAN</th>
                </tr>
                <tr>
                  <th colSpan={6} className="border border-slate-900 p-1 bg-[#E2E8F0]">DIAGNOSA PENYAKIT</th>
                  <th colSpan={3} className="border border-slate-900 p-1 bg-[#E2E8F0]">SISTIM PELAYANAN</th>
                  <th colSpan={3} className="border border-slate-900 p-1 bg-[#E2E8F0]">PELAYANAN (EKOR)</th>
                  <th colSpan={2} className="border border-slate-900 p-1 bg-[#E2E8F0]">VAKSINASI</th>
                  <th rowSpan={2} className="border border-slate-900 p-1 min-w-[120px] bg-[#E2E8F0]">PENERIMAAN RETRIBUSI</th>
                </tr>
                <tr className="bg-[#CBD5E1]">
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">BEF</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">Cacingan</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">Scabies</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">Orf</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">PMK</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">LSD</th>
                  
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">AKTIF</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">SEMI AKTIF</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">PASIF</th>
                  
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">PUSLING</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">IB</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">PKB</th>
                  
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">PMK</th>
                  <th className="border border-slate-900 p-1 bg-[#CBD5E1]">LSD</th>
                </tr>
              </thead>

              {/* ─── ISI TABEL (TBODY) ─── */}
              {Object.entries(groupedData).map(([bulan, rows]) => (
                <tbody key={bulan} className="border-b-4 border-slate-900">
                  
                  {rows.map((row, idx) => (
                    <tr key={row.no} className="border border-slate-900 hover:bg-sky-50 transition-colors">
                      {/* Sel Bulan (Muter ke atas khusus di baris pertama) */}
                      {idx === 0 && (
                        <td 
                          rowSpan={rows.length + 1} 
                          className="border-r-2 border-slate-900 bg-[#E2E8F0] font-black text-xl tracking-widest text-center" 
                          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                          {bulan}
                        </td>
                      )}
                      
                      <td className="border border-slate-900 p-1.5">{row.no}</td>
                      <td className="border border-slate-900 p-1.5 text-left font-bold px-3">{row.puskeswan}</td>
                      
                      <td className="border border-slate-900 p-1.5">{row.bef || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.cacingan || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.scabies || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.orf || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.pmk_diag || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.lsd_diag || 0}</td>
                      
                      <td className="border border-slate-900 p-1.5">{row.aktif || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.semi_aktif || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.pasif || 0}</td>
                      
                      <td className="border border-slate-900 p-1.5">{row.pusling || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.ib || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.pkb || 0}</td>
                      
                      <td className="border border-slate-900 p-1.5">{row.pmk_vaks || 0}</td>
                      <td className="border border-slate-900 p-1.5">{row.lsd_vaks || 0}</td>
                      
                      <td className="border border-slate-900 p-1.5 text-right px-3 font-mono text-slate-800 font-medium">{formatRp(row.retribusi)}</td>
                    </tr>
                  ))}
                  
                  {/* ─── BARIS JUMLAH (Otomatis Dihitung) ─── */}
                  <tr className="border border-slate-900 bg-[#F1F5F9] font-bold">
                    <td colSpan={2} className="border border-slate-900 p-2 text-center text-sm">JUMLAH</td>
                    <td className="border border-slate-900 p-1.5 text-emerald-700">{sum(rows, 'bef')}</td>
                    <td className="border border-slate-900 p-1.5 text-emerald-700">{sum(rows, 'cacingan')}</td>
                    <td className="border border-slate-900 p-1.5 text-emerald-700">{sum(rows, 'scabies')}</td>
                    <td className="border border-slate-900 p-1.5 text-emerald-700">{sum(rows, 'orf')}</td>
                    <td className="border border-slate-900 p-1.5 text-emerald-700">{sum(rows, 'pmk_diag')}</td>
                    <td className="border border-slate-900 p-1.5 text-emerald-700">{sum(rows, 'lsd_diag')}</td>
                    <td className="border border-slate-900 p-1.5 text-blue-700">{sum(rows, 'aktif')}</td>
                    <td className="border border-slate-900 p-1.5 text-blue-700">{sum(rows, 'semi_aktif')}</td>
                    <td className="border border-slate-900 p-1.5 text-blue-700">{sum(rows, 'pasif')}</td>
                    <td className="border border-slate-900 p-1.5 text-indigo-700">{sum(rows, 'pusling')}</td>
                    <td className="border border-slate-900 p-1.5 text-indigo-700">{sum(rows, 'ib')}</td>
                    <td className="border border-slate-900 p-1.5 text-indigo-700">{sum(rows, 'pkb')}</td>
                    <td className="border border-slate-900 p-1.5 text-amber-600">{sum(rows, 'pmk_vaks')}</td>
                    <td className="border border-slate-900 p-1.5 text-amber-600">{sum(rows, 'lsd_vaks')}</td>
                    <td className="border border-slate-900 p-1.5 text-right px-3 font-mono text-slate-900">{formatRp(sum(rows, 'retribusi'))}</td>
                  </tr>
                </tbody>
              ))}

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}