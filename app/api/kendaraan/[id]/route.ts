import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await request.json();

    if (!data.golonganId || !data.namaKendaraan || !data.pengguna) {
      return NextResponse.json({ error: 'Data kendaraan tidak lengkap' }, { status: 400 });
    }

    if (data.noPolisi) {
      const exist = await prisma.kendaraan.findFirst({
        where: { noPolisi: data.noPolisi, NOT: { id } }
      });
      if (exist) {
        return NextResponse.json({ error: 'Nomor Polisi sudah digunakan oleh kendaraan lain' }, { status: 409 });
      }
    }

    const kendaraan = await prisma.kendaraan.update({
      where: { id },
      data: {
        golonganId: data.golonganId,
        namaKendaraan: data.namaKendaraan,
        merek: data.merek || null,
        tipe: data.tipe || null,
        noPolisi: data.noPolisi || null,
        tahunPerolehan: data.tahunPerolehan ? parseInt(data.tahunPerolehan) : null,
        pengguna: data.pengguna,
        kondisi: data.kondisi || "baik",
        keterangan: data.keterangan || null,
      }
    });

    return NextResponse.json(kendaraan);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui kendaraan' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    await prisma.kendaraan.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Kendaraan berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus kendaraan' }, { status: 500 });
  }
}
