import express from 'express';
const { Request, Response } = express;
import * as db from '../modules/db.mjs';
import { param, validationResult } from 'express-validator';
import * as torr from '../modules/getTorrent.mjs';
import peersDHT from '../modules/peers.mjs';
import config from '../config/general.json' assert { type: 'json' };
import rateLimit from 'express-rate-limit';
import cacheService from 'express-api-cache';
import cors from 'cors';


var cache = cacheService.cache;

// Créer une instance d'Express
const app = express();

app.set('trust proxy', 1);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



// Middleware de validation pour vérifier si 'ip' est une adresse IP valide
const validateIP = param('ip').isIP();

// Définir un port pour le serveur
const PORT = config.port;

// Middleware pour le parsing du corps des requêtes en JSON
app.use(express.json());
app.use(limiter);
app.use(cors({ origin: 'https://tortracker.myecoria.com' }));

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

app.get('/info/torrents', cache("10 minutes"), async (req, res) => {
    // Vérifier les erreurs de validation et renvoyer une réponse d'erreur si nécessaire
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
  
    const numbers = await db.getNumberOfTorrents();
    return res.send({ numbers });
});

app.get('/info/peers', cache("10 minutes"), async (req, res) => {
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

app.get('/torrent/:id', async (req, res) => {
  
  // Récupérer le paramètre userId depuis l'URL
  const id = req.params.id;

  // Vérifier si le paramètre userId est présent
  if (!id) {
    return res.status(400).json({ error: 'Paramètre "id" manquant.' });
  }

  const informations = await db.getTorrentInfo(id);
  return res.json(informations);
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur le port ${PORT}`);
});
