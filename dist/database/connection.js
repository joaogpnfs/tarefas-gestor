"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = getDatabase;
exports.closeDatabase = closeDatabase;
const schema_1 = require("./schema");
let db = null;
function getDatabase() {
    if (!db) {
        db = (0, schema_1.initializeDatabase)();
    }
    return db;
}
function closeDatabase() {
    if (db) {
        db.close();
        db = null;
    }
}
