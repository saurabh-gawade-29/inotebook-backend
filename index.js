// We make connection to mongo in this file
const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();
const app = express();
const port = 5000;

//! if you ger CORS Error install this package - npm i cors
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome CelestialScribe");
});

//! Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
