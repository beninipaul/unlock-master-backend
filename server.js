const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("./src/config/mongodb");
const cors = require('cors')
require("dotenv").config();
const roleRoutes = require("./src/routes/role.routes");
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const serviceRoutes = require("./src/routes/service.routes");

const app = express();

//Register some middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Register the different routes
app.use("/v1", roleRoutes);
app.use("/v1", authRoutes);
app.use("/v1", userRoutes);
app.use("/v1", serviceRoutes);

//Define ports number
const PORT = process.env.SERVER_PORT || 4000;

//Get connected to the database
dbConnect(process.env.MONGODB_CONNECTION_STRING);

//Launch the server
app.listen(PORT, () => {
  console.log("Server is running");
});
