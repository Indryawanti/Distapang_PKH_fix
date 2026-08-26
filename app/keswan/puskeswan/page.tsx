'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Layers, DollarSign, Activity, Stethoscope } from 'lucide-react';

const dataAwal = [
  { bulan: 'JANUARI', no: 1, puskeswan: 'MIRIT', bef: 2, cacingan: 70, scabies: 0, orf: 0, pmk_diag: 0, lsd_diag: 5, aktif: 127, semi_aktif: 5, pasif: 0, pusling: 127, ib: 160, pkb: 12, pmk_vaks: 0, lsd_vaks: 0, retribusi: 1750000 },
  { bulan: 'JANUARI', no: 2, puskeswan: 'KLIRONG', bef: 10, cacingan: 60, scabies: 7, orf: 0, pmk_diag: 5, lsd_diag: 3, aktif: 125, semi_aktif: 6, pasif: 4, pusling: 125, ib: 94, pkb: 25, pmk_vaks: 25, lsd_vaks: 0, retribusi: 2500000 },
  { bulan: 'JANUARI', no: 3, puskeswan: 'GOMBONG', bef: 0, cacingan: 16, scabies: 5, orf: 0, pmk_diag: 3, lsd_diag: 0, aktif: 140, semi_aktif: 43, pasif: 22, pusling: 30, ib: 196, pkb: 31, pmk_vaks: 75, lsd_vaks: 0, retribusi: 3970000 },
  { bulan: 'JANUARI', no: 4, puskeswan: 'BUAYAN', bef: 5, cacingan: 16, scabies: 2, orf: 0, pmk_diag: 0, lsd_diag: 0, aktif: 51, semi_aktif: 3, pasif: 0, pusling: 51, ib: 198, pkb: 23, pmk_vaks: 51, lsd_vaks: 0, retribusi: 670000 },
  { bulan: 'JANUARI', no: 5, puskeswan: 'ALIAN', bef: 1, cacingan: 25, scabies: 5, orf: 0, pmk_diag: 1, lsd_diag: 4, aktif: 48, semi_aktif: 5, pasif: 7, pusling: 64, ib: 15, pkb: 2, pmk_vaks: 0, lsd_vaks: 0, retribusi: 0 },
  { bulan: 'JANUARI', no: 6, puskeswan: 'PREMBUN', bef: 3, cacingan: 70, scabies: 2, orf: 0, pmk_diag: 0, lsd_diag: 3, aktif: 70, semi_aktif: 18, pasif: 4, pusling: 70, ib: 0, pkb: 0, pmk_vaks: 0, lsd_vaks: 0, retribusi: 1360000 },
  { bulan: 'JANUARI', no: 7, puskeswan: 'KEBUMEN', bef: 10, cacingan: 77, scabies: 2, orf: 0, pmk_diag: 0, lsd_diag: 10, aktif: 77, semi_aktif: 20, pasif: 3, pusling: 51, ib: 47, pkb: 47, pmk_vaks: 71, lsd_vaks: 60, retribusi: 1600000 },
  { bulan: 'JANUARI', no: 8, puskeswan: 'KARANGANYAR', bef: 8, cacingan: 16, scabies: 9, orf: 7, pmk_diag: 4, lsd_diag: 2, aktif: 38, semi_aktif: 5, pasif: 0, pusling: 38, ib: 72, pkb: 26, pmk_vaks: 30, lsd_vaks: 0, retribusi: 565000 },
];

export default function LaporanPuskeswanPage() {
  const [dataLaporan, setDataLaporan] = useState<any[]>(dataAwal);
  const [isSyncing, setIsSyncing] = useState(false);

  const sum = (rows: any[], key: string) => rows.reduce((acc, row) => acc + (row[key] || 0), 0);
  const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync-puskeswan', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        setDataLaporan(result.data);
      } else {
        alert('Gagal: ' + result.error);
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-20">
      
      {/* ── TOP HEADER (Tema Biru - Lega & Bernapas) ── */}
      <header className="border-b border-blue-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between">
          
          <div className="flex items-center gap-3.5">
            <Link
              href="/keswan"
              className="min-h-touch min-w-touch w-11 h-11 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-800 transition-colors"
              aria-label="Kembali ke Keswan"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Link href="/keswan" className="text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors">
                  Keswan
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-blue-700">Pelayanan Puskeswan</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                Rekapitulasi Kinerja Bulanan Puskeswan 2026
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="min-h-touch h-11 px-4 sm:px-5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Tarik Data Live Sheets'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        
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
            <p className="font-sans text-2xl sm:text-3xl font-bold text-vitality">
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
            <h2 className="font-bold text-sm text-slate-900">
              Tabel Rekapitulasi Pelayanan, Diagnosa, & Retribusi Puskeswan
            </h2>
            <span className="font-sans text-xs text-slate-500">Tahun Anggaran 2026</span>
          </div>

          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-xs text-center whitespace-nowrap border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider sticky top-0 z-20 border-b border-slate-200 shadow-sm">
                <tr>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 w-24">BULAN</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 w-12">NO</th>
                  <th rowSpan={2} className="p-3 text-left border-r border-slate-200">PUSKESWAN</th>
                  <th colSpan={6} className="p-2 border-r border-slate-200 bg-slate-200/60 text-slate-800">
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
                  <th rowSpan={2} className="p-3 text-right font-sans bg-slate-200/60">RETRIBUSI</th>
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
                    <tr key={row.no} className="hover:bg-slate-50/80 transition-colors">
                      {idx === 0 && (
                        <td
                          rowSpan={rows.length + 1}
                          className="p-3 border-r border-slate-200 font-sans font-bold text-blue-600 uppercase bg-slate-50/50 align-middle"
                        >
                          {bulan}
                        </td>
                      )}
                      <td className="p-3 border-r border-slate-100 font-sans text-slate-400">{row.no}</td>
                      <td className="p-3 text-left font-bold text-slate-900 border-r border-slate-100">
                        {row.puskeswan}
                      </td>

                      <td className="p-3 border-r border-slate-100 font-sans">{row.bef || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.cacingan || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.scabies || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.orf || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.pmk_diag || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.lsd_diag || 0}</td>

                      <td className="p-3 border-r border-slate-100 font-sans">{row.aktif || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.semi_aktif || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.pasif || 0}</td>

                      <td className="p-3 border-r border-slate-100 font-sans">{row.pusling || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.ib || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.pkb || 0}</td>

                      <td className="p-3 border-r border-slate-100 font-sans">{row.pmk_vaks || 0}</td>
                      <td className="p-3 border-r border-slate-100 font-sans">{row.lsd_vaks || 0}</td>

                      <td className="p-3 text-right font-sans font-medium text-slate-900">
                        Rp {formatRp(row.retribusi)}
                      </td>
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