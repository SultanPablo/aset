import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const inventaris = await prisma.inventaris.findMany({
      include: { golongan: true, ruangan: { include: { properti: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(inventaris);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data inventaris' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.golonganId || !data.ruanganId || !data.namaBarang || !data.tanggalPerolehan || !data.hargaPerolehan) {
      return NextResponse.json({ error: 'Data inventaris tidak lengkap' }, { status: 400 });
    }

    const inventaris = await prisma.inventaris.create({
      data: {
        golonganId: data.golonganId,
        ruanganId: data.ruanganId,
        namaBarang: data.namaBarang,
        tanggalPerolehan: new Date(data.tanggalPerolehan),
        hargaPerolehan: parseFloat(data.hargaPerolehan),
        bahanMerk: data.bahanMerk || null,
        jumlah: parseInt(data.jumlah) || 1,
        kondisi: data.kondisi || "baik",
        keterangan: data.keterangan || null,
        pengguna: data.pengguna || null,
        masaManfaat: data.masaManfaat ? parseInt(data.masaManfaat) : null,
      }
    });

    // Record ke RiwayatMutasi atau history lainnya bisa diletakkan di sini nantinya.

    return NextResponse.json(inventaris, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan inventaris' }, { status: 500 });
  }
}
