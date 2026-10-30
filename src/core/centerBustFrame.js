import * as THREE from 'three';

// Center and soften the displayed pose without changing tracking or image UVs.
export function centerBustFrame(frame, aspectRatio = 16 / 9) {
  const anchor = frame.landmarks?.[168];
  if (!anchor) return frame;
  const ar = Math.max(0.1, aspectRatio);
  const pose = frame.poseLandmarks || frame.landmarks;
  const point = index => {
    const p = pose[index];
    return p && new THREE.Vector3(p.x * ar, -p.y, -(p.z || 0) * ar);
  };
  const a = point(33), b = point(263), top = point(10), chin = point(152);
  const correction = new THREE.Quaternion();
  if (a && b && top && chin) {
    const x = new THREE.Vector3().subVectors(a.x < b.x ? b : a, a.x < b.x ? a : b).normalize();
    const y = top.sub(chin);
    y.addScaledVector(x, -y.dot(x)).normalize();
    const z = new THREE.Vector3().crossVectors(x, y).normalize();
    if (x.lengthSq() > 0.9 && y.lengthSq() > 0.9 && z.lengthSq() > 0.9) {
      const rotation = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
      const angles = new THREE.Euler().setFromQuaternion(rotation, 'YXZ');
      const limit = (value, degrees) => THREE.MathUtils.clamp(value * 0.5,
        -THREE.MathUtils.degToRad(degrees), THREE.MathUtils.degToRad(degrees));
      angles.set(limit(angles.x, 12), limit(angles.y, 20), limit(angles.z, 8), 'YXZ');
      correction.setFromEuler(angles).multiply(rotation.invert());
    }
  }
  const translate = points => points?.map(p => {
    if (!p) return p;
    const v = new THREE.Vector3((p.x - anchor.x) * ar,
      anchor.y - p.y, -((p.z || 0) - (anchor.z || 0)) * ar).applyQuaternion(correction);
    return { ...p, x: 0.5 + v.x / ar, y: 0.5 - v.y, z: (anchor.z || 0) - v.z / ar };
  });
  return {
    ...frame,
    landmarks: translate(frame.landmarks),
    poseLandmarks: translate(frame.poseLandmarks),
    liveLandmarks: frame.liveLandmarks || frame.landmarks
  };
}
