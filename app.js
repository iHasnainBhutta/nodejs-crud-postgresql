require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const DBConnect = require("./config/dbConnection");
app.use(bodyParser.json());

const postRoutes = require("./routes/post");

app.use(morgan("dev"));
app.use("/user", postRoutes);
DBConnect();

const port = process.env.PORT || 8008;
app.listen(port, () => {
  console.log(`A Node Js API is listening on port: ${port}`);
});
