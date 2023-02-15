const {
  createTable,
  insertRecord,
  updateRecord,
  viewRecords,
  deleteRecord,
  deleteMultipleRows,
  insertMultiRecords,
  viewSpecificRec,
} = require("../models/post");
const { register, login } = require("../models/auth");
const DBConnect = require("../config/dbConnection");
const { sendEmail } = require("../helperFunctions/email");

const createUsersTable = async (req, res) => {
  try {
    await createTable();
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

const deleteRec = async (req, res) => {
  try {
    const id = req.params.id;
    const result = deleteRecord(id);
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
    // console.log(">>>>>>>>>>>>>>>>>>", verifyEmail);
    result
      ? res.status(200).json({ message: "Registration successfully", result })
      : res.status(500).json({ message: "Failed to register" });
  } catch (err) {}
};

const userLogin = async (req, res) => {
  try {
    const data = req.body;
    const { email } = req.body;
    const result = await login(data, res);
    const { token, verified, id } = result;
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!", result);
    if (!verified && token) {
      const message = `${process.env.BASE_URL}user/verify/${id}/${token}`;
      await sendEmail(email, "Verify Email", message);

      res.send("An Email sent to your account please verify");
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
      console.log(">>", result)
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
};
