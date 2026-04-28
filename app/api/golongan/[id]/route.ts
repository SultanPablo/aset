import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const { kodeGolongan, namaGolongan, kategoriId } = await request.json();

    if (!kodeGolongan || !namaGolongan || !kategoriId) {
      return NextResponse.json({ error: 'Data Golongan tidak lengkap' }, { status: 400 });
    }
    
    // Validasi duplikat untuk kodeGolongan tidak sama diri sendiri
    const exist = await prisma.golonganAset.findFirst({ where: { kodeGolongan, NOT: { id } } });
    if (exist) {
      return NextResponse.json({ error: 'Kode Golongan sudah digunakan oleh data lain' }, { status: 409 });
    }

    const golongan = await prisma.golonganAset.update({
      where: { id },
      data: { kodeGolongan, namaGolongan, kategoriId }
    });

    return NextResponse.json(golongan);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui golongan' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    // Check usage in any properti or kendaraan (simplified check)
    // Actually we will just force delete or catch error in constraint for this quick implementation
    await prisma.golonganAset.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Golongan berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus golongan, mungkin sedang digunakan' }, { status: 500 });
  }
}
