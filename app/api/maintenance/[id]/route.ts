import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await request.json();

    if (!data.asetType || !data.asetId || !data.tanggalMaintenance) {
      return NextResponse.json({ error: 'Data maintenance tidak lengkap' }, { status: 400 });
    }

    const maintenance = await prisma.riwayatMaintenance.update({
      where: { id },
      data: {
        asetType: data.asetType,
        asetId: data.asetId,
        tanggalMaintenance: new Date(data.tanggalMaintenance),
        keterangan: data.keterangan || null,
        biaya: data.biaya ? parseFloat(data.biaya) : null,
      }
    });

    return NextResponse.json(maintenance);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui maintenance' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    await prisma.riwayatMaintenance.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Maintenance berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus riwayat maintenance' }, { status: 500 });
  }
}
