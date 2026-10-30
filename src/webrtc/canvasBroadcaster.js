/**
 * WebRTC Canvas Stream Broadcaster
 * 
 * Composites the live webcam background with the clean WebGL overlay (zero UI)
 * and broadcasts the resulting image directly over WebRTC peer-to-peer.
 * 
 * Features:
 * - Fixed square output (1080x1080) at 30 FPS via a dedicated broadcast canvas.
 * - Real-time WebSocket signaling via /webrtc-signaling on the Vite dev server.
 * - Multi-peer support: multiple second computers/displays can connect simultaneously.
 * - Auto-reconnection & ICE candidate negotiation.
 * - Dispatches 'photomaton:webrtc-started' and 'photomaton:webrtc-peer-connected' events.
 * - Sends metadata (new-visitor notifications) to connected viewers over WebRTC DataChannel.
 */

export class CanvasBroadcaster extends EventTarget {
  constructor(canvasElement, options = {}) {
    super();
    this.canvas = canvasElement;
    this.videoElement = options.videoElement || null;
    this.canvasIncludesVideo = options.canvasIncludesVideo === true;
    this.isMirrored = options.mirrored !== false;
    this.liveBackgroundEnabled = true;
    this.fps = options.fps || 30;
    this.outputWidth = options.width || 1080;
    this.outputHeight = options.height || 1080;
    this.broadcastCanvas = null;
    this.broadcastCtx = null;
    this.framePumpId = null;
    this.lastFrameDrawTime = 0;
    this.stream = null;
    this.ws = null;
    this.peers = new Map(); // viewerId -> { pc, dc }
    this.isConnected = false;
    this.reconnectTimer = null;
    this.totalConnectedViewers = 0;

    this.iceServers = options.iceServers || [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ];

    this.initStream();
    this.connectSignaling();
  }

  initStream() {
    if (!this.canvas) return;
    try {
      if (!this.broadcastCanvas) {
        this.broadcastCanvas = document.createElement('canvas');
        this.broadcastCanvas.width = this.outputWidth;
        this.broadcastCanvas.height = this.outputHeight;
        this.broadcastCtx = this.broadcastCanvas.getContext('2d', {
          alpha: false,
          desynchronized: true
        });
        this.drawBroadcastFrame();
        this.startFramePump();
      }

      if (typeof this.broadcastCanvas.captureStream === 'function') {
        this.stream = this.broadcastCanvas.captureStream(this.fps);
      } else if (typeof this.broadcastCanvas.mozCaptureStream === 'function') {
        this.stream = this.broadcastCanvas.mozCaptureStream(this.fps);
      }
      const track = this.stream?.getVideoTracks?.()[0];
      if (track) track.contentHint = 'detail';
      console.log(`[WebRTC Broadcaster] Canvas ${this.outputWidth}x${this.outputHeight} capturé à ${this.fps} FPS`);
    } catch (e) {
      console.error('[WebRTC Broadcaster] Erreur capture canvas stream:', e);
    }
  }

  drawBroadcastFrame() {
    if (!this.broadcastCtx || !this.canvas) return;
    const sourceWidth = this.canvas.width || this.canvas.clientWidth || this.outputWidth;
    const sourceHeight = this.canvas.height || this.canvas.clientHeight || this.outputHeight;
    if (sourceWidth <= 0 || sourceHeight <= 0) return;

    // Center-crop the fixed 16:9 renderer into the square output. Using cover
    // avoids both distortion and black bars while keeping the face centered.
    const scale = Math.max(this.outputWidth / sourceWidth, this.outputHeight / sourceHeight);
    const drawWidth = Math.round(sourceWidth * scale);
    const drawHeight = Math.round(sourceHeight * scale);
    const offsetX = Math.round((this.outputWidth - drawWidth) * 0.5);
    const offsetY = Math.round((this.outputHeight - drawHeight) * 0.5);

    this.broadcastCtx.fillStyle = '#000000';
    this.broadcastCtx.fillRect(0, 0, this.outputWidth, this.outputHeight);

    // In LIVE mode the webcam is an HTML element behind the transparent WebGL
    // canvas, so rebuild that same composition inside the captured canvas.
    if (!this.canvasIncludesVideo && this.liveBackgroundEnabled && this.videoElement?.readyState >= 2) {
      this.drawVideoCover(this.videoElement, offsetX, offsetY, drawWidth, drawHeight);
    }

    // The WebGL canvas contains the mask in LIVE mode and the complete frozen
    // autonomous composition in AUTONOMOUS mode.
    this.broadcastCtx.drawImage(this.canvas, offsetX, offsetY, drawWidth, drawHeight);
  }

