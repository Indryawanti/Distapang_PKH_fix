import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query(
      'SELECT kecamatan, no_desa, desa, data_v FROM populasi_tw4_2025 ORDER BY id ASC'
    );

    // Ubah format supaya cocok dengan yang dibutuhkan page.tsx (kec, no, desa, v)
    const data = rows.map((row: any) => ({
      kec: row.kecamatan,
      no: row.no_desa,
      desa: row.desa,
      v: typeof row.data_v === 'string' ? JSON.parse(row.data_v) : row.data_v,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}