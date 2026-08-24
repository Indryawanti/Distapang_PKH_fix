'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

/* ======================= TIPE DATA & KONFIGURASI ======================= */
type CommodityKey = 'broiler' | 'petelur' | 'babi' | 'sapi' | 'domba';

const FIELD_LABELS_BROILER: Record<string, string> = {
  kecamatan: 'Kecamatan', desa: 'Desa', nama_badan_usaha: 'Nama Badan Usaha / Perusahaan',
  nama_unit_farm: 'Nama Unit Farm / Peternak', mandiri_kemitraan: 'Mandiri / Kemitraan',
  alamat: 'Alamat', lintang: 'Lintang', bujur: 'Bujur', telp_hp: 'Telp / HP',
  kapasitas_kandang: 'Kapasitas Kandang (Ekor/Tahun)', jumlah_populasi: 'Jumlah Populasi (Ekor/Tahun)',
  jumlah_produksi: 'Jumlah Produksi Siap Potong (Ekor/Tahun)', bobot_rata2_panen: 'Bobot Rata-rata Panen (Kg/Ekor)',
  konsumsi_pakan_fcr: 'Konsumsi Pakan (Gram/Ekor/Hari) / FCR', catatan: 'Catatan (Siklus Panen)', status: 'Status',
};

const FIELD_LABELS_PETELUR: Record<string, string> = {
  kecamatan: 'Kecamatan', desa: 'Desa', nama_badan_usaha: 'Nama Badan Usaha (Perusahaan)',
  nama_unit_farm_perusahaan: 'Nama Unit Farm (Perusahaan)', nama_peternak: 'Nama Peternak (Mandiri)',
  nama_unit_farm_mandiri: 'Nama Unit Farm (Mandiri)', mandiri_kemitraan: 'Mandiri / Kemitraan',
  alamat: 'Alamat', lintang: 'Lintang', bujur: 'Bujur', telp_hp: 'Telp / HP',
  kapasitas_kandang: 'Kapasitas Kandang (Ekor/Tahun)', populasi_produktif: 'Populasi Produktif (Ekor)',
  populasi_belum_produktif: 'Populasi Belum Produktif (Ekor)', populasi_total: 'Populasi Total (Ekor)',
  produksi_telur_kg_tahun: 'Produksi Telur Konsumsi (Kg/Tahun)', konsumsi_pakan: 'Konsumsi Pakan (Gram/Ekor/Hari)',
};

const FIELD_LABELS_GENERAL: Record<string, string> = {
  nama_peternak: 'Nama Peternak / Nama Badan Usaha', nama_unit_farm: 'Nama Unit Farm',
  status_kepemilikan: 'Status Kepemilikan Farm', kapasitas_kandang: 'Kapasitas Kandang (Ekor/Tahun)',
  alamat: 'Alamat', kelurahan_desa: 'Kelurahan / Desa / Nagari', kecamatan: 'Kecamatan / Distrik',
  lintang: 'Lintang', bujur: 'Bujur', telp_hp: 'Telp / HP', tujuan_pemeliharaan: 'Tujuan Pemeliharaan',
};

const COMMODITY_META: Record<CommodityKey, any> = {
  broiler: { title: 'Ayam Broiler', subtitle: 'Ayam Pedaging', icon: '🍗', cardBg: 'bg-amber-50', cardBorder: 'border-amber-400', headBg: 'bg-amber-100', headText: 'text-amber-900' },
  petelur: { title: 'Ayam Petelur', subtitle: 'Ayam Ras Petelur', icon: '🥚', cardBg: 'bg-yellow-50', cardBorder: 'border-yellow-400', headBg: 'bg-yellow-100', headText: 'text-yellow-900' },
  babi: { title: 'Babi', subtitle: 'Ternak Babi', icon: '🐖', jenisTernak: 'Babi', cardBg: 'bg-pink-50', cardBorder: 'border-pink-400', headBg: 'bg-pink-100', headText: 'text-pink-900' },
  sapi: { title: 'Sapi Potong', subtitle: 'Ternak Sapi Potong', icon: '🐄', jenisTernak: 'Sapi Potong', cardBg: 'bg-blue-50', cardBorder: 'border-blue-400', headBg: 'bg-blue-100', headText: 'text-blue-900' },
  domba: { title: 'Domba', subtitle: 'Ternak Domba', icon: '🐑', jenisTernak: 'Domba', cardBg: 'bg-purple-50', cardBorder: 'border-purple-400', headBg: 'bg-purple-100', headText: 'text-purple-900' },
};

