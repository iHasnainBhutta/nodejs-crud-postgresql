const {
  createTable,
  insertRecord,
  updateRecord,
  viewRecords,
  deleteRecord,
  deleteMultipleRows,
  insertMultiRecords,
  viewSpecificRec,
  filterByEmail,
  filterByToken,
  createTableForProduct,
  insertProduct,
  viewProduct,
  deleteProduct,
} = require("../models/post");
const { register, login } = require("../models/auth");
const DBConnect = require("../config/dbConnection");
const { sendEmail } = require("../helperFunctions/email");
const { FileHandler } = require("../helperFunctions/fileUpload");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createUsersTable = async (req, res) => {
  try {
    await createTable();
    res.status(200).json({ message: "table created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create table" });
  }
};
const createProductTable = async (req, res) => {
  try {
    await createTableForProduct();
    res.status(200).json({ message: "table created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create table" });
  }
};
const insertUserRecord = async (req, res) => {
  try {
    const data = req.body;
    const result = await insertRecord(data);
    result
      ? res.status(200).json({ message: "Data inserted successfully", result })
      : res.status(500).json({ message: "Failed to insert data" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to insert data" });
  }
};
const insertNewProduct = async (req, res) => {
  try {
    // console.log(">>>>>>> file", req.file);
    const { originalname } = req.file;
    const data = req.body;
    const result = await insertProduct(data, originalname);
    result
      ? res
          .status(200)
          .json({ message: "Product inserted successfully", result })
      : res.status(500).json({ message: "Failed to insert product" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to insert data" });
  }
};
const updateUserRecord = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const result = await updateRecord(id, name);
    result
      ? res.status(200).json({ message: "Record updated successfully", result })
      : res.status(500).json({ message: "Record not found" });
  } catch (error) {
    console.error(error);
  }
};

const viewAllRecords = async (req, res) => {
  try {
    const result = await viewRecords();
    // console.log(result);
    result
      ? res.status(200).json({ message: "All Records:", result })
      : res.status(500).json({ message: "Record not found" });
  } catch (error) {}
};
const viewAllProduct = async (req, res) => {
  try {
    const result = await viewProduct();
    // console.log(result);
    result
      ? res.status(200).json({ message: "All Records:", result })
      : res.status(500).json({ message: "Record not found" });
  } catch (error) {}
};

const deleteRec = async (req, res) => {
  try {
    const id = req.params.id;
    const result = deleteRecord(id);
    result
      ? res.status(200).json({ message: "Record deleted" })
      : res.status(500).json({ message: "Record not found" });
  } catch (error) {}
};

const deleteProductByID = async (req, res) => {
  try {
    const id = req.params.id;
    const result = deleteProduct(id);
    result
      ? res.status(200).json({ message: "Record deleted" })
      : res.status(500).json({ message: "Record not found" });
  } catch (error) {}
};

const deleteMultiRows = async (req, res) => {
  try {
    const ids = req.body;
    const result = deleteMultipleRows(ids);
    result
      ? res.status(200).json({ message: "Selected Records deleted" })
      : res.status(500).json({ message: "Records not found" });
  } catch (error) {
    console.error(error);
  }
};

const insertMultiRec = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const result = await insertMultiRecords(data);
    result
      ? res.status(200).json({ message: "Data inserted successfully", result })
      : res.status(500).json({ message: "Failed to insert data" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to insert data" });
  }
};

const userRegister = async (req, res) => {
  try {
    const data = req.body;
    console.log(">>>>", data);
    const result = await register(data, res);
    // console.log(">>>>>>>>>>>>>>>>>>", result);
    // result
  } catch (err) {
    console.error(err);
  }
};

const userLogin = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const { email } = req.body;
    const result = await login(data, res);
    const { token, verified, id } = result;
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!", result);
    if (!verified && token) {
      const message = `${process.env.BASE_URL}user/verify/${id}/${token}`;
      await sendEmail(email, "Verify Email", message);
      res.status(200).json({
        message: "An Email sent to your account please verify",
        result,
      });
      console.log("After everything", temp);
    } else {
      if (token && verified) {
        res
          .status(200)
          .json({ message: "User logged in successfully", result });
      } else {
        res.status(500).json({ message: "Enter Correct Passoword" });
      }
    }
  } catch (err) {}
};

