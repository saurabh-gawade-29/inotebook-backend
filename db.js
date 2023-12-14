const mongoose = require("mongoose");

//TODO: If your connection is refused by machine then replace localhost by 127.0.0.1
const mongoURL = "mongodb://127.0.0.1:27017/iNotebook";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURL);
  } catch (error) {
    console.log(error, "Error in DB.JS");
  }
};

module.exports = connectToMongo;
