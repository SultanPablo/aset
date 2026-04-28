import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const kategori = await prisma.kategoriAset.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(kategori);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data kategori' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { namaKategori } = await request.json();
    if (!namaKategori) {
      return NextResponse.json({ error: 'Nama Kategori wajib diisi' }, { status: 400 });
    }

    const kategori = await prisma.kategoriAset.create({
      data: { namaKategori }
    });
    return NextResponse.json(kategori, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan kategori' }, { status: 500 });
  }
}
