import { NextResponse } from 'next/server';
import { readAdminToken } from '@/src/lib/auth';

export async function GET(req: Request) {
  const user = readAdminToken(req);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, email: user.email, role: user.role });
}
