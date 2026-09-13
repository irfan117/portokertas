import app from '../server/index';

export default function handler(req: any, res: any) {
  // Pastikan req.url mengandung path asli termasuk prefix /api
  return app(req, res);
}
