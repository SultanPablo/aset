import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const hapus = await prisma.riwayatPenghapusan.findMany({
      orderBy: { tanggal: 'desc' }
    });
    return NextResponse.json(hapus);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data penghapusan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const hapus = await prisma.riwayatPenghapusan.create({
      data: {
        asetType: data.asetType || "inventaris",
        asetId: data.asetId || "0",
        namaAsetSnapshot: data.namaAsetSnapshot || "-",
        golonganSnapshot: data.golonganSnapshot || "-",
        ruanganSnapshot: data.ruanganSnapshot || null,
        propertiSnapshot: data.propertiSnapshot || null,
        penggunaSnapshot: data.penggunaSnapshot || null,
        kondisiSnapshot: data.kondisiSnapshot || "-",
        alasan: data.alasan || "-",
        jumlah: data.jumlah ? parseInt(data.jumlah) : 1,
        tanggal: data.tanggal ? new Date(data.tanggal) : new Date(),
        keterangan: data.keterangan || null,
      }
    });

    return NextResponse.json(hapus, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mencatat riwayat penghapusan' }, { status: 500 });
  }
}
