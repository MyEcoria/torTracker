import * as db from '../modules/db.mjs';
import DHT from 'bittorrent-dht';
import blake from 'blakejs';
import cool from 'magnet-uri';
import geoip from 'geoip-lite';

export function getRandomNumberBetween(min, max) {
  // Generate a random number between 0 (inclusive) and 1 (exclusive)
  const randomFraction = Math.random();

  // Calculate the range between the minimum and maximum values
  const range = max - min;

  // Calculate the random number within the desired range
  const randomNumber = Math.floor(randomFraction * range) + min;

  return randomNumber;
}

export default async function bittorrentDHT(id, magnet) {
  const port = getRandomNumberBetween(2000, 6000);
  const dht = new DHT();
  dht.listen(port, function () {
    console.log(`DHT listening on port ${port}`);
  });

  dht.on('peer', async function (peer, infoHash, from) {
    try {
      var geo = await geoip.lookup(peer.host);
      console.log(peer.host);
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
}