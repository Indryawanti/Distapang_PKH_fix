'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

// --- DATA & TIPE ---
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
  KARANGSAMBUNG: ['WIDORO', 'SELING', 'KEDUNGWARU', 'PENCIL', 'KALIGENDING', 'PLUMBON', 'PUJOTIRTO', 'WADASMALANG', 'TLEPOK', 'KALISANA', 'LANGSE', 'BANIORO', 'KARANGSAMBUNG', 'TOTOGAN'],
  SADANG: ['PUCANGAN', 'SEBORO', 'WONOSARI', 'SADANGKULON', 'CANGKRING', 'SADANGWETAN', 'KEDUNGGONG'],
};

// SUDAH DITAMBAHKAN TAHUN 2026 DI SINI
const DAFTAR_TAHUN = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'];
const DAFTAR_JENIS_TERNAK = ['Sapi', 'Kambing', 'Domba', 'Ayam KUB', 'Ayam Petelur'];

const getEmojiJenis = (jenis: string) => {
  if (jenis.includes('Sapi')) return '🐄';
  if (jenis.includes('Kambing')) return '🐐';
  if (jenis.includes('Domba')) return '🐑';
  if (jenis.includes('Ayam')) return '🐔';
  return '📍';
};

const buatNamaFileFoto = (namaKtt: string, id: string | number) => {
  const namaAman = (namaKtt || 'monev').trim().replace(/[^a-zA-Z0-9]+/g, '_');
  return `foto-${namaAman}-${id}.jpg`;
};

type SavedFileData = { fileName: string; htmlTable: string };
type StatusBA = 'Ada' | 'Tidak';

const KONDISI_KOSONG = {
  awalJantan: 0, awalBetina: 0, matiBangkaiJantan: 0, matiBangkaiBetina: 0, matiBangkaiBA: 'Tidak' as StatusBA,
  matiPotongJantan: 0, matiPotongBetina: 0, matiPotongBA: 'Tidak' as StatusBA, jualJantan: 0, jualBetina: 0,
  jualBA: 'Tidak' as StatusBA, beliJantan: 0, beliBetina: 0, lahirJantan: 0, lahirBetina: 0,
  matiAnakJantan: 0, matiAnakBetina: 0, jualAnakJantan: 0, jualAnakBetina: 0,
};
type KondisiTernak = typeof KONDISI_KOSONG;

function hitungKondisi(k: KondisiTernak) {
  const a = (k.awalJantan || 0) + (k.awalBetina || 0);
  const bJantan = (k.matiBangkaiJantan || 0) + (k.matiPotongJantan || 0);
  const bBetina = (k.matiBangkaiBetina || 0) + (k.matiPotongBetina || 0);
  const b = bJantan + bBetina;
  const c = (k.jualJantan || 0) + (k.jualBetina || 0);
  const d = (k.beliJantan || 0) + (k.beliBetina || 0);
  const e = a - b - c + d;
  const f = (k.lahirJantan || 0) + (k.lahirBetina || 0);
  const g = (k.matiAnakJantan || 0) + (k.matiAnakBetina || 0);
  const h = (k.jualAnakJantan || 0) + (k.jualAnakBetina || 0);
  const i = e + f - g - h;
  return { a, b, c, d, e, f, g, h, i };
}

function migrasiKondisi(raw: any): KondisiTernak {
  if (raw && typeof raw === 'object' && 'awalJantan' in raw) {
    return { ...KONDISI_KOSONG, ...raw };
  }
  return { ...KONDISI_KOSONG, awalJantan: Number(raw?.jantan) || 0, awalBetina: Number(raw?.betina) || 0 };
}

type FieldData = {
  id: string; tahun: string; kec: string; desa: string; namaKtt: string;
  alamat: string; kegiatan: string; jenis: string; waktuMonev: string;
  kondisi: KondisiTernak; lat: number | null; lng: number | null;
  photo: string | null; catatan: string;
};

// DEFAULT TAHUN 2026
const FORM_KOSONG = {
  tahun: '2026', kec: '', desa: '', ktt: '', alamat: '', kegiatan: '', jenis: 'Sapi',
  waktuMonev: '', photo: null as string | null, lat: null as number | null, lng: null as number | null, catatan: '',
};

function BarisTernak({ label, jantan, betina, onJantan, onBetina, showBA = false, ba, onBA }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label className="text-xs font-bold text-gray-600">{label} — Jantan (ekor)</label>
        <input type="number" min={0} value={jantan} onChange={(e) => onJantan(Number(e.target.value))} className="w-full p-2 mt-1 border rounded bg-white font-bold text-center" />
      </div>
      <div>
        <label className="text-xs font-bold text-gray-600">{label} — Betina (ekor)</label>
        <input type="number" min={0} value={betina} onChange={(e) => onBetina(Number(e.target.value))} className="w-full p-2 mt-1 border rounded bg-white font-bold text-center" />
      </div>
      {showBA && (
        <div>
          <label className="text-xs font-bold text-gray-600">Berita Acara (BA)</label>
          <select value={ba} onChange={(e) => onBA?.(e.target.value)} className="w-full p-2 mt-1 border rounded bg-white font-bold">
            <option value="Tidak">Tidak Ada</option>
            <option value="Ada">Ada</option>
          </select>
        </div>
      )}
    </div>
  );
}

