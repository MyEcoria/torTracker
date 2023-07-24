import mysql from 'mysql2/promise';

// Configuration for your MySQL connection
const dbConfig = {
    host: '51.38.224.98',
    user: 'myecoria',
    password: 'prout',
    database: 'tor',
};

// Function to create a new torrent entry in the database
export async function createTorrent(name, magnet, img) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Check if the magnet already exists in the database
    const existingTorrent = await getTorrentByMagnet(connection, magnet);

    if (existingTorrent) {
      console.log('Torrent with this magnet already exists in the database.');
      connection.end();
      return;
    }

    const sql = 'INSERT INTO torrents (name, magnet, img) VALUES (?, ?, ?)';
    const [result] = await connection.execute(sql, [name, magnet, img]);
    console.log('Torrent created successfully with ID:', result.insertId);
    connection.end();
  } catch (error) {
    console.error('Error creating torrent:', error.message);
  }
}

// Function to create a new peer entry in the database
export async function createPeer(ip, idTorrent, hash, ipCountry) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const date = new Date(); // Get the current date and time
    console.log(idTorrent);
    const sql = 'INSERT INTO peers (ip, id_torrent, hash, date, ipCountry) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.execute(sql, [ip, idTorrent, hash, date, ipCountry]);
    console.log('Peer created successfully with ID:', result.insertId);
    connection.end();
  } catch (error) {
    console.error('Error creating peer:', error.message);
  }
}

// Function to get a torrent by magnet from the database
export async function getTorrentByMagnet(connection, magnet) {
  try {
    const sql = 'SELECT * FROM torrents WHERE magnet = ?';
    const [rows] = await connection.execute(sql, [magnet]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching torrent by magnet:', error.message);
    return null;
  }
}

// Function to retrieve all magnets from the database
export async function getAllMagnets() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT id, magnet FROM torrents');
    connection.end();
    return rows.map((row) => ({ id: row.id, magnet: row.magnet }));
  } catch (error) {
    console.error('Error retrieving magnets:', error.message);
    return [];
  }
}

// Function to get a peer by IP from the database
export async function getPeerByIP(ip) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const sql = 'SELECT * FROM peers WHERE ip = ?';
    const [rows] = await connection.execute(sql, [ip]);
    connection.end();
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching peer by IP:', error.message);
    return null;
  }
}

// Function to get the number of torrents in the database
export async function getNumberOfTorrents() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('SELECT COUNT(*) as count FROM torrents');
    connection.end();
    const numberOfTorrents = result[0]?.count || 0;
    return numberOfTorrents;
  } catch (error) {
    console.error('Error fetching the number of torrents:', error.message);
    return 0;
  }
}

// Function to get the number of torrents in the database
export async function getNumberOfPeers() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('SELECT COUNT(*) as count FROM peers');
    connection.end();
    const numberOfTorrents = result[0]?.count || 0;
    return numberOfTorrents;
  } catch (error) {
    console.error('Error fetching the number of peers:', error.message);
    return 0;
  }
}

