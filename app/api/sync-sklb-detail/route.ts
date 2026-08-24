import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

export async function POST() {
  try {
    // Perhatikan ujung link-nya, kita ubah jadi output=xlsx!
    // Ini akan mengambil data LIVE dari Google Sheets dalam format Excel
    const liveExcelUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsiU4jFcAULI3Rth6XmJ2lrj6GgZIHvXQg4p8f8YrbhUrR1yd96oVVfjqZO5mTUdotAo46qTHFIO0p/pub?output=xlsx";
    
    // Sedot datanya sebagai kumpulan byte (ArrayBuffer)
    const response = await fetch(liveExcelUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('Gagal menyedot data dari Google Sheets');
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Baca buku kerjanya (Workbook) menggunakan library 'xlsx'
    const workbook = xlsx.read(arrayBuffer, { type: 'buffer' });
    
    // Ambil semua nama sheet
    const sheetNames = workbook.SheetNames;
    
    let totalDataTersedot = 0;
    let data_semua_desa = [];

    // Looping untuk membaca SEMUA sheet, kecuali sheet "TOTAL CAPAIAN 2026"
    for (const sheetName of sheetNames) {
      if (sheetName === "TOTAL CAPAIAN 2026") continue; // Lewati sheet rekap

      const sheet = workbook.Sheets[sheetName];
      // Konversi sheet jadi format array 2 dimensi (baris dan kolom)
      const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      // Mulai baca data sapi dari baris ke-6 (karena baris 1-5 adalah judul kop surat dan header bertingkat)
      for (let i = 5; i < rawData.length; i++) {
        const row = rawData[i];
        
        // Cek jika kolom "NO" (index 0) dan "NAMA PEMILIK" (index 1) ada isinya
        if (row[0] && row[1]) {
          data_semua_desa.push({
            id: `${sheetName}-${row[0]}`, // Bikin ID unik: GONDANGLEGI-1
            desa_lokasi: sheetName,       // Nama sheet = Nama Desa
            no: row[0],
            nama_pemilik: row[1],
            rt: row[2],
            rw: row[3],
            dusun: row[4],
            nama_sapi: row[7] || "-",
            jenis_kelamin: row[9] || "-",
            kode_bapak: row[11] || "-",
            kode_induk: row[12] || "-",
            umur_bulan: row[20] || 0,
            tinggi_pundak: row[21] || 0, // TP
            panjang_badan: row[22] || 0, // PB
            lingkar_dada: row[24] || 0,  // LD
            berat_badan: row[25] || 0,   // BB
          });
          totalDataTersedot++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Mantap! Berhasil menyedot ${totalDataTersedot} ekor data ternak langsung dari 29 Desa (Sheet) secara bersamaan!`,
      data: data_semua_desa 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Gagal menarik data dari file Excel live." }, { status: 500 });
  }
}