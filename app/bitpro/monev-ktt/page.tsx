'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  ArrowLeft,
  Download,
  Upload,
  Camera,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Edit2,
  Plus,
  X,
  FileSpreadsheet,
  Layers,
  Map as MapIcon,
  FileText,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

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
  PEJAGOAN: ['LOGEDE', 'KUWAYUHAN', 'KEDAWUNG', 'PEJAGOan', 'KEBULUSAN', 'ADITIRTO', 'KARANGPOH', 'JEMUR', 'PRIGI', 'KEBAGORAN', 'PENGARINGAN', 'PENIRON', 'WATULAWANG'],
  SRUWENG: ['MENGANTI', 'TRIKARSO', 'SIDOHARJO', 'GIWANGRETNO', 'JABRES', 'SRUWENG', 'KARANGGEDANG', 'PURWODESO', 'KLEPUSANGGAR', 'TANGGERAN', 'KARANGSARI', 'KARANGPULE', 'PAKURAN', 'PENGEMPON', 'KEJAWANG', 'KARANGJAMBU', 'SIDOAGUNG', 'PENUSUPAN', 'DONOSARI', 'PANDANSARI', 'CONDONGCAMPUR'],
  KARANGSAMBUNG: ['WIDORO', 'SELING', 'KEDUNGWARU', 'PENCIL', 'KALIGENDING', 'PLUMBON', 'PUJOTIRTO', 'WADASMALANG', 'TLEPOK', 'KALISANA', 'LANGSE', 'BANIORO', 'KARANGSAMBUNG', 'TOTOGAN'],
  SADANG: ['PUCANGAN', 'SEBORO', 'WONOSARI', 'SADANGKULON', 'CANGKRING', 'SADANGWETAN', 'KEDUNGGONG'],
};

const DAFTAR_TAHUN = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'];
const DAFTAR_JENIS_TERNAK = ['Sapi', 'Kambing', 'Domba', 'Ayam KUB', 'Ayam Petelur'];

const buatNamaFileFoto = (namaKtt: string, id: string | number) => {
  const namaAman = (namaKtt || 'monev').trim().replace(/[^a-zA-Z0-9]+/g, '_');
  return `foto-${namaAman}-${id}.jpg`;
};

type SavedFileData = { fileName: string; htmlTable: string };
type StatusBA = 'Ada' | 'Tidak';

const KONDISI_KOSONG = {
  awalJantan: 0,
  awalBetina: 0,
  matiBangkaiJantan: 0,
  matiBangkaiBetina: 0,
  matiBangkaiBA: 'Tidak' as StatusBA,
  matiPotongJantan: 0,
  matiPotongBetina: 0,
  matiPotongBA: 'Tidak' as StatusBA,
  jualJantan: 0,
  jualBetina: 0,
  jualBA: 'Tidak' as StatusBA,
  beliJantan: 0,
  beliBetina: 0,
  lahirJantan: 0,
  lahirBetina: 0,
  matiAnakJantan: 0,
  matiAnakBetina: 0,
  jualAnakJantan: 0,
  jualAnakBetina: 0,
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
  id: string;
  tahun: string;
  kec: string;
  desa: string;
  namaKtt: string;
  alamat: string;
  kegiatan: string;
  jenis: string;
  waktuMonev: string;
  kondisi: KondisiTernak;
  lat: number | null;
  lng: number | null;
  photo: string | null;
  catatan: string;
};

const FORM_KOSONG = {
  tahun: '2026',
  kec: '',
  desa: '',
  ktt: '',
  alamat: '',
  kegiatan: '',
  jenis: 'Sapi',
  waktuMonev: '',
  photo: null as string | null,
  lat: null as number | null,
  lng: null as number | null,
  catatan: '',
};

