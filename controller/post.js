const {
  createTable,
  insertRecord,
  updateRecord,
  viewRecords,
  deleteRecord,
  deleteMultipleRows,
  insertMultiRecords,
} = require("../models/post");
const { register, login } = require("../models/auth");

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
    const result = await register(data);
    console.log(">>>>>>>>>>>>>>>>>>", result);
    result
      ? res.status(200).json({ message: "Registration successfully", result })
      : res.status(500).json({ message: "Failed to register" });
  } catch (err) {}
};

const userLogin = async (req, res) => {
  try {
    const data = req.body;
    const result = await login(data, res);
    console.log("controller>>", result);
    result
      ? res.status(200).json({ message: "User logged in successfully", result })
      : res.status(500).json({ message: "Enter Correct Passoword" });
  } catch (err) {}
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
};
