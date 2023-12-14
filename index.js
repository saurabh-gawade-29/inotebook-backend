// We make connection to mongo in this file
const connectToMongo = require("./db");
const express = require("express");

connectToMongo();
const app = express();
const port = 5000;

//! usecase: Returns middleware that only parses json and only looks at requests where the Content-Type header matches the
app.use(express.json());

//! Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
