import dgram from 'node:dgram';
import { isIP } from 'node:net';

function oscString(value) {
  const bytes = Buffer.from(`${value}\0`, 'utf8');
  const padded = Buffer.alloc(Math.ceil(bytes.length / 4) * 4);
  bytes.copy(padded);
  return padded;
}

export function encodeNewVisitorOsc(oscAddress = '/newVisitor') {
  if (!['/newVisitor', '/generationDone'].includes(oscAddress)) throw new Error('Signal OSC inconnu');
  const value = Buffer.alloc(4);
  value.writeInt32BE(1);
  return Buffer.concat([oscString(oscAddress), oscString(',i'), value]);
}

export function normalizePeerAddress(address = '') {
  return address.startsWith('::ffff:') ? address.slice(7) : address;
}

export function sendNewVisitorOsc(host, port = 9000, oscAddress = '/newVisitor') {
  const packet = encodeNewVisitorOsc(oscAddress);
  const address = normalizePeerAddress(host);
  const family = isIP(address);
  if (!family || !Number.isInteger(port) || port < 1 || port > 65535) {
    return Promise.reject(new Error('OSC: adresse IP ou port invalide'));
  }
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket(family === 6 ? 'udp6' : 'udp4');
    let finished = false;
    const finish = error => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      socket.close();
      if (error) reject(error);
      else resolve();
    };
    const timer = setTimeout(() => finish(new Error('OSC: délai d’envoi dépassé')), 2000);
    socket.once('error', finish);
    socket.send(packet, port, address, finish);
  });
}
