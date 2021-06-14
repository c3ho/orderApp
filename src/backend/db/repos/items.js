const { items: sql } = require("../sql");

const cs = {};

class ItemsRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
    createColumnsets(pgp);
  }

  async add(id, name, chinese, price, category, enabled) {
    return this.db.one(sql.add, id, name, chinese, price, category, enabled);
  }

  async remove(id) {
    return this.db.result(
      "DELETE FROM menu where id = $1",
      +id,
      (r) => r.rowCount
    );
  }

  async findById(id) {
    return this.db.oneOrNone("Select * FROM menu where id = $1", +id);
  }

  async all() {
    return this.db.any("SELECT * FROM menu where enabled = $1", true);
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
