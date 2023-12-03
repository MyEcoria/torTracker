import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const currentFileURL = import.meta.url;
const currentFilePath = fileURLToPath(currentFileURL);
const currentDirPath = dirname(currentFilePath);

const dbFilePath = resolve(currentDirPath, '../tortracker.db'); // Replace 'your_database_file.db' with your desired file name

let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.error('Error initializing database:', err.message);
        reject(err);
      } else {
        createTorrentsTable()
          .then(() => createPeersTable())
          .then(() => {
            createLatestTable()
              .then(() => {
                //console.log('Database initialized successfully.');
                //listAllTables();
                resolve();
              })
          })
          .catch((err) => {
            console.error('Error creating tables:', err.message);
            reject(err);
          });
      }
    });
  });
}

function createTorrentsTable() {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS torrents (
        id INTEGER PRIMARY KEY,
        name TEXT,
        magnet TEXT,
        img TEXT
      );
    `, (err) => {
      if (err) {
        console.error('Error creating torrents table:', err.message);
        reject(err);
      } else {
        //console.log('Torrents table created successfully.');
        resolve();
      }
    });
  });
}

function createPeersTable() {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS peers (
        id INTEGER PRIMARY KEY,
        ip TEXT,
        id_torrent INTEGER,
        date TEXT
      );
    `, (err) => {
      if (err) {
        console.error('Error creating peers table:', err.message);
        reject(err);
      } else {
        //console.log('Peers table created successfully.');
        resolve();
      }
    });
  });
}

function createLatestTable() {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS latest (
        magnet TEXT PRIMARY KEY,
        date TEXT
      );
    `, (err) => {
      if (err) {
        console.error('Error creating latest table:', err.message);
        reject(err);
      } else {
        //console.log('Latest table created successfully.');
        resolve();
      }
    });
  });
}

initializeDatabase().catch((err) => {
  process.exit(1); // Exit the process if there's an error initializing the database
});

// Function to list all tables in the database
function listAllTables() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name";
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          //console.log("List of tables in the database:");
          rows.forEach((row) => {
            console.log(row.name);
          });
          resolve();
        }
      });
    });
}


// Function to create a new torrent entry in the database
export function createTorrent(name, magnet, img) {
  return new Promise((resolve, reject) => {
    // Check if the magnet already exists in the database
    getTorrentByMagnet(magnet)
      .then((existingTorrent) => {
        if (existingTorrent) {
          //console.log('Torrent with this magnet already exists in the database.');
          resolve("nop");
        } else {
          const sql = 'INSERT INTO torrents (name, magnet, img) VALUES (?, ?, ?)';
          db.run(sql, [name, magnet, img], function (err) {
            if (err) {
              console.error('Error creating torrent:', err.message);
              reject(err);
            } else {
              //console.log('Torrent created successfully with ID:', this.lastID);
              resolve(this.lastID);
            }
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function createPeer(ip, idTorrent) {
  return new Promise((resolve, reject) => {
    // Check if the IP and idTorrent combination already exists in the database
    const checkQuery = 'SELECT COUNT(*) AS count FROM peers WHERE ip = ? AND id_torrent = ?';
    db.get(checkQuery, [ip, idTorrent], (checkErr, row) => {
      if (checkErr) {
        console.error('Error checking peer existence:', checkErr.message);
        reject(checkErr);
        return;
      }

      if (row.count > 0) {
        // An entry with the same IP and idTorrent combination already exists
        const errorMessage = 'Peer with the same IP and idTorrent already exists';
        console.error(errorMessage);
        reject(new Error(errorMessage));
        return "444";
      } else {
        // If the combination is unique, proceed with the insertion
        const date = new Date().toISOString(); // Get the current date and time as a string
        const sql = 'INSERT INTO peers (ip, id_torrent, date) VALUES (?, ?, ?)';
        db.run(sql, [ip, idTorrent, date], function (insertErr) {
          if (insertErr) {
            console.error('Error creating peer:', insertErr.message);
            reject(insertErr);
          } else {
            resolve(this.lastID);
          }
        });
      }
    });
  });
}


// Function to get a torrent by magnet from the database
export function getTorrentByMagnet(magnet) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM torrents WHERE magnet = ?';
    db.get(sql, [magnet], (err, row) => {
      if (err) {
        console.error('Error fetching torrent by magnet:', err.message);
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

// Function to retrieve all magnets from the database
export function getAllMagnets() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, magnet FROM torrents';
    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Error retrieving magnets:', err.message);
        reject(err);
      } else {
        resolve(rows.map((row) => ({ id: row.id, magnet: row.magnet })));
      }
    });
  });
}

// Function to get a peer by IP from the database
export function getPeerByIP(ip) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM peers WHERE ip = ?';
    db.get(sql, [ip], (err, row) => {
      if (err) {
        console.error('Error fetching peer by IP:', err.message);
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

// Function to get the number of torrents in the database
export function getNumberOfTorrents() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) as count FROM torrents';
    db.get(sql, (err, result) => {
      if (err) {
        console.error('Error fetching the number of torrents:', err.message);
        reject(err);
      } else {
        const numberOfTorrents = result.count || 0;
        resolve(numberOfTorrents);
      }
    });
  });
}

// Function to get the number of peers in the database
export function getNumberOfPeers() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) as count FROM peers';
    db.get(sql, (err, result) => {
      if (err) {
        console.error('Error fetching the number of peers:', err.message);
        reject(err);
      } else {
        const numberOfPeers = result.count || 0;
        resolve(numberOfPeers);
      }
    });
  });
}

// Function to close the database connection
export function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        reject(err);
      } else {
        console.log('Database connection closed.');
        resolve();
      }
    });
  });
}

// Function to get a peer by IP from the database
export function getTorrentInfo(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM torrents WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Error fetching peer by IP:', err.message);
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

// Function to get a peer by IP from the database
export function getTorrentInfoByMagnet(magnet) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM torrents WHERE magnet = ?';
    db.get(sql, [magnet], (err, row) => {
      if (err) {
        console.error('Error fetching peer by IP:', err.message);
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

export function updateLatestData(magnet) {
  return new Promise((resolve, reject) => {
    const date = new Date().toISOString();
    const sql = 'INSERT OR REPLACE INTO latest (magnet, date) VALUES (?, ?)';
    db.run(sql, [magnet, date], function (err) {
      if (err) {
        console.error('Error updating latest data:', err.message);
        reject(err);
      } else {
        console.log('Latest data updated successfully for magnet:', magnet);
        resolve();
      }
    });
  });
}


// Function to retrieve all magnets from the database
export function getAllLatest() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT magnet, date FROM latest';
    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Error retrieving magnets:', err.message);
        reject(err);
      } else {
        resolve(rows.map((row) => ({ magnet: row.magnet, date: row.date })));
      }
    });
  });
}
