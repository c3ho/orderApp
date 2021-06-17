const pgPromise = require("pg-promise");
const dbConfig = require("../config");
const { Items } = require("./repos");
const { pgUser, pgPassword, pgHost, pgPort, pgDatabase } = require("../config");

const initOptions = {
  extend(obj, dc) {
    obj.items = new Items(obj, pgp);
  },
};

const pgp = pgPromise(initOptions);
// const db = pgp(db_url);

// const cn = {
//   user: "postgres",
//   password: "postgres",
//   host: "localhost",
//   port: 5432,
//   database: "restaurant",
// };

const cn = {
  user: pgUser,
  password: pgPassword,
  host: pgHost,
  port: pgPort,
  database: pgDatabase,
};

//const db = pgp("postgres://postgres:postgres@localhost:5432/restaurant");
const db = pgp(cn);

db.connect()
  .then((obj) => {
    // Can check the server version here (pg-promise v10.1.0+):
    const serverVersion = obj.client.serverVersion;

    obj.done(); // success, release the connection;
  })
  .catch((error) => {
    console.log("ERROR:", error.message || error);
  });



module.exports = { db, pgp };
