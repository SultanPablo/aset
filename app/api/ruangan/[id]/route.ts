import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await request.json();

    if (!data.namaRuangan || !data.propertiId || !data.kodeRuangan) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const exist = await prisma.ruangan.findFirst({
      where: {
        propertiId: data.propertiId,
        kodeRuangan: data.kodeRuangan,
        NOT: { id }
      }
    });

    if (exist) {
      return NextResponse.json({ error: 'Kode ruangan ini sudah digunakan oleh ruangan lain di properti yang sama' }, { status: 409 });
    }

    const ruangan = await prisma.ruangan.update({
      where: { id },
      data: {
        namaRuangan: data.namaRuangan,
        kodeRuangan: data.kodeRuangan,
        propertiId: data.propertiId,
        lantaiId: data.lantaiId || null,
        keterangan: data.keterangan || null
      }
    });

    return NextResponse.json(ruangan);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui ruangan' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    await prisma.ruangan.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Ruangan berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus ruangan' }, { status: 500 });
  }
}