const COMMODITY_ORDER: CommodityKey[] = ['broiler', 'petelur', 'sapi', 'domba', 'babi'];

function parseNum(v: string | undefined): number {
  if (!v) return 0;
  const m = v.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}
function formatNum(n: number): string { return n.toLocaleString('id-ID'); }
function getFieldLabels(key: CommodityKey) {
  if (key === 'broiler') return FIELD_LABELS_BROILER;
  if (key === 'petelur') return FIELD_LABELS_PETELUR;
  return FIELD_LABELS_GENERAL;
}

/* ======================= KOMPONEN UTAMA ======================= */
export default function DataFarmPage() {
  const [dataBroiler, setDataBroiler] = useState<any[]>([]);
  const [dataPetelur, setDataPetelur] = useState<any[]>([]);
  const [dataGeneral, setDataGeneral] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeCommodity, setActiveCommodity] = useState<CommodityKey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNo, setEditingNo] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<any>({});
  const [confirmDeleteNo, setConfirmDeleteNo] = useState<number | null>(null);

  // SEDOT DATA DARI MYSQL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-farm');
        const data = await response.json();
        setDataBroiler(data.dataBroiler || []);
        setDataPetelur(data.dataPetelur || []);
        setDataGeneral(data.dataGeneral || []);
      } catch (error) {
        console.error('Gagal menyedot data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getBaseData = (key: CommodityKey): any[] => {
    if (key === 'broiler') return dataBroiler;
    if (key === 'petelur') return dataPetelur;
    const jenis = COMMODITY_META[key].jenisTernak;
    return dataGeneral.filter((d) => d.jenis_ternak === jenis);
  };

  const getFilteredData = (key: CommodityKey): any[] => {
    const base = getBaseData(key);
    if (!searchTerm.trim()) return base;
    const term = searchTerm.toLowerCase();
    return base.filter((item) => Object.values(item).some(val => String(val).toLowerCase().includes(term)));
  };

  const getStats = (key: CommodityKey) => {
    const base = getBaseData(key);
    const jumlahFarm = base.length;
    let totalPopulasi = 0;
    let label = 'Kapasitas Kandang';
    if (key === 'broiler') {
      totalPopulasi = base.reduce((sum, d) => sum + parseNum(d.jumlah_populasi), 0);
      label = 'Populasi (Ekor)';
    } else if (key === 'petelur') {
      totalPopulasi = base.reduce((sum, d) => sum + parseNum(d.populasi_total), 0);
      label = 'Populasi (Ekor)';
    } else {
      totalPopulasi = base.reduce((sum, d) => sum + parseNum(d.kapasitas_kandang), 0);
      label = 'Kapasitas Kandang (Ekor)';
    }
    return { jumlahFarm, totalPopulasi, label };
  };

  // FUNGSI EDIT / TAMBAH
  const openAddModal = () => { setEditingNo(null); setFormValues({}); setIsModalOpen(true); };
  const openEditModal = (item: any) => { setEditingNo(item.no); setFormValues({ ...item }); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingNo(null); setFormValues({}); };
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Catatan: Fungsi simpan saat ini masih memori lokal. (API UPDATE/INSERT MySQL akan segera dibuat!)');
    closeModal();
  };

  const handleDelete = (no: number) => {
    alert('Catatan: Fungsi hapus saat ini masih memori lokal. (API DELETE MySQL akan segera dibuat!)');
    setConfirmDeleteNo(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center font-sans">
        <span className="text-emerald-700 font-bold text-2xl animate-pulse">Menyedot Data Peternakan dari Server... 🐄🐓</span>
      </div>
    );
  }

  /* ======================= TAMPILAN: KARTU RINGKASAN ======================= */
  if (!activeCommodity) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col p-4 md:p-6 font-sans text-gray-900">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-center md:text-left">
          <Link href="/bitpro" className="w-full md:w-auto text-center bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 md:py-2 rounded-lg font-bold shadow-md transition-colors">
            ← Kembali ke Bitpro
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-emerald-900">Data Farm — Sebaran Farm</h1>
          <div className="w-full md:w-auto md:invisible"><span className="px-5 py-3 md:py-2 block">placeholder</span></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          {COMMODITY_ORDER.map((key) => {
            const meta = COMMODITY_META[key];
            const stats = getStats(key);
            return (
              <button key={key} onClick={() => { setActiveCommodity(key); setSearchTerm(''); }} className={`text-left p-6 rounded-3xl shadow-lg border-2 ${meta.cardBg} ${meta.cardBorder} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                <div className="text-5xl mb-3">{meta.icon}</div>
                <h3 className="text-2xl font-black text-gray-800">{meta.title}</h3>
                <p className="text-sm font-semibold text-gray-500 mb-4">{meta.subtitle}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Jumlah Farm</p>
                    <p className="text-3xl font-black text-gray-800">{stats.jumlahFarm}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">{stats.label}</p>
                    <p className="text-xl font-black text-gray-700">{formatNum(stats.totalPopulasi)}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ======================= TAMPILAN: TABEL ======================= */
  const meta = COMMODITY_META[activeCommodity];
  const filteredData = getFilteredData(activeCommodity);
  const fieldLabels = getFieldLabels(activeCommodity);

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col p-4 md:p-6 font-sans text-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-center md:text-left">
        <button onClick={() => { setActiveCommodity(null); setSearchTerm(''); }} className="w-full md:w-auto text-center bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 md:py-2 rounded-lg font-bold shadow-md transition-colors">
          ← Kembali ke Ringkasan
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-emerald-900">{meta.icon} {meta.title}</h1>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
          <button onClick={openAddModal} className="w-full md:w-auto text-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 md:py-2 rounded-lg font-bold shadow-md transition-colors">
            ➕ Tambah Data
          </button>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-xl flex flex-col flex-grow">
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900 w-full md:w-auto text-center md:text-left">
            Daftar Farm {meta.title} ({filteredData.length})
          </h2>
          <input type="text" placeholder="🔍 Cari data..." className="w-full md:max-w-md p-3 border-2 border-emerald-100 rounded-xl bg-emerald-50 focus:outline-none focus:border-emerald-500 text-gray-900" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className={`${meta.headBg} ${meta.headText} font-bold border-b-2`}>
              <tr>
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3">Nama / Farm</th>
                <th className="p-3">Kecamatan</th>
                <th className="p-3">Desa</th>
                <th className="p-3 text-center">Kapasitas Kandang</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.no} className="border-b hover:bg-emerald-50 transition-colors">
                    <td className="p-3 text-center font-bold text-gray-500">{item.no}</td>
                    <td className="p-3 font-bold text-emerald-800">
                      {item.nama_peternak || item.nama_unit_farm || item.nama_badan_usaha || '-'}
                    </td>
                    <td className="p-3">{item.kecamatan || '-'}</td>
                    <td className="p-3">{item.desa || item.kelurahan_desa || '-'}</td>
                    <td className="p-3 text-center font-bold text-blue-700">{item.kapasitas_kandang || '-'}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => openEditModal(item)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">✏️ Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-bold">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-xl font-black text-emerald-900">{editingNo !== null ? `Edit ${meta.title}` : `Tambah ${meta.title}`}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(fieldLabels).map((key) => (
                <div key={key} className={key === 'alamat' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{fieldLabels[key]}</label>
                  <input type="text" name={key} value={formValues[key] ?? ''} onChange={handleFieldChange} className="w-full p-2.5 border-2 border-emerald-100 rounded-lg bg-emerald-50 focus:outline-none focus:border-emerald-500 text-sm text-gray-900"/>
                </div>
              ))}
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Batal</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}