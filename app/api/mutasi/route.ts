import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const mutasi = await prisma.riwayatMutasi.findMany({
      orderBy: { tanggalMutasi: 'desc' }
    });
    return NextResponse.json(mutasi);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data mutasi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const mutasi = await prisma.riwayatMutasi.create({
      data: {
        inventarisId: data.inventarisId || null,
        ruanganAsalId: data.ruanganAsalId || null,
        ruanganTujuanId: data.ruanganTujuanId || null,
        namaBarangSnapshot: data.namaBarangSnapshot || "",
        golonganSnapshot: data.golonganSnapshot || "",
        ruanganAsalSnapshot: data.ruanganAsalSnapshot || "",
        ruanganTujuanSnapshot: data.ruanganTujuanSnapshot || "",
        propertiAsalSnapshot: data.propertiAsalSnapshot || "",
        propertiTujuanSnapshot: data.propertiTujuanSnapshot || "",
        jumlah: data.jumlah ? parseInt(data.jumlah) : 1,
        kondisiSebelum: data.kondisiSebelum || "baik",
        kondisiSesudah: data.kondisiSesudah || "baik",
        tanggalMutasi: data.tanggalMutasi ? new Date(data.tanggalMutasi) : new Date(),
        keterangan: data.keterangan || null,
      }
    });

    if (data.inventarisId && data.ruanganTujuanId) {
       await prisma.inventaris.update({
         where: { id: data.inventarisId },
         data: { ruanganId: data.ruanganTujuanId, kondisi: data.kondisiSesudah }
       });
    }

    return NextResponse.json(mutasi, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal merakam riwayat mutasi' }, { status: 500 });
  }
}
