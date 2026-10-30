import { randomUUID } from 'node:crypto';

// Only replace the visitor input; other LoadImage nodes may contain style references.
export async function uploadComfyVisitorImage(prompt, imageDataUrl, comfyFetch, baseUrl) {
  const imageNodes = Object.values(prompt).filter(node => node?.class_type === 'LoadImage');
  const target = imageNodes.find(node => node._meta?.title === 'VisitorImage') || imageNodes[0];
  if (!target) throw new Error('Le workflow doit contenir un nœud LoadImage pour le visiteur.');
  if (typeof imageDataUrl !== 'string' || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(imageDataUrl)) {
    throw new Error('Cliché du visiteur manquant ou invalide.');
  }
  const bytes = Buffer.from(imageDataUrl.split(',')[1], 'base64');
  if (bytes.length < 3 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
    throw new Error('Le cliché du visiteur doit être une image JPEG.');
  }
  const form = new FormData();
  form.append('image', new Blob([bytes], { type: 'image/jpeg' }), `visitor_${randomUUID()}.jpg`);
  form.append('type', 'input');
  form.append('overwrite', 'false');
  const response = await comfyFetch(`${baseUrl}/upload/image`, { method: 'POST', body: form });
  if (!response.ok) throw new Error(`Échec de l’envoi du cliché à ComfyUI : HTTP ${response.status}`);
  const uploaded = await response.json();
  if (!uploaded.name || typeof uploaded.name !== 'string') throw new Error('ComfyUI ne renvoie pas le nom du cliché envoyé.');
  target.inputs.image = uploaded.subfolder ? `${uploaded.subfolder}/${uploaded.name}` : uploaded.name;
  return target.inputs.image;
}
