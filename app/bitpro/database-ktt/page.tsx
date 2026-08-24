'use client';

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

/* =========================================================
   1. TIPE DATA & KONSTANTA
   ========================================================= */
export interface KelompokTani {
  id: number;
  kecamatan: string;
  desa: string;
  namaKelompok: string;
  nomorRegister: string;
  jenisKelompok: string;
  kelasKelompok: string;
  luasLahanHa: number;
  anggotaLaki: number;
  anggotaPerempuan: number;
  namaKetuaKelompok: string;
}

type KelompokTaniFormValues = Omit<KelompokTani, 'id'>;

const emptyFormValues: KelompokTaniFormValues = {
  kecamatan: "", desa: "", namaKelompok: "",
  nomorRegister: "", jenisKelompok: "", kelasKelompok: "",
  luasLahanHa: 0, anggotaLaki: 0, anggotaPerempuan: 0, namaKetuaKelompok: ""
};

const KECAMATAN_OPTIONS = [
  "Ayah", "Buayan", "Puring", "Petanahan", "Klirong", "Buluspesantren", "Ambal",
  "Mirit", "Bonorowo", "Prembun", "Padureso", "Kutowinangun", "Alian",
  "Poncowarno", "Kebumen", "Pejagoan", "Sruweng", "Adimulyo", "Kuwarasan",
  "Rowokele", "Sempor", "Gombong", "Karanganyar", "Karanggayam", "Sadang",
  "Karangsambung"
];

const JENIS_KELOMPOK_OPTIONS = ["Poktan/Tanaman Pangan", "Kelompok Tani Ternak (KTT)", "Kelompok Lainnya"];

const KELAS_ORDER = ["Pemula", "Lanjut", "Madya", "Utama"];

const PAGE_SIZE = 10;

/* =========================================================
   2. KOMPONEN KECIL — STEMPEL KELAS KELOMPOK
   ========================================================= */
function KelasStamp({ kelas }: { kelas: string }) {
  if (!kelas) {
    return <span className="text-[11px] text-[#A39B7C] italic font-medium">Belum diklasifikasi</span>;
  }
  const tier = KELAS_ORDER.indexOf(kelas); // -1..3
  return (
    <span
      className="stamp-mark inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{
        borderColor: tier >= 2 ? '#A67C2E' : '#8B8168',
        color: tier >= 2 ? '#8A611F' : '#6B6650',
        transform: `rotate(${tier % 2 === 0 ? '-1.5deg' : '1deg'})`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tier >= 2 ? '#A67C2E' : '#8B8168' }} />
      {kelas}
    </span>
  );
}

/* =========================================================
   3. IKON SEDERHANA
   ========================================================= */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.3-4.3" />
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 4l9 16H3z" />
    <path d="M12 10v4" /><circle cx="12" cy="17.3" r="0.6" fill="currentColor" />
  </svg>
);

/* =========================================================
   4. HALAMAN UTAMA DATABASE KTT
   ========================================================= */
