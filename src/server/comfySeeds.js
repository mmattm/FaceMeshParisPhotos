import { randomInt } from 'node:crypto';

// Only replace literal seeds: arrays are links to other workflow nodes.
export function randomizeComfySeeds(prompt) {
  const seeds = [];
  for (const [nodeId, node] of Object.entries(prompt)) {
    for (const [input, value] of Object.entries(node?.inputs || {})) {
      if (!/(^|[._])seed$/.test(input) || !Number.isSafeInteger(value)) continue;
      let seed;
      do {
        seed = randomInt(0, 2 ** 48 - 1);
      } while (seed === value);
      node.inputs[input] = seed;
      seeds.push({ nodeId, input, seed });
    }
  }
  return seeds;
}
