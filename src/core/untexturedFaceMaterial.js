import * as THREE from 'three';

/** Contrasting eyebrows attached to the skin, including its morph targets. */
export function createUntexturedFaceMaterial(toCanonical, canonicalVertices) {
  const upper = [300, 293, 334, 296, 336];
  const lower = [276, 283, 282, 295, 285];
  const path = upper.map((index, i) => {
    const point = canonicalVertices[index].clone().add(canonicalVertices[lower[i]]).multiplyScalar(.5);
    point.y -= .65; // Bring the markings closer to the eyelids.
    return point;
  });
  const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
  material.onBeforeCompile = shader => {
    shader.uniforms.eyebrowToCanonical = { value: toCanonical.clone() };
    shader.uniforms.eyebrowPath = { value: path };
    // Interpolating the original skin coordinates keeps the markings attached
    // as the GPU morphs the mesh, with no dependency on live webcam landmarks.
    shader.vertexShader = 'uniform mat4 eyebrowToCanonical; varying vec3 vEyebrowRest;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nvEyebrowRest = (eyebrowToCanonical * vec4(position, 1.0)).xyz;');
    shader.fragmentShader = `
      varying vec3 vEyebrowRest;
      uniform vec3 eyebrowPath[5];
      float eyebrowMask() {
        vec3 p = vec3(abs(vEyebrowRest.x), vEyebrowRest.yz);
        if (p.x < 1.0 || p.x > 6.0 || p.y < 3.0 || p.y > 5.5 || p.z < 1.5) return 0.0;
        float mask = 0.0;
        for (int i = 0; i < 4; i++) {
          vec3 a = eyebrowPath[i], b = eyebrowPath[i + 1];
          vec2 segment = b.xy - a.xy;
          float t = clamp(dot(p.xy - a.xy, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
          vec3 nearest = mix(a, b, t);
          float progress = (float(i) + t) / 4.0;
          float radius = mix(0.045, 0.18, smoothstep(0.0, 0.24, progress));
          float distanceToBrow = length(p.xy - nearest.xy);
          float edge = 0.085;
          float front = 1.0 - smoothstep(1.8, 3.2, abs(p.z - nearest.z));
          mask = max(mask, (1.0 - smoothstep(radius - edge, radius + edge, distanceToBrow)) * front);
        }
        return mask;
      }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      'gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );',
      'gl_FragColor = vec4(mix(packNormalToRGB(normal), vec3(0.025), eyebrowMask() * 0.75), diffuseColor.a);');
  };
  material.customProgramCacheKey = () => 'normal-face-eyebrows-v5';
  return material;
}
