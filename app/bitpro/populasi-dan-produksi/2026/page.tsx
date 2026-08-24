'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { ArrowLeft, Download, Plus, Edit2, Trash2, CheckCircle2, FileSpreadsheet } from 'lucide-react';

const DATA_WILAYAH = {
  AYAH: ['AYAH', 'CANDIRENGGO', 'MANGUNWENI', 'TLOGOSARI', 'KALIBANGKANG', 'WATUKELIR', 'KALIPOH', 'ARGOSARI', 'BANJARARJO', 'ARGOPENI', 'KARANGDUWUR', 'SRATI', 'JINTUNG', 'PASIR', 'JATIJAJAR', 'DEMANGSARI', 'KEDUNGWERU', 'BULUREJO'],
  BUAYAN: ['KARANGBOLONG', 'JLADRI', 'ADIWARNO', 'RANGKAH', 'WONODADI', 'GEBLUG', 'ROGODADI', 'PAKURAN', 'BUAYAN', 'SIKAYU', 'KARANGSARI', 'ROGODONO', 'BANYUMUDAL', 'TUGU', 'NOGORAJI', 'MERGOSONO', 'SEMAMPIR', 'JOGOMULYO', 'PURBOWANGI', 'JATIROTO'],
  PURING: ['TAMBAKMULYO', 'SUROREJAN', 'WALUYOREJO', 'SIDOHARJO', 'PULIHARJO', 'PURWOSARI', 'KRANDEGAN', 'KALENG', 'TUKINGGEDONG', 'PURWOHARJO', 'SITIADI', 'BANJAREJA', 'WETONKULON', 'PESURUHAN', 'WETONWETAN', 'KEDALEMANKULON', 'KEDALEMANWETAN', 'SRUSUHJURUTENGAH', 'BUMIREJO', 'ARJOWINANGUN', 'MADUREJO', 'SIDOBUNDER', 'SIDODADI'],
  PETANAHAN: ['KARANGREJO', 'KARANGGADUNG', 'TEGALRETNO', 'AMPELSARI', 'MUNGGU', 'KEWANGUNAN', 'KARANGDUWUR', 'PETANAHAN', 'KEBONSARI', 'GROGOLPENATUS', 'GROGOLBENINGSARI', 'JOGOMERTAN', 'TANJUNGSARI', 'SIDOMULYO', 'GRUJUGAN', 'KRITIG', 'NAMPUDADI', 'TRESNOREJO', 'PODOURIP', 'JATIMULYO', 'BANJARWINANGUN'],
  KLIRONG: ['JOGOSIMO', 'TANGGULANGIN', 'PANDANLOR', 'TAMBAKPROGATEN', 'GEBANGSARI', 'KLEGENREJO', 'BENDOGARAP', 'KEDUNGSARI', 'JERUKAGUNG', 'KLEGENWONOSARI', 'KLIRONG', 'KALIWUNGU', 'JATIMALANG', 'KARANGGLONGGONG', 'RANTEREJO', 'WOTBUWONO', 'TAMBAKAGUNG', 'SITIREJO', 'GADUNGREJO', 'DOROWATI', 'BUMIHARJO', 'KEBADONGAN', 'PODOLUHUR', 'KEDUNGWINANGUN'],
  BULUSPESANTREN: ['AYAMPUTIH', 'SETROJENAR', 'BRECONG', 'BANJURPASAR', 'INDROSARI', 'BULUSPESANTREN', 'BANJURMUKADAN', 'WALUYO', 'BOCOR', 'MADURETNO', 'AMBALKUMOLO', 'RANTEWRINGIN', 'TAMBAKREJO', 'SANGUBANYU', 'ARJOWINANGUN', 'AMPIH', 'JOGOPATEN', 'KLOPOSAWIT', 'SIDOMORO', 'TANJUNGREJO', 'TANJUNGSARI'],
  AMBAL: ['ENTAK', 'PLEMPUKANKEMBARAN', 'KENOYOJAYAN', 'AMBALRESMI', 'KAIBONPETANGKURAN', 'KAIBON', 'SUMBERJATI', 'BLENGORWETAN', 'BLENGORKULON', 'BENERWETAN', 'BENERKULON', 'AMBALKLIWONAN', 'PASARSENEN', 'PUCANGAN', 'AMBALKEBREK', 'GONDANGLEGI', 'BANJARSARI', 'LAJER', 'SINGOSARI', 'SIDOLUHUR', 'SINUNGREJO', 'AMBARWINANGUN', 'PENEKET', 'SIDOREJO', 'SIDOMULYO', 'SIDOMUKTI', 'PRASUTAN', 'KRADENAN', 'PAGEDANGAN', 'SUROBAYAN', 'DUKUHREJOSARI', 'KEMBANGSAWIT'],
  MIRIT: ['MIRITPETIKUSAN', 'TLOGODEPOK', 'MIRIT', 'TLOGOPRAGOTO', 'LEMBUPURWO', 'WIROMARTAN', 'ROWO', 'SINGOYUDAN', 'WERGONAYAN', 'SELOTUMPENG', 'SITIBENTAR', 'KARANGGEDE', 'KERTODESO', 'PATUKREJOMULYO', 'PATUKGAWEMULYO', 'MANGUNRANAN', 'PEKUTAN', 'WIROGATEN', 'WINONG', 'NGABEAN', 'SARWOGADUNG', 'KRUBUNGAN'],
  BONOROWO: ['PATUKREJO', 'NGASINAN', 'PUJODADI', 'BALOREJO', 'TLOGOREJO', 'ROWOSARI', 'BONOROWO', 'SIRNOBOYO', 'BONJOKKIDUL', 'BONJOKLOR', 'MRENTUL'],
  PREMBUN: ['TERSOBO', 'PREMBUN', 'KABEKELAN', 'TUNGGALROSO', 'KEDUNGWARU', 'BAGUNG', 'SIDOGEDE', 'SEMBIRKADIPATEN', 'KEDUNGBULUS', 'MULYOSRI', 'PESUNINGAN', 'PECARIKAN', 'KABUARAN'],
  PADURESO: ['PEJENGKOLAN', 'BALINGASAL', 'MERDEN', 'KALIJERING', 'KALIGUBUK', 'SIDOTOTO', 'RAHAYU', 'SENDANGDALEM', 'PADURESO'],
  KUTOWINANGUN: ['PEKUNDEN', 'TANJUNGMERU', 'KUWARISAN', 'KUTOWINANGUN', 'LUNDONG', 'MEKARSARI', 'BABADSARI', 'UNGARAN', 'MRINEN', 'PEJAGATAN', 'TRIWARNO', 'KOROWELANG', 'JLEGIWINANGUN', 'LUMBU', 'TANJUNGSARI', 'KALIPUTIH', 'TUNJUNGSETO', 'PESALAKAN', 'KARANGSARI'],
  ALIAN: ['BOJONGSARI', 'SUROTRUNAN', 'KAMBANGSARI', 'JATIMULYO', 'TANUHARJO', 'KARANGTANJUNG', 'KEMANGGUHAN', 'KALIJAYA', 'KARANGKEMBANG', 'SELILING', 'TLOGOWULUNG', 'KALIPUTIH', 'WONOKROMO', 'SAWANGAN', 'KALIRANCANG', 'KRAKAL'],
  PONCOWARNO: ['JATIPURUS', 'LEREPKEBUMEN', 'BLATER', 'PONCOWARNO', 'TEGALREJO', 'JEMBANGAN', 'KEDUNGDOWO', 'KARANGTENGAH', 'TIRTOMOYO', 'SOKA', 'KEBAPANGAN'],
  KEBUMEN: ['MUKTISARI', 'MURTIREJO', 'DEPOKREJO', 'MENGKOWO', 'GESIKAN', 'KALIBAGOR', 'ARGOPENI', 'JATISARI', 'KALIREJO', 'SELANG', 'ADIKARSO', 'TAMANWINANGUN', 'PANJER', 'KEMBARAN', 'SUMBERADI', 'WONOSARI', 'ROWOREJO', 'TANAHSARI', 'BANDUNG', 'CANDIMULYO', 'KALIJIREK', 'CANDIWULAN', 'KAWEDUSAN', 'KEBUMEN', 'KUTOSARI', 'BUMIREJO', 'GEMEKSEKTI', 'KARANGSARI', 'JEMUR'],
  PEJAGOAN: ['LOGEDE', 'KUWAYUHAN', 'KEDAWUNG', 'PEJAGOAN', 'KEBULUSAN', 'ADITIRTO', 'KARANGPOH', 'JEMUR', 'PRIGI', 'KEBAGORAN', 'PENGARINGAN', 'PENIRON', 'WATULAWANG'],
  SRUWENG: ['MENGANTI', 'TRIKARSO', 'SIDOHARJO', 'GIWANGRETNO', 'JABRES', 'SRUWENG', 'KARANGGEDANG', 'PURWODESO', 'KLEPUSANGGAR', 'TANGGERAN', 'KARANGSARI', 'KARANGPULE', 'PAKURAN', 'PENGEMPON', 'KEJAWANG', 'KARANGJAMBU', 'SIDOAGUNG', 'PENUSUPAN', 'DONOSARI', 'PANDANSARI', 'CONDONGCAMPUR'],
  ADIMULYO: ['ADIMULYO', 'ADIKARSO', 'BANYUROTO', 'BONJOK', 'CANDIWULAN', 'CARUBAN', 'JOJOGAN', 'KEMUJAN', 'MANIKEN', 'MELES', 'PEKUNCEN', 'SEKORTEJO', 'SIDOMUKTI', 'SUGIHWARAS', 'TAMBAKHARJO', 'TEGALSARI', 'TEMANGGAL', 'WIJAYAKUSUMA', 'WLAHAR'],
  KUWARASAN: ['BANJARSARI', 'BENDUNGAN', 'GANDUSARI', 'GUMAWANG', 'GUNUNGMUJIL', 'HARJODOWO', 'JATIMULYO', 'KALIPURWO', 'KAMULYAN', 'KUWARASAN', 'KUWARU', 'LEMBUKARA', 'MADURESO', 'MANGUNSARI', 'PONDOKGEBANG', 'PURWODADI', 'SAWANGAN', 'SERUT', 'SIDOMUKTI', 'TAMBAKSMULYO', 'WONOYOSO', 'PURWOKERTO'],
  ROWOKELE: ['BUMIAGUNG', 'GHATAK', 'JATILUHUR', 'KALISARI', 'KARANGGAYAM', 'KRETEK', 'PRINGTUTUL', 'REDIN', 'ROWOKELE', 'SUKORAHAYU', 'WAGIRPANDAN', 'WONOHARJO'],
  SEMPOR: ['BEJIRAHAYU', 'BONOSARI', 'DONOREJO', 'JATINEGARA', 'KEDUNGWADAS', 'KEDUNGWRINGIN', 'PEKUNCEN', 'SAMPIREJO', 'SEMPOR', 'SIDOHARJO', 'SOMAGEDE', 'TUNJUNGSETO'],
  GOMBONG: ['BANJARSARI', 'KALITENGAH', 'KEDUNGPUJI', 'KLOPOGODO', 'KEMUKUS', 'PATEMON', 'SEMANDING', 'SEMMAWUR', 'WONOKRIYO', 'WONOSIGRO', 'GOMBONG'],
  KARANGANYAR: ['CANDI', 'GIRIPURNO', 'GRENGGENG', 'JATILUHUR', 'KARANGKEMIRI', 'PANINGKABAN', 'PLARANGAN', 'POKOR', 'SIDOMULYO', 'WONOREJO', 'KARANGANYAR'],
  KARANGGAYAM: ['BINANGUN', 'CLAPAR', 'GUNUNGGELAP', 'GUNTUR', 'KALIBENING', 'KALIREJO', 'KARANGGAYAM', 'KARANGMOJO', 'KARANGREJO', 'KARANGTENGAH', 'KEBAK', 'LOGANDU', 'PAGEBANGAN', 'PENIMBUN', 'SELOHARJO', 'WONOTIRTO'],
  SADANG: ['CANGKRING', 'KEDUNGGONG', 'PUCANGAN', 'SADANGKULON', 'SADANGWETAN', 'SEBORO', 'WONOSARI'],
  KARANGSAMBUNG: ['BANIORO', 'KALIGENDING', 'KALISANA', 'KARANGSAMBUNG', 'LANGSE', 'PENCIL', 'PLUMBON', 'PUJOTIRTO', 'SELING', 'TLEPOK', 'TOTOGAN', 'WADASMALANG', 'WIDORO'],
};

