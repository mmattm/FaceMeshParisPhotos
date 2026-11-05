import * as THREE from 'three';

// Render both moving portraits only during a fade; endpoints keep one render pass.
export class PortraitCompositor {
  constructor(renderer) {
    this.renderer = renderer;
    this.size = new THREE.Vector2();
    this.frozen = false;
  }

  freezeLiveFrame(canvas) {
    this.snapshot ??= document.createElement('canvas');
    this.snapshot.width = canvas.width;
    this.snapshot.height = canvas.height;
    this.snapshot.getContext('2d').drawImage(canvas, 0, 0);
    this.snapshotTexture ??= new THREE.CanvasTexture(this.snapshot);
    this.snapshotTexture.needsUpdate = true;
    this.frozen = true;
  }

  setup() {
    if (this.material) return;
    this.fallbackTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, stencilBuffer: true });
    this.liveTarget = this.fallbackTarget.clone();
    this.uniforms = { fallbackMap: { value: null }, liveMap: { value: null },
      liveMix: { value: 0 }, frozenLive: { value: false } };
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms, depthTest: false, depthWrite: false,
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `
        uniform sampler2D fallbackMap;
        uniform sampler2D liveMap;
        uniform float liveMix;
        uniform bool frozenLive;
        varying vec2 vUv;
        void main() {
          vec4 a = texture2D(fallbackMap, vUv);
          vec4 b = texture2D(liveMap, vUv);
          if (frozenLive) {
            #ifdef TONE_MAPPING
              a.rgb = toneMapping(a.rgb);
            #endif
            b = sRGBTransferEOTF(b);
            gl_FragColor = mix(a, b, liveMix);
          } else {
            gl_FragColor = mix(a, b, liveMix);
            #include <tonemapping_fragment>
          }
          #include <colorspace_fragment>
        }`
    });
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    plane.frustumCulled = false;
    this.scene.add(plane);
  }

  render(mix, draw) {
    const previousTarget = this.renderer.getRenderTarget();
    try {
      if (mix <= 0 || (mix >= 1 && !this.frozen)) {
        this.frozen = false;
        draw(mix <= 0);
        return;
      }
      this.setup();
      this.renderer.getDrawingBufferSize(this.size);
      for (const target of [this.fallbackTarget, this.liveTarget]) target.setSize(this.size.x, this.size.y);
      this.renderer.setRenderTarget(this.fallbackTarget);
      draw(true);
      if (!this.frozen) {
        this.renderer.setRenderTarget(this.liveTarget);
        draw(false);
      }
      this.uniforms.fallbackMap.value = this.fallbackTarget.texture;
      this.uniforms.liveMap.value = this.frozen ? this.snapshotTexture : this.liveTarget.texture;
      this.uniforms.liveMix.value = mix;
      this.uniforms.frozenLive.value = this.frozen;
      this.renderer.setRenderTarget(previousTarget);
      this.renderer.render(this.scene, this.camera);
    } finally {
      this.renderer.setRenderTarget(previousTarget);
    }
  }
}
