import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await request.json();

    if (!data.namaLantai || !data.propertiId) {
      return NextResponse.json({ error: 'Data Lantai tidak lengkap' }, { status: 400 });
    }

    const lantai = await prisma.lantai.update({
      where: { id },
      data: {
        namaLantai: data.namaLantai,
        propertiId: data.propertiId
      }
    });

    return NextResponse.json(lantai);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui lantai' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    await prisma.lantai.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Lantai berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus lantai, hapus ruangan terkait lebih dulu' }, { status: 500 });
  }
}
