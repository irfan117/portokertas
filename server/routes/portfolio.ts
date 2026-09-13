import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { requireAdmin } from '../auth';

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

export default function portfolioRoutes(prisma: PrismaClient) {
  const router = Router();

  router.put('/profile', requireAdmin, async (req, res, next) => {
    try {
      res.json(await prisma.profile.update({ where: { id: 1 }, data: req.body }));
    } catch (error) {
      next(error);
    }
  });

  router.put('/contact', requireAdmin, async (req, res, next) => {
    try {
      res.json(await prisma.contact.update({ where: { id: 1 }, data: req.body }));
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (_req, res, next) => {
    try {
      const [profile, contact, workProjects, labNotes, talksWriting, careerList, experienceSlides, caseStudies, nowItems, gitAccounts] =
        await Promise.all([
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
      res.json({ profile, contact, workProjects, labNotes, talksWriting, careerList, experienceSlides, caseStudies, nowItems, gitAccounts });
    } catch (error) {
      next(error);
    }
  });

  // Generic CRUD endpoints for collection-backed admin data.
  router.get('/:resource', async (req, res, next) => {
    const resource = getResource(req.params.resource);
    if (!resource) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    try {
      const delegate = (prisma as any)[resources[resource]];
      res.json(await delegate.findMany());
    } catch (error) {
      next(error);
    }
  });

  router.post('/:resource', requireAdmin, async (req, res, next) => {
    const resource = getResource(req.params.resource);
    if (!resource) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    try {
      const delegate = (prisma as any)[resources[resource]];
      if (!isRecord(req.body)) return res.status(400).json({ error: 'Body harus berupa object' });
      const data = normalizeCollectionItem(resource, req.body);
      if (typeof data.id !== 'string' || data.id.length === 0) {
        return res.status(400).json({ error: 'Body harus memiliki id string' });
      }
      res.status(201).json(await delegate.create({ data }));
    } catch (error) {
      next(error);
    }
  });

  router.put('/:resource', requireAdmin, async (req, res, next) => {
    const resource = getResource(req.params.resource);
    if (!resource) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Body harus berupa array' });
    try {
      const delegate = (prisma as any)[resources[resource]];
      if (!req.body.every(isRecord)) return res.status(400).json({ error: 'Semua item harus berupa object' });
      if (!req.body.every((item: Record<string, unknown>) => typeof item.id === 'string' && item.id.length > 0)) {
        return res.status(400).json({ error: 'Semua item harus memiliki id string' });
      }
      const result = await prisma.$transaction(
        req.body.map((item: Record<string, unknown>) => {
          const data = normalizeCollectionItem(resource, item);
          return delegate.upsert({ where: { id: data.id }, create: data, update: data });
        }),
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:resource/:id', requireAdmin, async (req, res, next) => {
    const resource = getResource(req.params.resource);
    if (!resource) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    try {
      const delegate = (prisma as any)[resources[resource]];
      if (!isRecord(req.body)) return res.status(400).json({ error: 'Body harus berupa object' });
      const data = normalizeCollectionItem(resource, { ...req.body, id: req.params.id });
      res.json(
        await delegate.upsert({
          where: { id: req.params.id },
          create: data,
          update: data,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:resource/:id', requireAdmin, async (req, res, next) => {
    const resource = getResource(req.params.resource);
    if (!resource) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    try {
      const delegate = (prisma as any)[resources[resource]];
      await delegate.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch (error) {
      if (isRecord(error) && error.code === 'P2025') return res.status(204).end();
      next(error);
    }
  });

  return router;
}
