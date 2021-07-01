const dotenv = require("dotenv");
const path = require('path')
dotenv.config({path: path.resolve(`${__dirname}/../../.env`)});

// Exports all .env vars used in backend
module.exports = {
  db_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  pgPort: process.env.PG_PORT,
  pgUser: process.env.PG_USER,
  pgHost: process.env.PG_HOST,
  pgPassword: process.env.PG_PASSWORD,
  pgDatabase: process.env.PG_DATABASE,
  env: process.env.APP_MODE,
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
};
