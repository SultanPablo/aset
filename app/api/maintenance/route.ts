import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const maintenance = await prisma.riwayatMaintenance.findMany({
      orderBy: { tanggal: 'desc' }
    });
    return NextResponse.json(maintenance);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data maintenance' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const maintenance = await prisma.riwayatMaintenance.create({
      data: {
        asetType: data.asetType || "inventaris",
        asetId: data.asetId || null,
        namaAsetSnapshot: data.namaAsetSnapshot || "-",
        golonganSnapshot: data.golonganSnapshot || "-",
        lokasiSnapshot: data.lokasiSnapshot || null,
        penggunaSnapshot: data.penggunaSnapshot || null,
        jenisTindakan: data.jenisTindakan || "-",
        kondisiSebelum: data.kondisiSebelum || "-",
        kondisiSesudah: data.kondisiSesudah || "-",
        tanggal: data.tanggal ? new Date(data.tanggal) : new Date(),
        biaya: data.biaya ? parseFloat(data.biaya) : null,
        keterangan: data.keterangan || null,
      }
    });
    return NextResponse.json(maintenance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mencatat rincian maintenance' }, { status: 500 });
  }
}
