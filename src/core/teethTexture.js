import * as THREE from 'three';

// A small procedural enamel atlas: individual crowns with warm necks,
// translucent-looking tips and soft contact shadows instead of a white ribbon.
export function createTeethTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#57483d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const rows = [
    [0, 0.08, 0.18, 0.29, 0.38, 0.50, 0.62, 0.71, 0.82, 0.92, 1],
    [0, 0.10, 0.21, 0.32, 0.41, 0.50, 0.59, 0.68, 0.79, 0.90, 1]
  ];
  for (let row = 0; row < 2; row++) {
    const y = row * 128;
    const boundaries = rows[row];
    for (let tooth = 0; tooth < boundaries.length - 1; tooth++) {
      const x = boundaries[tooth] * canvas.width + 0.8;
      const width = (boundaries[tooth + 1] - boundaries[tooth]) * canvas.width - 1.6;
      const center = (boundaries[tooth] + boundaries[tooth + 1]) / 2;
      const sideShade = Math.abs(center - 0.5) * 0.35;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y - 5, width, 138, [10, 10, 7, 7]);
      ctx.clip();
      const enamel = ctx.createLinearGradient(0, y, 0, y + 128);
      enamel.addColorStop(0, '#afa18b');
      enamel.addColorStop(0.25, '#d4cbb8');
      enamel.addColorStop(0.65, '#e8e3d6');
      enamel.addColorStop(0.90, '#deded5');
      enamel.addColorStop(1, '#b8c0bb');
      ctx.fillStyle = enamel;
      ctx.fillRect(x, y, width, 128);
      const convex = ctx.createLinearGradient(x, 0, x + width, 0);
      convex.addColorStop(0, 'rgba(57,40,23,0.26)');
      convex.addColorStop(0.22, 'rgba(255,255,255,0.04)');
      convex.addColorStop(0.48, 'rgba(255,255,255,0.13)');
      convex.addColorStop(0.80, 'rgba(57,40,23,0.02)');
      convex.addColorStop(1, 'rgba(57,40,23,0.24)');
      ctx.fillStyle = convex;
      ctx.fillRect(x, y, width, 128);
      ctx.fillStyle = `rgba(45,32,24,${sideShade + (row === 1 ? 0.10 : 0)})`;
      ctx.fillRect(x, y, width, 128);
      // Fine, low-contrast vertical enamel texture, deterministic per crown.
      for (let line = 1; line < 8; line++) {
        const lx = x + width * line / 8;
        ctx.strokeStyle = `rgba(255,255,240,${0.012 + (tooth % 3) * 0.006})`;
        ctx.beginPath();
        ctx.moveTo(lx, y + 28);
        ctx.lineTo(lx + Math.sin(tooth + line) * 2, y + 112);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
