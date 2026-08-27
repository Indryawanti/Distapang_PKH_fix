'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  Edit2,
  Trash2,
  Filter,
  FileText,
  MapPin,
  X,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

type KTTMaster = {
  id: number | string;
  namaKelompok: string;
  kecamatan: string;
  desa: string;
};

type KegiatanKTT = {
  id: string;
  tanggal: string;
  ktt_id: string;
  nama_ktt: string;
  kecamatan: string;
  desa: string;
  tim_pelaksana: string;
  nama_kegiatan: string;
  hasil_kegiatan: string;
  created_at?: string;
};

const DAFTAR_TIM_PELAKSANA = [
  'Tim Pembibitan & Produksi Bitpro',
  'Tim Monitoring & Evaluasi Lapangan',
  'Tim Medis Veteriner & Kesehatan Ternak',
  'Tim Verifikasi Kelayakan Bantuan',
  'Tim Pendamping Penyuluh Kecamatan',
  'Tim Sarana & Prasarana Peternakan',
];

const PRESET_KEGIATAN = [
  'Pembinaan Manajemen Kelompok & Kandang',
  'Monitoring Populasi & Kesehatan Ternak',
  'Verifikasi Lapangan Usulan Calon Penerima Bantuan',
  'Pendampingan Pakan & Hijauan Makanan Ternak (HMT)',
  'Evaluasi Pasca Penyaluran Bantuan Hibah',
  'Sosialisasi & Edukasi Inseminasi Buatan (IB)',
];

