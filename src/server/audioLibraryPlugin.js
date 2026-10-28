import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const EXTENSIONS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm', '.opus']);
const MAX_BYTES = 50 * 1024 * 1024;

export function audioLibraryPlugin({
  audioDir = path.resolve(process.cwd(), 'public/audio'),
  trashDir = path.resolve(process.cwd(), '.audio-trash')
} = {}) {
  fs.mkdirSync(audioDir, { recursive: true });
  const list = () => fs.readdirSync(audioDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map(entry => {
      const stat = fs.statSync(path.join(audioDir, entry.name));
      return { filename: entry.name, url: `/audio/${encodeURIComponent(entry.name)}`, size: stat.size };
    }).sort((a, b) => a.filename.localeCompare(b.filename));

  const install = server => {
    server.middlewares.use(async (req, res, next) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname !== '/api/audio') return next();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (req.method === 'GET') {
        res.end(JSON.stringify({ tracks: list() }));
        return;
      }
      const requested = url.searchParams.get('filename') || '';
      if (!requested || requested !== path.basename(requested) || /[\\/\x00]/.test(requested)
        || requested.startsWith('.') || !EXTENSIONS.has(path.extname(requested).toLowerCase())) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Nom ou format audio invalide.' }));
        return;
      }
      if (req.method === 'POST') {
        if (Number(req.headers['content-length']) > MAX_BYTES) throw Object.assign(new Error('Fichier limité à 50 Mo.'), { status: 413 });
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > MAX_BYTES) throw Object.assign(new Error('Fichier limité à 50 Mo.'), { status: 413 });
          chunks.push(chunk);
        }
        if (!size) throw Object.assign(new Error('Le fichier audio est vide.'), { status: 400 });
        const ext = path.extname(requested).toLowerCase();
        const stem = path.basename(requested, path.extname(requested)).replace(/[^\p{L}\p{N}._ -]/gu, '_').slice(0, 100) || 'audio';
        let filename = `${stem}${ext}`, suffix = 2;
        while (fs.existsSync(path.join(audioDir, filename))) filename = `${stem}_${suffix++}${ext}`;
        fs.writeFileSync(path.join(audioDir, filename), Buffer.concat(chunks), { flag: 'wx' });
        res.statusCode = 201;
        res.end(JSON.stringify({ track: list().find(track => track.filename === filename) }));
        return;
      }
      if (req.method === 'DELETE') {
        const file = path.join(audioDir, requested);
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Piste introuvable.' }));
          return;
        }
        fs.mkdirSync(trashDir, { recursive: true });
        fs.renameSync(file, path.join(trashDir, `${Date.now()}_${randomUUID()}_${requested}`));
        res.end(JSON.stringify({ success: true }));
        return;
      }
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'Méthode non autorisée.' }));
    } catch (error) {
      res.statusCode = error.status || 500;
      res.end(JSON.stringify({ error: error.message }));
    }
    });
  };

  return {
    name: 'audio-library',
    configureServer: install,
    configurePreviewServer: install,
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'audio/manifest.json', source: JSON.stringify({ tracks: list() }, null, 2) });
    }
  };
}
