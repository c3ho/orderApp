const { items: sql } = require("../sql");

const cs = {};

class ItemsRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
    createColumnsets(pgp);
  }

  async add(props) {
    console.log(props)
    try {
      const {id, name, chinese, price, category, enabled} = props
      if (!(id, name, chinese, price, category, enabled)) {
        throw "One of the required fields are empty!"
      }
      // fix this so we use sql file
      // await this.db.none(sql.add, [id, name, chinese, price, category, enabled]);
      await this.db.none("INSERT INTO menu(id, name, chinese, price, category, enabled) VALUES($1, $2, $3, $4, $5, $6)", [id, name, chinese, price, category, enabled
      ]);
    } catch (err) {
      console.log(err)
    }
  }

  // basically same as add, can we change this?
  // see https://stackoverflow.com/questions/47306155/update-prepared-statement-with-object for alternative for update
  async update(props) {
    try {
      const {id, name, chinese, price, category, enabled} = props
      if (!(id, name, chinese, price, category, enabled) || Object.values(props.includes(""))) {
        throw "One of the required fields are empty!"
      }

      // fix this so we use sql file
      // await this.db.none(sql.add, [id, name, chinese, price, category, enabled]);
      await this.db.none("UPDATE menu SET(id, name, chinese, price, category, enabled) VALUES($1, $2, $3, $4, $5, $6) WHERE id = $1", [id, name, chinese, price, category, enabled
      ]);
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

  async findById(id) {
    return this.db.oneOrNone("SELECT * FROM menu where id = $1", id);
  }

  async all() {
    // return this.db.any("SELECT * FROM menu where enabled = $1", true);
    return this.db.any(sql.find)
  }
}

function createColumnsets(pgp) {
  // create all ColumnSet objects only once:
  if (!cs.insert) {
    // Type TableName is useful when schema isn't default "public" ,
    // otherwise you can just pass in a string for the table name.
    const table = new pgp.helpers.TableName({
      table: "items",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(["name"], { table });
    cs.update = cs.insert.extend(["?id"]);
  }
  return cs;
}

module.exports = ItemsRepository;
