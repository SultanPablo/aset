import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await request.json();

    if (!data.namaProperti || !data.golonganId) {
      return NextResponse.json({ error: 'Data Properti tidak lengkap' }, { status: 400 });
    }

    const properti = await prisma.properti.update({
      where: { id },
      data: {
        namaProperti: data.namaProperti,
        golonganId: data.golonganId,
        bertingkat: data.bertingkat || false,
        jumlahLantai: data.jumlahLantai ? parseInt(data.jumlahLantai) : 1,
        keterangan: data.keterangan || null,
      }
    });

    return NextResponse.json(properti);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui properti' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    await prisma.properti.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Properti berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus properti, pastikan tidak ada lantai atau ruangan yang bergantung' }, { status: 500 });
  }
}
