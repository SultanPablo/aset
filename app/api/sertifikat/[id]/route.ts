import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await request.json();

    if (!data.golonganId || !data.noSertifikat || !data.namaJemaat || !data.namaMataJemaat || !data.namaKlasis || !data.letakTanah) {
      return NextResponse.json({ error: 'Data sertifikat tidak lengkap' }, { status: 400 });
    }

    const exist = await prisma.sertifikatTanah.findFirst({
      where: { noSertifikat: data.noSertifikat, NOT: { id } }
    });
    if (exist) {
      return NextResponse.json({ error: 'No. Sertifikat sudah digunakan oleh sertifikat lain' }, { status: 409 });
    }

    const sertifikat = await prisma.sertifikatTanah.update({
      where: { id },
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

    return NextResponse.json(sertifikat);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui sertifikat' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    await prisma.sertifikatTanah.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Sertifikat berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus sertifikat' }, { status: 500 });
  }
}
