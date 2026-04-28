import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const golongan = await prisma.golonganAset.findMany({
      include: { kategori: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(golongan);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data golongan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { kodeGolongan, namaGolongan, kategoriId } = await request.json();
    
    if (!kodeGolongan || !namaGolongan || !kategoriId) {
      return NextResponse.json({ error: 'Data Golongan tidak lengkap' }, { status: 400 });
    }

    const exist = await prisma.golonganAset.findUnique({ where: { kodeGolongan } });
    if (exist) {
      return NextResponse.json({ error: 'Kode Golongan sudah digunakan' }, { status: 409 });
    }

    const golongan = await prisma.golonganAset.create({
      data: { kodeGolongan, namaGolongan, kategoriId }
    });
    return NextResponse.json(golongan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan golongan' }, { status: 500 });
  }
}
