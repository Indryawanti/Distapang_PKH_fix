'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Header kolom data (60 kolom setelah Kecamatan/No/Desa)
// Baris TOTAL resmi (sesuai rekapitulasi sumber)
const TOTAL_ROW = [
  4986, 6337, 6078, 8725, 7291, 31557, 64996, 0, 0, 0, 0, 0, 0, 0, 12, 14, 13,
  23, 38, 70, 170, 4, 3, 28, 17, 112, 110, 274, 8742, 12278, 11846, 13692,
  14738, 39959, 101255, 2484, 3385, 2721, 3357, 3919, 9605, 25552, 137, 184,
  108, 195, 37, 119, 780, 864412, 73976, 2636000, 70808, 87200, 81573, 2153,
  54168, 1303, 2538, 3907,
];

const HEADERS = [
  'AJ Sapi',
  'AB Sapi',
  'MJ Sapi',
  'MB Sapi',
  'DJ Sapi',
  'DB Sapi',
  'Total Sapi Potong',
  'AJ Perah',
  'AB Perah',
  'MJ Perah',
  'MB Perah',
  'DJ Perah',
  'DB Perah',
  'Total Sapi Perah',
  'AJ Kerbau',
  'AB Kerbau',
  'MJ Kerbau',
  'MB Kerbau',
  'DJ Kerbau',
  'DB Kerbau',
  'Total Kerbau',
  'AJ Kuda',
  'AB Kuda',
  'MJ Kuda',
  'MB Kuda',
  'DJ Kuda',
  'DB Kuda',
  'Total Kuda',
  'AJ Kambing',
  'AB Kambing',
  'MJ Kambing',
  'MB Kambing',
  'DJ Kambing',
  'DB Kambing',
  'Total Kambing',
  'AJ Domba',
  'AB Domba',
  'MJ Domba',
  'MB Domba',
  'DJ Domba',
  'DB Domba',
  'Total Domba',
  'AJ Babi',
  'AB Babi',
  'MJ Babi',
  'MB Babi',
  'DJ Babi',
  'DB Babi',
  'Total Babi',
  'Ayam Kampung',
  'Ayam Petelur',
  'Ayam Broiler',
  'Puyuh',
  'Itik',
  'Entog',
  'Angsa',
  'Merpati',
  'Kelinci Jantan',
  'Kelinci Betina',
];

export default function Populasi2025() {
  const [search, setSearch] = useState('');
  const [dataPopulasi, setDataPopulasi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Tambahan untuk efek loading

  // Gunakan useEffect untuk menyedot data otomatis dari API saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-populasi');
        const data = await response.json();
        setDataPopulasi(data);
      } catch (error) {
        console.error('Gagal menyedot data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = dataPopulasi.filter(
    (row) =>
      row.kec.toLowerCase().includes(search.toLowerCase()) ||
      row.desa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 min-h-screen text-gray-900" style={{background:'linear-gradient(135deg,#052e16 0%,#064e3b 40%,#065f46 100%)'}}>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <Link
          href="/bitpro/populasi-dan-produksi"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-500 transition-colors"
        >
          ← Kembali
        </Link>
        <h1 className="text-lg font-bold text-white">
          Data Populasi Ternak Tw 4 2025
        </h1>
        <input
          type="text"
          placeholder="Cari Desa/Kec..."
          className="p-2 border border-gray-300 rounded shadow-sm w-60 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white border border-gray-300 rounded shadow-md max-h-[80vh] overflow-y-auto relative">
        {/* Tampilan saat masih menyedot data */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-emerald-700 font-bold animate-pulse">Menyiapkan Data Kabupaten... 🚀</span>
          </div>
        ) : (
          <table className="w-full text-[11px] border-collapse whitespace-nowrap">
            <thead className="bg-emerald-700 text-white uppercase sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-2 border border-emerald-600 sticky left-0 bg-emerald-700 z-20">No</th>
                <th className="p-2 border border-emerald-600 sticky left-[40px] bg-emerald-700 z-20 text-left">Kecamatan</th>
                <th className="p-2 border border-emerald-600 sticky left-[160px] bg-emerald-700 z-20 text-left">Desa</th>
                {HEADERS.map((h, i) => (
                  <th key={i} className="p-1.5 border border-emerald-600 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-100 transition-colors`}>
                  <td className="p-1 border border-gray-200 text-center font-semibold text-gray-800 sticky left-0 bg-inherit">{row.no}</td>
                  <td className="p-1 border border-gray-200 font-semibold text-gray-800 sticky left-[40px] bg-inherit text-left">{row.kec}</td>
                  <td className="p-1 border border-gray-200 text-gray-800 sticky left-[160px] bg-inherit text-left">{row.desa}</td>
                  {row.v.map((val: any, i: number) => (
                    <td key={i} className="p-1 border border-gray-200 text-center text-gray-700 tabular-nums">
                      {Number(val).toLocaleString('id-ID')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-emerald-700 text-white font-bold sticky bottom-0 z-10">
                <td className="p-1.5 border border-emerald-600 text-center sticky left-0 bg-emerald-700 z-20" colSpan={3}>TOTAL</td>
                {TOTAL_ROW.map((val, i) => (
                  <td key={i} className="p-1 border border-emerald-600 text-center tabular-nums">
                    {Number(val).toLocaleString('id-ID')}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {!isLoading && (
        <p className="text-xs text-gray-200 mt-2">
          Menampilkan {filteredData.length} dari {dataPopulasi.length} baris data (Live dari Database)
        </p>
      )}
    </div>
  );
}