function BarisTernak({ label, jantan, betina, onJantan, onBetina, showBA = false, ba, onBA }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
          {label} — Jantan
        </label>
        <input
          type="number"
          min={0}
          value={jantan}
          onChange={(e) => onJantan(Number(e.target.value))}
          className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-white font-sans font-bold text-center text-sm focus:border-emerald-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
          {label} — Betina
        </label>
        <input
          type="number"
          min={0}
          value={betina}
          onChange={(e) => onBetina(Number(e.target.value))}
          className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-white font-sans font-bold text-center text-sm focus:border-emerald-500 outline-none"
        />
      </div>
      {showBA && (
        <div>
          <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
            Berita Acara (BA)
          </label>
          <select
            value={ba}
            onChange={(e) => onBA?.(e.target.value)}
            className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:border-emerald-500 outline-none"
          >
            <option value="Tidak">Tidak Ada</option>
            <option value="Ada">Ada BA</option>
          </select>
        </div>
      )}
    </div>
  );
}

function KondisiSection({ nomor, title, children, total, totalLabel }: any) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold font-sans text-xs flex items-center justify-center shrink-0">
          {nomor}
        </span>
        <h4 className="font-bold text-sm text-slate-900">{title}</h4>
      </div>
      {children}
      {total !== undefined && (
        <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-sans font-bold text-slate-700">
          <span>{totalLabel}:</span>
          <span className="text-emerald-600 text-sm font-bold">{total} Ekor</span>
        </div>
      )}
    </div>
  );
}