function KondisiSection({ nomor, title, children, total, totalLabel }: any) {
  return (
    <div className="bg-green-50 p-5 rounded-xl border border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-700 text-white font-black text-sm shrink-0">{nomor}</span>
        <h4 className="font-bold text-green-800">{title}</h4>
      </div>
      <div className="space-y-3">{children}</div>
      {total !== undefined && (
        <div className="mt-3 text-right text-sm font-bold text-green-900 bg-white/60 rounded-lg py-2 px-3">
          {totalLabel}: <span className="text-base">{total} ekor</span>
        </div>
      )}
    </div>
  );
}

export default function MonevKTT() {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // DEFAULT TAHUN 2026
  const [tahunExcel, setTahunExcel] = useState('2026');
  const [savedFiles, setSavedFiles] = useState<Record<string, SavedFileData>>({});
  const [dbLapangan, setDbLapangan] = useState<FieldData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Form Lapangan
  const [formTahun, setFormTahun] = useState(FORM_KOSONG.tahun);
  const [formKec, setFormKec] = useState(FORM_KOSONG.kec);
  const [formDesa, setFormDesa] = useState(FORM_KOSONG.desa);
  const [formKtt, setFormKtt] = useState(FORM_KOSONG.ktt);
  const [formAlamat, setFormAlamat] = useState(FORM_KOSONG.alamat);
  const [formKegiatan, setFormKegiatan] = useState(FORM_KOSONG.kegiatan);
  const [formJenis, setFormJenis] = useState(FORM_KOSONG.jenis);
  const [formWaktuMonev, setFormWaktuMonev] = useState(FORM_KOSONG.waktuMonev);
  const [formPhoto, setFormPhoto] = useState<string | null>(FORM_KOSONG.photo);
  const [formLat, setFormLat] = useState<number | null>(FORM_KOSONG.lat);
  const [formLng, setFormLng] = useState<number | null>(FORM_KOSONG.lng);
  const [formCatatan, setFormCatatan] = useState(FORM_KOSONG.catatan);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [formKondisi, setFormKondisi] = useState<KondisiTernak>({ ...KONDISI_KOSONG });
  const updateKondisi = (field: keyof KondisiTernak, value: any) => { setFormKondisi((prev) => ({ ...prev, [field]: value })); };
  const kalkulasi = hitungKondisi(formKondisi);

  const [editingId, setEditingId] = useState<string | null>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // State Kamera
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // 1. Ambil data dari Database MySQL
  const fetchDatabase = async () => {
    try {
      // Ambil Excel
      const resExcel = await fetch('/api/monev-excel');
      const dataExcel = await resExcel.json();
      const formatExcel: Record<string, SavedFileData> = {};
      dataExcel.forEach((d: any) => {
        formatExcel[d.tahun] = { fileName: d.file_name, htmlTable: d.html_table };
      });
      setSavedFiles(formatExcel);

      // Ambil Lapangan
      const resLap = await fetch('/api/monev-lapangan');
      const dataLap = await resLap.json();
      const formatLap = dataLap.map((d: any) => ({
        id: d.id,
        tahun: d.tahun,
        kec: d.kec,
        desa: d.desa,
        namaKtt: d.namaKtt,
        alamat: d.alamat || '',
        kegiatan: d.kegiatan,
        jenis: d.jenis,
        waktuMonev: d.waktuMonev || '',
        kondisi: migrasiKondisi(typeof d.kondisi === 'string' ? JSON.parse(d.kondisi) : d.kondisi),
        lat: d.lat,
        lng: d.lng,
        photo: d.photo,
        catatan: d.catatan || ''
      }));
      setDbLapangan(formatLap);
    } catch (err) { console.error('Gagal mengambil database', err); }
  };

  useEffect(() => {
    setIsClient(true);
    fetchDatabase();

    if (typeof window !== 'undefined' && !(window as any).L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setLeafletLoaded(true);
      document.head.appendChild(script);
    } else {
      setLeafletLoaded(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Peta (Leaflet)
  useEffect(() => {
    if (!leafletLoaded || !isClient) return;
    const L = (window as any).L;
    const mapContainer = document.getElementById('map-dashboard');
    if (mapContainer && !mapInstanceRef.current) {
      const map = L.map('map-dashboard').setView([-7.668, 109.651], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }
  }, [leafletLoaded, isClient]);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const L = (window as any).L;
    markersLayerRef.current.clearLayers();
    const bounds: [number, number][] = [];

    dbLapangan.forEach((data) => {
      if (data.lat && data.lng) {
        const emoji = getEmojiJenis(data.jenis);
        const totalAset = hitungKondisi(data.kondisi).i;
        const icon = L.divIcon({
          html: `<div style="background:#047857;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.35);">${emoji}</div>`,
          className: '', iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -17],
        });
        const marker = L.marker([data.lat, data.lng], { icon });
        marker.bindPopup(`
          <div style="text-align:center;">
            <b style="color:#047857; font-size:14px;">${emoji} ${data.namaKtt}</b><br/>
            ${data.kegiatan}<br/><i>${data.desa}, ${data.kec}</i><br/>
            <b>Total Aset Saat Ini: ${totalAset} ${data.jenis}</b>
            ${data.catatan ? `<br/><span style="font-size:11px;color:#555;">Catatan: ${data.catatan}</span>` : ''}
            ${data.photo ? `<br/><img src="${data.photo}" style="width:100px; height:70px; object-fit:cover; margin-top:5px; border-radius:5px;" /><br/><a href="${data.photo}" download="foto-${data.namaKtt}-${data.id}.jpg" style="font-size:11px;color:#2563eb;font-weight:bold;">⬇️ Download Foto</a>` : ''}
          </div>
        `);
        marker.addTo(markersLayerRef.current);
        bounds.push([data.lat, data.lng]);
      }
    });
    if (bounds.length > 0) mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [dbLapangan, leafletLoaded]);

  // FUNGSI BARU: Intercept Click untuk Cek Password Saat Edit File Excel
  const handleExcelClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const activeExcel = savedFiles[String(tahunExcel)];
    // Jika file sudah ada, cegah upload langsung dan minta password
    if (activeExcel) {
      const password = window.prompt("Data sudah ada. Masukkan password untuk mengedit/menimpa file Excel ini:");
      if (password !== "12345") {
        e.preventDefault(); // Menggagalkan jendela file manager terbuka
        alert("Password salah! Akses ditolak.");
      }
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      let html = XLSX.utils.sheet_to_html(ws).replace(/<html>|<head>|<\/head>|<body>|<\/body>|<\/html>/gi, '');
      
      setSavedFiles((prev) => ({ ...prev, [String(tahunExcel)]: { fileName: file.name, htmlTable: html } }));
      
      // Simpan Ke MySQL
      try {
        await fetch('/api/monev-excel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tahun: tahunExcel, fileName: file.name, htmlTable: html })
        });
        alert(`File Excel ${tahunExcel} berhasil di-upload ke Database!`);
      } catch (error) {
        alert('Gagal menyimpan file Excel ke database.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // FUNGSI BARU: Hapus Excel Dengan Password
  const handleDeleteExcel = async () => {
    const password = window.prompt("Masukkan password untuk menghapus file Excel ini:");
    if (password !== "12345") {
      alert("Password salah! Penghapusan dibatalkan.");
      return;
    }

    if (!window.confirm(`Yakin ingin menghapus rekap Excel tahun ${tahunExcel}?`)) return;

    try {
      await fetch(`/api/monev-excel?tahun=${tahunExcel}`, {
        method: 'DELETE',
      });
      
      setSavedFiles((prev) => {
        const newState = { ...prev };
        delete newState[tahunExcel];
        return newState;
      });

      alert(`File Excel tahun ${tahunExcel} berhasil dihapus!`);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus file Excel dari database.");
    }
  };

  const handleDownloadDashboard = () => {
    if (dbLapangan.length === 0) return alert('Belum ada data lapangan untuk diunduh.');
    const dataUrut = [...dbLapangan].sort((a, b) => a.kec.localeCompare(b.kec));
    const rows = dataUrut.map((d) => {
      const k = d.kondisi; const h = hitungKondisi(k);
      return {
        'Tahun Bantuan': d.tahun, Kecamatan: d.kec, Desa: d.desa, 'Nama KTT': d.namaKtt,
        Alamat: d.alamat || '', 'Nama Kegiatan/TA': d.kegiatan, 'Jenis Komoditas Ternak': d.jenis,
        'Waktu Monev': d.waktuMonev || '', 'Awal - Jantan': k.awalJantan, 'Awal - Betina': k.awalBetina,
        'Total Awal (a)': h.a, 'Mati Bangkai - Jantan': k.matiBangkaiJantan, 'Mati Bangkai - Betina': k.matiBangkaiBetina,
        'Mati Bangkai - BA': k.matiBangkaiBA, 'Mati Potong Paksa - Jantan': k.matiPotongJantan, 'Mati Potong Paksa - Betina': k.matiPotongBetina,
        'Mati Potong Paksa - BA': k.matiPotongBA, 'Total Mati Ternak Pokok (b)': h.b, 'Penjualan - Jantan': k.jualJantan,
        'Penjualan - Betina': k.jualBetina, 'Penjualan - BA': k.jualBA, 'Total Terjual (c)': h.c, 'Pembelian - Jantan': k.beliJantan,
        'Pembelian - Betina': k.beliBetina, 'Total Dibeli (d)': h.d, 'Sisa Ternak Pokok (e)': h.e, 'Kelahiran Anak - Jantan': k.lahirJantan,
        'Kelahiran Anak - Betina': k.lahirBetina, 'Total Kelahiran Anak (f)': h.f, 'Kematian Anak - Jantan': k.matiAnakJantan,
        'Kematian Anak - Betina': k.matiAnakBetina, 'Total Kematian Anak (g)': h.g, 'Penjualan Anak - Jantan': k.jualAnakJantan,
        'Penjualan Anak - Betina': k.jualAnakBetina, 'Total Penjualan Anak (h)': h.h, 'Total Aset Ternak Kelompok (i)': h.i,
        'Catatan Petugas': d.catatan || '', Latitude: d.lat ?? '', Longitude: d.lng ?? '', 'Status GPS': d.lat ? 'Tertag' : 'Belum Ada GPS',
        'Ada Foto': d.photo ? 'Ya' : 'Tidak', 'Tanggal Input': new Date(Number(d.id)).toLocaleDateString('id-ID'),
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = Object.keys(rows[0]).map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Monev KTT');
    XLSX.writeFile(wb, `Dashboard-Monev-KTT-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleGetLocation = () => {
    if (!('geolocation' in navigator)) return alert('Perangkat/browser Anda tidak mendukung GPS.');
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setFormLat(pos.coords.latitude); setFormLng(pos.coords.longitude); setIsGettingLocation(false); },
      (err) => { alert('Gagal mendapat lokasi.'); setIsGettingLocation(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const openCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Gunakan tombol 'Unggah dari Galeri/File' sebagai alternatif.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      streamRef.current = stream;
      setShowCameraModal(true);
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); } }, 100);
    } catch (err) {
      setCameraError("Gagal membuka kamera. Anda bisa memakai tombol 'Unggah dari Galeri/File'.");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((track) => track.stop()); streamRef.current = null; }
    setShowCameraModal(false);
  };

  const takePhoto = () => {
    const video = videoRef.current; const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 1280; canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.drawImage(video, 0, 0, canvas.width, canvas.height); setFormPhoto(canvas.toDataURL('image/jpeg', 0.9)); }
    closeCamera();
    if (formLat === null || formLng === null) handleGetLocation();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setFormPhoto(evt.target?.result as string);
    reader.readAsDataURL(file);
    if (formLat === null || formLng === null) handleGetLocation();
  };

  const resetForm = () => {
    setEditingId(null); setFormTahun(FORM_KOSONG.tahun); setFormKec(FORM_KOSONG.kec); setFormDesa(FORM_KOSONG.desa);
    setFormKtt(FORM_KOSONG.ktt); setFormAlamat(FORM_KOSONG.alamat); setFormKegiatan(FORM_KOSONG.kegiatan);
    setFormJenis(FORM_KOSONG.jenis); setFormWaktuMonev(FORM_KOSONG.waktuMonev); setFormPhoto(FORM_KOSONG.photo);
    setFormLat(FORM_KOSONG.lat); setFormLng(FORM_KOSONG.lng); setFormCatatan(FORM_KOSONG.catatan);
    setFormKondisi({ ...KONDISI_KOSONG });
  };

  const handleSubmitLapangan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKec || !formDesa || !formKtt) return alert('Mohon lengkapi data kelompok!');

    const isEdit = !!editingId;
    const finalId = isEdit ? editingId : Date.now().toString();

    const payload = {
      id: finalId, tahun: formTahun, kec: formKec, desa: formDesa, namaKtt: formKtt, alamat: formAlamat,
      kegiatan: formKegiatan, jenis: formJenis, waktuMonev: formWaktuMonev, kondisi: formKondisi,
      lat: formLat, lng: formLng, photo: formPhoto, catatan: formCatatan, isEdit
    };

    try {
      await fetch('/api/monev-lapangan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await fetchDatabase();
      alert(isEdit ? 'Data lapangan berhasil diperbarui di Database!' : 'Data lapangan berhasil disimpan & ditag ke Peta MySQL!');
      resetForm();
    } catch (error) {
      alert('Gagal menyambung ke Database MySQL!');
    }
  };

  const handleEditClick = (data: FieldData) => {
    setEditingId(data.id); setFormTahun(data.tahun); setFormKec(data.kec); setFormDesa(data.desa);
    setFormKtt(data.namaKtt); setFormAlamat(data.alamat || ''); setFormKegiatan(data.kegiatan);
    setFormJenis(data.jenis); setFormWaktuMonev(data.waktuMonev || ''); setFormKondisi(migrasiKondisi(data.kondisi));
    setFormLat(data.lat); setFormLng(data.lng); setFormPhoto(data.photo); setFormCatatan(data.catatan || '');
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data ini dari Database MySQL?')) return;
    try {
      await fetch(`/api/monev-lapangan?id=${id}`, { method: 'DELETE' });
      await fetchDatabase();
      if (editingId === id) resetForm();
    } catch (error) {
      alert('Gagal menghapus data dari Database!');
    }
  };

  if (!isClient) return null;
  const activeExcel = savedFiles[String(tahunExcel)];
  const kecamatanTerpakai = Array.from(new Set(dbLapangan.map((d) => d.kec))).sort();

  return (
    <div className="p-4 md:p-8 min-h-screen text-gray-900" style={{background:'linear-gradient(135deg,#052e16 0%,#064e3b 40%,#065f46 100%)'}}>
      <div className="max-w-6xl mx-auto">
        <Link href="/bitpro" className="text-emerald-300 font-bold mb-6 block text-lg hover:text-white transition-colors">
          ← Kembali ke Modul Bitpro
        </Link>
        <h1 className="text-4xl font-black text-white mb-2">Monev KTT Terpadu</h1>
        <p className="text-lg text-emerald-200 mb-10">Monitoring Aset, Rekap Excel, dan Pendataan GPS Lapangan</p>

        {/* BOX 1: EXCEL */}
        <div className="bg-white p-8 rounded-2xl shadow-md border-t-8 border-emerald-600 mb-10">
          <h2 className="text-xl font-bold mb-6 text-emerald-800 border-b pb-2">1. Dokumen Excel Rekapitulasi</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/4">
              <label className="font-bold text-gray-700 mb-2 block">Pilih Tahun</label>
              <select value={tahunExcel} onChange={(e) => { setTahunExcel(e.target.value); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="w-full p-3 border-2 rounded-xl text-lg font-bold">
                {DAFTAR_TAHUN.map((th) => <option key={th} value={th}>Tahun {th}</option>)}
              </select>
            </div>
            
            <div className="w-full md:w-3/4 flex flex-col gap-3">
              <div className="border-2 border-dashed border-emerald-400 rounded-2xl p-6 bg-emerald-50 text-center relative cursor-pointer hover:bg-emerald-100">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".xlsx, .xls" 
                  onClick={handleExcelClick} 
                  onChange={handleExcelUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="pointer-events-none">
                  <span className="text-3xl">📄</span>
                  <h3 className="font-bold text-emerald-800">
                    {activeExcel ? `File MySQL: ${activeExcel.fileName}` : 'Upload File Excel Rekap'}
                  </h3>
                  {activeExcel && <p className="text-xs text-emerald-600 mt-1">Klik area ini untuk edit/menimpa file</p>}
                </div>
              </div>

              {/* Tombol Hapus Muncul Kalau Ada File Excel di Tahun Tersebut */}
              {activeExcel && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={handleDeleteExcel} 
                    className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-red-100 transition-colors"
                  >
                    🗑️ Hapus File {tahunExcel}
                  </button>
                </div>
              )}
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `.excel-viewer table { width: 100%; border-collapse: collapse; font-size: 12px; } .excel-viewer td, .excel-viewer th { border: 1px solid #cbd5e1; padding: 6px; white-space: nowrap; }` }} />
          {activeExcel ? (
            <div key={tahunExcel} className="mt-6 overflow-x-auto max-h-64 border rounded-xl excel-viewer bg-gray-50" dangerouslySetInnerHTML={{ __html: activeExcel.htmlTable }} />
          ) : (
            <p key={`kosong-${tahunExcel}`} className="mt-6 text-center text-gray-400 font-bold py-6 border border-dashed rounded-xl">Belum ada file Excel tersimpan untuk Tahun {tahunExcel}.</p>
          )}
        </div>

        {/* BOX 2: FORM */}
        <div ref={formSectionRef} className="bg-white p-8 rounded-2xl shadow-md border-t-8 border-green-700 mb-10">
          <div className="flex items-center justify-between border-b pb-2 mb-6">
            <h2 className="text-xl font-bold text-green-800">2. Form Pendataan Lapangan & Monev Kondisi Ternak</h2>
            {editingId && <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">✏️ Mode Edit Data MySQL</span>}
          </div>
          <form onSubmit={handleSubmitLapangan} className="space-y-6">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-sm font-bold text-green-700 mb-4 uppercase">Informasi Wilayah</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold">Tahun Bantuan</label>
                  <select value={formTahun} onChange={(e) => setFormTahun(e.target.value)} className="w-full p-2 mt-1 border rounded bg-white">
                    {DAFTAR_TAHUN.map((th) => <option key={th} value={th}>{th}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold">Kecamatan</label>
                  <select value={formKec} onChange={(e) => { setFormKec(e.target.value); setFormDesa(''); }} className="w-full p-2 mt-1 border rounded bg-white">
                    <option value="">Pilih...</option>
                    {Object.keys(DATA_WILAYAH).map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold">Desa</label>
                  <select value={formDesa} onChange={(e) => setFormDesa(e.target.value)} disabled={!formKec} className="w-full p-2 mt-1 border rounded bg-white">
                    <option value="">Pilih...</option>
                    {formKec && DATA_WILAYAH[formKec as keyof typeof DATA_WILAYAH].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-sm font-bold text-green-700 mb-4 uppercase">Identitas Kelompok & Waktu Monev</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label className="text-xs font-bold">Nama Kelompok (KTT) *</label><input type="text" value={formKtt} onChange={(e) => setFormKtt(e.target.value)} required className="w-full p-2 mt-1 border rounded bg-white" /></div>
                <div><label className="text-xs font-bold">Alamat</label><input type="text" value={formAlamat} onChange={(e) => setFormAlamat(e.target.value)} className="w-full p-2 mt-1 border rounded bg-white" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-xs font-bold">Nama Kegiatan/TA</label><input type="text" value={formKegiatan} onChange={(e) => setFormKegiatan(e.target.value)} className="w-full p-2 mt-1 border rounded bg-white" /></div>
                <div>
                  <label className="text-xs font-bold">Jenis Komoditas Ternak</label>
                  <select value={formJenis} onChange={(e) => setFormJenis(e.target.value)} className="w-full p-2 mt-1 border rounded bg-white">
                    {DAFTAR_JENIS_TERNAK.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-bold">Waktu Monev</label><input type="date" value={formWaktuMonev} onChange={(e) => setFormWaktuMonev(e.target.value)} className="w-full p-2 mt-1 border rounded bg-white" /></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-green-300">
              <h3 className="text-base font-black text-green-800 mb-1 uppercase">A. Kondisi Ternak (Hasil Monev)</h3>
              <p className="text-xs text-gray-500 mb-4">Total dan hasil akhir dihitung otomatis dari angka yang Anda masukkan.</p>
              <div className="space-y-4">
                <KondisiSection nomor={1} title="Jumlah Ternak Awal Total" total={kalkulasi.a} totalLabel="Total Awal (a)">
                  <BarisTernak label="Ternak Awal" jantan={formKondisi.awalJantan} betina={formKondisi.awalBetina} onJantan={(v: any) => updateKondisi('awalJantan', v)} onBetina={(v: any) => updateKondisi('awalBetina', v)} />
                </KondisiSection>

                <KondisiSection nomor={2} title="Kematian Ternak Pokok" total={kalkulasi.b} totalLabel="Total Mati Ternak Pokok (b)">
                  <BarisTernak label="Mati Bangkai" showBA jantan={formKondisi.matiBangkaiJantan} betina={formKondisi.matiBangkaiBetina} ba={formKondisi.matiBangkaiBA} onJantan={(v: any) => updateKondisi('matiBangkaiJantan', v)} onBetina={(v: any) => updateKondisi('matiBangkaiBetina', v)} onBA={(v: any) => updateKondisi('matiBangkaiBA', v)} />
                  <BarisTernak label="Mati Potong Paksa" showBA jantan={formKondisi.matiPotongJantan} betina={formKondisi.matiPotongBetina} ba={formKondisi.matiPotongBA} onJantan={(v: any) => updateKondisi('matiPotongJantan', v)} onBetina={(v: any) => updateKondisi('matiPotongBetina', v)} onBA={(v: any) => updateKondisi('matiPotongBA', v)} />
                </KondisiSection>

                <KondisiSection nomor={3} title="Penjualan Ternak Pokok" total={kalkulasi.c} totalLabel="Total Ternak Pokok Dijual (c)">
                  <BarisTernak label="Penjualan" showBA jantan={formKondisi.jualJantan} betina={formKondisi.jualBetina} ba={formKondisi.jualBA} onJantan={(v: any) => updateKondisi('jualJantan', v)} onBetina={(v: any) => updateKondisi('jualBetina', v)} onBA={(v: any) => updateKondisi('jualBA', v)} />
                </KondisiSection>

                <KondisiSection nomor={4} title="Pembelian Ternak Pokok" total={kalkulasi.d} totalLabel="Total Ternak Pokok Dibeli (d)">
                  <BarisTernak label="Pembelian" jantan={formKondisi.beliJantan} betina={formKondisi.beliBetina} onJantan={(v: any) => updateKondisi('beliJantan', v)} onBetina={(v: any) => updateKondisi('beliBetina', v)} />
                </KondisiSection>

                <div className="bg-emerald-50 p-5 rounded-xl border-2 border-dashed border-emerald-400 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2"><span className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-700 text-white font-black text-sm shrink-0">5</span><p className="text-xs font-bold text-gray-600 uppercase">Sisa Ternak Pokok yang Masih Ada (e)</p></div>
                  <p className="text-xs text-gray-500 mb-2">{kalkulasi.a} ekor (a) − {kalkulasi.b} ekor (b) − {kalkulasi.c} ekor (c) + {kalkulasi.d} ekor (d)</p>
                  <p className="text-3xl font-black text-emerald-700">{kalkulasi.e} ekor</p>
                </div>

                <KondisiSection nomor={6} title="Kelahiran Anak" total={kalkulasi.f} totalLabel="Total Kelahiran Anak (f)">
                  <BarisTernak label="Kelahiran" jantan={formKondisi.lahirJantan} betina={formKondisi.lahirBetina} onJantan={(v: any) => updateKondisi('lahirJantan', v)} onBetina={(v: any) => updateKondisi('lahirBetina', v)} />
                </KondisiSection>

                <KondisiSection nomor={7} title="Kematian Anak" total={kalkulasi.g} totalLabel="Total Kematian Anak (g)">
                  <BarisTernak label="Kematian Anak" jantan={formKondisi.matiAnakJantan} betina={formKondisi.matiAnakBetina} onJantan={(v: any) => updateKondisi('matiAnakJantan', v)} onBetina={(v: any) => updateKondisi('matiAnakBetina', v)} />
                </KondisiSection>

                <KondisiSection nomor={8} title="Penjualan Anak" total={kalkulasi.h} totalLabel="Total Penjualan Anak (h)">
                  <BarisTernak label="Penjualan Anak" jantan={formKondisi.jualAnakJantan} betina={formKondisi.jualAnakBetina} onJantan={(v: any) => updateKondisi('jualAnakJantan', v)} onBetina={(v: any) => updateKondisi('jualAnakBetina', v)} />
                </KondisiSection>

                <div className="bg-emerald-900 text-white p-6 rounded-2xl text-center shadow-xl">
                  <div className="flex items-center justify-center gap-3 mb-1"><span className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-emerald-900 font-black text-sm shrink-0">9</span><p className="text-xs font-bold uppercase tracking-wide text-emerald-200">Total Aset Ternak Kelompok (i)</p></div>
                  <p className="text-xs text-emerald-200 mb-2">{kalkulasi.e} ekor (e) + {kalkulasi.f} ekor (f) − {kalkulasi.g} ekor (g) − {kalkulasi.h} ekor (h)</p>
                  <p className="text-4xl font-black">{kalkulasi.i} ekor</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
              <h3 className="text-sm font-bold text-green-700 mb-4 uppercase">Bukti Lapangan (Foto & Koordinat)</h3>
              <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
                <button type="button" onClick={handleGetLocation} disabled={isGettingLocation} className="cursor-pointer bg-blue-700 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all inline-block shadow-lg disabled:opacity-60">📍 {isGettingLocation ? 'Mencari Lokasi...' : 'Ambil Lokasi Terkini'}</button>
                <button type="button" onClick={openCamera} className="cursor-pointer bg-green-700 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-800 transition-all inline-block shadow-lg">📸 Buka Kamera & Foto</button>
                <label className="cursor-pointer bg-gray-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-700 transition-all inline-block shadow-lg">🖼️ Unggah dari Galeri/File<input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" /></label>
              </div>
              {cameraError && <p className="text-red-600 mt-3 font-bold text-sm">{cameraError}</p>}
              {isGettingLocation && <p className="text-orange-600 mt-3 font-bold animate-pulse">Mencari koordinat satelit...</p>}
              {formLat && formLng && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-300 inline-block">
                  <p className="text-xs font-bold text-gray-500">📍 Koordinat Tersimpan:</p>
                  <p className="text-green-800 font-mono text-sm">{formLat}, {formLng}</p>
                </div>
              )}
              {formPhoto && (
                <div className="mt-4">
                  <img src={formPhoto} alt="Preview" className="max-h-48 mx-auto rounded-xl border-4 border-white shadow-md object-cover" />
                  <div><a href={formPhoto} download={buatNamaFileFoto(formKtt, Date.now())} className="inline-block mt-2 text-xs font-bold text-blue-700 hover:underline">⬇️ Download Foto Ini</a></div>
                </div>
              )}
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-sm font-bold text-green-700 mb-4 uppercase">Catatan Petugas</h3>
              <textarea value={formCatatan} onChange={(e) => setFormCatatan(e.target.value)} placeholder="Tulis keterangan tambahan dari lapangan..." rows={3} className="w-full p-3 border rounded-xl bg-white" />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button type="submit" className="flex-1 bg-emerald-900 text-white py-4 rounded-xl font-bold text-xl shadow-xl hover:bg-emerald-950">
                {editingId ? 'PERBARUI DATA MySQL' : 'SIMPAN DATA KE MySQL'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="md:w-48 bg-gray-300 text-gray-800 py-4 rounded-xl font-bold text-lg shadow hover:bg-gray-400">
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* BOX 3: DASHBOARD */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-blue-600">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">3. Dashboard Pemantauan KTT (MySQL)</h2>
            <button type="button" onClick={handleDownloadDashboard} className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold shadow hover:bg-blue-700 transition-all">⬇️ Download Data (Excel)</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 border rounded-xl shadow-sm"><p className="text-xs text-gray-500 font-bold uppercase">Total Kelompok</p><p className="text-3xl font-black text-blue-600">{dbLapangan.length}</p></div>
            <div className="p-4 bg-gray-50 border rounded-xl shadow-sm"><p className="text-xs text-gray-500 font-bold uppercase">Total Aset Ternak</p><p className="text-3xl font-black text-purple-600">{dbLapangan.reduce((acc, curr) => acc + hitungKondisi(curr.kondisi).i, 0)}</p></div>
            <div className="p-4 bg-gray-50 border rounded-xl shadow-sm"><p className="text-xs text-gray-500 font-bold uppercase">Sebaran Kec</p><p className="text-3xl font-black text-orange-600">{new Set(dbLapangan.map((d) => d.kec)).size}</p></div>
            <div className="p-4 bg-gray-50 border rounded-xl shadow-sm"><p className="text-xs text-gray-500 font-bold uppercase">Data Ber-GPS</p><p className="text-3xl font-black text-green-600">{dbLapangan.filter((d) => d.lat !== null).length}</p></div>
          </div>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-gray-200 shadow-inner mb-6 relative bg-gray-100 flex items-center justify-center">
            {!leafletLoaded && <p className="font-bold text-gray-400 animate-pulse">Memuat Peta Satelit...</p>}
            <div id="map-dashboard" className="w-full h-full absolute inset-0 z-0"></div>
          </div>

          {dbLapangan.length === 0 ? (
            <p className="text-center text-gray-400 font-bold py-10">Belum ada data lapangan di MySQL.</p>
          ) : (
            <div className="space-y-8">
              {kecamatanTerpakai.map((kec) => {
                const dataKec = dbLapangan.filter((d) => d.kec === kec);
                const totalTernakKec = dataKec.reduce((acc, curr) => acc + hitungKondisi(curr.kondisi).i, 0);
                return (
                  <div key={kec} className="border rounded-xl overflow-hidden">
                    <div className="bg-blue-50 border-b px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-black text-blue-800 text-lg">📍 Kecamatan {kec}</h3>
                      <span className="text-xs font-bold text-blue-600 bg-white px-3 py-1 rounded-full border border-blue-200">{dataKec.length} Kelompok · {totalTernakKec} Ekor Aset</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 border-b-2 border-gray-300">
                          <tr>
                            <th className="p-3">Waktu</th><th className="p-3">Nama KTT</th><th className="p-3">Desa</th>
                            <th className="p-3">Jenis</th><th className="p-3">Awal (a)</th><th className="p-3">Sisa (e)</th>
                            <th className="p-3">Aset (i)</th><th className="p-3">Catatan</th><th className="p-3">Foto</th>
                            <th className="p-3">GPS</th><th className="p-3 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataKec.map((d) => {
                            const h = hitungKondisi(d.kondisi);
                            return (
                              <tr key={d.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-mono text-xs text-gray-500">{new Date(Number(d.id)).toLocaleDateString('id-ID')}</td>
                                <td className="p-3 font-bold text-gray-800">{d.namaKtt}</td>
                                <td className="p-3 text-gray-600">{d.desa}</td>
                                <td className="p-3">{getEmojiJenis(d.jenis)} {d.jenis}</td>
                                <td className="p-3">{h.a}</td><td className="p-3 font-bold text-emerald-700">{h.e}</td><td className="p-3 font-black text-emerald-900">{h.i}</td>
                                <td className="p-3 text-gray-500 text-xs max-w-[150px] truncate" title={d.catatan}>{d.catatan || '-'}</td>
                                <td className="p-3">{d.photo ? <img src={d.photo} alt="foto" className="w-10 h-10 object-cover rounded-lg border" /> : '-'}</td>
                                <td className="p-3 text-xs">{d.lat ? <span className="text-green-600 font-bold">✔ Tagged</span> : <span className="text-red-500">✘ No GPS</span>}</td>
                                <td className="p-3">
                                  <div className="flex gap-2 justify-center">
                                    <button onClick={() => handleEditClick(d)} className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200">✏️</button>
                                    <button onClick={() => handleDeleteClick(d.id)} className="px-3 py-1 text-xs font-bold rounded-lg bg-red-100 text-red-700 hover:bg-red-200">🗑️</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showCameraModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full shadow-2xl">
            <h3 className="font-bold text-green-800 mb-3 text-center">📷 Ambil Foto</h3>
            <div className="rounded-xl overflow-hidden bg-black mb-4">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto max-h-[60vh] object-contain" />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3">
              <button type="button" onClick={takePhoto} className="flex-1 bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800">📸 Jepret</button>
              <button type="button" onClick={closeCamera} className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-400">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}