import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await request.json();

    if (!data.asetType || !data.asetId || !data.alasan) {
      return NextResponse.json({ error: 'Data penghapusan tidak lengkap' }, { status: 400 });
    }

    const hapus = await prisma.riwayatPenghapusan.update({
      where: { id },
      data: {
        asetType: data.asetType,
        asetId: data.asetId,
        alasan: data.alasan,
        tanggal: data.tanggal ? new Date(data.tanggal) : undefined,
        keterangan: data.keterangan || null,
      }
    });

    return NextResponse.json(hapus);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui penghapusan' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    await prisma.riwayatPenghapusan.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Riwayat berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus riwayat' }, { status: 500 });
  }
}
