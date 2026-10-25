import { defineConfig } from 'vite';
import https from 'node:https';
import { WebSocketServer } from 'ws';
import { KokoroTTS } from 'kokoro-js';
import { encodeWAV } from './src/tts/wavEncoder.js';

let kokoroTTSInstance = null;
async function getKokoro() {
  if (!kokoroTTSInstance) {
    kokoroTTSInstance = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
      dtype: 'q8'
    });
  }
  return kokoroTTSInstance;
}

function fetchGoogleTTS(text, lang = 'fr') {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Google TTS failed with status ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

const audioCache = new Map();

function ttsServerPlugin() {
  return {
    name: 'tts-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/tts')) {
          return next();
        }

        try {
          const url = new URL(req.url, 'http://localhost:5173');
          const text = url.searchParams.get('text') || '';
          const voice = url.searchParams.get('voice') || 'google:fr';

          if (!text.trim()) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Text parameter is required' }));
            return;
          }

          const cleanText = text.trim();
          const cacheKey = `${voice}_${cleanText}`;

          if (audioCache.has(cacheKey)) {
            const cached = audioCache.get(cacheKey);
            res.setHeader('Content-Type', cached.contentType);
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.end(cached.buffer);
            return;
          }

          if (voice.startsWith('kokoro:')) {
            const voiceName = voice.replace('kokoro:', '');
            const tts = await getKokoro();
            const result = await tts.generate(cleanText, { voice: voiceName });
            const wavBuffer = encodeWAV(result.audio, result.sampling_rate || 24000);

            audioCache.set(cacheKey, { buffer: wavBuffer, contentType: 'audio/wav' });
            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.end(wavBuffer);
          } else {
            // Google Multilingual Studio
            const langCode = voice.replace('google:', '') || 'fr';
            const mp3Buffer = await fetchGoogleTTS(cleanText, langCode);

            audioCache.set(cacheKey, { buffer: mp3Buffer, contentType: 'audio/mpeg' });
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.end(mp3Buffer);
          }
        } catch (err) {
          console.error('[TTS API Error]', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'TTS Generation Failed' }));
        }
      });
    }
  };
}

import fs from 'node:fs';
import path from 'node:path';

function animationsServerPlugin() {
  const animationsDir = path.resolve(process.cwd(), 'public/animations');
  if (!fs.existsSync(animationsDir)) {
    fs.mkdirSync(animationsDir, { recursive: true });
  }

  return {
    name: 'animations-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/animations')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost:5173');
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'GET') {
          try {
            const files = fs.readdirSync(animationsDir).filter(f => f.endsWith('.json'));
            const list = [];
            for (const file of files) {
              try {
                const filePath = path.join(animationsDir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                list.push({
                  id: data.id || file.replace('.json', ''),
                  name: data.name || file.replace('.json', ''),
                  filename: file,
                  durationMs: data.durationMs || 0,
                  frameCount: data.frameCount || (data.frames ? data.frames.length : (data.headPoseTrack ? data.headPoseTrack.length : 0)),
                  createdAt: data.createdAt || fs.statSync(filePath).birthtime.toISOString(),
                  hasAudio: !!data.audioData
                });
              } catch (err) {
                console.warn(`[Animations API] Error reading ${file}:`, err);
              }
            }
            res.statusCode = 200;
            res.end(JSON.stringify(list));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        if (req.method === 'POST') {
          try {
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(chunks).toString('utf-8');
                const animData = JSON.parse(bodyStr);

                if (!animData || (!animData.frames && !animData.headPoseTrack)) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Invalid animation data: must contain frames or tracks' }));
                  return;
                }

                const rawName = animData.name || 'animation';
                const safeName = rawName.toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9_-]/g, '_')
                  .replace(/_+/g, '_');
                
                const filename = `${safeName}_${Date.now()}.json`;
                const filePath = path.join(animationsDir, filename);

                const fullData = {
                  id: animData.id || `anim_${Date.now()}`,
                  name: animData.name || 'Animation',
                  filename: filename,
                  durationMs: animData.durationMs || 0,
                  frameCount: animData.frameCount || (animData.frames ? animData.frames.length : (animData.headPoseTrack ? animData.headPoseTrack.length : 0)),
                  createdAt: new Date().toISOString(),
                  ...animData
                };

                fs.writeFileSync(filePath, JSON.stringify(fullData, null, 2), 'utf-8');

                res.statusCode = 201;
                res.end(JSON.stringify({ success: true, filename, animation: fullData }));
              } catch (parseErr) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Failed to parse JSON body: ' + parseErr.message }));
              }
            });
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        if (req.method === 'DELETE') {
          try {
            const filename = url.searchParams.get('filename') || path.basename(url.pathname);
            if (!filename || filename === 'animations' || !filename.endsWith('.json')) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid filename' }));
              return;
            }
            const safeFile = path.basename(filename);
            const filePath = path.join(animationsDir, safeFile);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, filename: safeFile }));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'File not found' }));
            }
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

