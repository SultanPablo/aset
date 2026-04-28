import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const sertifikat = await prisma.sertifikatTanah.findMany({
      include: { golongan: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(sertifikat);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data sertifikat' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.golonganId || !data.noSertifikat || !data.namaJemaat || !data.namaMataJemaat || !data.namaKlasis || !data.letakTanah) {
      return NextResponse.json({ error: 'Data sertifikat tidak lengkap, lengkapi field mandatory' }, { status: 400 });
    }

    const exist = await prisma.sertifikatTanah.findUnique({ where: { noSertifikat: data.noSertifikat } });
    if (exist) {
      return NextResponse.json({ error: 'No. Sertifikat sudah terdaftar' }, { status: 409 });
    }

    const sertifikat = await prisma.sertifikatTanah.create({
      data: {
        golonganId: data.golonganId,
        noSertifikat: data.noSertifikat,
        namaJemaat: data.namaJemaat,
        namaMataJemaat: data.namaMataJemaat,
        namaKlasis: data.namaKlasis,
        letakTanah: data.letakTanah,
        luasM2: data.luasM2 ? parseFloat(data.luasM2) : null,
        noHak: data.noHak || null,
        nib: data.nib || null,
        tanggalPerolehan: data.tanggalPerolehan ? new Date(data.tanggalPerolehan) : null,
        keterangan: data.keterangan || null,
      }
    });

    return NextResponse.json(sertifikat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan sertifikat' }, { status: 500 });
  }
}
