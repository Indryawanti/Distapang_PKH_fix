import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Penolak cache agar data selalu ter-update
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM data_farm ORDER BY id ASC');
    
    const dataBroiler: any[] = [];
    const dataPetelur: any[] = [];
    const dataGeneral: any[] = [];

    // Kita pisah-pisahkan JSON-nya kembali ke bentuk aslinya
    (rows as any[]).forEach((row) => {
      const parsed = typeof row.data_json === 'string' ? JSON.parse(row.data_json) : row.data_json;
      
      // Kita selipkan ID asli dari MySQL ke dalam data (berguna untuk fitur Edit/Hapus nanti)
      parsed.db_id = row.id; 

      if (row.kategori === 'broiler') dataBroiler.push(parsed);
      else if (row.kategori === 'petelur') dataPetelur.push(parsed);
      else if (row.kategori === 'general') dataGeneral.push(parsed);
    });

    return NextResponse.json({ dataBroiler, dataPetelur, dataGeneral });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data farm dari MySQL' }, { status: 500 });
  }
}