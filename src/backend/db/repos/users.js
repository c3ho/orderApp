// const { users: sql } = require("../sql");

const cs = {};
const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT_ROUNDS || 10

class UsersRepository {

  async hash(password) {
    return bcrypt.hash(password, saltRounds)
  }

  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
    createColumnsets(pgp);
  }

  async add(props) {
    try {
      const {id, password} = props
      if (!(id, password)) {
        throw "One of the required fields are empty!"
      }
      // fix this so we use sql file
      // await this.db.none(sql.add, [id, name, chinese, price, category, enabled]);
      const accountType = "admin"
      const hashedPassword = await this.hash(password)
      // console.log(hashedPassword)
      await this.db.none("INSERT INTO users(id, password, account_type) VALUES($1, $2, $3)", [id, hashedPassword, accountType]);
    } catch (err) {
      console.log(err)
    }
  }

  // basically same as add, can we change this?
  // see https://stackoverflow.com/questions/47306155/update-prepared-statement-with-object for alternative for update
  async update(props) {
    try {
      const {id, password, type} = props
      if (!(id, password, type) || Object.values(props.includes(""))) {
        throw "One of the required fields are empty!"
      }
      const hashedPassword = await this.hash(password)
      // fix this so we use sql file
      // await this.db.none(sql.add, [id, name, chinese, price, category, enabled]);
      await this.db.none("UPDATE menu SET(id, password, type) VALUES($1, $2, $3) WHERE id = $1", [id, hashedPassword, type]);
    } catch (err) {
      console.log(err)
    }
  }

  async remove(id) {
    return this.db.result(
      "DELETE FROM menu where id = $1",
      +id,
      (r) => r.rowCount
    );
  }

  async login(props) {
    try {
      const {id, password} = props
      if (!(id, password)) {
        throw "One of the required fields are empty!"
      }
      const lookup = await this.db.oneOrNone("SELECT * FROM users where id = $1", id)
      const res = await bcrypt.compare(password, lookup.password)
      if (res) {
          return { id: lookup.id, role: lookup.account_type }
      }
      return false
    } catch (err) {
      console.log(err)
    }
  }

  async findById(id) {
    try {
      if (!(id)) {
        throw "Id field is empty!"
      }
      const lookup = await this.db.oneOrNone("SELECT id FROM users where id = $1", id)
      if (lookup) {
          return lookup
      }
      return false
    } catch (err) {
      console.log(err)
    }
  }

  async getAccountInfo(id) {
    try {
      if (!(id)) {
        throw "Id field is empty!"
      }
      const lookup = await this.db.oneOrNone("SELECT id, account_type FROM users where id = $1", id)
      if (lookup) {
          return lookup
      }
      return false
    } catch (err) {
      console.log(err)
    }
  }
}

function createColumnsets(pgp) {
  // create all ColumnSet objects only once:
  if (!cs.insert) {
    // Type TableName is useful when schema isn't default "public" ,
    // otherwise you can just pass in a string for the table name.
    const table = new pgp.helpers.TableName({
      table: "users",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(["name"], { table });
    cs.update = cs.insert.extend(["?id"]);
  }
  return cs;
}

module.exports = UsersRepository;
