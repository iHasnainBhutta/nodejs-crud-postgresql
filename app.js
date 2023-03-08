require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const DBConnect = require("./config/dbConnection");
app.use(bodyParser.json());
const cors = require("cors");

const postRoutes = require("./routes/post");

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(morgan("dev"));
app.use("/user", cors(corsOptions), postRoutes);
DBConnect();

// app.use(cors());

// const corsOptions = {
//   credentials: true,
//   optionSuccessStatus: 200,
//   origin: "*",
//   allowedHeaders: "*",
//   allowedHeaders: [
//     "Access-Control-Allow-Headers",
//     "Access-Control-Allow-Origin",
//     "Content-Type",
//     "access-control-allow-origin",
//   ],
// };
// app.use(cors(corsOptions));

const port = process.env.PORT || 8008;
app.listen(port, () => {
  console.log(`A Node Js API is listening on port: ${port}`);
});
