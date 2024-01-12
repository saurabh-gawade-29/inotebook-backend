const mongoose = require("mongoose");

//TODO: If your connection is refused by machine then replace localhost by 127.0.0.1
const mongoURL =
  "mongodb+srv://saurabh:Saurabh%4029@cluster0.b0i77ix.mongodb.net/?retryWrites=true";

const connectToMongo = async () => {
  try {
    await mongoose
      .connect(mongoURL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => console.log("connected"));
  } catch (error) {
    console.log(error, "Error in DB.JS");
  }
};

module.exports = connectToMongo;
