import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'portfolio_admin';

function secret() {
  const value = process.env.AUTH_JWT_SECRET;
  if (!value) throw new Error('AUTH_JWT_SECRET belum dikonfigurasi.');
  return value;
}

export function signAdminToken(email: string) {
  return jwt.sign({ email, role: 'admin' }, secret(), { expiresIn: '8h' });
}

export function readAdminToken(req: Request) {
  const header = req.headers.cookie || '';
  const token = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.split('=')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, secret()) as { email: string; role: string };
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!readAdminToken(req)) return res.status(401).json({ error: 'Login admin diperlukan.' });
    next();
  } catch {
    res.status(500).json({ error: 'Auth belum dikonfigurasi.' });
  }
}

export { COOKIE_NAME };
