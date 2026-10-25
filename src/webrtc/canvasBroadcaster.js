/**
 * WebRTC Canvas Stream Broadcaster
 * 
 * Captures the clean WebGL canvas stream (zero UI, pure video) and broadcasts it
 * directly to a second computer over WebRTC peer-to-peer connection.
 * 
 * Features:
 * - Direct canvas stream capture at 30/60 FPS via canvas.captureStream().
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
    this.fps = options.fps || 30;
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
      if (typeof this.canvas.captureStream === 'function') {
        this.stream = this.canvas.captureStream(this.fps);
      } else if (typeof this.canvas.mozCaptureStream === 'function') {
        this.stream = this.canvas.mozCaptureStream(this.fps);
      }
      console.log('[WebRTC Broadcaster] 🎥 Canvas stream capturé avec succès (30 FPS)');
    } catch (e) {
      console.error('[WebRTC Broadcaster] Erreur capture canvas stream:', e);
    }
  }

  getStream() {
    if (!this.stream) this.initStream();
    return this.stream;
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
        pc.addTrack(track, stream);
      });
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
   * notifies all connected second computers over WebSocket & WebRTC DataChannel,
   * and refreshes the canvas video stream transmission.
   */
  notifyNewVisitor(visitorDetail = {}) {
    const stream = this.getStream();
    const timestamp = Date.now();

    console.log('[WebRTC Broadcaster] 🚀 Démarrage protocole WebRTC pour nouveau visiteur', visitorDetail);

    // 1. Dispatch custom event on window
    const eventDetail = {
      stream,
      visitorDetail,
      timestamp,
      connectedViewers: this.getConnectedCount()
    };

    window.dispatchEvent(new CustomEvent('photomaton:webrtc-started', { detail: eventDetail }));
    this.dispatchEvent(new CustomEvent('webrtc-started', { detail: eventDetail }));

    // 2. Broadcast new visitor alert via WebSocket signaling
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'new-visitor-alert',
        timestamp,
        reason: visitorDetail.reason || 'NEW_VISITOR',
        dissimilarity: visitorDetail.dissimilarity || 0
      }));
    }

    // 3. Send over DataChannels to all connected computers
    const dcPayload = JSON.stringify({
      type: 'new-visitor',
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
