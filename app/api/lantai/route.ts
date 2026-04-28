import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const lantai = await prisma.lantai.findMany({
      include: { properti: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(lantai);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data lantai' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.namaLantai || !data.propertiId) {
      return NextResponse.json({ error: 'Data Lantai tidak lengkap' }, { status: 400 });
    }

    const lantai = await prisma.lantai.create({
      data: {
        namaLantai: data.namaLantai,
        propertiId: data.propertiId
      }
    });
    return NextResponse.json(lantai, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan lantai, mungkin properti hanya punya satu data (unique constraint)' }, { status: 500 });
  }
}
