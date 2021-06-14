const express = require("express");
const { db } = require("./db");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello");
});

GET("/menu/find/:id", (req) => db.items.findById(req.params.id));

GET("/menu/all", (req) => db.items.all());

PUT("/menu/add", (req) => db.items.add(req.body));

function PUT(url, handler) {
  app.put(url, async (req, res) => {
    try {
      const { id, name, chinese, price, category, enabled } = req.body;
      const data = await handler(id, name, chinese, price, category, enabled);
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      res.json({
        success: false,
        error: err.message || err,
      });
    }
  });
}

function GET(url, handler) {
  app.get(url, async (req, res) => {
    try {
      const data = await handler(req);
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      res.json({
        success: false,
        error: err.message || err,
      });
    }
  });
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
