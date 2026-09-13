import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { COOKIE_NAME, signAdminToken } from '@/src/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const configuredEmail = process.env.AUTH_ADMIN_EMAIL;
    const configuredPassword = process.env.AUTH_ADMIN_PASSWORD;

    if (!configuredEmail || !configuredPassword) {
      return NextResponse.json(
        { error: 'AUTH_ADMIN_EMAIL dan AUTH_ADMIN_PASSWORD belum dikonfigurasi di Environment Variables.' },
        { status: 503 }
      );
    }
    if (!process.env.AUTH_JWT_SECRET) {
      return NextResponse.json(
        { error: 'AUTH_JWT_SECRET belum dikonfigurasi di Environment Variables.' },
        { status: 503 }
      );
    }

    const validEmail = email?.toLowerCase() === configuredEmail.toLowerCase();
    const validPassword = configuredPassword.startsWith('$2')
      ? await bcrypt.compare(password || '', configuredPassword)
      : password === configuredPassword;

    if (!validEmail || !validPassword) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const token = signAdminToken(configuredEmail);
    const response = NextResponse.json({ authenticated: true, email: configuredEmail });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan saat login.' },
      { status: 500 }
    );
  }
}
