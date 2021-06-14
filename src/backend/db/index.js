const pgPromise = require("pg-promise");
const dbConfig = require("../config");
const { Items } = require("./repos");
// const { db_url } = require("../config");

const initOptions = {
  extend(obj, dc) {
    obj.items = new Items(obj, pgp);
  },
};

const pgp = pgPromise(initOptions);
// const db = pgp(db_url);

const cn = {
  host: "db",
  port: 5432,
  database: "restaurant",
  user: "postgres",
};

const db = pgp("postgres://postgres:postgres123@db:5432/restaurant");

db.connect()
  .then((obj) => {
    // Can check the server version here (pg-promise v10.1.0+):
    const serverVersion = obj.client.serverVersion;

    obj.done(); // success, release the connection;
  })
  .catch((error) => {
    console.log("ERROR:", error.message || error);
  });

// const db = pgp("postgres://postgres:postgres@db:5432/restaurant");

module.exports = { db, pgp };
