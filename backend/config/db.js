const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async (app, port, uri) => {
  try {
    //connection to mongoDB
    mongoose.connect(uri);

    console.log("connected to mongoDB");
    //Starting server
    app.listen(port, () => console.log(`Server is running on port:` + port));
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMongoDB;