  drawVideoCover(video, destX, destY, destWidth, destHeight) {
    const videoWidth = video.videoWidth || 0;
    const videoHeight = video.videoHeight || 0;
    if (!videoWidth || !videoHeight || !destWidth || !destHeight) return;

    const videoAspect = videoWidth / videoHeight;
    const destAspect = destWidth / destHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = videoWidth;
    let sourceHeight = videoHeight;

    // Match CSS object-fit: cover used by the local LIVE background.
    if (videoAspect > destAspect) {
      sourceWidth = videoHeight * destAspect;
      sourceX = (videoWidth - sourceWidth) * 0.5;
    } else {
      sourceHeight = videoWidth / destAspect;
      sourceY = (videoHeight - sourceHeight) * 0.5;
    }

    this.broadcastCtx.save();
    this.broadcastCtx.beginPath();
    this.broadcastCtx.rect(destX, destY, destWidth, destHeight);
    this.broadcastCtx.clip();
    if (this.isMirrored) {
      this.broadcastCtx.translate(destX + destWidth, destY);
      this.broadcastCtx.scale(-1, 1);
      this.broadcastCtx.drawImage(
        video,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, destWidth, destHeight
      );
    } else {
      this.broadcastCtx.drawImage(
        video,
        sourceX, sourceY, sourceWidth, sourceHeight,
        destX, destY, destWidth, destHeight
      );
    }
    this.broadcastCtx.restore();
  }

  setMirrored(mirrored) {
    this.isMirrored = !!mirrored;
  }

  setLiveBackgroundEnabled(enabled) {
    this.liveBackgroundEnabled = !!enabled;
  }

  startFramePump() {
    if (this.framePumpId !== null) return;
    const frameInterval = 1000 / this.fps;
    const pump = (now) => {
      if (now - this.lastFrameDrawTime >= frameInterval) {
        this.drawBroadcastFrame();
        this.lastFrameDrawTime = now;
      }
      this.framePumpId = requestAnimationFrame(pump);
    };
    this.framePumpId = requestAnimationFrame(pump);
  }

  getStream() {
    if (!this.stream) this.initStream();
    return this.stream;
  }

  async setAudioStream(audioStream) {
    const stream = this.getStream();
    if (!stream || !audioStream) return;
    const existing = new Set(stream.getAudioTracks().map(track => track.id));
    const tracks = audioStream.getAudioTracks().filter(track => !existing.has(track.id));
    if (!tracks.length) return;
    for (const track of tracks) stream.addTrack(track);
    // Existing receivers need a new offer to pick up the added audio track.
    await Promise.all([...this.peers.keys()].map(viewerId => this.createPeerForViewer(viewerId)));
  }

  /**
   * Mounts the actual WebRTC capture canvas in the operator UI. Because this
   * is the same canvas used by captureStream(), the preview exactly matches
   * the image sent to every WebRTC receiver.
   */
  mountPreview(container) {
    if (!container || !this.broadcastCanvas) return;
    this.broadcastCanvas.classList.add('webrtc-preview-canvas');
    this.broadcastCanvas.setAttribute('aria-label', 'Flux vidéo envoyé par WebRTC');
    container.style.aspectRatio = `${this.outputWidth} / ${this.outputHeight}`;
    container.replaceChildren(this.broadcastCanvas);

    const meta = document.getElementById('webrtc-preview-meta');
    if (meta) meta.textContent = `${this.outputWidth}×${this.outputHeight} · ${this.fps} FPS`;
  }

