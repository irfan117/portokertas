import { PrismaClient } from '@prisma/client';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import portfolioRoutes from './routes/portfolio';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/uploads';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  ...(process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
  ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : []),
];

const isOriginAllowed = (origin: string): boolean => {
  if (allowedOrigins.includes(origin)) return true;
  try {
    const hostname = new URL(origin).hostname;
    if (hostname.endsWith('.vercel.app')) return true;
  } catch {}
  return false;
};

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Health checks and curl usually do not send an Origin header.
    if (!origin || isOriginAllowed(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL) {
  globalForPrisma.prisma = prisma;
}

app.use(cors(corsOptions));
app.use(express.json());

const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes());
apiRouter.use('/uploads', uploadRoutes());
apiRouter.use('/portfolio', portfolioRoutes(prisma));

apiRouter.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'degraded', database: 'unavailable' });
  }
});

// Mount on /api and root fallback in case rewrite strips /api
app.use('/api', apiRouter);
app.use(apiRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API error:', error);
  if (res.headersSent) return;
  const message = error instanceof Error ? error.message : 'Terjadi kesalahan pada server.';
  res.status(500).json({ error: message });
});

let server: ReturnType<typeof app.listen> | undefined;

if (!process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`Portfolio API running on http://localhost:${PORT}`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  server?.close();
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
