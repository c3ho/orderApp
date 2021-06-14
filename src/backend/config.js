const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  db_url: process.env.DATABASE_URL,
};
