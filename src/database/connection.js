const { initializeDatabase } = require('./schema');

let db = null;

function getDatabase() {
  if (!db) {
    db = initializeDatabase();
  }
  return db;
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDatabase, closeDatabase };
