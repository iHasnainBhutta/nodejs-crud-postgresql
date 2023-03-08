const bcrypt = require("bcryptjs");
const client = require("../config/dbConnection");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const { token } = require("morgan");
const { viewSpecificRec } = require("../models/post");

const register = async (data, res) => {
  const { email, password, token } = data;
  //   console.log(">model", data);
  try {
    const result = await client().query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );
    // console.log(">verifying", result);
    const arr = result.rows;
    if (arr.length != 0) {
      console.log("if body");
      return res.status(500).json({ message: "Email already exist!" });
    } else {
      console.log("else body");
      bcrypt.hash(password, 15, (err, hash) => {
        if (err) {
          console.log("bcrypt if body");
          // console.log("if in else  ", err);
          return "Server Error";
        }
        console.log("After bcrypt body");
        const user = {
          email,
          password: hash,
          token,
        };
        // var flag = false;
        const result = client().query(
          `INSERT INTO users (email, password, token) VALUES ($1, $2, $3);`,
          [user.email, user.password, user.token]
        );
        if (result) {
          res
            .status(200)
            .json({ message: "Registration successfully", result });
        } else {
          res.status(500).json({ message: "Failed to register" });
        }
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
      const { user_id, verified } = user[0];
      console.log(
        ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   !!!",
        verified
      );
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
        console.log("token in jWT", token);
        // const id = await viewSpecificRec(email);
        // console.log(id)
        // const { user_id, verified } = id;
        // console.log("Newwwwwww", user_id, verified);

        const updateToken = client().query(
          `UPDATE users SET token = $1 WHERE user_id = $2`,
          [token, user_id],
          (err) => {
            if (err) {
              console.log(err);
            } else {
              return true;
            }
          }
        );
        // const verified = await client().query(
        //   `SELECT verified FROM users WHERE email = $1;`,
        //   [email]
        // );
        // const arr = verified.rows[0].verified;

        // console.log(">>", arr);
        return { token: token, verified: verified, id: user_id };
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

// const VerifyEmail = async (data) => {
//   const { email } = data;

//   try {
//     const result = await client().query(
//       `SELECT * FROM users WHERE email = $1;`,
//       [email]
//     );

//     const arr = result.rows;
//     if (arr.length != 0) {
//       return true;
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };

module.exports = { register, login };
