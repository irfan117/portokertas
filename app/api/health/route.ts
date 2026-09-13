import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'degraded',
        database: 'unavailable',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
    );
  }
}
