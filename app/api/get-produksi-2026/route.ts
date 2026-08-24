import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM produksi_2026 ORDER BY id ASC');
    const allData = rows as any[];

    const dataDaging = allData.filter((row) => row.kategori === 'Daging');
    const dataTelur = allData.filter((row) => row.kategori === 'Telur');

    return NextResponse.json({ dataDaging, dataTelur });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}