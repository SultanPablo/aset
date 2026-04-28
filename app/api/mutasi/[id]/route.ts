import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await request.json();

    if (!data) {
      return NextResponse.json({ error: 'Data mutasi tidak lengkap' }, { status: 400 });
    }

    const mutasi = await prisma.riwayatMutasi.update({
      where: { id },
      data: {
        inventarisId: data.inventarisId,
        ruanganAsalId: data.ruanganAsalId,
        ruanganTujuanId: data.ruanganTujuanId,
        tanggalMutasi: data.tanggalMutasi ? new Date(data.tanggalMutasi) : undefined,
        keterangan: data.keterangan || null,
      }
    });

    return NextResponse.json(mutasi);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui mutasi' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    await prisma.riwayatMutasi.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Riwayat berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus riwayat' }, { status: 500 });
  }
}
