import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const { namaKategori } = await request.json();

    if (!namaKategori) {
      return NextResponse.json({ error: 'Nama Kategori wajib diisi' }, { status: 400 });
    }

    const kategori = await prisma.kategoriAset.update({
      where: { id },
      data: { namaKategori }
    });

    return NextResponse.json(kategori);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui kategori' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    // Optional: check if there are any Golongan using this Kategori
    const referensi = await prisma.golonganAset.findFirst({ where: { kategoriId: id } });
    if (referensi) {
      return NextResponse.json({ error: 'Kategori tidak dapat dihapus karena digunakan oleh Golongan' }, { status: 400 });
    }

    await prisma.kategoriAset.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus kategori' }, { status: 500 });
  }
}
