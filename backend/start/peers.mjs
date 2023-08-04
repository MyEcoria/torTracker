import * as db from '../modules/db.mjs';
import peersDHT from '../modules/peers.mjs';

// Function to perform an action for each torrent
async function processAllTorrents() {
  try {
    const torrents = await db.getAllMagnets();

    // Check if there are any torrents in the database
    if (torrents.length === 0) {
      console.log('No torrents found in the database.');
      return;
    }

    // Process each torrent concurrently using Promise.all
    await Promise.all(
      torrents.map(async (torrent) => {
        //console.log('Processing torrent with ID:', torrent.id);
        await peersDHT(torrent.id, torrent.magnet, true);
      })
    );
  } catch (error) {
    console.error('Error processing torrents:', error.message);
  }
}

// Start processing all torrents
processAllTorrents();
