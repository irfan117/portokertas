import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/src/lib/auth';

export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return response;
}
