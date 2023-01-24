const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
const dbConnect = (CONNECTION_STRING) => {
  return mongoose.connect(CONNECTION_STRING, { maxPoolSize: 10 }, (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  });
};

module.exports = dbConnect;
