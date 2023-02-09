const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("./src/config/mongodb");
require("dotenv").config();
const roleRoutes = require("./src/routes/role.routes");

const app = express();

//Register some middlewares
app.use(express.json());
app.use(bodyParser.json());

//Register the different routes
app.use("/v1", roleRoutes);

//Define ports number
const PORT = process.env.SERVER_PORT || 4000;

//Get connected to the database
dbConnect(process.env.MONGODB_CONNECTION_STRING);

//Launch the server
app.listen(PORT, () => {
  console.log("Server is running");
});
