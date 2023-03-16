require ("dotenv").config();
const pg = require("pg");

const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost:5432/streaming-site");

module.exports = {
  client
}