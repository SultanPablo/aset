import { NextResponse } from 'next/server';
import prisma from '@/prisma';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Kredensial tidak valid' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Kredensial tidak valid' }, { status: 401 });
    }

    // Set JWT token
    const token = await signJwt({ id: user.id, email: user.email, nama: user.nama });
    
    const response = NextResponse.json({ message: 'Login berhasil', user: { id: user.id, email: user.email, nama: user.nama } }, { status: 200 });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
