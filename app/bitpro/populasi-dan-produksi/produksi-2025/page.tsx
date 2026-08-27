'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, BarChart2 } from 'lucide-react';

const bulan = [
  'JAN', 'FEB', 'MAR', 'APRIL', 'MEI', 'JUNI',
  'JULI', 'AGT', 'SEPT', 'OKT', 'NOV', 'DES',
];

export default function Produksi2025() {
  const [dataDaging, setDataDaging] = useState<any[]>([]);
  const [dataTelur, setDataTelur] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-produksi');
        const data = await response.json();
        setDataDaging(data.dataDaging || []);
        setDataTelur(data.dataTelur || []);
      } catch (error) {
        console.error('Gagal menyedot data produksi 2025:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white pb-20">
      
      {/* ── TOP HEADER (Tema Hijau - Lega & Bernapas) ── */}
      <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/bitpro/populasi-dan-produksi"
              className="min-h-touch min-w-touch w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-xs shrink-0"
              aria-label="Kembali ke Menu Produksi"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Link href="/bitpro" className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors truncate">
                  Bitpro
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">Produksi 2025</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
                Laporan Produksi Daging &amp; Telur Tahun 2025
              </h1>
            </div>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <span className="font-sans text-xs text-slate-500 uppercase tracking-widest animate-pulse">
              Memuat data produksi peternakan 2025...
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
                      Produksi Daging Siap Potong (Kilogram)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Rekapitulasi bulanan pemotongan ternak tahun 2025
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
                        <td className="p-3.5 font-sans">{Number(row.jan).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.feb).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.mar).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.apr).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.mei).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.jun).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.jul).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.agt).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.sep).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.okt).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.nov).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.des).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans font-bold text-emerald-600 bg-slate-50/80 border-l border-slate-100">
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
                      Produksi Telur Konsumsi (Kilogram)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Rekapitulasi bulanan komoditas unggas petelur tahun 2025
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
                        <td className="p-3.5 font-sans">{Number(row.jan).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.feb).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.mar).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.apr).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.mei).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.jun).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.jul).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.agt).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.sep).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.okt).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.nov).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans">{Number(row.des).toLocaleString('id-ID')}</td>
                        <td className="p-3.5 font-sans font-bold text-amber-600 bg-slate-50/80 border-l border-slate-100">
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