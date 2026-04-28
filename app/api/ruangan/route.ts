import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const ruangan = await prisma.ruangan.findMany({
      include: { properti: true, lantai: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(ruangan);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data ruangan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.namaRuangan || !data.propertiId || !data.kodeRuangan) {
      return NextResponse.json({ error: 'Nama, Kode, dan Properti wajib diisi' }, { status: 400 });
    }

    // Unique check is propertiId, kodeRuangan
    const exist = await prisma.ruangan.findUnique({
      where: {
        propertiId_kodeRuangan: {
          propertiId: data.propertiId,
          kodeRuangan: data.kodeRuangan
        }
      }
    });

    if (exist) {
      return NextResponse.json({ error: 'Kode ruangan ini sudah ada di dalam properti tersebut' }, { status: 409 });
    }

    const ruangan = await prisma.ruangan.create({
      data: {
        namaRuangan: data.namaRuangan,
        kodeRuangan: data.kodeRuangan,
        propertiId: data.propertiId,
        lantaiId: data.lantaiId || null,
        keterangan: data.keterangan || null
      }
    });
    return NextResponse.json(ruangan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan ruangan' }, { status: 500 });
  }
}
