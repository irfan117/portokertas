import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'portfolio_admin';

function secret() {
  const value = process.env.AUTH_JWT_SECRET;
  if (!value) throw new Error('AUTH_JWT_SECRET belum dikonfigurasi.');
  return value;
}

export function signAdminToken(email: string) {
  return jwt.sign({ email, role: 'admin' }, secret(), { expiresIn: '8h' });
}

export function readAdminToken(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1];

  if (!token) return null;
  try {
    return jwt.verify(token, secret()) as { email: string; role: string };
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request) {
  return Boolean(readAdminToken(req));
}
