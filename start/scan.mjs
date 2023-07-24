import Parser from 'rss-parser';
const parser = new Parser();
import * as db from '../modules/db.mjs'; // Replace "your-mysql-module" with the actual module name containing the createTorrent function
import * as torr from '../modules/getTorrent.mjs';

// Fonction pour extraire et traiter les nouvelles données du flux RSS
async function processNewData(item) {
  const torrentInfo = await torr.getTorrentInfo(item.link);
  const existingTorrent = await db.createTorrent(item.title, torrentInfo.magnetLink, torrentInfo.image);
  if (existingTorrent) {
    console.log('Torrent with this magnet already exists in the database.');
  }
}

// Fonction pour scanner le flux RSS et extraire les nouvelles données
async function scanRssFeed(rssUrl) {
  try {
    const feed = await parser.parseURL(rssUrl);

    // Vérifier si le flux contient des articles
    if (!feed.items || feed.items.length === 0) {
      console.log('Le flux ne contient pas d\'articles.');
      return;
    }

    // Traiter les nouvelles données
    for (const item of feed.items) {
      // Vous pouvez comparer ici les données avec celles déjà enregistrées dans la base de données
      await processNewData(item);
    }
  } catch (error) {
    console.error('Erreur lors de l\'analyse du flux RSS:', error.message);
  }
}

// Lien du flux RSS que vous souhaitez scanner
const rssUrl = 'https://www.torrent911.me/rss';

// Interval de temps (en millisecondes) pour scanner le flux (par exemple, toutes les 5 minutes)
const intervalTime = 5 * 60 * 1000;

// Lancer le scan initial
scanRssFeed(rssUrl);

// Exécuter le scan périodiquement à l'intervalle spécifié
setInterval(() => {
  scanRssFeed(rssUrl);
}, intervalTime);
