import fetch from 'node-fetch';
import * as db from '../modules/db.mjs'; // Replace "your-mysql-module" with the actual module name containing the createTorrent function
import peersDHT from '../modules/peers.mjs';

const apiUrl = 'https://apibay.org/precompiled/data_top100_recent.json';

function fetchDataAndPerformAction() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Loop through each data item and perform your action
      data.forEach(async item => {
        const existingTorrent = await db.createTorrent(item.name, `magnet:?xt=urn:btih:${item.info_hash}`, "nop");
  
        if (existingTorrent == "nop") {
          console.log('Torrent with this magnet already exists in the database.');
        } else {
          await peersDHT(existingTorrent, item.info_hash, false);
        }
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Initial fetch and action
fetchDataAndPerformAction();

// Schedule to fetch and perform action every 15 minutes (900000 milliseconds)
setInterval(fetchDataAndPerformAction, 900000);
