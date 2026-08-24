'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const bulan = [
  'JAN', 'FEB', 'MAR', 'APRIL', 'MEI', 'JUNI',
  'JULI', 'AGT', 'SEPT', 'OKT', 'NOV', 'DES',
];

export default function Produksi2025() {
  const [dataDaging, setDataDaging] = useState<any[]>([]);
  const [dataTelur, setDataTelur] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sedot data dari MySQL saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-produksi');
        const data = await response.json();
        setDataDaging(data.dataDaging || []);
        setDataTelur(data.dataTelur || []);
      } catch (error) {
        console.error('Gagal menyedot data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-6 font-sans text-gray-900" style={{background:'linear-gradient(135deg,#052e16 0%,#064e3b 40%,#065f46 100%)'}}>
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 mb-8 text-center sm:text-left">
        <Link
          href="/bitpro/populasi-dan-produksi"
          className="order-2 sm:order-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 sm:px-5 py-2 rounded-lg font-bold shadow-md text-sm sm:text-base transition-colors"
        >
          ← Kembali
        </Link>
        <h1 className="order-1 sm:order-2 w-full sm:w-auto text-2xl sm:text-3xl font-black text-white">
          Data Produksi Ternak 2025
        </h1>
        <button className="order-3 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg font-bold shadow-md text-sm sm:text-base">
          📥 Export Nonosoft
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <span className="text-white font-bold animate-pulse text-xl">Menyedot Data Produksi dari Database... 🚀</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
          {/* =========================================
              PANEL KIRI: PRODUKSI DAGING
          ========================================= */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border-t-8 border-red-600 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🥩</span>
              <h2 className="text-2xl font-bold text-red-800">
                Produksi Daging (KG)
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 flex-grow">
              <table className="w-full text-sm text-right whitespace-nowrap">
                <thead className="bg-red-50 text-red-900 font-bold border-b-2 border-red-200">
                  <tr>
                    <th className="p-3 text-left sticky left-0 bg-red-50 z-10">Jenis Ternak</th>
                    {bulan.map((b) => (<th key={b} className="p-3">{b}</th>))}
                    <th className="p-3 bg-red-100">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {dataDaging.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-bold text-left sticky left-0 bg-white z-10 border-r">{row.jenis}</td>
                      <td className="p-3">{Number(row.jan).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.feb).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.mar).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.apr).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.mei).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.jun).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.jul).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.agt).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.sep).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.okt).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.nov).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.des).toLocaleString('id-ID')}</td>
                      <td className="p-3 font-bold bg-red-50 text-red-700">{Number(row.total).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* =========================================
              PANEL KANAN: PRODUKSI TELUR
          ========================================= */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border-t-8 border-amber-500 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🥚</span>
              <h2 className="text-2xl font-bold text-amber-800">
                Produksi Telur (KG)
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 flex-grow">
              <table className="w-full text-sm text-right whitespace-nowrap">
                <thead className="bg-amber-50 text-amber-900 font-bold border-b-2 border-amber-200">
                  <tr>
                    <th className="p-3 text-left sticky left-0 bg-amber-50 z-10">Jenis Unggas</th>
                    {bulan.map((b) => (<th key={b} className="p-3">{b}</th>))}
                    <th className="p-3 bg-amber-100">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTelur.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-bold text-left sticky left-0 bg-white z-10 border-r">{row.jenis}</td>
                      <td className="p-3">{Number(row.jan).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.feb).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.mar).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.apr).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.mei).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.jun).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.jul).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.agt).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.sep).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.okt).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.nov).toLocaleString('id-ID')}</td>
                      <td className="p-3">{Number(row.des).toLocaleString('id-ID')}</td>
                      <td className="p-3 font-bold bg-amber-50 text-amber-700">{Number(row.total).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}