import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const properti = await prisma.properti.findMany({
      include: { golongan: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(properti);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data properti' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validasi singkat
    if (!data.namaProperti || !data.golonganId) {
      return NextResponse.json({ error: 'Data Properti tidak lengkap' }, { status: 400 });
    }

    const properti = await prisma.properti.create({
      data: {
        namaProperti: data.namaProperti,
        golonganId: data.golonganId,
        bertingkat: data.bertingkat || false,
        jumlahLantai: data.jumlahLantai ? parseInt(data.jumlahLantai) : 1,
        keterangan: data.keterangan || null,
        // Optional koordinat, geojson, foto
      }
    });
    return NextResponse.json(properti, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan properti' }, { status: 500 });
  }
}
