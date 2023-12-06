const express = require('express');
const path = require('path');
const app = express();

// Serve les fichiers statiques depuis le dossier build
app.use(express.static(path.join(__dirname, 'build')));

// Gère toutes les autres routes en renvoyant le fichier index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Écoute sur le port 3000 (ou le port de votre choix)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});