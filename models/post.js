const DBConnect = require("../config/dbConnection");

// create table (create)
const createTable = async () => {
  try {
    // const quers = `CREATE TABLE IF NOT EXISTS users (user_id SERIAL, name text COLLATE pg_catalog."default" NOT NULL, email text COLLATE pg_catalog."default" NOT NULL, phone text COLLATE pg_catalog."default" NOT NULL, password text COLLATE pg_catalog."default" NOT NULL, CONSTRAINT users_pkey PRIMARY KEY (user_id));`;
    const quers = `CREATE TABLE IF NOT EXISTS users (user_id SERIAL, email text COLLATE pg_catalog."default" NOT NULL, password text NOT NULL, CONSTRAINT users_pkey PRIMARY KEY (user_id));`;
    // console.log(DBConnect());
    const table = await DBConnect().query(quers);
    console.log("Table created successfully", table);
  } catch (error) {
    console.error(error.message);
  }
};
// insert row (create)
const insertRecord = async (data) => {
  try {
    const { user_id, name, age, phone } = data;
    const query_ =
      "INSERT INTO customers (user_id, name, age, phone) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [user_id, name, age, phone];
    const res = await DBConnect().query(query_, values);
    // console.log("Customer record inserted successfully", res);
    return res ? true : false;
  } catch (error) {
    console.error(error.message);
  }
};

//update row
const updateRecord = async (id, name) => {
  try {
    const fetchAllIds = `SELECT user_id FROM customers WHERE user_id = ${id}`;
    const temp = await DBConnect().query(fetchAllIds);
    const id_ = temp.rows[0].user_id;

    if (id_ === id) {
      const query_ = `UPDATE customers SET name = '${name}' WHERE user_id = ${id}`;
      const res = await DBConnect().query(query_);
      return res;
    } else {
      return false;
    }
    // console.log(temp);
  } catch (error) {
    console.error(error.message);
  }
};

// View all records
const viewRecords = async () => {
  try {
    const query = "SELECT * FROM customers";

    const result = await DBConnect().query(query);
    // console.log(result.rows);
    return result ? result.rows : false;
  } catch (error) {
    console.error(error.message);
  }
};

//delete single record
const deleteRecord = async (id) => {
  try {
    const query_ = `DELETE FROM customers WHERE user_id = ${id}`;
    const result = DBConnect().query(query_);
    return result ? true : false;
  } catch (error) {
    console.error(error.message);
  }
};

//delete multiple rows
const deleteMultipleRows = async (ids) => {
  try {
    const { userIds } = ids;
    const delQuery = `DELETE FROM customers WHERE user_id = ANY($1)`;
    const result = DBConnect().query(delQuery, [userIds]);
    result ? true : false;
  } catch (error) {
    console.error(error.message);
  }
};

// insert multi rows/records
const insertMultiRecords = async (data) => {
  try {
    const { params } = data;
    const result = params.map((params) => {
      const query_ =
        "INSERT INTO customers (user_id, name, age, phone) VALUES ($1, $2, $3, $4) RETURNING *";
      const values = [params.user_id, params.name, params.age, params.phone];

      const res = DBConnect().query(query_, values);
      return res;
    });
    return result ? true : false;
  } catch (error) {}
};

module.exports = {
  createTable,
  insertRecord,
  updateRecord,
  viewRecords,
  deleteRecord,
  deleteMultipleRows,
  insertMultiRecords,
};
