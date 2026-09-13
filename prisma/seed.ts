import { PrismaClient } from '@prisma/client';

import {
  CASE_STUDIES,
  CAREER_LIST,
  EXPERIENCE_SLIDES,
  INITIAL_PORTFOLIO_DATA,
  LAB_NOTES_GALLERY,
  TALKS_WRITING,
  WORK_PROJECTS,
} from '../src/data/kenjiData';

const prisma = new PrismaClient();
type JsonInput = any;

async function ensureDatabaseExists() {
  const configuredUrl = process.env.DATABASE_URL;
  if (!configuredUrl) throw new Error('DATABASE_URL belum dikonfigurasi.');

  const target = new URL(configuredUrl);
  const databaseName = decodeURIComponent(target.pathname.replace(/^\//, ''));
  if (!/^[A-Za-z0-9_$-]+$/.test(databaseName)) {
    throw new Error('Nama database tidak valid pada DATABASE_URL.');
  }

  // Prisma cannot connect to a database before it exists. Connect to TiDB's
  // system database only for this one bootstrap statement.
  if (databaseName !== 'sys') {
    const systemUrl = new URL(configuredUrl);
    systemUrl.pathname = '/sys';
    const systemClient = new PrismaClient({ datasourceUrl: systemUrl.toString() });
    try {
      await systemClient.$executeRawUnsafe(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    } finally {
      await systemClient.$disconnect();
    }
  }
}

/**
 * TiDB uses the MySQL wire protocol, so the Prisma `mysql` datasource in
 * schema.prisma is the correct provider. This seed is intentionally idempotent:
 * it can be run repeatedly without producing duplicate portfolio records.
 */
async function seedPortfolio() {
  const { profile, contact, nowItems } = INITIAL_PORTFOLIO_DATA;

  await prisma.profile.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      name: profile.name,
      role: profile.role,
      location: profile.location,
      heroTitle: profile.heroTitle,
      heroLead: profile.heroLead,
      heroMeta: profile.heroMeta as JsonInput,
      heroStats: profile.heroStats as JsonInput,
      splitTitle: profile.splitParallax.title,
      splitDesc: profile.splitParallax.desc,
      splitImg: profile.splitParallax.img,
      homeText: profile.homeQuote.text,
      homeCite: profile.homeQuote.cite,
      homeBg: profile.homeQuote.bgImage,
      aboutText: profile.aboutQuote.text,
      aboutCite: profile.aboutQuote.cite,
      aboutBg: profile.aboutQuote.bgImage,
      aboutBio: profile.aboutBio as JsonInput,
      toolsHeading: profile.toolsHeading,
      toolsText1: profile.toolsText1,
      toolsText2: profile.toolsText2,
      portraitImg: profile.portraitImg,
      approachHeading: profile.approachHeading,
      approachLead: profile.approachLead,
      approachSteps: profile.approachSteps as JsonInput,
    },
    update: {
      name: profile.name,
      role: profile.role,
      location: profile.location,
      heroTitle: profile.heroTitle,
      heroLead: profile.heroLead,
      heroMeta: profile.heroMeta as JsonInput,
      heroStats: profile.heroStats as JsonInput,
      splitTitle: profile.splitParallax.title,
      splitDesc: profile.splitParallax.desc,
      splitImg: profile.splitParallax.img,
      homeText: profile.homeQuote.text,
      homeCite: profile.homeQuote.cite,
      homeBg: profile.homeQuote.bgImage,
      aboutText: profile.aboutQuote.text,
      aboutCite: profile.aboutQuote.cite,
      aboutBg: profile.aboutQuote.bgImage,
      aboutBio: profile.aboutBio as JsonInput,
      toolsHeading: profile.toolsHeading,
      toolsText1: profile.toolsText1,
      toolsText2: profile.toolsText2,
      portraitImg: profile.portraitImg,
      approachHeading: profile.approachHeading,
      approachLead: profile.approachLead,
      approachSteps: profile.approachSteps as JsonInput,
    },
  });

  await prisma.contact.upsert({ where: { id: 1 }, create: { id: 1, ...contact }, update: contact });

  await Promise.all(
    WORK_PROJECTS.map((project) =>
      prisma.workProject.upsert({
        where: { id: project.id },
        create: { ...project, tags: project.tags as JsonInput, images: [], highlights: [] },
        update: { ...project, tags: project.tags as JsonInput, images: (project.images ?? []) as JsonInput },
      }),
    ),
  );

  await Promise.all(
    LAB_NOTES_GALLERY.map((note) =>
      prisma.labNote.upsert({
        where: { id: note.id },
        create: {
          ...note,
          tags: note.tags as JsonInput,
          content: note.content as JsonInput,
          codeSnippet: (note.codeSnippet ?? undefined) as JsonInput | undefined,
          keyTakeaways: (note.keyTakeaways ?? undefined) as JsonInput | undefined,
        },
        update: {
          slug: note.slug,
          title: note.title,
          date: note.date,
          readTime: note.readTime,
          category: note.category,
          tags: note.tags as JsonInput,
          caption: note.caption,
          img: note.img,
          alt: note.alt,
          summary: note.summary,
          content: note.content as JsonInput,
          codeSnippet: (note.codeSnippet ?? undefined) as JsonInput | undefined,
          keyTakeaways: (note.keyTakeaways ?? undefined) as JsonInput | undefined,
        },
      }),
    ),
  );

  await Promise.all(
    TALKS_WRITING.map((item, index) =>
      prisma.talkWriting.upsert({
        // The mockup has no IDs for these cards; stable IDs make reruns safe.
        where: { id: `talk-${index + 1}` },
        create: { id: `talk-${index + 1}`, ...item },
        update: item,
      }),
    ),
  );

  await Promise.all(
    CAREER_LIST.map((item) => prisma.careerItem.upsert({ where: { id: item.id }, create: item, update: item })),
  );

  await Promise.all(
    EXPERIENCE_SLIDES.map((slide, index) => {
      // Two mockup slides share `exp-1`; keep both by deriving a stable slide ID.
      const id = `${slide.id}-slide-${index + 1}`;
      return prisma.experienceSlide.upsert({ where: { id }, create: { ...slide, id }, update: { ...slide, id } });
    }),
  );

  await Promise.all(
    Object.values(CASE_STUDIES).map((study) =>
      prisma.caseStudy.upsert({
        where: { id: study.id },
        create: {
          id: study.id,
          period: study.period,
          company: study.company,
          role: study.role,
          subtitle: study.subtitle,
          heroImage: study.heroImage,
          heroCaption: study.heroCaption,
          leadParagraph1: study.leadParagraph1,
          midImage: study.midImage,
          midCaption: study.midCaption,
          leadParagraph2: study.leadParagraph2,
          bulletPoints: study.bulletPoints as JsonInput,
          endImage: study.endImage,
          endCaption: study.endCaption,
          prevId: study.prev?.id,
          prevLabel: study.prev?.label,
          nextId: study.next?.id,
          nextLabel: study.next?.label,
        },
        update: {
          period: study.period,
          company: study.company,
          role: study.role,
          subtitle: study.subtitle,
          heroImage: study.heroImage,
          heroCaption: study.heroCaption,
          leadParagraph1: study.leadParagraph1,
          midImage: study.midImage,
          midCaption: study.midCaption,
          leadParagraph2: study.leadParagraph2,
          bulletPoints: study.bulletPoints as JsonInput,
          endImage: study.endImage,
          endCaption: study.endCaption,
          prevId: study.prev?.id,
          prevLabel: study.prev?.label,
          nextId: study.next?.id,
          nextLabel: study.next?.label,
        },
      }),
    ),
  );

  await Promise.all(
    nowItems.map((item, index) =>
      prisma.nowItem.upsert({
        where: { id: `now-${index + 1}` },
        create: { id: `now-${index + 1}`, key: item.k, value: item.v },
        update: { key: item.k, value: item.v },
      }),
    ),
  );
}