function webrtcSignalingPlugin() {
  return {
    name: 'webrtc-signaling-plugin',
    configureServer(server) {
      if (!server.httpServer) return;
      const wss = new WebSocketServer({ noServer: true });

      server.httpServer.on('upgrade', (request, socket, head) => {
        try {
          const url = new URL(request.url, 'http://localhost:5173');
          if (url.pathname === '/webrtc-signaling') {
            wss.handleUpgrade(request, socket, head, (ws) => {
              wss.emit('connection', ws, request);
            });
          }
        } catch (e) {
          // ignore
        }
      });

      let broadcasterWs = null;
      const viewerSockets = new Map();
      let nextViewerSeq = 1;

      wss.on('connection', (ws) => {
        let assignedRole = null;
        let assignedViewerId = null;

        ws.on('message', (raw) => {
          try {
            const msg = JSON.parse(raw.toString());
            if (msg.type === 'register') {
              assignedRole = msg.role;
              if (msg.role === 'broadcaster') {
                broadcasterWs = ws;
                console.log(`[WebRTC Signaling] 🎥 Broadcaster registered (${viewerSockets.size} viewers waiting)`);
                for (const [vid, vWs] of viewerSockets.entries()) {
                  if (vWs.readyState === 1) {
                    vWs.send(JSON.stringify({ type: 'broadcaster-ready' }));
                    broadcasterWs.send(JSON.stringify({ type: 'viewer-joined', viewerId: vid }));
                  }
                }
              } else if (msg.role === 'viewer') {
                assignedViewerId = msg.viewerId || `viewer_${nextViewerSeq++}_${Date.now()}`;
                viewerSockets.set(assignedViewerId, ws);
                console.log(`[WebRTC Signaling] 📺 Viewer connected: ${assignedViewerId} (Total: ${viewerSockets.size})`);
                ws.send(JSON.stringify({ type: 'registered', viewerId: assignedViewerId }));

                if (broadcasterWs && broadcasterWs.readyState === 1) {
                  broadcasterWs.send(JSON.stringify({ type: 'viewer-joined', viewerId: assignedViewerId }));
                  ws.send(JSON.stringify({ type: 'broadcaster-ready' }));
                }
              }
            } else if (msg.type === 'offer') {
              const targetWs = viewerSockets.get(msg.viewerId);
              if (targetWs && targetWs.readyState === 1) {
                targetWs.send(JSON.stringify(msg));
              }
            } else if (msg.type === 'answer') {
              if (broadcasterWs && broadcasterWs.readyState === 1) {
                broadcasterWs.send(JSON.stringify(msg));
              }
            } else if (msg.type === 'ice-candidate') {
              if (msg.role === 'broadcaster') {
                const targetWs = viewerSockets.get(msg.viewerId);
                if (targetWs && targetWs.readyState === 1) {
                  targetWs.send(JSON.stringify(msg));
                }
              } else if (broadcasterWs && broadcasterWs.readyState === 1) {
                broadcasterWs.send(JSON.stringify(msg));
              }
            } else if (msg.type === 'new-visitor-alert') {
              for (const [vid, vWs] of viewerSockets.entries()) {
                if (vWs.readyState === 1) {
                  vWs.send(JSON.stringify(msg));
                }
              }
            }
          } catch (err) {
            console.error('[WebRTC Signaling Error]', err);
          }
        });

        ws.on('close', () => {
          if (ws === broadcasterWs) {
            broadcasterWs = null;
            console.log('[WebRTC Signaling] 🎥 Broadcaster disconnected');
            for (const [vid, vWs] of viewerSockets.entries()) {
              if (vWs.readyState === 1) {
                vWs.send(JSON.stringify({ type: 'broadcaster-disconnected' }));
              }
            }
          } else if (assignedViewerId) {
            viewerSockets.delete(assignedViewerId);
            console.log(`[WebRTC Signaling] 📺 Viewer disconnected: ${assignedViewerId} (Remaining: ${viewerSockets.size})`);
            if (broadcasterWs && broadcasterWs.readyState === 1) {
              broadcasterWs.send(JSON.stringify({ type: 'viewer-left', viewerId: assignedViewerId }));
            }
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [ttsServerPlugin(), animationsServerPlugin(), webrtcSignalingPlugin()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        receiver: path.resolve(__dirname, 'receiver.html')
      }
    }
  },
  optimizeDeps: {
    include: ['@mediapipe/tasks-vision', 'three', 'lucide']
  }
});

