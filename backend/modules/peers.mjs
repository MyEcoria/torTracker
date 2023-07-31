import * as db from '../modules/db.mjs';
import DHT from 'bittorrent-dht';
import blake from 'blakejs';
import cool from 'magnet-uri';
import geoip from 'geoip-lite';
import net from 'net';

const availablePorts = Array.from({ length: 65535 }, (_, i) => i + 1);

async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.on('error', () => {
      resolve(false);
    });
    server.listen(port, () => {
      server.close(() => {
        resolve(true);
      });
    });
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

  // If the random port is not available, try the next available port in sequence
  for (let port = minPort; port <= maxPort; port++) {
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
          country = "nop";
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
      console.log("#111");
    } else {
      tHash = magnet;
      console.log("#222");
    }
    dht.lookup(tHash);
  } catch (error) {
    console.error('Error creating DHT:', error.message);
  }
}