export default function DatabaseKTTPage() {
  const [data, setData] = useState<KelompokTani[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("");
  const [filterDesa, setFilterDesa] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"tambah" | "edit">("tambah");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<KelompokTaniFormValues>(emptyFormValues);

  const [deleteTarget, setDeleteTarget] = useState<KelompokTani | null>(null);

  // ─── FUNGSI LOAD DATA ANTI-ERROR ───
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ktt');
      const jsonData = await res.json();
      
      let validData: KelompokTani[] = [];
      
      // Deteksi Cerdas: Cari array-nya dimana pun dia berada
      if (Array.isArray(jsonData)) {
        validData = jsonData;
      } else if (jsonData && typeof jsonData === 'object') {
        // Coba cari properti yang isinya array (misal jsonData.data, jsonData.kttData, dll)
        const foundArray = Object.values(jsonData).find(val => Array.isArray(val));
        if (foundArray) {
          validData = foundArray as KelompokTani[];
        }
      }
      
      setData(validData);
    } catch (error) {
      console.error('Gagal meload data:', error);
      setData([]); // Pastikan state diisi array kosong jika gagal
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const desaList = useMemo(() => {
    if (!filterKecamatan) return [];
    const desas = data.filter(d => d.kecamatan === filterKecamatan).map(d => d.desa);
    return Array.from(new Set(desas)).sort();
  }, [data, filterKecamatan]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((row) => {
      // Pencegahan error jika data string kosong / undefined
      const namaKel = row.namaKelompok ? row.namaKelompok.toLowerCase() : "";
      const namaKet = row.namaKetuaKelompok ? row.namaKetuaKelompok.toLowerCase() : "";
      const nmrReg = row.nomorRegister ? row.nomorRegister.toLowerCase() : "";
      const nmDesa = row.desa ? row.desa.toLowerCase() : "";

      const matchSearch = !q || namaKel.includes(q) || namaKet.includes(q) || nmDesa.includes(q) || nmrReg.includes(q);
      const matchKecamatan = !filterKecamatan || row.kecamatan === filterKecamatan;
      const matchDesa = !filterDesa || row.desa === filterDesa;
      const matchJenis = !filterJenis || row.jenisKelompok === filterJenis;
      
      return matchSearch && matchKecamatan && matchDesa && matchJenis;
    });
  }, [data, search, filterKecamatan, filterDesa, filterJenis]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const kecamatanIndex = useMemo(() => {
    const base = data.filter((row) => !filterJenis || row.jenisKelompok === filterJenis);
    const map = new Map<string, { jumlah: number; ktt: number; poktan: number; lainnya: number }>();
    for (const row of base) {
      const cur = map.get(row.kecamatan) || { jumlah: 0, ktt: 0, poktan: 0, lainnya: 0 };
      cur.jumlah += 1;
      if (row.jenisKelompok === "Kelompok Tani Ternak (KTT)") cur.ktt += 1;
      else if (row.jenisKelompok === "Poktan/Tanaman Pangan") cur.poktan += 1;
      else cur.lainnya += 1;
      map.set(row.kecamatan, cur);
    }
    return KECAMATAN_OPTIONS.map((k) => ({
      kecamatan: k,
      ...(map.get(k) || { jumlah: 0, ktt: 0, poktan: 0, lainnya: 0 }),
    }));
  }, [data, filterJenis]);

  const showFrontPage = !filterKecamatan && !search.trim();

  function resetToPageOne() { setPage(1); }

  function pilihKecamatan(kec: string) {
    if (filterKecamatan !== kec) {
      setFilterKecamatan(kec);
      setFilterDesa(""); 
    } else {
      setFilterKecamatan("");
      setFilterDesa("");
    }
    resetToPageOne();
  }

  function openAddModal() {
    setFormMode("tambah");
    setEditingId(null);
    setFormValues(emptyFormValues);
    setFormOpen(true);
  }

  function openEditModal(row: KelompokTani) {
    setFormMode("edit");
    setEditingId(row.id);
    const { id, ...rest } = row;
    setFormValues(rest);
    setFormOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch('/api/ktt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...formValues })
      });
      await loadData();
      setFormOpen(false);
    } catch (error) {
      alert('Gagal menyimpan data!');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/ktt?id=${deleteTarget.id}`, { method: 'DELETE' });
      await loadData();
      setDeleteTarget(null);
    } catch (error) {
      alert('Gagal menghapus data!');
    }
  }

  if (isLoading) {
    return (
      <div className="ktt-scope min-h-screen flex items-center justify-center" style={{ background: '#1F3626' }}>
        <style jsx global>{fontImports}</style>
        <span className="font-display text-lg text-[#EFEAD9]/80 tracking-wide">Memuat Buku Register Kelompok Tani…</span>
      </div>
    );
  }

  return (
    <div className="ktt-scope min-h-screen" style={{ background: '#EDE8DA' }}>
      <style jsx global>{fontImports}</style>

      {/* PLAT JUDUL */}
      <header style={{ background: '#1F3626' }} className="border-b-4 border-[#A67C2E]/70 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between sm:justify-center">
          <Link
            href="/bitpro"
            className="sm:absolute left-4 sm:left-8 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#EFEAD9] border border-[#EFEAD9]/30 hover:bg-white/10 transition-colors shrink-0 text-sm font-medium"
          >
            <span>←</span> <span className="hidden sm:inline">Modul Bitpro</span>
          </Link>

          <div className="text-center flex-1 sm:flex-none">
            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#F6F2E4]">
              Database KTT
            </h1>
            <p className="text-[11px] sm:text-xs font-medium text-[#C9C2A8] tracking-wide uppercase mt-1">
              Register Kelompok Tani &middot; Kabupaten Kebumen
            </p>
          </div>
          
          <div className="w-[88px] sm:hidden"></div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-5">

        {/* RAIL INDEKS KECAMATAN */}
        <aside className="rounded-xl border border-[#D8D0B8] bg-[#F6F3E9] overflow-hidden h-fit lg:sticky lg:top-6 shadow-sm">
          <div className="px-4 py-3 border-b border-[#D8D0B8] flex items-center justify-between">
            <span className="font-display text-sm font-semibold text-[#1F3626]">Indeks Kecamatan</span>
            <span className="text-[11px] font-mono text-[#8B8168]">{kecamatanIndex.filter(k => k.jumlah > 0).length}/26</span>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {kecamatanIndex.map(({ kecamatan, jumlah }) => {
              const active = filterKecamatan === kecamatan;
              return (
                <button
                  key={kecamatan}
                  onClick={() => pilihKecamatan(kecamatan)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-left text-sm border-l-[3px] transition-colors ${
                    active
                      ? 'border-l-[#A67C2E] bg-[#EFE7CE] font-semibold text-[#1F3626]'
                      : 'border-l-transparent text-[#4A4636] hover:bg-[#EFEBDC]'
                  }`}
                >
                  <span>{kecamatan}</span>
                  <span className="font-mono text-xs tabular-nums text-[#8B8168]">{jumlah}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* KONTEN UTAMA */}
        <div className="min-w-0">
          {/* BILAH PENCARIAN & FILTER */}
          <div className="rounded-xl border border-[#D8D0B8] bg-[#F6F3E9] p-3 mb-5 flex flex-col md:flex-row gap-2.5 items-center shadow-sm">
            <div className="flex-1 w-full relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#8B8168]"><IconSearch /></span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetToPageOne(); }}
                placeholder="Cari kelompok, ketua, reg…"
                className="w-full rounded-lg border border-[#D8D0B8] bg-white py-2 pl-9 pr-3 text-sm text-[#20241D] focus:outline-none focus:ring-2 focus:ring-[#A67C2E]/40 focus:border-[#A67C2E] transition"
              />
            </div>

            {filterKecamatan && (
              <select
                value={filterDesa}
                onChange={(e) => { setFilterDesa(e.target.value); resetToPageOne(); }}
                className="w-full md:w-auto rounded-lg border border-[#D8D0B8] bg-white py-2 px-3 text-sm text-[#20241D] focus:outline-none focus:ring-2 focus:ring-[#A67C2E]/40 cursor-pointer"
              >
                <option value="">Semua Desa</option>
                {desaList.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            )}

            <select
              value={filterJenis}
              onChange={(e) => { setFilterJenis(e.target.value); resetToPageOne(); }}
              className="w-full md:w-auto rounded-lg border border-[#D8D0B8] bg-white py-2 px-3 text-sm text-[#20241D] focus:outline-none focus:ring-2 focus:ring-[#A67C2E]/40 cursor-pointer"
            >
              <option value="">Semua Jenis</option>
              {JENIS_KELOMPOK_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>

            <button
              onClick={openAddModal}
              className="w-full md:w-auto shrink-0 rounded-lg bg-[#2F4D38] px-4 py-2 text-sm font-bold text-white shadow-sm border border-[#1F3626] hover:bg-[#1F3626] transition whitespace-nowrap"
            >
              + Tambah Kelompok
            </button>
          </div>

          {filterKecamatan && (
            <div className="mb-4">
              <button 
                onClick={() => { setFilterKecamatan(""); setFilterDesa(""); resetToPageOne(); }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F3626] hover:text-[#A67C2E] transition-colors bg-[#F6F3E9] px-4 py-2 rounded-lg border border-[#D8D0B8] shadow-sm"
              >
                ← Kembali ke Semua Kecamatan
              </button>
            </div>
          )}

          {/* HALAMAN DEPAN -- indeks semua kecamatan */}
          {showFrontPage ? (
            <div className="rounded-xl border border-[#D8D0B8] bg-[#FBFAF3] p-5 sm:p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-[#1F3626]">Indeks Seluruh Kecamatan</h2>
                  <p className="text-xs text-[#8B8168] mt-0.5">Pilih kecamatan untuk membuka daftar kelompok tani secara rinci.</p>
                </div>
                <span className="font-mono text-xs text-[#8B8168] tabular-nums shrink-0">
                  {data.length} kelompok &middot; 26 kecamatan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {kecamatanIndex.map(({ kecamatan, jumlah, ktt, poktan }) => (
                  <button
                    key={kecamatan}
                    onClick={() => pilihKecamatan(kecamatan)}
                    className="text-left rounded-lg border border-[#D8D0B8] bg-white px-4 py-3 hover:border-[#A67C2E]/60 hover:bg-[#FBF7EA] transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-[#1F3626]">{kecamatan}</span>
                      <span className="font-mono text-sm font-bold tabular-nums text-[#8A611F] bg-[#F6F3E9] px-2 py-0.5 rounded">{jumlah}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#7A7458] font-medium">
                      <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#1F3626]" />KTT {ktt}</span>
                      <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#2F4D38]" />Poktan {poktan}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
          /* TABEL LEDGER UPDATE KETIGA (Dibuat lebih ringkas) */
          <div className="rounded-xl border border-[#D8D0B8] bg-[#FBFAF3] overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-[#D8D0B8] flex items-center justify-between bg-white">
              <p className="text-sm text-[#5A5644]">
                <span className="font-mono font-bold text-[#1F3626]">{filtered.length}</span> kelompok tercatat di <span className="font-bold text-[#1F3626]">{filterKecamatan}</span>
                {filterDesa && <span>, Desa <span className="font-bold text-[#1F3626]">{filterDesa}</span></span>}
              </p>
            </div>

            {/* Overflow x tetap ada untuk jaga-jaga kalau layarnya sangat kecil (mobile) */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] sm:text-[11px] font-bold text-[#5A5644] uppercase tracking-wider border-b border-[#D8D0B8] bg-[#F6F3E9]">
                    <th className="px-4 py-3 w-10">NO.</th>
                    <th className="px-2 py-3">NAMA &amp; WILAYAH</th>
                    <th className="px-2 py-3">NO. REGISTER</th>
                    <th className="px-2 py-3">KETUA</th>
                    <th className="px-2 py-3">KATEGORI</th>
                    <th className="px-2 py-3 text-center">ANGGOTA</th>
                    <th className="px-4 py-3 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <p className="font-display text-base font-bold text-[#4A4636]">Belum ada catatan yang cocok</p>
                        <p className="text-sm text-[#8B8168] mt-1 font-medium">Coba ubah kata kunci atau hapus filter.</p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((row, i) => (
                      <tr key={row.id} className="border-b border-[#EAE5D4] last:border-b-0 hover:bg-[#F3EFDF]/60 transition-colors">
                        
                        {/* NO */}
                        <td className="px-4 py-3 align-top font-mono text-[11px] font-semibold text-[#8B8168] tabular-nums">
                          {String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(3, '0')}
                        </td>
                        
                        {/* NAMA & WILAYAH */}
                        <td className="px-2 py-3 align-top">
                          <p className="font-display font-semibold text-[#1F3626] text-[14px] leading-snug">{row.namaKelompok}</p>
                          <p className="text-[10px] text-[#7A7458] mt-1 uppercase tracking-wide font-medium">{row.desa}, KEC. {row.kecamatan}</p>
                        </td>

                        {/* NO REGISTER */}
                        <td className="px-2 py-3 align-top">
                          <p className="text-[11px] text-[#8B8168] font-mono tracking-tight leading-snug">
                            {row.nomorRegister || <span className="italic text-[#A39B7C]">Belum ada</span>}
                          </p>
                        </td>

                        {/* KETUA */}
                        <td className="px-2 py-3 align-top">
                          <p className="text-[12px] font-medium text-[#4A4636] leading-snug">{row.namaKetuaKelompok}</p>
                        </td>

                        {/* KATEGORI */}
                        <td className="px-2 py-3 align-top">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[11px] font-medium text-[#4A4636] leading-tight">{row.jenisKelompok}</span>
                            <KelasStamp kelas={row.kelasKelompok} />
                          </div>
                        </td>

                        {/* ANGGOTA */}
                        <td className="px-2 py-3 align-top text-center whitespace-nowrap">
                          <span className="font-mono text-[12px] font-semibold tabular-nums text-[#4A4636]">{row.anggotaLaki}L</span>
                          <span className="text-[#C9C2A8] mx-0.5 font-bold">/</span>
                          <span className="font-mono text-[12px] font-semibold tabular-nums text-[#4A4636]">{row.anggotaPerempuan}P</span>
                        </td>

                        {/* AKSI */}
                        <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => openEditModal(row)} className="rounded border border-[#D8D0B8] bg-white px-2 py-1 text-[11px] font-medium text-[#4A4636] shadow-sm hover:bg-[#F3EFDF] transition-colors">
                              Ubah
                            </button>
                            <button onClick={() => setDeleteTarget(row)} className="rounded border border-red-200 bg-white px-2 py-1 text-[11px] font-medium text-red-700 shadow-sm hover:bg-red-50 transition-colors">
                              Hapus
                            </button>
                          </div>
                        </td>
                        
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="border-t border-[#D8D0B8] px-5 py-3.5 flex items-center justify-between bg-[#F6F3E9]">
                <button disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-[#D8D0B8] bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#4A4636] hover:bg-[#EFEAD9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
                  ← Sebelumnya
                </button>
                <span className="text-xs font-mono font-medium text-[#8B8168]">Hal. {currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-lg border border-[#D8D0B8] bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#4A4636] hover:bg-[#EFEAD9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
                  Berikutnya →
                </button>
              </div>
            )}
          </div>
          )}
        </div>
      </main>

      {/* FORM MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1F3626]/50 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#FBFAF3] shadow-2xl border border-[#D8D0B8]">
            <div className="border-b border-[#D8D0B8] px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#1F3626]">
                {formMode === 'tambah' ? 'Catat Kelompok Baru' : 'Ubah Catatan Kelompok'}
              </h3>
              <button onClick={() => setFormOpen(false)} className="text-[#8B8168] hover:text-[#20241D] text-xl font-bold leading-none">&times;</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="px-6 py-6 max-h-[60vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                <Field label="Kecamatan">
                  <select value={formValues.kecamatan} onChange={e => setFormValues({...formValues, kecamatan: e.target.value})} className="ktt-input font-medium" required>
                    <option value="">Pilih kecamatan…</option>
                    {KECAMATAN_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </Field>
                <Field label="Desa / Kelurahan">
                  <input type="text" value={formValues.desa} onChange={e => setFormValues({...formValues, desa: e.target.value})} className="ktt-input font-medium" required />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Nama Kelompok Tani">
                    <input type="text" value={formValues.namaKelompok} onChange={e => setFormValues({...formValues, namaKelompok: e.target.value})} className="ktt-input font-bold" required />
                  </Field>
                </div>
                <Field label="Nomor Register">
                  <input type="text" value={formValues.nomorRegister} onChange={e => setFormValues({...formValues, nomorRegister: e.target.value})} className="ktt-input font-mono font-bold uppercase" />
                </Field>
                <Field label="Nama Ketua Kelompok">
                  <input type="text" value={formValues.namaKetuaKelompok} onChange={e => setFormValues({...formValues, namaKetuaKelompok: e.target.value})} className="ktt-input font-medium" required />
                </Field>
                <Field label="Jenis Kelompok">
                  <select value={formValues.jenisKelompok} onChange={e => setFormValues({...formValues, jenisKelompok: e.target.value})} className="ktt-input font-medium" required>
                    <option value="">Pilih kategori…</option>
                    {JENIS_KELOMPOK_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </Field>
                <Field label="Kelas Kelompok">
                  <select value={formValues.kelasKelompok} onChange={e => setFormValues({...formValues, kelasKelompok: e.target.value})} className="ktt-input font-medium">
                    <option value="">Belum diklasifikasi</option>
                    {KELAS_ORDER.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </Field>
                <Field label="Luas Lahan (Ha)">
                  <input type="number" step="0.01" value={formValues.luasLahanHa || ''} onChange={e => setFormValues({...formValues, luasLahanHa: parseFloat(e.target.value) || 0})} className="ktt-input font-mono font-medium" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Anggota Laki-laki">
                    <input type="number" value={formValues.anggotaLaki || ''} onChange={e => setFormValues({...formValues, anggotaLaki: parseInt(e.target.value) || 0})} className="ktt-input font-mono font-medium" />
                  </Field>
                  <Field label="Anggota Perempuan">
                    <input type="number" value={formValues.anggotaPerempuan || ''} onChange={e => setFormValues({...formValues, anggotaPerempuan: parseInt(e.target.value) || 0})} className="ktt-input font-mono font-medium" />
                  </Field>
                </div>
              </div>
              <div className="bg-[#EFEAD9] px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl border-t border-[#D8D0B8]">
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#4A4636] border border-[#D8D0B8] hover:bg-[#F6F3E9] transition-colors">
                  Batal
                </button>
                <button disabled={isSaving} type="submit" className="rounded-lg bg-[#2F4D38] px-6 py-2 text-sm font-bold text-white hover:bg-[#1F3626] disabled:opacity-50 transition-colors shadow-sm">
                  {isSaving ? 'Menyimpan…' : 'Simpan Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1F3626]/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-[#FBFAF3] p-6 text-center shadow-2xl border border-[#D8D0B8]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F6ECE8] text-[#8B4A3A] mb-4">
              <IconAlert />
            </div>
            <h3 className="font-display text-lg font-bold text-[#1F3626] mb-2">Hapus Catatan Kelompok</h3>
            <p className="text-sm text-[#5A5644] font-medium mb-6">
              Data <span className="font-bold text-[#20241D]">{deleteTarget.namaKelompok}</span> akan dihapus permanen dari register. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setDeleteTarget(null)} className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#4A4636] border border-[#D8D0B8] hover:bg-[#F6F3E9] transition-colors shadow-sm">
                Batal
              </button>
              <button onClick={handleDeleteConfirm} className="w-full rounded-lg bg-[#8B4A3A] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#9C5643] transition-colors shadow-sm">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   5. HELPER KOMPONEN FIELD FORM
   ========================================================= */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

/* =========================================================
   6. FONT & STYLE GLOBAL UNTUK SCOPE HALAMAN INI
   ========================================================= */
const fontImports = `
  @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

  .ktt-scope { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
  .ktt-scope .font-display { font-family: 'Zilla Slab', ui-serif, Georgia, serif; }
  .ktt-scope .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
  .ktt-scope .tabular-nums { font-variant-numeric: tabular-nums; }

  .ktt-scope .ktt-input {
    display: block;
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid #D8D0B8;
    background: #FFFFFF;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: #20241D;
    transition: box-shadow 0.15s, border-color 0.15s;
  }
  .ktt-scope .ktt-input:focus {
    outline: none;
    border-color: #2F4D38;
    box-shadow: 0 0 0 3px rgba(47, 77, 56, 0.18);
  }

  @media (prefers-reduced-motion: reduce) {
    .ktt-scope * { transition: none !important; animation: none !important; }
  }
`;