const emailVerify = async (req, res) => {
  try {
    const { id, token } = req.params;
    const user = await viewSpecificRec(id);
    const DBtoken_ = user.token;
    // console.log("verify :", EMtoken);
    // if (!user) return res.status(400).send("Invalid link");

    if (DBtoken_ == token) {
      const query_ = `UPDATE users SET verified = true WHERE user_id = '${id}'`;
      const result = await DBConnect().query(query_);
      console.log(">>", result);
      await res.status(200).json({ message: "email verified sucessfully" });
      // console.log("OKk");
    } else {
      return res.status(400).send("Invalid link");
    }
    // const token = await Token.findOne({
    //   userId: user._id,
    //   token: req.params.token,
    // });
    // if (!token) return res.status(400).send("Invalid link");
    // await User.updateOne({ _id: user._id, verified: true });
    // await Token.findByIdAndRemove(token._id);
    // res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await filterByEmail(email);
    console.log(user.user_id);
    if (!user) {
      res.status(404).json({ error: "Invalid email" });
    } else {
      // otherwise we need to create a temporary token that expires in 10 mins
      const resetLink = jwt.sign({ user: user.email }, process.env.JWT_KEY, {
        expiresIn: "10m",
      });
      const updateToken = DBConnect().query(
        `UPDATE users SET token = $1 WHERE user_id = $2`,
        [resetLink, user.user_id],
        (err) => {
          if (err) {
            console.log(err);
          } else {
            return true;
          }
        }
      );

      const message = {
        URL: `${process.env.LOCAL_URL}reset-password/${user.user_id}/${resetLink}`,
        msg: `<h4>If you want to reset your password then please </h4>`,
      };

      // update resetLink property to be the temporary token and then send email
      await sendEmail(user.email, "Reset password requested", message);
      res.status(200).json({ message: "Check your email" });
    }
  } catch (err) {
    console.error(err);
  }
};

const updatePassword = async (req, res) => {
  const resetLink = req.params.token;
  // const newPassword = req.body;

  if (resetLink) {
    jwt.verify(resetLink, process.env.JWT_KEY, (error, decodedToken) => {
      if (error) {
        res.status().json({ message: "Incorrect token or expired" });
      } else {
        // Token is valid, access decoded payload

        console.log(decoded);
      }
    });
  }

  try {
    const user = await filterByToken(resetLink);
    // console.log(user.user_id);
    if (!user) {
      res
        .status(400)
        .json({ message: "We could not find a match for this link" });
    }

    // const hashPassword = bcrypt.hashSync(newPassword.password, 8);
    // newPassword.password = hashPassword;

    // // update user credentials and remove the temporary link from database before saving
    // const updatedCredentials = {
    //   password: newPassword.password,
    //   resetLink: null,
    // };

    // console.log(">", hashPassword);
    // // await update(user.id, updatedCredentials);
    // res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.error(error);
  }
};

const updatePass = async (req, res) => {
  const newPassword = req.body;
  const id = req.params.id;

  // console.log(newPassword, id);

  try {
    const hashPassword = bcrypt.hashSync(newPassword.password, 8);
    newPassword.password = hashPassword;

    // update user credentials and remove the temporary link from database before saving
    const updatedCredentials = {
      password: newPassword.password,
      resetLink: null,
    };

    // console.log(">", newPassword.password);
    const updateToken = DBConnect().query(
      `UPDATE users SET password = $1 WHERE user_id = $2`,
      [newPassword.password, id],
      (err) => {
        if (err) {
          console.log(err);
        } else {
          return true;
        }
      }
    );
    // await update(user.id, updatedCredentials);
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
  }
};

const uploadFile = async (req, res) => {
  res.status(200).json({ message: "Image Uploaded" });
};

module.exports = {
  createUsersTable,
  insertUserRecord,
  updateUserRecord,
  viewAllRecords,
  deleteRec,
  deleteMultiRows,
  insertMultiRec,
  userRegister,
  userLogin,
  emailVerify,
  forgetPassword,
  updatePassword,
  updatePass,
  createProductTable,
  insertNewProduct,
  viewAllProduct,
  deleteProductByID,
  uploadFile,
};
