'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Plus } from 'lucide-react';

const bulan = [
  'JAN', 'FEB', 'MAR', 'APRIL', 'MEI', 'JUNI',
  'JULI', 'AGT', 'SEPT', 'OKT', 'NOV', 'DES',
];

export default function Produksi2026() {
  const [dataDaging, setDataDaging] = useState<any[]>([]);
  const [dataTelur, setDataTelur] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-produksi-2026');
        const data = await response.json();
        setDataDaging(data.dataDaging || []);
        setDataTelur(data.dataTelur || []);
      } catch (error) {
        console.error('Gagal menyedot data produksi 2026:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-azure selection:text-white pb-20">
      
      {/* ── TOP HEADER ── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/bitpro/populasi-dan-produksi"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Kembali ke Menu Produksi"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Link href="/bitpro" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  Bitpro
                </Link>
                <span className="text-slate-300">/</span>
                <Link href="/bitpro/populasi-dan-produksi" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  Produksi
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-azure">Tahun 2026</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Lembar Kerja Produksi Ternak Tahun 2026
              </h1>
            </div>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest animate-pulse">
              Menyiapkan lembar kerja produksi 2026...
            </span>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* PANEL PRODUKSI DAGING */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🥩</span>
                  <div>
                    <h2 className="font-bold text-base text-slate-900">
                      Produksi Daging Siap Potong (Kilogram) — 2026
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pencatatan data dinamis pemotongan ternak periode berjalan
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 text-left sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                        JENIS TERNAK
                      </th>
                      {bulan.map((b) => (
                        <th key={b} className="p-3.5">{b}</th>
                      ))}
                      <th className="p-3.5 bg-slate-100 text-slate-900 font-bold border-l border-slate-200">TOTAL (KG)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {dataDaging.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-left text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-100">
                          {row.jenis}
                        </td>
                        <td className="p-3.5 font-mono">{Number(row.jan).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.feb).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.mar).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.apr).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.mei).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.jun).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.jul).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.agt).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.sep).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.okt).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.nov).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.des).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono font-bold text-azure bg-slate-50/80 border-l border-slate-100">
                          {Number(row.total).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PANEL PRODUKSI TELUR */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🥚</span>
                  <div>
                    <h2 className="font-bold text-base text-slate-900">
                      Produksi Telur Konsumsi (Kilogram) — 2026
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pencatatan data dinamis komoditas unggas petelur periode berjalan
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 text-left sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                        KOMODITAS UNGGAS
                      </th>
                      {bulan.map((b) => (
                        <th key={b} className="p-3.5">{b}</th>
                      ))}
                      <th className="p-3.5 bg-slate-100 text-slate-900 font-bold border-l border-slate-200">TOTAL (KG)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {dataTelur.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-left text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-100">
                          {row.jenis}
                        </td>
                        <td className="p-3.5 font-mono">{Number(row.jan).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.feb).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.mar).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.apr).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.mei).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.jun).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.jul).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.agt).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.sep).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.okt).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.nov).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono">{Number(row.des).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-mono font-bold text-amber-600 bg-slate-50/80 border-l border-slate-100">
                          {Number(row.total).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}