export default function MonevKTT() {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'excel'>('dashboard');

  const [tahunExcel, setTahunExcel] = useState('2026');
  const [savedFiles, setSavedFiles] = useState<Record<string, SavedFileData>>({});
  const [dbLapangan, setDbLapangan] = useState<FieldData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formTahun, setFormTahun] = useState(FORM_KOSONG.tahun);
  const [formKec, setFormKec] = useState(FORM_KOSONG.kec);
  const [formDesa, setFormDesa] = useState(FORM_KOSONG.desa);
  const [formKtt, setFormKtt] = useState(FORM_KOSONG.ktt);
  const [formAlamat, setFormAlamat] = useState(FORM_KOSONG.alamat);
  const [formKegiatan, setFormKegiatan] = useState(FORM_KOSONG.kegiatan);
  const [formJenis, setFormJenis] = useState(FORM_KOSONG.jenis);
  const [formWaktuMonev, setFormWaktuMonev] = useState(FORM_KOSONG.waktuMonev);
  const [formPhoto, setFormPhoto] = useState<string | null>(FORM_KOSONG.photo);
  const [formPdfBA, setFormPdfBA] = useState<string | null>(null);
  const [formPdfBAName, setFormPdfBAName] = useState<string | null>(null);
  const [formLat, setFormLat] = useState<number | null>(FORM_KOSONG.lat);
  const [formLng, setFormLng] = useState<number | null>(FORM_KOSONG.lng);
  const [formCatatan, setFormCatatan] = useState(FORM_KOSONG.catatan);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handlePdfBAUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Hanya file dokumen PDF (.pdf) yang diperbolehkan!');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file PDF maksimal 10 MB!');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormPdfBA(reader.result as string);
      setFormPdfBAName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const removePdfBA = () => {
    setFormPdfBA(null);
    setFormPdfBAName(null);
  };

  const [formKondisi, setFormKondisi] = useState<KondisiTernak>({ ...KONDISI_KOSONG });
  const updateKondisi = (field: keyof KondisiTernak, value: any) => {
    setFormKondisi((prev) => ({ ...prev, [field]: value }));
  };
  const kalkulasi = hitungKondisi(formKondisi);

  const [editingId, setEditingId] = useState<string | null>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Kamera State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const fetchDatabase = async () => {
    try {
      const resExcel = await fetch('/api/monev-excel');
      const dataExcel = await resExcel.json();
      const formatExcel: Record<string, SavedFileData> = {};
      dataExcel.forEach((d: any) => {
        formatExcel[d.tahun] = { fileName: d.file_name, htmlTable: d.html_table };
      });
      setSavedFiles(formatExcel);

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
        catatan: d.catatan || '',
      }));
      setDbLapangan(formatLap);
    } catch (err) {
      console.error('Gagal mengambil database monev', err);
    }
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

  // Peta Leaflet
  useEffect(() => {
    if (!leafletLoaded || !isClient || activeTab !== 'dashboard') return;
    const L = (window as any).L;
    const mapContainer = document.getElementById('map-dashboard');
    if (mapContainer && !mapInstanceRef.current) {
      const map = L.map('map-dashboard').setView([-7.668, 109.651], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);
      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }
  }, [leafletLoaded, isClient, activeTab]);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const L = (window as any).L;
    markersLayerRef.current.clearLayers();
    const bounds: [number, number][] = [];

    dbLapangan.forEach((data) => {
      if (data.lat && data.lng) {
        const totalAset = hitungKondisi(data.kondisi).i;
        const icon = L.divIcon({
          html: `<div style="background:#2192FF;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });
        const marker = L.marker([data.lat, data.lng], { icon });
        marker.bindPopup(`
          <div style="font-family:sans-serif; text-align:center; padding:4px;">
            <b style="color:#2192FF; font-size:14px;">${data.namaKtt}</b><br/>
            <span style="font-size:12px; color:#666;">${data.desa}, ${data.kec}</span><br/>
            <b style="font-size:13px; color:#111;">Aset: ${totalAset} Ekor (${data.jenis})</b>
            ${data.photo ? `<br/><img src="${data.photo}" style="width:110px; height:75px; object-fit:cover; margin-top:6px; border-radius:6px;" />` : ''}
          </div>
        `);
        marker.addTo(markersLayerRef.current);
        bounds.push([data.lat, data.lng]);
      }
    });
    if (bounds.length > 0) mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [dbLapangan, leafletLoaded, activeTab]);

  const handleExcelClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const activeExcel = savedFiles[String(tahunExcel)];
    if (activeExcel) {
      const password = window.prompt('Data sudah ada. Masukkan password untuk mengedit file Excel ini:');
      if (password !== '12345') {
        e.preventDefault();
        alert('Password salah! Akses ditolak.');
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

      try {
        await fetch('/api/monev-excel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tahun: tahunExcel, fileName: file.name, htmlTable: html }),
        });
        alert(`File Excel ${tahunExcel} berhasil diunggah ke Database!`);
      } catch {
        alert('Gagal menyimpan file Excel.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDeleteExcel = async () => {
    const password = window.prompt('Masukkan password untuk menghapus file Excel:');
    if (password !== '12345') {
      alert('Password salah! Penghapusan dibatalkan.');
      return;
    }
    if (!window.confirm(`Yakin ingin menghapus rekap Excel tahun ${tahunExcel}?`)) return;

    try {
      await fetch(`/api/monev-excel?tahun=${tahunExcel}`, { method: 'DELETE' });
      setSavedFiles((prev) => {
        const newState = { ...prev };
        delete newState[tahunExcel];
        return newState;
      });
      alert(`File Excel tahun ${tahunExcel} berhasil dihapus!`);
    } catch {
      alert('Gagal menghapus file Excel.');
    }
  };

  const handleDownloadDashboard = () => {
    if (dbLapangan.length === 0) return alert('Belum ada data lapangan untuk diunduh.');
    const dataUrut = [...dbLapangan].sort((a, b) => a.kec.localeCompare(b.kec));
    const rows = dataUrut.map((d) => {
      const k = d.kondisi;
      const h = hitungKondisi(k);
      return {
        'Tahun Bantuan': d.tahun,
        Kecamatan: d.kec,
        Desa: d.desa,
        'Nama KTT': d.namaKtt,
        Alamat: d.alamat || '',
        'Nama Kegiatan/TA': d.kegiatan,
        'Jenis Ternak': d.jenis,
        'Waktu Monev': d.waktuMonev || '',
        'Awal (a)': h.a,
        'Mati (b)': h.b,
        'Jual (c)': h.c,
        'Beli (d)': h.d,
        'Sisa (e)': h.e,
        'Lahir (f)': h.f,
        'Aset Akhir (i)': h.i,
        'Catatan Petugas': d.catatan || '',
        Latitude: d.lat ?? '',
        Longitude: d.lng ?? '',
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Monev KTT');
    XLSX.writeFile(wb, `Monev_KTT_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleGetLocation = () => {
    if (!('geolocation' in navigator)) return alert('GPS tidak didukung oleh browser Anda.');
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormLat(pos.coords.latitude);
        setFormLng(pos.coords.longitude);
        setIsGettingLocation(false);
      },
      () => {
        alert('Gagal mengambil koordinat lokasi.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const openCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Gunakan tombol unggah galeri sebagai alternatif.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setShowCameraModal(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch {
      setCameraError('Kamera tidak dapat diakses. Gunakan unggah dari file.');
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCameraModal(false);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setFormPhoto(canvas.toDataURL('image/jpeg', 0.9));
    }
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
    setEditingId(null);
    setFormTahun(FORM_KOSONG.tahun);
    setFormKec(FORM_KOSONG.kec);
    setFormDesa(FORM_KOSONG.desa);
    setFormKtt(FORM_KOSONG.ktt);
    setFormAlamat(FORM_KOSONG.alamat);
    setFormKegiatan(FORM_KOSONG.kegiatan);
    setFormJenis(FORM_KOSONG.jenis);
    setFormWaktuMonev(FORM_KOSONG.waktuMonev);
    setFormPhoto(FORM_KOSONG.photo);
    setFormPdfBA(null);
    setFormPdfBAName(null);
    setFormLat(FORM_KOSONG.lat);
    setFormLng(FORM_KOSONG.lng);
    setFormCatatan(FORM_KOSONG.catatan);
    setFormKondisi({ ...KONDISI_KOSONG });
  };

  const handleSubmitLapangan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKec || !formDesa || !formKtt) return alert('Mohon lengkapi data kelompok!');

    const isEdit = !!editingId;
    const finalId = isEdit ? editingId : Date.now().toString();

    const kondisiWithPdf = {
      ...formKondisi,
      pdfBA: formPdfBA,
      pdfBAName: formPdfBAName,
    };

    const payload = {
      id: finalId,
      tahun: formTahun,
      kec: formKec,
      desa: formDesa,
      namaKtt: formKtt,
      alamat: formAlamat,
      kegiatan: formKegiatan,
      jenis: formJenis,
      waktuMonev: formWaktuMonev,
      kondisi: kondisiWithPdf,
      lat: formLat,
      lng: formLng,
      photo: formPhoto,
      catatan: formCatatan,
      isEdit,
    };

    try {
      await fetch('/api/monev-lapangan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await fetchDatabase();
      alert(isEdit ? 'Data lapangan & Berita Acara berhasil diperbarui!' : 'Data lapangan & Berita Acara berhasil disimpan ke database!');
      resetForm();
      setActiveTab('dashboard');
    } catch {
      alert('Gagal menyimpan data ke database.');
    }
  };

  const handleEditClick = (data: FieldData) => {
    setEditingId(data.id);
    setFormTahun(data.tahun);
    setFormKec(data.kec);
    setFormDesa(data.desa);
    setFormKtt(data.namaKtt);
    setFormAlamat(data.alamat || '');
    setFormKegiatan(data.kegiatan);
    setFormJenis(data.jenis);
    setFormWaktuMonev(data.waktuMonev || '');
    setFormKondisi(migrasiKondisi(data.kondisi));
    setFormPdfBA((data.kondisi as any)?.pdfBA || null);
    setFormPdfBAName((data.kondisi as any)?.pdfBAName || null);
    setFormLat(data.lat);
    setFormLng(data.lng);
    setFormPhoto(data.photo);
    setFormCatatan(data.catatan || '');
    setActiveTab('form');
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data lapangan ini?')) return;
    try {
      await fetch(`/api/monev-lapangan?id=${id}`, { method: 'DELETE' });
      await fetchDatabase();
      if (editingId === id) resetForm();
    } catch {
      alert('Gagal menghapus data.');
    }
  };

  if (!isClient) return null;
  const activeExcel = savedFiles[String(tahunExcel)];
  const kecamatanTerpakai = Array.from(new Set(dbLapangan.map((d) => d.kec))).sort();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white pb-20">
      
      {/* ── TOP HEADER (Tema Hijau Bitpro - Lega & Bernapas) ── */}
      <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-h-[80px] sm:min-h-[88px] flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/bitpro"
              className="min-h-touch min-w-touch w-11 h-11 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-800 transition-colors shrink-0"
              aria-label="Kembali ke Bitpro"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Link href="/bitpro" className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors truncate">
                  Bitpro
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">Monev KTT</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
                Monitoring &amp; Evaluasi Kelompok Tani Ternak
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadDashboard}
              title="Export Excel"
              aria-label="Export Excel"
              className="min-h-touch min-w-touch h-11 w-11 sm:w-auto sm:px-5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-center sm:gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Kelompok Terpantau
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-slate-900">
              {dbLapangan.length} <span className="text-xs font-normal text-slate-500">KTT</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total Aset Ternak
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-emerald-600">
              {dbLapangan.reduce((acc, curr) => acc + hitungKondisi(curr.kondisi).i, 0)} <span className="text-xs font-normal text-slate-500">Ekor</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Sebaran Kecamatan
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-vitality">
              {kecamatanTerpakai.length} <span className="text-xs font-normal text-slate-500">Wilayah</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Terverifikasi GPS
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-bold text-lime">
              {dbLapangan.filter((d) => d.lat !== null).length} <span className="text-xs font-normal text-slate-500">Lokasi</span>
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { key: 'dashboard', label: 'Peta & Laporan Lapangan', icon: MapIcon },
            { key: 'form', label: editingId ? 'Edit Data Lapangan ✏️' : 'Input Pendataan Lapangan', icon: Plus },
            { key: 'excel', label: 'Rekapitulasi Berkas Excel', icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`min-h-touch h-11 px-4 sm:px-5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-white border-slate-200 text-emerald-600 border-b-white translate-y-px shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-900 bg-slate-100/60'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: PETA & LAPORAN LAPANGAN ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Interactive Leaflet Map */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-600" />
                  <span>Peta Sebaran Bantuan Ternak KTT</span>
                </h3>
                <span className="text-xs font-sans text-slate-500">
                  {dbLapangan.filter((d) => d.lat !== null).length} Titik Koordinat
                </span>
              </div>

              <div className="w-full h-[380px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                <div id="map-dashboard" className="w-full h-full absolute inset-0 z-0" />
              </div>
            </div>

            {/* List Grouped by Kecamatan */}
            <div className="space-y-6">
              {kecamatanTerpakai.map((kec) => {
                const dataKec = dbLapangan.filter((d) => d.kec === kec);
                const totalTernakKec = dataKec.reduce((acc, curr) => acc + hitungKondisi(curr.kondisi).i, 0);

                return (
                  <div key={kec} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>📍 Kecamatan {kec}</span>
                      </h4>
                      <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {dataKec.length} Kelompok · {totalTernakKec} Ekor Aset
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="p-3.5">WAKTU</th>
                            <th className="p-3.5">NAMA KTT</th>
                            <th className="p-3.5">DESA</th>
                            <th className="p-3.5">KOMODITAS</th>
                            <th className="p-3.5 text-right">AWAL</th>
                            <th className="p-3.5 text-right">SISA</th>
                            <th className="p-3.5 text-right">TOTAL ASET</th>
                            <th className="p-3.5">GPS / FOTO</th>
                            <th className="p-3.5 text-center w-24">AKSI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800">
                          {dataKec.map((d) => {
                            const h = hitungKondisi(d.kondisi);
                            return (
                              <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-3.5 font-sans text-xs text-slate-500">
                                  {new Date(Number(d.id)).toLocaleDateString('id-ID')}
                                </td>
                                <td className="p-3.5 font-bold text-slate-900">
                                  {d.namaKtt}
                                </td>
                                <td className="p-3.5 text-slate-600 text-xs">{d.desa}</td>
                                <td className="p-3.5 text-xs">
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                                    {d.jenis}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right font-sans text-xs">{h.a}</td>
                                <td className="p-3.5 text-right font-sans text-xs font-semibold text-slate-700">{h.e}</td>
                                <td className="p-3.5 text-right font-sans text-xs font-bold text-emerald-600">{h.i} Ekor</td>
                                <td className="p-3.5">
                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    {d.lat ? (
                                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                        <CheckCircle2 size={12} /> GPS
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 text-[11px]">No GPS</span>
                                    )}
                                    {d.photo && (
                                      <a
                                        href={d.photo}
                                        download={buatNamaFileFoto(d.namaKtt, d.id)}
                                        className="text-emerald-700 hover:underline font-semibold"
                                      >
                                        Foto
                                      </a>
                                    )}
                                    {(d.kondisi as any)?.pdfBA && (
                                      <a
                                        href={(d.kondisi as any).pdfBA}
                                        download={(d.kondisi as any).pdfBAName || 'Berita_Acara.pdf'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-colors"
                                        title={(d.kondisi as any).pdfBAName || 'Berita Acara (PDF)'}
                                      >
                                        <FileText size={11} className="text-red-600" />
                                        <span>BA (PDF)</span>
                                      </a>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3.5 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => handleEditClick(d)}
                                      className="min-h-touch h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
                                      aria-label="Edit"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(d.id)}
                                      className="min-h-touch h-8 w-8 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                                      aria-label="Hapus"
                                    >
                                      <Trash2 size={13} />
                                    </button>
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

          </div>
        )}

        {/* ── TAB 2: FORM PENDATAAN ── */}
        {activeTab === 'form' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {editingId ? 'Edit Data Pemantauan Lapangan' : 'Input Data Monev Lapangan Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Pencatatan perkembangan populasi ternak bantuan kelompok
                </p>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="min-h-touch h-9 px-3 rounded-lg border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitLapangan} className="space-y-6">
              
              {/* Wilayah */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-600">
                  1. Informasi Wilayah & Kelompok
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Tahun Bantuan
                    </label>
                    <select
                      value={formTahun}
                      onChange={(e) => setFormTahun(e.target.value)}
                      className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-emerald-500 outline-none"
                    >
                      {DAFTAR_TAHUN.map((th) => (
                        <option key={th} value={th}>Tahun {th}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Kecamatan
                    </label>
                    <select
                      value={formKec}
                      onChange={(e) => {
                        setFormKec(e.target.value);
                        setFormDesa('');
                      }}
                      className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-emerald-500 outline-none"
                    >
                      <option value="">Pilih Kecamatan</option>
                      {Object.keys(DATA_WILAYAH).map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Desa
                    </label>
                    <select
                      value={formDesa}
                      onChange={(e) => setFormDesa(e.target.value)}
                      disabled={!formKec}
                      className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-emerald-500 outline-none disabled:opacity-50"
                    >
                      <option value="">Pilih Desa</option>
                      {formKec && DATA_WILAYAH[formKec as keyof typeof DATA_WILAYAH].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Nama Kelompok (KTT) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama kelompok tani ternak"
                      value={formKtt}
                      onChange={(e) => setFormKtt(e.target.value)}
                      className="w-full min-h-touch h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Komoditas Ternak
                    </label>
                    <select
                      value={formJenis}
                      onChange={(e) => setFormJenis(e.target.value)}
                      className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-emerald-500 outline-none"
                    >
                      {DAFTAR_JENIS_TERNAK.map((j) => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Waktu Monev
                    </label>
                    <input
                      type="date"
                      value={formWaktuMonev}
                      onChange={(e) => setFormWaktuMonev(e.target.value)}
                      className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rincian Perkembangan Ternak */}
              <div className="space-y-4">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-600">
                  2. Rincian Mutasi &amp; Kondisi Ternak
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <KondisiSection nomor="a" title="Ternak Awal Bantuan" total={kalkulasi.a} totalLabel="Total Awal">
                    <BarisTernak
                      label="Awal"
                      jantan={formKondisi.awalJantan}
                      betina={formKondisi.awalBetina}
                      onJantan={(v: any) => updateKondisi('awalJantan', v)}
                      onBetina={(v: any) => updateKondisi('awalBetina', v)}
                    />
                  </KondisiSection>

                  <KondisiSection nomor="b" title="Kematian Ternak Pokok" total={kalkulasi.b} totalLabel="Total Mati">
                    <BarisTernak
                      label="Mati"
                      showBA
                      jantan={formKondisi.matiBangkaiJantan}
                      betina={formKondisi.matiBangkaiBetina}
                      ba={formKondisi.matiBangkaiBA}
                      onJantan={(v: any) => updateKondisi('matiBangkaiJantan', v)}
                      onBetina={(v: any) => updateKondisi('matiBangkaiBetina', v)}
                      onBA={(v: any) => updateKondisi('matiBangkaiBA', v)}
                    />
                  </KondisiSection>

                  <KondisiSection nomor="c" title="Penjualan Ternak Pokok" total={kalkulasi.c} totalLabel="Total Dijual">
                    <BarisTernak
                      label="Jual"
                      showBA
                      jantan={formKondisi.jualJantan}
                      betina={formKondisi.jualBetina}
                      ba={formKondisi.jualBA}
                      onJantan={(v: any) => updateKondisi('jualJantan', v)}
                      onBetina={(v: any) => updateKondisi('jualBetina', v)}
                      onBA={(v: any) => updateKondisi('jualBA', v)}
                    />
                  </KondisiSection>

                  <KondisiSection nomor="d" title="Pembelian / Penambahan" total={kalkulasi.d} totalLabel="Total Dibeli">
                    <BarisTernak
                      label="Beli"
                      jantan={formKondisi.beliJantan}
                      betina={formKondisi.beliBetina}
                      onJantan={(v: any) => updateKondisi('beliJantan', v)}
                      onBetina={(v: any) => updateKondisi('beliBetina', v)}
                    />
                  </KondisiSection>

                  <KondisiSection nomor="f" title="Kelahiran Anak" total={kalkulasi.f} totalLabel="Total Lahir">
                    <BarisTernak
                      label="Lahir"
                      jantan={formKondisi.lahirJantan}
                      betina={formKondisi.lahirBetina}
                      onJantan={(v: any) => updateKondisi('lahirJantan', v)}
                      onBetina={(v: any) => updateKondisi('lahirBetina', v)}
                    />
                  </KondisiSection>

                  <KondisiSection nomor="g" title="Kematian Anak Ternak" total={kalkulasi.g} totalLabel="Mati Anak">
                    <BarisTernak
                      label="Mati Anak"
                      jantan={formKondisi.matiAnakJantan}
                      betina={formKondisi.matiAnakBetina}
                      onJantan={(v: any) => updateKondisi('matiAnakJantan', v)}
                      onBetina={(v: any) => updateKondisi('matiAnakBetina', v)}
                    />
                  </KondisiSection>
                </div>

                {/* Total Summary Callout */}
                <div className="p-6 rounded-2xl border border-emerald-600/30 bg-emerald-600/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-sans font-bold uppercase tracking-wider text-emerald-600 block">
                      Hasil Kalkulasi Sistem
                    </span>
                    <p className="text-sm text-slate-700 font-medium">
                      Sisa Ternak Pokok (e): <span className="font-sans font-bold">{kalkulasi.e} Ekor</span> · Kelahiran (f): <span className="font-sans font-bold">{kalkulasi.f} Ekor</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-sans uppercase tracking-wider text-slate-500 font-semibold">
                      Total Aset Ternak Saat Ini (i)
                    </p>
                    <p className="font-sans text-3xl font-bold text-emerald-600">
                      {kalkulasi.i} <span className="text-sm font-normal text-slate-500">Ekor</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bukti GPS & Foto */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-600">
                  3. Verifikasi Lokasi GPS & Dokumentasi Foto
                </h4>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm"
                  >
                    <MapPin size={15} />
                    <span>{isGettingLocation ? 'Mencari Satelit GPS...' : 'Ambil Titik Koordinat'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={openCamera}
                    className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm"
                  >
                    <Camera size={15} />
                    <span>Buka Kamera</span>
                  </button>

                  <label className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer">
                    <ImageIcon size={15} />
                    <span>Unggah File Foto</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                {formLat && formLng && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 inline-block font-sans text-xs text-slate-700">
                    📍 Koordinat GPS: <span className="font-bold text-emerald-600">{formLat}, {formLng}</span>
                  </div>
                )}

                {formPhoto && (
                  <div className="pt-2">
                    <img src={formPhoto} alt="Dokumentasi" className="h-36 rounded-xl border border-slate-200 object-cover shadow-sm" />
                  </div>
                )}
              </div>

              {/* 4. Dokumen Berita Acara (PDF) */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="text-emerald-700" size={18} />
                    <h4 className="font-bold text-sm text-emerald-950">
                      4. Unggah Dokumen Berita Acara (PDF)
                    </h4>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200 font-semibold">
                    Opsional / Berita Acara
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika terdapat mutasi seperti kematian ternak pokok atau penjualan yang memiliki Berita Acara (BA), lampirkan dokumen resmi dalam format PDF di bawah ini (Maksimal 10 MB).
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="min-h-touch h-10 px-4 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors">
                    <FileText size={16} className="text-emerald-700" />
                    <span>{formPdfBA ? 'Ganti File PDF Berita Acara' : 'Pilih File Dokumen PDF'}</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfBAUpload}
                      className="hidden"
                    />
                  </label>

                  {formPdfBA && (
                    <button
                      type="button"
                      onClick={removePdfBA}
                      className="min-h-touch h-10 px-3.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>Hapus PDF</span>
                    </button>
                  )}
                </div>

                {formPdfBA && (
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {formPdfBAName || 'Berita_Acara_Monev.pdf'}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> File PDF Terlampir Siap Simpan
                        </p>
                      </div>
                    </div>

                    <a
                      href={formPdfBA}
                      download={formPdfBAName || 'Berita_Acara.pdf'}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-touch h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Download size={14} />
                      <span>Unduh / Pratinjau</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Catatan Petugas Lapangan
                </label>
                <textarea
                  rows={3}
                  placeholder="Kondisi kesehatan kandang, kendala pakan, atau keterangan lain..."
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-emerald-500 focus:bg-white outline-none"
                />
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="min-h-touch h-11 px-5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="min-h-touch h-11 px-6 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
                >
                  {editingId ? 'Perbarui Data Lapangan' : 'Simpan Data Lapangan'}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ── TAB 3: ARSIP EXCEL ── */}
        {activeTab === 'excel' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Arsip Dokumen Rekapitulasi Excel
                </h3>
                <p className="text-xs text-slate-500">
                  Unggah atau tinjau file rekap Excel resmi per tahun bantuan
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={tahunExcel}
                  onChange={(e) => setTahunExcel(e.target.value)}
                  className="min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:border-emerald-500 outline-none"
                >
                  {DAFTAR_TAHUN.map((th) => (
                    <option key={th} value={th}>Tahun {th}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50/60 text-center relative hover:bg-slate-100/60 transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx, .xls"
                onClick={handleExcelClick}
                onChange={handleExcelUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-800">
                {activeExcel ? `File Tersimpan: ${activeExcel.fileName}` : `Unggah File Excel Tahun ${tahunExcel}`}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {activeExcel ? 'Klik untuk menimpa file ini (membutuhkan otorisasi password)' : 'Pilih file .xlsx atau .xls dari komputer Anda'}
              </p>
            </div>

            {activeExcel && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleDeleteExcel}
                  className="min-h-touch h-9 px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  Hapus File Excel Tahun {tahunExcel}
                </button>
              </div>
            )}

            {/* Viewer */}
            <style dangerouslySetInnerHTML={{ __html: `.excel-viewer table { width: 100%; border-collapse: collapse; font-size: 12px; } .excel-viewer td, .excel-viewer th { border: 1px solid #e2e8f0; padding: 8px 12px; white-space: nowrap; }` }} />
            {activeExcel ? (
              <div className="overflow-x-auto max-h-80 rounded-xl border border-slate-200 excel-viewer bg-white" dangerouslySetInnerHTML={{ __html: activeExcel.htmlTable }} />
            ) : (
              <p className="text-center text-slate-400 text-xs font-medium py-8">
                Belum ada berkas Excel tersimpan untuk Tahun {tahunExcel}.
              </p>
            )}
          </div>
        )}

      </main>

      {/* ── MODAL KAMERA ── */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-center text-base">Ambil Foto Lapangan</h3>
            <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={takePhoto}
                className="flex-1 min-h-touch h-11 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700"
              >
                📸 Ambil Foto
              </button>
              <button
                type="button"
                onClick={closeCamera}
                className="min-h-touch h-11 px-5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}