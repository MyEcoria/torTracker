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
  for (const port of availablePorts) {
    const isAvailable = await isPortAvailable(port);
    if (isAvailable) {
      return port;
    }
  }
  throw new Error('Failed to find an available port.');
}

export default async function bittorrentDHT(id, magnet) {
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
    const parsed = cool(magnet);
    dht.lookup(parsed.infoHash);
  } catch (error) {
    console.error('Error creating DHT:', error.message);
  }
}
