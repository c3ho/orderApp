const express = require("express");
const cors = require("cors")
const path = require("path")
const { port } = require("./config")
const { db } = require("./db");
const app = express();


app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "../../frontend/build/index.html"))
});

GET("/menu/find/:id", (req) => db.items.findById(req.params.id));

GET("/menu/all", () => db.items.all());

POST("/menu/add", (req) => db.items.add(req.body));

function POST(url, handler) {
  app.post(url, async (req, res) => {
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
