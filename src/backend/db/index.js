const pgPromise = require("pg-promise");
const dbConfig = require("../config");
const { Items, Users } = require("./repos");
const { pgUser, pgPassword, pgHost, pgPort, pgDatabase } = require("../config");

const MAX_RETRIES = 5

const initOptions = {
  extend(obj, dc) {
    obj.items = new Items(obj, pgp);
    obj.users = new Users(obj, pgp);
  },
};

const pgp = pgPromise(initOptions);

const cn = {
  user: pgUser,
  password: pgPassword,
  host: pgHost,
  port: pgPort,
  database: pgDatabase,
};

//const db = pgp("postgres://postgres:postgres@localhost:5432/restaurant");
const db = pgp(cn);

let retries = 0;

function connect() {
  db.connect()
  .then((obj) => {
    // Can check the server version here (pg-promise v10.1.0+):
    const serverVersion = obj.client.serverVersion;

    obj.done(); // success, release the connection;
    console.log("Successfully connected to PostgreSQL!")
  })
  .catch((error) => {
    console.log("ERROR:", error.message || error);
    if (retries < MAX_RETRIES) {
      retries++;
      console.log(`Failed to connect to PostgreSQL, retrying again after 5s, retry #${retries}`)
      setTimeout(() => connect(), 5000)
    }
  });
}

connect()

module.exports = { db, pgp };
