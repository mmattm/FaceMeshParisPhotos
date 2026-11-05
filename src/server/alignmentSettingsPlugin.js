import fs from 'node:fs/promises';
import path from 'node:path';

export function alignmentSettingsPlugin({ file = path.resolve('library/camera-alignment.json') } = {}) {
  const install = server => {
    server.middlewares.use(async (req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/camera-alignment') return next();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    try {
      let settings = {};
      try { settings = JSON.parse(await fs.readFile(file, 'utf8')); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      if (req.method === 'GET') return res.end(JSON.stringify(settings));
      if (req.method !== 'POST') { res.statusCode = 405; return res.end('{}'); }
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 4096) { res.statusCode = 413; return res.end('{}'); }
      }
      const { mode, values } = JSON.parse(body);
      const limits = { x: [-300, 300], y: [-300, 300], pitch: [-45, 45],
        yaw: [-45, 45], roll: [-30, 30], zoom: [0.5, 2.0] };
      if (!['live', 'live_bust', 'autonomous_bust', 'minimalist'].includes(mode)
        || !values || Object.entries(limits).some(([key, [min, max]]) =>
          !Number.isFinite(values[key]) || values[key] < min || values[key] > max)) {
        res.statusCode = 400; return res.end('{}');
      }
      for (const [key, max, fallback] of [['maxYaw', 90, 42], ['maxPitch', 45, 8], ['eyeOpening', 120, 100], ['audioMouthOpening', 300, 100]]) {
        const value = values[key] ?? fallback;
        if (!Number.isFinite(value) || value < 0 || value > max) {
          res.statusCode = 400; return res.end('{}');
        }
        values[key] = value;
        limits[key] = [0, max];
      }
      for (const key of ['livePitchTrim', 'autoPitchTrim']) {
        const value = values[key] ?? 0;
        if (!Number.isFinite(value) || value < -10 || value > 10) {
          res.statusCode = 400; return res.end('{}');
        }
        values[key] = value;
        limits[key] = [-10, 10];
      }
      settings[mode] = Object.fromEntries(Object.keys(limits).map(key => [key, values[key]]));
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(`${file}.tmp`, JSON.stringify(settings, null, 2));
      await fs.rename(`${file}.tmp`, file);
      res.end(JSON.stringify(settings));
    } catch {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Sauvegarde des alignements impossible' }));
    }
    });
  };
  return { name: 'alignment-settings', configureServer: install, configurePreviewServer: install };
}
