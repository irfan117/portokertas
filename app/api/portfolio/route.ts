import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      profile,
      contact,
      workProjects,
      labNotes,
      talksWriting,
      careerList,
      experienceSlides,
      caseStudies,
      nowItems,
      gitAccounts,
    ] = await Promise.all([
      prisma.profile.findUnique({ where: { id: 1 } }),
      prisma.contact.findUnique({ where: { id: 1 } }),
      prisma.workProject.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.labNote.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.talkWriting.findMany(),
      prisma.careerItem.findMany(),
      prisma.experienceSlide.findMany(),
      prisma.caseStudy.findMany(),
      prisma.nowItem.findMany(),
      prisma.gitAccount.findMany({ orderBy: { createdAt: 'asc' } }),
    ]);

    return NextResponse.json({
      profile,
      contact,
      workProjects,
      labNotes,
      talksWriting,
      careerList,
      experienceSlides,
      caseStudies,
      nowItems,
      gitAccounts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Gagal mengambil data portfolio.',
      },
      { status: 500 }
    );
  }
}