const HEADERS = [
  'AJ Sapi', 'AB Sapi', 'MJ Sapi', 'MB Sapi', 'DJ Sapi', 'DB Sapi', 'Total Sapi Potong',
  'AJ Perah', 'AB Perah', 'MJ Perah', 'MB Perah', 'DJ Perah', 'DB Perah', 'Total Sapi Perah',
  'AJ Kerbau', 'AB Kerbau', 'MJ Kerbau', 'MB Kerbau', 'DJ Kerbau', 'DB Kerbau', 'Total Kerbau',
  'AJ Kuda', 'AB Kuda', 'MJ Kuda', 'MB Kuda', 'DJ Kuda', 'DB Kuda', 'Total Kuda',
  'AJ Kambing', 'AB Kambing', 'MJ Kambing', 'MB Kambing', 'DJ Kambing', 'DB Kambing', 'Total Kambing',
  'AJ Domba', 'AB Domba', 'MJ Domba', 'MB Domba', 'DJ Domba', 'DB Domba', 'Total Domba',
  'AJ Babi', 'AB Babi', 'MJ Babi', 'MB Babi', 'DJ Babi', 'DB Babi', 'Total Babi',
  'Ayam Kampung', 'Ayam Petelur', 'Ayam Broiler', 'Puyuh', 'Itik', 'Entog', 'Angsa', 'Merpati',
  'Kelinci Jantan', 'Kelinci Betina',
];

