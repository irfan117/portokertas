import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth';

const resources = {
  workProjects: 'workProject',
  labNotes: 'labNote',
  talksWriting: 'talkWriting',
  careerList: 'careerItem',
  experienceSlides: 'experienceSlide',
  caseStudies: 'caseStudy',
  nowItems: 'nowItem',
  gitAccounts: 'gitAccount',
} as const;

type ResourceName = keyof typeof resources;

function getResource(name: string): ResourceName | undefined {
  return Object.prototype.hasOwnProperty.call(resources, name) ? (name as ResourceName) : undefined;
}

function normalizeCollectionItem(resource: ResourceName, item: Record<string, unknown>) {
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...data } = item;

  switch (resource) {
    case 'workProjects':
      return {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : [],
        images: Array.isArray(data.images) ? data.images : [],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        period: data.period ?? null,
        github: data.github ?? null,
        demoUrl: data.demoUrl ?? null,
      };
    case 'labNotes':
      return {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : [],
        content: Array.isArray(data.content) ? data.content : [],
        keyTakeaways: Array.isArray(data.keyTakeaways) ? data.keyTakeaways : [],
      };
    case 'caseStudies':
      return {
        ...data,
        bulletPoints: Array.isArray(data.bulletPoints) ? data.bulletPoints : [],
        prevId: data.prevId ?? null,
        prevLabel: data.prevLabel ?? null,
        nextId: data.nextId ?? null,
        nextLabel: data.nextLabel ?? null,
      };
    case 'nowItems':
      return {
        ...data,
        key: typeof data.key === 'string' ? data.key : typeof data.k === 'string' ? data.k : '',
        value: typeof data.value === 'string' ? data.value : typeof data.v === 'string' ? data.v : '',
      };
    case 'gitAccounts':
      return {
        ...data,
        totalContributions: Number(data.totalContributions) || 0,
        currentStreak: Number(data.currentStreak) || 0,
        longestStreak: Number(data.longestStreak) || 0,
        pullRequests: Number(data.pullRequests) || 0,
        reposCount: Number(data.reposCount) || 0,
        seed: Number(data.seed) || 1,
        languages: Array.isArray(data.languages) ? data.languages : [],
        recentCommits: Array.isArray(data.recentCommits) ? data.recentCommits : [],
      };
    default:
      return data;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

type RouteContext = { params: Promise<{ slug: string[] }> };

export async function GET(req: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const [resourceParam] = slug;
    const resource = getResource(resourceParam);
    if (!resource) return NextResponse.json({ error: 'Resource tidak ditemukan' }, { status: 404 });

    const delegate = (prisma as any)[resources[resource]];
    const data = await delegate.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, context: RouteContext) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ error: 'Login admin diperlukan.' }, { status: 401 });

    const { slug } = await context.params;
    const [resourceParam] = slug;
    const resource = getResource(resourceParam);
    if (!resource) return NextResponse.json({ error: 'Resource tidak ditemukan' }, { status: 404 });

    const body = await req.json();
    if (!isRecord(body)) return NextResponse.json({ error: 'Body harus berupa object' }, { status: 400 });

    const data = normalizeCollectionItem(resource, body);
    if (typeof data.id !== 'string' || data.id.length === 0) {
      return NextResponse.json({ error: 'Body harus memiliki id string' }, { status: 400 });
    }

    const delegate = (prisma as any)[resources[resource]];
    const created = await delegate.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ error: 'Login admin diperlukan.' }, { status: 401 });

    const { slug } = await context.params;

    if (slug.length === 1 && slug[0] === 'profile') {
      const body = await req.json();
      const updated = await prisma.profile.update({ where: { id: 1 }, data: body });
      return NextResponse.json(updated);
    }

    if (slug.length === 1 && slug[0] === 'contact') {
      const body = await req.json();
      const updated = await prisma.contact.update({ where: { id: 1 }, data: body });
      return NextResponse.json(updated);
    }

    const resourceParam = slug[0];
    const resource = getResource(resourceParam);
    if (!resource) return NextResponse.json({ error: 'Resource tidak ditemukan' }, { status: 404 });

    const delegate = (prisma as any)[resources[resource]];

    // PUT /api/portfolio/:resource/:id
    if (slug.length >= 2) {
      const id = slug[1];
      const body = await req.json();
      if (!isRecord(body)) return NextResponse.json({ error: 'Body harus berupa object' }, { status: 400 });
      const data = normalizeCollectionItem(resource, { ...body, id });
      const updated = await delegate.upsert({
        where: { id },
        create: data,
        update: data,
      });
      return NextResponse.json(updated);
    }

    // PUT /api/portfolio/:resource (bulk array)
    const body = await req.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: 'Body harus berupa array' }, { status: 400 });
    if (!body.every(isRecord)) return NextResponse.json({ error: 'Semua item harus berupa object' }, { status: 400 });
    if (!body.every((item: Record<string, unknown>) => typeof item.id === 'string' && item.id.length > 0)) {
      return NextResponse.json({ error: 'Semua item harus memiliki id string' }, { status: 400 });
    }

    const result = await prisma.$transaction(
      body.map((item: Record<string, unknown>) => {
        const data = normalizeCollectionItem(resource, item);
        return delegate.upsert({ where: { id: data.id }, create: data, update: data });
      })
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ error: 'Login admin diperlukan.' }, { status: 401 });

    const { slug } = await context.params;
    if (slug.length < 2) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });

    const [resourceParam, id] = slug;
    const resource = getResource(resourceParam);
    if (!resource) return NextResponse.json({ error: 'Resource tidak ditemukan' }, { status: 404 });

    const delegate = (prisma as any)[resources[resource]];
    try {
      await delegate.delete({ where: { id } });
    } catch (error) {
      if (isRecord(error) && error.code === 'P2025') {
        return new NextResponse(null, { status: 204 });
      }
      throw error;
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
