import express from 'express';
const { Request, Response } = express;
import * as db from '../modules/db.mjs';
import { param, validationResult } from 'express-validator';
import * as torr from '../modules/getTorrent.mjs';
import peersDHT from '../modules/peers.mjs';
import config from '../config/general.json' assert { type: 'json' };

// Créer une instance d'Express
const app = express();

// Middleware de validation pour vérifier si 'ip' est une adresse IP valide
const validateIP = param('ip').isIP();

// Définir un port pour le serveur
const PORT = 3000;

// Middleware pour le parsing du corps des requêtes en JSON
app.use(express.json());

// Route GET avec un paramètre
app.get('/ip/:ip', validateIP, async (req, res) => {
    // Vérifier les erreurs de validation et renvoyer une réponse d'erreur si nécessaire
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    // Récupérer le paramètre userId depuis l'URL
    const ip = req.params.ip;
  
    // Vérifier si le paramètre userId est présent
    if (!ip) {
      return res.status(400).json({ error: 'Paramètre "ip" manquant.' });
    }
  
    const informations = await db.getPeerByIP(ip);
    return res.json({ informations });
});

app.get('/info/torrents', async (req, res) => {
    // Vérifier les erreurs de validation et renvoyer une réponse d'erreur si nécessaire
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
  
    const numbers = await db.getNumberOfTorrents();
    return res.send({ numbers });
});

app.get('/info/peers', async (req, res) => {
    // Vérifier les erreurs de validation et renvoyer une réponse d'erreur si nécessaire
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
  
    const numbers = await db.getNumberOfPeers();
    return res.send({ numbers });
});

app.get('/add/:id', async (req, res) => {

  // Récupérer le paramètre userId depuis l'URL
  const id = req.params.id;

  const torrentInfo = await torr.getTorrentInfo(`${config.torrent911Id}${id}`);
  const existingTorrent = await db.createTorrent(torrentInfo.name, torrentInfo.magnetLink, torrentInfo.image);
  
  if (existingTorrent == "nop") {
    console.log('Torrent with this magnet already exists in the database.');
  } else {
    await peersDHT(existingTorrent, torrentInfo.magnetLink);
  }
  return res.send("ok");
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur le port ${PORT}`);
});