  connectSignaling() {
    if (typeof window === 'undefined') return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const signalingUrl = `${protocol}//${window.location.host}/webrtc-signaling`;

    try {
      this.ws = new WebSocket(signalingUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[WebRTC Broadcaster] 🟢 Connecté au serveur de signalement');
        this.ws.send(JSON.stringify({ type: 'register', role: 'broadcaster' }));
        this.updateStatusBadge();
      };

      this.ws.onmessage = async (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          await this.handleSignalingMessage(msg);
        } catch (err) {
          console.error('[WebRTC Broadcaster] Erreur message signalement:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.updateStatusBadge();
        // Auto-reconnect after 2 seconds
        this.reconnectTimer = setTimeout(() => this.connectSignaling(), 2000);
      };

      this.ws.onerror = (err) => {
        console.warn('[WebRTC Broadcaster] WebSocket signaling warning:', err);
      };
    } catch (e) {
      this.reconnectTimer = setTimeout(() => this.connectSignaling(), 3000);
    }
  }

  async handleSignalingMessage(msg) {
    const { type, viewerId } = msg;

    if (type === 'viewer-joined') {
      console.log(`[WebRTC Broadcaster] 📺 Nouveau récepteur détecté (${viewerId}), initialisation WebRTC...`);
      await this.createPeerForViewer(viewerId);
    } else if (type === 'answer') {
      const peerData = this.peers.get(viewerId);
      if (peerData && peerData.pc) {
        await peerData.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        console.log(`[WebRTC Broadcaster] ✅ Réponse SDP configurée pour ${viewerId}`);
      }
    } else if (type === 'ice-candidate') {
      const peerData = this.peers.get(viewerId);
      if (peerData && peerData.pc && msg.candidate) {
        try {
          await peerData.pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
        } catch (e) {
          console.warn('[WebRTC Broadcaster] Erreur ajout ICE candidate:', e);
        }
      }
    } else if (type === 'viewer-left') {
      this.closePeer(viewerId);
    }
  }

  async createPeerForViewer(viewerId) {
    this.closePeer(viewerId);

    const pc = new RTCPeerConnection({ iceServers: this.iceServers });
    let dc = null;
    try {
      dc = pc.createDataChannel('photomaton-meta', { ordered: true });
    } catch (e) {
      // DataChannel optional
    }

    const peerData = { pc, dc, viewerId };
    this.peers.set(viewerId, peerData);

    // Add canvas video tracks
    const stream = this.getStream();
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        const sender = pc.addTrack(track, stream);
        try {
          const parameters = sender.getParameters();
          parameters.degradationPreference = 'maintain-resolution';
          if (!parameters.encodings || parameters.encodings.length === 0) {
            parameters.encodings = [{}];
          }
          parameters.encodings[0].maxFramerate = this.fps;
          parameters.encodings[0].maxBitrate = 8_000_000;
          parameters.encodings[0].scaleResolutionDownBy = 1;
          sender.setParameters(parameters).catch(() => {
            // Some browsers only expose these encoding preferences after negotiation.
          });
        } catch (error) {
          // Encoding preferences are optional; the source track keeps its native size.
        }
      });
      stream.getAudioTracks().forEach(track => pc.addTrack(track, stream));
    }

    // ICE Candidate generation
    pc.onicecandidate = (event) => {
      if (event.candidate && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'ice-candidate',
          role: 'broadcaster',
          viewerId,
          candidate: event.candidate
        }));
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      if (this.peers.get(viewerId) !== peerData) return;
      console.log(`[WebRTC Broadcaster] État pair ${viewerId}: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        this.totalConnectedViewers = this.getConnectedCount();
        this.updateStatusBadge();
        window.dispatchEvent(new CustomEvent('photomaton:webrtc-peer-connected', {
          detail: { viewerId, totalConnected: this.totalConnectedViewers }
        }));
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        this.closePeer(viewerId);
      }
    };

    // Create and send SDP offer
    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false
      });
      await pc.setLocalDescription(offer);

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'offer',
          viewerId,
          sdp: pc.localDescription
        }));
      }
    } catch (err) {
      console.error(`[WebRTC Broadcaster] Erreur création offer pour ${viewerId}:`, err);
    }
  }

  closePeer(viewerId) {
    const peerData = this.peers.get(viewerId);
    if (peerData) {
      try {
        if (peerData.dc) peerData.dc.close();
        if (peerData.pc) peerData.pc.close();
      } catch (e) {
        // ignore
      }
      this.peers.delete(viewerId);
      this.totalConnectedViewers = this.getConnectedCount();
      this.updateStatusBadge();
      window.dispatchEvent(new CustomEvent('photomaton:webrtc-peer-disconnected', {
        detail: { viewerId, totalConnected: this.totalConnectedViewers }
      }));
    }
  }

  getConnectedCount() {
    let count = 0;
    for (const [_, p] of this.peers) {
      if (p.pc && (p.pc.connectionState === 'connected' || p.pc.iceConnectionState === 'connected')) {
        count++;
      }
    }
    return count;
  }

  /**
   * Called immediately whenever a new visitor is confirmed.
   * Dispatches the required 'photomaton:webrtc-started' event,
   * and notifies all connected second computers without capturing an image.
   */
  notifyNewVisitor(visitorDetail = {}) {
    const stream = this.getStream();
    const timestamp = Date.now();

    console.log('[WebRTC Broadcaster] Nouveau visiteur', { visitorDetail });

    // 1. Dispatch custom event on window
    const eventDetail = {
      stream,
      visitorDetail,
      timestamp,
      connectedViewers: this.getConnectedCount()
    };

    window.dispatchEvent(new CustomEvent('photomaton:webrtc-started', { detail: eventDetail }));
    this.dispatchEvent(new CustomEvent('webrtc-started', { detail: eventDetail }));

    // 2. Broadcast a lightweight visitor alert via WebSocket signaling.
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'new-visitor-alert',
        visitorId: visitorDetail.visitorId,
        timestamp,
        reason: visitorDetail.reason || 'NEW_VISITOR',
        dissimilarity: visitorDetail.dissimilarity || 0
      }));
    }

    // 3. Send the same lightweight alert over WebRTC DataChannel.
    const dcPayload = JSON.stringify({
      type: 'new-visitor',
      visitorId: visitorDetail.visitorId,
      timestamp,
      reason: visitorDetail.reason || 'NEW_VISITOR'
    });
    for (const [_, peerData] of this.peers) {
      if (peerData.dc && peerData.dc.readyState === 'open') {
        try {
          peerData.dc.send(dcPayload);
        } catch (e) {
          // ignore
        }
      }
    }

    this.updateStatusBadge();
  }

  updateStatusBadge() {
    const badge = document.getElementById('webrtc-status-badge');
    const text = document.getElementById('webrtc-status-text');
    const count = this.getConnectedCount();

    if (badge && text) {
      if (count > 0) {
        badge.classList.add('connected');
        badge.classList.remove('waiting');
        text.textContent = `WebRTC: ${count} ordi${count > 1 ? 's' : ''} connecté${count > 1 ? 's' : ''}`;
      } else if (this.isConnected) {
        badge.classList.remove('connected');
        badge.classList.add('waiting');
        text.textContent = `WebRTC: En attente d'un ordi`;
      } else {
        badge.classList.remove('connected', 'waiting');
        text.textContent = `WebRTC: Déconnecté`;
      }
    }
  }
}
