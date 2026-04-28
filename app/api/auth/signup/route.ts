import { NextResponse } from 'next/server';
import prisma from '@/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { nama, email, password } = await request.json();

    if (!nama || !email || !password) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        passwordHash,
      },
    });

    return NextResponse.json({ message: 'Pendaftaran berhasil', user: { id: user.id, nama: user.nama, email: user.email } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
