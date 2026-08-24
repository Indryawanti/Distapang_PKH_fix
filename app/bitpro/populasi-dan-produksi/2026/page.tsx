'use client';
import { useState } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

const DATA_WILAYAH = {
  AYAH: [
    'AYAH',
    'CANDIRENGGO',
    'MANGUNWENI',
    'TLOGOSARI',
    'KALIBANGKANG',
    'WATUKELIR',
    'KALIPOH',
    'ARGOSARI',
    'BANJARARJO',
    'ARGOPENI',
    'KARANGDUWUR',
    'SRATI',
    'JINTUNG',
    'PASIR',
    'JATIJAJAR',
    'DEMANGSARI',
    'KEDUNGWERU',
    'BULUREJO',
  ],
  BUAYAN: [
    'KARANGBOLONG',
    'JLADRI',
    'ADIWARNO',
    'RANGKAH',
    'WONODADI',
    'GEBLUG',
    'ROGODADI',
    'PAKURAN',
    'BUAYAN',
    'SIKAYU',
    'KARANGSARI',
    'ROGODONO',
    'BANYUMUDAL',
    'TUGU',
    'NOGORAJI',
    'MERGOSONO',
    'SEMAMPIR',
    'JOGOMULYO',
    'PURBOWANGI',
    'JATIROTO',
  ],
  PURING: [
    'TAMBAKMULYO',
    'SUROREJAN',
    'WALUYOREJO',
    'SIDOHARJO',
    'PULIHARJO',
    'PURWOSARI',
    'KRANDEGAN',
    'KALENG',
    'TUKINGGEDONG',
    'PURWOHARJO',
    'SITIADI',
    'BANJAREJA',
    'WETONKULON',
    'PESURUHAN',
    'WETONWETAN',
    'KEDALEMANKULON',
    'KEDALEMANWETAN',
    'SRUSUHJURUTENGAH',
    'BUMIREJO',
    'ARJOWINANGUN',
    'MADUREJO',
    'SIDOBUNDER',
    'SIDODADI',
  ],
  PETANAHAN: [
    'KARANGREJO',
    'KARANGGADUNG',
    'TEGALRETNO',
    'AMPELSARI',
    'MUNGGU',
    'KEWANGUNAN',
    'KARANGDUWUR',
    'PETANAHAN',
    'KEBONSARI',
    'GROGOLPENATUS',
    'GROGOLBENINGSARI',
    'JOGOMERTAN',
    'TANJUNGSARI',
    'SIDOMULYO',
    'GRUJUGAN',
    'KRITIG',
    'NAMPUDADI',
    'TRESNOREJO',
    'PODOURIP',
    'JATIMULYO',
    'BANJARWINANGUN',
  ],
  KLIRONG: [
    'JOGOSIMO',
    'TANGGULANGIN',
    'PANDANLOR',
    'TAMBAKPROGATEN',
    'GEBANGSARI',
    'KLEGENREJO',
    'BENDOGARAP',
    'KEDUNGSARI',
    'JERUKAGUNG',
    'KLEGENWONOSARI',
    'KLIRONG',
    'KALIWUNGU',
    'JATIMALANG',
    'KARANGGLONGGONG',
    'RANTEREJO',
    'WOTBUWONO',
    'TAMBAKAGUNG',
    'SITIREJO',
    'GADUNGREJO',
    'DOROWATI',
    'BUMIHARJO',
    'KEBADONGAN',
    'PODOLUHUR',
    'KEDUNGWINANGUN',
  ],
  BULUSPESANTREN: [
    'AYAMPUTIH',
    'SETROJENAR',
    'BRECONG',
    'BANJURPASAR',
    'INDROSARI',
    'BULUSPESANTREN',
    'BANJURMUKADAN',
    'WALUYO',
    'BOCOR',
    'MADURETNO',
    'AMBALKUMOLO',
    'RANTEWRINGIN',
    'TAMBAKREJO',
    'SANGUBANYU',
    'ARJOWINANGUN',
    'AMPIH',
    'JOGOPATEN',
    'KLOPOSAWIT',
    'SIDOMORO',
    'TANJUNGREJO',
    'TANJUNGSARI',
  ],
  AMBAL: [
    'ENTAK',
    'PLEMPUKANKEMBARAN',
    'KENOYOJAYAN',
    'AMBALRESMI',
    'KAIBONPETANGKURAN',
    'KAIBON',
    'SUMBERJATI',
    'BLENGORWETAN',
    'BLENGORKULON',
    'BENERWETAN',
    'BENERKULON',
    'AMBALKLIWONAN',
    'PASARSENEN',
    'PUCANGAN',
    'AMBALKEBREK',
    'GONDANGLEGI',
    'BANJARSARI',
    'LAJER',
    'SINGOSARI',
    'SIDOLUHUR',
    'SINUNGREJO',
    'AMBARWINANGUN',
    'PENEKET',
    'SIDOREJO',
    'SIDOMULYO',
    'SIDOMUKTI',
    'PRASUTAN',
    'KRADENAN',
    'PAGEDANGAN',
    'SUROBAYAN',
    'DUKUHREJOSARI',
    'KEMBANGSAWIT',
  ],
  MIRIT: [
    'MIRITPETIKUSAN',
    'TLOGODEPOK',
    'MIRIT',
    'TLOGOPRAGOTO',
    'LEMBUPURWO',
    'WIROMARTAN',
    'ROWO',
    'SINGOYUDAN',
    'WERGONAYAN',
    'SELOTUMPENG',
    'SITIBENTAR',
    'KARANGGEDE',
    'KERTODESO',
    'PATUKREJOMULYO',
    'PATUKGAWEMULYO',
    'MANGUNRANAN',
    'PEKUTAN',
    'WIROGATEN',
    'WINONG',
    'NGABEAN',
    'SARWOGADUNG',
    'KRUBUNGAN',
  ],
  BONOROWO: [
    'PATUKREJO',
    'NGASINAN',
    'PUJODADI',
    'BALOREJO',
    'TLOGOREJO',
    'ROWOSARI',
    'BONOROWO',
    'SIRNOBOYO',
    'BONJOKKIDUL',
    'BONJOKLOR',
    'MRENTUL',
  ],
  PREMBUN: [
    'TERSOBO',
    'PREMBUN',
    'KABEKELAN',
    'TUNGGALROSO',
    'KEDUNGWARU',
    'BAGUNG',
    'SIDOGEDE',
    'SEMBIRKADIPATEN',
    'KEDUNGBULUS',
    'MULYOSRI',
    'PESUNINGAN',
    'PECARIKAN',
    'KABUARAN',
  ],
  PADURESO: [
    'PEJENGKOLAN',
    'BALINGASAL',
    'MERDEN',
    'KALIJERING',
    'KALIGUBUK',
    'SIDOTOTO',
    'RAHAYU',
    'SENDANGDALEM',
    'PADURESO',
  ],
  KUTOWINANGUN: [
    'PEKUNDEN',
    'TANJUNGMERU',
    'KUWARISAN',
    'KUTOWINANGUN',
    'LUNDONG',
    'MEKARSARI',
    'BABADSARI',
    'UNGARAN',
    'MRINEN',
    'PEJAGATAN',
    'TRIWARNO',
    'KOROWELANG',
    'JLEGIWINANGUN',
    'LUMBU',
    'TANJUNGSARI',
    'KALIPUTIH',
    'TUNJUNGSETO',
    'PESALAKAN',
    'KARANGSARI',
  ],
  ALIAN: [
    'BOJONGSARI',
    'SUROTRUNAN',
    'KAMBANGSARI',
    'JATIMULYO',
    'TANUHARJO',
    'KARANGTANJUNG',
    'KEMANGGUHAN',
    'KALIJAYA',
    'KARANGKEMBANG',
    'SELILING',
    'TLOGOWULUNG',
    'KALIPUTIH',
    'WONOKROMO',
    'SAWANGAN',
    'KALIRANCANG',
    'KRAKAL',
  ],
  PONCOWARNO: [
    'JATIPURUS',
    'LEREPKEBUMEN',
    'BLATER',
    'PONCOWARNO',
    'TEGALREJO',
    'JEMBANGAN',
    'KEDUNGDOWO',
    'KARANGTENGAH',
    'TIRTOMOYO',
    'SOKA',
    'KEBAPANGAN',
  ],
  KEBUMEN: [
    'MUKTISARI',
    'MURTIREJO',
    'DEPOKREJO',
    'MENGKOWO',
    'GESIKAN',
    'KALIBAGOR',
    'ARGOPENI',
    'JATISARI',
    'KALIREJO',
    'SELANG',
    'ADIKARSO',
    'TAMANWINANGUN',
    'PANJER',
    'KEMBARAN',
    'SUMBERADI',
    'WONOSARI',
    'ROWOREJO',
    'TANAHSARI',
    'BANDUNG',
    'CANDIMULYO',
    'KALIJIREK',
    'CANDIWULAN',
    'KAWEDUSAN',
    'KEBUMEN',
    'KUTOSARI',
    'BUMIREJO',
    'GEMEKSEKTI',
    'KARANGSARI',
    'JEMUR',
  ],
  PEJAGOAN: [
    'LOGEDE',
    'KUWAYUHAN',
    'KEDAWUNG',
    'PEJAGOAN',
    'KEBULUSAN',
    'ADITIRTO',
    'KARANGPOH',
    'JEMUR',
    'PRIGI',
    'KEBAGORAN',
    'PENGARINGAN',
    'PENIRON',
    'WATULAWANG',
  ],
  SRUWENG: [
    'MENGANTI',
    'TRIKARSO',
    'SIDOHARJO',
    'GIWANGRETNO',
    'JABRES',
    'SRUWENG',
    'KARANGGEDANG',
    'PURWODESO',
    'KLEPUSANGGAR',
    'TANGGERAN',
    'KARANGSARI',
    'KARANGPULE',
    'PAKURAN',
    'PENGEMPON',
    'KEJAWANG',
    'KARANGJAMBU',
    'SIDOAGUNG',
    'PENUSUPAN',
    'DONOSARI',
    'PANDANSARI',
    'CONDONGCAMPUR',
  ],
  KARANGSAMBUNG: [
    'WIDORO',
    'SELING',
    'KEDUNGWARU',
    'PENCIL',
    'KALIGENDING',
    'PLUMBON',
    'PUJOTIRTO',
    'WADASMALANG',
    'TLEPOK',
    'KALISANA',
    'LANGSE',
    'BANIORO',
    'KARANGSAMBUNG',
    'TOTOGAN',
  ],
  SADANG: [
    'PUCANGAN',
    'SEBORO',
    'WONOSARI',
    'SADANGKULON',
    'CANGKRING',
    'SADANGWETAN',
    'KEDUNGGONG',
  ],
};

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
      alert('Pilih Kecamatan & Desa!');
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
    if (confirm('Hapus desa ini?'))
      setSavedData(savedData.filter((_, i) => i !== idx));
  };

  const handleDownload = () => {
    const data = savedData.map((d, i) => ({
      No: i + 1,
      TW: d.tw,
      Kec: d.kec,
      Desa: d.desa,
      ...d.values,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data2026');
    XLSX.writeFile(wb, `Populasi_2026_${tw}.xlsx`);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen text-gray-900" style={{background:'linear-gradient(135deg,#052e16 0%,#064e3b 40%,#065f46 100%)'}}>
      <Link
        href="/bitpro/populasi-dan-produksi"
        className="text-emerald-300 hover:text-white font-bold block mb-4 text-lg transition-colors"
      >
        ← Kembali
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-white">Input Populasi 2026</h1>
        <button
          onClick={handleDownload}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-emerald-700"
        >
          📥 Export Excel
        </button>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-2xl shadow-lg border mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={tw}
            onChange={(e) => setTw(e.target.value)}
            className="p-4 border rounded-xl text-lg text-gray-900 bg-white font-bold"
          >
            <option>TW 1</option>
            <option>TW 2</option>
            <option>TW 3</option>
            <option>TW 4</option>
          </select>
          <select
            value={kec}
            onChange={(e) => {
              setKec(e.target.value);
              setDesa('');
            }}
            className="p-4 border rounded-xl text-lg text-gray-900 bg-white font-bold"
          >
            <option value="">Pilih Kecamatan</option>
            {Object.keys(DATA_WILAYAH).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <select
            value={desa}
            onChange={(e) => setDesa(e.target.value)}
            className="p-4 border rounded-xl text-lg text-gray-900 bg-white font-bold"
          >
            <option value="">{kec ? 'Pilih Desa' : 'Pilih Kecamatan'}</option>
            {kec &&
              DATA_WILAYAH[kec as keyof typeof DATA_WILAYAH].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 h-80 overflow-y-auto p-4 bg-gray-100 border rounded-xl">
          {HEADERS.map((h) => (
            <div key={h}>
              <label className="text-[11px] font-bold uppercase text-gray-700">
                {h}
              </label>
              <input
                type="number"
                value={values[h] || ''}
                onChange={(e) => setValues({ ...values, [h]: e.target.value })}
                className="w-full p-2 border rounded text-lg font-bold text-gray-900 bg-white"
                placeholder="0"
              />
            </div>
          ))}
        </div>
        <button className="w-full mt-6 bg-purple-800 text-white py-4 rounded-xl font-bold text-xl">
          {editIdx !== null ? 'UPDATE DATA' : 'SIMPAN DATA'}
        </button>
      </form>

      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <h2 className="font-bold mb-4 text-xl">
          Data Siap Export ({savedData.length} Desa)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-base border-collapse">
            <thead className="bg-gray-200 text-gray-900 font-bold">
              <tr>
                <th className="p-3 border">TW</th>
                <th className="p-3 border">Kecamatan</th>
                <th className="p-3 border">Desa</th>
                <th className="p-3 border">Isi Data</th>
                <th className="p-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {savedData.map((d, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3 border">{d.tw}</td>
                  <td className="p-3 border">{d.kec}</td>
                  <td className="p-3 border">{d.desa}</td>
                  <td className="p-3 border font-medium text-sm">
                    {Object.entries(d.values)
                      .filter(([_, v]) => v && v !== '0')
                      .map(([k, v]) => `${k}:${v}`)
                      .join(', ')}
                  </td>
                  <td className="p-3 border flex gap-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="text-blue-600 font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="text-red-600 font-bold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
