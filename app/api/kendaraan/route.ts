import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  try {
    const kendaraan = await prisma.kendaraan.findMany({
      include: { golongan: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(kendaraan);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data kendaraan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.golonganId || !data.namaKendaraan || !data.pengguna) {
      return NextResponse.json({ error: 'Data kendaraan tidak lengkap' }, { status: 400 });
    }

    // Optional check: noPolisi should be unique if provided
    if (data.noPolisi) {
      const exist = await prisma.kendaraan.findUnique({ where: { noPolisi: data.noPolisi } });
      if (exist) {
        return NextResponse.json({ error: 'Nomor Polisi sudah didaftarkan' }, { status: 409 });
      }
    }

    const kendaraan = await prisma.kendaraan.create({
      data: {
        golonganId: data.golonganId,
        namaKendaraan: data.namaKendaraan,
        merek: data.merek || null,
        tipe: data.tipe || null,
        noPolisi: data.noPolisi || null,
        tahunPerolehan: data.tahunPerolehan ? parseInt(data.tahunPerolehan) : null,
        pengguna: data.pengguna,
        kondisi: data.kondisi || "baik",
        keterangan: data.keterangan || null,
      }
    });

    return NextResponse.json(kendaraan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan kendaraan' }, { status: 500 });
  }
}
