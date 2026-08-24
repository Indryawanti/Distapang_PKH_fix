import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
  try {
    const [rows] = await pool.query('SELECT * FROM capaian_sklb ORDER BY no_urut ASC');

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error('Error sync-sklb-summary:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengambil data dari database.' },
      { status: 500 }
    );
  }
}