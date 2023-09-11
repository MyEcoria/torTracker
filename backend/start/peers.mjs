// Importez les modules nécessaires ici...
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

// Définissez une fonction pour démarrer le processus de traitement des torrents et effectuer les actions nécessaires
async function startProcess() {
  await processAllTorrents();
  console.log('Torrent processing restarted.');

  // Redémarrez le traitement des torrents toutes les 20 minutes (1200000 ms)
  setInterval(async () => {
    await processAllTorrents();
    console.log('Torrent processing restarted.');
  }, 300000);
}

// Appelez la fonction startProcess pour lancer le processus
startProcess();
