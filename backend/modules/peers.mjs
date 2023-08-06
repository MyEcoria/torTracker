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
    const availablePorts = [];
  
    // Generate a random port within the desired range
    const randomPort = Math.floor(Math.random() * range) + minPort;
  
    // Check if the random port is available
    const isAvailable = await isPortAvailable(randomPort);
    if (isAvailable) {
      // Wait for 3 seconds before retesting the port to make sure it's stable
      await delay(3000);
      const isStable = await isPortAvailable(randomPort);
      if (isStable) {
        return randomPort;
      }
    }
  
    // If the random port is not available or not stable, try finding another available port
    for (let port = minPort; port <= maxPort; port++) {
      const isAvailable = await isPortAvailable(port);
      if (isAvailable) {
        // Wait for 3 seconds before retesting the port to make sure it's stable
        await delay(3000);
        const isStable = await isPortAvailable(port);
        if (isStable) {
          return port;
        }
      }
    }
  
    throw new Error('Failed to find an available and stable port.');
}

export default async function bittorrentDHT(id, magnet, type) {
  try {
    const port = await getRandomAvailablePort();
    const dht = new DHT();
    dht.listen(); // Le port sera choisi automatiquement par le système d'exploitation

    dht.on('listening', function () {
      console.log(`DHT listening on port ${dht.address().port}`);
    });

    dht.on('peer', async function (peer, infoHash, from) {
      try {
        //db.updateLatestData(magnet);
        var geo = await geoip.lookup(peer.host);
        let country;
        if (geo && geo.country) {
          country = geo.country;
        } else {
          country = 'nop';
        }

        const registerID = await db.createPeer(peer.host, id, blake.blake2bHex(`${peer.host}for${magnet}`), country);
        console.log("+------------------------------------------------------+");
        console.log('\x1b[34m%s\x1b[0m', `New Peer: ${registerID}`) // registerID en bleu
        console.log('\x1b[37m%s\x1b[0m', `of \x1b[0m${peer.host}`); // peer.host en blanc
        console.log('\x1b[31m%s\x1b[0m', `from ${magnet}`); // magnet en rouge
      } catch (error) {
        console.error('Error looking up geo information:', error.message);
      }
    });

    // find peers for the given torrent info hash
    let tHash;
    if (type == true) {
      tHash = cool(magnet).infoHash;
    } else {
      tHash = magnet;
    }
    dht.lookup(tHash);
  } catch (error) {
    console.error('Error creating DHT:', error.message);
  }
}
