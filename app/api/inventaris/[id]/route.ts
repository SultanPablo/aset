import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await request.json();

    if (!data.golonganId || !data.ruanganId || !data.namaBarang || !data.tanggalPerolehan || !data.hargaPerolehan) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const inventaris = await prisma.inventaris.update({
      where: { id },
      data: {
        golonganId: data.golonganId,
        ruanganId: data.ruanganId,
        namaBarang: data.namaBarang,
        tanggalPerolehan: new Date(data.tanggalPerolehan),
        hargaPerolehan: parseFloat(data.hargaPerolehan),
        bahanMerk: data.bahanMerk || null,
        jumlah: parseInt(data.jumlah) || 1,
        kondisi: data.kondisi || "baik",
        keterangan: data.keterangan || null,
        pengguna: data.pengguna || null,
        masaManfaat: data.masaManfaat ? parseInt(data.masaManfaat) : null,
      }
    });

    return NextResponse.json(inventaris);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui inventaris' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    await prisma.inventaris.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Inventaris berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus inventaris, pastikan riwayat mutasi dibersihkan jika error referensi' }, { status: 500 });
  }
}