export default function KegiatanKTTPage() {
  const [listKegiatan, setListKegiatan] = useState<KegiatanKTT[]>([]);
  const [listKTT, setListKTT] = useState<KTTMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterKtt, setFilterKtt] = useState('');
  const [filterTim, setFilterTim] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    ktt_id: '',
    nama_ktt: '',
    kecamatan: '',
    desa: '',
    tim_pelaksana: DAFTAR_TIM_PELAKSANA[0],
    nama_kegiatan: '',
    hasil_kegiatan: '',
  });

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Tarik Data KTT Master
      const resKTT = await fetch('/api/ktt');
      const dataKTT = await resKTT.json();
      if (Array.isArray(dataKTT)) {
        setListKTT(dataKTT);
      }

      // 2. Tarik Data Kegiatan KTT
      const resKeg = await fetch('/api/kegiatan-ktt');
      const dataKeg = await resKeg.json();
      if (Array.isArray(dataKeg)) {
        setListKegiatan(dataKeg);
      }
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Pilih KTT di Form Modal (Auto-fill Kecamatan & Desa)
  const handleSelectKTTInForm = (kttName: string) => {
    const selected = listKTT.find((k) => k.namaKelompok === kttName);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        ktt_id: String(selected.id),
        nama_ktt: selected.namaKelompok,
        kecamatan: selected.kecamatan,
        desa: selected.desa,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        nama_ktt: kttName,
        ktt_id: '',
      }));
    }
  };

  // Submit Simpan / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_ktt) return alert('Silakan pilih nama KTT!');
    if (!formData.nama_kegiatan) return alert('Silakan isi nama/jenis kegiatan!');

    try {
      const res = await fetch('/api/kegiatan-ktt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          ...formData,
          isEdit: !!editingId,
        }),
      });

      if (res.ok) {
        alert(editingId ? 'Kegiatan KTT berhasil diperbarui!' : 'Kegiatan KTT baru berhasil dicatat!');
        setShowModal(false);
        resetForm();
        fetchData();
      } else {
        alert('Gagal menyimpan kegiatan KTT.');
      }
    } catch {
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  // Handle Edit
  const handleEdit = (kegiatan: KegiatanKTT) => {
    setEditingId(kegiatan.id);
    setFormData({
      tanggal: kegiatan.tanggal ? new Date(kegiatan.tanggal).toISOString().split('T')[0] : '',
      ktt_id: kegiatan.ktt_id || '',
      nama_ktt: kegiatan.nama_ktt || '',
      kecamatan: kegiatan.kecamatan || '',
      desa: kegiatan.desa || '',
      tim_pelaksana: kegiatan.tim_pelaksana || DAFTAR_TIM_PELAKSANA[0],
      nama_kegiatan: kegiatan.nama_kegiatan || '',
      hasil_kegiatan: kegiatan.hasil_kegiatan || '',
    });
    setShowModal(true);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus catatan log kegiatan ini?')) return;
    try {
      const res = await fetch(`/api/kegiatan-ktt?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert('Gagal menghapus kegiatan.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      ktt_id: '',
      nama_ktt: '',
      kecamatan: '',
      desa: '',
      tim_pelaksana: DAFTAR_TIM_PELAKSANA[0],
      nama_kegiatan: '',
      hasil_kegiatan: '',
    });
  };

  // Filtered Kegiatan
  const filteredKegiatan = useMemo(() => {
    return listKegiatan.filter((item) => {
      const matchKtt = filterKtt ? item.nama_ktt === filterKtt : true;
      const matchTim = filterTim ? item.tim_pelaksana === filterTim : true;
      const matchSearch = searchTerm
        ? item.nama_ktt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.hasil_kegiatan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.kecamatan || '').toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchKtt && matchTim && matchSearch;
    });
  }, [listKegiatan, filterKtt, filterTim, searchTerm]);

  // Unique KTTs involved in activities
  const uniqueKttCount = useMemo(() => {
    return new Set(listKegiatan.map((k) => k.nama_ktt)).size;
  }, [listKegiatan]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white pb-20">
      
      {/* ── TOP HEADER (Tema Hijau Bitpro) ── */}
      <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/bitpro"
              className="min-h-touch min-w-touch w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-xs shrink-0"
              aria-label="Kembali ke Bitpro"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Link href="/bitpro" className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors truncate">
                  Bitpro
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">Kegiatan KTT</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
                Log Aktivitas &amp; Pembinaan KTT
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              title="Catat Kegiatan KTT Baru"
              aria-label="Catat Kegiatan KTT Baru"
              className="min-h-touch min-w-touch h-11 w-11 sm:w-auto sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center sm:gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Catat Kegiatan Baru</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CalendarIcon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Kegiatan Lapangan</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {listKegiatan.length} <span className="text-xs font-semibold text-slate-400">Aktivitas</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">KTT Terjangkau</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {uniqueKttCount} <span className="text-xs font-semibold text-slate-400">Kelompok</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Database Master KTT</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {listKTT.length} <span className="text-xs font-semibold text-slate-400">Terdaftar</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── FILTER & SEARCH BAR ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Filter Pilih KTT */}
            <div className="w-full sm:w-64">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Filter Berdasarkan KTT
              </label>
              <select
                value={filterKtt}
                onChange={(e) => setFilterKtt(e.target.value)}
                className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:bg-white focus:border-emerald-600 outline-none"
              >
                <option value="">Semua KTT ({listKTT.length})</option>
                {listKTT.map((k) => (
                  <option key={k.id} value={k.namaKelompok}>
                    {k.namaKelompok} ({k.kecamatan})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tim Pelaksana */}
            <div className="w-full sm:w-64">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Filter Tim Pelaksana
              </label>
              <select
                value={filterTim}
                onChange={(e) => setFilterTim(e.target.value)}
                className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:bg-white focus:border-emerald-600 outline-none"
              >
                <option value="">Semua Tim Pelaksana</option>
                {DAFTAR_TIM_PELAKSANA.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72 self-end">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pencarian Kata Kunci
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kegiatan, hasil, lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-touch h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:border-emerald-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── TABEL LOG AKTIVITAS ── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Daftar Log Aktivitas &amp; Hasil Kegiatan Lapangan</span>
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {filteredKegiatan.length} Catatan
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Riwayat pembinaan, pengawasan, dan monev teknis per KTT se-Kabupaten Kebumen
              </p>
            </div>

            {(filterKtt || filterTim || searchTerm) && (
              <button
                onClick={() => {
                  setFilterKtt('');
                  setFilterTim('');
                  setSearchTerm('');
                }}
                className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
              >
                <X size={14} /> Reset Filter
              </button>
            )}
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs sm:text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-5 py-4 w-14 text-center">No</th>
                  <th className="px-5 py-4">Tanggal Kegiatan</th>
                  <th className="px-5 py-4">Kelompok Tani Ternak (KTT)</th>
                  <th className="px-5 py-4">Tim Pelaksana</th>
                  <th className="px-5 py-4">Nama / Jenis Kegiatan</th>
                  <th className="px-5 py-4">Keterangan &amp; Hasil</th>
                  <th className="px-5 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKegiatan.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-emerald-700 text-center text-xs">{idx + 1}</td>
                    
                    {/* Tanggal */}
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }) : '-'}
                    </td>

                    {/* KTT & Lokasi */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 block text-sm">{item.nama_ktt}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        {item.desa ? `${item.desa}, ` : ''}{item.kecamatan || '-'}
                      </span>
                    </td>

                    {/* Tim Pelaksana */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
                        {item.tim_pelaksana}
                      </span>
                    </td>

                    {/* Nama Kegiatan */}
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {item.nama_kegiatan}
                    </td>

                    {/* Keterangan & Hasil */}
                    <td className="px-5 py-4 max-w-xs whitespace-normal">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.hasil_kegiatan || '-'}
                      </p>
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Kegiatan"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredKegiatan.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-medium">
                      Belum ada catatan log kegiatan KTT yang tersimpan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ── MODAL FORM: CATAT KEGIATAN KTT BARU / EDIT ── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon size={22} className="text-emerald-600" />
                <span>{editingId ? 'Edit Log Kegiatan KTT' : 'Catat Kegiatan KTT Baru'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 1. Tanggal Kegiatan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tanggal Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full min-h-touch h-11 px-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 text-xs text-slate-900 font-semibold"
                />
              </div>

              {/* 2. Pilih KTT (Dari Database KTT) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pilih KTT (Dari Database Master) <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.nama_ktt}
                  onChange={(e) => handleSelectKTTInForm(e.target.value)}
                  className="w-full min-h-touch h-11 px-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 text-xs text-slate-900 font-bold"
                >
                  <option value="">-- Pilih Kelompok Tani Ternak --</option>
                  {listKTT.map((k) => (
                    <option key={k.id} value={k.namaKelompok}>
                      {k.namaKelompok} — Kec. {k.kecamatan}, Desa {k.desa}
                    </option>
                  ))}
                </select>
                {formData.kecamatan && (
                  <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                    ✓ Lokasi terisi otomatis: Kec. {formData.kecamatan}, Desa {formData.desa}
                  </p>
                )}
              </div>

              {/* 3. Tim Pelaksana */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tim Pelaksana <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.tim_pelaksana}
                  onChange={(e) => setFormData({ ...formData, tim_pelaksana: e.target.value })}
                  className="w-full min-h-touch h-11 px-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 text-xs text-slate-900 font-semibold"
                >
                  {DAFTAR_TIM_PELAKSANA.map((tim) => (
                    <option key={tim} value={tim}>
                      {tim}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Jenis / Nama Kegiatan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Jenis / Nama Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembinaan Manajemen Kelompok & Pembuatan Pakan Fermentasi"
                  value={formData.nama_kegiatan}
                  onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                  className="w-full min-h-touch h-11 px-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 text-xs text-slate-900"
                />

                {/* Preset Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 py-0.5">Pilihan cepat:</span>
                  {PRESET_KEGIATAN.slice(0, 3).map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setFormData({ ...formData, nama_kegiatan: preset })}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Keterangan / Hasil Kegiatan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Keterangan / Hasil Kegiatan
                </label>
                <textarea
                  rows={4}
                  placeholder="Catatan progres, kesimpulan pertemuan, kondisi lapangan, atau rekomendasi tindak lanjut..."
                  value={formData.hasil_kegiatan}
                  onChange={(e) => setFormData({ ...formData, hasil_kegiatan: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 text-xs text-slate-900"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 min-h-touch h-11 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-touch h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan' : 'Simpan Kegiatan'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