export default function InputPopulasi2026() {
  const [tw, setTw] = useState('TW 1');
  const [kec, setKec] = useState('');
  const [desa, setDesa] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [savedData, setSavedData] = useState<any[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kec || !desa) {
      alert('Pilih Kecamatan & Desa terlebih dahulu!');
      return;
    }
    if (editIdx !== null) {
      const data = [...savedData];
      data[editIdx] = { tw, kec, desa, values };
      setSavedData(data);
      setEditIdx(null);
    } else {
      setSavedData([...savedData, { tw, kec, desa, values }]);
    }
    setValues({});
  };

  const handleEdit = (idx: number) => {
    const d = savedData[idx];
    setTw(d.tw);
    setKec(d.kec);
    setDesa(d.desa);
    setValues(d.values);
    setEditIdx(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (idx: number) => {
    if (confirm('Hapus entri desa ini?')) {
      setSavedData(savedData.filter((_, i) => i !== idx));
    }
  };

  const handleDownload = () => {
    if (savedData.length === 0) return alert('Belum ada data untuk diexport.');
    const data = savedData.map((d, i) => ({
      No: i + 1,
      TW: d.tw,
      Kecamatan: d.kec,
      Desa: d.desa,
      ...d.values,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DataPopulasi2026');
    XLSX.writeFile(wb, `Populasi_2026_${tw}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-azure selection:text-white pb-20">
      
      {/* ── TOP HEADER ── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/bitpro/populasi-dan-produksi"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Kembali ke Menu Populasi"
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
                  Populasi
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-azure">Tahun 2026</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Input Data Populasi Ternak Tahun 2026
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download size={15} />
              <span>Export Excel</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Entry Form */}
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="font-bold text-base text-slate-900">
              {editIdx !== null ? 'Edit Data Sensus Desa ✏️' : 'Formulir Input Sensus Per Desa'}
            </h2>
            <span className="text-xs font-mono text-slate-500">Periode Berjalan 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                Triwulan (TW)
              </label>
              <select
                value={tw}
                onChange={(e) => setTw(e.target.value)}
                className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
              >
                <option>TW 1</option>
                <option>TW 2</option>
                <option>TW 3</option>
                <option>TW 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                Kecamatan
              </label>
              <select
                value={kec}
                onChange={(e) => {
                  setKec(e.target.value);
                  setDesa('');
                }}
                className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none"
              >
                <option value="">Pilih Kecamatan</option>
                {Object.keys(DATA_WILAYAH).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                Desa
              </label>
              <select
                value={desa}
                onChange={(e) => setDesa(e.target.value)}
                disabled={!kec}
                className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure outline-none disabled:opacity-50"
              >
                <option value="">{kec ? 'Pilih Desa' : 'Pilih Kecamatan Dulu'}</option>
                {kec &&
                  DATA_WILAYAH[kec as keyof typeof DATA_WILAYAH].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Grid of 60 commodity numerical inputs */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2">
              Isi Nilai Sensus (60 Kolom Komoditas)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
              {HEADERS.map((h) => (
                <div key={h} className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-600 block truncate" title={h}>
                    {h}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={values[h] || ''}
                    onChange={(e) => setValues({ ...values, [h]: e.target.value })}
                    className="w-full min-h-touch h-9 px-2.5 rounded-lg border border-slate-200 bg-white font-mono font-bold text-xs text-slate-900 text-right focus:border-azure outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="min-h-touch h-11 px-6 rounded-xl bg-azure text-white text-xs font-bold shadow-sm hover:bg-azure/90 active:scale-95 transition-all"
            >
              {editIdx !== null ? 'Perbarui Data Desa' : 'Simpan Data Desa'}
            </button>
          </div>
        </form>

        {/* Staged Data Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-sm text-slate-900">
              Data Siap Export ({savedData.length} Desa Terisi)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5 w-16">TW</th>
                  <th className="p-3.5">KECAMATAN</th>
                  <th className="p-3.5">DESA</th>
                  <th className="p-3.5">RINCIAN DATA</th>
                  <th className="p-3.5 text-center w-24">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {savedData.length > 0 ? (
                  savedData.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono text-xs font-semibold">{d.tw}</td>
                      <td className="p-3.5 font-bold text-slate-900">{d.kec}</td>
                      <td className="p-3.5 text-slate-700">{d.desa}</td>
                      <td className="p-3.5 font-mono text-xs text-slate-600 max-w-md truncate">
                        {Object.entries(d.values)
                          .filter(([_, v]) => v && v !== '0')
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ') || 'Semua 0'}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(i)}
                            className="min-h-touch h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center"
                            aria-label="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(i)}
                            className="min-h-touch h-8 w-8 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                            aria-label="Hapus"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-sm font-medium">
                      Belum ada data desa yang diinput untuk tahun 2026.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

    </div>
  );
}
