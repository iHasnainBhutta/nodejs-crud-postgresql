// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const client = require("../config/dbConnection");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const { token } = require("morgan");

const register = async (data) => {
  const { email, password } = data;
  //   console.log(">model", data);
  try {
    const result = await client().query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );
    // console.log(">verifying", result);
    const arr = result.rows;
    if (arr.length != 0) {
      return true;
    } else {
      bcrypt.hash(password, 15, (err, hash) => {
        if (err) {
          console.log("if in else  ", err);
          return "Server Error";
        }
        const user = {
          email,
          password: hash,
        };
        var flag = 1;
        const res = client().query(
          `INSERT INTO users (email, password) VALUES ($1, $2);`,
          [user.email, user.password],
          (err) => {
            if (err) {
              console.log(err);
            } else {
              return true;
            }
          }
        );
        return res ? true : false;
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const login = async (data, res) => {
  const { email, password } = data;
  try {
    const result = await client().query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );
    const user = result.rows;
    if (user.length === 0) {
      return res.status(400).json({
        error: "User is not registered, Sign Up first",
      });
    } else {
      const result = await bcrypt.compare(password, user[0].password); // console.log("bcrypt>>", result);

      if (!result) {
        res.status(500).json("Invalid Password or Server Error..");
      } else if (result === true) {
        const token = jwt.sign(
          {
            email: email,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1H",
          }
        );
        return token;
      } else {
        if (result != true) {
          res.status(400).json({
            err: "Enter correct password",
          });
        }
      }
    }
  } catch (err) {}
};

module.exports = { register, login };
