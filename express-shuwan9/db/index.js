const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(path.join(__dirname, "./db.json"));
// const adapter = new FileSync(path.join(__dirname, "../../tmp/db.json"));
const db = low(adapter);

module.exports = db;
