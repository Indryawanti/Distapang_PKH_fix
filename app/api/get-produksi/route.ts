import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Wajib dipasang agar Next.js tidak nge-cache data kosong (jebakan yang tadi)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Sedot semua data dari tabel produksi
    const [rows] = await pool.query('SELECT * FROM produksi_2025 ORDER BY id ASC');
    
    const allData = rows as any[];

    // Kita pisahkan langsung dari server: mana yang Daging, mana yang Telur
    const dataDaging = allData.filter((row) => row.kategori === 'Daging');
    const dataTelur = allData.filter((row) => row.kategori === 'Telur');

    // Kirim keduanya ke layar
    return NextResponse.json({ dataDaging, dataTelur });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data produksi dari MySQL' }, { status: 500 });
  }
}