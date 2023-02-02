const {
  createTable,
  insertRecord,
  updateRecord,
  viewRecords,
  deleteRecord,
} = require("../models/post");

const createUsersTable = async (req, res) => {
  try {
    await createTable();
    res.status(200).json({ message: "Users table created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create users table" });
  }
};
const insertUserRecord = async (req, res) => {
  try {
    const data = req.body;
    const result = await insertRecord(data);

    res.status(200).json({ message: "Data inserted successfully", result });
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

module.exports = {
  createUsersTable,
  insertUserRecord,
  updateUserRecord,
  viewAllRecords,
  deleteRec,
};