/**
 * Verifies Create, Read, Update and Delete against TiDB through the same
 * Prisma client the application uses. The sentinel row is deleted on success
 * and also cleaned up in `finally` if an assertion fails.
 */
async function verifyCrud() {
  const id = '__seed_crud_verification__';

  await prisma.talkWriting.deleteMany({ where: { id } });
  try {
    // Create
    await prisma.talkWriting.create({
      data: { id, title: 'CRUD verification', desc: 'Created by seed verification.', tag: 'Verification' },
    });

    // Read
    const created = await prisma.talkWriting.findUnique({ where: { id } });
    if (!created || created.tag !== 'Verification') throw new Error('CRUD read verification failed.');

    // Update
    const updated = await prisma.talkWriting.update({
      where: { id },
      data: { tag: 'Verified' },
    });
    if (updated.tag !== 'Verified') throw new Error('CRUD update verification failed.');

    // Delete
    await prisma.talkWriting.delete({ where: { id } });
    const deleted = await prisma.talkWriting.findUnique({ where: { id } });
    if (deleted) throw new Error('CRUD delete verification failed.');
  } finally {
    await prisma.talkWriting.deleteMany({ where: { id } });
  }
}

async function main() {
  await ensureDatabaseExists();
  await seedPortfolio();
  await verifyCrud();
  console.log('TiDB seed completed and CRUD verification passed.');
}

main()
  .catch((error: unknown) => {
    console.error('TiDB seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
