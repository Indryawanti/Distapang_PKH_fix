import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Sesuaikan konfigurasi database Mas Reza di sini
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'simantap_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// FUNGSI GET: Menampilkan semua data
export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM pemotongan_hewan ORDER BY id DESC'
    );
    connection.release();
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// FUNGSI POST: Menambah data baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_usaha, jenis, pemilik, kontak, lokasi, sertifikat_halal } = body;

    if (!nama_usaha || !jenis || !pemilik || !lokasi) {
      return NextResponse.json(
        { success: false, error: 'Data wajib belum lengkap!' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const query = `
      INSERT INTO pemotongan_hewan (nama_usaha, jenis, pemilik, kontak, lokasi, sertifikat_halal)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await connection.execute(query, [
      nama_usaha, 
      jenis, 
      pemilik, 
      kontak || '-', 
      lokasi, 
      sertifikat_halal || 'Tidak'
    ]);
    connection.release();

    return NextResponse.json({ success: true, message: 'Data berhasil ditambahkan!' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}