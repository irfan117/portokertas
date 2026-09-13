import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { COOKIE_NAME, readAdminToken, signAdminToken } from '../auth';

export default function authRoutes() {
  const router = Router();

  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      const configuredEmail = process.env.AUTH_ADMIN_EMAIL;
      const configuredPassword = process.env.AUTH_ADMIN_PASSWORD;
      const configuredSecret = process.env.AUTH_JWT_SECRET;

      if (!configuredEmail || !configuredPassword) {
        return res.status(503).json({ error: 'AUTH_ADMIN_EMAIL dan AUTH_ADMIN_PASSWORD belum dikonfigurasi di Vercel Environment Variables.' });
      }
      if (!configuredSecret) {
        return res.status(503).json({ error: 'AUTH_JWT_SECRET belum dikonfigurasi di Vercel Environment Variables.' });
      }

      const validEmail = email?.toLowerCase() === configuredEmail.toLowerCase();
      const validPassword = configuredPassword.startsWith('$2')
        ? await bcrypt.compare(password || '', configuredPassword)
        : password === configuredPassword;

      if (!validEmail || !validPassword) return res.status(401).json({ error: 'Email atau password salah.' });

      res.cookie(COOKIE_NAME, signAdminToken(configuredEmail), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 8 * 60 * 60 * 1000,
      });
      res.json({ authenticated: true, email: configuredEmail });
    } catch (error) {
      next(error);
    }
  });

  router.post('/logout', (_req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.status(204).end();
  });

  router.get('/me', (req, res) => {
    const user = readAdminToken(req);
    if (!user) return res.status(401).json({ authenticated: false });
    res.json({ authenticated: true, email: user.email, role: user.role });
  });

  return router;
}
