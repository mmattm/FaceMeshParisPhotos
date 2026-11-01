import * as THREE from 'three';
import canonicalFaceObj from './canonicalFaceModel.obj?raw';

export const canonicalVertices = canonicalFaceObj.split(/\r?\n/)
  .filter(line => line.startsWith('v '))
  .map(line => new THREE.Vector3(...line.trim().split(/\s+/).slice(1).map(Number)));
