import * as db from '../modules/db.mjs';
import DHT from 'bittorrent-dht';
import blake from 'blakejs';
import cool from 'magnet-uri';
import geoip from 'geoip-lite';
import net from 'net';

const availablePorts = Array.from({ length: 65535 }, (_, i) => i + 1);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isPortAvailable(port) {
  return new Promise(async (resolve) => {
    const server = net.createServer();
    server.on('error', () => {
      resolve(false);
    });
    server.listen(port, async () => {
      server.close(() => {
        resolve(true);
      });
    });
    // Add a random delay between 1 and 5 seconds before resolving the promise
    const randomDelay = Math.floor(Math.random() * 5000) + 1000;
    await delay(randomDelay);
  });
}

export async function getRandomAvailablePort() {
  const minPort = 100;
  const maxPort = 65535;
  const range = maxPort - minPort + 1;

  // Generate a random port within the desired range
  const randomPort = Math.floor(Math.random() * range) + minPort;

  // Check if the random port is available
  const isAvailable = await isPortAvailable(randomPort);
  if (isAvailable) {
    return randomPort;
  }

  // If the random port is not available, try finding another available port
  for (let i = 0; i < availablePorts.length; i++) {
    const port = availablePorts[i];
    const isAvailable = await isPortAvailable(port);
    if (isAvailable) {
      return port;
    }
  }

  throw new Error('Failed to find an available port.');
}

export default async function bittorrentDHT(id, magnet, type) {
  try {
    const port = await getRandomAvailablePort();
    const dht = new DHT();
    dht.listen(port, function () {
      console.log(`DHT listening on port ${port}`);
    });

    dht.on('peer', async function (peer, infoHash, from) {
      try {
        var geo = await geoip.lookup(peer.host);
        let country;
        if (geo && geo.country) {
          country = geo.country;
        } else {
          country = 'nop';
        }

        await db.createPeer(peer.host, id, blake.blake2bHex(`${peer.host}for${magnet}`), country);
      } catch (error) {
        console.error('Error looking up geo information:', error.message);
      }
    });

    // find peers for the given torrent info hash
    let tHash;
    if (type == true) {
      tHash = cool(magnet).infoHash;
      console.log('#111');
    } else {
      tHash = magnet;
      console.log('#222');
    }
    dht.lookup(tHash);
  } catch (error) {
    console.error('Error creating DHT:', error.message);
  }
}
