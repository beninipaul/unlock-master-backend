const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const dbConnect = require("./src/config/mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(multer().single("image"));

const PORT = process.env.SERVER_PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is running");
});

dbConnect(process.env.MONGODB_CONNECTION_STRING);
