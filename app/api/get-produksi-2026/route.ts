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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      kategori,
      jenis,
      jan = 0,
      feb = 0,
      mar = 0,
      apr = 0,
      mei = 0,
      jun = 0,
      jul = 0,
      agt = 0,
      sep = 0,
      okt = 0,
      nov = 0,
      des = 0,
    } = body;

    if (!kategori || !jenis) {
      return NextResponse.json({ error: 'Kategori dan jenis ternak wajib diisi' }, { status: 400 });
    }

    const total =
      Number(jan) +
      Number(feb) +
      Number(mar) +
      Number(apr) +
      Number(mei) +
      Number(jun) +
      Number(jul) +
      Number(agt) +
      Number(sep) +
      Number(okt) +
      Number(nov) +
      Number(des);

    await pool.query(
      `INSERT INTO produksi_2026 
       (kategori, jenis, jan, feb, mar, apr, mei, jun, jul, agt, sep, okt, nov, des, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [kategori, jenis, jan, feb, mar, apr, mei, jun, jul, agt, sep, okt, nov, des, total]
    );

    return NextResponse.json({ success: true, message: 'Data produksi 2026 berhasil ditambahkan' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menyimpan data produksi' }, { status: 500 });
  }
}