'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  ArrowLeft,
  Download,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Layers,
  Phone,
  MapPin,
  ShieldCheck,
  Building2,
  Filter,
} from 'lucide-react';

// Data JSON Pelaku Usaha Pemotongan Hewan (101 Entri Awal)
const initialDataRph = [
  {
    no: 1,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Tratas Rt 03 Rw 01, Desa Sidomukti, Kec. Kuwarasan, Kab. Kebumen',
    nama_tph_r_u: 'RPU Pangestu',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Mahfanda Aldin',
    no_telp: '087735300037',
    status_ijin_usaha: '',
    lokasi_rpu:
      'Tratas Rt 03 Rw 01, Desa Sidomukti, Kec. Kuwarasan, Kab. Kebumen',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'Sudah (Disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 2,
    lokasi_desa_kecamatan_alamat_pemilik: 'Sidoagung',
    nama_tph_r_u: 'Haryanto',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Haryanto',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: '',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 3,
    lokasi_desa_kecamatan_alamat_pemilik: 'Desa Sidoagung, Kec. Sruweng',
    nama_tph_r_u: 'RPU ASRIYAH',
    jenis_unit_usaha: 'RPU',
    pemilik: 'Asriyah',
    no_telp: '85156338895',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dusun Pacalbalung,Desa Sidoagung, Kec. Sruweng, Kab Kebumen',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'Sudah (disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 4,
    lokasi_desa_kecamatan_alamat_pemilik: 'Desa Sidoagung, Kec. Sruweng',
    nama_tph_r_u: 'RPU ZAIN',
    jenis_unit_usaha: 'RPU',
    pemilik: 'Mugiarti',
    no_telp: '81329706588',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dusun Pacalbalung,Desa Sidoagung, Kec. Sruweng, Kab Kebumen',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'Sudah (disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 5,
    lokasi_desa_kecamatan_alamat_pemilik: 'Desa Sidoagung, Kec. Sruweng',
    nama_tph_r_u: 'RPU FITRIA',
    jenis_unit_usaha: 'RPU',
    pemilik: 'Muhajir',
    no_telp: '81327051625',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dusun Pacalbalung,Desa Sidoagung, Kec. Sruweng, Kab Kebumen',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'Sudah (disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 6,
    lokasi_desa_kecamatan_alamat_pemilik: 'Sido gede',
    nama_tph_r_u: 'Ayam Broiler Segar Prembun',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Diana Herdiana Wati',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Sidogede Prembun',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'ada',
    sertifikat_nkv: '-',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 7,
    lokasi_desa_kecamatan_alamat_pemilik: 'Sidogede',
    nama_tph_r_u: 'Pak Muslim',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Muslim',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Sidogede Rt 03 / Rw 01',
    pemotongan_per_hari_ekor: '35',
    sertifikat_halal: '',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '2100',
  },
  {
    no: 8,
    lokasi_desa_kecamatan_alamat_pemilik: 'Kabuaran',
    nama_tph_r_u: 'Pak giman',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Giman',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Kepek Kabuaran Prembun',
    pemotongan_per_hari_ekor: '30',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1800',
  },
  {
    no: 9,
    lokasi_desa_kecamatan_alamat_pemilik: 'Karanganyar',
    nama_tph_r_u: 'Kios Ayam Nugraha',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Siti Aminah',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Karanganyar',
    pemotongan_per_hari_ekor: '200',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '12000',
  },
  {
    no: 10,
    lokasi_desa_kecamatan_alamat_pemilik: 'Karanganyar',
    nama_tph_r_u: 'Pemotongan Ayam Zain',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Mugiarti',
    no_telp: '81329706588',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Karanganyar',
    pemotongan_per_hari_ekor: '200',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '12000',
  },
  {
    no: 11,
    lokasi_desa_kecamatan_alamat_pemilik: 'Karanganyar',
    nama_tph_r_u: 'Ayam Potong Bu Asriyah',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Asriyah',
    no_telp: '85156338895',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Karanganyar',
    pemotongan_per_hari_ekor: '200',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '12000',
  },
  {
    no: 12,
    lokasi_desa_kecamatan_alamat_pemilik: 'Karanganyar',
    nama_tph_r_u: 'Pemotongan Ayam Bu Pon',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Turisman',
    no_telp: '81391636730',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Karanganyar',
    pemotongan_per_hari_ekor: '200',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '12000',
  },
  {
    no: 13,
    lokasi_desa_kecamatan_alamat_pemilik: 'Sidomulyo, Karanganyar',
    nama_tph_r_u: 'RPU TURISMAN',
    jenis_unit_usaha: 'RPU',
    pemilik: 'Turisman',
    no_telp: '81391636730',
    status_ijin_usaha: '',
    lokasi_rpu: 'Sidomulyo, Desa Sidomulyo, Kec.Karanganyar, Kab Kebumen',
    pemotongan_per_hari_ekor: '200',
    sertifikat_halal: 'sudah (disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '12000',
  },
  {
    no: 14,
    lokasi_desa_kecamatan_alamat_pemilik: 'Semanding',
    nama_tph_r_u: 'H Paiman',
    jenis_unit_usaha: 'TPH-R',
    pemilik: '',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Jl.Potongan , Desa Semanding',
    pemotongan_per_hari_ekor: '2',
    sertifikat_halal: 'ada',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '30',
  },
  {
    no: 15,
    lokasi_desa_kecamatan_alamat_pemilik: 'Gombong',
    nama_tph_r_u: 'H Manisman',
    jenis_unit_usaha: 'TPH-R',
    pemilik: '',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pemotongan di RPH',
    pemotongan_per_hari_ekor: '1',
    sertifikat_halal: 'ada',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '15',
  },
  {
    no: 16,
    lokasi_desa_kecamatan_alamat_pemilik: 'Gombong',
    nama_tph_r_u: 'Pak Elim',
    jenis_unit_usaha: 'TPH-B',
    pemilik: '',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pemotongan di RPH',
    pemotongan_per_hari_ekor: '1',
    sertifikat_halal: 'TPH B',
    sertifikat_nkv: 'tidak',
    rata2_produksi_per_bulan_kg: '10',
  },
  {
    no: 17,
    lokasi_desa_kecamatan_alamat_pemilik: 'Gombong',
    nama_tph_r_u: 'Pak Intras',
    jenis_unit_usaha: 'TPH-B',
    pemilik: '',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pemotongan di RPH',
    pemotongan_per_hari_ekor: '1',
    sertifikat_halal: 'TPH B',
    sertifikat_nkv: 'tidak',
    rata2_produksi_per_bulan_kg: '10',
  },
  {
    no: 18,
    lokasi_desa_kecamatan_alamat_pemilik: 'Desa Wonokriyo/Kec. Gombong',
    nama_tph_r_u: 'RPU CABUT BULU DAN POTONGAN AYAM ANDRI',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Andriyanto',
    no_telp: '081326965865',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Gombong',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'sudah (disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 19,
    lokasi_desa_kecamatan_alamat_pemilik: 'Gombong',
    nama_tph_r_u: 'Pemotongan mAs Arief',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Arief Jami Faisal',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Gombong',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 20,
    lokasi_desa_kecamatan_alamat_pemilik: 'Desa Kemukus, Kec. Gombong',
    nama_tph_r_u: 'RPU PAK BAMBANG',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Sudarmiya Tiningsih',
    no_telp: '085878748120',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Gombong',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'sudah (disperindag',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 21,
    lokasi_desa_kecamatan_alamat_pemilik: 'Gombong',
    nama_tph_r_u: 'RPA FAIZ',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Faizatul Fuadah',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Gombong',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 22,
    lokasi_desa_kecamatan_alamat_pemilik: 'Gombong',
    nama_tph_r_u: 'RPA Pangestu',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Mahfanda Aldin',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Gombong',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 23,
    lokasi_desa_kecamatan_alamat_pemilik: 'Semanding, Gombong',
    nama_tph_r_u: 'RPH Gombong',
    jenis_unit_usaha: 'RPH',
    pemilik: '',
    no_telp: '082135423674 (drh. Rizki) 081802695072 (drh. Suci)',
    status_ijin_usaha: '',
    lokasi_rpu: 'jl. Potongan Semanding satu, Desa Semanding, Kec. Gombong',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'sudah',
    sertifikat_nkv: 'proses',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 24,
    lokasi_desa_kecamatan_alamat_pemilik: 'Sadang Kulon/ Sadang',
    nama_tph_r_u: 'Bp. Suyit',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Bp. Suyit',
    no_telp: '085956379134',
    status_ijin_usaha: 'belum',
    lokasi_rpu: 'dk. Kalipetir 04/03, Sadangkulon',
    pemotongan_per_hari_ekor: '75-100',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '6000',
  },
  {
    no: 25,
    lokasi_desa_kecamatan_alamat_pemilik: 'Sadang Kulon/ Sadang',
    nama_tph_r_u: 'Sutijah',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Sutijah',
    no_telp: '085215948968',
    status_ijin_usaha: 'belum',
    lokasi_rpu: 'sadangkulon, sadang',
    pemotongan_per_hari_ekor: '30',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1800',
  },
  {
    no: 26,
    lokasi_desa_kecamatan_alamat_pemilik: 'Banioro/Karangsambung',
    nama_tph_r_u: 'Ayam Potong Bu. Salamah',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Salamah',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Jalan, Panjer, Banioro, Karangsambung, Kebumen Regency, Centr',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 27,
    lokasi_desa_kecamatan_alamat_pemilik: 'Langse/Karangsambung',
    nama_tph_r_u: 'Kasim Broiler',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Kasim',
    no_telp: '082133090079',
    status_ijin_usaha: 'belum',
    lokasi_rpu: 'dukuh gelagah amba rt 2 rw 2, Langse',
    pemotongan_per_hari_ekor: '60 s/d 70',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 28,
    lokasi_desa_kecamatan_alamat_pemilik: 'Balingasal',
    nama_tph_r_u: 'Pak Sakiman',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Sakiman',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dusun Kenayan RT 2 / RW 1, desa Balingasal',
    pemotongan_per_hari_ekor: '35',
    sertifikat_halal: 'ada',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '2100',
  },
  {
    no: 29,
    lokasi_desa_kecamatan_alamat_pemilik: 'Korowelang',
    nama_tph_r_u: 'Pemotongan Ayam Subhan',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Subhan',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Korowelang',
    pemotongan_per_hari_ekor: '15',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '900',
  },
  {
    no: 30,
    lokasi_desa_kecamatan_alamat_pemilik: 'Mekarsari',
    nama_tph_r_u: 'Pemotongan Ayam Rasiyo',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Rasiyo (Nasir Machmud /anak)',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Duduhan RT 3 RW 3 Mekarsari',
    pemotongan_per_hari_ekor: '100',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '6000',
  },
  {
    no: 31,
    lokasi_desa_kecamatan_alamat_pemilik: 'Tanjungsari',
    nama_tph_r_u: 'Nur Taufik',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Nur Taufik',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Tanjungsari',
    pemotongan_per_hari_ekor: '80',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '4800',
  },
  {
    no: 32,
    lokasi_desa_kecamatan_alamat_pemilik: 'Tanjungsari',
    nama_tph_r_u: 'Umam',
    jenis_unit_usaha: '',
    pemilik: 'Umam',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Tanjungsari',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 33,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Duduhan, Desa Mekarsari, Kec. Kutowinangun, Kab. Kebumen',
    nama_tph_r_u: 'RPU ABS PREMBUN',
    jenis_unit_usaha: 'RPU',
    pemilik: 'Diana Herdiyana Wati',
    no_telp: '081333591994',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Kutowinangun',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'sudah (disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '0',
  },
  {
    no: 34,
    lokasi_desa_kecamatan_alamat_pemilik: 'Korowelang',
    nama_tph_r_u: 'Manisah',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Manisah',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Korowelang',
    pemotongan_per_hari_ekor: '25',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1500',
  },
  {
    no: 35,
    lokasi_desa_kecamatan_alamat_pemilik: 'Mekarsari',
    nama_tph_r_u: 'Mohamad Tulud',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Mohamad Tulud',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Duduhan RT 2/ RW 3 Mekarsari',
    pemotongan_per_hari_ekor: '25',
    sertifikat_halal: '-',
    sertifikat_nkv: '-',
    rata2_produksi_per_bulan_kg: '1500',
  },
  {
    no: 36,
    lokasi_desa_kecamatan_alamat_pemilik: 'Mekarsari',
    nama_tph_r_u: 'Bambang Ismanto',
    jenis_unit_usaha: '',
    pemilik: 'Bambang Ismanto',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Duduhan RT 2/ RW 3 Mekarsari',
    pemotongan_per_hari_ekor: '20',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1200',
  },
  {
    no: 37,
    lokasi_desa_kecamatan_alamat_pemilik: 'Mekarsari',
    nama_tph_r_u: 'Hj. Roisah',
    jenis_unit_usaha: '',
    pemilik: 'Hj. Roisah',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Duduhan RT 2/ RW 3 Mekarsari',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 38,
    lokasi_desa_kecamatan_alamat_pemilik: 'Mekarsari',
    nama_tph_r_u: 'Toha Salim',
    jenis_unit_usaha: '',
    pemilik: 'Toha Salim',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Kuwaon RT 2/ RW 1 Mekarsari',
    pemotongan_per_hari_ekor: '60',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3600',
  },
  {
    no: 39,
    lokasi_desa_kecamatan_alamat_pemilik: 'Mekarsari',
    nama_tph_r_u: 'Ismiatun',
    jenis_unit_usaha: '',
    pemilik: 'Ismiatun',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Patokan 3/4 Mekarsari',
    pemotongan_per_hari_ekor: '25',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1500',
  },
  {
    no: 40,
    lokasi_desa_kecamatan_alamat_pemilik: 'Kewayuhan',
    nama_tph_r_u: '',
    jenis_unit_usaha: 'TPH-R',
    pemilik: 'Bakir Sutopo',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Kewayuhan',
    pemotongan_per_hari_ekor: '1',
    sertifikat_halal: 'ada (disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '10',
  },
  {
    no: 41,
    lokasi_desa_kecamatan_alamat_pemilik: 'Kewayuhan',
    nama_tph_r_u: '',
    jenis_unit_usaha: 'TPH-R',
    pemilik: 'Supriyadi',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Kewayuhan',
    pemotongan_per_hari_ekor: '1',
    sertifikat_halal: 'ada (diseprindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '10',
  },
  {
    no: 42,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Dukuh Mertokondo, Rt. 004/Rw004, Desa Kutosari Kebumen',
    nama_tph_r_u: 'RPU SUPER BAROKAH',
    jenis_unit_usaha: 'RPU',
    pemilik: 'Syamsul Kurnia',
    no_telp: '082324259345',
    status_ijin_usaha: 'ada',
    lokasi_rpu: 'Dk. Krajan Rt.001/Rw 001 Desa Kedawung Pejagoan',
    pemotongan_per_hari_ekor: '500',
    sertifikat_halal: 'ID33110021067310125',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '30000',
  },
  {
    no: 43,
    lokasi_desa_kecamatan_alamat_pemilik: 'Wonotirto',
    nama_tph_r_u: '',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Supriyono',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Karanggayam',
    pemotongan_per_hari_ekor: '25',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1500',
  },
  {
    no: 44,
    lokasi_desa_kecamatan_alamat_pemilik: 'Mergosono',
    nama_tph_r_u: 'Sugaianto',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Sugianto',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: '',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '-',
  },
  {
    no: 45,
    lokasi_desa_kecamatan_alamat_pemilik: 'Arjowinangun',
    nama_tph_r_u: 'RPU Bapak Hamid (Pak Lurah)',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Hamid',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: '',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '-',
  },
  {
    no: 46,
    lokasi_desa_kecamatan_alamat_pemilik: 'Buluspesantren',
    nama_tph_r_u: 'Setrojenar',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Bp. Sihim',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'setrojenar',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '-',
  },
  {
    no: 47,
    lokasi_desa_kecamatan_alamat_pemilik: 'Buayan',
    nama_tph_r_u: 'Pangestu Broiler',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Wakhidin',
    no_telp: '0821-3922-5865',
    status_ijin_usaha: '',
    lokasi_rpu: 'Meto lor 1/4 Rogodadi, Buayan, Kebumen',
    pemotongan_per_hari_ekor: '8000',
    sertifikat_halal: 'ID33110024117160725',
    sertifikat_nkv: 'Berproses',
    rata2_produksi_per_bulan_kg: '480000',
  },
  {
    no: 48,
    lokasi_desa_kecamatan_alamat_pemilik: 'Jladri',
    nama_tph_r_u: 'Saludin',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Saludin',
    no_telp: '0821-3782-2233',
    status_ijin_usaha: '',
    lokasi_rpu: 'Desa Jladri Kecamatan Buayan',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 49,
    lokasi_desa_kecamatan_alamat_pemilik: 'Jladri',
    nama_tph_r_u: 'Sodik',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Sodik',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Desa Jladri Kecamatan Buayan',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 50,
    lokasi_desa_kecamatan_alamat_pemilik: 'Mergosono',
    nama_tph_r_u: 'Sugaianto',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Sugianto',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: '',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '0',
  },
  {
    no: 51,
    lokasi_desa_kecamatan_alamat_pemilik: 'Sikayu',
    nama_tph_r_u: '',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Suwarni',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: '',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '0',
  },
  {
    no: 52,
    lokasi_desa_kecamatan_alamat_pemilik: 'Kalijaya, Alian',
    nama_tph_r_u: 'RPU Sucipto',
    jenis_unit_usaha: 'RPU',
    pemilik: 'Sucipto',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Delisen, Kalijaya',
    pemotongan_per_hari_ekor: '5000',
    sertifikat_halal: 'ada',
    sertifikat_nkv: 'Tingkat III',
    rata2_produksi_per_bulan_kg: '300000',
  },
  {
    no: 53,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Dusun Delisen, Desa Kalijaya, Kec. Alian, Kab. Kebumen',
    nama_tph_r_u: 'RPU UD  Wahyu Jaya',
    jenis_unit_usaha: 'RPU',
    pemilik: 'Suratman',
    no_telp: '081548338303',
    status_ijin_usaha: 'sudah',
    lokasi_rpu: 'Dk Delisen Rt 02/Rw 01; Aneka Usaha',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: 'No:MUI-LPPOM-1502114930723 Tanggal 7 Juli 2023',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 54,
    lokasi_desa_kecamatan_alamat_pemilik: 'Surotrunan, Alian',
    nama_tph_r_u: 'Ahmad broiler',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Ahmad',
    no_telp: '082322951116',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dk kebebekan surotrunan',
    pemotongan_per_hari_ekor: '45',
    sertifikat_halal: 'Belum',
    sertifikat_nkv: 'Belum',
    rata2_produksi_per_bulan_kg: '2700',
  },
  {
    no: 55,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Desa Jatimulyo Rt 04/Rw04, Kecamatan Alian, Kab. Kebumen',
    nama_tph_r_u: 'RPU KEBUMEN JAYA FARM',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Wahyu sugiantoro',
    no_telp: '081327417131',
    status_ijin_usaha: 'sudah',
    lokasi_rpu: 'dk Jatimalang, Jatimulyo',
    pemotongan_per_hari_ekor: '100',
    sertifikat_halal: 'sudah',
    sertifikat_nkv: 'Proses',
    rata2_produksi_per_bulan_kg: '6000',
  },
  {
    no: 56,
    lokasi_desa_kecamatan_alamat_pemilik: 'Karangkembang',
    nama_tph_r_u: 'Kharisun',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Kharisun',
    no_telp: '082133336550',
    status_ijin_usaha: 'belum',
    lokasi_rpu: 'dk. Era 2/1 Karangkembang',
    pemotongan_per_hari_ekor: '75',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '4500',
  },
  {
    no: 57,
    lokasi_desa_kecamatan_alamat_pemilik: '',
    nama_tph_r_u: '',
    jenis_unit_usaha: '',
    pemilik: '',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: '',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '',
    sertifikat_nkv: '',
    rata2_produksi_per_bulan_kg: '',
  },
  {
    no: 58,
    lokasi_desa_kecamatan_alamat_pemilik: 'Surotrunan, Alian',
    nama_tph_r_u: 'Hangry',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Topan Ali Purba',
    no_telp: '082137164182',
    status_ijin_usaha: 'belum',
    lokasi_rpu: 'dk kebebekan 3/4 Surotrunan',
    pemotongan_per_hari_ekor: '40',
    sertifikat_halal: 'belum',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '2400',
  },
  {
    no: 59,
    lokasi_desa_kecamatan_alamat_pemilik: 'Ambalresmi, Ambal',
    nama_tph_r_u: 'Kaswardiyanto',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Kaswardiyanto',
    no_telp: '081805879319',
    status_ijin_usaha: '',
    lokasi_rpu: 'Ambalresmi, Ambal',
    pemotongan_per_hari_ekor: '40',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '2400',
  },
  {
    no: 60,
    lokasi_desa_kecamatan_alamat_pemilik: 'Ambalresmi, Ambal',
    nama_tph_r_u: 'Sugito',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Sugito',
    no_telp: '085799329023',
    status_ijin_usaha: '',
    lokasi_rpu: 'Ambalresmi, Ambal',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 61,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Desa Sumberjati, Rt03/Rw04, Kec. Ambal, Kab. Kebumen',
    nama_tph_r_u: 'KARENZ BROILER',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Karyanto',
    no_telp: '082223585456',
    status_ijin_usaha: '',
    lokasi_rpu: 'Sumberjati, Ambal',
    pemotongan_per_hari_ekor: '1200',
    sertifikat_halal: 'sudah (disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '72000',
  },
  {
    no: 62,
    lokasi_desa_kecamatan_alamat_pemilik: 'Blengorwetan, Ambal',
    nama_tph_r_u: 'Jihan Broiler',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Tunut',
    no_telp: '085759006750',
    status_ijin_usaha: '',
    lokasi_rpu: 'Blengorwetan, Ambal',
    pemotongan_per_hari_ekor: '300',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '18000',
  },
  {
    no: 63,
    lokasi_desa_kecamatan_alamat_pemilik: 'Blengorkulon, Ambal',
    nama_tph_r_u: 'Anugrah Broiler',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'H. Warisman',
    no_telp: '088220129838',
    status_ijin_usaha: '',
    lokasi_rpu: 'Blengorkulon, Ambal',
    pemotongan_per_hari_ekor: '40',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '2400',
  },
  {
    no: 64,
    lokasi_desa_kecamatan_alamat_pemilik: 'Selotumpeng, Mirit',
    nama_tph_r_u: 'MS Suyat',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Rusdiyono',
    no_telp: '085292825369',
    status_ijin_usaha: '',
    lokasi_rpu: 'Selotumpeng, Mirit',
    pemotongan_per_hari_ekor: '300',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '18000',
  },
  {
    no: 65,
    lokasi_desa_kecamatan_alamat_pemilik: 'Wergonayan, Mirit',
    nama_tph_r_u: 'Rudy',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Rudy',
    no_telp: '081393717244',
    status_ijin_usaha: '',
    lokasi_rpu: 'Wergonayan, Mirit',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 66,
    lokasi_desa_kecamatan_alamat_pemilik: 'Tlogopragoto',
    nama_tph_r_u: 'Sri Fajar Komsiati',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Sri Fajar Komsiati',
    no_telp: '083120496479',
    status_ijin_usaha: '',
    lokasi_rpu: 'Tlogopragoto, Mirit',
    pemotongan_per_hari_ekor: '40',
    sertifikat_halal: '',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '2400',
  },
  {
    no: 67,
    lokasi_desa_kecamatan_alamat_pemilik: 'Adimulyo',
    nama_tph_r_u: 'PT. Nindya',
    jenis_unit_usaha: 'TPH-U',
    pemilik: 'Takhrir / Katamsi',
    no_telp: '081330535616',
    status_ijin_usaha: '',
    lokasi_rpu: 'Desa Mangunharjo rt06/04 Adimulyo',
    pemotongan_per_hari_ekor: '10000',
    sertifikat_halal: 'sudah',
    sertifikat_nkv: 'Berproses',
    rata2_produksi_per_bulan_kg: '600000',
  },
  {
    no: 68,
    lokasi_desa_kecamatan_alamat_pemilik: 'Adimulyo',
    nama_tph_r_u: 'TPH Avika Farm',
    jenis_unit_usaha: 'TPH-R',
    pemilik: 'Nugroho Wisnu B',
    no_telp: '087715478640',
    status_ijin_usaha: '',
    lokasi_rpu: 'Kemujan, Adimulyo',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '0',
  },
  {
    no: 69,
    lokasi_desa_kecamatan_alamat_pemilik: 'Sitiadi',
    nama_tph_r_u: 'RPHU PT. Cemerlang Unggas Lestari',
    jenis_unit_usaha: 'RPU',
    pemilik: 'milik PT',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'jl. Puring-Gombong No. 117 Area sawah, Sitiadi',
    pemotongan_per_hari_ekor: '7500',
    sertifikat_halal: 'ada',
    sertifikat_nkv: 'RPH-U 330503-237',
    rata2_produksi_per_bulan_kg: '450000',
  },
  {
    no: 70,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Puring Kulon Rt.03/Rw 02, Desa Sitiadi, Kec. Puring, Kab. Kebumen',
    nama_tph_r_u: 'RPU NUGRAHA',
    jenis_unit_usaha: 'RPU',
    pemilik: 'Siti Aminatun',
    no_telp: '08122725614',
    status_ijin_usaha: '',
    lokasi_rpu:
      'Puring Kulon Rt.03/Rw 02, Desa Sitiadi, Kec. Puring, Kab. Kebumen',
    pemotongan_per_hari_ekor: '',
    sertifikat_halal: 'sudah(disperindag)',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '0',
  },
  {
    no: 71,
    lokasi_desa_kecamatan_alamat_pemilik: 'Demangsari RT 1 RW 2, Ayah',
    nama_tph_r_u: 'RPA Satar Chicken',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Satar',
    no_telp: '081327366729',
    status_ijin_usaha: '',
    lokasi_rpu: 'Demangsari RT 1 RW 2',
    pemotongan_per_hari_ekor: '250',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '15000',
  },
  {
    no: 72,
    lokasi_desa_kecamatan_alamat_pemilik: 'Pasar Rwowokele',
    nama_tph_r_u: 'Az Zahra Broiler',
    jenis_unit_usaha: 'TPu',
    pemilik: 'Lili Riyanti',
    no_telp: '085750460866',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Rowokele',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 73,
    lokasi_desa_kecamatan_alamat_pemilik: 'Bejiruyung, Sempor',
    nama_tph_r_u: 'Barokah',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Pak Supri / Najwa',
    no_telp: '082220429508',
    status_ijin_usaha: '',
    lokasi_rpu: 'Jl. Kaligandu, RT 03/1 Bejiruyung, sempor',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 74,
    lokasi_desa_kecamatan_alamat_pemilik: 'Semanding RT 4/4',
    nama_tph_r_u: 'Pak Kadar',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Pak Kadar',
    no_telp: '81328267114',
    status_ijin_usaha: '',
    lokasi_rpu: 'Semanding RT 4/4',
    pemotongan_per_hari_ekor: '100',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '6000',
  },
  {
    no: 75,
    lokasi_desa_kecamatan_alamat_pemilik: 'Semanding RT 4/4',
    nama_tph_r_u: 'Sumber Rejeki',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Nurfiya',
    no_telp: '85645112119',
    status_ijin_usaha: '',
    lokasi_rpu: 'Karanggayam RT 7 RW 5',
    pemotongan_per_hari_ekor: '35',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '2100',
  },
  {
    no: 76,
    lokasi_desa_kecamatan_alamat_pemilik: 'Karanggayam RT 7 RW 5',
    nama_tph_r_u: 'Bu surya',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Surya',
    no_telp: '81385644372',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dukung Klangon RT 02 RW Desa Sidoagung , Karanganyar',
    pemotongan_per_hari_ekor: '250',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '15000',
  },
  {
    no: 77,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Dukung Klangon RT 02 RW Desa Sidoagung , Karanganyar',
    nama_tph_r_u: 'Muslimin',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Muslimin',
    no_telp: '82225977197',
    status_ijin_usaha: '',
    lokasi_rpu: 'Kewayuhan Dukuh Taleban RT 02 w 03',
    pemotongan_per_hari_ekor: '400',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '24000',
  },
  {
    no: 78,
    lokasi_desa_kecamatan_alamat_pemilik: 'Kewayuhan Dukuh Taleban RT 02 w 03',
    nama_tph_r_u: 'Barokah',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Bambang',
    no_telp: '8871379029',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dk Pernak 1/3 Kedungwinangun',
    pemotongan_per_hari_ekor: '25',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1500',
  },
  {
    no: 79,
    lokasi_desa_kecamatan_alamat_pemilik: 'Dk Pernak 1/3 Kedungwinangun',
    nama_tph_r_u: 'Sari Pitik',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Agus',
    no_telp: '85227010232',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dk Rendeng 1/3 Sidomulyo',
    pemotongan_per_hari_ekor: '250',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '15000',
  },
  {
    no: 80,
    lokasi_desa_kecamatan_alamat_pemilik: 'Dk Rendeng 1/3 Sidomulyo',
    nama_tph_r_u: 'Ayam Kembar',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Sulam Taufik',
    no_telp: '0852-1594-8968',
    status_ijin_usaha: '',
    lokasi_rpu: 'DK. Siluk 3/4 Sadangkulon',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 81,
    lokasi_desa_kecamatan_alamat_pemilik: 'DK. Siluk 3/4 Sadangkulon',
    nama_tph_r_u: 'Bu Salamah',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Salamah',
    no_telp: '0813 9111 7359',
    status_ijin_usaha: '',
    lokasi_rpu: 'Desa Banioro',
    pemotongan_per_hari_ekor: '25',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1500',
  },
  {
    no: 82,
    lokasi_desa_kecamatan_alamat_pemilik: 'Desa Banioro',
    nama_tph_r_u: 'Karminah',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Karminah',
    no_telp: '83862269875',
    status_ijin_usaha: '',
    lokasi_rpu: 'karang cangkring rt 03 rw 02 tlogorejo bonorowo',
    pemotongan_per_hari_ekor: '25',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1500',
  },
  {
    no: 83,
    lokasi_desa_kecamatan_alamat_pemilik:
      'karang cangkring rt 03 rw 02 tlogorejo bonorowo',
    nama_tph_r_u: 'Surip',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Surip',
    no_telp: '087872456892',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dk Kranggan RT 3 RW 4 Desa Prembun, Kec.Prembun',
    pemotongan_per_hari_ekor: '5',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '300',
  },
  {
    no: 84,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Dk Kranggan RT 3 RW 4 Desa Prembun, Kec.Prembun',
    nama_tph_r_u: 'Berkah Lestari',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Mugiem',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Padureso',
    pemotongan_per_hari_ekor: '850',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '51000',
  },
  {
    no: 85,
    lokasi_desa_kecamatan_alamat_pemilik: 'Padureso',
    nama_tph_r_u: 'Puji Astuti',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Puji Astuti',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Ungaran RT 2 RW 5 Kec.Kutowinangun',
    pemotongan_per_hari_ekor: '13',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '780',
  },
  {
    no: 86,
    lokasi_desa_kecamatan_alamat_pemilik: 'Ungaran RT 2 RW 5 Kec.Kutowinangun',
    nama_tph_r_u: 'Lembu Mas',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Nanang',
    no_telp: '88238400692',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Wonokriyo / Kalitengah',
    pemotongan_per_hari_ekor: '15',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '900',
  },
  {
    no: 87,
    lokasi_desa_kecamatan_alamat_pemilik: 'Pasar Wonokriyo / Kalitengah',
    nama_tph_r_u: 'Pak Wakhidin',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Ibu Ginah',
    no_telp: '81226338781',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Wonokriyo / Somagede',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 88,
    lokasi_desa_kecamatan_alamat_pemilik: 'Pasar Wonokriyo / Somagede',
    nama_tph_r_u: 'Siti Mutmainah (RPU AHM kutowinangun)',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Mas Didin',
    no_telp: '',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Tumenggungan',
    pemotongan_per_hari_ekor: '100',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '6000',
  },
  {
    no: 89,
    lokasi_desa_kecamatan_alamat_pemilik: 'Pasar Tumenggungan',
    nama_tph_r_u: 'badriyah ( kuwayuhan)',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Suwarti',
    no_telp: '82220150054',
    status_ijin_usaha: '',
    lokasi_rpu: 'Pasar Tumenggungan',
    pemotongan_per_hari_ekor: '30',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1800',
  },
  {
    no: 90,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Arjowinangun RT 2 / 2, Buluspesantren',
    nama_tph_r_u: 'RPU New Broiler',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Atik Muhimatun / Hamid',
    no_telp: '85747313332',
    status_ijin_usaha: '',
    lokasi_rpu: 'Arjowinangun RT 2 / 2, Buluspesantren',
    pemotongan_per_hari_ekor: '100',
    sertifikat_halal: 'halal',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '3000',
  },
  {
    no: 91,
    lokasi_desa_kecamatan_alamat_pemilik: 'Krajan RT 3 /1, Padureso',
    nama_tph_r_u: 'Subur Jaya',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Subur Gunawan',
    no_telp: '81573654703',
    status_ijin_usaha: '',
    lokasi_rpu: 'Krajan RT 3 /1, Padureso',
    pemotongan_per_hari_ekor: '30',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '900',
  },
  {
    no: 92,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Sidobunder, RT 1 RW 1, Puring, Kebumen',
    nama_tph_r_u: 'Adem Ayem',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Septiana Retno Lestari',
    no_telp: '895329231822',
    status_ijin_usaha: '',
    lokasi_rpu: 'Sidobunder, RT 1 RW 1, Puring, Kebumen',
    pemotongan_per_hari_ekor: '30',
    sertifikat_halal: 'halal',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '900',
  },
  {
    no: 93,
    lokasi_desa_kecamatan_alamat_pemilik: 'Tamanwinangun RT 3 RW 5',
    nama_tph_r_u: 'Kencleng',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Dani Riyadi',
    no_telp: '82329355617',
    status_ijin_usaha: '',
    lokasi_rpu: 'Tamanwinangun RT 3 RW 5',
    pemotongan_per_hari_ekor: '30',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '900',
  },
  {
    no: 94,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Jl. Pemandian Barat Dk. Era, Karangkembang, Alian',
    nama_tph_r_u: 'Ayam Potong Pak Kharisun',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Kharisun',
    no_telp: '88227219400',
    status_ijin_usaha: '',
    lokasi_rpu:
      '/ Pasar Sruni /Jl. Pemandian Barat Dk. Era, Karangkembang, Alian',
    pemotongan_per_hari_ekor: '3-',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '900',
  },
  {
    no: 95,
    lokasi_desa_kecamatan_alamat_pemilik:
      'Dk. Taleban RT 2 RW 3, Kuwayuhan, Pejagoan',
    nama_tph_r_u: 'Muslimin',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Muslimin',
    no_telp: '08225977197/087790034000',
    status_ijin_usaha: '',
    lokasi_rpu: 'Dk. Taleban RT 2 RW 3, Kuwayuhan, Pejagoan',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: 'halal',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1500',
  },
  {
    no: 96,
    lokasi_desa_kecamatan_alamat_pemilik: 'Tlogopragoto, Mirit',
    nama_tph_r_u: 'Supriyono',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Supriyono',
    no_telp: '81227425917',
    status_ijin_usaha: '',
    lokasi_rpu: 'Tlogopragoto, Mirit',
    pemotongan_per_hari_ekor: '20',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '600',
  },
  {
    no: 97,
    lokasi_desa_kecamatan_alamat_pemilik: 'Grogol beningsari',
    nama_tph_r_u: 'Toko RJ',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Muslihatun',
    no_telp: '85227876107',
    status_ijin_usaha: '',
    lokasi_rpu: 'Grogol, Beningsari',
    pemotongan_per_hari_ekor: '50',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '1500',
  },
  {
    no: 98,
    lokasi_desa_kecamatan_alamat_pemilik: 'Bocor RT 6 RW 1',
    nama_tph_r_u: 'Nasehudin',
    jenis_unit_usaha: 'TPU',
    pemilik: 'ABS Kebumen',
    no_telp: '85134583141',
    status_ijin_usaha: '',
    lokasi_rpu: 'Bocor RT 6 RW 1, Buluspesantren',
    pemotongan_per_hari_ekor: '25',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '750',
  },
  {
    no: 99,
    lokasi_desa_kecamatan_alamat_pemilik: 'Argopeni RT 2 RW 3, Kebumen',
    nama_tph_r_u: 'Sofiyanto',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Argo Mulia',
    no_telp: '87700040707',
    status_ijin_usaha: '',
    lokasi_rpu: 'Argopeni RT 2 RW 3, Kebumen',
    pemotongan_per_hari_ekor: '250',
    sertifikat_halal: '-',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '7500',
  },
  {
    no: 100,
    lokasi_desa_kecamatan_alamat_pemilik: 'Kuwayuhan',
    nama_tph_r_u: 'Mursiyah',
    jenis_unit_usaha: 'TPU',
    pemilik: 'Mrs Broiler',
    no_telp: '85227761833',
    status_ijin_usaha: '',
    lokasi_rpu: 'Kuwayuhan',
    pemotongan_per_hari_ekor: '20',
    sertifikat_halal: 'halal',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '600',
  },
  {
    no: 101,
    lokasi_desa_kecamatan_alamat_pemilik: 'Kuwayuhan, Pejagoan',
    nama_tph_r_u: 'Muslimin',
    jenis_unit_usaha: 'TPH (ayam, Bebek, Sapi)',
    pemilik: 'Muslimin',
    no_telp: '08225977197/ 087790034000',
    status_ijin_usaha: '',
    lokasi_rpu: 'Kuwayuhan, Pejagoan',
    pemotongan_per_hari_ekor: '-',
    sertifikat_halal: 'halal',
    sertifikat_nkv: 'belum',
    rata2_produksi_per_bulan_kg: '-',
  },
];

// Tipe data satu entri, diturunkan otomatis dari initialDataRph
type RphItem = (typeof initialDataRph)[number];

const LS_KEY = 'data_rph_tph_tpu_v1';

// Skema kosong untuk form tambah/edit
const emptyForm: RphItem = {
  no: 0,
  lokasi_desa_kecamatan_alamat_pemilik: '',
  nama_tph_r_u: '',
  jenis_unit_usaha: '',
  pemilik: '',
  no_telp: '',
  status_ijin_usaha: '',
  lokasi_rpu: '',
  pemotongan_per_hari_ekor: '',
  sertifikat_halal: '',
  sertifikat_nkv: '',
  rata2_produksi_per_bulan_kg: '',
};

const FIELD_LABELS: Record<string, string> = {
  nama_tph_r_u: 'Nama TPH/RPU',
  jenis_unit_usaha: 'Jenis Unit Usaha',
  pemilik: 'Pemilik',
  no_telp: 'No. Telp',
  status_ijin_usaha: 'Status Ijin Usaha',
  lokasi_rpu: 'Lokasi RPU/TPH',
  lokasi_desa_kecamatan_alamat_pemilik: 'Lokasi Desa/Kecamatan/Alamat Pemilik',
  pemotongan_per_hari_ekor: 'Pemotongan per Hari (ekor)',
  sertifikat_halal: 'Sertifikat Halal',
  sertifikat_nkv: 'Sertifikat NKV',
  rata2_produksi_per_bulan_kg: 'Rata-rata Produksi per Bulan (kg)',
};

export default function RphTphTpuPage() {
  const [dataRph, setDataRph] = useState<RphItem[]>(initialDataRph);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNo, setEditingNo] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<RphItem>(emptyForm);
  const [confirmDeleteNo, setConfirmDeleteNo] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDataRph(parsed);
        }
      }
    } catch (err) {
      console.error('Gagal memuat data tersimpan:', err);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(dataRph));
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
    }
  }, [dataRph]);

  const filteredData = dataRph.filter((item) => {
    const matchSearch =
      (item.nama_tph_r_u || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.pemilik || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.lokasi_rpu || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.lokasi_desa_kecamatan_alamat_pemilik || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchKategori =
      selectedKategori === 'Semua' ||
      (item.jenis_unit_usaha || '').toUpperCase().includes(selectedKategori.toUpperCase());

    return matchSearch && matchKategori;
  });

  const openAddModal = () => {
    setEditingNo(null);
    setFormValues(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item: RphItem) => {
    setEditingNo(item.no);
    setFormValues({ ...item });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNo(null);
    setFormValues(emptyForm);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValues.nama_tph_r_u || !formValues.nama_tph_r_u.trim()) {
      alert('Nama TPH/RPU wajib diisi.');
      return;
    }

    if (editingNo !== null) {
      setDataRph((prev) =>
        prev.map((item) => (item.no === editingNo ? { ...formValues, no: editingNo } : item))
      );
    } else {
      const nextNo =
        dataRph.length > 0 ? Math.max(...dataRph.map((d) => Number(d.no) || 0)) + 1 : 1;
      setDataRph((prev) => [...prev, { ...formValues, no: nextNo }]);
    }
    closeModal();
  };

  const handleDelete = (no: number) => {
    setDataRph((prev) => prev.filter((item) => item.no !== no));
    setConfirmDeleteNo(null);
  };

  const handleExportExcel = () => {
    const exportData = dataRph.map((item) => ({
      No: item.no,
      'Nama TPH/RPU': item.nama_tph_r_u,
      'Jenis Unit Usaha': item.jenis_unit_usaha,
      Pemilik: item.pemilik,
      'No. Telp': item.no_telp,
      'Status Ijin Usaha': item.status_ijin_usaha,
      'Lokasi RPU/TPH': item.lokasi_rpu,
      'Lokasi Desa/Kecamatan/Alamat Pemilik': item.lokasi_desa_kecamatan_alamat_pemilik,
      'Pemotongan per Hari (ekor)': item.pemotongan_per_hari_ekor,
      'Sertifikat Halal': item.sertifikat_halal,
      'Sertifikat NKV': item.sertifikat_nkv,
      'Rata-rata Produksi per Bulan (kg)': item.rata2_produksi_per_bulan_kg,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data RPH-TPH-TPU');
    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Data_RPH_TPH_TPU_${today}.xlsx`);
  };

  const countRPU = dataRph.filter((d) => (d.jenis_unit_usaha || '').toUpperCase().includes('RPU')).length;
  const countTPU = dataRph.filter(
    (d) =>
      (d.jenis_unit_usaha || '').toUpperCase().includes('TPU') ||
      (d.jenis_unit_usaha || '').toUpperCase().includes('TPH')
  ).length;
  const countHalal = dataRph.filter(
    (d) =>
      (d.sertifikat_halal || '').toLowerCase().includes('sudah') ||
      (d.sertifikat_halal || '').toLowerCase().includes('ada') ||
      (d.sertifikat_halal || '').toLowerCase().includes('halal') ||
      (d.sertifikat_halal || '').toLowerCase().includes('id33')
  ).length;
  const countNKV = dataRph.filter(
    (d) =>
      (d.sertifikat_nkv || '').toLowerCase().includes('tingkat') ||
      (d.sertifikat_nkv || '').toLowerCase().includes('rph')
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-azure selection:text-white pb-20">
      
      {/* ── TOP HEADER ── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/kesmavet"
              className="min-h-touch min-w-touch w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Kembali ke Kesmavet"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Link href="/kesmavet" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  Kesmavet
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-azure">RPH & TPU</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Database Rumah Potong & Tempat Pemotongan Hewan
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="min-h-touch h-10 px-3.5 sm:px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
            <button
              onClick={openAddModal}
              className="min-h-touch h-10 px-4 rounded-xl bg-azure text-white text-xs font-bold flex items-center gap-1.5 hover:bg-azure/90 transition-all shadow-sm"
            >
              <Plus size={15} />
              <span>Tambah Unit</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total Unit Terdata
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">
              {dataRph.length} <span className="text-xs font-normal text-slate-500">Unit</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Unit RPU & TPU
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-azure">
              {countRPU + countTPU} <span className="text-xs font-normal text-slate-500">Unggas/Hewan</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Sertifikasi Halal
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-vitality">
              {countHalal} <span className="text-xs font-normal text-slate-500">Tersertifikasi</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Memiliki NKV
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-lime">
              {countNKV} <span className="text-xs font-normal text-slate-500">Unit</span>
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {['Semua', 'RPU', 'TPU', 'TPH', 'RPH'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedKategori(cat)}
                className={`min-h-touch h-9 px-3.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedKategori === cat
                    ? 'bg-azure text-white border-azure shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama usaha, pemilik, lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-touch h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-azure focus:bg-white"
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="p-3.5 w-12 text-center">NO</th>
                  <th className="p-3.5">NAMA UNIT USAHA</th>
                  <th className="p-3.5">JENIS</th>
                  <th className="p-3.5">PEMILIK</th>
                  <th className="p-3.5">KONTAK</th>
                  <th className="p-3.5">LOKASI USAHA</th>
                  <th className="p-3.5 text-center font-mono">KAPASITAS (EKOR/HR)</th>
                  <th className="p-3.5 text-center">STATUS HALAL</th>
                  <th className="p-3.5 text-center">STATUS NKV</th>
                  <th className="p-3.5 text-center w-24 sticky right-0 bg-slate-50">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => {
                    const isHalal =
                      (item.sertifikat_halal || '').toLowerCase().includes('sudah') ||
                      (item.sertifikat_halal || '').toLowerCase().includes('ada') ||
                      (item.sertifikat_halal || '').toLowerCase().includes('halal') ||
                      (item.sertifikat_halal || '').toLowerCase().includes('id33');

                    const isNKV =
                      (item.sertifikat_nkv || '').toLowerCase().includes('tingkat') ||
                      (item.sertifikat_nkv || '').toLowerCase().includes('rph');

                    return (
                      <tr key={item.no} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 text-center font-mono text-slate-400">{item.no}</td>
                        <td className="p-3.5 font-bold text-slate-900">{item.nama_tph_r_u || '-'}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {item.jenis_unit_usaha || '-'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700">{item.pemilik || '-'}</td>
                        <td className="p-3.5 font-mono text-slate-600">{item.no_telp || '-'}</td>
                        <td className="p-3.5 text-slate-600 max-w-xs truncate" title={item.lokasi_rpu || item.lokasi_desa_kecamatan_alamat_pemilik}>
                          {item.lokasi_rpu || item.lokasi_desa_kecamatan_alamat_pemilik || '-'}
                        </td>
                        <td className="p-3.5 text-center font-mono font-bold text-azure">
                          {item.pemotongan_per_hari_ekor || '-'}
                        </td>
                        <td className="p-3.5 text-center">
                          {isHalal ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ Halal
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Belum</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          {isNKV ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {item.sertifikat_nkv}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Belum</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center sticky right-0 bg-white shadow-[-5px_0_10px_rgba(0,0,0,0.03)]">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModal(item)}
                              className="min-h-touch h-7 w-7 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center"
                            >
                              <Edit2 size={12} />
                            </button>
                            {confirmDeleteNo === item.no ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(item.no)}
                                  className="h-7 px-2 rounded-lg bg-red-600 text-white font-bold text-[10px]"
                                >
                                  Ya
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteNo(null)}
                                  className="h-7 px-2 rounded-lg bg-slate-200 text-slate-700 font-bold text-[10px]"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteNo(item.no)}
                                className="min-h-touch h-7 w-7 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center justify-center"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-400 font-medium">
                      Pencarian &quot;{searchTerm}&quot; tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ── MODAL TAMBAH / EDIT ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingNo !== null ? 'Edit Unit Usaha Pemotongan' : 'Tambah Unit Usaha Pemotongan Baru'}
              </h3>
              <button onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(FIELD_LABELS).map((key) => (
                  <div
                    key={key}
                    className={
                      key === 'lokasi_desa_kecamatan_alamat_pemilik' || key === 'lokasi_rpu'
                        ? 'sm:col-span-2'
                        : ''
                    }
                  >
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {FIELD_LABELS[key]}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={(formValues as any)[key] ?? ''}
                      onChange={handleFieldChange}
                      className="w-full min-h-touch h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-azure focus:bg-white outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="min-h-touch h-10 px-4 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-touch h-10 px-6 rounded-xl bg-azure text-white text-xs font-bold shadow-sm hover:bg-azure/90"
                >
                  {editingNo !== null ? 'Simpan Perubahan' : 'Tambah Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

