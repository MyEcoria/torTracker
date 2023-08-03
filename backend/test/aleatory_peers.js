const sqlite3 = require('sqlite3').verbose();

// Remplacez 'ma_base_de_donnees.db' par le nom de votre base de données SQLite
const db = new sqlite3.Database('../tortracker.db');

// Fonction pour récupérer l'adresse IP la plus fréquente dans la table 'peers'
function getMostFrequentIP(callback) {
  db.get('SELECT ip, COUNT(ip) AS count FROM peers GROUP BY ip ORDER BY count DESC LIMIT 1;', (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'adresse IP la plus fréquente :', err.message);
      return callback(err, null);
    }

    if (!row) {
      console.log('Aucune adresse IP trouvée dans la table peers.');
      return callback(null, null);
    }

    const mostFrequentIP = row.ip;

    callback(null, mostFrequentIP);
  });
}

// Appel de la fonction pour récupérer l'adresse IP la plus fréquente
getMostFrequentIP((err, ip) => {
  if (err) {
    // Gérer l'erreur, si nécessaire
  } else {
    if (ip) {
      console.log('Adresse IP la plus fréquente :', ip);
    }
  }

  // Fermez la connexion à la base de données lorsque vous avez terminé
  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données :', err.message);
    } else {
      console.log('Base de données fermée avec succès.');
    }
  });
});
